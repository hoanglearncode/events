import { api } from "@/services/apiClient";
import { API_ENDPOINTS } from "@/shared/const/api";

export const PublicBlogService = {
  async getPosts(params = {}) {
    return api.get(API_ENDPOINTS.PUBLIC.BLOG.LIST, { params });
  },

  async getFeaturedPosts(params = {}) {
    return api.get(`${process.env.NEXT_PUBLIC_API_URL}/api/blog/featured`, {
      params,
    });
  },
};
