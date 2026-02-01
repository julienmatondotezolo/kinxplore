/**
 * Booking Types and Interfaces
 */

export interface BookingDates {
  checkIn: Date;
  checkOut: Date;
  nights: number;
}

export interface BookingGuestInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  address: string;
  city: string;
  zipCode: string;
  specialRequests?: string;
}

export interface BookingDetails {
  destinationId: string;
  destinationName: string;
  destinationImage: string;
  dates: BookingDates;
  guestInfo: BookingGuestInfo;
  pricePerNight: number;
  totalPrice: number;
  serviceFee: number;
  finalPrice: number;
}

export interface BookingConfirmation {
  bookingId: string;
  bookingDetails: BookingDetails;
  confirmationDate: Date;
  status: "confirmed" | "pending" | "cancelled";
}

export type BookingStep = "dates" | "info" | "review" | "confirmation";
