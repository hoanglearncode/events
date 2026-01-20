// hooks/feature/use-tool.ts
import { useState, useMemo, useEffect } from "react";
import { useCategories, type Category } from "@/hooks/queries/useCategories";
import { useProductsQuery } from "@/hooks/queries/useProductsQuery";

export interface ToolCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  productCount: number;
}

export const useToolCategories = () => {
  const { categories, isLoading, error } = useCategories();

  const toolCategoriesData = useMemo(() => {
    if (!categories || categories.length === 0) {
      return {
        toolsCategory: null,
        subCategories: [],
        allCategoryIds: [],
      };
    }

    const toolsCategory = categories.find(
      (cat) => cat.name === "Tools" || cat.slug.toLowerCase().includes("tool")
    );

    if (!toolsCategory) {
      return {
        toolsCategory: null,
        subCategories: [],
        allCategoryIds: [],
      };
    }

    const subCategories: ToolCategory[] = toolsCategory.children
      ? toolsCategory.children.map((child) => ({
          id: child.id,
          name: child.name,
          slug: child.slug,
          description: child.description || "",
          productCount: child.productCount,
        }))
      : [];

    const allCategoryIds = [
      toolsCategory.id,
      ...subCategories.map((sub) => sub.id),
    ];

    return {
      toolsCategory: {
        id: toolsCategory.id,
        name: toolsCategory.name,
        slug: toolsCategory.slug,
        description: toolsCategory.description || "",
        productCount: toolsCategory.productCount,
      } as ToolCategory,
      subCategories,
      allCategoryIds,
    };
  }, [categories]);

  return {
    ...toolCategoriesData,
    isLoading,
    error,
  };
};

export const useToolsFilter = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeCategoryId, setActiveCategoryId] = useState<string>("all");

  const {
    toolsCategory,
    subCategories,
    isLoading: categoriesLoading,
  } = useToolCategories();

  const {
    products,
    isLoading: productsLoading,
    setCategory,
    setQuery,
    setPerPage,
    page,
    setPage,
    pagination,
  } = useProductsQuery();

  // ✅ FIX 1: Bỏ setCategory khỏi dependencies vì nó stable rồi
  useEffect(() => {
    setCategory(activeCategoryId === "all" ? "" : activeCategoryId);
  }, [activeCategoryId]); // ✅ Chỉ phụ thuộc activeCategoryId

  // ✅ FIX 2: Bỏ setQuery và setPage khỏi dependencies
  useEffect(() => {
    const timer = setTimeout(() => {
      setQuery(searchQuery); // Đã stable với useCallback
      setPage(0); // Reset về page 0
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]); // ✅ Chỉ phụ thuộc searchQuery

  return {
    products,
    subCategories,
    searchQuery,
    activeCategoryId,
    isLoading: categoriesLoading || productsLoading,
    page,
    pagination,
    setSearchQuery,
    setActiveCategoryId,
    setPage,
    setPerPage,
  };
};
