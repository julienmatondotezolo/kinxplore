import React from 'react';
import { Menu, Globe, User, Heart, ShoppingBag } from 'lucide-react';

export const Navigation: React.FC = () => {
  return (
    <nav className="w-full py-6 px-4 md:px-12 flex justify-between items-center bg-transparent absolute top-0 z-50">
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold tracking-tight text-gray-900">KinXplore</span>
      </div>

      <div className="hidden md:flex items-center bg-white/80 backdrop-blur-md px-8 py-3 rounded-full shadow-sm border border-gray-100/50 gap-8 text-sm font-medium text-gray-600">
        <a href="#" className="text-blue-600 font-semibold flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
          Home
        </a>
        <a href="#destinations" className="hover:text-blue-600 transition">Destination</a>
        <a href="#services" className="hover:text-blue-600 transition">Services</a>
        <a href="#faq" className="hover:text-blue-600 transition">FAQ</a>
        <a href="#contact" className="hover:text-blue-600 transition">Contact</a>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-5 text-gray-700">
          <button className="hover:text-blue-600 transition">
            <Heart size={20} />
          </button>
          <button className="hover:text-blue-600 transition">
            <ShoppingBag size={20} />
          </button>
        </div>
        
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm">
            <img src="https://picsum.photos/100/100?random=10" alt="Profile" className="w-full h-full object-cover" />
          </div>
          <div className="hidden lg:block">
            <p className="text-[10px] text-gray-400 font-medium leading-none mb-1">Hello!</p>
            <p className="text-sm font-bold text-gray-900 leading-none">Traveler</p>
          </div>
        </div>

        <button className="md:hidden p-2 rounded-full hover:bg-gray-100 transition">
          <Menu size={24} className="text-gray-700" />
        </button>
      </div>
    </nav>
  );
};