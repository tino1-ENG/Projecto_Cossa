import express from 'express';
import {
  User,
  Auction,
  Product,
  Bid,
  Watchlist,
  Order,
  Payment,
  Delivery,
  Notification,
  getNextSequence
} from '../models/index.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

// GET /api/v1/buyer/dashboard — Metrics summary
router.get('/dashboard', async (req, res) => {
  const userId = req.user.id;

  try {
    // 1. User Balance from MongoDB
    const userDoc = await User.findOne({ id: userId }).lean();
    const balance = userDoc ? userDoc.balance : (req.user.balance || 0);

    // 2. Total bids placed
    const totalBidsCount = await Bid.countDocuments({ bidder_id: userId });

    // 3. Winning auctions where user is currently leading
    const winningAuctionsDocs = await Auction.find({ status: 'active', winner_id: userId }).lean();
    const winningAuctions = await Promise.all(winningAuctionsDocs.map(async (a) => {
      const prod = await Product.findOne({ id: a.product_id }).lean();
      return {
        id: a.id,
        current_price: a.current_price,
        ends_at: a.ends_at,
        title: prod?.title || `Lote #${a.id}`,
        primary_image: prod?.images?.find(i => i.is_primary)?.image_url || '/images/products/porsche-911-gt3rs.jpg'
      };
    }));

    // 4. Outbid auctions
    const userBidAuctionIds = await Bid.distinct('auction_id', { bidder_id: userId });
    const outbidDocs = await Auction.find({
      id: { $in: userBidAuctionIds },
      status: 'active',
      winner_id: { $ne: userId }
    }).lean();

    const outbidAuctions = await Promise.all(outbidDocs.map(async (a) => {
      const prod = await Product.findOne({ id: a.product_id }).lean();
      const highestUserBid = await Bid.findOne({ auction_id: a.id, bidder_id: userId }).sort({ amount: -1 }).lean();
      return {
        id: a.id,
        current_price: a.current_price,
        ends_at: a.ends_at,
        title: prod?.title || `Lote #${a.id}`,
        my_highest_bid: highestUserBid?.amount || 0,
        primary_image: prod?.images?.find(i => i.is_primary)?.image_url || '/images/products/porsche-911-gt3rs.jpg'
      };
    }));

    // 5. Won auctions
    const wonDocs = await Auction.find({
      winner_id: userId,
      status: { $in: ['ended', 'sold', 'awaiting_payment'] }
    }).lean();

    const wonAuctions = await Promise.all(wonDocs.map(async (a) => {
      const prod = await Product.findOne({ id: a.product_id }).lean();
      const order = await Order.findOne({ auction_id: a.id, buyer_id: userId }).lean();
      return {
        id: a.id,
        current_price: a.current_price,
        ends_at: a.ends_at,
        title: prod?.title || `Lote #${a.id}`,
        order_id: order?.id || 101,
        order_status: order?.status || 'pending_payment',
        primary_image: prod?.images?.find(i => i.is_primary)?.image_url || '/images/products/porsche-911-gt3rs.jpg'
      };
    }));

    // 6. Watchlist count
    const watchlistCount = await Watchlist.countDocuments({ user_id: userId });

    return res.json({
      metrics: {
        totalBids: totalBidsCount,
        winningCount: winningAuctions.length,
        outbidCount: outbidAuctions.length,
        wonCount: wonAuctions.length,
        watchlistCount,
        balance
      },
      winningAuctions,
      outbidAuctions,
      recentWonAuctions: wonAuctions
    });
  } catch (err) {
    console.error('Buyer dashboard error:', err);
    return res.status(500).json({ message: 'Erro ao carregar painel do comprador', error: err.message });
  }
});

