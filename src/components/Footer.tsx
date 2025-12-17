import React from 'react';
import { Globe, Instagram, Twitter, Facebook } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8 text-center md:text-left">
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
               <div className="bg-blue-600 text-white p-2 rounded-full">
                 <Globe size={24} />
               </div>
               <span className="text-3xl font-bold tracking-tight text-gray-900">KinXplore</span>
            </div>
            <p className="text-gray-500 max-w-sm">
              Making your journey to Kinshasa unforgettable. AI-powered itineraries tailored just for you.
            </p>
          </div>
          
          <div className="flex gap-6">
            <a href="#" className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-600 hover:text-blue-600 hover:scale-110 transition">
                <Instagram size={20} />
            </a>
             <a href="#" className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-600 hover:text-blue-600 hover:scale-110 transition">
                <Twitter size={20} />
            </a>
             <a href="#" className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-600 hover:text-blue-600 hover:scale-110 transition">
                <Facebook size={20} />
            </a>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>© 2024 KinXplore. All Rights Reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-gray-900">Privacy Policy</a>
            <a href="#" className="hover:text-gray-900">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};