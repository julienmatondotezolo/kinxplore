import React, { useState, useEffect } from 'react';
import { Menu, Globe, User, Heart, ShoppingBag } from 'lucide-react';

export const Navigation: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`w-full flex justify-between items-center transition-all duration-500 z-[100] ${
      isScrolled 
        ? 'fixed top-0 bg-white/70 backdrop-blur-xl py-3 px-4 md:px-12 shadow-sm border-b border-gray-100/50' 
        : 'absolute top-0 bg-transparent py-6 px-4 md:px-12'
    }`}>
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold tracking-tight text-gray-900">KinXplore</span>
      </div>

      <div className={`hidden md:flex items-center px-8 py-3 rounded-full transition-all duration-500 gap-8 text-sm font-medium ${
        isScrolled 
          ? 'bg-transparent text-gray-600' 
          : 'bg-white/80 backdrop-blur-md shadow-sm border border-gray-100/50 text-gray-600'
      }`}>
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