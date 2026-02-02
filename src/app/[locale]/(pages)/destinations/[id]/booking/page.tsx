"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Check, CheckCircle2, ChevronRight, Mail, MapPin, Phone, User } from "lucide-react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import React, { useState } from "react";

import { useAuth } from "@/hooks/useAuth";
import { useDestination } from "@/hooks/useDestinations";
import { bookingsApi } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import { useRouter } from "@/navigation";
import { BookingGuestInfo, BookingStep } from "@/types/booking.types";

export default function BookingPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const t = useTranslations("Booking");
  const { user } = useAuth();

  const { data: destination, isLoading, error } = useDestination(id);

  const [currentStep, setCurrentStep] = useState<BookingStep>("info");
  const [bookingId, setBookingId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [checkIn, setCheckIn] = useState<Date>(() => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    return date;
  });
  const [checkOut, setCheckOut] = useState<Date>(() => {
    const date = new Date();
    date.setDate(date.getDate() + 4);
    return date;
  });

  // Check if destination has Hotel category
  const hasHotelCategory = destination?.categories?.some(
    (cat) => cat.parent.name.toLowerCase() === "hotel"
  ) ?? false;

  const [guestInfo, setGuestInfo] = useState<BookingGuestInfo>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
    address: "",
    city: "",
    zipCode: "",
    specialRequests: "",
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !destination) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-3 px-4">
        <h2 className="text-xl font-bold text-gray-900">{t("destinationNotFound")}</h2>
        <button onClick={() => router.back()} className="flex items-center gap-2 text-blue-600 font-semibold text-sm">
          <ArrowLeft size={18} />
          {t("goBack")}
        </button>
      </div>
    );
  }

  const pricePerNight = destination.price;
  const nights = hasHotelCategory 
    ? Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
    : 1; // For non-hotel categories, default to 1 night/unit
  const totalPrice = pricePerNight * nights;
  const serviceFee = pricePerNight > 0 ? 100 : 0; // Service fee is $100 if there's a price
  const finalPrice = totalPrice + serviceFee;
  const showPrice = pricePerNight > 0;

  const formatDateForInput = (date: Date) => date.toISOString().split("T")[0];

  const handleCheckInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    setCheckIn(newDate);
    if (newDate >= checkOut) {
      const newCheckOut = new Date(newDate);
      newCheckOut.setDate(newCheckOut.getDate() + 1);
      setCheckOut(newCheckOut);
    }
  };

  const handleCheckOutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    if (newDate > checkIn) {
      setCheckOut(newDate);
    }
  };

  const handleGuestInfoChange = (field: keyof BookingGuestInfo, value: string) => {
    setGuestInfo((prev) => ({ ...prev, [field]: value }));
  };

  const isGuestInfoValid = () =>
    guestInfo.firstName.trim() !== "" &&
    guestInfo.lastName.trim() !== "" &&
    guestInfo.email.trim() !== "" &&
    guestInfo.phone.trim() !== "" &&
    guestInfo.country.trim() !== "" &&
    guestInfo.address.trim() !== "" &&
    guestInfo.city.trim() !== "" &&
    guestInfo.zipCode.trim() !== "";

  const handleConfirmBooking = async () => {
    if (!user) {
      setSubmitError("You must be logged in to create a booking");
      router.push(`/login?returnUrl=/destinations/${id}/booking`);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      console.log("[Booking] Starting booking creation process...");

      // Get user's session token
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        console.error("[Booking] Session error:", sessionError);
        throw new Error(`Authentication error: ${sessionError.message}`);
      }

      if (!session) {
        console.error("[Booking] No session found");
        throw new Error("Authentication required. Please log in.");
      }

      const token = session.access_token;
      console.log("[Booking] Token retrieved:", token ? "Yes" : "No");

      if (!token) {
        console.error("[Booking] No access token in session");
        throw new Error("Authentication token not found. Please log in again.");
      }

      // Create booking data
      const bookingData = {
        destination_id: id,
        check_in_date: checkIn.toISOString().split("T")[0],
        check_out_date: checkOut.toISOString().split("T")[0],
        number_of_guests: nights,
        total_price: finalPrice,
        guest_first_name: guestInfo.firstName,
        guest_last_name: guestInfo.lastName,
        contact_email: guestInfo.email,
        contact_phone: guestInfo.phone,
        guest_country: guestInfo.country,
        guest_address: guestInfo.address,
        guest_city: guestInfo.city,
        guest_zip_code: guestInfo.zipCode,
        special_requests: guestInfo.specialRequests || undefined,
      };

      console.log("[Booking] Booking data prepared:", bookingData);
      console.log("[Booking] Sending request to backend...");

      // Send booking to backend
      const booking = await bookingsApi.createBooking(bookingData, token);

      console.log("[Booking] Booking created successfully:", booking.id);

      // Set booking ID and move to confirmation
      setBookingId(booking.id);
      setCurrentStep("confirmation");
    } catch (err: any) {
      console.error("[Booking] Error creating booking:", err);
      console.error("[Booking] Error details:", {
        message: err.message,
        status: err.status,
        data: err.data,
      });

      let errorMessage = "Failed to create booking. Please try again.";

      if (err.status === 401) {
        errorMessage = "Your session has expired. Please log in again.";
      } else if (err.message) {
        errorMessage = err.message;
      }

      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToDestination = () => {
    router.push(`/destinations/${id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/40 text-gray-900 font-sans">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={handleBackToDestination}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                  {currentStep === "info" && t("guestInformation")}
                  {currentStep === "review" && t("reviewYourBooking")}
                  {currentStep === "confirmation" && t("bookingConfirmed")}
                </h1>
                <p className="text-xs text-gray-500 hidden sm:block">{destination.name}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20 sm:pt-24 pb-24 sm:pb-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          {currentStep !== "confirmation" && (
            <div className="mb-8 bg-white rounded-xl p-5 sm:p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between max-w-md mx-auto">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div
                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm ${
                      currentStep === "info" ? "bg-blue-600 text-white" : "bg-green-500 text-white"
                    }`}
                  >
                    {currentStep === "info" ? "1" : <Check size={18} />}
                  </div>
                  <span className="font-semibold text-gray-900 text-xs sm:text-sm">{t("information")}</span>
                </div>
                <div className="flex-1 h-0.5 bg-gray-200 mx-3 sm:mx-4">
                  <div
                    className={`h-full transition-all duration-500 ${
                      currentStep === "review" ? "bg-blue-600 w-full" : "bg-gray-200 w-0"
                    }`}
                  />
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div
                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm ${
                      currentStep === "review" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    2
                  </div>
                  <span
                    className={`font-semibold text-xs sm:text-sm ${currentStep === "review" ? "text-gray-900" : "text-gray-400"}`}
                  >
                    {t("review")}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Content Sections */}
          <div className="space-y-5 sm:space-y-6">
            {currentStep === "info" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-5 sm:space-y-6"
              >
                {/* Dates Selection */}
                <div className="bg-white rounded-xl p-5 sm:p-6 shadow-sm border border-gray-100">
                  <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-4">{t("selectYourDates")}</h3>
                  <div className={`flex flex-col ${hasHotelCategory ? 'sm:flex-row' : ''} border border-gray-200 rounded-lg overflow-hidden bg-white`}>
                    <div className={`flex-1 px-4 py-3 sm:py-4 flex flex-col items-start gap-1 transition-colors ${hasHotelCategory ? 'sm:border-r' : ''} border-gray-200`}>
                      <label className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Calendar size={12} />
                        {hasHotelCategory ? t("checkIn") : t("date")}
                      </label>
                      <input
                        type="date"
                        value={formatDateForInput(checkIn)}
                        onChange={handleCheckInChange}
                        min={formatDateForInput(new Date())}
                        className="text-sm sm:text-[15px] font-bold bg-transparent border-none outline-none cursor-pointer w-full"
                      />
                    </div>
                    {hasHotelCategory && (
                      <div className="flex-1 px-4 py-3 sm:py-4 flex flex-col items-start gap-1 transition-colors border-t sm:border-t-0 border-gray-200">
                        <label className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                          <Calendar size={12} />
                          {t("checkOut")}
                        </label>
                        <input
                          type="date"
                          value={formatDateForInput(checkOut)}
                          onChange={handleCheckOutChange}
                          min={formatDateForInput(new Date(checkIn.getTime() + 86400000))}
                          className="text-sm sm:text-[15px] font-bold bg-transparent border-none outline-none cursor-pointer w-full"
                        />
                      </div>
                    )}
                  </div>
                  {showPrice && (
                    <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600 px-2 mt-3">
                      <span className="font-medium">
                        {hasHotelCategory ? t(nights === 1 ? "night" : "nights", { count: nights }) : t("booking")}
                      </span>
                      <span className="font-bold text-blue-600">
                        {t("total")}: ${finalPrice.toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Personal Information */}
                <div className="bg-white rounded-xl p-5 sm:p-6 shadow-sm border border-gray-100">
                  <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-4">{t("personalInformation")}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                        {t("firstName")} {t("required")}
                      </label>
                      <div className="relative">
                        <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          value={guestInfo.firstName}
                          onChange={(e) => handleGuestInfoChange("firstName", e.target.value)}
                          className="w-full pl-10 pr-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                          placeholder={t("firstNamePlaceholder")}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                        {t("lastName")} {t("required")}
                      </label>
                      <div className="relative">
                        <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          value={guestInfo.lastName}
                          onChange={(e) => handleGuestInfoChange("lastName", e.target.value)}
                          className="w-full pl-10 pr-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                          placeholder={t("lastNamePlaceholder")}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-white rounded-xl p-5 sm:p-6 shadow-sm border border-gray-100">
                  <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-4">{t("contactInformation")}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                        {t("email")} {t("required")}
                      </label>
                      <div className="relative">
                        <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="email"
                          value={guestInfo.email}
                          onChange={(e) => handleGuestInfoChange("email", e.target.value)}
                          className="w-full pl-10 pr-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                          placeholder={t("emailPlaceholder")}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                        {t("phone")} {t("required")}
                      </label>
                      <div className="relative">
                        <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="tel"
                          value={guestInfo.phone}
                          onChange={(e) => handleGuestInfoChange("phone", e.target.value)}
                          className="w-full pl-10 pr-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                          placeholder={t("phonePlaceholder")}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div className="bg-white rounded-xl p-5 sm:p-6 shadow-sm border border-gray-100">
                  <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-4">{t("addressInformation")}</h3>
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                        {t("streetAddress")} {t("required")}
                      </label>
                      <div className="relative">
                        <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          value={guestInfo.address}
                          onChange={(e) => handleGuestInfoChange("address", e.target.value)}
                          className="w-full pl-10 pr-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                          placeholder={t("addressPlaceholder")}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                          {t("city")} {t("required")}
                        </label>
                        <input
                          type="text"
                          value={guestInfo.city}
                          onChange={(e) => handleGuestInfoChange("city", e.target.value)}
                          className="w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                          placeholder={t("cityPlaceholder")}
                        />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                          {t("zipCode")} {t("required")}
                        </label>
                        <input
                          type="text"
                          value={guestInfo.zipCode}
                          onChange={(e) => handleGuestInfoChange("zipCode", e.target.value)}
                          className="w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                          placeholder={t("zipPlaceholder")}
                        />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                          {t("country")} {t("required")}
                        </label>
                        <input
                          type="text"
                          value={guestInfo.country}
                          onChange={(e) => handleGuestInfoChange("country", e.target.value)}
                          className="w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                          placeholder={t("countryPlaceholder")}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Special Requests */}
                <div className="bg-white rounded-xl p-5 sm:p-6 shadow-sm border border-gray-100">
                  <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-4">{t("specialRequestsOptional")}</h3>
                  <textarea
                    value={guestInfo.specialRequests}
                    onChange={(e) => handleGuestInfoChange("specialRequests", e.target.value)}
                    className="w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all resize-none"
                    rows={3}
                    placeholder={t("specialRequestsPlaceholder")}
                  />
                </div>
              </motion.div>
            )}

            {currentStep === "review" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-5 sm:space-y-6"
              >
                {/* Destination Summary */}
                <div className="bg-white rounded-xl p-5 sm:p-6 shadow-sm border border-gray-100">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <img
                      src={destination.image || `https://picsum.photos/800/800?random=${destination.id}`}
                      alt={destination.name}
                      className="w-full sm:w-24 h-32 sm:h-24 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">{destination.name}</h3>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} />
                          <span>
                            {hasHotelCategory 
                              ? `${checkIn.toLocaleDateString()} - ${checkOut.toLocaleDateString()}`
                              : checkIn.toLocaleDateString()
                            }
                          </span>
                        </div>
                        {hasHotelCategory && (
                          <>
                            <span className="hidden sm:inline">•</span>
                            <span>{t(nights === 1 ? "night" : "nights", { count: nights })}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Guest Information Review */}
                <div className="bg-white rounded-xl p-5 sm:p-6 shadow-sm border border-gray-100">
                  <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-4">{t("guestInfo")}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <div>
                      <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase mb-1">{t("name")}</p>
                      <p className="text-sm sm:text-base text-gray-900 font-semibold">
                        {guestInfo.firstName} {guestInfo.lastName}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase mb-1">{t("email")}</p>
                      <p className="text-sm sm:text-base text-gray-900 font-semibold break-all">{guestInfo.email}</p>
                    </div>
                    <div>
                      <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase mb-1">{t("phone")}</p>
                      <p className="text-sm sm:text-base text-gray-900 font-semibold">{guestInfo.phone}</p>
                    </div>
                    <div>
                      <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase mb-1">{t("country")}</p>
                      <p className="text-sm sm:text-base text-gray-900 font-semibold">{guestInfo.country}</p>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase mb-1">
                        {t("streetAddress")}
                      </p>
                      <p className="text-sm sm:text-base text-gray-900 font-semibold">
                        {guestInfo.address}, {guestInfo.city}, {guestInfo.zipCode}
                      </p>
                    </div>
                    {guestInfo.specialRequests && (
                      <div className="sm:col-span-2">
                        <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase mb-1">
                          {t("specialRequests")}
                        </p>
                        <p className="text-sm text-gray-600">{guestInfo.specialRequests}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Price Breakdown */}
                {showPrice && (
                  <div className="bg-white rounded-xl p-5 sm:p-6 shadow-sm border border-gray-100">
                    <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-4">{t("priceBreakdown")}</h3>
                    <div className="space-y-2.5">
                      <div className="flex justify-between text-xs sm:text-sm text-gray-600">
                        <span>
                          ${pricePerNight.toFixed(2)} x {nights}{" "}
                          {hasHotelCategory 
                            ? (nights === 1 ? t("night", { count: nights }) : t("nights", { count: nights }))
                            : t("unit")
                          }
                        </span>
                        <span className="font-semibold">${totalPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-xs sm:text-sm text-gray-600">
                        <span>{t("serviceFee")}</span>
                        <span className="font-semibold">${serviceFee.toFixed(2)}</span>
                      </div>
                      <div className="pt-2.5 border-t border-gray-200 flex justify-between items-center">
                        <span className="text-sm sm:text-base font-bold text-gray-900">{t("total")}</span>
                        <span className="text-lg sm:text-xl font-bold text-blue-600">${finalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {currentStep === "confirmation" && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-gray-100 text-center space-y-6">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 size={32} className="text-white sm:w-10 sm:h-10" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{t("bookingConfirmed")}</h3>
                    <p className="text-sm sm:text-base text-gray-600">{t("confirmationMessage")}</p>
                  </div>

                  <div className="p-4 sm:p-5 bg-blue-50 rounded-xl border-2 border-blue-200 border-dashed">
                    <p className="text-xs font-bold text-gray-600 mb-1.5">{t("bookingReference")}</p>
                    <p className="text-lg sm:text-2xl font-black text-blue-600 tracking-wider break-all">{bookingId}</p>
                  </div>

                  {/* Destination Image & Name */}
                  <div className="flex flex-col sm:flex-row gap-4 p-4 sm:p-5 bg-gray-50 rounded-xl text-left">
                    <img
                      src={destination.image || `https://picsum.photos/800/800?random=${destination.id}`}
                      alt={destination.name}
                      className="w-full sm:w-20 h-32 sm:h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-1.5">{destination.name}</h4>
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                        <Calendar size={14} />
                        <span>
                          {checkIn.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                          {hasHotelCategory && (
                            <>
                              {" "}-{" "}
                              {checkOut.toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Price Breakdown Card */}
                  {showPrice && (
                    <div className="p-4 sm:p-5 bg-white rounded-xl border border-gray-200 text-left space-y-3">
                      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t("priceDetails")}</h4>
                      </div>

                      {/* Dates Display */}
                      <div className={`flex flex-col ${hasHotelCategory ? 'sm:flex-row' : ''} border border-gray-100 rounded-lg overflow-hidden bg-white`}>
                        <div className={`flex-1 px-3 py-2 flex flex-col items-start gap-0.5 ${hasHotelCategory ? 'sm:border-r' : ''} border-gray-100`}>
                          <span className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            {hasHotelCategory ? t("checkIn") : t("date")}
                          </span>
                          <span className="text-xs sm:text-sm font-bold text-gray-900">
                            {checkIn.toLocaleDateString("en-US", {
                              month: "2-digit",
                              day: "2-digit",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        {hasHotelCategory && (
                          <div className="flex-1 px-3 py-2 flex flex-col items-start gap-0.5 border-t sm:border-t-0 border-gray-100">
                            <span className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                              {t("checkOut")}
                            </span>
                            <span className="text-xs sm:text-sm font-bold text-gray-900">
                              {checkOut.toLocaleDateString("en-US", {
                                month: "2-digit",
                                day: "2-digit",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Price Breakdown */}
                      <div className="space-y-2 pt-1">
                        <div className="flex items-center justify-between text-gray-500 text-xs sm:text-sm">
                          <div className="flex items-center gap-2">
                            <span className="underline decoration-gray-200 decoration-dotted underline-offset-4">
                              ${pricePerNight.toFixed(2)} x {nights}{" "}
                              {hasHotelCategory 
                                ? (nights === 1 ? t("night", { count: nights }) : t("nights", { count: nights }))
                                : t("unit")
                              }
                            </span>
                          </div>
                          <span className="font-semibold text-gray-900">${totalPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center justify-between text-gray-500 text-xs sm:text-sm">
                          <span className="underline decoration-gray-200 decoration-dotted underline-offset-4">
                            Frais de Service
                          </span>
                          <span className="font-semibold text-gray-900">${serviceFee.toFixed(2)}</span>
                        </div>
                        <div className="pt-2 border-t border-gray-200 flex items-center justify-between">
                          <span className="text-sm font-bold text-gray-900">Prix Total</span>
                          <span className="text-lg sm:text-xl font-bold text-blue-600">${finalPrice.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Guest Information */}
                  <div className="p-4 sm:p-5 bg-gray-50 rounded-xl space-y-2.5 text-left">
                    <h4 className="font-bold text-gray-900 text-sm">{t("guestInfo")}</h4>
                    <div className="space-y-1.5 text-xs sm:text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t("name")}:</span>
                        <span className="font-semibold text-gray-900">
                          {guestInfo.firstName} {guestInfo.lastName}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t("email")}:</span>
                        <span className="font-semibold text-gray-900 break-all">{guestInfo.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t("phone")}:</span>
                        <span className="font-semibold text-gray-900">{guestInfo.phone}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-gray-500">
                    {t("confirmationEmailSent")} <span className="font-bold text-gray-900">{guestInfo.email}</span>
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => router.push("/bookings")}
                      className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm transition-all shadow-lg shadow-blue-500/25 active:scale-95"
                    >
                      {t("viewMyBookings")}
                    </button>
                    <button
                      onClick={handleBackToDestination}
                      className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold text-sm transition-all active:scale-95"
                    >
                      {t("backToDestination")}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Fixed Footer Actions */}
          {currentStep !== "confirmation" && (
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 shadow-lg">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                {submitError && (
                  <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {submitError}
                  </div>
                )}
                <div className="flex items-center justify-between gap-3">
                  <button
                    onClick={() => {
                      if (currentStep === "review") {
                        setCurrentStep("info");
                        setSubmitError(null);
                      } else {
                        handleBackToDestination();
                      }
                    }}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-lg font-semibold hover:bg-gray-100 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ArrowLeft size={18} />
                    {currentStep === "review" ? t("back") : t("cancel")}
                  </button>
                  <button
                    onClick={() => {
                      if (currentStep === "info" && isGuestInfoValid()) {
                        setCurrentStep("review");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      } else if (currentStep === "review") {
                        handleConfirmBooking();
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }
                    }}
                    disabled={(currentStep === "info" && !isGuestInfoValid()) || isSubmitting}
                    className="flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-semibold text-sm transition-all shadow-lg shadow-blue-500/25 active:scale-95"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        {t("processing")}
                      </>
                    ) : (
                      <>
                        {currentStep === "info" && (
                          <>
                            {t("continue")}
                            <ChevronRight size={18} />
                          </>
                        )}
                        {currentStep === "review" && t("confirmBooking")}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
