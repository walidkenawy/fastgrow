
import React, { useState } from 'react';
import { sendEmail } from '../services/emailService';
import { searchNearbyEquineFacilities } from '../services/geminiService';
import HQMap from './HQMap';

const ContactForm: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<{ text: string, places: any[] } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');
    
    const formData = new FormData(e.currentTarget);
    const params = {
      from_name: formData.get('name') as string,
      from_email: formData.get('email') as string,
      subject: formData.get('subject') as string,
      message: formData.get('message') as string,
    };

    const success = await sendEmail(params, 'contact');
    
    if (success) {
      setStatus('success');
    } else {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const handleSmartSearch = async () => {
    setSearchLoading(true);
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (pos) => {
          const results = await searchNearbyEquineFacilities(
            "Find top-rated equine performance centers and horse clinics nearby",
            pos.coords.latitude,
            pos.coords.longitude
          );
          setSearchResults(results);
          setSearchLoading(false);
        }, async () => {
          // Fallback to Warsaw HQ search if geo fails
          const results = await searchNearbyEquineFacilities("Equine centers in Warsaw, Poland");
          setSearchResults(results);
          setSearchLoading(false);
        });
      }
    } catch (err) {
      console.error(err);
      setSearchLoading(false);
    }
  };

  if (status === 'success') {
    return (
      <div className="max-w-2xl mx-auto py-24 px-4 text-center animate-in fade-in duration-700">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-4xl font-bold text-stone-900 mb-4 tracking-tighter">Message Authenticated</h2>
        <p className="text-stone-600 mb-8 italic font-serif">Thank you for reaching out to Nobel Spirit® Labs. Our performance specialists will respond to your inquiry via the secure channel provided within 24 hours.</p>
        <button 
          onClick={() => setStatus('idle')}
          className="bg-emerald-950 text-[#D4AF37] px-10 py-4 rounded-full font-black text-[10px] uppercase tracking-[0.3em] hover:bg-emerald-900 transition-all shadow-xl"
        >
          Send Another Protocol Request
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-32">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
        <div className="animate-in slide-in-from-left duration-700">
          <h2 className="text-xs font-black text-emerald-900 uppercase tracking-[0.5em] mb-4">Direct Consultancy</h2>
          <h1 className="text-6xl font-bold text-stone-900 mb-8 tracking-tighter leading-none">Connect with Our Experts</h1>
          
          <div className="space-y-12">
            {/* Global Contacts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="p-6 bg-white border border-stone-100 rounded-[2rem] shadow-sm">
                <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-3">Electronic Correspondence</h4>
                <a href="mailto:info@nobelspiritlabs.store" className="text-lg font-bold text-emerald-950 hover:underline break-all">info@nobelspiritlabs.store</a>
              </div>
              <div className="p-6 bg-white border border-stone-100 rounded-[2rem] shadow-sm">
                <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-3">Laboratory Direct Line</h4>
                <a href="tel:+48739256482" className="text-lg font-bold text-emerald-950 hover:underline">+48 739 256 482</a>
              </div>
            </div>

            {/* Interactive Map Section */}
            <HQMap 
              title="Global HQ & Lab Facility" 
              description="al. Komisji Edukacji Narodowej 34, 02-797 Warszawa, Poland" 
            />

            {/* Smart Lab Finder */}
            <div className="bg-emerald-50 rounded-[3rem] p-10 border border-emerald-100">
               <div className="flex items-center justify-between mb-6">
                 <div>
                   <h4 className="text-[10px] font-black text-emerald-900 uppercase tracking-widest mb-1">Smart Pavilion Locator</h4>
                   <p className="text-xs text-stone-600 italic">Find our technical partners near your current stable location.</p>
                 </div>
                 <button 
                  onClick={handleSmartSearch}
                  disabled={searchLoading}
                  className="bg-emerald-950 text-[#D4AF37] px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl hover:bg-emerald-900 transition-all disabled:opacity-50"
                 >
                   {searchLoading ? 'Locating...' : 'Search Nearby'}
                 </button>
               </div>
               
               {searchResults && (
                 <div className="space-y-4 animate-in fade-in slide-in-from-top-4">
                   <p className="text-[10px] font-bold text-stone-700 leading-relaxed italic border-l-2 border-[#D4AF37] pl-4">{searchResults.text}</p>
                   <div className="grid grid-cols-1 gap-3">
                     {searchResults.places.map((place: any, i: number) => (
                       <a key={i} href={place.uri} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 bg-white rounded-2xl border border-stone-200 hover:border-[#D4AF37] transition-all group shadow-sm">
                         <span className="text-[11px] font-black text-emerald-950 uppercase">{place.title}</span>
                         <svg className="w-4 h-4 text-stone-300 group-hover:text-[#D4AF37] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" strokeWidth="2.5"/></svg>
                       </a>
                     ))}
                   </div>
                 </div>
               )}
            </div>
          </div>
        </div>

        {/* Inquiry Form */}
        <div className="bg-white rounded-[4rem] p-12 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] border border-stone-100 relative overflow-hidden animate-in slide-in-from-right duration-700">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-950 via-[#D4AF37] to-emerald-950"></div>
          <h3 className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-10">Confidential Protocol Inquiry</h3>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-3">Principal Name</label>
                <input required name="name" type="text" className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-900 outline-none transition-all font-bold text-stone-800" placeholder="Alexander Noble" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-3">Email Address</label>
                <input required name="email" type="email" className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-900 outline-none transition-all font-bold text-stone-800" placeholder="stable@example.com" />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-3">Protocol Subject</label>
              <select name="subject" className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-900 outline-none transition-all font-bold text-stone-800 appearance-none">
                <option>Molecular Protocol Inquiry</option>
                <option>Performance Bio-Analysis</option>
                <option>International Stable Partnership</option>
                <option>Direct Laboratory Support</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-3">Inquiry Details</label>
              <textarea name="message" required rows={6} className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-900 outline-none transition-all resize-none font-bold text-stone-800" placeholder="Describe the performance objectives or clinical requirements..."></textarea>
            </div>
            <button 
              type="submit" 
              disabled={status === 'submitting'}
              className="w-full bg-emerald-950 text-[#D4AF37] py-6 rounded-2xl font-black text-xs uppercase tracking-[0.4em] hover:bg-emerald-900 transition-all flex items-center justify-center shadow-xl active:scale-[0.98]"
            >
              {status === 'submitting' ? (
                <div className="w-5 h-5 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
              ) : status === 'error' ? 'Transmission Failed' : 'Transmit Protocol Request'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
