
import React, { useState, useEffect, useMemo } from 'react';
import { searchExhibitors } from '../services/geminiService';
import { sendEmail } from '../services/emailService';
import { saveB2BContact } from '../services/dbService';
import { Exhibitor } from '../types';

const ExhibitorDiscovery: React.FC = () => {
  const [step, setStep] = useState(1);
  const [continent, setContinent] = useState('Europe');
  const [country, setCountry] = useState('');
  const [industry, setIndustry] = useState('All Sectors');
  const [eventFilter, setEventFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Exhibitor[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  
  const [outreachStatus, setOutreachStatus] = useState({ 
    active: false, 
    current: 0, 
    total: 0, 
    phase: '', 
    lastSent: '' 
  });

  const [message, setMessage] = useState('Dear [Exhibitor Name],\n\nWe observed your participation in [Event Affiliation]. Nobel Spirit® Performance Labs is currently expanding our technical network in [Country].\n\nWe provide laboratory-verified molecular nutrition protocols for elite equine performance. Would your organization be open to a technical synergy brief regarding our 2026 circuit support?\n\nBest regards,\nNobel Spirit Labs.');

  const continents = ['Europe', 'Middle East', 'Americas', 'Asia', 'Oceania'];
  const industries = ['All Sectors', 'Feed & Nutrition', 'Stable Equipment', 'Medical & Veterinary', 'Events & Logistics', 'Rider Apparel'];

  const handleSearch = async () => {
    if (!country) return;
    setLoading(true);
    try {
      const data = await searchExhibitors(continent, country, industry, eventFilter);
      setResults(data);
      setStep(2);
    } catch (err) {
      console.error(err);
      alert("Discovery Protocol Fault. Please check Laboratory uplink.");
    } finally {
      setLoading(false);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (next.size >= 50) {
          alert("Selection Cap: 50 exhibitors maximum for sequential outreach.");
          return prev;
        }
        next.add(id);
      }
      return next;
    });
  };

  const handleOutreach = async () => {
    const targets = results.filter(r => selectedIds.has(r.id));
    setOutreachStatus({ 
      active: true, 
      current: 0, 
      total: targets.length, 
      phase: 'Initializing Sequential Transmitter...', 
      lastSent: '' 
    });

    for (let i = 0; i < targets.length; i++) {
      const target = targets[i];
      setOutreachStatus(prev => ({ ...prev, current: i + 1, phase: `Synthesizing protocol for ${target.name}...` }));
      
      const personalized = message
        .replace(/\[Exhibitor Name\]/g, target.name)
        .replace(/\[Event Affiliation\]/g, target.eventAffiliation || 'the regional circuit')
        .replace(/\[Country\]/g, target.country) + 
        "\n\n---\nProfessional Intent: B2B Inquiry from Nobel Spirit® Labs. To decline future protocols, reply 'STOP'.";

      await sendEmail({
        from_name: "Nobel Spirit B2B Synergy",
        client_name: target.name,
        client_email: "b2b@nobelspirit.pl",
        subject: `Technical Synergy Inquiry: ${target.name} x Nobel Spirit`,
        message: personalized
      }, 'contact');

      await saveB2BContact({
        id: target.id,
        name: target.name,
        status: 'Sent',
        date: new Date().toISOString()
      });

      if (i < targets.length - 1) {
        setOutreachStatus(prev => ({ ...prev, phase: 'Sequential Safe-Delay (7s)...', lastSent: target.name }));
        await new Promise(r => setTimeout(r, 7000));
      }
    }

    setOutreachStatus(prev => ({ ...prev, active: false, phase: 'Transmission Complete' }));
    alert("Strategic outreach sequence completed successfully.");
    setStep(1);
    setSelectedIds(new Set());
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 animate-in fade-in duration-700">
      <div className="mb-12">
        <h2 className="text-xs font-black text-emerald-900 uppercase tracking-[0.4em] mb-4">Industrial Logistics Terminal</h2>
        <h1 className="text-6xl font-bold text-stone-900 tracking-tighter">Connect with Exhibitors</h1>
        <p className="text-stone-500 italic font-serif mt-4 text-lg">Source and engage with the world's premier equine exhibitors via Deep AI intelligence.</p>
      </div>

      {step === 1 && (
        <div className="bg-white p-12 rounded-[4rem] border border-stone-100 shadow-2xl max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div>
              <label className="block text-[10px] font-black text-emerald-900 uppercase mb-3 tracking-widest">Target Continent</label>
              <select 
                value={continent} 
                onChange={(e) => setContinent(e.target.value)}
                className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl font-bold outline-none appearance-none"
              >
                {continents.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black text-emerald-900 uppercase mb-3 tracking-widest">Country / Region</label>
              <input 
                type="text" 
                value={country} 
                onChange={(e) => setCountry(e.target.value)}
                placeholder="e.g. Saudi Arabia, Germany, USA"
                className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl font-bold outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-emerald-900 uppercase mb-3 tracking-widest">Industry Segment</label>
              <select 
                value={industry} 
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl font-bold outline-none appearance-none"
              >
                {industries.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black text-emerald-900 uppercase mb-3 tracking-widest">Event Affiliation (Optional)</label>
              <input 
                type="text" 
                value={eventFilter} 
                onChange={(e) => setEventFilter(e.target.value)}
                placeholder="e.g. Dubai World Cup, Equitana"
                className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl font-bold outline-none"
              />
            </div>
          </div>
          <button 
            onClick={handleSearch}
            disabled={loading || !country}
            className="w-full bg-emerald-950 text-[#D4AF37] py-6 rounded-2xl font-black text-xs uppercase tracking-[0.4em] hover:bg-emerald-900 transition-all shadow-xl disabled:opacity-50"
          >
            {loading ? 'Synthesizing Exhibitor Data...' : 'Commence Global Discovery'}
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-12">
          <div className="bg-emerald-950 p-8 rounded-[3rem] text-white flex justify-between items-center shadow-2xl">
            <div>
              <p className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest mb-1">Search Results</p>
              <h3 className="text-3xl font-bold tracking-tight">{results.length} Potential Partners Found</h3>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => setStep(3)} 
                disabled={selectedIds.size === 0}
                className="px-8 py-4 bg-[#D4AF37] text-emerald-950 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl disabled:opacity-50"
              >
                Configure Outreach ({selectedIds.size})
              </button>
              <button onClick={() => setStep(1)} className="px-8 py-4 bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest">Modify Search</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {results.map(exh => (
              <div 
                key={exh.id}
                onClick={() => toggleSelect(exh.id)}
                className={`p-10 rounded-[3.5rem] border-2 transition-all cursor-pointer relative group ${selectedIds.has(exh.id) ? 'bg-emerald-50 border-emerald-500 shadow-xl' : 'bg-white border-stone-100 hover:border-emerald-200'}`}
              >
                <div className="absolute top-8 right-8">
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${selectedIds.has(exh.id) ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-stone-200 text-transparent'}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeWidth="3.5"/></svg>
                  </div>
                </div>
                
                <h4 className="text-2xl font-bold text-emerald-950 mb-1 leading-tight">{exh.name}</h4>
                <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-6">{exh.industryType}</p>
                
                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3 text-stone-600">
                    <svg className="w-4 h-4 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" strokeWidth="2.5"/></svg>
                    <span className="text-[11px] font-bold">{exh.city}, {exh.country}</span>
                  </div>
                  <div className="flex items-center gap-3 text-stone-600">
                    <svg className="w-4 h-4 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" strokeWidth="2.5"/></svg>
                    <span className="text-[11px] font-bold">{exh.phone}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-stone-100">
                   <a href={exh.website} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="text-[10px] font-black text-emerald-900 uppercase tracking-widest hover:text-[#D4AF37] flex items-center gap-2">
                     Website
                     <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" strokeWidth="3"/></svg>
                   </a>
                   <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest">{exh.eventAffiliation ? 'Verified Participant' : 'Circuit Lead'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="max-w-3xl mx-auto pb-40">
           <div className="bg-white p-12 rounded-[4rem] border border-stone-100 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-950 via-[#D4AF37] to-emerald-950"></div>
             
             <h3 className="text-2xl font-bold text-emerald-950 mb-2">Configure Outreach Sequence</h3>
             <p className="text-stone-500 italic font-serif text-sm mb-10">Preparing technical synergy brief for {selectedIds.size} exhibitors.</p>

             <div className="space-y-8">
                <div>
                  <label className="block text-[10px] font-black text-stone-400 uppercase mb-4 tracking-widest">Synergy Template Protocol</label>
                  <textarea 
                    rows={10}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-8 py-6 bg-stone-50 border border-stone-100 rounded-[2.5rem] outline-none font-bold text-stone-800 italic"
                  />
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="text-[9px] font-black text-emerald-900 bg-emerald-50 px-3 py-1 rounded-lg uppercase">[Exhibitor Name]</span>
                    <span className="text-[9px] font-black text-emerald-900 bg-emerald-50 px-3 py-1 rounded-lg uppercase">[Event Affiliation]</span>
                    <span className="text-[9px] font-black text-emerald-900 bg-emerald-50 px-3 py-1 rounded-lg uppercase">[Country]</span>
                  </div>
                </div>

                {outreachStatus.active ? (
                  <div className="py-12 space-y-8 animate-in fade-in">
                    <div className="text-center space-y-4">
                       <h4 className="text-sm font-black text-emerald-950 uppercase tracking-[0.2em]">{outreachStatus.phase}</h4>
                       <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">Progress: {outreachStatus.current} / {outreachStatus.total}</p>
                    </div>
                    <div className="h-4 bg-stone-100 rounded-full overflow-hidden border border-stone-200">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-950 to-[#D4AF37] transition-all duration-1000"
                        style={{ width: `${(outreachStatus.current / outreachStatus.total) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-center text-[10px] text-emerald-600 font-black animate-pulse uppercase tracking-[0.4em]">ISP Safe Delay Active (7s)</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-6 pt-8">
                    <button onClick={() => setStep(2)} className="py-6 bg-stone-50 text-stone-500 rounded-2xl font-black text-[10px] uppercase tracking-widest">Review Targets</button>
                    <button 
                      onClick={handleOutreach}
                      className="py-6 bg-emerald-950 text-[#D4AF37] rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] shadow-2xl hover:brightness-110"
                    >
                      Initialize Batch Dispatch
                    </button>
                  </div>
                )}
             </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ExhibitorDiscovery;
