import { api } from "./apiClient";
import { API_ENDPOINTS } from "@/shared/const/api";

export interface AdminBlogPostResponse {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  thumbnailUrl: string;
  postStatus: string;
  typeStatus: string;
  isFeatured: boolean;
  view: number;
  readingTime: string;
  createdAt: string;
  authorName: string;
  authorAvatar: string;
}

export const AdminBlogService = {
  async getAll(params: any = {}) {
    const res = await api.get(`${process.env.NEXT_PUBLIC_API_URL}/api/blog`, {
      params,
    });
    return res;
  },

  async getAllPending(params: any = {}) {
    const res = await api.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/blog/admin/pending`,
      { params }
    );
    return res;
  },

  async deletePost(id: number) {
    const res = await api.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/api/blog/${id}`
    );
    return res;
  },

  async approvePost(id: number, approved: boolean) {
    const res = await api.put(
      `${process.env.NEXT_PUBLIC_API_URL}/api/blog/admin/${id}/approve?approved=${approved}`
    );
    return res;
  },

  async toggleFeatured(id: number) {
    const res = await api.put(
      `${process.env.NEXT_PUBLIC_API_URL}/api/blog/admin/${id}/feature`
    );
    return res;
  },
};
