import express from 'express';
import {
  User,
  Category,
  Product,
  Auction,
  Bid,
  AutoBid,
  Watchlist,
  Notification,
  AuditLog,
  getNextSequence
} from '../models/index.js';
import { authenticate, optionalAuthenticate } from '../middleware/auth.js';
import {
  broadcastAuctionUpdate,
  broadcastBidCreated,
  broadcastAuctionExtended,
  sendUserNotification
} from '../sockets/index.js';
import { finalizeAuction } from '../services/auctionEngine.js';

const router = express.Router();

/**
 * Format helper for anonymizing bidder names in public bid history
 * e.g., "Mariamo Nhantumbo" -> "M****** N********"
 */
function anonymizeName(name) {
  if (!name) return 'Licitador';
  const parts = name.split(' ');
  return parts.map(part => {
    if (part.length <= 2) return part;
    return part[0] + '*'.repeat(Math.min(part.length - 2, 5)) + part[part.length - 1];
  }).join(' ');
}

// GET /api/v1/auctions — Search & Catalog listing (MongoDB primary)
router.get('/', optionalAuthenticate, async (req, res) => {
  try {
    const {
      search,
      category,
      province,
      minPrice,
      maxPrice,
      status,
      sort = 'ending_soon',
      page = 1,
      limit = 12
    } = req.query;

    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.max(1, parseInt(limit) || 12);
    const skip = (pageNum - 1) * limitNum;

    // 1. Build product query if category, province, or search is provided
    const andConditions = [];

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      andConditions.push({
        $or: [
          { title: searchRegex },
          { description: searchRegex },
          { brand: searchRegex },
          { model: searchRegex },
          { location_city: searchRegex },
          { location_province: searchRegex }
        ]
      });
    }

    if (province && province !== 'all' && province.trim()) {
      const provRegex = new RegExp(province.trim(), 'i');
      andConditions.push({
        $or: [
          { location_province: provRegex },
          { location_city: provRegex }
        ]
      });
    }

    if (category && category !== 'all') {
      if (isNaN(category)) {
        const catDoc = await Category.findOne({ slug: category }).lean();
        if (catDoc) {
          andConditions.push({ category_id: catDoc.id });
        } else {
          andConditions.push({ category_id: -1 }); // No match
        }
      } else {
        andConditions.push({ category_id: parseInt(category) });
      }
    }

    const productFilter = andConditions.length > 0 ? { $and: andConditions } : {};

    // 2. Build auction query
    const auctionFilter = {};
    if (status) {
      auctionFilter.status = status;
    } else {
      auctionFilter.status = { $in: ['active', 'upcoming'] };
    }

    if (minPrice && !isNaN(minPrice)) {
      auctionFilter.current_price = { ...auctionFilter.current_price, $gte: parseInt(minPrice) };
    }
    if (maxPrice && !isNaN(maxPrice)) {
      auctionFilter.current_price = { ...auctionFilter.current_price, $lte: parseInt(maxPrice) };
    }

    // If product filters exist, find matching product IDs
    if (Object.keys(productFilter).length > 0) {
      const matchingProductIds = await Product.distinct('id', productFilter);
      auctionFilter.product_id = { $in: matchingProductIds };
    }

    // Sorting
    let sortObj = { ends_at: 1 };
    if (sort === 'ending_soon') {
      sortObj = { ends_at: 1 };
    } else if (sort === 'price_desc') {
      sortObj = { current_price: -1 };
    } else if (sort === 'price_asc') {
      sortObj = { current_price: 1 };
    } else if (sort === 'bids_desc') {
      sortObj = { bid_count: -1 };
    } else if (sort === 'newest') {
      sortObj = { created_at: -1 };
    }

    const total = await Auction.countDocuments(auctionFilter);
    const auctionDocs = await Auction.find(auctionFilter)
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum)
      .lean();

    // Check user watchlist
    let userWatchlistIds = new Set();
    if (req.user) {
      const watches = await Watchlist.find({ user_id: req.user.id }).lean();
      userWatchlistIds = new Set(watches.map(w => w.auction_id));
    }

    // Populate products, categories, and sellers
    const formattedItems = await Promise.all(auctionDocs.map(async (a) => {
      const product = await Product.findOne({ id: a.product_id }).lean();
      const cat = product ? await Category.findOne({ id: product.category_id }).lean() : null;
      const seller = await User.findOne({ id: a.seller_id }).lean();

      const primaryImg = product?.images?.find(img => img.is_primary)?.image_url
        || product?.images?.[0]?.image_url
        || '/images/products/land-cruiser-300.jpg';

      return {
        id: a.id,
        product_id: a.product_id,
        seller_id: a.seller_id,
        status: a.status,
        starting_price: a.starting_price,
        reserve_price: a.reserve_price,
        current_price: a.current_price,
        bid_increment: a.bid_increment,
        bid_count: a.bid_count,
        starts_at: a.starts_at,
        ends_at: a.ends_at,
        winner_id: a.winner_id,
        auto_extend_count: a.auto_extend_count,
        created_at: a.created_at,
        title: product?.title || `Lote #${a.id}`,
        brand: product?.brand || '',
        model: product?.model || '',
        year: product?.year || 2023,
        condition: product?.condition || 'used_good',
        location_province: product?.location_province || 'Maputo Cidade',
        location_city: product?.location_city || 'Maputo',
        category_id: cat?.id || 1,
        category_name: cat?.name || 'Automóveis',
        category_slug: cat?.slug || 'automoveis',
        seller_name: seller?.name || 'Vendedor Verificado',
        seller_company_name: seller?.company_name || null,
        seller_verified_status: seller?.verified_status || 'verified',
        seller_rating: seller?.rating || 4.95,
        primary_image: primaryImg,
        is_watchlisted: userWatchlistIds.has(a.id),
        seller_display_name: seller?.company_name || seller?.name || 'Vendedor Verificado',
        min_next_bid: a.bid_count === 0 ? a.starting_price : a.current_price + a.bid_increment
      };
    }));

    return res.json({
      items: formattedItems,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum) || 1
    });
  } catch (err) {
    console.error('Error fetching auctions (MongoDB):', err);
    return res.status(500).json({ message: 'Erro ao carregar leilões', error: err.message });
  }
});

