import React from 'react';

const users = [
  { id: 1, img: "https://picsum.photos/100/100?random=301", size: "w-20 h-20", pos: "top-[10%] left-[15%]" },
  { id: 2, img: "https://picsum.photos/100/100?random=302", size: "w-16 h-16", pos: "top-[25%] left-[5%]" },
  { id: 3, img: "https://picsum.photos/100/100?random=303", size: "w-24 h-24", pos: "top-[45%] left-[12%]" },
  { id: 4, img: "https://picsum.photos/100/100?random=304", size: "w-14 h-14", pos: "bottom-[15%] left-[8%]" },
  { id: 5, img: "https://picsum.photos/100/100?random=305", size: "w-20 h-20", pos: "top-[12%] right-[18%]" },
  { id: 6, img: "https://picsum.photos/100/100?random=306", size: "w-16 h-16", pos: "top-[28%] right-[6%]" },
  { id: 7, img: "https://picsum.photos/100/100?random=307", size: "w-24 h-24", pos: "top-[48%] right-[14%]" },
  { id: 8, img: "https://picsum.photos/100/100?random=308", size: "w-14 h-14", pos: "bottom-[18%] right-[10%]" },
  { id: 9, img: "https://picsum.photos/100/100?random=309", size: "w-12 h-12", pos: "bottom-[10%] left-[30%]" },
  { id: 10, img: "https://picsum.photos/100/100?random=310", size: "w-12 h-12", pos: "bottom-[12%] right-[32%]" },
];

export const Community: React.FC = () => {
  return (
    <div className="py-32 bg-[#FAFBFF] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-100/30 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 text-center">
        <div className="relative min-h-[600px] flex flex-col items-center justify-center">
          {/* Avatar Cloud */}
          {users.map((user) => (
            <div 
              key={user.id} 
              className={`absolute ${user.pos} ${user.size} rounded-full border-4 border-white shadow-xl overflow-hidden animate-float-slow hover:scale-110 transition-transform duration-500 cursor-pointer hidden md:block`}
              style={{ animationDelay: `${user.id * 0.5}s` }}
            >
              <img src={user.img} alt="Community Member" className="w-full h-full object-cover" />
            </div>
          ))}

          {/* Central Content Card */}
          <div className="z-10 space-y-8 max-w-2xl px-4">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
                Join with our community
              </h2>
              <p className="text-xl text-gray-500 font-medium">
                Join our traveler community to explore, connect, and share your best moments.
              </p>
            </div>

            {/* Central Card with Image (from template) */}
            <div className="relative group max-w-md mx-auto">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-[3rem] blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
              <div className="relative rounded-[2.5rem] overflow-hidden border-8 border-white shadow-2xl aspect-[4/3]">
                <img src="https://picsum.photos/800/600?random=350" alt="Kinshasa Landmark" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                <div className="absolute bottom-6 left-6 right-6 p-4 glass rounded-2xl flex items-center justify-between text-left">
                  <div>
                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">Community Pick</p>
                    <p className="font-bold text-gray-900 text-sm">Santorini, Greece</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-gray-900">⭐ 5.0</span>
                  </div>
                </div>
              </div>
            </div>

            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-12 rounded-2xl shadow-xl shadow-blue-500/30 transition-all hover:scale-105 active:scale-95">
              Join Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
