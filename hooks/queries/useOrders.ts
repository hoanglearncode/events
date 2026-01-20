// hooks/useOrders.ts

import { useState, useEffect, useCallback } from "react";
import {
  Order,
  OrderDetail,
  OrdersStats,
  OrdersFilter,
  OrderActionPayload,
} from "@/types/order";
import { ordersService } from "@/services/order.service";
import { toast } from "sonner";

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<OrdersStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState<OrdersFilter>({
    status: "all",
    search: "",
    page: 1,
    limit: 10,
  });

  // Fetch orders
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await ordersService.getOrders(filters);

      setOrders(response.data);
      setPagination({
        page: response.page,
        limit: response.limit,
        total: response.total,
        totalPages: response.totalPages,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch orders";
      setError(errorMessage);
      toast.error("Lỗi");
    } finally {
      setLoading(false);
    }
  }, [filters, toast]);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      const statsData = await ordersService.getOrdersStats();
      setStats(statsData);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  }, []);

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<OrdersFilter>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page:
        newFilters.status !== prev.status || newFilters.search !== prev.search
          ? 1
          : newFilters.page || prev.page,
    }));
  }, []);

  // Search orders
  const searchOrders = useCallback(
    (searchTerm: string) => {
      updateFilters({ search: searchTerm, page: 1 });
    },
    [updateFilters]
  );

  // Filter by status
  const filterByStatus = useCallback(
    (status: string) => {
      updateFilters({
        status: status === "Tất cả" ? "all" : (status as any),
        page: 1,
      });
    },
    [updateFilters]
  );

  // Change page
  const changePage = useCallback(
    (page: number) => {
      updateFilters({ page });
    },
    [updateFilters]
  );

  // Refresh data
  const refresh = useCallback(() => {
    fetchOrders();
    fetchStats();
  }, [fetchOrders, fetchStats]);

  // Initial fetch
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    orders,
    stats,
    loading,
    error,
    pagination,
    filters,
    updateFilters,
    searchOrders,
    filterByStatus,
    changePage,
    refresh,
  };
}

export function useOrderDetail(orderId: string | null) {
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrderDetail = useCallback(async () => {
    if (!orderId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await ordersService.getOrderDetail(orderId);
      setOrder(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch order detail";
      setError(errorMessage);
      toast.error("Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  }, [orderId, toast]);

  useEffect(() => {
    fetchOrderDetail();
  }, [fetchOrderDetail]);

  return { order, loading, error, refresh: fetchOrderDetail };
}

export function useOrderActions() {
  const [loading, setLoading] = useState(false);

  const fulfillOrder = useCallback(
    async (payload: OrderActionPayload) => {
      try {
        setLoading(true);
        await ordersService.fulfillOrder(payload);

        return true;
      } catch (err) {
        return false;
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  const refundOrder = useCallback(
    async (payload: OrderActionPayload) => {
      try {
        setLoading(true);
        await ordersService.refundOrder(payload);
        return true;
      } catch (err) {
        return false;
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  const cancelOrder = useCallback(
    async (payload: OrderActionPayload) => {
      try {
        setLoading(true);
        await ordersService.cancelOrder(payload);
        return true;
      } catch (err) {
        return false;
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  const exportOrders = useCallback(
    async (filters?: any) => {
      try {
        setLoading(true);
        const blob = await ordersService.exportOrders({
          filters,
          format: "csv",
        });

        // Download file
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `orders_${new Date().getTime()}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        return true;
      } catch (err) {
        return false;
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  const downloadInvoice = useCallback(
    async (orderId: string) => {
      try {
        setLoading(true);
        const blob = await ordersService.downloadInvoice(orderId);

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `invoice_${orderId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        return true;
      } catch (err) {
        return false;
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  return {
    loading,
    fulfillOrder,
    refundOrder,
    cancelOrder,
    exportOrders,
    downloadInvoice,
  };
}
