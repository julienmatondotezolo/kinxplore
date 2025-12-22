import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

import { SavedTrips } from "@/components/SavedTrips";

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: "Hero" });

  return {
    title: `My Trips - KinXplore`,
    description: "View and manage your saved trip itineraries",
  };
}

export default function TripsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/40">
      <div className="max-w-7xl mx-auto py-8 sm:py-12">
        <SavedTrips />
      </div>
    </div>
  );
}

