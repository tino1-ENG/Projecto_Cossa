import http from 'node:http';
import express from 'express';
import cors from 'cors';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

import { db, queryOne, queryAll, execute, runTransaction } from './database/db.js';
import { runMigrations } from './database/migrate.js';
import {
  connectMongoDB,
  Auction,
  Product,
  Order,
  Notification,
  getNextSequence
} from './models/index.js';
import {
  initializeSockets,
  broadcastAuctionEnded,
  sendUserNotification
} from './sockets/index.js';

import authRoutes from './routes/auth.js';
import auctionRoutes from './routes/auctions.js';
import categoryRoutes from './routes/categories.js';
import buyerRoutes from './routes/buyer.js';
import sellerRoutes from './routes/seller.js';
import adminRoutes from './routes/admin.js';
import orderRoutes from './routes/orders.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure migrations are run on startup
runMigrations();

// Auto-seed initial data if database is empty on fresh deployment
try {
  const auctionCount = queryOne("SELECT count(*) as count FROM auctions");
  if (!auctionCount || auctionCount.count === 0) {
    console.log('[SQLite] Fresh deployment detected. Running initial database seed...');
    const { seed } = await import('./database/seed.js');
    seed();
  }
} catch (e) {
  console.warn('[SQLite Auto-Seed Warning]:', e.message);
}

const app = express();
const server = http.createServer(app);

// Sockets initialization
initializeSockets(server);

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploads or static assets if needed
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'MozBid API',
    database: 'MongoDB (Mongoose) + SQLite (Replica)',
    serverTime: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/auctions', auctionRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/buyer', buyerRoutes);
app.use('/api/v1/seller', sellerRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/orders', orderRoutes);

// Serve built frontend static files
const frontendDistPath = path.join(__dirname, '../../frontend/dist');
const clientDistPath = path.join(__dirname, '../../client/dist');
const distPath = fs.existsSync(frontendDistPath) ? frontendDistPath : clientDistPath;
app.use(express.static(distPath));

// Fallback to index.html for Vue / Quasar client-side routing
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/socket.io')) {
    return next();
  }
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) next();
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[API Error]:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Erro interno no servidor',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

/**
 * Autonomous Auction Engine: Background Lifecycle Checker
 * Runs every 10 seconds to auto-settle expired auctions in MongoDB + SQLite
 */
async function checkExpiredAuctions() {
  try {
    const now = new Date();
    const expiredAuctions = await Auction.find({
      status: 'active',
      ends_at: { $lte: now }
    });

    for (const auction of expiredAuctions) {
      const product = await Product.findOne({ id: auction.product_id }).lean();
      const productTitle = product?.title || `Lote #${auction.id}`;

      console.log(`[Auction Engine] Processing closure for Auction #${auction.id} ("${productTitle}")`);

      const reserveMet = !auction.reserve_price || auction.current_price >= auction.reserve_price;
      const hasWinner = Boolean(auction.winner_id && auction.bid_count > 0 && reserveMet);
      const newStatus = hasWinner ? 'awaiting_payment' : 'unsold';

      auction.status = newStatus;
      await auction.save();

      // Mirror status update to SQLite
      try {
        execute("UPDATE auctions SET status = ?, updated_at = datetime('now', 'utc') WHERE id = ?", [newStatus, auction.id]);
      } catch (e) {
        console.warn('SQLite auction expiration mirror warning:', e.message);
      }

      if (hasWinner) {
        // Check if order already exists (idempotency)
        let order = await Order.findOne({ auction_id: auction.id });
        let orderId = order?.id;

        if (!order) {
          orderId = await getNextSequence('order_id');
          order = new Order({
            id: orderId,
            auction_id: auction.id,
            buyer_id: auction.winner_id,
            seller_id: auction.seller_id,
            total_amount: auction.current_price,
            status: 'pending_payment'
          });
          await order.save();

          // Mirror order to SQLite
          try {
            execute(`
              INSERT INTO orders (id, auction_id, buyer_id, seller_id, total_amount, status)
              VALUES (?, ?, ?, ?, ?, 'pending_payment')
            `, [orderId, auction.id, auction.winner_id, auction.seller_id, auction.current_price]);
          } catch (e) {
            console.warn('SQLite order mirror warning:', e.message);
          }
        }

        // Notify winner in MongoDB
        const notifWinner = new Notification({
          id: await getNextSequence('notification_id'),
          user_id: auction.winner_id,
          title: 'PARABÉNS! Ganhou o leilão!',
          message: `Você foi o vencedor do leilão "${productTitle}" com a licitação vencedora de ${(auction.current_price / 100).toLocaleString('pt-MZ')} MT. Proceda ao pagamento.`,
          type: 'auction_won',
          is_read: false,
          link: '/buyer/wins'
        });
        await notifWinner.save();

        // Notify seller in MongoDB
        const notifSeller = new Notification({
          id: await getNextSequence('notification_id'),
          user_id: auction.seller_id,
          title: 'Leilão Concluído com Sucesso!',
          message: `O leilão "${productTitle}" foi concluído por ${(auction.current_price / 100).toLocaleString('pt-MZ')} MT. Aguardando pagamento do comprador.`,
          type: 'auction_ended',
          is_read: false,
          link: '/seller/orders'
        });
        await notifSeller.save();

        broadcastAuctionEnded(auction.id, {
          auctionId: auction.id,
          status: 'ended',
          winnerId: auction.winner_id,
          finalPrice: auction.current_price,
          reserveMet: true,
          orderId
        });
      } else {
        // Notify seller of unsold
        const notifUnsold = new Notification({
          id: await getNextSequence('notification_id'),
          user_id: auction.seller_id,
          title: 'Leilão Encerrado Sem Vencedor',
          message: `O leilão "${productTitle}" encerrou sem atingir o preço de reserva ou sem licitações válidas.`,
          type: 'auction_ended',
          is_read: false,
          link: '/seller/auctions'
        });
        await notifUnsold.save();

        broadcastAuctionEnded(auction.id, {
          auctionId: auction.id,
          status: 'unsold',
          winnerId: null,
          finalPrice: auction.current_price,
          reserveMet: false
        });
      }
    }
  } catch (err) {
    console.error('[Auction Engine Error]:', err);
  }
}

// Start auction engine timer
setInterval(checkExpiredAuctions, 10000);

const PORT = process.env.PORT || 5000;

// Connect to MongoDB and then start server
connectMongoDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`[MozBid Server] Running at http://localhost:${PORT}`);
      console.log(`[MozBid Server] Primary Database: MongoDB at mongodb://127.0.0.1:27017/mozbid`);
      console.log(`[MozBid Server] Replica Database: SQLite active at server/data/mozbid.db`);
      console.log(`[MozBid Server] Real-time WebSockets initialized.`);
    });
  })
  .catch((err) => {
    console.error('[MozBid Server] Failed to connect to MongoDB:', err);
    // Start server anyway with SQLite fallback
    server.listen(PORT, () => {
      console.log(`[MozBid Server] Running with fallback SQLite at http://localhost:${PORT}`);
    });
  });
