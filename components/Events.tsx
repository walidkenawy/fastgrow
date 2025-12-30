
import React, { useState, useMemo } from 'react';
import { generateEventVisual, getDeepIntelligence } from '../services/geminiService';
import { EquineEvent } from '../types';
import IntelligenceDrawer from './IntelligenceDrawer';

interface EventsProps {
  events: EquineEvent[];
}

const Events: React.FC<EventsProps> = ({ events }) => {
  const [activeRegion, setActiveRegion] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<EquineEvent | null>(null);
  const [isGenerating, setIsGenerating] = useState<Record<string, boolean>>({});
  const [eventImages, setEventImages] = useState<Record<string, string>>({});
  const [isSynthesizingAll, setIsSynthesizingAll] = useState(false);
  const [sharedId, setSharedId] = useState<string | null>(null);

  // Intelligence State
  const [isIntelligenceOpen, setIsIntelligenceOpen] = useState(false);
  const [isSyncingIntelligence, setIsSyncingIntelligence] = useState(false);
  const [intelligenceData, setIntelligenceData] = useState<any>(null);

  const regions = ['All', 'Europe', 'Middle East', 'Americas', 'Asia'];

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesRegion = activeRegion === 'All' || event.region === activeRegion;
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           event.location.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch && matchesRegion;
    });
  }, [activeRegion, searchTerm, events]);

  const handleSynthesizeVision = async (event: EquineEvent) => {
    if (isGenerating[event.id]) return;
    
    setIsGenerating(prev => ({ ...prev, [event.id]: true }));
    try {
      const result = await generateEventVisual(event.title, event.location, event.category);
      setEventImages(prev => ({ ...prev, [event.id]: result }));
    } catch (err) {
      console.error("Synthesis error:", err);
    } finally {
      setIsGenerating(prev => ({ ...prev, [event.id]: false }));
    }
  };

  const handleSynthesizeAll = async () => {
    if (isSynthesizingAll) return;
    setIsSynthesizingAll(true);
    const targets = filteredEvents.slice(0, 12);
    for (const event of targets) {
      if (!eventImages[event.id]) {
        await handleSynthesizeVision(event);
      }
    }
    setIsSynthesizingAll(false);
  };

  const handleDownloadImage = (e: React.MouseEvent, event: EquineEvent) => {
    e.stopPropagation();
    const imageUrl = eventImages[event.id] || event.image;
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `Nobel_Spirit_Event_${event.title.replace(/\s+/g, '_')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShareInformation = async (e: React.MouseEvent, event: EquineEvent) => {
    e.stopPropagation();
    const shareData = {
      title: `Nobel Spirit Event: ${event.title}`,
      text: `Join us for the ${event.title} in ${event.location}. Curated by Nobel Spirit Elite Protocols.`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share cancelled or failed');
      }
    } else {
      navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
      setSharedId(event.id);
      setTimeout(() => setSharedId(null), 2000);
    }
  };

  const handleExpandStrategicIntelligence = async (event: EquineEvent) => {
    setSelectedEvent(event);
    setIsIntelligenceOpen(true);
    setIsSyncingIntelligence(true);
    try {
      const data = await getDeepIntelligence(event.title, event.description, event.category);
      setIntelligenceData(data);
    } catch (err) {
      alert("Intelligence sync failed. Please check your uplink.");
      setIsIntelligenceOpen(false);
    } finally {
      setIsSyncingIntelligence(false);
    }
  };

  const handleRegister = (e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    window.open(url, '_blank');
  };

  const handleContact = (e: React.MouseEvent, email: string) => {
    e.stopPropagation();
    window.location.href = `mailto:${email}?subject=Event Registration Inquiry`;
  };

  return (
    <div className="bg-stone-50 min-h-screen font-sans selection:bg-[#D4AF37] selection:text-emerald-950">
      <div className="relative h-[85vh] bg-emerald-950 flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1551884831-bbf3cdc6469e?auto=format&fit=crop&q=80&w=2400" alt="Elite Equine Event" className="w-full h-full object-cover opacity-40 saturate-0 scale-105" />
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/0 via-emerald-950/60 to-stone-50" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8">
            <span className="w-2 h-2 bg-[#D4AF37] rounded-full animate-pulse"></span>
            <span className="text-white text-[10px] font-black tracking-[0.4em] uppercase">Global Tournament Archive 2026</span>
          </div>
          <h1 className="text-8xl md:text-[12rem] font-bold text-white mb-10 tracking-tighter leading-[0.8]">
            GLOBAL <br />
            <span className="italic font-serif text-[#D4AF37]">PAVILION</span>
          </h1>
          <p className="max-w-2xl text-stone-300 text-xl font-serif italic leading-relaxed">
            The world's most prestigious equine events, curated with laboratory precision for the international elite.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-32 relative z-20 pb-40">
        <div className="bg-white/95 backdrop-blur-3xl rounded-[4rem] p-10 shadow-[0_40px_120px_-20px_rgba(0,0,0,0.15)] mb-24 border border-stone-100">
          <div className="flex flex-col xl:flex-row justify-between items-center gap-12">
            <div className="flex flex-wrap justify-center gap-3">
              {regions.map(region => (
                <button 
                  key={region} 
                  onClick={() => setActiveRegion(region)} 
                  className={`px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeRegion === region ? 'bg-emerald-950 text-[#D4AF37]' : 'bg-stone-50 text-stone-400 hover:text-emerald-950'}`}
                >
                  {region}
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-4 w-full xl:w-auto">
              <input 
                type="text" 
                placeholder="Search event registry..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="flex-grow xl:w-[350px] bg-stone-100/50 rounded-[2rem] px-10 py-6 text-sm font-bold outline-none border border-transparent focus:border-emerald-900/10 focus:bg-white transition-all" 
              />
              <button 
                onClick={handleSynthesizeAll}
                disabled={isSynthesizingAll}
                className={`hidden md:flex items-center gap-3 px-8 py-6 rounded-[2rem] font-black text-[10px] uppercase tracking-widest shadow-xl transition-all ${isSynthesizingAll ? 'bg-stone-100 text-stone-400' : 'bg-[#D4AF37] text-emerald-950 hover:brightness-105 active:scale-95'}`}
              >
                {isSynthesizingAll ? (
                  <>
                    <div className="w-3 h-3 border-2 border-emerald-950 border-t-transparent rounded-full animate-spin"></div>
                    Synthesizing Pavilion...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a2 2 0 00-1.96 1.414l-.722 2.166a2 2 0 00.547 2.155l1.638 1.638a2 2 0 002.155.547l2.166-.722a2 2 0 001.414-1.96l-.477-2.387a2 2 0 00-.547-1.022z" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Synthesize All Visions
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
          {filteredEvents.map(event => (
            <div key={event.id} className="group bg-white rounded-[4rem] overflow-hidden border border-stone-100 shadow-sm hover:shadow-2xl transition-all flex flex-col h-full">
              <div className="relative h-[450px] overflow-hidden bg-stone-100">
                {isGenerating[event.id] && (
                  <div className="absolute inset-0 z-40 bg-emerald-950/80 backdrop-blur-xl flex flex-col items-center justify-center p-12 text-center animate-in fade-in duration-500">
                    <div className="relative mb-6">
                      <div className="w-16 h-16 border-4 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin"></div>
                    </div>
                    <p className="text-[12px] font-black text-white uppercase tracking-[0.5em] animate-pulse">Synthesizing Asset</p>
                  </div>
                )}
                
                <img 
                  src={eventImages[event.id] || event.image} 
                  alt={event.title} 
                  className={`w-full h-full object-cover transition-all duration-[2000ms] ${isGenerating[event.id] ? 'scale-110 blur-xl opacity-30' : 'group-hover:scale-110 opacity-100'}`} 
                />
                
                <div className="absolute top-8 left-8 flex gap-2">
                  <span className="bg-emerald-950 text-[#D4AF37] px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl border border-emerald-900">
                    {event.region}
                  </span>
                </div>

                <div className="absolute top-8 right-8 flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
                  <button 
                    onClick={(e) => handleDownloadImage(e, event)}
                    className="bg-white/95 backdrop-blur p-4 rounded-2xl text-emerald-950 shadow-2xl hover:scale-110 active:scale-95 transition-all border border-stone-100"
                    title="Download Vision Asset"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  </button>
                  <button 
                    onClick={(e) => handleShareInformation(e, event)}
                    className={`p-4 rounded-2xl shadow-2xl hover:scale-110 active:scale-95 transition-all border border-stone-100 ${sharedId === event.id ? 'bg-emerald-500 text-white' : 'bg-white/95 backdrop-blur text-emerald-950'}`}
                    title="Share Information"
                  >
                    {sharedId === event.id ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                    )}
                  </button>
                </div>

                {!eventImages[event.id] && !isGenerating[event.id] && (
                  <button 
                    onClick={() => handleSynthesizeVision(event)}
                    className="absolute inset-0 flex items-center justify-center bg-emerald-950/40 opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-[2px]"
                  >
                    <span className="bg-white text-emerald-950 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] shadow-2xl hover:scale-105 transition-all">
                      Synthesize Vision
                    </span>
                  </button>
                )}

                <div className="absolute bottom-8 left-8 right-8">
                  <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-white shadow-xl">
                    <p className="text-[10px] font-black text-emerald-950 uppercase tracking-widest mb-1">{event.date}</p>
                    <p className="text-sm font-bold text-stone-800">{event.location}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-12 flex-grow flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                   <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100">
                     {event.category}
                   </span>
                </div>
                
                <h3 className="text-4xl font-bold mb-6 tracking-tighter leading-[0.9]">{event.title}</h3>
                <p className="text-stone-500 italic font-serif mb-12 line-clamp-2">"{event.description}"</p>
                
                <div className="mt-auto space-y-4">
                  <button 
                    onClick={(e) => handleRegister(e, event.registrationUrl || '#')}
                    className="w-full bg-[#D4AF37] text-emerald-950 py-5 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.4em] hover:brightness-110 transition-all flex items-center justify-center gap-4 shadow-xl active:scale-[0.98]"
                  >
                    Secure Registration
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>

                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={(e) => handleContact(e, event.contactEmail || 'horse@secretancientlab.com')}
                      className="bg-emerald-950 text-white py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-emerald-900 transition-all flex items-center justify-center gap-2 shadow-lg"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      Contact
                    </button>
                    <button 
                      onClick={() => handleExpandStrategicIntelligence(event)}
                      className="border border-stone-200 text-stone-400 py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-stone-50 hover:text-emerald-950 transition-all flex items-center justify-center gap-2"
                    >
                      Strategic Report
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <IntelligenceDrawer 
        isOpen={isIntelligenceOpen}
        onClose={() => setIsIntelligenceOpen(false)}
        title={selectedEvent?.title || ''}
        category={selectedEvent?.category || ''}
        data={intelligenceData}
        isLoading={isSyncingIntelligence}
      />
    </div>
  );
};

export default Events;
