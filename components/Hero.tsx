
import React from 'react';

interface HeroProps {
  onStart: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStart }) => {
  return (
    <div className="relative bg-emerald-950 h-[90vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1598974357851-984447633303?auto=format&fit=crop&q=80&w=2000" 
          alt="Nobel Spirit Elite Stallion" 
          className="w-full h-full object-cover opacity-40 scale-105 contrast-125 saturate-[0.8]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/40 to-transparent" />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 mb-8">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-white text-[10px] font-black tracking-[0.3em] uppercase">Est. 1984 | Performance Bio-Science</span>
          </div>
          
          <h1 className="text-7xl md:text-9xl font-bold text-white mb-8 leading-[0.85] tracking-tighter">
            ELITE <br />
            <span className="text-emerald-500 italic font-serif" style={{color: '#D4AF37'}}>PROTOCOL</span>
          </h1>
          
          <p className="text-xl text-stone-300 mb-12 leading-relaxed max-w-xl font-light">
            Nobel Spirit® represents the world standard in equine performance technology. Our lab-verified formulations are engineered for one purpose: <span className="text-white font-bold">Uncompromising Victory.</span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6">
            <button 
              onClick={onStart}
              className="px-12 py-5 bg-emerald-500 text-emerald-950 rounded-full font-black text-xs uppercase tracking-[0.2em] hover:bg-emerald-400 transition-all shadow-2xl hover:-translate-y-1"
              style={{backgroundColor: '#D4AF37'}}
            >
              Analyze Biometrics
            </button>
            <button className="px-12 py-5 bg-white/10 text-white rounded-full font-black text-xs uppercase tracking-[0.2em] backdrop-blur-md hover:bg-white/20 transition-all border border-white/20">
              Lab Methodology
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
