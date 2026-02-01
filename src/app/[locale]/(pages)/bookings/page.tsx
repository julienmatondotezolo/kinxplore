"use client";

import {
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Edit2,
  Mail,
  MapPin,
  Phone,
  ShoppingBag,
  Users,
  X,
  XCircle,
} from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";

import { Footer } from "@/components/Footer";
import { Navigation } from "@/components/Navigation";
import { useAuth } from "@/hooks/useAuth";
import { Booking, bookingsApi, BookingStats } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import { Link, useRouter } from "@/navigation";

export default function BookingsPage() {
  const t = useTranslations("Bookings");
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<BookingStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editFormData, setEditFormData] = useState({
    check_in_date: "",
    check_out_date: "",
    number_of_guests: 1,
    guest_first_name: "",
    guest_last_name: "",
    contact_email: "",
    contact_phone: "",
    guest_country: "",
    guest_address: "",
    guest_city: "",
    guest_zip_code: "",
    special_requests: "",
  });
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  // Check authentication once
  useEffect(() => {
    if (!authLoading && !hasCheckedAuth) {
      setHasCheckedAuth(true);
      if (!user) {
        router.push(`/login?returnUrl=/bookings`);
      } else {
        loadBookings();
      }
    }
  }, [user, authLoading, hasCheckedAuth, router]);

  const loadBookings = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get token from Supabase session (optional - can be null)
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const token = session?.access_token || "";

      // Call API with or without token
      // Backend will return empty data if no token
      const [bookingsData, statsData] = await Promise.all([
        bookingsApi.getMyBookings(token),
        bookingsApi.getMyBookingStats(token),
      ]);

      setBookings(bookingsData);
      setStats(statsData);
    } catch (err: any) {
      console.error("Error loading bookings:", err);
      setError(err.message || "Failed to load bookings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!selectedBooking) return;

    try {
      setIsCancelling(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        alert("Authentication session not found. Please refresh the page and try again.");
        return;
      }

      await bookingsApi.cancelMyBooking(selectedBooking.id, cancelReason || undefined, token);

      // Reload bookings
      await loadBookings();

      // Close modal
      setShowCancelModal(false);
      setSelectedBooking(null);
      setCancelReason("");
    } catch (err: any) {
      console.error("Error cancelling booking:", err);
      alert(err.message || "Failed to cancel booking");
    } finally {
      setIsCancelling(false);
    }
  };

  const handleEditBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setEditFormData({
      check_in_date: booking.check_in_date || "",
      check_out_date: booking.check_out_date || "",
      number_of_guests: booking.number_of_guests || 1,
      guest_first_name: booking.guest_first_name || "",
      guest_last_name: booking.guest_last_name || "",
      contact_email: booking.contact_email || "",
      contact_phone: booking.contact_phone || "",
      guest_country: booking.guest_country || "",
      guest_address: booking.guest_address || "",
      guest_city: booking.guest_city || "",
      guest_zip_code: booking.guest_zip_code || "",
      special_requests: booking.special_requests || "",
    });
    setShowEditModal(true);
  };

  const handleUpdateBooking = async () => {
    if (!selectedBooking) return;

    try {
      setIsUpdating(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        alert("Authentication session not found. Please refresh the page and try again.");
        return;
      }

      await bookingsApi.updateMyBooking(selectedBooking.id, editFormData, token);

      // Reload bookings
      await loadBookings();

      // Close modal
      setShowEditModal(false);
      setSelectedBooking(null);
    } catch (err: any) {
      console.error("Error updating booking:", err);
      alert(err.message || "Failed to update booking");
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "confirmed":
        return "bg-green-100 text-green-700 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      case "completed":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock size={14} />;
      case "confirmed":
        return <CheckCircle2 size={14} />;
      case "cancelled":
        return <XCircle size={14} />;
      case "completed":
        return <CheckCircle2 size={14} />;
      default:
        return <Clock size={14} />;
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    if (filterStatus === "all") return true;
    return booking.status === filterStatus;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t("loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-blue-100 selection:text-blue-900">
      <Navigation />

      <main className="pt-24 pb-24">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-[13px] text-gray-400 mb-8 font-medium">
            <Link href="/" className="hover:text-black transition-colors">
              {t("breadcrumbs.home")}
            </Link>
            <ChevronRight size={12} />
            <span className="text-blue-600">{t("breadcrumbs.bookings")}</span>
          </nav>

          {/* Header */}
          <div className="mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-[44px] font-bold tracking-tight text-gray-900 leading-tight mb-4">
              {t("title")}
            </h1>
            <p className="text-gray-500 text-lg">{t("subtitle")}</p>
          </div>

          {/* Statistics */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t("stats.total")}</p>
                <p className="text-3xl font-black text-gray-900">{stats.total}</p>
              </div>
              <div className="bg-yellow-50 rounded-2xl p-6 border border-yellow-100">
                <p className="text-xs font-bold text-yellow-600 uppercase tracking-widest mb-2">{t("stats.pending")}</p>
                <p className="text-3xl font-black text-yellow-700">{stats.pending}</p>
              </div>
              <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
                <p className="text-xs font-bold text-green-600 uppercase tracking-widest mb-2">
                  {t("stats.confirmed")}
                </p>
                <p className="text-3xl font-black text-green-700">{stats.confirmed}</p>
              </div>
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">{t("stats.completed")}</p>
                <p className="text-3xl font-black text-blue-700">{stats.completed}</p>
              </div>
              <div className="bg-purple-50 rounded-2xl p-6 border border-purple-100">
                <p className="text-xs font-bold text-purple-600 uppercase tracking-widest mb-2">
                  {t("stats.totalSpent")}
                </p>
                <p className="text-3xl font-black text-purple-700">${stats.totalSpent.toFixed(0)}</p>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-8">
            <button
              onClick={() => setFilterStatus("all")}
              className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                filterStatus === "all"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {t("filters.all")}
            </button>
            <button
              onClick={() => setFilterStatus("pending")}
              className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                filterStatus === "pending"
                  ? "bg-yellow-600 text-white shadow-lg shadow-yellow-500/25"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {t("filters.pending")}
            </button>
            <button
              onClick={() => setFilterStatus("confirmed")}
              className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                filterStatus === "confirmed"
                  ? "bg-green-600 text-white shadow-lg shadow-green-500/25"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {t("filters.confirmed")}
            </button>
            <button
              onClick={() => setFilterStatus("completed")}
              className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                filterStatus === "completed"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {t("filters.completed")}
            </button>
            <button
              onClick={() => setFilterStatus("cancelled")}
              className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                filterStatus === "cancelled"
                  ? "bg-red-600 text-white shadow-lg shadow-red-500/25"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {t("filters.cancelled")}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8">
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          )}

          {/* Bookings List */}
          {!user && !authLoading ? (
            // Not logged in - show login message
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-12 text-center border-2 border-blue-200">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShoppingBag size={40} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Login to View Your Bookings</h3>
                <p className="text-gray-600 mb-6">
                  Sign in to your account to view and manage your destination bookings.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    href="/login?returnUrl=/bookings"
                    className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg"
                  >
                    Login to Continue
                  </Link>
                  <Link
                    href="/register"
                    className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all border-2 border-blue-600"
                  >
                    Create Account
                  </Link>
                </div>
              </div>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="bg-gray-50 rounded-2xl p-12 text-center border border-gray-100">
              <p className="text-gray-500 text-lg mb-4">{t("noBookings")}</p>
              <Link
                href="/destinations"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all"
              >
                {t("browseDestinations")}
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-blue-500/10 transition-all"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Image */}
                    <div className="md:w-64 h-48 md:h-auto relative overflow-hidden">
                      <img
                        src={
                          booking.destination?.image || `https://picsum.photos/400/300?random=${booking.destination_id}`
                        }
                        alt={booking.destination?.name || "Destination"}
                        className="w-full h-full object-cover"
                      />
                      <div
                        className={`absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border ${getStatusColor(booking.status)}`}
                      >
                        {getStatusIcon(booking.status)}
                        {t(`status.${booking.status}`)}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            {booking.destination?.name || "Destination"}
                          </h3>
                          {booking.destination?.location && (
                            <div className="flex items-center gap-2 text-gray-500">
                              <MapPin size={16} />
                              <span className="text-sm">{booking.destination.location}</span>
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">
                            {t("totalPrice")}
                          </p>
                          <p className="text-3xl font-black text-blue-600">${booking.total_price.toFixed(2)}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 border-y border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                            <Calendar size={18} />
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                              {t("bookingDate")}
                            </p>
                            <p className="text-sm font-bold text-gray-900">
                              {new Date(booking.check_in_date).toLocaleDateString()} -{" "}
                              {new Date(booking.check_out_date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                            <Users size={18} />
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{t("guests")}</p>
                            <p className="text-sm font-bold text-gray-900">
                              {booking.number_of_guests} {booking.number_of_guests === 1 ? t("guest") : t("guests")}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                            <Mail size={18} />
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{t("contact")}</p>
                            <p className="text-sm font-bold text-gray-900 truncate">{booking.contact_email}</p>
                          </div>
                        </div>
                      </div>

                      {booking.special_requests && (
                        <div className="bg-gray-50 rounded-xl p-4">
                          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">
                            {t("specialRequests")}
                          </p>
                          <p className="text-sm text-gray-700">{booking.special_requests}</p>
                        </div>
                      )}

                      {booking.cancellation_reason && (
                        <div className="bg-red-50 rounded-xl p-4">
                          <p className="text-xs text-red-600 font-bold uppercase tracking-widest mb-2">
                            {t("cancellationReason")}
                          </p>
                          <p className="text-sm text-red-700">{booking.cancellation_reason}</p>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-3 pt-2">
                        <Link
                          href={`/destinations/${booking.destination_id}`}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-all"
                        >
                          {t("viewDestination")}
                        </Link>
                        {(booking.status === "pending" || booking.status === "confirmed") && (
                          <>
                            <button
                              onClick={() => handleEditBooking(booking)}
                              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-bold text-sm hover:bg-gray-200 transition-all border border-gray-300"
                            >
                              <Edit2 size={16} />
                              {t("editBooking")}
                            </button>
                            <button
                              onClick={() => {
                                setSelectedBooking(booking);
                                setShowCancelModal(true);
                              }}
                              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 text-red-600 font-bold text-sm hover:bg-red-100 transition-all border border-red-200"
                            >
                              <X size={16} />
                              {t("cancelBooking")}
                            </button>
                          </>
                        )}
                      </div>

                      <div className="text-xs text-gray-400 pt-2">
                        {t("bookedOn")}: {new Date(booking.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Edit Modal */}
      {showEditModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl my-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">{t("editModal.title")}</h3>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedBooking(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4 mb-6 max-h-[60vh] overflow-y-auto pr-2">
              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    {t("editModal.checkInDate")}
                  </label>
                  <input
                    type="date"
                    value={editFormData.check_in_date}
                    onChange={(e) => setEditFormData({ ...editFormData, check_in_date: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    {t("editModal.checkOutDate")}
                  </label>
                  <input
                    type="date"
                    value={editFormData.check_out_date}
                    onChange={(e) => setEditFormData({ ...editFormData, check_out_date: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Number of Guests */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  {t("editModal.numberOfGuests")}
                </label>
                <input
                  type="number"
                  min="1"
                  value={editFormData.number_of_guests || 1}
                  onChange={(e) => setEditFormData({ ...editFormData, number_of_guests: parseInt(e.target.value) || 1 })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                />
              </div>

              {/* Guest Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    {t("editModal.firstName")}
                  </label>
                  <input
                    type="text"
                    value={editFormData.guest_first_name}
                    onChange={(e) => setEditFormData({ ...editFormData, guest_first_name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    {t("editModal.lastName")}
                  </label>
                  <input
                    type="text"
                    value={editFormData.guest_last_name}
                    onChange={(e) => setEditFormData({ ...editFormData, guest_last_name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    {t("editModal.email")}
                  </label>
                  <input
                    type="email"
                    value={editFormData.contact_email}
                    onChange={(e) => setEditFormData({ ...editFormData, contact_email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    {t("editModal.phone")}
                  </label>
                  <input
                    type="tel"
                    value={editFormData.contact_phone}
                    onChange={(e) => setEditFormData({ ...editFormData, contact_phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  {t("editModal.address")}
                </label>
                <input
                  type="text"
                  value={editFormData.guest_address}
                  onChange={(e) => setEditFormData({ ...editFormData, guest_address: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                />
              </div>

              {/* City, Country, Zip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    {t("editModal.city")}
                  </label>
                  <input
                    type="text"
                    value={editFormData.guest_city}
                    onChange={(e) => setEditFormData({ ...editFormData, guest_city: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    {t("editModal.country")}
                  </label>
                  <input
                    type="text"
                    value={editFormData.guest_country}
                    onChange={(e) => setEditFormData({ ...editFormData, guest_country: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    {t("editModal.zipCode")}
                  </label>
                  <input
                    type="text"
                    value={editFormData.guest_zip_code}
                    onChange={(e) => setEditFormData({ ...editFormData, guest_zip_code: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Special Requests */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  {t("editModal.specialRequests")} ({t("editModal.optional")})
                </label>
                <textarea
                  value={editFormData.special_requests}
                  onChange={(e) => setEditFormData({ ...editFormData, special_requests: e.target.value })}
                  placeholder={t("editModal.specialRequestsPlaceholder")}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedBooking(null);
                }}
                className="flex-1 px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-all"
                disabled={isUpdating}
              >
                {t("editModal.cancel")}
              </button>
              <button
                onClick={handleUpdateBooking}
                className="flex-1 px-4 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isUpdating}
              >
                {isUpdating ? t("editModal.updating") : t("editModal.saveChanges")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">{t("cancelModal.title")}</h3>
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setSelectedBooking(null);
                  setCancelReason("");
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <p className="text-gray-600 mb-6">{t("cancelModal.message")}</p>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  {t("cancelModal.reasonLabel")} ({t("cancelModal.optional")})
                </label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder={t("cancelModal.reasonPlaceholder")}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
                  rows={4}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setSelectedBooking(null);
                  setCancelReason("");
                }}
                className="flex-1 px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-all"
                disabled={isCancelling}
              >
                {t("cancelModal.keepBooking")}
              </button>
              <button
                onClick={handleCancelBooking}
                className="flex-1 px-4 py-2 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isCancelling}
              >
                {isCancelling ? t("cancelModal.cancelling") : t("cancelModal.confirmCancel")}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
