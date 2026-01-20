// services/orders.service.ts

import {
  Order,
  OrderDetail,
  OrdersStats,
  OrdersFilter,
  PaginatedOrders,
  OrderActionPayload,
  ExportCSVParams,
} from "@/types/order";

import { api } from "./apiClient";
import { API_ENDPOINTS } from "@/shared/const/api";
import Cookies from "js-cookie";
import { ACCESS_TOKEN } from "@/shared/const/cookie";
import axios from "axios";

export interface createOrder {
  productId: string | number;
  quantity: number;
  currency: "VND" | "USD";
  buyerContent?: string;
}

class OrdersService {
  async create(payload: createOrder) {
    const res = await api.post(API_ENDPOINTS.USER.ORDERS.CREATE, payload);
    return res.result;
  }

  // Buyer: Lịch sử mua hàng
  // Response trả về OrderHistoryResponse với vnd và usd groups
  async getPurchaseHistory(page = 0, size = 10) {
    const res = await axios.get(
      process.env.NEXT_PUBLIC_API_URL + "/api/orders/purchase-history",
      {
        headers: {
          Authorization: `Bearer ${Cookies.get(ACCESS_TOKEN)}`,
        },
        params: { page, size },
      }
    );
    return (
      res?.data || {
        vnd: { orders: [], pagination: {} },
        usd: { orders: [], pagination: {} },
      }
    );
  }

  // Dashboard stats for orders (user/seller view)
  async getDashboardStats() {
    try {
      const res = await axios.get(
        process.env.NEXT_PUBLIC_API_URL + "/api/orders/buyer/dashboard",
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(ACCESS_TOKEN)}`,
          },
        }
      );
      return res?.data?.result || {};
    } catch (error) {
      return {};
    }
  }

  // Seller: Lịch sử bán hàng
  // Response trả về OrderHistoryResponse với vnd và usd groups
  async getSalesHistory(page = 0, size = 10, keyword = "", status = "") {
    const params: any = { page, size };
    if (keyword) params.keyword = keyword;
    if (status && status !== "all") params.status = status;
    const res = await api.get(API_ENDPOINTS.USER.ORDERS.SALES_HISTORY, {
      params,
    });
    return (
      res.result || {
        vnd: { orders: [], pagination: {} },
        usd: { orders: [], pagination: {} },
      }
    );
  }

  // Seller: Xác nhận giao hàng
  // Accepts either an orderId string or a payload { orderId, deliveryContent }
  async confirmDelivery(
    payload: string | { orderId: string; deliveryContent?: string }
  ) {
    const orderId = typeof payload === "string" ? payload : payload.orderId;
    const body =
      typeof payload === "string"
        ? undefined
        : { deliveryContent: payload.deliveryContent };
    const res = await api.post(
      API_ENDPOINTS.USER.ORDERS.CONFIRM_DELIVERY(orderId),
      body
    );
    return res;
  }

  // Seller: Lấy đơn hàng theo sản phẩm
  async getOrdersByProduct(
    productId: string | number,
    status?: string,
    page = 0,
    size = 10
  ) {
    const params: any = { page, size };
    if (status && status !== "all") params.status = status;

    const res = await api.get(API_ENDPOINTS.USER.ORDERS.BY_PRODUCT(productId), {
      params,
    });
    return res.result || [];
  }
}

export const ordersService = new OrdersService();
