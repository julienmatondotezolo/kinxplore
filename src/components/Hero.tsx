import React from 'react';
import { ArrowRight, Star, Plus, Plane, MapPin, Compass, Heart } from 'lucide-react';
import { TripPlannerForm } from './TripPlannerForm';
import { UserPreferences } from '@/types';

interface HeroProps {
  onGenerate: (prefs: UserPreferences) => void;
  isLoading: boolean;
}

export const Hero: React.FC<HeroProps> = ({ onGenerate, isLoading }) => {
  const suggestions = [
    { title: "Lola ya Bonobo", location: "Mont Ngafula", img: "https://picsum.photos/400/300?random=11" },
    { title: "Zongo Falls", location: "Bas-Congo", img: "https://picsum.photos/400/300?random=12" },
    { title: "Marché de la Liberté", location: "Masina", img: "https://picsum.photos/400/300?random=13" },
    { title: "Congo River", location: "Gombe", img: "https://picsum.photos/400/300?random=14" },
  ];

  return (
    <div className="relative pt-40 pb-48 px-4 overflow-hidden bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/40">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large primary blob - top right */}
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" />
        
        {/* Secondary blob - bottom left */}
        <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-gradient-to-tr from-pink-400/15 to-orange-400/15 rounded-full blur-3xl animate-pulse delay-1000" />
        
        {/* Accent blob - middle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse delay-500" />
        
        {/* Floating decorative shapes */}
        <div className="absolute top-20 left-[10%] w-20 h-20 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl rotate-12 animate-float" />
        <div className="absolute bottom-40 right-[15%] w-16 h-16 bg-gradient-to-br from-pink-500/10 to-orange-500/10 rounded-full animate-float-delayed" />
        <div className="absolute top-[60%] left-[5%] w-12 h-12 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-lg -rotate-12 animate-float-slow" />
        
        {/* Icon decorations */}
        <div className="absolute top-32 right-[20%] text-blue-400/20 animate-float">
          <Plane size={40} className="rotate-45" />
        </div>
        <div className="absolute bottom-32 left-[15%] text-purple-400/20 animate-float-delayed">
          <Compass size={36} />
        </div>
        <div className="absolute top-[45%] right-[10%] text-pink-400/20 animate-float-slow">
          <MapPin size={32} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
        
        {/* Left Content */}
        <div className="space-y-10 relative z-10">
          <div className="inline-flex items-center gap-2 bg-orange-50/80 backdrop-blur-sm text-orange-600 px-5 py-2.5 rounded-full text-sm font-bold border border-orange-100/50">
            <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
            Discover Kinshasa, DRC
          </div>
          
          <div className="space-y-6">
            <h1 className="text-5xl md:text-[4.5rem] font-extrabold text-[#111] leading-[1.05] tracking-tight">
              Let's <br/>
              <span className="flex items-center gap-4 flex-wrap">
                Explore
                <span className="inline-block w-20 h-10 md:w-28 md:h-16 bg-blue-100 rounded-full overflow-hidden border-4 border-white shadow-sm -rotate-2 transform hover:rotate-0 transition-transform duration-500">
                  <img src="https://picsum.photos/400/300?random=50" className="w-full h-full object-cover" alt="Kinshasa" />
                </span>
                the
              </span>
              world
            </h1>
            
            <p className="text-lg md:text-xl text-gray-500 max-w-lg leading-relaxed font-medium">
              Discover Kinshasa with Ease! Your dream destinations and unforgettable experiences are just a click away.
            </p>
          </div>

          {/* Search Form Integrated */}
          <div className="pt-2">
            <TripPlannerForm onGenerate={onGenerate} isLoading={isLoading} compact={true} />
          </div>

          {/* Destination Suggestions */}
          <div className="space-y-6 pt-2">
            <div className="flex items-center justify-between max-w-lg">
              <h3 className="font-bold text-gray-900">Explore Nearby</h3>
              <button className="text-sm font-bold text-blue-600 flex items-center gap-1 hover:underline">
                View all <ArrowRight size={14} />
              </button>
            </div>
            
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {suggestions.map((item, i) => (
                <div key={i} className="min-w-[180px] group cursor-pointer">
                  <div className="relative h-24 rounded-2xl overflow-hidden mb-3">
                    <img src={item.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.title} />
                    <div className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur rounded-full shadow-sm">
                      <Heart size={12} className="text-gray-400 group-hover:text-red-500 transition-colors" />
                    </div>
                  </div>
                  <h4 className="font-bold text-sm text-gray-900 group-hover:text-blue-600 transition-colors">{item.title}</h4>
                  <p className="text-xs text-gray-400 font-medium flex items-center gap-1">
                    <MapPin size={10} /> {item.location}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Content - Modern Grid */}
        <div className="relative hidden lg:block h-[600px]">
            {/* Main large image with "X" close-like icon from example */}
            <div className="absolute top-0 right-0 w-[85%] h-[75%] rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white group">
                <img src="https://picsum.photos/800/1000?random=1" alt="Destination" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                <div className="absolute top-8 right-8 w-12 h-12 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg">
                    <Plus size={24} className="text-gray-900 rotate-45" />
                </div>
            </div>

            {/* Bottom floating image */}
            <div className="absolute -bottom-4 left-0 w-[60%] h-[50%] rounded-[3.5rem] overflow-hidden shadow-2xl border-8 border-white z-20 group">
                <img src="https://picsum.photos/600/600?random=2" alt="Landscape" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                <div className="absolute top-8 right-8 w-12 h-12 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg">
                    <Plus size={24} className="text-gray-900 rotate-45" />
                </div>
            </div>

            {/* Side social icons from example */}
            <div className="absolute -right-4 top-1/4 flex flex-col gap-4 z-30">
                <div className="w-10 h-10 bg-[#FF6B00] rounded-full flex items-center justify-center text-white shadow-lg cursor-pointer hover:scale-110 transition">
                    <span className="font-bold text-xs italic">in</span>
                </div>
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-900 shadow-lg cursor-pointer hover:scale-110 transition border border-gray-100">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63z" /></svg>
                </div>
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-900 shadow-lg cursor-pointer hover:scale-110 transition border border-gray-100">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.25 2.25h6.834l4.697 6.147 5.463-6.147zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" /></svg>
                </div>
            </div>

            {/* Decorative element - floating plane/star or similar */}
            <div className="absolute top-[20%] left-[-5%] w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center transform -rotate-12 animate-bounce duration-[3000ms] z-30">
                <Star size={30} className="text-yellow-400 fill-current" />
            </div>
        </div>

      </div>
    </div>
  );
};