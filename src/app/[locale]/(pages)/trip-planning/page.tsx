"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Send,
  User,
  Users,
} from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useState } from "react";

import { Footer } from "@/components/Footer";
import { Navigation } from "@/components/Navigation";
import { supabase } from "@/lib/supabase";
import { useRouter } from "@/navigation";

export default function TripPlanningPage() {
  const t = useTranslations("TripPlanning");
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    destination: "both",
    dateFrom: "",
    dateTo: "",
    travelers: "2",
    tripStyle: "",
    budget: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("trip_inquiries").insert({
        first_name: form.firstName,
        last_name: form.lastName,
        email: form.email,
        phone: form.phone,
        destination: form.destination,
        date_from: form.dateFrom || null,
        date_to: form.dateTo || null,
        travelers: parseInt(form.travelers) || 2,
        trip_style: form.tripStyle || null,
        budget: form.budget || null,
        message: form.message || null,
      });
      if (error) throw error;
      setIsSuccess(true);
    } catch {
      // Error handling
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = form.firstName && form.lastName && form.email && form.phone;

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-purple-50/30">
        <Navigation />
        <div className="pt-32 pb-20 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-lg mx-auto text-center py-16"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">{t("success")}</h2>
            <p className="text-gray-500 mb-8">{t("successMessage")}</p>
            <button
              onClick={() => router.push("/")}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold"
            >
              {t("backToHome")}
            </button>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-purple-50/30">
      <Navigation />

      <div className="pt-32 pb-20 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
              {t("title")}
            </h1>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              {t("subtitle")}
            </p>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Personal Info */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 space-y-4">
              <h2 className="font-bold text-gray-900">{t("personalInfo")}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t("firstName")} *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t("lastName")} *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t("email")} *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t("phone")} *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Travel Preferences */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 space-y-4">
              <h2 className="font-bold text-gray-900">{t("travelPreferences")}</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("destinationPreference")}</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    name="destination"
                    value={form.destination}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white text-gray-900"
                  >
                    <option value="both">{t("destinationBoth")}</option>
                    <option value="kinshasa">{t("destinationKinshasa")}</option>
                    <option value="kongo_central">{t("destinationKongoCentral")}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t("dateFrom")}</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="date"
                      name="dateFrom"
                      value={form.dateFrom}
                      onChange={handleChange}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t("dateTo")}</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="date"
                      name="dateTo"
                      value={form.dateTo}
                      onChange={handleChange}
                      min={form.dateFrom || new Date().toISOString().split("T")[0]}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t("travelers")}</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="number"
                      name="travelers"
                      value={form.travelers}
                      onChange={handleChange}
                      min="1"
                      max="50"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t("tripStyle")}</label>
                  <select
                    name="tripStyle"
                    value={form.tripStyle}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white text-gray-900"
                  >
                    <option value="">{t("selectStyle")}</option>
                    <option value="adventure">{t("styleAdventure")}</option>
                    <option value="cultural">{t("styleCultural")}</option>
                    <option value="relaxation">{t("styleRelaxation")}</option>
                    <option value="family">{t("styleFamily")}</option>
                    <option value="business">{t("styleBusiness")}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("budget")}</label>
                <select
                  name="budget"
                  value={form.budget}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white text-gray-900"
                >
                  <option value="">{t("selectBudget")}</option>
                  <option value="economy">{t("budgetEconomy")}</option>
                  <option value="standard">{t("budgetStandard")}</option>
                  <option value="premium">{t("budgetPremium")}</option>
                  <option value="luxury">{t("budgetLuxury")}</option>
                </select>
              </div>
            </div>

            {/* Message */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 space-y-4">
              <h2 className="font-bold text-gray-900">{t("additionalInfo")}</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("message")}</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={4}
                  placeholder={t("messagePlaceholder")}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white text-gray-900"
                />
              </div>
            </div>

            {/* Submit */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 text-gray-700 font-bold hover:bg-gray-50 rounded-xl flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                {t("back")}
              </button>
              <button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                {t("submit")}
              </button>
            </div>
          </motion.form>
        </div>
      </div>

      <Footer />
    </div>
  );
}
