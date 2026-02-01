/**
 * API Client for Kinxplore Backend
 */

import { DestinationWithCategories, ParentCategoryWithSubcategories } from "@/types/api.types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:2431";

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
  const url = `${API_BASE_URL}/api${endpoint}`;

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

// Bookings API
export interface Booking {
  id: string;
  user_id: string;
  destination_id: string;
  check_in_date: string;
  check_out_date: string;
  number_of_guests: number;
  total_price: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  guest_first_name: string;
  guest_last_name: string;
  contact_email: string;
  contact_phone: string;
  guest_country: string;
  guest_address: string;
  guest_city: string;
  guest_zip_code: string;
  special_requests?: string;
  created_at: string;
  updated_at: string;
  cancelled_at?: string;
  cancellation_reason?: string;
  destination?: DestinationWithCategories;
}

export interface CreateBookingDto {
  destination_id: string;
  check_in_date: string;
  check_out_date: string;
  number_of_guests: number;
  total_price: number;
  guest_first_name: string;
  guest_last_name: string;
  contact_email: string;
  contact_phone: string;
  guest_country: string;
  guest_address: string;
  guest_city: string;
  guest_zip_code: string;
  special_requests?: string;
}

export interface UpdateBookingDto {
  check_in_date?: string;
  check_out_date?: string;
  number_of_guests?: number;
  guest_first_name?: string;
  guest_last_name?: string;
  contact_email?: string;
  contact_phone?: string;
  guest_country?: string;
  guest_address?: string;
  guest_city?: string;
  guest_zip_code?: string;
  special_requests?: string;
}

export interface BookingStats {
  total: number;
  pending: number;
  confirmed: number;
  cancelled: number;
  completed: number;
  totalSpent: number;
}

export const bookingsApi = {
  // Get all user's bookings
  getMyBookings: (token: string) =>
    fetchApi<Booking[]>("/bookings/my-bookings", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  // Get user's booking statistics
  getMyBookingStats: (token: string) =>
    fetchApi<BookingStats>("/bookings/my-bookings/stats", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  // Get a specific booking
  getMyBooking: (id: string, token: string) =>
    fetchApi<Booking>(`/bookings/my-bookings/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  // Create a new booking
  createBooking: (data: CreateBookingDto, token: string) =>
    fetchApi<Booking>("/bookings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }),

  // Update a booking
  updateMyBooking: (id: string, data: UpdateBookingDto, token: string) =>
    fetchApi<Booking>(`/bookings/my-bookings/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }),

  // Cancel a booking
  cancelMyBooking: (id: string, reason: string | undefined, token: string) =>
    fetchApi<Booking>(`/bookings/my-bookings/${id}/cancel`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ reason }),
    }),
};

export { ApiError };