// GET /api/v1/auctions/:id — Detailed auction view (MongoDB primary)
router.get('/:id', optionalAuthenticate, async (req, res) => {
  try {
    const auctionId = parseInt(req.params.id);
    if (isNaN(auctionId)) {
      return res.status(400).json({ message: 'ID de leilão inválido' });
    }

    let auction = await Auction.findOne({ id: auctionId });
    if (!auction) {
      return res.status(404).json({ message: 'Leilão não encontrado' });
    }

    // Auto-finalize if auction time has elapsed
    if (auction.status === 'active' && new Date() >= new Date(auction.ends_at)) {
      await finalizeAuction(auction);
      auction = await Auction.findOne({ id: auctionId });
    }

    const product = await Product.findOne({ id: auction.product_id }).lean();
    const category = product ? await Category.findOne({ id: product.category_id }).lean() : null;
    const seller = await User.findOne({ id: auction.seller_id }).lean();

    // Images
    const images = (product?.images && product.images.length > 0)
      ? product.images.map((img, idx) => ({ id: idx + 1, image_url: img.image_url, is_primary: img.is_primary ? 1 : 0 }))
      : [{ id: 1, image_url: '/images/products/land-cruiser-300.jpg', is_primary: 1 }];

    // Top 15 bids
    const bidsDocs = await Bid.find({ auction_id: auctionId })
      .sort({ amount: -1, created_at: -1 })
      .limit(15)
      .lean();

    const formattedBids = await Promise.all(bidsDocs.map(async (bid) => {
      let bidderName = bid.bidder_name;
      if (!bidderName) {
        const bidder = await User.findOne({ id: bid.bidder_id }).lean();
        bidderName = bidder?.name || 'Licitador';
      }
      return {
        id: bid.id,
        amount: bid.amount,
        is_auto: Boolean(bid.is_auto),
        created_at: bid.created_at,
        bidder_alias: anonymizeName(bidderName),
        is_me: req.user ? req.user.id === bid.bidder_id : false
      };
    }));

    // Watchlist & Proxy Bid for current user
    let isWatchlisted = false;
    let userAutoBid = null;
    let isLeading = false;

    if (req.user) {
      const watch = await Watchlist.findOne({ user_id: req.user.id, auction_id: auctionId }).lean();
      isWatchlisted = Boolean(watch);

      const autoBid = await AutoBid.findOne({ user_id: req.user.id, auction_id: auctionId }).lean();
      if (autoBid) {
        userAutoBid = autoBid.max_amount;
      }

      isLeading = auction.winner_id === req.user.id;
    }

    const minNextBid = auction.bid_count === 0
      ? auction.starting_price
      : auction.current_price + auction.bid_increment;

    const reserveMet = !auction.reserve_price || auction.current_price >= auction.reserve_price;

    // Similar auctions
    let similar = [];
    if (product) {
      const similarProducts = await Product.find({
        category_id: product.category_id,
        id: { $ne: product.id }
      }).limit(4).lean();

      const simProductIds = similarProducts.map(p => p.id);
      const similarAuctions = await Auction.find({
        product_id: { $in: simProductIds },
        status: 'active'
      }).limit(4).lean();

      similar = similarAuctions.map(sa => {
        const sp = similarProducts.find(p => p.id === sa.product_id);
        return {
          id: sa.id,
          current_price: sa.current_price,
          bid_count: sa.bid_count,
          ends_at: sa.ends_at,
          status: sa.status,
          title: sp?.title || `Lote #${sa.id}`,
          location_city: sp?.location_city || 'Maputo',
          primary_image: sp?.images?.[0]?.image_url || '/images/products/land-cruiser-300.jpg'
        };
      });
    }

    return res.json({
      id: auction.id,
      product_id: auction.product_id,
      seller_id: auction.seller_id,
      status: auction.status,
      starting_price: auction.starting_price,
      reserve_price: auction.reserve_price,
      current_price: auction.current_price,
      bid_increment: auction.bid_increment,
      bid_count: auction.bid_count,
      starts_at: auction.starts_at,
      ends_at: auction.ends_at,
      winner_id: auction.winner_id,
      auto_extend_count: auction.auto_extend_count,
      created_at: auction.created_at,
      title: product?.title || `Lote #${auction.id}`,
      description: product?.description || '',
      brand: product?.brand || '',
      model: product?.model || '',
      year: product?.year || 2023,
      condition: product?.condition || 'used_good',
      mileage_or_hours: product?.mileage_or_hours || null,
      fuel_type: product?.fuel_type || null,
      transmission: product?.transmission || null,
      location_province: product?.location_province || 'Maputo Cidade',
      location_city: product?.location_city || 'Maputo',
      specifications: product?.specifications || {},
      category_id: category?.id || 1,
      category_name: category?.name || 'Automóveis',
      category_slug: category?.slug || 'automoveis',
      seller_name: seller?.name || 'Vendedor Verificado',
      seller_city: seller?.city || 'Maputo',
      seller_company_name: seller?.company_name || null,
      seller_nuit: seller?.nuit || null,
      seller_business_type: seller?.business_type || 'individual',
      seller_verified_status: seller?.verified_status || 'verified',
      seller_rating: seller?.rating || 4.95,
      seller_total_sales: seller?.total_sales || 12,
      images,
      bids: formattedBids,
      min_next_bid: minNextBid,
      reserve_met: reserveMet,
      is_watchlisted: isWatchlisted,
      is_leading: isLeading,
      user_auto_bid: userAutoBid,
      seller_display_name: seller?.company_name || seller?.name || 'Vendedor',
      similar_auctions: similar
    });
  } catch (err) {
    console.error('Error fetching auction details (MongoDB):', err);
    return res.status(500).json({ message: 'Erro ao carregar detalhes do leilão', error: err.message });
  }
});

