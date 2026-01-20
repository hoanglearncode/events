import { HttpStatusCode } from "axios";

// API Configuration Constants
export const API_CONFIG = {
  BASE_URL: (process.env.NEXT_PUBLIC_API_URL || "") + "/api",
  TIMEOUT: 300000,
  RETRIES: 0,
  RETRY_DELAY: 2000,
} as const;

// Error Messages
// TODO: using key for translation
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Lỗi kết nối mạng",
  TIMEOUT_ERROR: "Yêu cầu hết thời gian chờ",
  GENERIC_ERROR: "Đã xảy ra lỗi",
  UNAUTHORIZED: "Không có quyền truy cập",
  TOKEN_EXPIRED: "Phiên làm việc đã hết hạn",
} as const;

// Retryable Status Codes
export const RETRYABLE_STATUS_CODES = [
  HttpStatusCode.RequestTimeout,
  HttpStatusCode.TooManyRequests,
  HttpStatusCode.InternalServerError,
  HttpStatusCode.BadGateway,
  HttpStatusCode.ServiceUnavailable,
  HttpStatusCode.GatewayTimeout,
] as const;

// Helper Types for Query Parameters
export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
}

export interface SearchParams {
  search?: string;
  category?: string;
  tags?: string[];
  status?: string;
}

