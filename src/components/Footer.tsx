import { Check, Facebook, Instagram, Loader2, Mail } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import React, { useState } from "react";

import { Link } from "@/navigation";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:2431";

export const Footer: React.FC = () => {
  const t = useTranslations("Footer");
  const locale = useLocale();
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;

    setNewsletterStatus("loading");
    try {
      const res = await fetch(`${API_BASE_URL}/api/newsletter/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newsletterEmail, locale }),
      });

      if (!res.ok) {
        const data = await res.json();
        if (data.statusCode === 409) {
          setNewsletterStatus("success");
        } else {
          throw new Error(data.message);
        }
      } else {
        setNewsletterStatus("success");
        setNewsletterEmail("");
      }
    } catch {
      setNewsletterStatus("error");
    }

    setTimeout(() => setNewsletterStatus("idle"), 4000);
  };

  return (
    <footer className="bg-white pt-24 pb-12" id="contact">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {/* Logo & Bio */}
          <div className="lg:col-span-1 space-y-8">
            <div className="flex items-center gap-2">
              <span className="text-3xl font-black tracking-tighter text-gray-900">KinXplore</span>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
            </div>
            <p className="text-gray-500 font-medium leading-relaxed">{t("description")}</p>
            <div className="flex items-center gap-4">
              <a
                href="https://www.instagram.com/kinxplore/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=100079690630995"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://www.tiktok.com/@kinxplore"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                </svg>
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-8">
            <h4 className="text-lg font-bold text-gray-900">{t("company")}</h4>
            <ul className="space-y-4">
              <li>
                <a href="#" className="text-gray-500 hover:text-blue-600 font-medium transition-colors">
                  {t("aboutUs")}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-blue-600 font-medium transition-colors">
                  {t("services")}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-blue-600 font-medium transition-colors">
                  {t("community")}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-blue-600 font-medium transition-colors">
                  {t("ourBlog")}
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-8" id="faq">
            <h4 className="text-lg font-bold text-gray-900">{t("support")}</h4>
            <ul className="space-y-4">
              <li>
                <a href="#" className="text-gray-500 hover:text-blue-600 font-medium transition-colors">
                  {t("helpCenter")}
                </a>
              </li>
              <li>
                <Link href="/safety" className="text-gray-500 hover:text-blue-600 font-medium transition-colors">
                  {t("safetyInfo")}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-500 hover:text-blue-600 font-medium transition-colors">
                  {t("terms")}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-500 hover:text-blue-600 font-medium transition-colors">
                  {t("privacy")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-8">
            <h4 className="text-lg font-bold text-gray-900">{t("subscribe")}</h4>
            <p className="text-gray-500 font-medium">{t("subscribeDesc")}</p>
            <form onSubmit={handleSubscribe} className="relative">
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder={t("emailPlaceholder")}
                required
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-6 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
              <button
                type="submit"
                disabled={newsletterStatus === "loading"}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all disabled:opacity-50"
              >
                {newsletterStatus === "loading" ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : newsletterStatus === "success" ? (
                  <Check size={18} />
                ) : (
                  <Mail size={18} />
                )}
              </button>
            </form>
            {newsletterStatus === "success" && (
              <p className="text-sm text-green-600 font-medium mt-2">{t("subscribeSuccess")}</p>
            )}
            {newsletterStatus === "error" && (
              <p className="text-sm text-red-600 font-medium mt-2">{t("subscribeError")}</p>
            )}
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm font-medium text-gray-400">{t("copyright")}</p>
          <div className="flex gap-8">
            <Link href="/privacy" className="text-sm font-medium text-gray-400 hover:text-blue-600 transition-colors">
              {t("privacyLink")}
            </Link>
            <Link href="/terms" className="text-sm font-medium text-gray-400 hover:text-blue-600 transition-colors">
              {t("termsLink")}
            </Link>
            <Link href="/privacy" className="text-sm font-medium text-gray-400 hover:text-blue-600 transition-colors">
              {t("cookiesLink")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
