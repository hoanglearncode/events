// services/searchService.ts
import type { SearchResult } from "./SearchResult";

/**
 * Search products by query
 * TODO: Replace with actual API endpoint
 */
export async function searchProducts(query: string): Promise<SearchResult[]> {
  try {
    // TODO: Replace this URL with your actual API endpoint
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/search/best-selling?keyword=${query}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Add authentication headers if needed
          // Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Search failed");
    }

    const data = await response.json();

    // Adjust this based on your actual API response structure
    // Example: if API returns { data: { results: [...] } }
    return data.result;
  } catch (error) {
    console.error("Search service error:", error);
    throw error;
  }
}

/**
 * Search products with pagination
 * TODO: Implement if needed
 */
export async function searchProductsPaginated(
  query: string,
  page: number = 1,
  pageSize: number = 10
) {
  try {
    const response = await fetch(
      `/api/search?q=${encodeURIComponent(query)}&page=${page}&pageSize=${pageSize}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Search failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Search service error:", error);
    throw error;
  }
}
