import React, { useMemo } from 'react';
import { Itinerary } from '@/types';
import { Clock, MapPin, DollarSign, Download, Share2 } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';

interface Props {
  itinerary: Itinerary;
  onReset: () => void;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export const ItineraryResult: React.FC<Props> = ({ itinerary, onReset }) => {
  
  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    itinerary.dailyItinerary.forEach(day => {
      day.activities.forEach(act => {
        counts[act.category] = (counts[act.category] || 0) + 1;
      });
    });
    return Object.keys(counts).map(key => ({ name: key, value: counts[key] }));
  }, [itinerary]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 animate-fade-in">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <button onClick={onReset} className="text-gray-500 hover:text-blue-600 mb-2 font-medium text-sm">
            ← Plan another trip
          </button>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            {itinerary.tripTitle}
          </h2>
          <p className="text-lg text-gray-600 mt-2 max-w-2xl">{itinerary.summary}</p>
        </div>
        <div className="flex gap-3">
            <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold flex items-center gap-2">
                <DollarSign size={16} /> {itinerary.estimatedCost}
            </span>
            <button className="bg-gray-100 p-3 rounded-full hover:bg-gray-200 transition">
                <Download size={20} className="text-gray-700" />
            </button>
            <button className="bg-gray-100 p-3 rounded-full hover:bg-gray-200 transition">
                <Share2 size={20} className="text-gray-700" />
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Itinerary Feed */}
        <div className="lg:col-span-2 space-y-8">
          {itinerary.dailyItinerary.map((day, index) => (
            <div key={index} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div className="bg-blue-600 text-white font-bold px-4 py-1 rounded-full text-sm">
                  Day {day.day}
                </div>
                <span className="text-gray-500 font-medium italic">{day.theme}</span>
              </div>
              
              <div className="space-y-6">
                {day.activities.map((act, i) => (
                  <div key={i} className="flex gap-4 group">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 bg-blue-200 rounded-full mt-2 group-hover:bg-blue-600 transition-colors"></div>
                      {i !== day.activities.length - 1 && <div className="w-0.5 h-full bg-gray-100 my-1"></div>}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-sm font-bold text-blue-600 flex items-center gap-1">
                            <Clock size={14} /> {act.time}
                        </span>
                        <span className="text-xs px-2 py-0.5 bg-gray-100 rounded text-gray-600 border border-gray-200">
                            {act.category}
                        </span>
                      </div>
                      <h4 className="text-xl font-bold text-gray-900">{act.title}</h4>
                      <div className="flex items-center gap-1 text-gray-500 text-sm mb-2 mt-1">
                        <MapPin size={14} />
                        {act.location}
                      </div>
                      <p className="text-gray-600 leading-relaxed text-sm">{act.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar: Stats & Info */}
        <div className="lg:col-span-1 space-y-8">
            {/* Charts Card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold mb-6">Trip Balance</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={categoryData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {categoryData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4">
                    {categoryData.map((entry, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                            <span className="text-gray-600">{entry.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Travel Tips Card */}
            <div className="bg-blue-50 rounded-3xl p-6 border border-blue-100">
                <h3 className="text-lg font-bold text-blue-900 mb-4">Kinshasa Travel Tips</h3>
                <ul className="space-y-3 text-sm text-blue-800">
                    <li className="flex gap-2">
                        <span>🚕</span>
                        <span>Use yellow taxis but negotiate price first.</span>
                    </li>
                    <li className="flex gap-2">
                        <span>☀️</span>
                        <span>Pack light, breathable clothing for humidity.</span>
                    </li>
                    <li className="flex gap-2">
                        <span>🗣️</span>
                        <span>Learning a few words of Lingala helps!</span>
                    </li>
                </ul>
            </div>
        </div>

      </div>
    </div>
  );
};