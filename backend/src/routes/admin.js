import express from 'express';
import {
  User,
  Auction,
  Bid,
  Product,
  Category,
  Notification,
  AuditLog,
  getNextSequence
} from '../models/index.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);
router.use(requireRole('admin'));

// GET /api/v1/admin/dashboard — Global Platform KPIs (MongoDB primary)
router.get('/dashboard', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalAuctions = await Auction.countDocuments();
    const activeAuctions = await Auction.countDocuments({ status: 'active' });
    const totalBids = await Bid.countDocuments();

    const volumeAgg = await Auction.aggregate([
      { $match: { status: { $in: ['active', 'sold', 'ended', 'awaiting_payment'] } } },
      { $group: { _id: null, total: { $sum: '$current_price' } } }
    ]);
    const totalVolume = volumeAgg[0]?.total || 0;

    const pendingSellers = await User.countDocuments({ role: 'seller', verified_status: 'pending' });

    // Recent audit logs
    const auditDocs = await AuditLog.find().sort({ created_at: -1 }).limit(10).lean();
    const recentAuditLogs = await Promise.all(auditDocs.map(async (al) => {
      const u = await User.findOne({ id: al.user_id }).lean();
      return {
        ...al,
        user_name: u?.name || 'Administrador',
        user_email: u?.email || ''
      };
    }));

    // Recent bids
    const bidDocs = await Bid.find().sort({ created_at: -1 }).limit(8).lean();
    const recentBids = await Promise.all(bidDocs.map(async (b) => {
      const u = await User.findOne({ id: b.bidder_id }).lean();
      const a = await Auction.findOne({ id: b.auction_id }).lean();
      const p = a ? await Product.findOne({ id: a.product_id }).lean() : null;
      return {
        id: b.id,
        amount: b.amount,
        created_at: b.created_at,
        is_auto: b.is_auto,
        bidder_name: u?.name || 'Licitador',
        product_title: p?.title || `Lote #${b.auction_id}`,
        auction_id: b.auction_id
      };
    }));

    return res.json({
      kpis: {
        totalUsers,
        totalAuctions,
        activeAuctions,
        totalBids,
        totalVolume,
        pendingSellers,
        platformCommissionRate: '5%'
      },
      recentAuditLogs,
      recentBids
    });
  } catch (err) {
    console.error('Admin dashboard error (MongoDB):', err);
    return res.status(500).json({ message: 'Erro ao carregar dados administrativos', error: err.message });
  }
});

// GET /api/v1/admin/users — Manage all users (MongoDB primary)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().sort({ created_at: -1 }).lean();
    const formatted = users.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      phone: u.phone,
      role: u.role,
      is_verified: u.is_verified,
      balance: u.balance,
      city: u.city,
      province: u.province,
      created_at: u.created_at,
      company_name: u.company_name,
      nuit: u.nuit,
      seller_status: u.verified_status
    }));
    return res.json(formatted);
  } catch (err) {
    console.error('Error fetching admin users (MongoDB):', err);
    return res.status(500).json({ message: 'Erro ao carregar utilizadores', error: err.message });
  }
});

// PATCH /api/v1/admin/users/:id — Update role or toggle status
router.patch('/users/:id', async (req, res) => {
  const userId = parseInt(req.params.id);
  const { role, is_verified } = req.body;

  try {
    const updateFields = {};
    if (role !== undefined) updateFields.role = role;
    if (is_verified !== undefined) updateFields.is_verified = Boolean(is_verified);

    await User.findOneAndUpdate({ id: userId }, { $set: updateFields });

    const audit = new AuditLog({
      id: await getNextSequence('audit_log_id'),
      user_id: req.user.id,
      action: 'UPDATE_USER',
      entity_type: 'user',
      entity_id: userId,
      details: `Admin actualizou utilizador ID ${userId}`
    });
    await audit.save();

    return res.json({ message: 'Utilizador actualizado com sucesso' });
  } catch (err) {
    console.error('Error updating user (MongoDB):', err);
    return res.status(500).json({ message: 'Erro ao actualizar utilizador', error: err.message });
  }
});

