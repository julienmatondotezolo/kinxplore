/**
 * API Client for Kinxplore Backend
 */

import { DestinationWithCategories, ParentCategoryWithSubcategories } from "@/types/api.types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: any,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(errorData.message || `HTTP error! status: ${response.status}`, response.status, errorData);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(error instanceof Error ? error.message : "An unknown error occurred");
  }
}

// Destinations API
export const destinationsApi = {
  getAll: () => fetchApi<DestinationWithCategories[]>("/destinations"),

  getById: (id: string) => fetchApi<DestinationWithCategories>(`/destinations/${id}`),
};

// Categories API
export const categoriesApi = {
  getAll: () => fetchApi<ParentCategoryWithSubcategories[]>("/categories"),

  getById: (id: string) => fetchApi<ParentCategoryWithSubcategories>(`/categories/${id}`),
};

export { ApiError };