export interface DateRangeParams {
  from?: string;
  to?: string;
}

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REFRESH: "/auth/refresh",
    PROFILE: "/auth/me",
    PROFILE_UPDATE: "/users",
    PROFILE_DETAILS: "/users/detail",
    GOOGLE_LOGIN: "/auth/google/callback",
    REGISTER: "/auth/register",
    VERIFY_EMAIL: "/auth/verify",
    RESEND_VERIFICATION_EMAIL: (email: string) =>
      `/auth/resend-verification?email=${email}`,
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password-confirm",
    CHANGE_PASSWORD: "/auth/change-password",
  },
  CATEGORIES: {
    LIST: "/categories",
    FEE: (categoryId: string) => `/category/${categoryId}/fee`,
    CREATE: "/admin/categories",
    UPDATE: (categoryId: string | number) => `/admin/categories/${categoryId}`,
    DELETE: (categoryId: string) => `/admin/categories/${categoryId}`,
    REORDER: "/admin/categories/reorder",
  },
  PRODUCTS: {
    LIST: "/products",
    DETAIL: (productId: string) => `/products/${productId}`,
    DETAILSELLER: (productId: string) => `/products/edit/${productId}`,
    MY: "/my-products",
  },
  PAY: {
    PAYOS_CREATE: "/payments/payos/create",
    PAYPAL_CREATE: "/payments/paypal/create",
    WITHDRAW: "/payments/withdraw",
    BANKS: "/payments/banks",
    WALLETS: (userId: string) => `/payments/wallet/${userId}`,
    PAYMENT_INFOS: (userId: string) => `/payments/info/${userId}`,
    PAYMENT_INFO_ADD: "/payments/info/add",
    PAYMENT_INFO_DELETE: (infoId: string) => `/payments/info/${infoId}`,
    TRANSACTIONS: (userId: string) => `/payments/transactions/${userId}`,
    TRANSACTION: (transactionId: string) =>
      `/payments/transactions/${transactionId}`,
    VERIFY: (transactionId: string) => `/payments/verify/${transactionId}`,
  },

  WITHDRAWAL: "/withdraw",

  PUBLIC: {
    BLOG: {
      FEATURED: "/public/blog/featured",
      LIST: "/blog", // tích hợp search - lọc đa chức năng
      DETAIL: (slug: string) => `/public/blog/${slug}`,
      // CATEGORIES: "/public/blog/categories",
      // TAGS: "/public/blog/tags",
      // RELATED: (postId: string) => `/public/blog/${postId}/related`,
      // POPULAR: "/public/blog/popular",
      // SEARCH: "/public/blog/search",
    },

    TOOLS: {
      LIST: "/public/tools", // tích hợp search lọc đa chức năng
      DETAIL: (slug: string) => `/public/tools/${slug}`,
      CATEGORIES: "/public/tools/categories",
      FEATURED: "/public/tools/featured",
      // POPULAR: "/public/tools/popular",
      // SEARCH: "/public/tools/search",
    },

    MARKET: {
      LIST: "/public/market", // tích hợp search lọc đa chức năng
      DETAIL: (slug: string) => `/public/market/${slug}`,
      CATEGORIES: "/public/market/categories",
      FEATURED: "/public/market/featured",
      BEST_SELLING: "/public/market/best-selling",
      NEW_ARRIVALS: "/public/market/new-arrivals",
      // SEARCH: "/public/market/search",
      // REVIEWS: (productId: string) => `/public/market/${productId}/reviews`,
    },

    COURSES: {
      LATEST: "/public/courses/latest",
      FEATURED: "/public/courses/featured",
      LIST: "/public/courses", // tích hợp search lọc đa chức năng
      DETAIL: (slug: string) => `/public/courses/${slug}`,
      CATEGORIES: "/public/courses/categories",
      // POPULAR: "/public/courses/popular",
      // SEARCH: "/public/courses/search",
      // CURRICULUM: (courseId: string) => `/public/courses/${courseId}/curriculum`,
      // REVIEWS: (courseId: string) => `/public/courses/${courseId}/reviews`,
    },
  },

  USER: {
    BLOG: {
      MY_POSTS: "/blog/my-posts",
      CREATE: "/user/blog", // tích hợp các chế độ lưu đa dạng
      UPDATE: (postId: string) => `/blog/${postId}`,
      DETAIL: (slug: string) => `/blog/${slug}`,
      DELETE: (postId: string) => `/blog/${postId}`,
      SAVE: (postId: string) => `/blog/${postId}/save`,
      UNSAVE: (postId: string) => `/user/blog/${postId}/unsave`,
    },

    COURSES: {
      ENROLLED: "/user/courses/enrolled",
      PROGRESS: (courseId: string) => `/user/courses/${courseId}/progress`,
      COMPLETE_LESSON: (courseId: string, lessonId: string) =>
        `/user/courses/${courseId}/lessons/${lessonId}/complete`,
    },

    ORDERS: {
      LIST: "/user/orders",
      DETAIL: (orderId: string) => `/user/orders/${orderId}`,
      CREATE: "/orders/create",
      CANCEL: (orderId: string) => `/user/orders/${orderId}/cancel`,
      PURCHASE_HISTORY: "/orders/purchase-history",
      SALES_HISTORY: "/orders/sales-history",
      CONFIRM_DELIVERY: (orderId: string) =>
        `/orders/${orderId}/confirm-delivery`,
      BY_PRODUCT: (productId: string | number) =>
        `/orders/seller/product/${productId}`,
    },

    WISHLIST: {
      LIST: "/user/wishlist",
      ADD: "/user/wishlist",
      REMOVE: (itemId: string) => `/user/wishlist/${itemId}`,
    },

    NOTIFICATIONS: {
      MY: "/notifications/my",
      READ: (id: number) => `/notifications/${id}/read`,
      READ_ALL: "/notifications/read-all",
    },
  },

  // ==================== SELLER ====================
  SELLER: {
    // Registration
    REGISTER: "/users/role/seller-request",
    UN_REGISTER: "/users/role/seller-request",
    DETAIL: "/seller/shop",
    UPDATE: "/seller/shop",

    // Dashboard & Analytics
    DASHBOARD: {
      STATS: "/seller/dashboard/stats",
      RECENT_ACTIVITIES: "/seller/dashboard/activities",
      CHARTS: {
        REVENUE: "/seller/dashboard/charts/revenue",
        SALES: "/seller/dashboard/charts/sales",
        ORDERS: "/seller/dashboard/charts/orders",
        TRAFFIC: "/seller/dashboard/charts/traffic",
      },
    },

    // Products Management
    PRODUCTS: {
      LIST: "/seller/products",
      DETAIL: (productId: string) => `/seller/products/${productId}`,
      CREATE: "/seller/products",
      UPDATE: (productId: string) => `/seller/products/${productId}`,
      DELETE: (productId: string) => `/seller/products/${productId}`,
      STATS: "/seller/products/stats",
      BEST_SELLING: "/seller/products/best-selling",
      // LOW_STOCK: "/seller/products/low-stock",
      // UPLOAD_IMAGE: "/seller/products/upload-image",
      BULK: {
        UPDATE_STATUS: "/seller/products/bulk/status",
        DELETE: "/seller/products/bulk/delete",
      },
    },

    // Orders Management
    ORDERS: {
      LIST: "/seller/orders",
      DETAIL: (orderId: string) => `/seller/orders/${orderId}`,
      UPDATE: (orderId: string) => `/seller/orders/${orderId}`, // tích hợp cập nhật đa trạng thái
      BUYER_INFO: (orderId: string) => `/seller/orders/${orderId}/buyer`,
      // PROCESS: (orderId: string) => `/seller/orders/${orderId}/process`,
      // SHIP: (orderId: string) => `/seller/orders/${orderId}/ship`,
      // COMPLETE: (orderId: string) => `/seller/orders/${orderId}/complete`,
      // CANCEL: (orderId: string) => `/seller/orders/${orderId}/cancel`,
      CONFIRM: (orderId: string) => ` /orders/${orderId}/confirm-delivery`,
      STATS: "/seller/orders/stats",
      EXPORT: "/seller/orders/export",
    },

    // Transaction History
    TRANSACTIONS: {
      LIST: "/seller/transactions",
      DETAIL: (transactionId: string) =>
        `/seller/transactions/${transactionId}`,
      STATS: "/seller/transactions/stats",
      EXPORT: "/seller/transactions/export",
    },

    // Revenue Management
    REVENUE: {
      OVERVIEW: "/seller/revenue/overview",
      BALANCE: "/seller/revenue/balance",
      HISTORY: "/seller/revenue/history",
      ANALYTICS: "/seller/revenue/analytics",
    },

    // Withdrawal Requests
    WITHDRAWALS: {
      LIST: "/seller/withdrawals",
      CREATE: "/seller/withdrawals",
      DETAIL: (withdrawalId: string) => `/seller/withdrawals/${withdrawalId}`,
      CANCEL: (withdrawalId: string) =>
        `/seller/withdrawals/${withdrawalId}/cancel`,
      STATS: "/seller/withdrawals/stats",
      HISTORY: "/payments/history/withdrawals",
    },

    // Reports & Disputes
    REPORTS: {
      LIST: "/seller/reports",
      DETAIL: (reportId: string) => `/seller/reports/${reportId}`,
      RESPOND: (reportId: string) => `/seller/reports/${reportId}/respond`,
      RESOLVE: (reportId: string) => `/seller/reports/${reportId}/resolve`,
      STATS: "/seller/reports/stats",
    },

    // Notifications
    NOTIFICATIONS: {
      LIST: "/seller/notifications",
      UNREAD_COUNT: "/seller/notifications/unread-count",
      MARK_READ: (notificationId: string) =>
        `/seller/notifications/${notificationId}/read`,
      MARK_ALL_READ: "/seller/notifications/mark-all-read",
      DELETE: (notificationId: string) =>
        `/seller/notifications/${notificationId}`,
    },

    // Settings
    SETTINGS: {
      GET: "/seller/settings",
      UPDATE: "/seller/settings",
      PAYMENT_METHODS: "/seller/settings/payment-methods",
      SHIPPING: "/seller/settings/shipping",
      POLICIES: "/seller/settings/policies",
    },
  },

  // ==================== ADMIN ====================
  ADMIN: {
    // Users Management
    USERS: {
      LIST: "/admin/users/list",
      STATS: "/admin/users/stats",
      CREATE: "/admin/users/create",
      DETAIL: (userId: string) => `/admin/users/${userId}`,
      ACTIVATE: (userId: string) => `/admin/users/${userId}/activate`,
      DEACTIVATE: (userId: string) => `/admin/users/${userId}/deactivate`,
      BAN: (userId: string) => `/admin/users/${userId}/ban`,
      UNBAN: (userId: string) => `/admin/users/${userId}/unban`,
      DELETE: (userId: string) => `/admin/users/${userId}/delete`,
      RESET_PASSWORD: (userId: string) =>
        `/admin/users/${userId}/reset-password`,
      UPDATE: (userId: string) => `/admin/users/${userId}`,
      EXPORT: "/admin/users/export",
      BULK: {
        ACTIVATE: "/admin/users/bulk/activate",
        DEACTIVATE: "/admin/users/bulk/deactivate",
        DELETE: "/admin/users/bulk/delete",
      },
    },

    // Sellers Management
    SELLERS: {
      LIST: "/admin/seller/list",
      DETAIL: (userId: string) => `/admin/sellers/${userId}`,
      STATS: "/admin/sellers/stats",
      APPROVE: (userId: string) => `/admin/sellers/${userId}/approve`,
      REJECT: (userId: string) => `/admin/users/${userId}/reject`,
      BAN: (userId: string) => `/admin/sellers/${userId}/ban`,
      UNBAN: (userId: string) => `/admin/sellers/${userId}/unban`,
      DELETE: (userId: string) => `/admin/users/${userId}/delete`,
      HISTORY: (userId: string) => `/admin/sellers/${userId}/history`,
    },

    // Blog Management
    BLOG: {
      LIST: "/blog/admin/all",
      DETAIL: (postId: string) => `/admin/blog/${postId}`,
      CREATE: "/admin/blog",
      UPDATE: (postId: string) => `/admin/blog/${postId}`,
      DELETE: (postId: string) => `/admin/blog/${postId}`,
      APPROVE: (postId: string) => `/admin/blog/${postId}/approve`,
      REJECT: (postId: string) => `/admin/blog/${postId}/reject`,
      // HIDE: (postId: string) => `/admin/blog/${postId}/hide`,
      // SHOW: (postId: string) => `/admin/blog/${postId}/show`,
      // FEATURE: (postId: string) => `/admin/blog/${postId}/feature`,
      // UNFEATURE: (postId: string) => `/admin/blog/${postId}/unfeature`,
      STATS: "/admin/blog/stats",
      PENDING: "/admin/blog/pending",
      BULK: {
        APPROVE: "/admin/blog/bulk/approve",
        REJECT: "/admin/blog/bulk/reject",
        DELETE: "/admin/blog/bulk/delete",
      },
    },

    // Dashboard & Analytics
    DASHBOARD: {
      STATS: "/admin/dashboard/stats",
      RECENT_ACTIVITIES: "/admin/dashboard/activities",
      SYSTEM_HEALTH: "/admin/dashboard/health",
      CHARTS: {
        REVENUE: "/admin/dashboard/charts/revenue",
        SALES: "/admin/dashboard/charts/sales",
        USERS: "/admin/dashboard/charts/users",
        ORDERS: "/admin/dashboard/charts/orders",
        TRAFFIC: "/admin/dashboard/charts/traffic",
      },
    },

    // Products Management
    PRODUCTS: {
      LIST: "/admin/products",
      DETAIL: (productId: string) => `/products/${productId}`,
      CREATE: "/products",
      F: (productId: string) => `/admin/products/${productId}/popular`,
      UPDATE: (productId: string) => `/products/${productId}`,
      DELETE: (productId: string) => `/products/${productId}`,
      APPROVE: (productId: string) => `/admin/products/${productId}/approve`,
      REJECT: (productId: string) => `/admin/products/${productId}/reject`,
      // HIDE: (productId: string) => `/admin/products/${productId}/hide`,
      // SHOW: (productId: string) => `/admin/products/${productId}/show`,
      STATS: "/admin/stats",
      BEST_SELLING: "/admin/products/best-selling",
      PENDING: "/admin/products/pending",
      BULK: {
        UPDATE_STATUS: "/admin/products/bulk/status",
        DELETE: "/admin/products/bulk/delete",
      },
    },

    // Orders Management
    ORDERS: {
      LIST: "/admin/orders",
      DETAIL: (orderId: string) => `/admin/orders/${orderId}`,
      UPDATE: (orderId: string) => `/admin/orders/${orderId}`,
      CANCEL: (orderId: string) => `/admin/orders/${orderId}/cancel`,
      REFUND: (orderId: string) => `/admin/orders/${orderId}/refund`,
      BUYER_INFO: (orderId: string) => `/admin/orders/${orderId}/buyer`,
      SELLER_INFO: (orderId: string) => `/admin/orders/${orderId}/seller`,
      RESOLVE_DISPUTE: (orderId: string) =>
        `/admin/orders/${orderId}/resolve-dispute`,
      STATS: "/admin/orders/stats",
      EXPORT: "/admin/orders/export",
    },

    // Transaction Management
    TRANSACTIONS: {
      LIST: "/admin/transactions",
      DETAIL: (transactionId: string) => `/admin/transactions/${transactionId}`,
      DELETE: (transactionId: string) => `/admin/transactions/${transactionId}`,
      STATS: "/admin/transactions/stats",
      EXPORT: "/admin/transactions/export",
      BULK: {
        DELETE: "/admin/transactions/bulk/delete",
      },
    },

    // Revenue Management
    REVENUE: {
      OVERVIEW: "/admin/revenue/overview",
      PLATFORM_FEES: "/admin/revenue/platform-fees",
      HISTORY: "/admin/revenue/history",
      ANALYTICS: "/admin/revenue/analytics",
      BY_SELLER: "/admin/revenue/by-seller",
    },

    // Withdrawal Management
    WITHDRAWALS: {
      LIST: "/admin/withdrawals",
      DETAIL: (withdrawalId: string) => `/admin/withdrawals/${withdrawalId}`,
      APPROVE: (withdrawalId: string) =>
        `/admin/withdrawals/${withdrawalId}/approve`,
      REJECT: (withdrawalId: string) =>
        `/admin/withdrawals/${withdrawalId}/reject`,
      PROCESS: (withdrawalId: string) =>
        `/admin/withdrawals/${withdrawalId}/process`,
      COMPLETE: (withdrawalId: string) =>
        `/admin/withdrawals/${withdrawalId}/complete`,
      STATS: "/admin/withdrawals/stats",
      PENDING: "/admin/withdrawals/pending",
    },

    // Reports & Disputes
    REPORTS: {
      LIST: "/admin/reports",
      DETAIL: (reportId: string) => `/admin/reports/${reportId}`,
      ASSIGN: (reportId: string) => `/admin/reports/${reportId}/assign`,
      RESOLVE: (reportId: string) => `/admin/reports/${reportId}/resolve`,
      CLOSE: (reportId: string) => `/admin/reports/${reportId}/close`,
      STATS: "/admin/reports/stats",
      PENDING: "/admin/reports/pending",
    },

    NOTIFICATIONS: {
      CREATE: "/notifications/admin/broadcast",
    },

    // System Settings
    SETTINGS: (id: string) => `admin/category/${id}/fee`,

    // Resources Management (Images, Files, etc.)
    RESOURCES: {
      LIST: "/admin/resources",
      UPLOAD: "/admin/resources/upload",
      DELETE: (resourceId: string) => `/admin/resources/${resourceId}`,
      STATS: "/admin/resources/stats",
      BULK: {
        DELETE: "/admin/resources/bulk/delete",
      },
    },

    // Content Management (Public Pages)
    CONTENT: {
      PAGES: {
        LIST: "/admin/content/pages",
        DETAIL: (pageId: string) => `/admin/content/pages/${pageId}`,
        CREATE: "/admin/content/pages",
        UPDATE: (pageId: string) => `/admin/content/pages/${pageId}`,
        DELETE: (pageId: string) => `/admin/content/pages/${pageId}`,
        PUBLISH: (pageId: string) => `/admin/content/pages/${pageId}/publish`,
      },
      BANNERS: {
        LIST: "/admin/content/banners",
        CREATE: "/admin/content/banners",
        UPDATE: (bannerId: string) => `/admin/content/banners/${bannerId}`,
        DELETE: (bannerId: string) => `/admin/content/banners/${bannerId}`,
        REORDER: "/admin/content/banners/reorder",
      },
      FAQ: {
        LIST: "/admin/content/faq",
        CREATE: "/admin/content/faq",
        UPDATE: (faqId: string) => `/admin/content/faq/${faqId}`,
        DELETE: (faqId: string) => `/admin/content/faq/${faqId}`,
      },
    },

    // Categories Management

    // Courses Management
    COURSES: {
      LIST: "/admin/courses",
      DETAIL: (courseId: string) => `/admin/courses/${courseId}`,
      CREATE: "/admin/courses",
      UPDATE: (courseId: string) => `/admin/courses/${courseId}`,
      DELETE: (courseId: string) => `/admin/courses/${courseId}`,
      APPROVE: (courseId: string) => `/admin/courses/${courseId}/approve`,
      REJECT: (courseId: string) => `/admin/courses/${courseId}/reject`,
      STATS: "/admin/courses/stats",
    },

    // Tools Management
    TOOLS: {
      LIST: "/admin/tools",
      DETAIL: (toolId: string) => `/admin/tools/${toolId}`,
      CREATE: "/admin/tools",
      UPDATE: (toolId: string) => `/admin/tools/${toolId}`,
      DELETE: (toolId: string) => `/admin/tools/${toolId}`,
      APPROVE: (toolId: string) => `/admin/tools/${toolId}/approve`,
      REJECT: (toolId: string) => `/admin/tools/${toolId}/reject`,
      STATS: "/admin/tools/stats",
    },
  },
} as const;

// Content Types
export const CONTENT_TYPES = {
  JSON: "application/json",
  FORM_DATA: "multipart/form-data",
  URL_ENCODED: "application/x-www-form-urlencoded",
} as const;

// Helper function to build query string
export const buildQueryString = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      if (Array.isArray(value)) {
        value.forEach((item) => searchParams.append(key, String(item)));
      } else {
        searchParams.append(key, String(value));
      }
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
};
