"use client";

import { ChevronDown, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactCountryFlag from "react-country-flag";

import { countryCodes } from "@/lib/country-codes";

interface CountrySelectProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function CountrySelect({
  value,
  onChange,
  placeholder = "Select country",
  className = "w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all",
}: CountrySelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const selected = countryCodes.find((c) => c.name === value);

  const filtered = search
    ? countryCodes.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
    : countryCodes;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (open && searchRef.current) {
      searchRef.current.focus();
    }
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`${className} flex items-center justify-between gap-2 text-left cursor-pointer`}
      >
        {selected ? (
          <span className="flex items-center gap-2">
            <ReactCountryFlag countryCode={selected.code} svg style={{ width: "1.2em", height: "1.2em" }} />
            <span>{selected.name}</span>
          </span>
        ) : (
          <span className="text-gray-400">{placeholder}</span>
        )}
        <ChevronDown size={14} className="text-gray-400 shrink-0" />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-full max-h-60 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
          <div className="sticky top-0 bg-white border-b border-gray-100 p-2">
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-full pl-8 pr-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <div className="overflow-y-auto max-h-48">
            {filtered.map((c) => (
              <button
                key={c.code}
                type="button"
                onClick={() => {
                  onChange(c.name);
                  setOpen(false);
                  setSearch("");
                }}
                className={`flex items-center gap-2.5 w-full px-3 py-2.5 text-sm hover:bg-blue-50 transition-colors ${
                  c.name === value ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700"
                }`}
              >
                <ReactCountryFlag countryCode={c.code} svg style={{ width: "1.3em", height: "1.3em" }} />
                <span>{c.name}</span>
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="px-3 py-4 text-sm text-gray-400 text-center">No countries found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
