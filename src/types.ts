export type DiamondDuration = '1_month' | '3_months' | '1_year' | '2_years';
export type UserRole = 'customer' | 'admin';
export type OrderStatus = 'pending' | 'verified' | 'approved' | 'rejected' | 'activated';

export interface DiamondPlan {
  id: string;
  name: string;
  duration_label: string;
  duration_months: number;
  price: number;
  original_price: number;
  savings_percent: number;
  popular?: boolean;
  badge?: string;
  tagline: string;
  eligibility?: string;
  features: string[];
  deliverable: string;
}

export interface ChessFeature {
  id: string;
  title: string;
  category: string;
  description: string;
  badge?: string;
  icon_name: string;
  free_vs_diamond: {
    free: string;
    diamond: string;
  };
}

export interface User {
  user_id: string;
  full_name: string;
  email: string;
  chess_com_username?: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Order {
  order_id: string;
  user_id: string;
  user_email: string;
  user_name: string;
  chess_com_username: string;
  item_type: 'diamond_membership';
  item_id: string;
  item_title: string;
  amount: number;
  currency: string;
  payment_method: 'paypal' | 'paypal_me' | 'manual';
  payment_status: OrderStatus;
  paypal_transaction_id: string;
  activation_code?: string;
  activation_instructions?: string;
  notes?: string;
  rejection_reason?: string;
  verified_at?: string;
  created_at: string;
}

export interface ContactMessage {
  message_id: string;
  name: string;
  email: string;
  chess_com_username?: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  created_at: string;
}

export interface SiteSettings {
  site_name: string;
  tagline: string;
  currency: string;
  currency_symbol: string;
  paypal_me_username: string;
  paypal_username?: string;
  paypal_business_email: string;
  gas_api_url: string;
  use_gas_api: boolean;
  google_sheet_id: string;
  support_email: string;
  admin_notification_email: string;
  official_chess_url: string;
}

export interface ReviewItem {
  id: string;
  author: string;
  chess_username: string;
  rating: number;
  fide_rating?: string;
  comment: string;
  plan: string;
  date: string;
  verified_buyer: boolean;
}

export interface OwnerSecurityConfig {
  username: string;
  password: string;
  phone_number: string;
  last_updated: string;
}

export interface SmsNotice {
  id: string;
  to: string;
  code: string;
  purpose: 'login_2fa' | 'credential_change';
  timestamp: string;
  expires_at: number;
  message_text: string;
}
