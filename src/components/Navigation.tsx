import React from 'react';
import { Menu, Globe, User } from 'lucide-react';

export const Navigation: React.FC = () => {
  return (
    <nav className="w-full py-6 px-4 md:px-12 flex justify-between items-center bg-transparent absolute top-0 z-50">
      <div className="flex items-center gap-2">
        <div className="bg-blue-600 text-white p-2 rounded-full">
          <Globe size={24} />
        </div>
        <span className="text-2xl font-bold tracking-tight text-gray-900">KinXplore</span>
      </div>

      <div className="hidden md:flex gap-8 items-center text-sm font-medium text-gray-600">
        <a href="#" className="text-blue-600 font-semibold">Home</a>
        <a href="#destinations" className="hover:text-blue-600 transition">Destinations</a>
        <a href="#services" className="hover:text-blue-600 transition">Services</a>
        <a href="#contact" className="hover:text-blue-600 transition">Contact</a>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 rounded-full hover:bg-gray-100 transition">
          <User size={20} className="text-gray-700" />
        </button>
        <button className="md:hidden p-2 rounded-full hover:bg-gray-100 transition">
          <Menu size={24} className="text-gray-700" />
        </button>
      </div>
    </nav>
  );
};