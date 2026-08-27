export type UserRole = 'customer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  created_at: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  display_order: number;
  active: boolean;
  item_count?: number;
}

export interface ProductAddon {
  id: string;
  name: string;
  price: number;
  available: boolean;
}

export type SpiceLevel = 'mild' | 'medium' | 'spicy';

export interface Product {
  id: string;
  category_id: string;
  category_slug?: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  original_price?: number;
  image_url: string;
  veg: boolean;
  spice_level: SpiceLevel;
  available: boolean;
  featured: boolean;
  bestseller: boolean;
  rating: number;
  rating_count: number;
  preparation_time_mins: number;
  ingredients?: string[];
  addons: ProductAddon[];
  calories?: string;
  created_at: string;
  updated_at?: string;
}

export interface CartCustomization {
  spice_level: SpiceLevel;
  addons: ProductAddon[];
  special_instructions?: string;
}

export interface CartItem {
  id: string; // Unique composite ID based on product ID and customizations
  product_id: string;
  product: Product;
  quantity: number;
  customization: CartCustomization;
  unit_price: number; // product.price + addon prices
  total_price: number; // unit_price * quantity
}

export interface Address {
  id: string;
  user_id: string;
  label: 'Home' | 'Work' | 'Other';
  address_line: string;
  landmark?: string;
  city: string;
  pincode: string;
  is_default: boolean;
}

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Preparing'
  | 'Ready'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export type PaymentMethod = 'whatsapp' | 'cod' | 'upi';

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  customizations: CartCustomization;
  subtotal: number;
  image_url?: string;
  veg: boolean;
}

export interface OrderStatusHistoryItem {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

export interface Order {
  id: string;
  order_number: string; // e.g. "ANN-7294"
  user_id?: string;
  customer_name: string;
  phone: string;
  email?: string;
  delivery_address: string;
  landmark?: string;
  city: string;
  pincode: string;
  delivery_instructions?: string;
  payment_method: PaymentMethod;
  items: OrderItem[];
  subtotal: number;
  delivery_fee: number;
  discount: number;
  discount_code?: string;
  total: number;
  status: OrderStatus;
  status_history: OrderStatusHistoryItem[];
  created_at: string;
  updated_at: string;
  whatsapp_sent?: boolean;
}

export interface RestaurantSettings {
  id: string;
  restaurant_name: string;
  tagline: string;
  logo_url: string;
  phone: string;
  email: string;
  address: string;
  landmark: string;
  city: string;
  pincode: string;
  whatsapp_number: string;
  delivery_fee: number;
  minimum_order: number;
  free_delivery_threshold: number;
  delivery_radius_km: number;
  open_time: string; // "07:00"
  close_time: string; // "23:00"
  is_open_override?: boolean; // true = force open, false = force closed, undefined = use time
  closed_message?: string;
  upi_id: string;
  announcement_banner?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  text: string;
  avatar_url?: string;
  favorite_dish: string;
  date: string;
}
