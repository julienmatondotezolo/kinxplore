import React, { useState } from 'react';
import { TripStyle, UserPreferences } from '@/types';
import { MapPin, Calendar, Users, Activity, ArrowRight, Loader2 } from 'lucide-react';

interface Props {
  onGenerate: (prefs: UserPreferences) => void;
  isLoading: boolean;
}

export const TripPlannerForm: React.FC<Props> = ({ onGenerate, isLoading }) => {
  const [style, setStyle] = useState<TripStyle>(TripStyle.Adventure);
  const [groupSize, setGroupSize] = useState<number>(2);
  const [duration, setDuration] = useState<number>(3);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate({ style, groupSize, duration });
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 -mt-24 md:-mt-32 relative z-30 mx-4 md:mx-auto max-w-5xl border border-gray-100">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
        
        {/* Destination (Static for now as it's KinXplore) */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-500 pl-1">Destination</label>
          <div className="relative bg-gray-50 rounded-xl p-4 flex items-center gap-3 border border-gray-100 hover:border-blue-200 transition group">
            <div className="bg-white p-2 rounded-lg shadow-sm text-blue-600 group-hover:text-blue-700">
              <MapPin size={20} />
            </div>
            <div>
              <p className="font-bold text-gray-900">Kinshasa</p>
              <p className="text-xs text-gray-500">DR Congo</p>
            </div>
          </div>
        </div>

        {/* Style Selector */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-500 pl-1">Trip Style</label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <Activity size={20} />
            </div>
            <select 
              value={style}
              onChange={(e) => setStyle(e.target.value as TripStyle)}
              className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 pl-12 font-semibold text-gray-900 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer hover:bg-white hover:border-blue-200 transition"
            >
              {Object.values(TripStyle).map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Duration & Size Grouped */}
        <div className="flex gap-4">
          <div className="flex flex-col gap-2 flex-1">
            <label className="text-sm font-semibold text-gray-500 pl-1">Days</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Calendar size={18} />
              </div>
              <input 
                type="number" 
                min="1" 
                max="14"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 pl-10 font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2 flex-1">
            <label className="text-sm font-semibold text-gray-500 pl-1">People</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Users size={18} />
              </div>
              <input 
                type="number" 
                min="1" 
                max="50"
                value={groupSize}
                onChange={(e) => setGroupSize(parseInt(e.target.value))}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 pl-10 font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="h-full flex items-end">
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Planning...
              </>
            ) : (
              <>
                Generate Trip
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
};