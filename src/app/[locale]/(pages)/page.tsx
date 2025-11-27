"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

export default function Index() {
  const indexPageText = useTranslations("Index");

  return (
    <main className="relative space-y-4 p-6">
      <p className="text-lg">{indexPageText("welcome")}</p>
      <div className="flex gap-3">
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
      </div>
    </main>
  );
}
