
import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import SettingsBar from './components/SettingsBar';
import Hero from './components/Hero';
import AIDietConsultant from './components/AIDietConsultant';
import Catalog from './components/Catalog';
import ContactForm from './components/ContactForm';
import ProductCard from './components/ProductCard';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import Blog from './components/Blog';
import Events from './components/Events';
import FloatingChat from './components/FloatingChat';
import { PRODUCTS, BLOG_POSTS, EQUINE_EVENTS } from './constants';
import { Product, CartItem, Currency, Language, CurrencyCode, BlogPost, EquineEvent } from './types';
import { getExchangeRates, translateContentBatch, translateUISet, generateBlogVisual, generateEventVisual } from './services/geminiService';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // Global Settings
  const [currency, setCurrency] = useState<Currency>({ code: 'PLN', symbol: 'zł', label: 'Polish Zloty' });
  const [language, setLanguage] = useState<Language>({ code: 'en', name: 'English', flag: '🇬🇧' });
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({ PLN: 1 });
  const [isSyncing, setIsSyncing] = useState(false);

  // Content State
  const [translatedProducts, setTranslatedProducts] = useState<Product[]>(PRODUCTS);
  const [translatedBlogs, setTranslatedBlogs] = useState<BlogPost[]>(BLOG_POSTS);
  const [translatedEvents, setTranslatedEvents] = useState<EquineEvent[]>(EQUINE_EVENTS);

  // Daily Briefing State
  const [dailyVisions, setDailyVisions] = useState<Record<string, string>>({});
  const [isSynthesizingDaily, setIsSynthesizingDaily] = useState(false);

  // Translation Sync
  useEffect(() => {
    if (language.code === 'en') {
      setTranslatedProducts(PRODUCTS);
      setTranslatedBlogs(BLOG_POSTS);
      setTranslatedEvents(EQUINE_EVENTS);
      return;
    }

    const syncLinguistics = async () => {
      setIsSyncing(true);
      try {
        const [pBatch, bBatch, eBatch] = await Promise.all([
          translateContentBatch(PRODUCTS.slice(0, 12), language.name, 'product'),
          translateContentBatch(BLOG_POSTS.slice(0, 10), language.name, 'blog'),
          translateContentBatch(EQUINE_EVENTS.slice(0, 10), language.name, 'event')
        ]);

        setTranslatedProducts(prev => {
          const merged = [...prev];
          pBatch.forEach((tp: Product, idx: number) => { merged[idx] = tp; });
          return merged;
        });
        setTranslatedBlogs(bBatch);
        setTranslatedEvents(eBatch);
      } catch (err) {
        console.error("Translation Sync Failed", err);
      } finally {
        setIsSyncing(false);
      }
    };

    syncLinguistics();
  }, [language]);

  // Initialization: Fetch rates
  useEffect(() => {
    const initRates = async () => {
      const rates = await getExchangeRates();
      setExchangeRates(rates);
    };
    initRates();
  }, []);

  const handleProductSelect = (id: string) => {
    setSelectedProductId(id);
    setCurrentPage('product-detail');
    window.scrollTo(0, 0);
  };

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const updateCartQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const formatPrice = (priceInPln: number) => {
    const rate = exchangeRates[currency.code] || 1;
    const converted = priceInPln * rate;
    return `${currency.symbol} ${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const handleSynthesizeDailyHighlights = async () => {
    if (isSynthesizingDaily) return;
    setIsSynthesizingDaily(true);
    
    // Curate 10 mixed items for the daily briefing
    const dailyBriefingItems = [
      ...translatedBlogs.slice(0, 5),
      ...translatedEvents.slice(0, 5)
    ];

    for (const item of dailyBriefingItems) {
      if (!dailyVisions[item.id]) {
        try {
          let vision;
          if ('summary' in item) {
             vision = await generateBlogVisual(item.title, item.summary, item.category);
          } else {
             vision = await generateEventVisual(item.title, item.location, item.category);
          }
          setDailyVisions(prev => ({ ...prev, [item.id]: vision }));
        } catch (e) { console.error(e); }
      }
    }
    setIsSynthesizingDaily(false);
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'home':
        return (
          <>
            <Hero onStart={() => setCurrentPage('advisor')} />
            
            {/* Today's Daily Protocol Highlights - The "Top 10" Section */}
            <section className="py-32 bg-emerald-950 overflow-hidden">
              <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                  <div className="max-w-2xl">
                    <div className="flex items-center gap-3 mb-4">
                       <span className="w-2 h-2 bg-[#D4AF37] rounded-full animate-ping"></span>
                       <h2 className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.5em]">Live Briefing Protocol</h2>
                    </div>
                    <h1 className="text-6xl font-bold text-white mb-6 tracking-tighter">Today's Protocol Highlights</h1>
                    <p className="text-xl text-stone-400 italic font-serif">Curating 10 elite insights and global event registrations every 24 hours.</p>
                  </div>
                  <button 
                    onClick={handleSynthesizeDailyHighlights}
                    disabled={isSynthesizingDaily}
                    className={`px-10 py-5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl transition-all flex items-center gap-4 ${isSynthesizingDaily ? 'bg-white/10 text-stone-500' : 'bg-[#D4AF37] text-emerald-950 hover:brightness-110 active:scale-95'}`}
                  >
                    {isSynthesizingDaily ? (
                      <>
                        <div className="w-4 h-4 border-2 border-emerald-950 border-t-transparent rounded-full animate-spin"></div>
                        Synthesizing Daily Intelligence...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a2 2 0 00-1.96 1.414l-.722 2.166a2 2 0 00.547 2.155l1.638 1.638a2 2 0 002.155.547l2.166-.722a2 2 0 001.414-1.96l-.477-2.387a2 2 0 00-.547-1.022z" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        Synthesize Today's Visions
                      </>
                    )}
                  </button>
                </div>

                <div className="flex gap-10 overflow-x-auto pb-12 scrollbar-hide">
                  {[...translatedBlogs.slice(0, 5), ...translatedEvents.slice(0, 5)].map((item, idx) => (
                    <div 
                      key={item.id} 
                      onClick={() => setCurrentPage('summary' in item ? 'blog' : 'events')}
                      className="min-w-[400px] h-[500px] bg-white/5 border border-white/10 rounded-[3rem] overflow-hidden flex flex-col group cursor-pointer transition-all hover:bg-white/10"
                    >
                      <div className="relative h-64 shrink-0 bg-emerald-900/20">
                         <img 
                          src={dailyVisions[item.id] || ('image' in item ? item.image : '')} 
                          alt={item.title} 
                          className={`w-full h-full object-cover transition-all duration-[2000ms] ${!dailyVisions[item.id] ? 'opacity-30 blur-sm saturate-0' : 'opacity-60 group-hover:opacity-100 group-hover:scale-110'}`}
                         />
                         <div className="absolute top-6 left-6">
                            <span className="bg-[#D4AF37] text-emerald-950 px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl">
                               {'category' in item ? item.category : 'Highlight'}
                            </span>
                         </div>
                      </div>
                      <div className="p-10 flex flex-col flex-grow">
                        <p className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.4em] mb-4">Briefing Item {idx + 1} of 10</p>
                        <h3 className="text-2xl font-bold text-white mb-6 leading-tight tracking-tight line-clamp-2">{item.title}</h3>
                        <p className="text-stone-400 text-sm italic font-serif line-clamp-3 mb-auto">
                          "{'summary' in item ? item.summary : item.description}"
                        </p>
                        <div className="pt-6 border-t border-white/5 mt-6 flex justify-between items-center">
                           <span className="text-stone-500 text-[9px] font-black uppercase tracking-widest">Protocol: ACCESS-24</span>
                           <svg className="w-5 h-5 text-[#D4AF37] group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="py-32 bg-white">
              <div className="max-w-7xl mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                  <div className="max-w-2xl">
                    <h2 className="text-xs font-black text-emerald-900 uppercase tracking-[0.5em] mb-4">Laboratory Selection</h2>
                    <h1 className="text-6xl font-bold text-stone-900 mb-6 tracking-tighter">Performance Protocol Archive</h1>
                    <p className="text-xl text-stone-500 italic font-serif">Our curated repository of elite biological solutions for the international sport horse.</p>
                  </div>
                  <button 
                    onClick={() => setCurrentPage('catalog')}
                    className="bg-emerald-950 text-white px-10 py-5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl flex items-center group transition-all"
                    style={{color: '#D4AF37'}}
                  >
                    Enter the Lab
                    <svg className="w-5 h-5 ml-4 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                  {translatedProducts.slice(0, 3).map(product => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      onClick={handleProductSelect}
                      onAddToCart={addToCart}
                      formatPrice={formatPrice}
                    />
                  ))}
                </div>
              </div>
            </section>
            
            <section className="py-32 bg-stone-50 border-y border-stone-200">
              <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                <div className="relative">
                  <div className="rounded-[4rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] rotate-2 border-8 border-white">
                    <img src="https://images.unsplash.com/photo-1551884831-bbf3cdc6469e?auto=format&fit=crop&q=80&w=1000" alt="Consultant" />
                  </div>
                  <div className="absolute -bottom-10 -right-10 bg-emerald-950 p-10 rounded-[3rem] shadow-2xl hidden md:block border border-emerald-900">
                    <p className="text-white text-3xl font-black italic tracking-tighter" style={{color: '#D4AF37'}}>400+</p>
                    <p className="text-stone-400 text-[9px] uppercase font-black tracking-widest mt-2">Verified Formulations</p>
                  </div>
                </div>
                <div>
                  <h2 className="text-xs font-black text-emerald-900 uppercase tracking-[0.5em] mb-6">Scientific Methodology</h2>
                  <h1 className="text-6xl font-bold text-stone-900 mb-8 tracking-tighter leading-none">Victory through Precision</h1>
                  <p className="text-xl text-stone-600 mb-10 leading-relaxed font-serif italic">
                    At Nobel Spirit®, we don’t just provide supplements. We engineer precision-targeted molecular solutions derived from peer-reviewed equine biochemistry. Our protocols are designed to close the gap between standard care and Olympic potential.
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
                    {['Lab-Verified Purity', 'Veterinary Grade Standards', 'Real-time Performance Metrics', 'Bio-Available Mineral Matrix'].map((item, i) => (
                      <li key={i} className="flex items-center text-stone-800 font-black text-[10px] uppercase tracking-widest">
                        <div className="w-8 h-8 bg-emerald-100 text-emerald-950 rounded-xl flex items-center justify-center mr-4 shrink-0 border border-emerald-200">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        </div>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <button onClick={() => setCurrentPage('contact')} className="bg-emerald-950 text-white px-10 py-5 rounded-full font-black text-[10px] uppercase tracking-[0.3em] hover:bg-emerald-900 transition-all shadow-2xl" style={{color: '#D4AF37'}}>
                    Request Lab Appointment
                  </button>
                </div>
              </div>
            </section>
          </>
        );
      case 'advisor':
        return <AIDietConsultant onSelectProduct={handleProductSelect} onAddToCart={addToCart} formatPrice={formatPrice} products={translatedProducts} />;
      case 'catalog':
        return <Catalog onSelectProduct={handleProductSelect} onAddToCart={addToCart} formatPrice={formatPrice} products={translatedProducts} />;
      case 'events':
        return <Events events={translatedEvents} />;
      case 'blog':
        return <Blog blogs={translatedBlogs} />;
      case 'contact':
        return <ContactForm />;
      case 'cart':
        return <Cart items={cart} onUpdateQuantity={updateCartQuantity} onNavigate={setCurrentPage} formatPrice={formatPrice} currency={currency} />;
      case 'product-detail':
        const product = translatedProducts.find(p => p.id === selectedProductId);
        return product ? (
          <ProductDetail 
            product={product} 
            onBack={() => setCurrentPage('catalog')} 
            onAddToCart={addToCart}
            formatPrice={formatPrice}
          />
        ) : null;
      default:
        return <div className="p-20 text-center">Protocol Not Found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <SettingsBar 
        currentCurrency={currency}
        onCurrencyChange={setCurrency}
        currentLanguage={language}
        onLanguageChange={setLanguage}
        isSyncing={isSyncing}
      />
      <Navbar 
        onNavigate={setCurrentPage} 
        currentPage={currentPage} 
        cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)}
      />
      <main className="flex-grow">
        {renderContent()}
      </main>
      <footer className="bg-emerald-950 text-stone-400 py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-10">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mr-4 border border-white/20">
                  <span className="text-emerald-950 font-black text-xl">N</span>
                </div>
                <span className="text-3xl font-bold text-white tracking-tighter">Nobel<span className="text-emerald-500" style={{color: '#D4AF37'}}>Spirit</span></span>
              </div>
              <p className="max-w-md text-stone-400 text-lg leading-relaxed font-serif italic mb-8">
                The international benchmark for equine performance technology.
              </p>
              <div className="flex gap-4">
                {[
                  { id: 'fb', icon: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>, url: 'https://facebook.com/nobelspirit' },
                  { id: 'ig', icon: <><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></>, url: 'https://instagram.com/nobelspirit' },
                  { id: 'li', icon: <><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></>, url: 'https://linkedin.com/company/nobelspirit' },
                  { id: 'yt', icon: <><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.14 1 12 1 12s0 3.86.46 5.58a2.78 2.78 0 0 0 1.94 2c1.72.42 8.6.42 8.6.42s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.86 23 12 23 12s0-3.86-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></>, url: 'https://youtube.com/@nobelspirit' }
                ].map((social) => (
                  <a 
                    key={social.id} 
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white/5 rounded-full border border-white/10 flex items-center justify-center text-stone-400 hover:text-[#D4AF37] hover:border-[#D4AF37] hover:bg-white/10 transition-all duration-300 group/social"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      {social.icon}
                    </svg>
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-white font-black text-xs uppercase tracking-[0.4em] mb-10">Archive Navigation</h4>
              <ul className="space-y-6 text-[10px] font-black uppercase tracking-widest">
                <li><button onClick={() => setCurrentPage('home')} className="hover:text-gold-500 transition-colors">Headquarters</button></li>
                <li><button onClick={() => setCurrentPage('catalog')} className="hover:text-gold-500 transition-colors">Protocol Catalog</button></li>
                <li><button onClick={() => setCurrentPage('advisor')} className="hover:text-gold-500 transition-colors">Diagnostic Engine</button></li>
                <li><button onClick={() => setCurrentPage('events')} className="hover:text-gold-500 transition-colors">Global Pavilion</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-black text-xs uppercase tracking-[0.4em] mb-10">Laboratory Contact</h4>
              <ul className="space-y-4 text-sm font-medium">
                <li className="text-white">horse@secretancientlab.com</li>
                <li>+48739256482</li>
                <li className="text-stone-500 pt-4 text-xs font-black uppercase tracking-widest">24/7 Professional Lab Support</li>
              </ul>
            </div>
          </div>
          <div className="pt-10 border-t border-emerald-900 flex flex-col md:flex-row justify-between items-center gap-6 text-[9px] font-black uppercase tracking-[0.4em]">
            <p>© 2024 Nobel Spirit® Performance Laboratories. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
      <FloatingChat />
    </div>
  );
};

export default App;
