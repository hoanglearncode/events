export interface Price {
  amount: number;
  originalAmount: number;
  currency: "VND" | "USD";
}

export interface Product {
  name: string;
  slug: string;
  categoryId: number;
  prices: Price[];
  inventoryType: "UNLIMITED" | "LIMITED";
  inventoryCount: number;
  visibility: "VISIBLE" | "HIDDEN";
  seoDescription: string;
  detailedDescription: string;
  thumbnailUrl: string;
  galleryUrls: string[];
  supportEmail: string;
  detailJson: string;
  saveDraft: boolean;
}

export interface ValidationError {
  field: string;
  message: string;
}

// types/product.ts
export interface ProductPrice {
  amount: number;
  originalAmount: number;
  currency: string;
}

export interface ProductSupport {
  email: string;
  telegram: string | null;
}

export interface ProductStats {
  downloads?: number;
  rating?: number;
  reviews?: number;
}

export interface ProductMeta {
  name: string;
  slug: string;
  seoDescription: string;
  thumbnailUrl: string;
  galleryUrls: string[];
  productType: string | null;
  prices: ProductPrice[];
  inventoryType: "LIMITED" | "UNLIMITED";
  inventoryCount: number;
  categoryName: string;
  categorySlug: string;
  sellerName: string;
  stats: ProductStats | null;
  support: ProductSupport;
  visibility: "visible" | "hidden";
}

export interface SchemaField {
  id: string;
  type: string;
  label: string;
  value: string | number | boolean;
}

export interface SchemaSection {
  id: string;
  label: string;
  fields: SchemaField[];
}

export interface Product {
  id: number;
  status: "active" | "inactive" | "draft";
  meta: ProductMeta;
  schema: SchemaSection[];
  createdAt: string;
  updatedAt: string;
}

// Helper function để lấy version từ schema
export const getProductVersion = (product: Product): any => {};

// Helper function để lấy giá theo currency
export const getProductPrice = (
  product: Product,
  currency: "VND" | "USD" = "VND"
): ProductPrice | undefined => {
  return product.meta.prices.find((p) => p.currency === currency);
};

// Helper function để format giá
export const formatPrice = (price: ProductPrice): string => {
  if (price.currency === "VND") {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(price.amount);
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(price.amount);
};

// Helper function để tính % giảm giá
export const getDiscountPercentage = (price: ProductPrice): number => {
  if (price.originalAmount <= price.amount) return 0;
  return Math.round(
    ((price.originalAmount - price.amount) / price.originalAmount) * 100
  );
};
