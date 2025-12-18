import React from 'react';
import { Plane, Star } from 'lucide-react';

const destinations = [
    { 
        title: "Lola ya Bonobo, Mont Ngafula", 
        price: "$40", 
        rating: 5.0, 
        img: "https://picsum.photos/600/600?random=101" 
    },
    { 
        title: "Zongo Falls, Bas-Congo", 
        price: "$120", 
        rating: 5.0, 
        img: "https://picsum.photos/600/600?random=102" 
    },
    { 
        title: "Ma Vallée, Nature Park", 
        price: "$65", 
        rating: 5.0, 
        img: "https://picsum.photos/600/600?random=103" 
    },
    { 
        title: "Sunset over Congo River", 
        price: "$85", 
        rating: 5.0, 
        img: "https://picsum.photos/600/600?random=104" 
    },
];

export const PopularDestinations: React.FC = () => {
    return (
        <div className="py-24 max-w-7xl mx-auto px-4" id="destinations">
            <div className="mb-12">
                <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">Popular Destinations</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {destinations.map((dest, idx) => (
                    <div key={idx} className="group cursor-pointer">
                        <div className="relative overflow-hidden rounded-[2.5rem] mb-6 aspect-square shadow-sm transition-all duration-500 group-hover:shadow-2xl">
                            <img 
                                src={dest.img} 
                                alt={dest.title} 
                                className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700"
                            />
                            
                            {/* Booking Pill */}
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[85%] bg-white/95 backdrop-blur-md rounded-full py-3 px-6 flex items-center justify-between shadow-lg opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                                <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">Booking Trip</span>
                                <div className="bg-blue-600 text-white p-1.5 rounded-full">
                                    <Plane size={14} className="rotate-45" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2 px-1">
                            <h3 className="font-bold text-lg text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">{dest.title}</h3>
                            <div className="flex justify-between items-center">
                                <div className="flex items-baseline gap-1.5">
                                    <span className="font-bold text-gray-900">{dest.price}</span>
                                    <span className="text-sm font-medium text-gray-400">Starting</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Star size={14} className="text-gray-300 fill-gray-300" />
                                    <span className="text-sm font-bold text-gray-900">{dest.rating.toFixed(1)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};