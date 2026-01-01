
import React, { useState, useMemo, useEffect } from 'react';
import { generateEventVisual, getDeepIntelligence } from '../services/geminiService';
import { EquineEvent } from '../types';
import IntelligenceDrawer from './IntelligenceDrawer';

interface EventsProps {
  events: EquineEvent[];
  onUpdateImage: (id: string, newImage: string) => void;
}

const Events: React.FC<EventsProps> = ({ events, onUpdateImage }) => {
  const [activeRegion, setActiveRegion] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleCount, setVisibleCount] = useState(12);
  const [isGenerating, setIsGenerating] = useState<Record<string, boolean>>({});
  
  const [isIntelligenceOpen, setIsIntelligenceOpen] = useState(false);
  const [isSyncingIntelligence, setIsSyncingIntelligence] = useState(false);
  const [intelligenceData, setIntelligenceData] = useState<any>(null);
  const [selectedEvent, setSelectedEvent] = useState<EquineEvent | null>(null);

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesRegion = activeRegion === 'All' || event.region === activeRegion;
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch && matchesRegion;
    });
  }, [activeRegion, searchTerm, events]);

  const displayedEvents = filteredEvents.slice(0, visibleCount);

  /**
   * UNIVERSAL BRAND MANIFESTATION ENGINE
   * Automatically replaces generic event photos with branded AI renders.
   * Uses current image as base if it's already a synthesized asset.
   */
  useEffect(() => {
    const autoSynthesize = async () => {
      const targets = displayedEvents.filter(e => !e.image.startsWith('data:image')).slice(0, 4);
      
      for (const event of targets) {
        if (isGenerating[event.id]) continue;
        
        setIsGenerating(prev => ({ ...prev, [event.id]: true }));
        try {
          const result = await generateEventVisual(event.title, event.location, event.category);
          if (result) onUpdateImage(event.id, result);
        } catch (err) {
          console.error(`Auto-synthesis failed for event ${event.id}`);
        } finally {
          setIsGenerating(prev => ({ ...prev, [event.id]: false }));
        }
      }
    };
    
    const t = setTimeout(autoSynthesize, 1200);
    return () => clearTimeout(t);
  }, [displayedEvents, onUpdateImage]);

  const handleExpandIntelligence = async (event: EquineEvent) => {
    setSelectedEvent(event);
    setIsIntelligenceOpen(true);
    setIsSyncingIntelligence(true);
    try {
      const data = await getDeepIntelligence(event.title, event.description, event.category);
      setIntelligenceData(data);
    } catch (err) {
      setIsIntelligenceOpen(false);
    } finally {
      setIsSyncingIntelligence(false);
    }
  };

  return (
    <div className="bg-stone-50 min-h-screen">
      <div className="relative h-[60vh] bg-emerald-950 flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1551884831-bbf3cdc6469e?auto=format&fit=crop&q=80&w=2400" className="w-full h-full object-cover opacity-20 grayscale" />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-50 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <h1 className="text-8xl font-black text-white tracking-tighter leading-none mb-4">GLOBAL <span className="text-[#D4AF37] italic font-serif">PAVILION</span></h1>
          <p className="text-xl text-stone-300 font-serif italic max-w-2xl">Logistics and performance protocols for the international circuit.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-20 relative z-20 pb-40">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {displayedEvents.map(event => (
            <div key={event.id} className="bg-white rounded-[3rem] overflow-hidden border border-stone-100 shadow-xl group flex flex-col">
              <div className="relative aspect-[16/9] bg-stone-50 overflow-hidden">
                {isGenerating[event.id] && (
                  <div className="absolute inset-0 z-40 bg-emerald-950/90 backdrop-blur-xl flex flex-col items-center justify-center p-12 text-center">
                    <div className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-[10px] font-black text-white uppercase tracking-widest animate-pulse">Rendering Pavilion</p>
                  </div>
                )}
                <img src={event.image} className={`w-full h-full object-cover transition-all duration-1000 ${isGenerating[event.id] ? 'blur-xl' : 'group-hover:scale-105'}`} />
              </div>
              <div className="p-12 flex-grow flex flex-col">
                <div className="flex gap-4 mb-6">
                  <span className="bg-stone-50 text-stone-900 px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border border-stone-100">{event.region}</span>
                </div>
                <h3 className="text-3xl font-bold text-stone-900 mb-4 tracking-tight leading-none">{event.title}</h3>
                <p className="text-stone-500 font-bold text-[10px] uppercase tracking-widest mb-10">{event.location} • {event.date}</p>
                <div className="mt-auto pt-10 border-t border-stone-50">
                  <button onClick={() => handleExpandIntelligence(event)} className="w-full bg-emerald-950 text-[#D4AF37] py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all">
                    Access Strategic Dossier
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <IntelligenceDrawer isOpen={isIntelligenceOpen} onClose={() => setIsIntelligenceOpen(false)} title={selectedEvent?.title || ''} category={selectedEvent?.category || ''} data={intelligenceData} isLoading={isSyncingIntelligence} />
    </div>
  );
};

export default Events;
