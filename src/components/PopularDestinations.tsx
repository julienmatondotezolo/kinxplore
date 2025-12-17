import React from 'react';
import { ArrowUpRight } from 'lucide-react';

const destinations = [
    { title: "Zongo Falls", price: "$120", rating: 4.8, img: 5 },
    { title: "Lola ya Bonobo", price: "$40", rating: 4.9, img: 6 },
    { title: "Fleuve Congo", price: "$85", rating: 4.7, img: 7 },
    { title: "Ma Vallée", price: "$60", rating: 4.6, img: 8 },
];

export const PopularDestinations: React.FC = () => {
    return (
        <div className="py-20 max-w-7xl mx-auto px-4" id="destinations">
            <div className="mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Popular Destinations</h2>
                <p className="text-gray-500">Discover the gems around Kinshasa most loved by travelers.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {destinations.map((dest, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-3xl shadow-lg shadow-gray-100 hover:shadow-xl transition-all hover:-translate-y-1 group cursor-pointer">
                        <div className="relative overflow-hidden rounded-2xl mb-4 h-64">
                            <img 
                                src={`https://picsum.photos/400/500?random=${dest.img}`} 
                                alt={dest.title} 
                                className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500"
                            />
                            <div className="absolute top-3 right-3 bg-white/30 backdrop-blur p-2 rounded-full text-white hover:bg-white hover:text-black transition">
                                <ArrowUpRight size={20} />
                            </div>
                            <div className="absolute bottom-3 left-3 bg-white px-3 py-1 rounded-lg text-xs font-bold shadow-sm">
                                {dest.rating} ⭐
                            </div>
                        </div>
                        <div className="px-2 pb-2">
                            <div className="flex justify-between items-end">
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900">{dest.title}</h3>
                                    <p className="text-sm text-gray-400">Starting</p>
                                </div>
                                <span className="font-bold text-blue-600 text-lg">{dest.price}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};