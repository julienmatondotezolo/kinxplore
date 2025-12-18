import React, { useState } from 'react';
import { TripStyle, UserPreferences } from '@/types';
import { MapPin, Calendar, Users, Activity, ArrowRight, Loader2, ChevronDown } from 'lucide-react';

interface Props {
  onGenerate: (prefs: UserPreferences) => void;
  isLoading: boolean;
}

export const TripPlannerForm: React.FC<Props> = ({ onGenerate, isLoading }) => {
  const [style, setStyle] = useState<TripStyle>(TripStyle.Adventure);
  const [groupSize, setGroupSize] = useState<number>(2);
  const [duration, setDuration] = useState<number>(3);
  const [activeTab, setActiveTab] = useState<'destination' | 'flight' | 'hotel'>('destination');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate({ style, groupSize, duration });
  };

  return (
    <div className="relative z-30 mx-4 md:mx-auto max-w-6xl -mt-24">
      {/* Decorative background elements for the form area */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-gradient-to-tl from-pink-400/10 to-orange-400/10 rounded-full blur-3xl" />
      </div>

      {/* Tabs like in example 2 */}
      <div className="flex gap-1 mb-0 ml-4 md:ml-0">
        {[
          { id: 'destination', label: 'Destination' },
          { id: 'flight', label: 'Flight' },
          { id: 'hotel', label: 'Hotel' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-8 py-4 rounded-t-2xl font-bold text-sm transition-all ${
              activeTab === tab.id 
                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30' 
                : 'glass text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="glass rounded-3xl md:rounded-tl-none shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-6 md:p-10 border border-white/40">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-8 items-center">
          
          {/* Location */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-gray-900 ml-1">Location</label>
            <div className="relative group">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 text-blue-600">
                <MapPin size={20} />
              </div>
              <div className="w-full flex items-center justify-between pl-8 pr-2 py-3 border-b border-gray-200 group-hover:border-blue-600 transition-colors cursor-pointer">
                <span className="font-bold text-gray-900">Kinshasa, DRC</span>
                <ChevronDown size={18} className="text-gray-400" />
              </div>
            </div>
          </div>

          {/* Date / Duration */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-gray-900 ml-1">Duration (Days)</label>
            <div className="relative group">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 text-blue-600">
                <Calendar size={20} />
              </div>
              <div className="w-full flex items-center justify-between pl-8 pr-2 py-1 border-b border-gray-200 group-hover:border-blue-600 transition-colors">
                <input 
                  type="number" 
                  min="1" 
                  max="14"
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value))}
                  className="w-full bg-transparent font-bold text-gray-900 focus:outline-none py-2"
                />
                <ChevronDown size={18} className="text-gray-400" />
              </div>
            </div>
          </div>

          {/* Style / Price analogue */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-gray-900 ml-1">Trip Style</label>
            <div className="relative group">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 text-blue-600">
                <Activity size={20} />
              </div>
              <div className="w-full flex items-center justify-between pl-8 pr-0 py-1 border-b border-gray-200 group-hover:border-blue-600 transition-colors">
                <select 
                  value={style}
                  onChange={(e) => setStyle(e.target.value as TripStyle)}
                  className="w-full bg-transparent font-bold text-gray-900 appearance-none focus:outline-none cursor-pointer py-2"
                >
                  {Object.values(TripStyle).map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <ChevronDown size={18} className="text-gray-400 pointer-events-none absolute right-2" />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="md:pl-4">
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 px-8 rounded-2xl transition-all shadow-[0_10px_25px_rgba(37,99,235,0.4)] flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed group active:scale-[0.98]"
            >
              {isLoading ? (
                <>
                  <Loader2 size={22} className="animate-spin" />
                  Planning...
                </>
              ) : (
                <>
                  Search Now
                  <div className="bg-white/20 p-1 rounded-lg group-hover:translate-x-1 transition-transform">
                    <ArrowRight size={18} />
                  </div>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};