// GET /api/v1/buyer/bids — Full bids history
router.get('/bids', async (req, res) => {
  const userId = req.user.id;

  try {
    const bids = await Bid.find({ bidder_id: userId }).sort({ created_at: -1 }).lean();

    const result = await Promise.all(bids.map(async (b) => {
      const auction = await Auction.findOne({ id: b.auction_id }).lean();
      const prod = auction ? await Product.findOne({ id: auction.product_id }).lean() : null;

      let bid_state = 'lost';
      if (auction?.status === 'active' && auction?.winner_id === userId) {
        bid_state = 'leading';
      } else if (auction?.status === 'active' && auction?.winner_id !== userId) {
        bid_state = 'outbid';
      } else if (['sold', 'ended', 'awaiting_payment'].includes(auction?.status || '') && auction?.winner_id === userId) {
        bid_state = 'won';
      }

      return {
        bid_id: b.id,
        amount: b.amount,
        bid_time: b.created_at,
        is_auto: b.is_auto,
        auction_id: b.auction_id,
        auction_status: auction?.status || 'active',
        current_price: auction?.current_price || b.amount,
        ends_at: auction?.ends_at,
        winner_id: auction?.winner_id,
        title: prod?.title || `Lote #${b.auction_id}`,
        brand: prod?.brand || 'Original',
        model: prod?.model || '',
        primary_image: prod?.images?.find(i => i.is_primary)?.image_url || '/images/products/porsche-911-gt3rs.jpg',
        bid_state
      };
    }));

    return res.json(result);
  } catch (err) {
    console.error('Buyer bids error:', err);
    return res.status(500).json({ message: 'Erro ao listar licitações', error: err.message });
  }
});

// GET /api/v1/buyer/watchlist
router.get('/watchlist', async (req, res) => {
  const userId = req.user.id;

  try {
    const items = await Watchlist.find({ user_id: userId }).sort({ created_at: -1 }).lean();

    const result = await Promise.all(items.map(async (w) => {
      const auction = await Auction.findOne({ id: w.auction_id }).lean();
      const prod = auction ? await Product.findOne({ id: auction.product_id }).lean() : null;

      return {
        watchlist_id: w.id || 1,
        added_at: w.created_at,
        id: auction?.id,
        status: auction?.status,
        current_price: auction?.current_price,
        bid_increment: auction?.bid_increment,
        bid_count: auction?.bid_count,
        ends_at: auction?.ends_at,
        title: prod?.title || `Lote #${w.auction_id}`,
        brand: prod?.brand,
        model: prod?.model,
        location_city: prod?.location_city,
        primary_image: prod?.images?.find(i => i.is_primary)?.image_url || '/images/products/porsche-911-gt3rs.jpg'
      };
    }));

    return res.json(result);
  } catch (err) {
    console.error('Watchlist fetch error:', err);
    return res.status(500).json({ message: 'Erro ao carregar favoritos', error: err.message });
  }
});

// POST /api/v1/buyer/watchlist/:auctionId
router.post('/watchlist/:auctionId', async (req, res) => {
  const userId = req.user.id;
  const auctionId = parseInt(req.params.auctionId);

  try {
    await Watchlist.findOneAndUpdate(
      { user_id: userId, auction_id: auctionId },
      { user_id: userId, auction_id: auctionId },
      { upsert: true, new: true }
    );

    return res.json({ message: 'Adicionado aos favoritos com sucesso', is_watchlisted: true });
  } catch (err) {
    return res.status(500).json({ message: 'Erro ao guardar favorito', error: err.message });
  }
});

// DELETE /api/v1/buyer/watchlist/:auctionId
router.delete('/watchlist/:auctionId', async (req, res) => {
  const userId = req.user.id;
  const auctionId = parseInt(req.params.auctionId);

  try {
    await Watchlist.deleteOne({ user_id: userId, auction_id: auctionId });

    return res.json({ message: 'Removido dos favoritos', is_watchlisted: false });
  } catch (err) {
    return res.status(500).json({ message: 'Erro ao remover favorito', error: err.message });
  }
});

