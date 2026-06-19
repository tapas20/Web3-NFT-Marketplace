/* ─── Enums ─── */
export enum Category {
  AUTOMOTIVE = "AUTOMOTIVE",
  WATCH = "WATCH",
  PROPERTY = "PROPERTY",
}

export enum ProductStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  SOLD = "SOLD",
}

export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}

export enum TransactionStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

/* ─── Models ─── */
export interface User {
  id: string;
  name: string;
  email: string;
  walletAddress?: string | null;
  image?: string | null;
  role: UserRole;
  isSuspended: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  category: Category;
  description: string;
  price: number;
  images: string[];
  status: ProductStatus;
  location: string;
  sellerId: string;
  seller?: User;
  blockchainListingId?: number | null;
  views: number;
  reviews?: Review[];
  averageRating?: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  userId: string;
  user?: User;
  productId: string;
  product?: Product;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  product?: Product;
}

export interface Transaction {
  id: string;
  buyerId: string;
  buyer?: User;
  sellerId: string;
  seller?: User;
  productId: string;
  product?: Product;
  txHash: string;
  blockchainTransactionId?: string | null;
  amount: number;
  status: TransactionStatus;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

/* ─── API Types ─── */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductFilters {
  search?: string;
  category?: Category;
  minPrice?: number;
  maxPrice?: number;
  status?: ProductStatus;
  sort?: "latest" | "price_asc" | "price_desc";
  page?: number;
  limit?: number;
}

/* ─── Dashboard Stats ─── */
export interface DashboardStats {
  totalListings: number;
  soldListings: number;
  totalRevenue: number;
  totalViews: number;
}

export interface AdminStats {
  totalUsers: number;
  totalListings: number;
  totalTransactions: number;
  totalRevenue: number;
  listingsPerCategory: Record<Category, number>;
}

/* ─── Navigation ─── */
export interface NavItem {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
}
