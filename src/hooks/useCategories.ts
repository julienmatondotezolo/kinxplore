/**
 * React Query hooks for Categories
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoriesApi } from "@/lib/api";
import { ParentCategoryWithSubcategories } from "@/types/api.types";

// Query keys
export const categoryKeys = {
  all: ["categories"] as const,
  lists: () => [...categoryKeys.all, "list"] as const,
  list: (filters?: Record<string, any>) => [...categoryKeys.lists(), filters] as const,
  details: () => [...categoryKeys.all, "detail"] as const,
  detail: (id: string) => [...categoryKeys.details(), id] as const,
};

/**
 * Hook to fetch all categories with their subcategories
 */
export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.lists(),
    queryFn: () => categoriesApi.getAll(),
    staleTime: 10 * 60 * 1000, // 10 minutes (categories change less frequently)
  });
}

/**
 * Hook to fetch a single category by ID
 */
export function useCategory(id: string) {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: () => categoriesApi.getById(id),
    enabled: !!id, // Only run query if id is provided
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook for category mutations (for future use - create, update, delete)
 * This is a placeholder for when you add POST/PUT/DELETE endpoints
 */
export function useCategoryMutation() {
  const queryClient = useQueryClient();

  const createCategory = useMutation({
    mutationFn: async (newCategory: Partial<ParentCategoryWithSubcategories>) => {
      // Placeholder - implement when backend endpoint is ready
      throw new Error("Create category endpoint not yet implemented");
    },
    onSuccess: () => {
      // Invalidate and refetch categories list
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
    },
  });

  const updateCategory = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<ParentCategoryWithSubcategories>;
    }) => {
      // Placeholder - implement when backend endpoint is ready
      throw new Error("Update category endpoint not yet implemented");
    },
    onSuccess: (_, variables) => {
      // Invalidate specific category and list
      queryClient.invalidateQueries({ queryKey: categoryKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
    },
  });

  const deleteCategory = useMutation({
    mutationFn: async (id: string) => {
      // Placeholder - implement when backend endpoint is ready
      throw new Error("Delete category endpoint not yet implemented");
    },
    onSuccess: () => {
      // Invalidate categories list
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
    },
  });

  return {
    createCategory,
    updateCategory,
    deleteCategory,
  };
}
