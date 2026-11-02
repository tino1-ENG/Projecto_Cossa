-- MOZBID SQLite Database Schema
-- Version: 1.0.0
-- Currency: MZN (stored in centavos as INTEGER, e.g. 100,000 MZN = 10,000,000 centavos)

PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;
PRAGMA busy_timeout = 5000;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('buyer', 'seller', 'admin')) DEFAULT 'buyer',
  is_verified INTEGER NOT NULL DEFAULT 0,
  balance INTEGER NOT NULL DEFAULT 0, -- centavos MZN
  avatar_url TEXT,
  city TEXT DEFAULT 'Maputo',
  province TEXT DEFAULT 'Maputo Cidade',
  created_at TEXT NOT NULL DEFAULT (datetime('now', 'utc')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now', 'utc'))
);

-- 2. Seller Profiles (For verified individual or corporate sellers)
CREATE TABLE IF NOT EXISTS seller_profiles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  company_name TEXT,
  nuit TEXT, -- Número Único de Identificação Tributária
  business_type TEXT NOT NULL CHECK(business_type IN ('individual', 'company')) DEFAULT 'individual',
  verified_status TEXT NOT NULL CHECK(verified_status IN ('unverified', 'pending', 'verified', 'rejected')) DEFAULT 'pending',
  rating REAL NOT NULL DEFAULT 5.0,
  total_sales INTEGER NOT NULL DEFAULT 0,
  address TEXT,
  id_document_url TEXT,
  alvara_document_url TEXT,
  bank_name TEXT,
  bank_account TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now', 'utc')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now', 'utc'))
);

-- 3. Categories
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT NOT NULL,
  description TEXT,
  featured INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now', 'utc'))
);

-- 4. Products
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  seller_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id INTEGER NOT NULL REFERENCES categories(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  brand TEXT,
  model TEXT,
  year INTEGER,
  condition TEXT NOT NULL CHECK(condition IN ('new', 'used_like_new', 'used_good', 'used_fair', 'refurbished')) DEFAULT 'used_like_new',
  mileage_or_hours TEXT,
  fuel_type TEXT,
  transmission TEXT,
  location_province TEXT NOT NULL DEFAULT 'Maputo Cidade',
  location_city TEXT NOT NULL DEFAULT 'Maputo',
  specifications_json TEXT, -- JSON key-values
  status TEXT NOT NULL CHECK(status IN ('draft', 'pending_approval', 'approved', 'rejected', 'archived')) DEFAULT 'approved',
  created_at TEXT NOT NULL DEFAULT (datetime('now', 'utc')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now', 'utc'))
);

-- 5. Product Images
CREATE TABLE IF NOT EXISTS product_images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_primary INTEGER NOT NULL DEFAULT 0,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now', 'utc'))
);

-- 6. Auctions Table
CREATE TABLE IF NOT EXISTS auctions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  seller_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK(status IN ('upcoming', 'active', 'ended', 'sold', 'unsold', 'awaiting_payment')) DEFAULT 'active',
  starting_price INTEGER NOT NULL,    -- centavos MZN
  reserve_price INTEGER,             -- centavos MZN (confidential)
  current_price INTEGER NOT NULL,     -- centavos MZN
  bid_increment INTEGER NOT NULL,     -- centavos MZN
  bid_count INTEGER NOT NULL DEFAULT 0,
  starts_at TEXT NOT NULL,           -- UTC ISO-8601
  ends_at TEXT NOT NULL,             -- UTC ISO-8601
  winner_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  auto_extend_count INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now', 'utc')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now', 'utc'))
);

-- 7. Bids Table
CREATE TABLE IF NOT EXISTS bids (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  auction_id INTEGER NOT NULL REFERENCES auctions(id) ON DELETE CASCADE,
  bidder_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL, -- centavos MZN
  is_auto INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now', 'utc'))
);

-- 8. Auto Bids Configuration (Proxy Bidding)
CREATE TABLE IF NOT EXISTS auto_bids (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  auction_id INTEGER NOT NULL REFERENCES auctions(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  max_amount INTEGER NOT NULL, -- centavos MZN
  created_at TEXT NOT NULL DEFAULT (datetime('now', 'utc')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now', 'utc')),
  UNIQUE(auction_id, user_id)
);

-- 9. Watchlist (Favoritos)
CREATE TABLE IF NOT EXISTS watchlist (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  auction_id INTEGER NOT NULL REFERENCES auctions(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL DEFAULT (datetime('now', 'utc')),
  UNIQUE(user_id, auction_id)
);

-- 10. Orders
CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  auction_id INTEGER NOT NULL REFERENCES auctions(id) ON DELETE CASCADE,
  buyer_id INTEGER NOT NULL REFERENCES users(id),
  seller_id INTEGER NOT NULL REFERENCES users(id),
  total_amount INTEGER NOT NULL, -- centavos MZN
  status TEXT NOT NULL CHECK(status IN ('pending_payment', 'paid', 'processing', 'shipped', 'delivered', 'cancelled')) DEFAULT 'pending_payment',
  created_at TEXT NOT NULL DEFAULT (datetime('now', 'utc')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now', 'utc'))
);

-- 11. Payments (M-Pesa, E-Mola, Conta Móvel, Transferência)
CREATE TABLE IF NOT EXISTS payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id),
  amount INTEGER NOT NULL, -- centavos MZN
  method TEXT NOT NULL CHECK(method IN ('m-pesa', 'e-mola', 'conta_movel', 'bank_transfer', 'card')),
  status TEXT NOT NULL CHECK(status IN ('pending', 'completed', 'failed', 'refunded')) DEFAULT 'completed',
  reference TEXT NOT NULL UNIQUE,
  phone_number TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now', 'utc'))
);

-- 12. Deliveries
CREATE TABLE IF NOT EXISTS deliveries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  tracking_number TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL CHECK(status IN ('pending', 'in_transit', 'delivered', 'returned')) DEFAULT 'pending',
  carrier TEXT NOT NULL DEFAULT 'MozBid Express Logistics',
  delivery_address TEXT NOT NULL,
  estimated_date TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now', 'utc')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now', 'utc'))
);

-- 13. Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('outbid', 'bid_placed', 'auction_won', 'auction_ended', 'payment_received', 'system', 'outbid_warning')),
  is_read INTEGER NOT NULL DEFAULT 0,
  link TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now', 'utc'))
);

-- 14. Reviews & Ratings
CREATE TABLE IF NOT EXISTS reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  reviewer_id INTEGER NOT NULL REFERENCES users(id),
  target_user_id INTEGER NOT NULL REFERENCES users(id),
  rating INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now', 'utc'))
);

-- 15. Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id INTEGER,
  details TEXT,
  ip_address TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now', 'utc'))
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_bids_auction ON bids(auction_id, amount DESC);
CREATE INDEX IF NOT EXISTS idx_auctions_status_end ON auctions(status, ends_at);
CREATE INDEX IF NOT EXISTS idx_products_seller ON products(seller_id);
CREATE INDEX IF NOT EXISTS idx_watchlist_user ON watchlist(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_orders_buyer ON orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_seller ON orders(seller_id);
