import { useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { PublicBlogService } from "@/services/publicBlog.service";

export function useBlogQuery(initialPerPage = 10) {
  // ✅ Bắt đầu từ 0 để đồng bộ với logic Tools/Products của bạn
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(initialPerPage);
  const [category, setCategory] = useState("all");

  const { data, isLoading, error } = useQuery({
    queryKey: ["public-blogs", page, perPage, category],
    queryFn: async () => {
      // ✅ Chuyển đổi: frontend 0-based -> API 1-based (nếu API yêu cầu 1)
      // Nếu API của bạn cũng dùng 0-based thì giữ nguyên page
      const apiPage = page;

      const response = await PublicBlogService.getPosts({
        page: apiPage,
        perPage,
        category: category === "all" ? "" : category,
      });

      return {
        result: response?.result || response?.items || [],
        pagination: response?.pagination || { total: 0, last_page: 0 },
      };
    },
    placeholderData: (prev) => prev,
    staleTime: 30000,
  });

  // Lấy danh sách bài viết nổi bật (thường cố định hoặc lấy trang đầu)
  const { data: featuredPosts = [] } = useQuery({
    queryKey: ["featured-blogs"],
    queryFn: async () => {
      const res = await PublicBlogService.getFeaturedPosts();
      return res?.result || res?.items || [];
    },
    staleTime: 300000,
  });

  const setCategoryAndReset = useCallback((cat: string) => {
    setCategory(cat);
    setPage(0); // Reset về trang 0 khi đổi danh mục
  }, []);

  return {
    posts: data?.result || [],
    featuredPosts,
    pagination: data?.pagination,
    totalPages: data?.pagination?.last_page || 0,
    page,
    setPage,
    category,
    setCategory: setCategoryAndReset,
    isLoading,
  };
}
