
import React from 'react';

interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
  cartCount: number;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentPage, cartCount }) => {
  const navItems = [
    { id: 'home', label: 'Headquarters' },
    { id: 'catalog', label: 'Archive' },
    { id: 'advisor', label: 'Bio-Advisor' },
    { id: 'events', label: 'Global Events' },
    { id: 'blog', label: 'Research' },
    { id: 'contact', label: 'Consultancy' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          <div 
            className="flex-shrink-0 flex items-center cursor-pointer group"
            onClick={() => onNavigate('home')}
          >
            <div className="w-12 h-12 bg-emerald-950 rounded-2xl flex items-center justify-center mr-4 group-hover:rotate-12 transition-transform shadow-lg border border-emerald-900/10">
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
                className={`text-[10px] uppercase font-black tracking-[0.2em] transition-all hover:text-emerald-900 relative ${
                  currentPage === item.id ? 'text-emerald-900' : 'text-stone-400'
                }`}
              >
                {item.label}
                {currentPage === item.id && (
                  <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-emerald-900 rounded-full" />
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-6">
            <button 
              onClick={() => onNavigate('cart')}
              className="relative p-3 text-stone-600 hover:text-emerald-950 transition-all group"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-emerald-950 text-gold-500 text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center transform translate-x-1 -translate-y-1 shadow-md border-2 border-white" style={{color: '#D4AF37'}}>
                  {cartCount}
                </span>
              )}
            </button>
            <button 
              onClick={() => onNavigate('catalog')}
              className="hidden sm:block bg-emerald-950 text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-emerald-800 transition-all shadow-xl hover:-translate-y-0.5 active:scale-95 border border-emerald-900" 
              style={{color: '#D4AF37'}}
            >
              Reserve Kit
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
