
import React, { useState } from 'react';

const ContactForm: React.FC = () => {
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('submitting');
    // Simulate API call
    setTimeout(() => {
      setFormState('success');
    }, 1500);
  };

  if (formState === 'success') {
    return (
      <div className="max-w-2xl mx-auto py-24 px-4 text-center">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-4xl font-bold text-stone-900 mb-4 tracking-tighter">Message Authenticated</h2>
        <p className="text-stone-600 mb-8 italic font-serif">Thank you for reaching out to Nobel Spirit® Labs. Our performance specialists will respond to your inquiry via the secure channel provided within 24 hours.</p>
        <button 
          onClick={() => setFormState('idle')}
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
        <div>
          <h2 className="text-xs font-black text-emerald-900 uppercase tracking-[0.5em] mb-4">Direct Consultancy</h2>
          <h1 className="text-6xl font-bold text-stone-900 mb-8 tracking-tighter leading-none">Connect with Our Experts</h1>
          <p className="text-xl text-stone-500 mb-12 leading-relaxed italic font-serif">
            Whether you are managing a single elite athlete or an entire international racing stable, our molecular nutritionists are available for high-level technical consultation.
          </p>
          
          <div className="space-y-10">
            {/* Email Section */}
            <div className="flex items-start group">
              <div className="w-14 h-14 bg-white border border-stone-100 rounded-2xl flex items-center justify-center mr-6 shrink-0 shadow-sm group-hover:border-[#D4AF37] transition-colors">
                <svg className="w-6 h-6 text-emerald-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Electronic Correspondence</h4>
                <a href="mailto:horse@secretancientlab.com" className="text-lg font-bold text-emerald-950 hover:underline">horse@secretancientlab.com</a>
              </div>
            </div>

            {/* Phone Section */}
            <div className="flex items-start group">
              <div className="w-14 h-14 bg-white border border-stone-100 rounded-2xl flex items-center justify-center mr-6 shrink-0 shadow-sm group-hover:border-[#D4AF37] transition-colors">
                <svg className="w-6 h-6 text-emerald-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Laboratory Direct Line</h4>
                <a href="tel:+48739256482" className="text-lg font-bold text-emerald-950 hover:underline tracking-tight">+48 739 256 482</a>
              </div>
            </div>

            {/* Location Section */}
            <div className="flex items-start group">
              <div className="w-14 h-14 bg-white border border-stone-100 rounded-2xl flex items-center justify-center mr-6 shrink-0 shadow-sm group-hover:border-[#D4AF37] transition-colors">
                <svg className="w-6 h-6 text-emerald-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Global HQ & Lab</h4>
                <p className="text-lg font-bold text-emerald-950">ul. Jeździecka 12, 00-001 Warszawa, Poland</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[3rem] p-12 shadow-2xl border border-stone-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-[#D4AF37]"></div>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-3">Principal Name</label>
                <input required type="text" className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-900 outline-none transition-all font-bold text-stone-800" placeholder="e.g. Alexander Noble" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-3">Email Address</label>
                <input required type="email" className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-900 outline-none transition-all font-bold text-stone-800" placeholder="stable@example.com" />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-3">Protocol Subject</label>
              <select className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-900 outline-none transition-all font-bold text-stone-800 appearance-none">
                <option>Molecular Protocol Inquiry</option>
                <option>Performance Bio-Analysis</option>
                <option>International Stable Partnership</option>
                <option>Direct Laboratory Support</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-3">Inquiry Details</label>
              <textarea required rows={6} className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-900 outline-none transition-all resize-none font-bold text-stone-800" placeholder="Please describe the performance objectives or clinical requirements of your horses..."></textarea>
            </div>
            <button 
              type="submit" 
              disabled={formState === 'submitting'}
              className="w-full bg-emerald-950 text-[#D4AF37] py-6 rounded-2xl font-black text-xs uppercase tracking-[0.4em] hover:bg-emerald-900 transition-all flex items-center justify-center shadow-xl active:scale-[0.98]"
            >
              {formState === 'submitting' ? (
                <svg className="animate-spin h-5 w-5 text-[#D4AF37]" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : 'Transmit Protocol Request'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
