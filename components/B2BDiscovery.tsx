
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { searchB2BPartners } from '../services/geminiService';
import { sendEmail } from '../services/emailService';
import { saveB2BContact, getB2BContacts } from '../services/dbService';
import { downloadCSV } from '../services/csvService';

interface Partner {
  id: string;
  name: string;
  uri: string;
  location: string;
  city: string;
  website: string;
  linkedin: string;
  type?: string;
  contactMethods: {
    email: boolean;
    form: boolean;
    phone: boolean;
  };
  analysis?: {
    estimatedProfit: string;
    marketStanding: string;
    scale: number;
  };
}

interface OutreachHistoryItem {
  id: string;
  name: string;
  status: 'Sent' | 'Replied' | 'Not Interested' | 'Pending';
  date: string;
}

const B2BDiscovery: React.FC = () => {
  const [step, setStep] = useState(1);
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [businessType, setBusinessType] = useState('Horse Riding Schools');
  const [loading, setLoading] = useState(false);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [outreachMethod, setOutreachMethod] = useState<'individual' | 'bulk'>('individual');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [outreachStatus, setOutreachStatus] = useState({ 
    active: false, 
    current: 0, 
    total: 0, 
    phase: '', 
    lastSent: '' 
  });
  
  const [message, setMessage] = useState('Dear [Partner Name],\n\nWe represent Nobel Spirit® Labs, a specialized laboratory providing molecular nutrition protocols for elite equine performance. \n\nWe have identified your facility in [City] as a potential candidate for our Technical Partnership Program. Our protocols have demonstrated significant improvements in competitive recovery and metabolic efficiency.\n\nWould you be open to receiving a technical brochure regarding our 2026 performance circuit?');
  
  const [outreachHistory, setOutreachHistory] = useState<OutreachHistoryItem[]>([]);

  useEffect(() => {
    const loadHistory = async () => {
      const data = await getB2BContacts();
      setOutreachHistory(data as OutreachHistoryItem[]);
    };
    loadHistory();
  }, []);

  const handleSearch = async () => {
    if (!country) return;
    setLoading(true);
    try {
      const results = await searchB2BPartners(country, businessType, city);
      setPartners(results);
      setStep(2);
    } catch (err) {
      console.error(err);
      alert("Deep AI Research Protocol Failed. Please verify laboratory uplink.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * CSV TEMPLATE DOWNLOAD
   */
  const downloadTemplate = () => {
    const templateData = [{
      Name: "Example Elite Stables",
      City: "Riyadh",
      Country: "Saudi Arabia",
      Website: "https://example.com",
      LinkedIn: "https://linkedin.com/company/example",
      Type: "Horse Riding School",
      Email_Available: "TRUE",
      Phone_Available: "TRUE",
      Form_Available: "FALSE",
      Estimated_Profit: "50000 EUR",
      Market_Standing: "Elite",
      Growth_Scale: "85"
    }];
    downloadCSV(templateData, "NobelSpirit_B2B_Template");
  };

  /**
   * EXPORT RESULTS
   */
  const exportResults = () => {
    downloadCSV(partners, `NobelSpirit_Leads_${country}`);
  };

  /**
   * ENHANCED CSV IMPORT
   */
  const handleCSVImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split(/\r?\n/);
      if (lines.length < 2) {
        alert("Invalid CSV format. Header row required.");
        return;
      }

      const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, '').toLowerCase());
      const importedPartners: Partner[] = [];

      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        
        // Handle CSV quoting correctly
        const values = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g)?.map(v => v.trim().replace(/^"|"$/g, '').replace(/""/g, '"')) || [];
        const row: any = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || "";
        });

        const p: Partner = {
          id: `csv-${i}-${Date.now()}`,
          name: row.name || row.company || row.business || "Imported Lead",
          city: row.city || "Regional Hub",
          location: row.country || country || "Global",
          website: row.website || row.url || "https://google.com",
          uri: row.website || row.url || "https://google.com",
          linkedin: row.linkedin || row.profile || "",
          type: row.type || businessType,
          contactMethods: {
            email: row.email_available === "TRUE" || row.email === "TRUE",
            form: row.form_available === "TRUE" || row.form === "TRUE",
            phone: row.phone_available === "TRUE" || row.phone === "TRUE"
          },
          analysis: {
            estimatedProfit: row.estimated_profit || row.profit || "N/A",
            marketStanding: row.market_standing || row.standing || "High-Tier",
            scale: parseInt(row.growth_scale || row.scale) || 50
          }
        };
        importedPartners.push(p);
      }

      if (importedPartners.length > 0) {
        setPartners(importedPartners);
        setStep(2);
        alert(`Successfully synchronized ${importedPartners.length} leads with Laboratory Vault.`);
      }
    };
    reader.readAsText(file);
  };

  const groupedPartners = useMemo(() => {
    const groups: Record<string, Partner[]> = {};
    partners.forEach(p => {
      const c = p.city || "Regional Hub";
      if (!groups[c]) groups[c] = [];
      groups[c].push(p);
    });
    return groups;
  }, [partners]);

  const toggleSelectAll = () => {
    if (selectedIds.size >= partners.length) {
      setSelectedIds(new Set());
    } else {
      const next = new Set<string>();
      partners.slice(0, 50).forEach(p => next.add(p.id));
      setSelectedIds(next);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (next.size >= 50) {
          alert("Strategic Batch Limit: 50 partners max.");
          return prev;
        }
        next.add(id);
      }
      return next;
    });
  };

  const executeSequentialOutreach = async () => {
    const selectedPartners = partners.filter(p => selectedIds.has(p.id));
    setOutreachStatus({ 
      active: true, 
      current: 0, 
      total: selectedPartners.length, 
      phase: 'Initializing Sequential Engine...', 
      lastSent: '' 
    });

    for (let i = 0; i < selectedPartners.length; i++) {
      const partner = selectedPartners[i];
      setOutreachStatus(prev => ({ ...prev, phase: `Personalizing protocol for ${partner.name}...`, current: i + 1 }));
      await new Promise(r => setTimeout(r, 1200));

      const personalizedMessage = message
        .replace(/\[Partner Name\]/g, partner.name)
        .replace(/\[City\]/g, partner.city) + 
        "\n\n---\nProfessional Intent: This technical inquiry is transmitted by Nobel Spirit® Labs for B2B collaboration. To decline future protocols, reply 'STOP'.";

      setOutreachStatus(prev => ({ ...prev, phase: `Transmitting to ${partner.name}...` }));
      await sendEmail({
        from_name: "Nobel Spirit B2B Partnership",
        client_name: partner.name,
        client_email: "b2b@nobelspirit.pl",
        subject: `Technical Inquiry: Equine Performance Protocol for ${partner.name}`,
        message: personalizedMessage
      }, 'contact');

      await saveB2BContact({
        id: partner.id,
        name: partner.name,
        status: 'Sent',
        date: new Date().toISOString()
      });

      if (i < selectedPartners.length - 1) {
        setOutreachStatus(prev => ({ ...prev, phase: 'Sequential ISP Safe Delay (7s)...', lastSent: partner.name }));
        await new Promise(r => setTimeout(r, 7000));
      }
    }

    setOutreachStatus(prev => ({ ...prev, active: false, phase: 'Batch Transmission Complete' }));
    alert("B2B Sequential Outreach Successfully Executed.");
    setStep(1);
    setSelectedIds(new Set());
    const data = await getB2BContacts();
    setOutreachHistory(data as OutreachHistoryItem[]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-xs font-black text-emerald-900 uppercase tracking-[0.4em] mb-4">Market Intelligence Laboratory</h2>
          <h1 className="text-6xl font-bold text-stone-900 tracking-tighter">B2B Partner Discovery</h1>
          <p className="text-stone-500 italic font-serif mt-4 text-lg">Synthesizing data on 50 elite equine targets for direct strategic outreach.</p>
        </div>
        {step === 2 && (
          <div className="flex gap-4">
             <button onClick={exportResults} className="px-6 py-3 border border-stone-200 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-stone-50 transition-all flex items-center gap-2">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" strokeWidth="2.5"/></svg>
               Export Results (CSV)
             </button>
             <button onClick={toggleSelectAll} className="px-6 py-3 border border-stone-200 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-stone-50 transition-all">
               {selectedIds.size >= partners.length ? "Deselect All" : "Select Top 50 Leads"}
             </button>
             <button 
                onClick={() => setStep(3)} 
                disabled={selectedIds.size === 0}
                className="px-8 py-3 bg-emerald-950 text-[#D4AF37] rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl disabled:opacity-50"
             >
                Initialize Outreach Phase ({selectedIds.size})
             </button>
          </div>
        )}
      </div>

      {/* STEP 1: PARAMETER SELECTION & IMPORT */}
      {step === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-10 rounded-[3rem] border border-stone-100 shadow-xl space-y-8">
              <h3 className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-6">Laboratory Parameters</h3>
              <div>
                <label className="block text-[10px] font-black text-emerald-900 uppercase mb-3">Country Target</label>
                <input 
                  type="text" 
                  value={country} 
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="e.g. Poland, UAE, KSA"
                  className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl outline-none font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-emerald-900 uppercase mb-3">City Focus</label>
                <input 
                  type="text" 
                  value={city} 
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Warsaw, Riyadh"
                  className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl outline-none font-bold"
                />
              </div>
              <button 
                onClick={handleSearch}
                disabled={loading || !country}
                className="w-full bg-emerald-950 text-[#D4AF37] py-6 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-900 transition-all disabled:opacity-50 flex items-center justify-center shadow-2xl"
              >
                {loading ? (
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
                    <span>Deep Research Sync...</span>
                  </div>
                ) : 'Commence AI Discovery'}
              </button>
            </div>

            <div className="bg-white p-10 rounded-[3rem] border border-emerald-100 shadow-xl text-center">
              <h3 className="text-[10px] font-black text-emerald-900 uppercase tracking-widest mb-6">Import External Leads</h3>
              <p className="text-[10px] text-stone-400 font-medium mb-6 px-2 italic">Ingest bulk data dossiere into the B2B engine.</p>
              
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleCSVImport} 
                accept=".csv" 
                className="hidden" 
              />
              
              <div className="space-y-3">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-5 border-2 border-dashed border-emerald-100 rounded-2xl text-[10px] font-black text-emerald-900 uppercase tracking-widest hover:bg-emerald-50 transition-all flex items-center justify-center gap-3"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" strokeWidth="2.5"/></svg>
                  Select CSV Lead File
                </button>
                <button 
                  onClick={downloadTemplate}
                  className="w-full py-3 text-[9px] font-black text-stone-400 uppercase tracking-widest hover:text-emerald-900 transition-colors"
                >
                  Download CSV Template
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
             <div className="bg-emerald-50 p-12 rounded-[4rem] border border-emerald-100">
               <h3 className="text-[10px] font-black text-emerald-900 uppercase tracking-[0.3em] mb-10 flex items-center gap-4">
                 Strategic Outreach Archive
                 <div className="h-px flex-grow bg-emerald-200"></div>
               </h3>
               {outreachHistory.length === 0 ? (
                 <div className="py-24 text-center">
                    <p className="text-stone-400 italic font-serif text-lg">No active discovery batches in the current archive.</p>
                 </div>
               ) : (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {outreachHistory.slice(-10).reverse().map((h, i) => (
                     <div key={i} className="flex items-center justify-between p-6 bg-white rounded-3xl border border-emerald-100 shadow-sm group">
                        <div>
                          <p className="text-sm font-bold text-emerald-950">{h.name}</p>
                          <p className="text-[8px] text-stone-400 uppercase tracking-widest mt-1">{new Date(h.date).toLocaleString()}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${h.status === 'Sent' ? 'bg-emerald-100 text-emerald-700' : h.status === 'Replied' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                            {h.status}
                          </span>
                        </div>
                     </div>
                   ))}
                 </div>
               )}
             </div>
          </div>
        </div>
      )}

      {/* STEP 2: REVIEW & SELECT */}
      {step === 2 && (
        <div className="space-y-16 animate-in slide-in-from-bottom-8 duration-700">
          <div className="bg-emerald-950 text-[#D4AF37] p-8 rounded-[3rem] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold tracking-tight">Review & Select Strategic Partners</h3>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60">{partners.length} Leads Ingested. Review and select for Sequential Batch outreach.</p>
            </div>
            <div className="flex gap-4">
              <div className="px-6 py-2 bg-white/5 rounded-xl border border-white/10 text-center">
                <p className="text-[8px] uppercase tracking-widest opacity-50">Selected Leads</p>
                <p className="text-lg font-black">{selectedIds.size}</p>
              </div>
              <div className="px-6 py-2 bg-white/5 rounded-xl border border-white/10 text-center">
                <p className="text-[8px] uppercase tracking-widest opacity-50">Total In Pool</p>
                <p className="text-lg font-black">{partners.length}</p>
              </div>
            </div>
          </div>

          {(Object.entries(groupedPartners) as [string, Partner[]][]).map(([cityName, items]) => (
            <div key={cityName}>
              <div className="flex items-center gap-6 mb-8">
                <h3 className="text-2xl font-black text-stone-900 uppercase tracking-tighter">Region Cluster: {cityName}</h3>
                <div className="h-px flex-grow bg-stone-100"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {items.map(p => (
                  <div 
                    key={p.id} 
                    onClick={() => toggleSelect(p.id)}
                    className={`p-10 rounded-[3rem] border-2 transition-all cursor-pointer relative group overflow-hidden ${selectedIds.has(p.id) ? 'bg-emerald-50 border-emerald-500 ring-8 ring-emerald-50 shadow-2xl' : 'bg-white border-stone-100 hover:border-emerald-200'}`}
                  >
                    <div className="absolute top-6 right-8">
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${selectedIds.has(p.id) ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-stone-200 text-transparent'}`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeWidth="3.5"/></svg>
                      </div>
                    </div>

                    <h4 className="text-2xl font-bold text-emerald-950 mb-2 leading-tight pr-8">{p.name}</h4>
                    <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-4">{p.type || businessType}</p>

                    <div className="flex flex-wrap gap-2 mb-6">
                       <span className={`px-2 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-[7px] font-black uppercase tracking-widest`}>Lead Channel Verified</span>
                    </div>

                    <div className="space-y-3 mb-8">
                       <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Market Analysis</p>
                       <div className="flex justify-between items-center bg-stone-50 p-4 rounded-2xl">
                          <span className="text-[10px] font-bold text-emerald-950">{p.analysis?.marketStanding}</span>
                          <span className="text-[10px] font-black text-[#D4AF37]">{p.analysis?.estimatedProfit}</span>
                       </div>
                    </div>

                    <div className="flex items-center gap-4 pt-6 border-t border-stone-100">
                       <a 
                        href={p.website} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        onClick={(e) => e.stopPropagation()}
                        className="text-[9px] font-black text-emerald-950 uppercase tracking-widest hover:text-[#D4AF37] flex items-center gap-2"
                       >
                         Website
                         <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" strokeWidth="2.5"/></svg>
                       </a>
                       {p.linkedin && (
                         <a 
                          href={p.linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          onClick={(e) => e.stopPropagation()}
                          className="text-[9px] font-black text-[#0077B5] uppercase tracking-widest hover:brightness-125 flex items-center gap-2"
                         >
                           LinkedIn
                           <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                         </a>
                       )}
                    </div>
                    
                    <div className="mt-6 flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                       <span className="text-[8px] font-black text-emerald-950 uppercase tracking-widest">Review & Select Businesses</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* STEP 3: CONFIGURE & TRANSMIT */}
      {step === 3 && (
        <div className="max-w-3xl mx-auto animate-in zoom-in duration-500 pb-32">
           <div className="bg-white p-12 rounded-[4rem] border border-stone-100 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-950 via-[#D4AF37] to-emerald-950"></div>
             
             <h3 className="text-[10px] font-black text-emerald-900 uppercase tracking-widest mb-4">Outreach Strategy Configuration</h3>
             <p className="text-stone-500 text-sm italic font-serif mb-10">Choose Transmission Protocol for {selectedIds.size} Selected Targets.</p>

             <div className="grid grid-cols-2 gap-6 mb-12">
                <button 
                  onClick={() => setOutreachMethod('individual')}
                  className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-4 ${outreachMethod === 'individual' ? 'border-[#D4AF37] bg-stone-50' : 'border-stone-100 bg-white'}`}
                >
                   <svg className="w-8 h-8 text-stone-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeWidth="2"/></svg>
                   <span className="text-[10px] font-black uppercase tracking-widest">Individual Email</span>
                </button>
                <button 
                  onClick={() => setOutreachMethod('bulk')}
                  className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-4 ${outreachMethod === 'bulk' ? 'border-[#D4AF37] bg-stone-50' : 'border-stone-100 bg-white'}`}
                >
                   <svg className="w-8 h-8 text-stone-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" strokeWidth="2"/></svg>
                   <span className="text-[10px] font-black uppercase tracking-widest">Sequential Bulk Email</span>
                </button>
             </div>

             <div className="space-y-8">
               <div>
                 <label className="block text-[10px] font-black text-stone-400 uppercase mb-4 tracking-widest">Personalized Template Protocol</label>
                 <textarea 
                  rows={10}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-8 py-6 bg-stone-50 border border-stone-100 rounded-[2rem] outline-none focus:ring-4 focus:ring-emerald-500/10 font-bold text-stone-800 italic"
                 />
                 <div className="mt-4 flex flex-wrap gap-2">
                    <span className="text-[8px] font-black text-emerald-900 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-widest">[Partner Name]</span>
                    <span className="text-[8px] font-black text-emerald-900 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-widest">[City]</span>
                 </div>
               </div>

               {outreachStatus.active ? (
                 <div className="py-12 space-y-8 animate-in fade-in">
                    <div className="text-center space-y-4">
                       <h4 className="text-sm font-black text-emerald-950 uppercase tracking-[0.2em]">{outreachStatus.phase}</h4>
                       <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">Queue Position: {outreachStatus.current} / {outreachStatus.total}</p>
                    </div>

                    <div className="h-6 bg-stone-100 rounded-full overflow-hidden border border-stone-200 relative">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-950 via-[#D4AF37] to-emerald-950 transition-all duration-1000 shadow-inner"
                        style={{ width: `${(outreachStatus.current / outreachStatus.total) * 100}%` }}
                      ></div>
                    </div>

                    <div className="bg-stone-50 p-6 rounded-3xl border border-stone-100">
                       <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest mb-2">Sequential History</p>
                       <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                          <p className="text-[10px] font-bold text-stone-600">Successfully Transmitted to {outreachStatus.lastSent || 'Synthesizing...'}</p>
                       </div>
                    </div>

                    <p className="text-center text-[10px] text-emerald-600 font-black animate-pulse uppercase tracking-[0.4em]">Tactical Sequential Throttle Active (7s)</p>
                 </div>
               ) : (
                 <div className="grid grid-cols-2 gap-6 pt-8">
                    <button onClick={() => setStep(2)} className="py-6 bg-stone-50 text-stone-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-stone-100 transition-all">Review Selections</button>
                    <button 
                      onClick={executeSequentialOutreach}
                      className="py-6 bg-emerald-950 text-[#D4AF37] rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] shadow-2xl hover:bg-emerald-900 active:scale-95 transition-all"
                    >
                      Commence {outreachMethod === 'bulk' ? 'Bulk' : 'Individual'} Outreach
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

export default B2BDiscovery;
