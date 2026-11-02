import express from 'express';
import {
  Order,
  Auction,
  Product,
  User,
  Payment,
  Delivery,
  Notification,
  getNextSequence
} from '../models/index.js';
import { queryOne, queryAll, execute, runTransaction } from '../database/db.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

// GET /api/v1/orders/:id — Order details (MongoDB primary)
router.get('/:id', async (req, res) => {
  const orderId = parseInt(req.params.id);
  const userId = req.user.id;

  try {
    const order = await Order.findOne({ id: orderId }).lean();
    if (!order) {
      return res.status(404).json({ message: 'Encomenda não encontrada' });
    }

    if (order.buyer_id !== userId && order.seller_id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Acesso negado a esta encomenda' });
    }

    const auction = await Auction.findOne({ id: order.auction_id }).lean();
    const product = auction ? await Product.findOne({ id: auction.product_id }).lean() : null;
    const seller = await User.findOne({ id: order.seller_id }).lean();
    const buyer = await User.findOne({ id: order.buyer_id }).lean();
    const payment = await Payment.findOne({ order_id: orderId }).lean();
    const delivery = await Delivery.findOne({ order_id: orderId }).lean();

    const primaryImg = product?.images?.find(img => img.is_primary)?.image_url
      || product?.images?.[0]?.image_url
      || '/images/products/land-cruiser-300.jpg';

    return res.json({
      ...order,
      auction_id: order.auction_id,
      title: product?.title || `Lote #${order.auction_id}`,
      brand: product?.brand || '',
      model: product?.model || '',
      primary_image: primaryImg,
      seller_name: seller?.company_name || seller?.name || 'Vendedor',
      seller_phone: seller?.phone || '',
      buyer_name: buyer?.name || 'Comprador',
      buyer_phone: buyer?.phone || '',
      payment,
      delivery
    });
  } catch (err) {
    console.error('Error fetching order details (MongoDB):', err);
    return res.status(500).json({ message: 'Erro ao carregar detalhes da encomenda', error: err.message });
  }
});

// POST /api/v1/orders/:id/pay — Checkout with Mozambican payment channels (MongoDB primary)
router.post('/:id/pay', async (req, res) => {
  const orderId = parseInt(req.params.id);
  const userId = req.user.id;
  const { method = 'm-pesa', phoneNumber, deliveryAddress } = req.body;

  try {
    const order = await Order.findOne({ id: orderId, buyer_id: userId });
    if (!order) {
      return res.status(404).json({ message: 'Encomenda não encontrada' });
    }

    if (order.status === 'paid' || order.status === 'completed' || order.status === 'processing') {
      return res.status(422).json({ message: 'Esta encomenda já foi liquidada' });
    }

    const prefix = method === 'm-pesa' ? 'MPESA' : method === 'e-mola' ? 'EMOLA' : 'BANK';
    const reference = `${prefix}-MZ-${Date.now().toString().slice(-8)}`;

    // 1. Create Payment record in MongoDB
    const paymentSeq = await getNextSequence('payment_id');
    const paymentDoc = new Payment({
      id: paymentSeq,
      order_id: orderId,
      amount: order.total_amount,
      method,
      status: 'completed',
      reference,
      phone_number: phoneNumber || req.user.phone,
      transaction_date: new Date()
    });
    await paymentDoc.save();

    // 2. Update order status
    order.status = 'paid';
    await order.save();

    // 3. Create Delivery in MongoDB
    const trackingNumber = `MZB-EXP-${Math.floor(100000 + Math.random() * 900000)}`;
    const in3Days = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

    const deliverySeq = await getNextSequence('delivery_id');
    const deliveryDoc = new Delivery({
      id: deliverySeq,
      order_id: orderId,
      status: 'processing',
      tracking_number: trackingNumber,
      courier_name: 'MozBid Express Logistics',
      address: deliveryAddress || 'Av. Julius Nyerere, Maputo',
      estimated_delivery: in3Days
    });
    await deliveryDoc.save();

    // 4. Create Notifications in MongoDB
    const notifSellerSeq = await getNextSequence('notification_id');
    const notifSeller = new Notification({
      id: notifSellerSeq,
      user_id: order.seller_id,
      title: 'Pagamento Confirmado!',
      message: `O comprador liquidou a encomenda #${orderId} no valor de ${(order.total_amount / 100).toLocaleString('pt-MZ')} MT via ${method.toUpperCase()}. Proceda ao envio.`,
      type: 'payment_received',
      is_read: false,
      link: '/seller/orders'
    });
    await notifSeller.save();

    const notifBuyerSeq = await getNextSequence('notification_id');
    const notifBuyer = new Notification({
      id: notifBuyerSeq,
      user_id: userId,
      title: 'Pagamento Efectuado com Sucesso',
      message: `O seu pagamento com referência ${reference} foi confirmado. Acompanhe a entrega com o código ${trackingNumber}.`,
      type: 'system',
      is_read: false,
      link: '/buyer/wins'
    });
    await notifBuyer.save();

    // 5. Mirror to SQLite
    try {
      execute(`
        INSERT INTO payments (id, order_id, user_id, amount, method, status, reference, phone_number)
        VALUES (?, ?, ?, ?, ?, 'completed', ?, ?)
      `, [paymentSeq, orderId, userId, order.total_amount, method, reference, phoneNumber || req.user.phone]);

      execute("UPDATE orders SET status = 'paid', updated_at = datetime('now', 'utc') WHERE id = ?", [orderId]);

      execute(`
        INSERT INTO deliveries (id, order_id, tracking_number, status, carrier, delivery_address, estimated_date)
        VALUES (?, ?, ?, 'pending', 'MozBid Express Logistics', ?, ?)
      `, [deliverySeq, orderId, trackingNumber, deliveryAddress || 'Av. Julius Nyerere, Maputo', in3Days.toISOString()]);

      execute(`
        INSERT INTO notifications (id, user_id, title, message, type, is_read, link)
        VALUES (?, ?, 'Pagamento Confirmado!', ?, 'payment_received', 0, '/seller/orders')
      `, [notifSellerSeq, order.seller_id, `O comprador liquidou a encomenda #${orderId} no valor de ${(order.total_amount / 100).toLocaleString('pt-MZ')} MT via ${method.toUpperCase()}.`]);

      execute(`
        INSERT INTO notifications (id, user_id, title, message, type, is_read, link)
        VALUES (?, ?, 'Pagamento Efectuado com Sucesso', ?, 'system', 0, '/buyer/wins')
      `, [notifBuyerSeq, userId, `O seu pagamento com referência ${reference} foi confirmado. Acompanhe a entrega com o código ${trackingNumber}.`]);
    } catch (sqliteErr) {
      console.warn('SQLite order payment mirror warning:', sqliteErr.message);
    }

    return res.json({
      message: 'Pagamento processado e confirmado com sucesso!',
      reference,
      trackingNumber
    });
  } catch (err) {
    console.error('Payment error (MongoDB):', err);
    return res.status(500).json({ message: 'Erro ao processar pagamento', error: err.message });
  }
});

export default router;
