import express from 'express';
import {
  User,
  Category,
  Product,
  Auction,
  Bid,
  Order,
  Delivery,
  AuditLog,
  getNextSequence
} from '../models/index.js';
import { queryOne, queryAll, execute, runTransaction } from '../database/db.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);
router.use(requireRole(['seller', 'admin']));

// GET /api/v1/seller/dashboard — Metrics & KPIs
router.get('/dashboard', async (req, res) => {
  const sellerId = req.user.id;

  try {
    const userDoc = await User.findOne({ id: sellerId }).lean();
    const activeAuctions = await Auction.countDocuments({ seller_id: sellerId, status: 'active' });

    // Total sales revenue from completed/paid orders
    const completedOrders = await Order.find({ seller_id: sellerId, status: { $in: ['paid', 'completed'] } }).lean();
    const totalSalesRevenue = completedOrders.reduce((sum, o) => sum + o.total_amount, 0);

    // Total bids received on seller's auctions
    const sellerAuctionIds = await Auction.distinct('id', { seller_id: sellerId });
    const totalBidsReceived = await Bid.countDocuments({ auction_id: { $in: sellerAuctionIds } });

    // Recent orders
    const recentOrdersDocs = await Order.find({ seller_id: sellerId }).sort({ created_at: -1 }).limit(5).lean();
    const recentOrders = await Promise.all(recentOrdersDocs.map(async (o) => {
      const auction = await Auction.findOne({ id: o.auction_id }).lean();
      const product = auction ? await Product.findOne({ id: auction.product_id }).lean() : null;
      const buyer = await User.findOne({ id: o.buyer_id }).lean();
      return {
        id: o.id,
        total_amount: o.total_amount,
        status: o.status,
        created_at: o.created_at,
        buyer_name: buyer?.name || 'Comprador Verificado',
        product_title: product?.title || `Lote #${o.auction_id}`
      };
    }));

    return res.json({
      metrics: {
        activeAuctions,
        totalSalesRevenue,
        totalBidsReceived,
        rating: userDoc?.rating || 4.98
      },
      recentOrders
    });
  } catch (err) {
    console.error('Seller dashboard error:', err);
    return res.status(500).json({ message: 'Erro ao carregar dados do vendedor', error: err.message });
  }
});

// GET /api/v1/seller/auctions — List all seller's auctions
router.get('/auctions', async (req, res) => {
  const sellerId = req.user.id;

  try {
    const auctions = await Auction.find({ seller_id: sellerId }).sort({ created_at: -1 }).lean();

    const result = await Promise.all(auctions.map(async (a) => {
      const prod = await Product.findOne({ id: a.product_id }).lean();
      const highestBid = await Bid.findOne({ auction_id: a.id }).sort({ amount: -1 }).lean();
      const winner = a.winner_id ? await User.findOne({ id: a.winner_id }).lean() : null;

      return {
        id: a.id,
        current_price: a.current_price,
        bid_count: a.bid_count,
        ends_at: a.ends_at,
        status: a.status,
        title: prod?.title || `Lote #${a.id}`,
        location_city: prod?.location_city,
        primary_image: prod?.images?.find(i => i.is_primary)?.image_url || '/images/products/porsche-911-gt3rs.jpg',
        highest_bidder_name: winner?.name || highestBid?.bidder_name || (a.bid_count > 0 ? 'Licitador Verificado' : 'Sem lances')
      };
    }));

    return res.json(result);
  } catch (err) {
    console.error('Seller auctions error:', err);
    return res.status(500).json({ message: 'Erro ao listar leilões do vendedor', error: err.message });
  }
});

// GET /api/v1/seller/products — List all seller's registered products
router.get('/products', async (req, res) => {
  const sellerId = req.user.id;

  try {
    const products = await Product.find({ seller_id: sellerId }).sort({ created_at: -1 }).lean();

    const result = await Promise.all(products.map(async (p) => {
      const category = await Category.findOne({ id: p.category_id }).lean();
      const auction = await Auction.findOne({ product_id: p.id }).lean();

      return {
        id: p.id,
        title: p.title,
        brand: p.brand,
        model: p.model,
        year: p.year,
        condition: p.condition,
        location_city: p.location_city,
        category_name: category?.name || 'Geral',
        auction_id: auction?.id,
        auction_status: auction?.status,
        primary_image: p.images?.find(i => i.is_primary)?.image_url || '/images/products/porsche-911-gt3rs.jpg'
      };
    }));

    return res.json(result);
  } catch (err) {
    console.error('Seller products error:', err);
    return res.status(500).json({ message: 'Erro ao listar produtos do vendedor', error: err.message });
  }
});

// GET /api/v1/seller/orders — List sales orders and deliveries
router.get('/orders', async (req, res) => {
  const sellerId = req.user.id;

  try {
    const orders = await Order.find({ seller_id: sellerId }).sort({ created_at: -1 }).lean();

    const result = await Promise.all(orders.map(async (o) => {
      const auction = await Auction.findOne({ id: o.auction_id }).lean();
      const prod = auction ? await Product.findOne({ id: auction.product_id }).lean() : null;
      const buyer = await User.findOne({ id: o.buyer_id }).lean();
      const delivery = await Delivery.findOne({ order_id: o.id }).lean();

      return {
        id: o.id,
        auction_id: o.auction_id,
        total_amount: o.total_amount,
        status: o.status,
        created_at: o.created_at,
        buyer_name: buyer?.name || 'Comprador Verificado',
        buyer_phone: buyer?.phone,
        title: prod?.title || `Lote #${o.auction_id}`,
        primary_image: prod?.images?.find(i => i.is_primary)?.image_url || '/images/products/porsche-911-gt3rs.jpg',
        delivery_status: delivery?.status || 'processing',
        tracking_number: delivery?.tracking_number
      };
    }));

    return res.json(result);
  } catch (err) {
    console.error('Seller orders error:', err);
    return res.status(500).json({ message: 'Erro ao listar encomendas', error: err.message });
  }
});

