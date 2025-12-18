import React from "react";

const brands = [
  { name: "Google", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" },
  { name: "OpenAI", icon: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg" },
  { name: "Next.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
  {
    name: "Tailwind",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwind-css-original.svg",
  },
  { name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
  { name: "Vercel", icon: "https://assets.vercel.com/image/upload/v1588805858/repositories/vercel/logo.png" },
];

export const BrandReel: React.FC = () => (
  <div className="py-12 bg-white/50 backdrop-blur-sm border-y border-gray-100 overflow-hidden">
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
        {brands.map((brand, i) => (
          <div key={i} className="h-8 md:h-10 w-auto flex items-center gap-2 grayscale brightness-50">
            <img src={brand.icon} alt={brand.name} className="h-full object-contain" />
            <span className="font-bold text-xl tracking-tight">{brand.name}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);