// POST /api/v1/auctions/:id/test-expire — Rota de teste/demonstração: encerra o leilão e processa adjudicação imediata
router.post('/:id/test-expire', optionalAuthenticate, async (req, res) => {
  try {
    const auctionId = parseInt(req.params.id);
    const auction = await Auction.findOne({ id: auctionId });
    if (!auction) {
      return res.status(404).json({ message: 'Leilão não encontrado' });
    }

    auction.ends_at = new Date(Date.now() - 1000); // 1 segundo no passado
    await auction.save();

    const result = await finalizeAuction(auction);
    return res.json({ message: 'Leilão expirado e adjudicado com sucesso', result });
  } catch (err) {
    return res.status(500).json({ message: 'Erro ao expirar leilão de teste', error: err.message });
  }
});

// In-memory FIFO Mutex per auctionId to guarantee sequential, thread-safe execution
// for high-frequency concurrent bidding from multiple simultaneous users.
const auctionQueues = new Map();

async function acquireAuctionLock(auctionId) {
  const previous = auctionQueues.get(auctionId) || Promise.resolve();
  let release;
  const current = new Promise(resolve => { release = resolve; });
  auctionQueues.set(auctionId, previous.then(() => current));
  await previous;
  return () => {
    release();
    if (auctionQueues.get(auctionId) === current) {
      auctionQueues.delete(auctionId);
    }
  };
}

