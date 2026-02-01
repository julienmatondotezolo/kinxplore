'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';

export interface Booking {
  id: string;
  user_id: string;
  destination_id: string;
  booking_date: string;
  number_of_guests: number;
  total_price: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  special_requests?: string;
  contact_email: string;
  contact_phone?: string;
  created_at: string;
  updated_at: string;
  cancelled_at?: string;
  cancellation_reason?: string;
  destination?: {
    id: string;
    name: string;
    image: string;
    location: string;
  };
}

export interface CreateBookingData {
  destination_id: string;
  booking_date: string;
  number_of_guests: number;
  contact_email: string;
  contact_phone?: string;
  special_requests?: string;
}

export function useBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadBookings();
    } else {
      setBookings([]);
      setLoading(false);
    }
  }, [user]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          destination:destinations(id, name, image, location)
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data as Booking[]);
    } catch (err: any) {
      setError(err.message);
      console.error('Error loading bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const createBooking = async (bookingData: CreateBookingData) => {
    if (!user) throw new Error('Must be logged in to create a booking');

    try {
      // Get destination price
      const { data: destination, error: destError } = await supabase
        .from('destinations')
        .select('price')
        .eq('id', bookingData.destination_id)
        .single();

      if (destError) throw destError;

      const totalPrice = destination.price * bookingData.number_of_guests;

      const { data, error } = await supabase
        .from('bookings')
        .insert({
          ...bookingData,
          user_id: user.id,
          total_price: totalPrice,
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;

      // Reload bookings
      await loadBookings();

      return data as Booking;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const updateBooking = async (
    bookingId: string,
    updates: Partial<CreateBookingData>,
  ) => {
    if (!user) throw new Error('Must be logged in to update a booking');

    try {
      const { data, error } = await supabase
        .from('bookings')
        .update(updates)
        .eq('id', bookingId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      // Reload bookings
      await loadBookings();

      return data as Booking;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const cancelBooking = async (bookingId: string, reason?: string) => {
    if (!user) throw new Error('Must be logged in to cancel a booking');

    try {
      const { data, error } = await supabase
        .from('bookings')
        .update({
          status: 'cancelled',
          cancelled_at: new Date().toISOString(),
          cancellation_reason: reason,
        })
        .eq('id', bookingId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      // Reload bookings
      await loadBookings();

      return data as Booking;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const getBookingStats = async () => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('status, total_price')
        .eq('user_id', user.id);

      if (error) throw error;

      const stats = {
        total: data.length,
        pending: data.filter((b) => b.status === 'pending').length,
        confirmed: data.filter((b) => b.status === 'confirmed').length,
        cancelled: data.filter((b) => b.status === 'cancelled').length,
        completed: data.filter((b) => b.status === 'completed').length,
        totalSpent: data
          .filter((b) => b.status !== 'cancelled')
          .reduce((sum, b) => sum + Number(b.total_price), 0),
      };

      return stats;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return {
    bookings,
    loading,
    error,
    createBooking,
    updateBooking,
    cancelBooking,
    getBookingStats,
    refreshBookings: loadBookings,
  };
}
