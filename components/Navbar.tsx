
import React, { useState } from 'react';
import { CartItem, Currency } from '../types';

interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
  cart: CartItem[];
  currency: Currency;
  formatPrice: (price: number) => string;
  onUpdateCart: (id: string, delta: number) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentPage, cart, currency, formatPrice, onUpdateCart }) => {
  const [showCartDropdown, setShowCartDropdown] = useState(false);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  const navItems = [
    { id: 'home', label: 'Headquarters' },
    { id: 'catalog', label: 'Archive' },
    { id: 'advisor', label: 'Bio-Advisor' },
    { id: 'events', label: 'Global Events' },
    { id: 'blog', label: 'Research' },
    { id: 'contact', label: 'Consultancy' },
  ];

  return (
    <nav className="sticky top-0 z-[200] bg-white/95 backdrop-blur-xl border-b border-stone-100 h-24 flex items-center shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex justify-between items-center">
        <div className="flex items-center cursor-pointer group" onClick={() => onNavigate('home')}>
          <div className="w-12 h-12 bg-emerald-950 rounded-2xl flex items-center justify-center mr-4 shadow-lg border border-emerald-900/10">
            <span className="font-serif text-2xl" style={{color: '#D4AF37'}}>N</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black text-emerald-950 tracking-tighter leading-none">NOBEL</span>
            <span className="text-[10px] font-bold text-emerald-700 tracking-[0.4em] leading-none mt-1 uppercase" style={{color: '#D4AF37'}}>Spirit®</span>
          </div>
        </div>
        
        <div className="hidden lg:flex space-x-10">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`text-[10px] uppercase font-black tracking-[0.2em] transition-all hover:text-emerald-900 relative ${currentPage === item.id ? 'text-emerald-900' : 'text-stone-400'}`}
            >
              {item.label}
              {currentPage === item.id && <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-emerald-900 rounded-full" />}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-6">
          <div className="relative" onMouseEnter={() => setShowCartDropdown(true)} onMouseLeave={() => setShowCartDropdown(false)}>
            <button onClick={() => onNavigate('cart')} className="p-3 text-stone-600 hover:text-emerald-950 transition-all relative">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-emerald-950 text-[#D4AF37] text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md border-2 border-white">
                  {cartCount}
                </span>
              )}
            </button>

            {showCartDropdown && cart.length > 0 && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-[2rem] shadow-2xl border border-stone-100 p-6 animate-in fade-in slide-in-from-top-4">
                <h3 className="text-[10px] font-black text-emerald-950 uppercase tracking-widest mb-4">Stable Reservation</h3>
                <div className="max-h-64 overflow-y-auto space-y-4 mb-6 pr-2">
                  {cart.map(item => (
                    <div key={item.product.id} className="flex gap-4 items-center">
                      <div className="w-12 h-12 bg-stone-50 rounded-lg shrink-0 overflow-hidden">
                        <img src={item.product.image} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-grow">
                        <p className="text-[10px] font-bold text-stone-900 line-clamp-1">{item.product.name}</p>
                        <p className="text-[9px] text-stone-400">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-[10px] font-bold">{formatPrice(item.product.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
                <div className="border-t border-stone-50 pt-4 mb-4 flex justify-between">
                  <span className="text-[10px] font-black uppercase text-stone-400">Subtotal</span>
                  <span className="text-sm font-black text-emerald-950">{formatPrice(subtotal)}</span>
                </div>
                <button onClick={() => onNavigate('cart')} className="w-full bg-emerald-950 text-[#D4AF37] py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all">Proceed to Logistics</button>
              </div>
            )}
          </div>
          <button onClick={() => onNavigate('catalog')} className="hidden sm:block bg-emerald-950 text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-emerald-800 transition-all border border-emerald-900" style={{color: '#D4AF37'}}>Reserve Kit</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
