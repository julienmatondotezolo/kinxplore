import React from 'react';
import { ArrowRight, Star } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <div className="relative pt-32 pb-48 px-4 overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Text Content */}
        <div className="space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-bold">
            <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
            Discover Central Africa
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-[1.1] tracking-tight">
            Let's <span className="text-blue-600">Explore</span> <br/>
            Kinshasa
          </h1>
          
          <p className="text-lg md:text-xl text-gray-500 max-w-lg leading-relaxed">
            Experience the vibrant heart of the DRC. From the rhythm of Rumba to the serene Congo River, let KinXplore design your perfect journey.
          </p>

          <div className="flex items-center gap-6 pt-4">
             <div className="flex -space-x-4">
                {[1,2,3,4].map(i => (
                    <img key={i} src={`https://picsum.photos/100/100?random=${i + 20}`} className="w-12 h-12 rounded-full border-4 border-white object-cover" alt="User" />
                ))}
             </div>
             <div>
                <div className="flex items-center gap-1 text-yellow-400">
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                </div>
                <p className="text-sm text-gray-600 font-medium">4.9/5 from 2k+ Travelers</p>
             </div>
          </div>
        </div>

        {/* Hero Image Grid */}
        <div className="relative hidden lg:block">
            {/* Decorative blobs */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-100 rounded-full blur-3xl -z-10 opacity-50"></div>

            <div className="grid grid-cols-2 gap-4 relative">
                <div className="space-y-4 mt-12">
                     <div className="relative group overflow-hidden rounded-3xl shadow-lg">
                        <img src="https://picsum.photos/600/800?random=1" alt="Kinshasa Art" className="w-full h-64 object-cover transform group-hover:scale-105 transition duration-700" />
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur rounded-full p-2">
                            <ArrowRight size={16} className="text-gray-900 -rotate-45" />
                        </div>
                    </div>
                    <div className="relative group overflow-hidden rounded-3xl shadow-lg">
                        <img src="https://picsum.photos/600/600?random=2" alt="Congo River" className="w-full h-48 object-cover transform group-hover:scale-105 transition duration-700" />
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="relative group overflow-hidden rounded-3xl shadow-lg">
                        <img src="https://picsum.photos/600/600?random=3" alt="Kinshasa City" className="w-full h-48 object-cover transform group-hover:scale-105 transition duration-700" />
                    </div>
                    <div className="relative group overflow-hidden rounded-3xl shadow-lg">
                        <img src="https://picsum.photos/600/800?random=4" alt="Culture" className="w-full h-64 object-cover transform group-hover:scale-105 transition duration-700" />
                        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-4 py-2 rounded-xl text-sm font-bold shadow-sm">
                            Lola ya Bonobo 🐒
                        </div>
                    </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute top-1/4 -right-8 bg-white p-4 rounded-2xl shadow-xl animate-bounce duration-[3000ms]">
                    <div className="flex items-center gap-3">
                        <div className="bg-green-100 p-2 rounded-full text-green-600">
                            <Star size={20} fill="currentColor" />
                        </div>
                        <div>
                            <p className="font-bold text-gray-900">Top Rated</p>
                            <p className="text-xs text-gray-500">Zongo Falls</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};