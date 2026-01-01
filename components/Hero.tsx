
import React, { useState } from 'react';
import { generateEventVisual } from '../services/geminiService';

interface HeroProps {
  onStart: () => void;
  onUpdateImage?: (id: string, newImage: string) => void;
  currentImage?: string;
}

const Hero: React.FC<HeroProps> = ({ onStart, onUpdateImage, currentImage }) => {
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const heroImage = currentImage || "https://images.unsplash.com/photo-1598974357851-984447633303?auto=format&fit=crop&q=80&w=2000";

  const handleSynthesizeVision = async () => {
    if (!onUpdateImage) return;
    setIsSynthesizing(true);
    try {
      const result = await generateEventVisual(
        "Nobel Spirit Global Headquarters", 
        "Warsaw Research Facility", 
        "Architectural Excellence"
      );
      if (result) onUpdateImage('hero_bg', result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSynthesizing(false);
    }
  };

  return (
    <div className="relative bg-emerald-950 h-[90vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        {isSynthesizing && (
          <div className="absolute inset-0 z-50 bg-emerald-950/80 backdrop-blur-xl flex flex-col items-center justify-center text-white">
            <div className="w-16 h-16 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mb-8"></div>
            <p className="text-xs font-black uppercase tracking-[0.5em] animate-pulse">Synthesizing Headquarters Protocol</p>
          </div>
        )}
        <img 
          src={heroImage} 
          alt="Nobel Spirit Elite Vision" 
          className={`w-full h-full object-cover opacity-40 scale-105 contrast-125 saturate-[0.8] transition-all duration-[2000ms] ${isSynthesizing ? 'blur-2xl scale-125' : ''}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/40 to-transparent" />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 mb-8">
            <span className="w-2 h-2 bg-[#D4AF37] rounded-full animate-pulse"></span>
            <span className="text-white text-[10px] font-black tracking-[0.3em] uppercase">Est. 1984 | Performance Bio-Technology</span>
          </div>
          
          <h1 className="text-7xl md:text-9xl font-bold text-white mb-8 leading-[0.85] tracking-tighter">
            ELITE <br />
            <span className="italic font-serif" style={{color: '#D4AF37'}}>SPIRIT</span>
          </h1>
          
          <p className="text-xl text-stone-300 mb-12 leading-relaxed max-w-xl font-light">
            Engineering the future of equine performance through molecular precision. Nobel Spirit®: The golden standard for the international elite.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6">
            <button 
              onClick={onStart}
              className="px-12 py-5 bg-[#D4AF37] text-emerald-950 rounded-full font-black text-xs uppercase tracking-[0.2em] hover:brightness-110 transition-all shadow-2xl hover:-translate-y-1"
            >
              Analyze Biometrics
            </button>
            <button 
              onClick={handleSynthesizeVision}
              disabled={isSynthesizing}
              className="px-12 py-5 bg-white/10 text-white rounded-full font-black text-xs uppercase tracking-[0.2em] backdrop-blur-md hover:bg-white/20 transition-all border border-white/20 flex items-center gap-3"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a2 2 0 00-1.96 1.414l-.722 2.166a2 2 0 00.547 2.155l1.638 1.638a2 2 0 002.155.547l2.166-.722a2 2 0 001.414-1.96l-.477-2.387a2 2 0 00-.547-1.022z" /></svg>
              Synthesize Brand vision
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
