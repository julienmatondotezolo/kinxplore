import React from 'react';
import { Calendar, Zap, ShieldCheck, Headphones } from 'lucide-react';

const services = [
  {
    icon: Calendar,
    title: "Custom Trip Planning",
    desc: "Personalized itineraries designed specifically for your travel style.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Zap,
    title: "Hassle-Free Booking",
    desc: "Instant AI generation saves you hours of research time.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: ShieldCheck,
    title: "Luxury Trip Packages",
    desc: "Bridges to premium local experiences at the best prices.",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: Headphones,
    title: "24/7 Travel Support",
    desc: "Local Kinshasa experts ready to assist you any time.",
    gradient: "from-orange-500 to-red-500",
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
              className="group glass p-8 rounded-3xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-50 text-center flex flex-col items-center"
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${svc.gradient} rounded-[1.5rem] flex items-center justify-center text-white mb-8 group-hover:scale-110 transition-transform duration-300 shadow-xl`}>
                <svc.icon size={32} />
              </div>
              <h3 className="font-bold text-xl text-gray-900 mb-4">{svc.title}</h3>
              <p className="text-gray-500 font-medium leading-relaxed">{svc.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