// GET /api/v1/admin/sellers — Manage sellers (MongoDB primary)
router.get('/sellers', async (req, res) => {
  try {
    const sellers = await User.find({ role: { $in: ['seller', 'admin'] } }).sort({ created_at: -1 }).lean();
    const formatted = await Promise.all(sellers.map(async (s) => {
      const auctionCount = await Auction.countDocuments({ seller_id: s.id });
      return {
        id: s.id,
        user_id: s.id,
        name: s.name,
        email: s.email,
        phone: s.phone,
        city: s.city,
        province: s.province,
        company_name: s.company_name,
        nuit: s.nuit,
        business_type: s.business_type,
        verified_status: s.verified_status,
        rating: s.rating,
        total_sales: s.total_sales,
        auction_count: auctionCount,
        created_at: s.created_at
      };
    }));
    return res.json(formatted);
  } catch (err) {
    console.error('Error fetching sellers (MongoDB):', err);
    return res.status(500).json({ message: 'Erro ao listar vendedores', error: err.message });
  }
});

// PATCH /api/v1/admin/sellers/:id/verify — Approve or reject seller
router.patch('/sellers/:id/verify', async (req, res) => {
  const sellerId = parseInt(req.params.id);
  const { status } = req.body; // 'verified' or 'rejected'

  try {
    const seller = await User.findOne({ id: sellerId });
    if (!seller) {
      return res.status(404).json({ message: 'Perfil de vendedor não encontrado' });
    }

    seller.verified_status = status;
    if (status === 'verified') {
      seller.is_verified = true;
    }
    await seller.save();

    // Send notification to seller
    const notif = new Notification({
      id: await getNextSequence('notification_id'),
      user_id: sellerId,
      title: status === 'verified' ? 'Perfil de Vendedor Aprovado!' : 'Verificação de Vendedor',
      message: status === 'verified'
        ? 'Parabéns! O seu perfil de vendedor foi verificado pela equipa MozBid. Já pode publicar leilões sem restrições.'
        : 'O seu pedido de verificação de vendedor foi revisto. Por favor contacte o suporte para mais detalhes.',
      type: 'system',
      is_read: false,
      link: '/seller/dashboard'
    });
    await notif.save();

    return res.json({ message: `Vendedor ${status === 'verified' ? 'aprovado' : 'rejeitado'} com sucesso` });
  } catch (err) {
    console.error('Error verifying seller (MongoDB):', err);
    return res.status(500).json({ message: 'Erro ao verificar vendedor', error: err.message });
  }
});

// GET /api/v1/admin/auctions — Moderation
router.get('/auctions', async (req, res) => {
  try {
    const auctions = await Auction.find().sort({ created_at: -1 }).lean();
    const formatted = await Promise.all(auctions.map(async (a) => {
      const product = await Product.findOne({ id: a.product_id }).lean();
      const cat = product ? await Category.findOne({ id: product.category_id }).lean() : null;
      const seller = await User.findOne({ id: a.seller_id }).lean();
      const primaryImg = product?.images?.find(i => i.is_primary)?.image_url
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
        created_at: a.created_at,
        title: product?.title || `Lote #${a.id}`,
        brand: product?.brand || '',
        model: product?.model || '',
        category_name: cat?.name || 'Geral',
        seller_name: seller?.company_name || seller?.name || 'Vendedor',
        primary_image: primaryImg
      };
    }));
    return res.json(formatted);
  } catch (err) {
    console.error('Error fetching admin auctions (MongoDB):', err);
    return res.status(500).json({ message: 'Erro ao listar leilões', error: err.message });
  }
});

// PATCH /api/v1/admin/auctions/:id/status
router.patch('/auctions/:id/status', async (req, res) => {
  const auctionId = parseInt(req.params.id);
  const { status } = req.body;

  try {
    await Auction.findOneAndUpdate({ id: auctionId }, { $set: { status } });
    return res.json({ message: `Estado do leilão alterado para ${status}` });
  } catch (err) {
    console.error('Error updating auction status (MongoDB):', err);
    return res.status(500).json({ message: 'Erro ao alterar estado do leilão', error: err.message });
  }
});

// GET /api/v1/admin/audit-logs
router.get('/audit-logs', async (req, res) => {
  try {
    const logs = await AuditLog.find().sort({ created_at: -1 }).limit(100).lean();
    const formatted = await Promise.all(logs.map(async (l) => {
      const u = await User.findOne({ id: l.user_id }).lean();
      return {
        id: l.id,
        user_id: l.user_id,
        action: l.action,
        entity_type: l.entity_type,
        entity_id: l.entity_id,
        details: l.details,
        created_at: l.created_at,
        user_name: u?.name || 'Sistema',
        user_email: u?.email || ''
      };
    }));
    return res.json(formatted);
  } catch (err) {
    console.error('Error fetching audit logs (MongoDB):', err);
    return res.status(500).json({ message: 'Erro ao carregar auditoria', error: err.message });
  }
});

export default router;
