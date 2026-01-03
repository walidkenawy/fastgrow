
import React, { useState } from 'react';
import { CartItem, Currency } from '../types';

interface CartProps {
  items: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onNavigate: (page: string) => void;
  formatPrice: (price: number) => string;
  currency: Currency;
  onClearCart: () => void;
}

const Cart: React.FC<CartProps> = ({ items, onUpdateQuantity, onNavigate, formatPrice, onClearCart }) => {
  const [checkoutStatus, setCheckoutStatus] = useState<'idle' | 'processing' | 'success'>('idle');
  const subtotal = items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const total = subtotal;

  const handleCheckout = () => {
    setCheckoutStatus('processing');
    // Simulate a high-end in-app processing sequence
    setTimeout(() => {
      setCheckoutStatus('success');
      onClearCart();
    }, 2500);
  };

  if (checkoutStatus === 'success') {
    return (
      <div className="max-w-4xl mx-auto py-32 px-4 text-center">
        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-10">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
        </div>
        <h2 className="text-5xl font-black text-stone-900 mb-6 tracking-tighter uppercase">Protocol Authenticated</h2>
        <p className="text-xl text-stone-600 mb-12 italic font-serif">Your molecular reservation has been logged. A performance specialist will contact your stable shortly to finalize delivery logistics.</p>
        <button onClick={() => onNavigate('home')} className="bg-emerald-950 text-[#D4AF37] px-12 py-5 rounded-full font-black text-[10px] uppercase tracking-widest shadow-2xl">Return to Headquarters</button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2">
          <div className="space-y-8">
            <h1 className="text-6xl font-black text-stone-900 tracking-tighter uppercase mb-12">Cart Lab</h1>
            {items.length === 0 ? (
              <div className="py-20 text-center bg-white rounded-[3rem] border border-stone-100">
                <p className="text-stone-400 font-serif italic text-lg mb-8">Your molecular reservation is empty.</p>
                <button onClick={() => onNavigate('catalog')} className="bg-emerald-950 text-[#D4AF37] px-12 py-5 rounded-full font-black text-[10px] uppercase tracking-widest">Browse Archive</button>
              </div>
            ) : (
              items.map(item => (
                <div key={item.product.id} className="bg-white p-8 rounded-[2rem] border border-stone-100 flex items-center gap-8 shadow-sm">
                  <div className="w-24 h-24 bg-stone-50 rounded-2xl p-2">
                    <img src={item.product.image} className="w-full h-full object-contain mix-blend-multiply" alt={item.product.name} />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-xl font-bold text-stone-900">{item.product.name}</h3>
                    <p className="text-[10px] text-stone-400 uppercase tracking-widest mt-1">{item.product.category}</p>
                    <div className="flex items-center gap-4 mt-6">
                      <button onClick={() => onUpdateQuantity(item.product.id, -1)} className="w-8 h-8 border border-stone-100 rounded-lg">-</button>
                      <span className="font-black text-sm">{item.quantity}</span>
                      <button onClick={() => onUpdateQuantity(item.product.id, 1)} className="w-8 h-8 border border-stone-100 rounded-lg">+</button>
                    </div>
                  </div>
                  <p className="font-black text-xl text-emerald-950">{formatPrice(item.product.price * item.quantity)}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {items.length > 0 && (
          <div className="h-fit sticky top-32">
            <div className="bg-emerald-950 p-10 rounded-[3rem] text-white shadow-2xl">
              <h3 className="text-xs font-black uppercase tracking-widest text-[#D4AF37] mb-8">Dossier Summary</h3>
              <div className="space-y-4 mb-10 border-b border-white/10 pb-4">
                <div className="flex justify-between">
                  <span className="opacity-60 text-[10px] tracking-widest">Archive Subtotal</span>
                  <span className="font-bold">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-xl pt-4 font-black" style={{color: '#D4AF37'}}>
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <button 
                onClick={handleCheckout} 
                disabled={checkoutStatus === 'processing'}
                className="w-full bg-[#D4AF37] text-emerald-950 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-3 shadow-xl"
              >
                {checkoutStatus === 'processing' ? (
                  <>
                    <div className="w-4 h-4 border-2 border-emerald-950 border-t-transparent rounded-full animate-spin"></div>
                    Processing Protocol...
                  </>
                ) : 'Finalize Protocol'}
              </button>
              <p className="text-[9px] text-stone-400 mt-6 uppercase tracking-widest text-center">In-App Secure Finalization</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
