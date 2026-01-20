// services/product.service.ts
import { ProductStats } from "@/hooks/queries/useProductsQuery";
import { api } from "@/services/apiClient";
import { API_ENDPOINTS } from "@/shared/const/api";

export type Category = string;

export type Product = {
  id: string;
  title: string;
  description?: string;
  price?: number | string;
  sold?: number;
  category?: Category;
  featured?: boolean; // 👈 thêm field này
  [key: string]: any;
};

export type ListProductsParams = {
  q?: string;
  categoryId?: string;
  page: number;
  perPage: number;
};

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  perPage: number;
};

class ProductService {
  static async list(params?: ListProductsParams): Promise<any> {
    try {
      return await api.get(API_ENDPOINTS.PRODUCTS.LIST, { params });
    } catch (err: any) {
      throw new Error(err?.message || "Không thể tải danh sách sản phẩm");
    }
  }

  static async listPopular(params?: ListProductsParams): Promise<any> {
    try {
      return await api.get(`${API_ENDPOINTS.PRODUCTS.LIST}/popular`, {
        params,
      });
    } catch (err: any) {
      throw new Error(err?.message || "Không thể tải danh sách sản phẩm");
    }
  }

  static async listPending(params?: ListProductsParams): Promise<any> {
    try {
      return await api.get(`${API_ENDPOINTS.ADMIN.PRODUCTS.LIST}/pending`, {
        params,
      });
    } catch (err: any) {
      throw new Error(err?.message || "Không thể tải danh sách sản phẩm");
    }
  }

  static async adminList(params?: ListProductsParams): Promise<any> {
    try {
      return await api.get(API_ENDPOINTS.ADMIN.PRODUCTS.LIST, { params });
    } catch (err: any) {
      throw new Error(err?.message || "Không thể tải danh sách sản phẩm");
    }
  }

  // 👇 Method mới: lấy sản phẩm của tôi
  static async myProducts(params?: ListProductsParams): Promise<any> {
    try {
      return await api.get(API_ENDPOINTS.PRODUCTS.MY, { params });
    } catch (err: any) {
      throw new Error(err?.message || "Không thể tải sản phẩm của bạn");
    }
  }

  static async stats(params?: ListProductsParams): Promise<any> {
    try {
      return await api.get(API_ENDPOINTS.ADMIN.PRODUCTS.STATS, {
        params,
      } as any);
    } catch (err: any) {
      throw new Error(err?.message || "Không thể tải danh sách sản phẩm");
    }
  }

  static async detail(productId: string): Promise<any> {
    try {
      return await api.get(API_ENDPOINTS.PRODUCTS.DETAIL(productId));
    } catch (err: any) {
      throw new Error(err?.message || "Không thể tải chi tiết sản phẩm");
    }
  }

  static async detailSeller(productId: string): Promise<any> {
    try {
      return await api.get(API_ENDPOINTS.PRODUCTS.DETAILSELLER(productId));
    } catch (err: any) {
      throw new Error(err?.message || "Không thể tải chi tiết sản phẩm");
    }
  }

  static async create(payload: Partial<Product>): Promise<Product> {
    try {
      return await api.post(API_ENDPOINTS.ADMIN.PRODUCTS.CREATE, payload);
    } catch (err: any) {
      throw new Error(err?.message || "Tạo sản phẩm thất bại");
    }
  }

  static async update(
    productId: string,
    payload: Partial<Product>
  ): Promise<Product> {
    try {
      return await api.put(
        API_ENDPOINTS.ADMIN.PRODUCTS.UPDATE(productId),
        payload
      );
    } catch (err: any) {
      throw new Error(err?.message || "Cập nhật sản phẩm thất bại");
    }
  }

  static async delete(productId: string): Promise<void> {
    try {
      await api.delete(API_ENDPOINTS.ADMIN.PRODUCTS.DELETE(productId));
    } catch (err: any) {
      throw new Error(err?.message || "Xoá sản phẩm thất bại");
    }
  }

  static async approve(productId: string): Promise<Product> {
    try {
      return await api.put(API_ENDPOINTS.ADMIN.PRODUCTS.APPROVE(productId));
    } catch (err: any) {
      throw new Error(err?.message || "Duyệt sản phẩm thất bại");
    }
  }

  static async reject(productId: string, reason?: string): Promise<Product> {
    try {
      return await api.put(API_ENDPOINTS.ADMIN.PRODUCTS.REJECT(productId), {
        reason,
      });
    } catch (err: any) {
      throw new Error(err?.message || "Từ chối sản phẩm thất bại");
    }
  }

  // 👇 Method mới: cập nhật trạng thái featured
  static async setFeatured(
    productId: string,
    featured: boolean
  ): Promise<Product> {
    try {
      return await api.put(
        `${API_ENDPOINTS.ADMIN.PRODUCTS.F(productId)}?isPopular=${featured}`
      );
    } catch (err: any) {
      throw new Error(err?.message || "Cập nhật sản phẩm nổi bật thất bại");
    }
  }
}

export default ProductService;
