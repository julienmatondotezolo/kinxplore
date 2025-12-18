import React from 'react';
import { Calendar, Zap, ShieldCheck, Headphones, ArrowRight } from 'lucide-react';

const services = [
  {
    icon: Calendar,
    title: "Trip Planning",
    desc: "Personalized itineraries designed specifically for your travel style and needs.",
    bgColor: "bg-[#DEFCE9]",
    iconBg: "bg-[#63E6BE]",
  },
  {
    icon: Zap,
    title: "AI Itinerary",
    desc: "Instant AI generation saves you hours of research time for your Kinshasa trip.",
    bgColor: "bg-[#E6F0FF]",
    iconBg: "bg-[#A5D8FF]",
  },
  {
    icon: ShieldCheck,
    title: "Safe Packages",
    desc: "Bridges to premium and verified local experiences at the best guaranteed prices.",
    bgColor: "bg-[#F9E6FF]",
    iconBg: "bg-[#FFD6FF]",
  },
  {
    icon: Headphones,
    title: "Local Support",
    desc: "24/7 support from local experts ready to assist you any time during your stay.",
    bgColor: "bg-[#FFF4E6]",
    iconBg: "bg-[#FFD8A8]",
  },
];

export const OurServices: React.FC = () => {
  return (
    <div className="py-32 bg-white" id="services">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-20 space-y-4">
          <h2 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Our services
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((svc, i) => (
            <div
              key={i}
              className={`group ${svc.bgColor} p-10 rounded-[2.5rem] transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 flex flex-col items-start text-left`}
            >
              <div className={`w-14 h-14 ${svc.iconBg} rounded-2xl flex items-center justify-center text-gray-900 mb-8 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                <svc.icon size={28} />
              </div>
              <h3 className="font-extrabold text-3xl text-gray-900 mb-4">{svc.title}</h3>
              <p className="text-gray-600 font-medium leading-relaxed mb-10">{svc.desc}</p>
              
              <button className="mt-auto flex items-center gap-2 font-bold text-gray-900 group/btn">
                Explore Now
                <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
