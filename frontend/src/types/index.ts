// Domain types mirroring the SQLite backend entities

export type UserRole = 'buyer' | 'seller' | 'admin';
export type BusinessType = 'individual' | 'company';
export type SellerVerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected';
export type AuctionStatus = 'upcoming' | 'active' | 'ended' | 'sold' | 'unsold' | 'awaiting_payment';
export type OrderStatus = 'pending_payment' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentMethod = 'm-pesa' | 'e-mola' | 'conta_movel' | 'bank_transfer' | 'card';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type DeliveryStatus = 'pending' | 'in_transit' | 'delivered' | 'returned';

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  is_verified: number;
  balance: number; // centavos MZN
  avatar_url?: string;
  city?: string;
  province?: string;
  created_at: string;
  sellerProfile?: SellerProfile | null;
  unreadNotificationsCount?: number;
  watchlistCount?: number;
}

export interface SellerProfile {
  id: number;
  user_id: number;
  company_name?: string;
  nuit?: string;
  business_type: BusinessType;
  verified_status: SellerVerificationStatus;
  rating: number;
  total_sales: number;
  address?: string;
  bank_name?: string;
  bank_account?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string;
  description?: string;
  featured: number;
  active_auctions_count?: number;
}

export interface ProductImage {
  id: number;
  product_id: number;
  image_url: string;
  is_primary: number;
  display_order: number;
}

export interface Product {
  id: number;
  seller_id: number;
  category_id: number;
  category_name?: string;
  category_slug?: string;
  title: string;
  description: string;
  brand?: string;
  model?: string;
  year?: number;
  condition: 'new' | 'used_like_new' | 'used_good' | 'used_fair' | 'refurbished';
  mileage_or_hours?: string;
  fuel_type?: string;
  transmission?: string;
  location_province: string;
  location_city: string;
  specifications_json?: string;
  specifications?: Record<string, string>;
  status: 'draft' | 'pending_approval' | 'approved' | 'rejected' | 'archived';
  images?: ProductImage[];
  primary_image?: string;
  created_at: string;
}

export interface Auction {
  id: number;
  product_id: number;
  seller_id: number;
  seller_name?: string;
  seller_company_name?: string;
  seller_display_name?: string;
  seller_verified_status?: SellerVerificationStatus;
  seller_rating?: number;
  seller_total_sales?: number;
  seller_nuit?: string;
  title: string;
  subtitle?: string;
  vin?: string;
  description?: string;
  brand?: string;
  model?: string;
  year?: number;
  condition?: string;
  mileage_or_hours?: string;
  fuel_type?: string;
  transmission?: string;
  location_province: string;
  location_city: string;
  category_id: number;
  category_name?: string;
  category_slug?: string;
  status: AuctionStatus;
  starting_price: number; // centavos MZN
  reserve_price?: number | null; // centavos MZN
  reserve_met?: boolean;
  current_price: number; // centavos MZN
  bid_increment: number; // centavos MZN
  bid_count: number;
  min_next_bid: number; // centavos MZN
  starts_at: string;
  ends_at: string;
  winner_id?: number | null;
  is_leading?: boolean;
  is_watchlisted?: boolean;
  auto_extend_count?: number;
  primary_image: string;
  images?: ProductImage[];
  specifications?: Record<string, string>;
  user_auto_bid?: number | null;
  bids?: Bid[];
  similar_auctions?: Auction[];
  created_at: string;
}

export interface Bid {
  id: number;
  auction_id: number;
  bidder_id: number;
  bidder_name?: string;
  bidder_alias: string;
  amount: number; // centavos MZN
  is_auto: boolean;
  is_me?: boolean;
  created_at: string;
}

export interface Order {
  id: number;
  auction_id: number;
  buyer_id: number;
  seller_id: number;
  total_amount: number; // centavos MZN
  status: OrderStatus;
  created_at: string;
  title?: string;
  primary_image?: string;
  buyer_name?: string;
  seller_name?: string;
  payment?: Payment;
  delivery?: Delivery;
}

export interface Payment {
  id: number;
  order_id: number;
  user_id: number;
  amount: number; // centavos MZN
  method: PaymentMethod;
  status: PaymentStatus;
  reference: string;
  phone_number?: string;
  created_at: string;
}

export interface Delivery {
  id: number;
  order_id: number;
  tracking_number: string;
  status: DeliveryStatus;
  carrier: string;
  delivery_address: string;
  estimated_date?: string;
  created_at: string;
}

export interface Notification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  type: 'outbid' | 'bid_placed' | 'auction_won' | 'auction_ended' | 'payment_received' | 'system' | 'outbid_warning';
  is_read: number;
  link?: string;
  created_at: string;
}