// POST /api/v1/seller/auctions — 5-Step Wizard Lot Creation
router.post('/auctions', async (req, res) => {
  const sellerId = req.user.id;
  const {
    title,
    categoryId,
    condition = 'used_good',
    brand,
    model,
    year = 2023,
    locationProvince = 'Maputo Cidade',
    locationCity = 'Maputo',
    description,
    images = [],
    startingPrice,
    reservePrice,
    bidIncrement = 2500000,
    durationDays = 7,
    deliveryTerms
  } = req.body;

  if (!title || !categoryId || !startingPrice) {
    return res.status(400).json({ message: 'Título, categoria e preço inicial são obrigatórios' });
  }

  try {
    const productId = await getNextSequence('products');
    const auctionId = await getNextSequence('auctions');

    const formattedImages = (images && images.length > 0)
      ? images.map((url, idx) => ({ image_url: url, is_primary: idx === 0, display_order: idx }))
      : [{ image_url: '/images/products/porsche-911-gt3rs.jpg', is_primary: true, display_order: 0 }];

    // 1. Create Product in MongoDB
    await Product.create({
      id: productId,
      seller_id: sellerId,
      category_id: parseInt(categoryId),
      title,
      description: description || '',
      brand: brand || 'Original',
      model: model || '',
      year: parseInt(year) || 2023,
      condition,
      location_province: locationProvince,
      location_city: locationCity,
      images: formattedImages
    });

    // 2. Create Auction in MongoDB
    const now = new Date();
    const endsAt = new Date(now.getTime() + parseInt(durationDays) * 24 * 60 * 60 * 1000);

    const startingPriceNum = parseInt(startingPrice);
    const reservePriceNum = reservePrice ? parseInt(reservePrice) : null;
    const bidIncrementNum = parseInt(bidIncrement) || 2500000;

    const newAuction = await Auction.create({
      id: auctionId,
      product_id: productId,
      seller_id: sellerId,
      status: 'active',
      starting_price: startingPriceNum,
      reserve_price: reservePriceNum,
      current_price: startingPriceNum,
      bid_increment: bidIncrementNum,
      bid_count: 0,
      starts_at: now,
      ends_at: endsAt
    });

    // Audit Log
    await AuditLog.create({
      id: await getNextSequence('audit_logs'),
      user_id: sellerId,
      user_name: req.user.name,
      action: 'CREATE_AUCTION',
      details: `Lote #${auctionId} ("${title}") criado com sucesso no MongoDB`
    });

    // Mirror to SQLite if active
    try {
      execute(`
        INSERT INTO products (id, seller_id, category_id, title, description, brand, model, year, condition, location_province, location_city)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [productId, sellerId, categoryId, title, description, brand, model, year, condition, locationProvince, locationCity]);

      execute(`
        INSERT INTO auctions (id, product_id, seller_id, status, starting_price, reserve_price, current_price, bid_increment, bid_count, starts_at, ends_at)
        VALUES (?, ?, ?, 'active', ?, ?, ?, ?, 0, ?, ?)
      `, [auctionId, productId, sellerId, startingPriceNum, reservePriceNum, startingPriceNum, bidIncrementNum, now.toISOString(), endsAt.toISOString()]);
    } catch {}

    return res.status(201).json({
      message: 'Leilão publicado com sucesso no MongoDB!',
      auctionId,
      auction: newAuction
    });
  } catch (err) {
    console.error('Create auction error:', err);
    return res.status(500).json({ message: 'Erro ao criar leilão', error: err.message });
  }
});

// POST /api/v1/seller/orders/:id/ship — Mark order as shipped
router.post('/orders/:id/ship', async (req, res) => {
  const sellerId = req.user.id;
  const orderId = parseInt(req.params.id);
  const { trackingNumber, courierName = 'Logística Blindada MozBid' } = req.body;

  try {
    const order = await Order.findOne({ id: orderId, seller_id: sellerId });
    if (!order) {
      return res.status(404).json({ message: 'Encomenda não encontrada' });
    }

    const trackCode = trackingNumber || `MZB-EXP-${Date.now().toString().slice(-6)}`;

    await Delivery.findOneAndUpdate(
      { order_id: orderId },
      {
        order_id: orderId,
        status: 'shipped',
        tracking_number: trackCode,
        courier_name: courierName
      },
      { upsert: true, new: true }
    );

    await Order.updateOne({ id: orderId }, { status: 'processing' });

    // SQLite mirror
    try {
      execute("UPDATE orders SET status = 'processing' WHERE id = ?", [orderId]);
      execute("UPDATE deliveries SET status = 'shipped', tracking_number = ? WHERE order_id = ?", [trackCode, orderId]);
    } catch {}

    return res.json({
      message: 'Expedição do lote registada com sucesso',
      trackingNumber: trackCode
    });
  } catch (err) {
    console.error('Ship order error:', err);
    return res.status(500).json({ message: 'Erro ao registar expedição', error: err.message });
  }
});

export default router;