// POST /api/v1/auctions/:id/bids — Core Transactional Bidding Engine (MongoDB)
router.post('/:id/bids', authenticate, async (req, res) => {
  const auctionId = parseInt(req.params.id);
  const amount = parseInt(req.body.amount); // centavos MZN
  const userId = req.user.id;

  if (isNaN(auctionId) || isNaN(amount) || amount <= 0) {
    return res.status(400).json({ message: 'Valor de licitação inválido' });
  }

  const releaseLock = await acquireAuctionLock(auctionId);
  try {
    const auction = await Auction.findOne({ id: auctionId });
    if (!auction) {
      return res.status(404).json({ message: 'Leilão não encontrado' });
    }

    const product = await Product.findOne({ id: auction.product_id });

    // 1. Status check
    if (auction.status !== 'active') {
      return res.status(422).json({ message: `Este leilão não está activo (estado: ${auction.status})` });
    }

    // 2. Expiration check
    const now = new Date();
    const endsAt = new Date(auction.ends_at);
    if (now >= endsAt) {
      auction.status = 'ended';
      await auction.save();
      return res.status(409).json({ message: 'O leilão já encerrou. As licitações estão fechadas.' });
    }

    // 3. Seller cannot bid on own product
    if (auction.seller_id === userId || (product && product.seller_id === userId)) {
      return res.status(403).json({ message: 'Não é permitido licitar nos seus próprios produtos' });
    }

    // 4. User cannot bid if already the highest bidder
    if (auction.winner_id === userId) {
      return res.status(422).json({ message: 'Já é o licitador líder com a oferta mais alta.' });
    }

    // 5. Validate minimum bid amount
    const minRequired = auction.bid_count === 0
      ? auction.starting_price
      : auction.current_price + auction.bid_increment;

    if (amount < minRequired) {
      return res.status(422).json({
        message: `A licitação deve ser de pelo menos ${(minRequired / 100).toLocaleString('pt-MZ')} MT (actual: ${(auction.current_price / 100).toLocaleString('pt-MZ')} MT + incremento ${(auction.bid_increment / 100).toLocaleString('pt-MZ')} MT)`
      });
    }

    const previousWinnerId = auction.winner_id;

    // 6. Anti-sniping extension rule:
    // If bid arrives within the final 2 minutes (120 seconds), extend ends_at by 3 minutes (180 seconds)
    const diffMs = endsAt.getTime() - now.getTime();
    let updatedEndsAt = endsAt;
    let wasExtended = false;

    if (diffMs <= 120 * 1000) {
      updatedEndsAt = new Date(endsAt.getTime() + 180 * 1000);
      wasExtended = true;
    }

    // 7. Insert the new bid in MongoDB
    const bidSeq = await getNextSequence('bid_id');
    const newBid = new Bid({
      id: bidSeq,
      auction_id: auctionId,
      bidder_id: userId,
      bidder_name: req.user.name,
      amount,
      is_auto: false
    });
    await newBid.save();

    // 8. Update auction record
    let finalWinnerId = userId;
    let finalCurrentPrice = amount;
    let finalBidCount = auction.bid_count + 1;
    let counterBidPlaced = null;

    // 9. Check Proxy Bidding / Auto-Bids from other participants
    const competingAutoBid = await AutoBid.findOne({
      auction_id: auctionId,
      user_id: { $ne: userId },
      is_active: true,
      max_amount: { $gte: amount + auction.bid_increment }
    }).sort({ max_amount: -1, created_at: 1 });

    if (competingAutoBid) {
      const counterAmount = Math.min(competingAutoBid.max_amount, amount + auction.bid_increment);
      const autoBidSeq = await getNextSequence('bid_id');
      const competingUser = await User.findOne({ id: competingAutoBid.user_id }).lean();

      const autoBidDoc = new Bid({
        id: autoBidSeq,
        auction_id: auctionId,
        bidder_id: competingAutoBid.user_id,
        bidder_name: competingUser?.name || 'Licitador Automático',
        amount: counterAmount,
        is_auto: true
      });
      await autoBidDoc.save();

      finalWinnerId = competingAutoBid.user_id;
      finalCurrentPrice = counterAmount;
      finalBidCount += 1;

      counterBidPlaced = {
        bidId: autoBidSeq,
        bidderId: competingAutoBid.user_id,
        amount: counterAmount
      };
    }

    auction.current_price = finalCurrentPrice;
    auction.bid_count = finalBidCount;
    auction.winner_id = finalWinnerId;
    auction.ends_at = updatedEndsAt;
    if (wasExtended) {
      auction.auto_extend_count += 1;
    }
    await auction.save();

    // 10. Audit log
    const audit = new AuditLog({
      id: await getNextSequence('audit_log_id'),
      user_id: userId,
      action: 'PLACE_BID',
      entity_type: 'auction',
      entity_id: auctionId,
      details: `Licitação de ${amount / 100} MT apresentada`
    });
    await audit.save();

    // 11. Notify previous winner that they were outbid
    if (previousWinnerId && previousWinnerId !== userId) {
      const notif = new Notification({
        id: await getNextSequence('notification_id'),
        user_id: previousWinnerId,
        title: 'Foi Superado!',
        message: `A sua oferta no leilão "${product?.title || `Lote #${auctionId}`}" foi superada por uma nova licitação de ${(amount / 100).toLocaleString('pt-MZ')} MT.`,
        type: 'outbid',
        is_read: false,
        link: `/auctions/${auctionId}`
      });
      await notif.save();

      sendUserNotification(previousWinnerId, {
        title: 'Foi Superado!',
        message: `A sua oferta no leilão "${product?.title || `Lote #${auctionId}`}" foi superada.`,
        auctionId
      });
    }

    const result = {
      bidId: newBid.id,
      amount,
      currentPrice: finalCurrentPrice,
      winnerId: finalWinnerId,
      bidCount: finalBidCount,
      endsAt: updatedEndsAt.toISOString(),
      wasExtended,
      counterBidPlaced
    };

    // 12. Broadcast real-time Socket.IO events
    broadcastBidCreated(auctionId, {
      auctionId,
      amount: finalCurrentPrice,
      bidCount: finalBidCount,
      bidderAlias: anonymizeName(req.user.name),
      isAuto: Boolean(counterBidPlaced)
    });

    broadcastAuctionUpdate(auctionId, {
      auctionId,
      currentPrice: finalCurrentPrice,
      bidCount: finalBidCount,
      winnerId: finalWinnerId,
      endsAt: updatedEndsAt.toISOString(),
      minNextBid: finalCurrentPrice + auction.bid_increment
    });

    if (wasExtended) {
      broadcastAuctionExtended(auctionId, {
        auctionId,
        newEndsAt: updatedEndsAt.toISOString(),
        reason: 'Regra anti-sniping: licitação nos minutos finais'
      });
    }

    return res.status(201).json({
      message: 'Licitação registada com sucesso!',
      bid: result
    });
  } catch (err) {
    console.error('Error placing bid (MongoDB):', err);
    return res.status(500).json({ message: 'Erro ao processar licitação', error: err.message });
  } finally {
    releaseLock();
  }
});

