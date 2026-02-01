'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useBookings, CreateBookingData } from '@/hooks/useBookings';
import AuthModal from './AuthModal';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  destination: {
    id: string;
    name: string;
    price: number;
    location: string;
  };
}

export default function BookingModal({ isOpen, onClose, destination }: BookingModalProps) {
  const { user } = useAuth();
  const { createBooking } = useBookings();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<CreateBookingData>({
    destination_id: destination.id,
    booking_date: '',
    number_of_guests: 1,
    contact_email: user?.email || '',
    contact_phone: '',
    special_requests: '',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await createBooking(formData);
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = destination.price * formData.number_of_guests;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="relative w-full max-w-2xl rounded-lg bg-white p-8 shadow-xl dark:bg-gray-800">
            <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            </button>

          <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
            Book {destination.name}
          </h2>

          <div className="mb-6 rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <strong>Location:</strong> {destination.location}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <strong>Price per person:</strong> ${destination.price}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="booking_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Booking Date
                      </label>
                      <input
                        type="date"
                id="booking_date"
                value={formData.booking_date}
                onChange={(e) => setFormData({ ...formData, booking_date: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                required
                      />
                    </div>

            <div>
              <label htmlFor="number_of_guests" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Number of Guests
                      </label>
                      <input
                type="number"
                id="number_of_guests"
                value={formData.number_of_guests}
                onChange={(e) => setFormData({ ...formData, number_of_guests: parseInt(e.target.value) })}
                min="1"
                max="20"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                required
              />
                </div>

                    <div>
              <label htmlFor="contact_email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Contact Email
                      </label>
                        <input
                          type="email"
                id="contact_email"
                value={formData.contact_email}
                onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                required
                        />
                      </div>

                    <div>
              <label htmlFor="contact_phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Contact Phone (Optional)
              </label>
                        <input
                          type="tel"
                id="contact_phone"
                value={formData.contact_phone}
                onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
                </div>

                    <div>
              <label htmlFor="special_requests" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Special Requests (Optional)
                        </label>
                  <textarea
                id="special_requests"
                value={formData.special_requests}
                onChange={(e) => setFormData({ ...formData, special_requests: e.target.value })}
                rows={3}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>

            <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                Total Price: ${totalPrice.toFixed(2)}
              </p>
                </div>

            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-400">
                {error}
                </div>
            )}

            {success && (
              <div className="rounded-md bg-green-50 p-3 text-sm text-green-800 dark:bg-green-900/20 dark:text-green-400">
                Booking created successfully!
                </div>
            )}

              <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              {loading ? 'Creating Booking...' : user ? 'Confirm Booking' : 'Sign In to Book'}
              </button>
          </form>
            </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultMode="signup"
      />
    </>
  );
}
