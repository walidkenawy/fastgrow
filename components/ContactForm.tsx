
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
        <h2 className="text-4xl font-bold text-stone-900 mb-4">Message Sent!</h2>
        <p className="text-stone-600 mb-8">Thank you for reaching out to EquiPro AI. Our team of specialists will get back to you within 24 hours.</p>
        <button 
          onClick={() => setFormState('idle')}
          className="bg-emerald-800 text-white px-8 py-3 rounded-full font-bold hover:bg-emerald-700 transition-all"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-2 gap-16">
      <div>
        <h2 className="text-4xl font-bold text-stone-900 mb-6">Contact Our Experts</h2>
        <p className="text-lg text-stone-600 mb-10 leading-relaxed">
          Whether you have a question about our specific products, need technical support, or want to discuss a custom nutrition plan for your stable, we're here to help.
        </p>
        
        <div className="space-y-8">
          <div className="flex items-start">
            <div className="w-12 h-12 bg-stone-100 rounded-xl flex items-center justify-center mr-4 shrink-0">
              <svg className="w-6 h-6 text-emerald-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-stone-900">Email Us</h4>
              <p className="text-stone-500">horse@secretancientlab.com</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="w-12 h-12 bg-stone-100 rounded-xl flex items-center justify-center mr-4 shrink-0">
              <svg className="w-6 h-6 text-emerald-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-stone-900">Headquarters</h4>
              <p className="text-stone-500">ul. Jeździecka 12, 00-001 Warszawa, Poland</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-xl border border-stone-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2">Name</label>
              <input required type="text" className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2">Email</label>
              <input required type="email" className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">Subject</label>
            <select className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all">
              <option>Product Inquiry</option>
              <option>Nutrition Consultation</option>
              <option>Stable Partnership</option>
              <option>Support</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">Message</label>
            <textarea required rows={5} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all resize-none"></textarea>
          </div>
          <button 
            type="submit" 
            disabled={formState === 'submitting'}
            className="w-full bg-emerald-800 text-white py-4 rounded-xl font-bold hover:bg-emerald-700 transition-all flex items-center justify-center"
          >
            {formState === 'submitting' ? (
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