// POST /api/v1/auctions/:id/automatic-bids — Set proxy max bid (MongoDB)
router.post('/:id/automatic-bids', authenticate, async (req, res) => {
  const auctionId = parseInt(req.params.id);
  const maxAmount = parseInt(req.body.max_amount); // centavos MZN
  const userId = req.user.id;

  if (isNaN(auctionId) || isNaN(maxAmount) || maxAmount <= 0) {
    return res.status(400).json({ message: 'Valor máximo de licitação automática inválido' });
  }

  try {
    const auction = await Auction.findOne({ id: auctionId });
    if (!auction) {
      return res.status(404).json({ message: 'Leilão não encontrado' });
    }

    if (maxAmount <= auction.current_price) {
      return res.status(422).json({
        message: `O limite deve ser superior ao preço actual (${(auction.current_price / 100).toLocaleString('pt-MZ')} MT)`
      });
    }

    await AutoBid.findOneAndUpdate(
      { auction_id: auctionId, user_id: userId },
      { max_amount: maxAmount, is_active: true },
      { upsert: true, new: true }
    );

    return res.json({
      message: 'Licitação automática configurada com sucesso',
      max_amount: maxAmount
    });
  } catch (err) {
    console.error('Error setting auto bid (MongoDB):', err);
    return res.status(500).json({ message: 'Erro ao configurar licitação automática', error: err.message });
  }
});

export default router;
