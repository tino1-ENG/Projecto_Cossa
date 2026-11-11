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
import { finalizeAuction } from './services/auctionEngine.js';

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
      await finalizeAuction(auction);
    }
  } catch (err) {
    console.error('[Auction Engine Periodic Check Error]:', err);
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
