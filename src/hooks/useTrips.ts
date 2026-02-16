'use client';

import { useQuery } from '@tanstack/react-query';
import { tripsApi } from '@/lib/api';

export const useTrips = () => {
  return useQuery({
    queryKey: ['trips'],
    queryFn: tripsApi.getAll,
  });
};

export const useTrip = (id: string) => {
  return useQuery({
    queryKey: ['trip', id],
    queryFn: () => tripsApi.getById(id),
    enabled: !!id,
  });
};
