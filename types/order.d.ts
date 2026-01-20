// types/orders.types.ts

export enum OrderStatus {
  PENDING = "Pending",
  PROCESSING = "Processing",
  FULFILLED = "Fulfilled",
  CANCELLED = "Cancelled",
  REFUNDED = "Refunded",
}

export interface Order {
  id: string;
  buyer: string;
  buyerEmail?: string;
  product: string;
  productId?: string;
  qty: number;
  amount: number;
  fee: number;
  payout: number;
  status: OrderStatus;
  date: string;
  createdAt: string;
  updatedAt?: string;
}

export interface OrderDetail extends Order {
  customer: {
    id: string;
    email: string;
    name?: string;
    phone?: string;
  };
  product: {
    id: string;
    name: string;
    thumbnail?: string;
    price: number;
  };
  timeline: OrderTimeline[];
  transactionId?: string;
  paymentMethod?: string;
  notes?: string;
}

export interface OrderTimeline {
  id: string;
  status: string;
  label: string;
  timestamp: string;
  description?: string;
  actor?: string;
}

export interface OrdersStats {
  totalRevenue: number;
  totalOrders: number;
  successfulOrders: number;
  totalProducts: number;
  totalCustomers: number;
  revenueGrowth: number;
  ordersGrowth: number;
  customersGrowth: number;
}

export interface OrdersFilter {
  status?: OrderStatus | "all";
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedOrders {
  data: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface OrderActionPayload {
  orderId: string;
  reason?: string;
  notes?: string;
}

export interface ExportCSVParams {
  filters?: OrdersFilter;
  format?: "csv" | "xlsx";
}
