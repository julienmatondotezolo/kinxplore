/**
 * React Query hooks for Destinations
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { destinationsApi } from "@/lib/api";
import { DestinationWithCategories } from "@/types/api.types";

// Query keys
export const destinationKeys = {
  all: ["destinations"] as const,
  lists: () => [...destinationKeys.all, "list"] as const,
  list: (filters?: Record<string, any>) => [...destinationKeys.lists(), filters] as const,
  details: () => [...destinationKeys.all, "detail"] as const,
  detail: (id: string) => [...destinationKeys.details(), id] as const,
};

/**
 * Hook to fetch all destinations
 */
export function useDestinations() {
  return useQuery({
    queryKey: destinationKeys.lists(),
    queryFn: () => destinationsApi.getAll(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch a single destination by ID
 */
export function useDestination(id: string) {
  return useQuery({
    queryKey: destinationKeys.detail(id),
    queryFn: () => destinationsApi.getById(id),
    enabled: !!id, // Only run query if id is provided
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook for destination mutations (for future use - create, update, delete)
 * This is a placeholder for when you add POST/PUT/DELETE endpoints
 */
export function useDestinationMutation() {
  const queryClient = useQueryClient();

  const createDestination = useMutation({
    mutationFn: async (newDestination: Partial<DestinationWithCategories>) => {
      // Placeholder - implement when backend endpoint is ready
      throw new Error("Create destination endpoint not yet implemented");
    },
    onSuccess: () => {
      // Invalidate and refetch destinations list
      queryClient.invalidateQueries({ queryKey: destinationKeys.lists() });
    },
  });

  const updateDestination = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<DestinationWithCategories> }) => {
      // Placeholder - implement when backend endpoint is ready
      throw new Error("Update destination endpoint not yet implemented");
    },
    onSuccess: (_, variables) => {
      // Invalidate specific destination and list
      queryClient.invalidateQueries({ queryKey: destinationKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: destinationKeys.lists() });
    },
  });

  const deleteDestination = useMutation({
    mutationFn: async (id: string) => {
      // Placeholder - implement when backend endpoint is ready
      throw new Error("Delete destination endpoint not yet implemented");
    },
    onSuccess: () => {
      // Invalidate destinations list
      queryClient.invalidateQueries({ queryKey: destinationKeys.lists() });
    },
  });

  return {
    createDestination,
    updateDestination,
    deleteDestination,
  };
}
