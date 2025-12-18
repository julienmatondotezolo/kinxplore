import React from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  {
    name: "Michel Nkonda",
    role: "Digital Nomad",
    text: "A fantastic experience from start to finish! The team made our trip effortless and memorable with their excellent service and attention to detail. Highly recommend for hassle-free travel planning!",
    avatar: "https://picsum.photos/100/100?random=201",
    rating: 5
  },
  {
    name: "Sarah Lukusa",
    role: "Family Traveler",
    text: "KinXplore saved us so much time. Planning a family trip to Kinshasa used to be stressful, but the AI generated a perfect itinerary that kept everyone happy.",
    avatar: "https://picsum.photos/100/100?random=202",
    rating: 5
  }
];

export const Testimonials: React.FC = () => {
  return (
    <div className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">What our client say about us</h2>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Main Testimonial Card */}
          <div className="glass rounded-[3rem] p-8 md:p-16 flex flex-col md:flex-row items-center gap-12 shadow-2xl border border-white/40">
            <div className="w-full md:w-1/3">
              <div className="relative">
                <div className="absolute -inset-4 bg-blue-100 rounded-full blur-2xl opacity-50 -z-10" />
                <img 
                  src={testimonials[0].avatar} 
                  alt={testimonials[0].name} 
                  className="w-full aspect-square object-cover rounded-[2.5rem] border-8 border-white shadow-xl"
                />
              </div>
            </div>

            <div className="w-full md:w-2/3 space-y-6">
              <div className="flex items-center gap-1 text-yellow-400">
                {[...Array(testimonials[0].rating)].map((_, i) => (
                  <Star key={i} size={20} fill="currentColor" />
                ))}
              </div>
              
              <div className="relative">
                <Quote className="absolute -top-4 -left-8 text-blue-100 w-16 h-16 -z-10" />
                <h3 className="text-3xl font-bold text-gray-900 mb-4 italic">Feedback</h3>
                <p className="text-xl text-gray-600 leading-relaxed font-medium">
                  "{testimonials[0].text}"
                </p>
              </div>

              <div className="pt-4">
                <p className="text-xl font-bold text-gray-900">{testimonials[0].name}</p>
                <p className="text-gray-400 font-medium">{testimonials[0].role}</p>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-center mt-12 gap-4">
            <button className="w-14 h-14 rounded-full border-2 border-gray-100 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-lg active:scale-95">
              <ChevronLeft size={24} />
            </button>
            <button className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all active:scale-95">
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
