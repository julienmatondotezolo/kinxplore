import React from 'react';
import { ArrowRight, Star, Plus } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <div className="relative pt-40 pb-48 px-4 overflow-hidden bg-[#FAFBFF]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Left Content */}
        <div className="space-y-10 relative z-10">
          <div className="inline-flex items-center gap-2 bg-orange-50/80 backdrop-blur-sm text-orange-600 px-5 py-2.5 rounded-full text-sm font-bold border border-orange-100/50">
            <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
            Discover Kinshasa, DRC
          </div>
          
          <div className="space-y-6">
            <h1 className="text-6xl md:text-[5.5rem] font-extrabold text-[#111] leading-[1.05] tracking-tight">
              Let's <br/>
              <span className="flex items-center gap-4 flex-wrap">
                Explore
                <span className="inline-block w-28 h-14 md:w-36 md:h-20 bg-blue-100 rounded-full overflow-hidden border-4 border-white shadow-sm -rotate-2 transform hover:rotate-0 transition-transform duration-500">
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

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8 pt-4">
             <div className="flex flex-col gap-2">
                <div className="flex -space-x-4">
                    {[1,2,3,4].map(i => (
                        <img key={i} src={`https://picsum.photos/100/100?random=${i + 20}`} className="w-12 h-12 rounded-full border-4 border-white object-cover shadow-sm" alt="User" />
                    ))}
                </div>
                <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-gray-900">Reviews <span className="text-gray-400 font-medium">4.8 out of 5</span></p>
                </div>
             </div>

             <div className="flex items-center gap-2 text-blue-600 font-bold text-sm uppercase tracking-wider cursor-pointer group">
                Explore Best Packages
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center transform group-hover:translate-x-1 transition-transform">
                  <ArrowRight size={14} className="-rotate-45" />
                </div>
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