// GET /api/v1/buyer/wins
router.get('/wins', async (req, res) => {
  const userId = req.user.id;

  try {
    const auctions = await Auction.find({
      winner_id: userId,
      status: { $in: ['ended', 'sold', 'awaiting_payment'] }
    }).sort({ ends_at: -1 }).lean();

    const wins = await Promise.all(auctions.map(async (a) => {
      const prod = await Product.findOne({ id: a.product_id }).lean();
      const seller = await User.findOne({ id: a.seller_id }).lean();
      const order = await Order.findOne({ auction_id: a.id, buyer_id: userId }).lean();
      const payment = order ? await Payment.findOne({ order_id: order.id }).lean() : null;
      const delivery = order ? await Delivery.findOne({ order_id: order.id }).lean() : null;

      const city = prod?.location_city || 'Maputo';
      const province = prod?.location_province || 'Maputo Cidade';
      const pickupAddress = delivery?.address || `Armazém Fiduciário MozBid / Entreposto Aduaneiro, ${city}, ${province}`;
      const pickupCode = delivery?.tracking_number || `MZB-REC-${String(a.id).padStart(4, '0')}-${String(userId).padStart(4, '0')}`;

      return {
        auction_id: a.id,
        current_price: a.current_price,
        ends_at: a.ends_at,
        auction_status: a.status,
        title: prod?.title || `Lote #${a.id}`,
        location_city: city,
        location_province: province,
        seller_name: seller?.company_name || seller?.name || 'Consignador Verificado',
        seller_phone: seller?.phone || '+258 84 100 2000',
        order_id: order?.id,
        order_status: order?.status || 'pending_payment',
        total_amount: order?.total_amount || a.current_price,
        payment_status: payment?.status || (order?.status === 'paid' ? 'completed' : 'pending'),
        payment_method: payment?.method || 'm-pesa',
        delivery_status: delivery?.status || 'processing',
        tracking_number: pickupCode,
        pickup_address: pickupAddress,
        pickup_code: pickupCode,
        primary_image: prod?.images?.find(i => i.is_primary)?.image_url || '/images/products/porsche-911-gt3rs.jpg'
      };
    }));

    return res.json(wins);
  } catch (err) {
    console.error('Wins error:', err);
    return res.status(500).json({ message: 'Erro ao listar leilões ganhos', error: err.message });
  }
});

// GET /api/v1/buyer/notifications
router.get('/notifications', async (req, res) => {
  const userId = req.user.id;

  try {
    const notifications = await Notification.find({ user_id: userId })
      .sort({ created_at: -1 })
      .limit(30)
      .lean();

    return res.json(notifications);
  } catch (err) {
    return res.status(500).json({ message: 'Erro ao carregar notificações', error: err.message });
  }
});

// PATCH /api/v1/buyer/notifications/:id/read
router.patch('/notifications/:id/read', async (req, res) => {
  const userId = req.user.id;
  const id = parseInt(req.params.id);

  try {
    await Notification.updateOne({ id, user_id: userId }, { is_read: true });
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// PATCH /api/v1/buyer/notifications/read-all
router.patch('/notifications/read-all', async (req, res) => {
  const userId = req.user.id;
  try {
    await Notification.updateMany({ user_id: userId }, { is_read: true });
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/v1/buyer/deposit — Escrow balance deposit simulation
router.post('/deposit', async (req, res) => {
  const userId = req.user.id;
  const { amount, method, phone, reference } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Montante inválido para depósito.' });
  }

  try {
    // 1. Increment balance in MongoDB
    const updatedUser = await User.findOneAndUpdate(
      { id: userId },
      { $inc: { balance: amount } },
      { new: true }
    ).lean();

    const refCode = reference || `DEP-${Date.now().toString().slice(-6)}`;

    // Create Notification in MongoDB
    await Notification.create({
      id: await getNextSequence('notifications'),
      user_id: userId,
      title: 'Caução Fiduciária Confirmada',
      message: `Depósito de ${(amount / 100).toLocaleString('pt-MZ')} MZN processado com sucesso via ${method || 'M-Pesa'} (Ref: ${refCode}).`,
      type: 'payment_received',
      link: '/buyer/dashboard'
    });

    return res.json({
      success: true,
      message: 'Depósito em Escrow confirmado com sucesso!',
      reference: refCode,
      newBalance: updatedUser.balance
    });
  } catch (err) {
    console.error('Deposit error:', err);
    return res.status(500).json({ error: 'Erro ao processar depósito de garantia.' });
  }
});

export default router;
