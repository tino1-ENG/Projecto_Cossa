import mongoose from 'mongoose';

// Connect to MongoDB
export async function connectMongoDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mozbid';
  try {
    await mongoose.connect(uri);
    console.log(`[MongoDB] Connected successfully to ${uri}`);
  } catch (err) {
    console.error(`[MongoDB] Connection error to ${uri}:`, err);
    throw err;
  }
}

// Counter schema for sequential auto-increment IDs
const CounterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});

export const Counter = mongoose.models.Counter || mongoose.model('Counter', CounterSchema);

export async function getNextSequence(sequenceName) {
  const canonicalMap = {
    bid: 'bids',
    bid_id: 'bids',
    bids: 'bids',
    order: 'orders',
    order_id: 'orders',
    orders: 'orders',
    payment: 'payments',
    payment_id: 'payments',
    payments: 'payments',
    delivery: 'deliveries',
    delivery_id: 'deliveries',
    deliveries: 'deliveries',
    notification: 'notifications',
    notification_id: 'notifications',
    notifications: 'notifications',
    audit_log: 'audit_logs',
    audit_log_id: 'audit_logs',
    audit_logs: 'audit_logs',
    user: 'users',
    user_id: 'users',
    users: 'users',
    product: 'products',
    product_id: 'products',
    products: 'products',
    auction: 'auctions',
    auction_id: 'auctions',
    auctions: 'auctions',
    category: 'categories',
    category_id: 'categories',
    categories: 'categories'
  };
  const key = canonicalMap[sequenceName] || sequenceName;
  const counter = await Counter.findByIdAndUpdate(
    key,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
}

/* ==========================================================================
   1. USER MODEL
   ========================================================================== */
const UserSchema = new mongoose.Schema({
  id: { type: Number, unique: true, index: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, default: '' },
  password_hash: { type: String, required: true },
  role: { type: String, enum: ['buyer', 'seller', 'admin'], default: 'buyer', index: true },
  is_verified: { type: Boolean, default: false },
  balance: { type: Number, default: 0 }, // Integer in centavos (1 MZN = 100 centavos)
  city: { type: String, default: 'Maputo Cidade' },
  province: { type: String, default: 'Maputo Cidade' },
  avatar_url: { type: String, default: null },
  nuit: { type: String, default: null },
  company_name: { type: String, default: null },
  business_type: { type: String, enum: ['individual', 'company'], default: 'individual' },
  verified_status: { type: String, enum: ['unverified', 'pending', 'verified', 'rejected'], default: 'unverified' },
  rating: { type: Number, default: 5.0 },
  total_sales: { type: Number, default: 0 },
  bank_account_holder: { type: String, default: null },
  bank_name: { type: String, default: null },
  iban_or_account: { type: String, default: null }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

export const User = mongoose.models.User || mongoose.model('User', UserSchema);

/* ==========================================================================
   2. CATEGORY MODEL
   ========================================================================== */
const CategorySchema = new mongoose.Schema({
  id: { type: Number, unique: true, index: true },
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: true },
  description: { type: String, default: '' },
  icon: { type: String, default: 'category' },
  display_order: { type: Number, default: 0 },
  is_active: { type: Boolean, default: true }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

export const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);

/* ==========================================================================
   3. PRODUCT MODEL
   ========================================================================== */
const ProductImageSchema = new mongoose.Schema({
  image_url: { type: String, required: true },
  is_primary: { type: Boolean, default: false },
  display_order: { type: Number, default: 0 }
}, { _id: false });

const ProductSchema = new mongoose.Schema({
  id: { type: Number, unique: true, index: true },
  seller_id: { type: Number, required: true, index: true },
  category_id: { type: Number, required: true, index: true },
  title: { type: String, required: true, index: 'text' },
  description: { type: String, default: '' },
  brand: { type: String, default: '', index: true },
  model: { type: String, default: '' },
  year: { type: Number, default: 2023 },
  condition: { type: String, default: 'used_good' },
  location_province: { type: String, default: 'Maputo Cidade', index: true },
  location_city: { type: String, default: 'Maputo' },
  mileage_or_hours: { type: String, default: null },
  fuel_type: { type: String, default: null },
  transmission: { type: String, default: null },
  vin: { type: String, default: null },
  specifications: { type: Map, of: String, default: {} },
  images: [ProductImageSchema]
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

export const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

/* ==========================================================================
   4. AUCTION MODEL
   ========================================================================== */
const AuctionSchema = new mongoose.Schema({
  id: { type: Number, unique: true, index: true },
  product_id: { type: Number, required: true, index: true },
  seller_id: { type: Number, required: true, index: true },
  status: {
    type: String,
    enum: ['draft', 'pending_approval', 'active', 'paused', 'ended', 'sold', 'awaiting_payment', 'unsold', 'cancelled'],
    default: 'active',
    index: true
  },
  starting_price: { type: Number, required: true }, // in centavos
  reserve_price: { type: Number, default: null }, // in centavos
  current_price: { type: Number, required: true }, // in centavos
  bid_increment: { type: Number, default: 100000 }, // in centavos
  bid_count: { type: Number, default: 0 },
  starts_at: { type: Date, required: true, index: true },
  ends_at: { type: Date, required: true, index: true },
  winner_id: { type: Number, default: null, index: true },
  auto_extend_count: { type: Number, default: 0 }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

export const Auction = mongoose.models.Auction || mongoose.model('Auction', AuctionSchema);

/* ==========================================================================
   5. BID MODEL
   ========================================================================== */
const BidSchema = new mongoose.Schema({
  id: { type: Number, unique: true, index: true },
  auction_id: { type: Number, required: true, index: true },
  bidder_id: { type: Number, required: true, index: true },
  bidder_name: { type: String, default: null },
  amount: { type: Number, required: true }, // in centavos
  is_auto: { type: Boolean, default: false }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

export const Bid = mongoose.models.Bid || mongoose.model('Bid', BidSchema);

/* ==========================================================================
   6. AUTO BID MODEL (PROXY BIDDING)
   ========================================================================== */
const AutoBidSchema = new mongoose.Schema({
  auction_id: { type: Number, required: true, index: true },
  user_id: { type: Number, required: true, index: true },
  max_amount: { type: Number, required: true }, // in centavos
  is_active: { type: Boolean, default: true }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

AutoBidSchema.index({ auction_id: 1, user_id: 1 }, { unique: true });
export const AutoBid = mongoose.models.AutoBid || mongoose.model('AutoBid', AutoBidSchema);

/* ==========================================================================
   7. WATCHLIST MODEL
   ========================================================================== */
const WatchlistSchema = new mongoose.Schema({
  user_id: { type: Number, required: true, index: true },
  auction_id: { type: Number, required: true, index: true }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

WatchlistSchema.index({ user_id: 1, auction_id: 1 }, { unique: true });
export const Watchlist = mongoose.models.Watchlist || mongoose.model('Watchlist', WatchlistSchema);

/* ==========================================================================
   8. ORDER MODEL
   ========================================================================== */
const OrderSchema = new mongoose.Schema({
  id: { type: Number, unique: true, index: true },
  auction_id: { type: Number, required: true, index: true },
  buyer_id: { type: Number, required: true, index: true },
  seller_id: { type: Number, required: true, index: true },
  total_amount: { type: Number, required: true }, // in centavos
  status: {
    type: String,
    enum: ['pending_payment', 'paid', 'processing', 'completed', 'cancelled'],
    default: 'pending_payment',
    index: true
  }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

export const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);

/* ==========================================================================
   9. PAYMENT MODEL
   ========================================================================== */
const PaymentSchema = new mongoose.Schema({
  id: { type: Number, unique: true, index: true },
  order_id: { type: Number, required: true, index: true },
  amount: { type: Number, required: true },
  method: { type: String, required: true }, // 'm-pesa', 'e-mola', 'bank_transfer'
  status: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'completed' },
  reference: { type: String, required: true },
  phone_number: { type: String, default: null },
  transaction_date: { type: Date, default: Date.now },
  notes: { type: String, default: null }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

export const Payment = mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);

/* ==========================================================================
   10. DELIVERY MODEL
   ========================================================================== */
const DeliverySchema = new mongoose.Schema({
  id: { type: Number, unique: true, index: true },
  order_id: { type: Number, required: true, index: true },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'failed'],
    default: 'processing'
  },
  tracking_number: { type: String, default: null },
  courier_name: { type: String, default: 'Transportadora Nacional MozBid' },
  address: { type: String, required: true },
  estimated_delivery: { type: Date, default: null },
  delivered_at: { type: Date, default: null },
  notes: { type: String, default: null }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

export const Delivery = mongoose.models.Delivery || mongoose.model('Delivery', DeliverySchema);

/* ==========================================================================
   11. NOTIFICATION MODEL
   ========================================================================== */
const NotificationSchema = new mongoose.Schema({
  id: { type: Number, unique: true, index: true },
  user_id: { type: Number, required: true, index: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: {
    type: String,
    enum: ['outbid', 'bid_placed', 'auction_won', 'auction_ended', 'payment_received', 'system', 'outbid_warning'],
    default: 'system'
  },
  is_read: { type: Boolean, default: false },
  link: { type: String, default: null }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

export const Notification = mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);

/* ==========================================================================
   12. AUDIT LOG MODEL
   ========================================================================== */
const AuditLogSchema = new mongoose.Schema({
  id: { type: Number, unique: true, index: true },
  user_id: { type: Number, default: null },
  user_name: { type: String, default: 'Sistema' },
  action: { type: String, required: true },
  details: { type: String, default: '' },
  ip_address: { type: String, default: '127.0.0.1' }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

export const AuditLog = mongoose.models.AuditLog || mongoose.model('AuditLog', AuditLogSchema);
