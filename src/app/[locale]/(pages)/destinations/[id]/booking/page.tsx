"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Check,
  CheckCircle2,
  ChevronRight,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import { useParams } from "next/navigation";
import React, { useState } from "react";

import { useDestination } from "@/hooks/useDestinations";
import { useRouter } from "@/navigation";
import { BookingGuestInfo, BookingStep } from "@/types/booking.types";

export default function BookingPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const { data: destination, isLoading, error } = useDestination(id);

  const [currentStep, setCurrentStep] = useState<BookingStep>("info");
  const [bookingId, setBookingId] = useState<string>("");

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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !destination) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Destination not found</h2>
        <button onClick={() => router.back()} className="flex items-center gap-2 text-blue-600 font-bold">
          <ArrowLeft size={20} />
          Go back
        </button>
      </div>
    );
  }

  const pricePerNight = destination.price;
  const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  const totalPrice = pricePerNight * nights;
  const serviceFee = 0;
  const finalPrice = totalPrice + serviceFee;

  const formatDateForInput = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

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

  const isGuestInfoValid = () => {
    return (
      guestInfo.firstName.trim() !== "" &&
      guestInfo.lastName.trim() !== "" &&
      guestInfo.email.trim() !== "" &&
      guestInfo.phone.trim() !== "" &&
      guestInfo.country.trim() !== "" &&
      guestInfo.address.trim() !== "" &&
      guestInfo.city.trim() !== "" &&
      guestInfo.zipCode.trim() !== ""
    );
  };

  const handleConfirmBooking = () => {
    const newBookingId = `BK${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    setBookingId(newBookingId);
    setCurrentStep("confirmation");
  };

  const handleBackToDestination = () => {
    router.push(`/destinations/${id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/40 text-gray-900 font-sans">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBackToDestination}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft size={24} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {currentStep === "info" && "Guest Information"}
                  {currentStep === "review" && "Review Your Booking"}
                  {currentStep === "confirmation" && "Booking Confirmed!"}
                </h1>
                <p className="text-sm text-gray-500">{destination.name}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-32 pb-24 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Progress Steps */}
          {currentStep !== "confirmation" && (
            <div className="mb-12 bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between max-w-md mx-auto">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                      currentStep === "info" ? "bg-blue-600 text-white" : "bg-green-500 text-white"
                    }`}
                  >
                    {currentStep === "info" ? "1" : <Check size={20} />}
                  </div>
                  <span className="font-bold text-gray-900">Information</span>
                </div>
                <div className="flex-1 h-0.5 bg-gray-200 mx-4">
                  <div
                    className={`h-full transition-all duration-500 ${
                      currentStep === "review" ? "bg-blue-600 w-full" : "bg-gray-200 w-0"
                    }`}
                  />
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                      currentStep === "review" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    2
                  </div>
                  <span className={`font-bold ${currentStep === "review" ? "text-gray-900" : "text-gray-400"}`}>
                    Review
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Content Sections */}
          <div className="space-y-8">
            {currentStep === "info" && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                {/* Dates Selection */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Select Your Dates</h3>
                  <div className="flex border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                    <div className="flex-1 px-6 py-5 flex flex-col items-start gap-1.5 hover:bg-white transition-colors border-r border-gray-200">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <Calendar size={14} />
                        Check In
                      </label>
                      <input
                        type="date"
                        value={formatDateForInput(checkIn)}
                        onChange={handleCheckInChange}
                        min={formatDateForInput(new Date())}
                        className="text-[15px] font-black bg-transparent border-none outline-none cursor-pointer w-full"
                      />
                    </div>
                    <div className="flex-1 px-6 py-5 flex flex-col items-start gap-1.5 hover:bg-white transition-colors">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <Calendar size={14} />
                        Check Out
                      </label>
                      <input
                        type="date"
                        value={formatDateForInput(checkOut)}
                        onChange={handleCheckOutChange}
                        min={formatDateForInput(new Date(checkIn.getTime() + 86400000))}
                        className="text-[15px] font-black bg-transparent border-none outline-none cursor-pointer w-full"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600 px-2 mt-4">
                    <span className="font-medium">
                      {nights} {nights === 1 ? "night" : "nights"}
                    </span>
                    <span className="font-bold text-blue-600">Total: ${finalPrice.toFixed(2)}</span>
                  </div>
                </div>

                {/* Personal Information */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">First Name *</label>
                      <div className="relative">
                        <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          value={guestInfo.firstName}
                          onChange={(e) => handleGuestInfoChange("firstName", e.target.value)}
                          className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                          placeholder="John"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Last Name *</label>
                      <div className="relative">
                        <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          value={guestInfo.lastName}
                          onChange={(e) => handleGuestInfoChange("lastName", e.target.value)}
                          className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                          placeholder="Doe"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Email *</label>
                      <div className="relative">
                        <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="email"
                          value={guestInfo.email}
                          onChange={(e) => handleGuestInfoChange("email", e.target.value)}
                          className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                          placeholder="john.doe@example.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Phone *</label>
                      <div className="relative">
                        <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="tel"
                          value={guestInfo.phone}
                          onChange={(e) => handleGuestInfoChange("phone", e.target.value)}
                          className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                          placeholder="+1 (555) 000-0000"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Address Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Street Address *</label>
                      <div className="relative">
                        <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          value={guestInfo.address}
                          onChange={(e) => handleGuestInfoChange("address", e.target.value)}
                          className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                          placeholder="123 Main Street"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">City *</label>
                        <input
                          type="text"
                          value={guestInfo.city}
                          onChange={(e) => handleGuestInfoChange("city", e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                          placeholder="New York"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Zip Code *</label>
                        <input
                          type="text"
                          value={guestInfo.zipCode}
                          onChange={(e) => handleGuestInfoChange("zipCode", e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                          placeholder="10001"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Country *</label>
                        <input
                          type="text"
                          value={guestInfo.country}
                          onChange={(e) => handleGuestInfoChange("country", e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                          placeholder="USA"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Special Requests */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Special Requests (Optional)</h3>
                  <textarea
                    value={guestInfo.specialRequests}
                    onChange={(e) => handleGuestInfoChange("specialRequests", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all resize-none"
                    rows={4}
                    placeholder="Any special requests or requirements..."
                  />
                </div>
              </motion.div>
            )}

            {currentStep === "review" && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                {/* Destination Summary */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                  <div className="flex gap-6">
                    <img
                      src={destination.image || `https://picsum.photos/800/800?random=${destination.id}`}
                      alt={destination.name}
                      className="w-32 h-32 rounded-xl object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{destination.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} />
                          <span>
                            {checkIn.toLocaleDateString()} - {checkOut.toLocaleDateString()}
                          </span>
                        </div>
                        <span>•</span>
                        <span>{nights} nights</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Guest Information Review */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Guest Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase mb-1">Name</p>
                      <p className="text-gray-900 font-bold">
                        {guestInfo.firstName} {guestInfo.lastName}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase mb-1">Email</p>
                      <p className="text-gray-900 font-bold">{guestInfo.email}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase mb-1">Phone</p>
                      <p className="text-gray-900 font-bold">{guestInfo.phone}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase mb-1">Country</p>
                      <p className="text-gray-900 font-bold">{guestInfo.country}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-xs font-bold text-gray-400 uppercase mb-1">Address</p>
                      <p className="text-gray-900 font-bold">
                        {guestInfo.address}, {guestInfo.city}, {guestInfo.zipCode}
                      </p>
                    </div>
                    {guestInfo.specialRequests && (
                      <div className="md:col-span-2">
                        <p className="text-xs font-bold text-gray-400 uppercase mb-1">Special Requests</p>
                        <p className="text-gray-600">{guestInfo.specialRequests}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Price Breakdown</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-gray-600">
                      <span>
                        ${pricePerNight.toFixed(2)} x {nights} nights
                      </span>
                      <span className="font-bold">${totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Service Fee</span>
                      <span className="font-bold">${serviceFee.toFixed(2)}</span>
                    </div>
                    <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">Total</span>
                      <span className="text-2xl font-bold text-blue-600">${finalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === "confirmation" && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center space-y-8">
                  <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 size={48} className="text-white" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-3xl font-bold text-gray-900">Booking Confirmed!</h3>
                    <p className="text-gray-600 text-lg">Your reservation has been successfully confirmed.</p>
                  </div>

                  <div className="p-6 bg-blue-50 rounded-2xl border-2 border-blue-200 border-dashed">
                    <p className="text-sm font-bold text-gray-600 mb-2">Booking Reference</p>
                    <p className="text-3xl font-black text-blue-600 tracking-wider">{bookingId}</p>
                  </div>

                  {/* Destination Image & Name */}
                  <div className="flex gap-6 p-6 bg-gray-50 rounded-2xl text-left">
                    <img
                      src={destination.image || `https://picsum.photos/800/800?random=${destination.id}`}
                      alt={destination.name}
                      className="w-24 h-24 rounded-xl object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-gray-900 mb-2">{destination.name}</h4>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar size={16} />
                        <span>
                          {checkIn.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}{" "}
                          -{" "}
                          {checkOut.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Price Breakdown Card */}
                  <div className="p-6 bg-white rounded-2xl border border-gray-200 text-left space-y-4">
                    <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                      <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Price Details</h4>
                    </div>

                    {/* Dates Display */}
                    <div className="flex border border-gray-100 rounded-xl overflow-hidden bg-gray-50/50">
                      <div className="flex-1 px-4 py-3 flex flex-col items-start gap-1 border-r border-gray-100">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          Check In
                        </span>
                        <span className="text-sm font-black text-gray-900">
                          {checkIn.toLocaleDateString("en-US", {
                            month: "2-digit",
                            day: "2-digit",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex-1 px-4 py-3 flex flex-col items-start gap-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          Check Out
                        </span>
                        <span className="text-sm font-black text-gray-900">
                          {checkOut.toLocaleDateString("en-US", {
                            month: "2-digit",
                            day: "2-digit",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Price Breakdown */}
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between text-gray-500 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="underline decoration-gray-200 decoration-dotted underline-offset-4">
                            ${pricePerNight.toFixed(2)} x {nights} {nights === 1 ? "night" : "nights"}
                          </span>
                        </div>
                        <span className="font-bold text-gray-900">${totalPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center justify-between text-gray-500 text-sm">
                        <span className="underline decoration-gray-200 decoration-dotted underline-offset-4">
                          Service Fee
                        </span>
                        <span className="font-bold text-gray-900">${serviceFee.toFixed(2)}</span>
                      </div>
                      <div className="pt-3 border-t border-gray-200 flex items-center justify-between">
                        <span className="text-base font-black text-gray-900">Total Price</span>
                        <span className="text-2xl font-black text-blue-600">${finalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Guest Information */}
                  <div className="p-6 bg-gray-50 rounded-2xl space-y-3 text-left">
                    <h4 className="font-bold text-gray-900">Guest Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Name:</span>
                        <span className="font-bold text-gray-900">
                          {guestInfo.firstName} {guestInfo.lastName}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-bold text-gray-900">{guestInfo.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Phone:</span>
                        <span className="font-bold text-gray-900">{guestInfo.phone}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-500">
                    A confirmation email has been sent to{" "}
                    <span className="font-bold text-gray-900">{guestInfo.email}</span>
                  </p>

                  <button
                    onClick={handleBackToDestination}
                    className="w-full px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/25 active:scale-95"
                  >
                    Back to Destination
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Fixed Footer Actions */}
          {currentStep !== "confirmation" && (
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 shadow-lg">
              <div className="max-w-5xl mx-auto px-4 sm:px-8 py-6">
                <div className="flex items-center justify-between gap-4">
                  <button
                    onClick={() => {
                      if (currentStep === "review") {
                        setCurrentStep("info");
                      } else {
                        handleBackToDestination();
                      }
                    }}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all"
                  >
                    <ArrowLeft size={20} />
                    {currentStep === "review" ? "Back" : "Cancel"}
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
                    disabled={currentStep === "info" && !isGuestInfoValid()}
                    className="flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/25 active:scale-95"
                  >
                    {currentStep === "info" && (
                      <>
                        Continue
                        <ChevronRight size={20} />
                      </>
                    )}
                    {currentStep === "review" && "Confirm Booking"}
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
