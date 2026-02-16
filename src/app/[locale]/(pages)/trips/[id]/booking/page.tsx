"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Check,
  CheckCircle2,
  Loader2,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import React, { useState } from "react";

import { useAuth } from "@/hooks/useAuth";
import { useTrip } from "@/hooks/useTrips";
import { bookingsApi } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import { useRouter } from "@/navigation";
import { BookingGuestInfo, BookingStep } from "@/types/booking.types";

export default function TripBookingPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const t = useTranslations("TripBooking");
  const { user } = useAuth();

  const { data: trip, isLoading, error } = useTrip(id);

  const [currentStep, setCurrentStep] = useState<BookingStep>("info");
  const [bookingId, setBookingId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [priceType, setPriceType] = useState<"international" | "local">("international");

  const [startDate, setStartDate] = useState<string>(() => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date.toISOString().split("T")[0];
  });

  const [guestInfo, setGuestInfo] = useState<BookingGuestInfo>({
    firstName: "",
    lastName: "",
    email: user?.email || "",
    phone: "",
    country: "",
    address: "",
    city: "",
    zipCode: "",
    specialRequests: "",
  });

  const selectedPrice = priceType === "international"
    ? trip?.price_international || 0
    : trip?.price_local || 0;

  const handleConfirmBooking = async () => {
    if (!user || !trip) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        router.push(`/login?returnUrl=/trips/${id}/booking`);
        return;
      }

      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);

      const bookingData = {
        trip_id: trip.id,
        check_in_date: startDate,
        check_out_date: endDate.toISOString().split("T")[0],
        number_of_guests: 1,
        total_price: selectedPrice,
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

      const booking = await bookingsApi.createBooking(bookingData as any, session.access_token);
      setBookingId(booking.id);
      setCurrentStep("confirmation");
    } catch (err: any) {
      setSubmitError(err.message || "Failed to create booking");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-500">Trip not found</p>
      </div>
    );
  }

  const isInfoValid = guestInfo.firstName && guestInfo.lastName && guestInfo.email && guestInfo.phone && guestInfo.country && guestInfo.address && guestInfo.city && guestInfo.zipCode;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-purple-50/30">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={() => router.push(`/trips/${id}`)} className="p-2 rounded-xl hover:bg-gray-100">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-bold text-gray-900">{t("bookTrip")}: {trip.name}</h1>
            <p className="text-sm text-gray-500">{trip.duration} - {trip.region === "kinshasa" ? "Kinshasa" : "Kongo Central"}</p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      {currentStep !== "confirmation" && (
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-2">
            {["info", "review"].map((step, i) => (
              <React.Fragment key={step}>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                  currentStep === step ? "bg-blue-600 text-white" : i === 0 && currentStep === "review" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                }`}>
                  {i === 0 && currentStep === "review" ? <Check className="w-4 h-4" /> : <span>{i + 1}</span>}
                  <span>{step === "info" ? t("guestInfo") : t("review")}</span>
                </div>
                {i < 1 && <div className="flex-1 h-0.5 bg-gray-200" />}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 pb-32">
        {/* Step 1: Guest Info */}
        {currentStep === "info" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Price Type Toggle */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h2 className="font-bold text-gray-900 mb-4">{t("selectPriceType")}</h2>
              <div className="grid grid-cols-2 gap-3">
                {(["international", "local"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setPriceType(type)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      priceType === type ? "border-blue-600 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <p className="font-bold text-gray-900">
                      ${type === "international" ? trip.price_international : trip.price_local}
                    </p>
                    <p className="text-sm text-gray-500">{t(type)}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Start Date */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h2 className="font-bold text-gray-900 mb-4">{t("startDate")}</h2>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Guest Info Form */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 space-y-4">
              <h2 className="font-bold text-gray-900">{t("guestInfo")}</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t("firstName")} *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={guestInfo.firstName}
                      onChange={(e) => setGuestInfo({ ...guestInfo, firstName: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t("lastName")} *</label>
                  <input
                    type="text"
                    value={guestInfo.lastName}
                    onChange={(e) => setGuestInfo({ ...guestInfo, lastName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t("email")} *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={guestInfo.email}
                      onChange={(e) => setGuestInfo({ ...guestInfo, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t("phone")} *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      value={guestInfo.phone}
                      onChange={(e) => setGuestInfo({ ...guestInfo, phone: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t("country")} *</label>
                  <input
                    type="text"
                    value={guestInfo.country}
                    onChange={(e) => setGuestInfo({ ...guestInfo, country: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t("city")} *</label>
                  <input
                    type="text"
                    value={guestInfo.city}
                    onChange={(e) => setGuestInfo({ ...guestInfo, city: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t("address")} *</label>
                  <input
                    type="text"
                    value={guestInfo.address}
                    onChange={(e) => setGuestInfo({ ...guestInfo, address: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t("zipCode")} *</label>
                  <input
                    type="text"
                    value={guestInfo.zipCode}
                    onChange={(e) => setGuestInfo({ ...guestInfo, zipCode: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("specialRequests")}</label>
                <textarea
                  value={guestInfo.specialRequests}
                  onChange={(e) => setGuestInfo({ ...guestInfo, specialRequests: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 2: Review */}
        {currentStep === "review" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h2 className="font-bold text-gray-900 mb-4">{t("reviewBooking")}</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4 pb-4 border-b">
                  {trip.image && <img src={trip.image} alt={trip.name} className="w-20 h-14 rounded-lg object-cover" />}
                  <div>
                    <p className="font-bold text-gray-900">{trip.name}</p>
                    <p className="text-sm text-gray-500">{trip.duration} - {trip.region === "kinshasa" ? "Kinshasa" : "Kongo Central"}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-gray-500">{t("startDate")}:</span> <span className="font-bold">{startDate}</span></div>
                  <div><span className="text-gray-500">{t("priceType")}:</span> <span className="font-bold">{t(priceType)}</span></div>
                  <div><span className="text-gray-500">{t("guest")}:</span> <span className="font-bold">{guestInfo.firstName} {guestInfo.lastName}</span></div>
                  <div><span className="text-gray-500">{t("email")}:</span> <span className="font-bold">{guestInfo.email}</span></div>
                </div>
                <div className="pt-4 border-t flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">{t("total")}</span>
                  <span className="text-2xl font-extrabold text-green-600">${selectedPrice}</span>
                </div>
              </div>
            </div>

            {submitError && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm">
                {submitError}
              </div>
            )}
          </motion.div>
        )}

        {/* Step 3: Confirmation */}
        {currentStep === "confirmation" && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-16">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">{t("bookingConfirmed")}</h2>
            <p className="text-gray-500 mb-2">{t("bookingId")}: {bookingId}</p>
            <p className="text-gray-500 mb-8">{t("confirmationSent")}</p>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => router.push("/bookings")}
                className="px-6 py-3 bg-black text-white rounded-full font-bold"
              >
                {t("viewBookings")}
              </button>
              <button
                onClick={() => router.push("/trips")}
                className="px-6 py-3 border-2 border-gray-200 rounded-full font-bold text-gray-700 hover:bg-gray-50"
              >
                {t("browseTrips")}
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Fixed Footer Actions */}
      {currentStep !== "confirmation" && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-40">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <button
              onClick={() => {
                if (currentStep === "review") setCurrentStep("info");
                else router.push(`/trips/${id}`);
              }}
              className="px-6 py-3 text-gray-700 font-bold hover:bg-gray-50 rounded-xl"
            >
              {t("back")}
            </button>
            {currentStep === "info" ? (
              <button
                onClick={() => setCurrentStep("review")}
                disabled={!isInfoValid}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t("continue")}
              </button>
            ) : (
              <button
                onClick={handleConfirmBooking}
                disabled={isSubmitting}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {t("confirmBooking")} - ${selectedPrice}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
