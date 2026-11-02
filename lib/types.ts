export type Product = {
  id: number;
  handle: string;
  title: string;
  category: string;
  price: number;
  compareAtPrice: number | null;
  sku: string;
  stock: number;
  sizes: string[];
  colors: string[];
  collections: string[];
  description: string;
  lead: string;
  highlights: string[];
  images: string[];
  featured: boolean;
  active: boolean;
  badge: string | null;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
};

export type Collection = {
  id: number;
  handle: string;
  title: string;
  description: string;
  image: string;
  sortOrder: number;
  active: boolean;
  productCount?: number;
};

export type CartItem = {
  key: string;
  productId: number;
  handle: string;
  title: string;
  image: string;
  price: number;
  compareAtPrice: number | null;
  size: string;
  color: string;
  qty: number;
  stock: number;
};

export type OrderItem = {
  productId: number;
  handle: string;
  title: string;
  image: string;
  price: number;
  size: string;
  color: string;
  qty: number;
};

export type Address = {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
};

export type Order = {
  id: number;
  orderNumber: string;
  accessToken: string;
  customerName: string;
  email: string;
  phone: string;
  address: Address;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  codFee: number;
  total: number;
  couponCode: string | null;
  paymentMethod: string;
  paymentStatus: "paid" | "pending" | "failed" | "refunded";
  paymentId: string | null;
  status:
    | "placed"
    | "confirmed"
    | "packed"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "returned";
  notes: string;
  createdAt: string;
  updatedAt: string;
};

export type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: "admin" | "customer";
  createdAt: string;
};

export type Coupon = {
  id: number;
  code: string;
  type: "percent" | "fixed";
  value: number;
  minSubtotal: number;
  maxUses: number;
  usedCount: number;
  active: boolean;
  expiresAt: string | null;
  createdAt: string;
};

export type Review = {
  id: number;
  productId: number;
  name: string;
  rating: number;
  title: string;
  body: string;
  approved: boolean;
  createdAt: string;
};

export type Message = {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: "new" | "read" | "replied";
  createdAt: string;
};

export type Subscriber = {
  id: number;
  email: string;
  createdAt: string;
};

export type StoreSettings = {
  storeName: string;
  announcement: string;
  email: string;
  phone: string;
  address: string;
  instagram: string;
  freeShippingThreshold: number;
  shippingFee: number;
  codFee: number;
  codEnabled: boolean;
  paymentMode: "demo";
  razorpayTestKey: string;
  gstin: string;
};
