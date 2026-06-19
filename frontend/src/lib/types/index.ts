export interface User {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
  phone?: string;
  createdAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  _count?: { products: number };
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  details?: string;
  price: number;
  comparePrice?: number | null;
  images: string[];
  sizes: string[];
  stock: number;
  featured: boolean;
  category: Category;
  categoryId?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  size: string;
}

export interface Cart {
  id: string;
  items: CartItem[];
}

export interface OrderItem {
  id: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  size: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus?: string;
  paymentMethod?: string;
  transferContent?: string;
  paidAt?: string | null;
  subtotal: number;
  shippingFee: number;
  total: number;
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  shippingCity: string;
  note?: string;
  createdAt: string;
  items: OrderItem[];
  user?: { name: string; email: string };
}

export interface PaymentInfo {
  bankAccountName: string;
  bankAccountNumber: string;
  bankName: string;
  storeName: string;
  qrUrl: string;
  transferContent: string;
  amount: number;
}

export interface OrderPaymentResponse {
  order: Order;
  payment: PaymentInfo;
}

export interface SiteSettings {
  bankAccountName: string;
  bankAccountNumber: string;
  bankName: string;
  storeName: string;
  shippingFee: number;
  sepayWebhookKey: string;
  webhookUrl: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
}

export interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
  pendingPayments: number;
  recentOrders: Order[];
}

export interface AdminUser extends User {
  createdAt: string;
  _count: { orders: number };
}

export interface RegisterInput {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

export interface CheckoutInput {
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  shippingCity: string;
  note?: string;
}

export interface ProductFormInput {
  name: string;
  slug: string;
  description: string;
  details?: string;
  price: number;
  comparePrice?: number;
  images: string[];
  sizes: string[];
  stock: number;
  featured?: boolean;
  categoryId: string;
}
