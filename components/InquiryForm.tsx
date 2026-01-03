
import React, { useState } from 'react';
import { Product } from '../types';
import { sendEmail } from '../services/emailService';

interface InquiryFormProps {
  product: Product;
  embedded?: boolean;
}

const InquiryForm: React.FC<InquiryFormProps> = ({ product, embedded = false }) => {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');
    
    const formData = new FormData(e.currentTarget);
    const params = {
      product_name: product.name,
      product_sku: product.sku,
      client_name: formData.get('name') as string,
      client_email: formData.get('email') as string,
      client_phone: formData.get('phone') as string,
      message: formData.get('message') as string,
      subject: `New Product Inquiry: ${product.name}`,
    };

    const success = await sendEmail(params, 'inquiry');
    
    if (success) {
      setStatus('success');
    } else {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  if (status === 'success') {
    return (
      <div className={`text-center p-12 bg-emerald-50 rounded-[2.5rem] border border-emerald-100 animate-in zoom-in duration-500 ${embedded ? '' : 'shadow-xl'}`}>
        <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
        </div>
        <h3 className="text-2xl font-bold text-emerald-950 mb-2">Protocol Received</h3>
        <p className="text-emerald-700 font-medium italic font-serif">Thank you! Our lab specialists will reply with pricing information for {product.name} shortly.</p>
      </div>
    );
  }

  return (
    <div className={`${embedded ? 'mt-16' : ''} bg-white rounded-[2.5rem] border border-stone-100 p-8 md:p-12 relative overflow-hidden ${embedded ? 'shadow-sm' : 'shadow-2xl'}`}>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-950 via-[#D4AF37] to-emerald-950"></div>
      
      <h3 className="text-[10px] font-black text-emerald-900 uppercase tracking-[0.4em] mb-4">Laboratory Pricing Request</h3>
      <h2 className="text-3xl font-bold text-stone-900 mb-8 tracking-tighter">Inquire About {product.name}</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest ml-1">Full Name</label>
            <input 
              required 
              name="name"
              type="text" 
              className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-900 outline-none transition-all font-bold text-stone-800" 
              placeholder="e.g. Alexander Noble" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest ml-1">Email Address</label>
            <input 
              required 
              name="email"
              type="email" 
              className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-900 outline-none transition-all font-bold text-stone-800" 
              placeholder="stable@example.com" 
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest ml-1">Phone (Optional)</label>
          <input 
            name="phone"
            type="tel" 
            className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-900 outline-none transition-all font-bold text-stone-800" 
            placeholder="+48 --- --- ---" 
          />
        </div>

        <div className="space-y-2">
          <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest ml-1">Message</label>
          <textarea 
            required 
            name="message"
            rows={4}
            defaultValue={`I am interested in ${product.name}. Please send price information and how to order.`}
            className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-900 outline-none transition-all resize-none font-bold text-stone-800"
          />
        </div>

        <button 
          type="submit" 
          disabled={status === 'submitting'}
          className="w-full bg-emerald-950 text-[#D4AF37] py-6 rounded-2xl font-black text-xs uppercase tracking-[0.4em] hover:bg-emerald-900 transition-all flex items-center justify-center shadow-xl active:scale-[0.98] disabled:opacity-50"
        >
          {status === 'submitting' ? (
            <div className="w-5 h-5 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
          ) : status === 'error' ? 'Transmission Failed' : 'Send Inquiry'}
        </button>
        
        {status === 'error' && (
          <p className="text-[9px] text-red-500 font-bold text-center uppercase tracking-widest animate-pulse">
            Gateway Error. Please check connectivity.
          </p>
        )}
      </form>
    </div>
  );
};

export default InquiryForm;
