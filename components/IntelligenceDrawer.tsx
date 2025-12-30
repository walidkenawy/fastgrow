
import React from 'react';

interface IntelligenceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  category: string;
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

const IntelligenceDrawer: React.FC<IntelligenceDrawerProps> = ({ isOpen, onClose, title, category, data, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-emerald-950/40 backdrop-blur-sm animate-in fade-in duration-500"
        onClick={onClose}
      ></div>

      {/* Drawer */}
      <div className="relative w-full max-w-2xl bg-white h-full shadow-[-20px_0_100px_rgba(0,0,0,0.2)] flex flex-col animate-in slide-in-from-right duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] overflow-hidden">
        
        {/* Header */}
        <div className="p-10 border-b border-stone-100 bg-stone-50/50 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="bg-emerald-950 text-[#D4AF37] px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">
                Protocol Intelligence
              </span>
              <span className="text-stone-300 text-[9px] font-bold uppercase tracking-widest">
                Category: {category}
              </span>
            </div>
            <h2 className="text-3xl font-bold text-stone-900 tracking-tighter leading-tight">{title}</h2>
          </div>
          <button 
            onClick={onClose}
            className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-stone-200 transition-all text-stone-400"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto p-10 space-y-12 pb-32">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <div className="w-16 h-16 border-4 border-emerald-100 border-t-[#D4AF37] rounded-full animate-spin mb-8"></div>
              <p className="text-[10px] font-black text-emerald-950 uppercase tracking-[0.4em] animate-pulse">Synchronizing Molecular Data...</p>
              <p className="text-[9px] text-stone-400 mt-4 uppercase tracking-widest">Optimizing SEO Payload</p>
            </div>
          ) : data ? (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
              {/* SEO Block */}
              <div className="bg-emerald-50 rounded-[2.5rem] p-8 border border-emerald-100 mb-12">
                <h3 className="text-[10px] font-black text-emerald-900 uppercase tracking-[0.4em] mb-6 flex items-center gap-4">
                  Metadata Suite
                  <div className="h-px flex-grow bg-emerald-200"></div>
                </h3>
                <div className="space-y-6">
                  <div>
                    <p className="text-[9px] font-bold text-emerald-800/60 uppercase tracking-widest mb-1">Optimized H1 Header</p>
                    <p className="text-sm font-bold text-emerald-950">{data.seo.h1Header}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-emerald-800/60 uppercase tracking-widest mb-1">Meta Description</p>
                    <p className="text-xs text-stone-600 leading-relaxed italic">{data.seo.metaDescription}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {data.seo.keywords.map((kw, i) => (
                      <span key={i} className="text-[8px] bg-white border border-emerald-200 text-emerald-900 px-3 py-1 rounded-full font-black uppercase tracking-widest">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Intelligence Section */}
              <section className="mb-12">
                <h3 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.4em] mb-6 border-b border-stone-100 pb-4">Executive Abstract</h3>
                <p className="text-xl text-stone-600 leading-relaxed italic font-serif">
                  "{data.abstract}"
                </p>
              </section>

              <section className="mb-12">
                <h3 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.4em] mb-6 border-b border-stone-100 pb-4">Deep Technical Analysis</h3>
                <p className="text-stone-700 leading-relaxed whitespace-pre-line font-medium text-sm">
                  {data.analysis}
                </p>
              </section>

              {data.registrationRoadmap && (
                <section className="mb-12">
                  <h3 className="text-[10px] font-black text-emerald-900 uppercase tracking-[0.4em] mb-6 border-b border-emerald-100 pb-4">Registration Roadmap</h3>
                  <p className="text-emerald-950 font-bold leading-relaxed text-sm bg-emerald-50 p-6 rounded-2xl border border-emerald-100 italic font-serif">
                    {data.registrationRoadmap}
                  </p>
                </section>
              )}

              <section>
                <h3 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.4em] mb-6 border-b border-stone-100 pb-4">Performance Implications</h3>
                <div className="space-y-4">
                  {data.implications.map((imp, i) => (
                    <div key={i} className="flex gap-4 p-5 bg-stone-50 rounded-2xl border border-stone-100 items-start">
                      <div className="w-5 h-5 rounded-full bg-[#D4AF37] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-lg">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                      <p className="text-xs font-bold text-stone-800 leading-relaxed uppercase tracking-wider">{imp}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          ) : null}
        </div>

        {/* Footer Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-8 bg-white/90 backdrop-blur-xl border-t border-stone-100 flex gap-4">
          <button className="flex-grow bg-emerald-950 text-[#D4AF37] py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] shadow-xl hover:bg-emerald-900 active:scale-95 transition-all">
            Download Technical Dossier
          </button>
          <button className="px-8 py-5 border border-stone-200 text-stone-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-stone-50 transition-all">
            Share Link
          </button>
        </div>
      </div>
    </div>
  );
};

export default IntelligenceDrawer;
