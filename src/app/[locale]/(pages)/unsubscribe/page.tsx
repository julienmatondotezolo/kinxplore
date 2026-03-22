"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Link } from "@/navigation";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:2431";

export default function UnsubscribePage() {
  const t = useTranslations("Unsubscribe");
  const locale = useLocale();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const success = searchParams.get("success");

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    success ? "success" : "loading"
  );

  useEffect(() => {
    if (success) return;

    if (!token) {
      setStatus("error");
      return;
    }

    fetch(`${API_BASE_URL}/api/newsletter/unsubscribe?token=${encodeURIComponent(token)}`, {
      redirect: "manual",
    })
      .then((res) => {
        if (res.ok || res.type === "opaqueredirect" || res.status === 302) {
          setStatus("success");
        } else {
          setStatus("error");
        }
      })
      .catch(() => {
        setStatus("error");
      });
  }, [token, success]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md"
      >
        {status === "loading" && (
          <>
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{t("processing")}</h2>
          </>
        )}

        {status === "success" && (
          <>
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{t("title")}</h2>
            <p className="text-gray-600 mb-2">{t("message")}</p>
            <p className="text-gray-500 text-sm mb-6">{t("resubscribe")}</p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all"
            >
              {t("backToHome")}
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{t("failed")}</h2>
            <p className="text-gray-600 mb-6">{t("failedMessage")}</p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all"
            >
              {t("backToHome")}
            </Link>
          </>
        )}
      </motion.div>
    </div>
  );
}
