
import React, { useState, useMemo, useEffect } from 'react';
import { generateEventVisual, getDeepIntelligence } from '../services/geminiService';
import { EquineEvent } from '../types';
import { downloadCSV } from '../services/csvService';
import IntelligenceDrawer from './IntelligenceDrawer';

interface EventsProps {
  events: EquineEvent[];
  onUpdateImage: (id: string, newImage: string) => void;
}

const Events: React.FC<EventsProps> = ({ events, onUpdateImage }) => {
  const [activeRegion, setActiveRegion] = useState<string>('Middle East');
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
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.discipline?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch && matchesRegion;
    });
  }, [activeRegion, searchTerm, events]);

  const displayedEvents = filteredEvents.slice(0, visibleCount);

  const exportSchedule = () => {
    downloadCSV(events, `NobelSpirit_Global_Events_${activeRegion.replace(/\s+/g, '_')}_2026`);
  };

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
          console.error(`Synthesis failed for ${event.title}`);
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
      <div className="relative h-[65vh] bg-emerald-950 flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1551884831-bbf3cdc6469e?auto=format&fit=crop&q=80&w=2400" className="w-full h-full object-cover opacity-30 grayscale saturate-0" />
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/40 via-emerald-950 to-stone-50" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full flex flex-col items-center text-center">
          <h2 className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.6em] mb-4">Arab World & Global Circuit Archive</h2>
          <h1 className="text-8xl md:text-9xl font-black text-white tracking-tighter leading-none mb-6">GLOBAL <span className="text-[#D4AF37] italic font-serif">PAVILION</span></h1>
          <p className="text-xl text-stone-300 font-serif italic max-w-3xl mx-auto mb-10 leading-relaxed">
            Synthesizing performance logistics and deep AI intelligence for the 2026 international equestrian schedule.
          </p>
          <div className="flex gap-4">
            <button onClick={exportSchedule} className="px-10 py-5 bg-[#D4AF37] text-emerald-950 rounded-full font-black text-[10px] uppercase tracking-widest shadow-2xl hover:brightness-110 transition-all flex items-center gap-3">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" strokeWidth="2.5"/></svg>
               Download Regional Dossier (CSV)
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-24 relative z-20 pb-40">
        <div className="flex flex-wrap gap-4 mb-16 justify-center bg-white/80 backdrop-blur-xl p-6 rounded-[3rem] shadow-xl border border-stone-100">
           {['All', 'Europe', 'Middle East', 'Americas', 'Asia'].map(r => (
             <button key={r} onClick={() => setActiveRegion(r)} className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeRegion === r ? 'bg-emerald-950 text-[#D4AF37]' : 'bg-stone-50 text-stone-400 border border-stone-100 hover:bg-white'}`}>{r}</button>
           ))}
           <div className="h-10 w-px bg-stone-200 mx-4 hidden lg:block"></div>
           <input 
             type="text" 
             placeholder="Filter Riyadh, Dubai, Doha, London..."
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             className="px-8 py-3 rounded-full bg-stone-50 border border-stone-100 text-[10px] font-bold outline-none focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all w-80"
           />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {displayedEvents.map(event => (
            <div key={event.id} className="bg-white rounded-[3.5rem] overflow-hidden border border-stone-100 shadow-sm hover:shadow-2xl transition-all duration-700 group flex flex-col h-full relative">
              <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
                {isGenerating[event.id] && (
                  <div className="absolute inset-0 z-40 bg-emerald-950/90 backdrop-blur-md flex flex-col items-center justify-center p-12 text-center">
                    <div className="w-10 h-10 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-[9px] font-black text-white uppercase tracking-widest animate-pulse">Rendering Protocol</p>
                  </div>
                )}
                <img src={event.image} className={`w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 ${isGenerating[event.id] ? 'blur-2xl' : ''}`} />
                <div className="absolute top-6 left-6 flex flex-col gap-2">
                  <span className="bg-emerald-950/80 backdrop-blur-md text-[#D4AF37] px-4 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest border border-white/10">
                    {event.discipline || event.category}
                  </span>
                  <span className="bg-white/80 backdrop-blur-md text-stone-900 px-4 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest border border-stone-200">
                    {event.cost}
                  </span>
                </div>
                
                {/* Social Floating Bar */}
                {event.linkedin && (
                  <div className="absolute top-6 right-6 flex gap-2">
                    <a href={event.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 hover:bg-[#0077B5] transition-all">
                       <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                    </a>
                  </div>
                )}
              </div>
              
              <div className="p-10 flex-grow flex flex-col">
                <div className="flex gap-4 mb-6 items-center">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-[10px] font-black text-emerald-900 uppercase tracking-widest">{event.region} Circuit</span>
                  <span className="h-px flex-grow bg-stone-100"></span>
                  <span className="text-[10px] font-bold text-stone-400">{event.date}</span>
                </div>
                
                <h3 className="text-3xl font-bold text-stone-900 mb-2 tracking-tight leading-tight group-hover:text-emerald-950 transition-colors">{event.title}</h3>
                <p className="text-xs text-stone-400 font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" strokeWidth="2.5"/></svg>
                  {event.location}
                </p>

                <div className="grid grid-cols-1 gap-3 mb-8">
                  <div className="flex items-center gap-3 text-stone-500 hover:text-emerald-950 transition-colors">
                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeWidth="2.5"/></svg>
                     <span className="text-[10px] font-black uppercase tracking-widest truncate">{event.contactEmail}</span>
                  </div>
                  <div className="flex items-center gap-3 text-stone-500 hover:text-emerald-950 transition-colors">
                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" strokeWidth="2.5"/></svg>
                     <span className="text-[10px] font-black uppercase tracking-widest">{event.contactPhone}</span>
                  </div>
                </div>

                <div className="mt-auto space-y-4">
                  <button onClick={() => handleExpandIntelligence(event)} className="w-full bg-emerald-950 text-[#D4AF37] py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-3 shadow-xl">
                    Expand Strategic Dossier
                  </button>
                  <div className="grid grid-cols-2 gap-4">
                    <a 
                      href={event.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full border border-stone-100 text-stone-500 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-stone-50 transition-all flex items-center justify-center gap-2"
                    >
                      Website
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" strokeWidth="2.5"/></svg>
                    </a>
                    <a 
                      href={event.registrationUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full bg-[#D4AF37] text-emerald-950 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-2"
                    >
                      Book Ticket
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {visibleCount < filteredEvents.length && (
          <div className="mt-24 text-center">
            <button onClick={() => setVisibleCount(v => v + 12)} className="px-12 py-6 bg-emerald-950 text-[#D4AF37] rounded-full font-black text-xs uppercase tracking-[0.4em] shadow-2xl hover:scale-105 transition-all">
              Load More Venues
            </button>
          </div>
        )}
      </div>
      <IntelligenceDrawer 
        isOpen={isIntelligenceOpen} 
        onClose={() => setIsIntelligenceOpen(false)} 
        title={selectedEvent?.title || ''} 
        category={selectedEvent?.category || ''} 
        eventDate={selectedEvent?.date}
        eventLocation={selectedEvent?.location}
        eventDescription={selectedEvent?.description}
        eventPartner={selectedEvent?.partner}
        eventBookingInfo={selectedEvent?.bookingInfo}
        eventImage={selectedEvent?.image}
        eventCost={selectedEvent?.cost}
        eventPhone={selectedEvent?.contactPhone}
        eventWebsite={selectedEvent?.website}
        eventLinkedin={selectedEvent?.linkedin}
        data={intelligenceData} 
        isLoading={isSyncingIntelligence} 
      />
    </div>
  );
};

export default Events;
