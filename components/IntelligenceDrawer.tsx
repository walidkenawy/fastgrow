
import React, { useState } from 'react';
import { EquineEvent } from '../types';

interface IntelligenceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  category: string;
  eventDate?: string;
  eventLocation?: string;
  eventDescription?: string;
  eventPartner?: string;
  eventBookingInfo?: string;
  eventImage?: string;
  eventCost?: string;
  eventEmail?: string;
  eventPhone?: string;
  eventWebsite?: string;
  eventLinkedin?: string;
  data: {
    abstract: string;
    analysis: string;
    implications: string[];
    registrationRoadmap?: string;
    seo: {
      metaDescription: string;
      keywords: string[];
      h1Header: string;
    }
  } | null;
  isLoading: boolean;
}

const IntelligenceDrawer: React.FC<IntelligenceDrawerProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  category, 
  eventDate, 
  eventLocation, 
  eventDescription,
  eventPartner,
  eventBookingInfo,
  eventImage,
  eventCost,
  eventEmail = 'logistics@nobelspiritlabs.store',
  eventPhone = '+48 739 256 482',
  eventWebsite,
  eventLinkedin,
  data, 
  isLoading 
}) => {
  const [showSyncOptions, setShowSyncOptions] = useState(false);

  if (!isOpen) return null;

  const downloadICS = () => {
    const start = (eventDate || new Date().toISOString().split('T')[0]).replace(/-/g, "");
    const content = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Nobel Spirit Performance Labs//NONSGML v1.0//EN",
      "BEGIN:VEVENT",
      `SUMMARY:${title}`,
      `DTSTART:${start}T090000Z`,
      `DTEND:${start}T170000Z`,
      `LOCATION:${eventLocation || 'International Hub'}`,
      `DESCRIPTION:${eventDescription || data?.abstract || 'Performance Protocol Session'}`,
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\n");

    const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
    const link = document.body.appendChild(document.createElement("a"));
    link.href = window.URL.createObjectURL(blob);
    link.download = `${title.replace(/\s+/g, "_")}.ics`;
    link.click();
    document.body.removeChild(link);
    setShowSyncOptions(false);
  };

  const openGoogleCalendar = () => {
    const start = (eventDate || new Date().toISOString().split('T')[0]).replace(/-/g, "");
    const gTitle = encodeURIComponent(title);
    const gDetails = encodeURIComponent(eventDescription || data?.abstract || 'Performance Protocol Session');
    const gLocation = encodeURIComponent(eventLocation || 'International Hub');
    const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${gTitle}&details=${gDetails}&location=${gLocation}&dates=${start}T090000Z/${start}T170000Z`;
    window.open(url, '_blank');
    setShowSyncOptions(false);
  };

  return (
    <div className="fixed inset-0 z-[300] flex justify-end">
      <div 
        className="absolute inset-0 bg-emerald-950/40 backdrop-blur-sm animate-in fade-in duration-500"
        onClick={onClose}
      ></div>

      <div className="relative w-full max-w-2xl bg-white h-full shadow-[-20px_0_100px_rgba(0,0,0,0.2)] flex flex-col animate-in slide-in-from-right duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] overflow-hidden">
        
        <div className="relative h-72 shrink-0 bg-emerald-950 flex flex-col justify-end p-10 overflow-hidden">
          {eventImage && (
            <img 
              src={eventImage} 
              className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-overlay scale-110" 
              alt="Pavilion Visualization"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/20 to-transparent" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <span className="bg-[#D4AF37] text-emerald-950 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">
                Strategic Dossier
              </span>
              <span className="text-white/60 text-[9px] font-bold uppercase tracking-widest">
                Discipline: {category}
              </span>
            </div>
            <h2 className="text-5xl font-black text-white tracking-tighter leading-tight">{title}</h2>
          </div>

          <button 
            onClick={onClose}
            className="absolute top-8 right-8 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 transition-all text-white flex items-center justify-center backdrop-blur-md border border-white/20"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-10 space-y-12 pb-32">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <div className="w-16 h-16 border-4 border-emerald-100 border-t-[#D4AF37] rounded-full animate-spin mb-8"></div>
              <p className="text-[10px] font-black text-emerald-950 uppercase tracking-[0.4em] animate-pulse">Syncing Event Intelligence...</p>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
              
              <div className="grid grid-cols-2 gap-4 mb-12">
                 <div className="p-6 bg-stone-50 rounded-[2rem] border border-stone-100">
                    <p className="text-[8px] font-black text-stone-400 uppercase tracking-widest mb-2">Venue Logistics</p>
                    <p className="text-[11px] font-bold text-stone-900">{eventLocation}</p>
                 </div>
                 <div className="p-6 bg-stone-50 rounded-[2rem] border border-stone-100">
                    <p className="text-[8px] font-black text-stone-400 uppercase tracking-widest mb-2">Access Cost</p>
                    <p className="text-[11px] font-bold text-emerald-950">{eventCost || 'Varies'}</p>
                 </div>
              </div>

              <div className="bg-emerald-950 text-[#D4AF37] rounded-[2.5rem] p-8 shadow-xl mb-12 relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] mb-6 flex items-center gap-4">
                    Contact Terminal
                    <div className="h-px flex-grow bg-white/10"></div>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                      <p className="text-[8px] font-bold opacity-60 uppercase tracking-widest mb-1">Inquiry Email</p>
                      <a href={`mailto:${eventEmail}`} className="text-xs font-bold hover:underline">{eventEmail}</a>
                    </div>
                    <div>
                      <p className="text-[8px] font-bold opacity-60 uppercase tracking-widest mb-1">Direct Line</p>
                      <a href={`tel:${eventPhone}`} className="text-xs font-bold hover:underline">{eventPhone}</a>
                    </div>
                  </div>
                  
                  {eventLinkedin && (
                    <div className="border-t border-white/10 pt-6">
                      <p className="text-[8px] font-bold opacity-60 uppercase tracking-widest mb-3">Professional Dossier (LinkedIn)</p>
                      <a 
                        href={eventLinkedin} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 bg-white/10 hover:bg-white/20 transition-all p-4 rounded-xl group"
                      >
                         <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                         <span className="text-[10px] font-black uppercase tracking-widest">Connect with Event Management</span>
                         <svg className="w-4 h-4 ml-auto text-white/40 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 8l4 4m0 0l-4 4m4-4H3" strokeWidth="2.5"/></svg>
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {data && (
                <>
                  <section className="mb-12">
                    <h3 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.4em] mb-6 border-b border-stone-100 pb-4">Executive Abstract</h3>
                    <p className="text-xl text-stone-600 leading-relaxed italic font-serif">
                      "{data.abstract}"
                    </p>
                  </section>

                  <section className="mb-12">
                    <h3 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.4em] mb-6 border-b border-stone-100 pb-4">Performance Implications</h3>
                    <div className="space-y-4">
                      {data.implications.map((imp, i) => (
                        <div key={i} className="flex gap-4 p-5 bg-stone-50 rounded-2xl border border-stone-100 items-start">
                          <div className="w-5 h-5 rounded-full bg-[#D4AF37] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-lg">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeWidth="4"/></svg>
                          </div>
                          <p className="text-[10px] font-black text-stone-800 uppercase tracking-wider leading-relaxed">{imp}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                </>
              )}

              {eventBookingInfo && (
                <section>
                  <h3 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.4em] mb-6 border-b border-stone-100 pb-4">Logistics & Booking</h3>
                  <div className="p-8 bg-stone-50 rounded-[2.5rem] border border-stone-100 italic font-serif text-sm text-stone-600 leading-relaxed">
                    {eventBookingInfo}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-8 bg-white/95 backdrop-blur-xl border-t border-stone-100 flex gap-4">
          <div className="flex-grow relative">
            <button 
              onClick={() => setShowSyncOptions(!showSyncOptions)}
              className="w-full bg-[#D4AF37] text-emerald-950 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] shadow-xl hover:brightness-110 transition-all flex items-center justify-center gap-3"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              {showSyncOptions ? 'Select Platform' : 'Sync to Calendar'}
            </button>

            {showSyncOptions && (
              <div className="absolute bottom-full left-0 right-0 mb-4 bg-white/95 backdrop-blur-2xl border border-stone-200 rounded-[2rem] p-4 shadow-2xl flex flex-col gap-2 animate-in slide-in-from-bottom-4">
                <button onClick={downloadICS} className="w-full text-left p-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-emerald-950 hover:bg-stone-50 flex items-center gap-4 transition-all">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div> Universal (.ics)
                </button>
                <button onClick={openGoogleCalendar} className="w-full text-left p-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-emerald-950 hover:bg-stone-50 flex items-center gap-4 transition-all">
                  <div className="w-2 h-2 rounded-full bg-[#4285F4]"></div> Google Calendar
                </button>
              </div>
            )}
          </div>
          {eventWebsite && (
            <a 
              href={eventWebsite} 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-12 bg-emerald-950 text-white flex items-center justify-center rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-emerald-900 transition-all"
            >
              Book Ticket
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default IntelligenceDrawer;
