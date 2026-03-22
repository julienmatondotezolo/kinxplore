"use client";

import { ChevronDown, Phone } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactCountryFlag from "react-country-flag";

import { countryCodes } from "@/lib/country-codes";

interface PhoneInputProps {
  phoneCode: string;
  onPhoneCodeChange: (code: string) => void;
  phone: string;
  onPhoneChange: (value: string) => void;
  className?: string;
  inputClassName?: string;
}

export default function PhoneInput({
  phoneCode,
  onPhoneCodeChange,
  phone,
  onPhoneChange,
  className = "",
  inputClassName = "w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900",
}: PhoneInputProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = countryCodes.find((c) => c.dial === phoneCode) || countryCodes[0];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`flex gap-2 ${className}`}>
      {/* Country code selector */}
      <div className="relative shrink-0" ref={ref}>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1.5 w-[120px] pl-2.5 pr-7 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 text-sm hover:bg-gray-50 transition-colors"
        >
          <ReactCountryFlag
            countryCode={selected.code}
            svg
            style={{ width: "1.2em", height: "1.2em" }}
          />
          <span className="font-medium">{selected.dial}</span>
        </button>
        <ChevronDown
          size={14}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />

        {open && (
          <div className="absolute top-full left-0 mt-1 w-[220px] max-h-60 overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-xl z-50">
            {countryCodes.map((c) => (
              <button
                key={c.code}
                type="button"
                onClick={() => {
                  onPhoneCodeChange(c.dial);
                  setOpen(false);
                }}
                className={`flex items-center gap-2.5 w-full px-3 py-2.5 text-sm hover:bg-blue-50 transition-colors ${
                  c.dial === phoneCode ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700"
                }`}
              >
                <ReactCountryFlag
                  countryCode={c.code}
                  svg
                  style={{ width: "1.3em", height: "1.3em" }}
                />
                <span className="flex-1 text-left">{c.name}</span>
                <span className="text-gray-400 text-xs">{c.dial}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Phone number input */}
      <div className="relative flex-1">
        <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="tel"
          inputMode="numeric"
          value={phone}
          onChange={(e) => {
            const value = e.target.value.replace(/[^0-9]/g, "");
            onPhoneChange(value);
          }}
          placeholder="123456789"
          className={inputClassName}
        />
      </div>
    </div>
  );
}
