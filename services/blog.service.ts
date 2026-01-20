// /services/category.service.ts
import { api } from "./apiClient";
import { API_ENDPOINTS } from "@/shared/const/api";
import type { Category } from "@/hooks/queries/useCategories";

export interface BlogPostResponse {
  id: string;
  title: string;
  createdAt: string;
  // Add other fields as needed
}

export const BlogService = {
  async getMyPosts(keyword: string = "", page: number = 0, size: number = 10) {
    const params: any = { page, size };
    if (keyword) params.keyword = keyword;
    const res = await api.get(API_ENDPOINTS.USER.BLOG.MY_POSTS, { params });
    return res;
  },
  async getPostBySlug(slug: string) {
    // Lấy chi tiết bài viết theo slug
    return api.get(API_ENDPOINTS.USER.BLOG.DETAIL(slug));
  },
  async updatePost(slug: string, data: any) {
    // Cập nhật bài viết theo slug
    return api.put(API_ENDPOINTS.USER.BLOG.DETAIL(slug), data);
  },
  async deletePost(id: string) {
    return api.delete(API_ENDPOINTS.USER.BLOG.DELETE(id));
  },
};
