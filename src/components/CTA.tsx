import React from 'react';
import { ArrowRight } from 'lucide-react';

export const CTA: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 mb-24">
      <div className="relative glass rounded-[4rem] p-12 md:p-24 overflow-hidden shadow-2xl border border-white/40">
        {/* Background elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50 -z-10" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-50 -z-10" />

        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="flex-1 space-y-6 text-center lg:text-left">
            <h2 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
              Let's enjoy your journey with us
            </h2>
            <p className="text-xl text-gray-500 font-medium max-w-xl">
              Experience ultimate comfort with our AI-driven planning. We know Kinshasa like the back of our hand.
            </p>
          </div>

          <div className="flex-shrink-0 flex flex-col gap-4 w-full md:w-auto">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 px-12 rounded-2xl shadow-xl shadow-blue-500/30 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 group">
              Start Your Plan
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-center text-sm font-medium text-gray-400">
              Free forever. No credit card required.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
