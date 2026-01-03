
import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import SettingsBar from './components/SettingsBar';
import Hero from './components/Hero';
import AIDietConsultant from './components/AIDietConsultant';
import Catalog from './components/Catalog';
import ContactForm from './components/ContactForm';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import Blog from './components/Blog';
import Events from './components/Events';
import FloatingChat from './components/FloatingChat';
import ProductCard from './components/ProductCard';
import InquiryModal from './components/InquiryModal';
import HQMap from './components/HQMap';
import B2BDiscovery from './components/B2BDiscovery';
import ExhibitorDiscovery from './components/ExhibitorDiscovery';
import { PRODUCTS, BLOG_POSTS, EQUINE_EVENTS } from './constants';
import { Product, CartItem, Currency, Language } from './types';
import { getExchangeRates, generateProductMockup } from './services/geminiService';
import { getAllImages, saveImage } from './services/dbService';

const FAQ_DATA = [
  { q: "How are the protocols lab-verified?", a: "Each Nobel Spirit formulation undergoes a 48-hour molecular assay to ensure batch stability and nutrient density." },
  { q: "What is the delivery timeline for international circuits?", a: "We maintain regional hubs in Warsaw, Riyadh, and Dubai, allowing for 72-hour delivery to major international pavilions." },
  { q: "Can I customize a molecular profile?", a: "Yes, our Bio-Advisor tool integrated with Gemini Vision can help synthesize unique dietary requirements based on bloodwork analysis." }
];

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [inquiryProduct, setInquiryProduct] = useState<Product | null>(null);
  const [currency, setCurrency] = useState<Currency>({ code: 'PLN', symbol: 'zł', label: 'Polish Zloty' });
  const [language, setLanguage] = useState<Language>({ code: 'en', name: 'English', flag: '🇬🇧' });
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({ PLN: 1 });
  const [isInitializing, setIsInitializing] = useState(true);
  const [customImages, setCustomImages] = useState<Record<string, string>>({});

  // INITIALIZE LOCAL ASSETS
  useEffect(() => {
    const initApp = async () => {
      setIsInitializing(true);
      try {
        const [images, rates] = await Promise.all([
          getAllImages(),
          getExchangeRates()
        ]);
        setCustomImages(images);
        setExchangeRates(rates);
      } catch (err) {
        console.error("Initialization Protocol Failure", err);
      } finally {
        setIsInitializing(false);
      }
    };
    initApp();
  }, []);

  const translatedProducts = useMemo(() => 
    PRODUCTS.map(p => ({ ...p, image: customImages[p.id] || p.image })), 
  [customImages]);

  const translatedEvents = useMemo(() => 
    EQUINE_EVENTS.map(e => ({ ...e, image: customImages[e.id] || e.image })),
  [customImages]);

  const handleUpdateImage = async (id: string, newImage: string) => {
    setCustomImages(prev => ({ ...prev, [id]: newImage }));
    await saveImage(id, newImage);
  };

  const handleProductSelect = (id: string) => {
    setSelectedProductId(id);
    setCurrentPage('product-detail');
    window.scrollTo(0, 0);
  };

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { product, quantity }];
    });
  };

  const updateCartQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === productId) return { ...item, quantity: Math.max(0, item.quantity + delta) };
      return item;
    }).filter(item => item.quantity > 0));
  };

  const formatPrice = (priceInPln: number) => {
    const rate = exchangeRates[currency.code] || 1;
    const converted = priceInPln * rate;
    return `${currency.symbol} ${converted.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-emerald-950 flex flex-col items-center justify-center text-center p-6">
        <div className="w-24 h-24 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mb-8"></div>
        <h1 className="text-white text-xs font-black uppercase tracking-[0.5em] animate-pulse">Loading Elite Archive...</h1>
        <p className="text-[#D4AF37] text-[9px] mt-4 uppercase tracking-widest">Optimizing Molecular Profiles</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <SettingsBar 
        currentCurrency={currency} 
        onCurrencyChange={setCurrency} 
        currentLanguage={language} 
        onLanguageChange={setLanguage} 
        isSyncing={false} 
      />
      <Navbar 
        onNavigate={setCurrentPage} 
        currentPage={currentPage} 
        cart={cart} 
        currency={currency} 
        formatPrice={formatPrice} 
        onUpdateCart={updateCartQuantity} 
      />

      <main className="flex-grow">
        {currentPage === 'home' && (
          <>
            <Hero 
              onStart={() => setCurrentPage('advisor')} 
              onExplore={() => setCurrentPage('catalog')}
              onUpdateImage={handleUpdateImage} 
              currentImage={customImages['hero_bg']} 
            />
            <section className="py-32 bg-white">
              <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between mb-16">
                   <div>
                    <h2 className="text-xs font-black text-emerald-900 uppercase tracking-[0.5em] mb-4">Elite Archive</h2>
                    <h1 className="text-6xl font-bold text-stone-900 tracking-tighter">Live Protocols</h1>
                   </div>
                   <button onClick={() => setCurrentPage('catalog')} className="text-emerald-950 font-black text-[10px] uppercase tracking-widest flex items-center gap-3 group">
                      View Entire Collection
                      <svg className="w-4 h-4 transition-transform group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 8l4 4m0 0l-4 4m4-4H3" strokeWidth="3"/></svg>
                   </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                  {translatedProducts.slice(0, 3).map(product => (
                    <ProductCard key={product.id} product={product} onClick={handleProductSelect} onAddToCart={addToCart} onInquiry={setInquiryProduct} onUpdateImage={handleUpdateImage} formatPrice={formatPrice} />
                  ))}
                </div>
              </div>
            </section>
          </>
        )}
        {currentPage === 'catalog' && <Catalog onSelectProduct={handleProductSelect} onAddToCart={addToCart} onUpdateProductImage={handleUpdateImage} onInquiry={setInquiryProduct} formatPrice={formatPrice} products={translatedProducts} />}
        {currentPage === 'advisor' && <AIDietConsultant onSelectProduct={handleProductSelect} onAddToCart={addToCart} onUpdateProductImage={handleUpdateImage} formatPrice={formatPrice} products={translatedProducts} />}
        {currentPage === 'cart' && <Cart items={cart} onUpdateQuantity={updateCartQuantity} onNavigate={setCurrentPage} formatPrice={formatPrice} currency={currency} onClearCart={() => setCart([])} />}
        {currentPage === 'product-detail' && translatedProducts.find(p => p.id === selectedProductId) && <ProductDetail product={translatedProducts.find(p => p.id === selectedProductId)!} onBack={() => setCurrentPage('catalog')} onAddToCart={addToCart} onUpdateImage={handleUpdateImage} formatPrice={formatPrice} />}
        {currentPage === 'events' && <Events events={translatedEvents} onUpdateImage={handleUpdateImage} />}
        {currentPage === 'blog' && <Blog blogs={BLOG_POSTS} onUpdateImage={handleUpdateImage} />}
        {currentPage === 'contact' && <ContactForm />}
        {currentPage === 'b2b-discovery' && <B2BDiscovery />}
        {currentPage === 'exhibitor-discovery' && <ExhibitorDiscovery />}
      </main>

      {/* Map Section for Headquarters Page */}
      {currentPage === 'home' && (
        <section className="bg-stone-50 py-24 border-t border-stone-100">
          <div className="max-w-7xl mx-auto px-4">
            <div className="mb-12">
              <h2 className="text-xs font-black text-emerald-900 uppercase tracking-[0.5em] mb-4">Global Logistics</h2>
              <h1 className="text-5xl font-bold text-stone-900 tracking-tighter">Warsaw Lab Facility</h1>
            </div>
            <HQMap />
          </div>
        </section>
      )}

      <footer className="bg-emerald-950 text-stone-400 py-24">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-16">
          <div className="col-span-2">
            <h2 className="text-4xl font-bold text-white mb-6">Nobel Spirit® Labs</h2>
            <p className="italic font-serif text-lg leading-relaxed mb-10">Established 1984. Engineering victory for the international elite via precision molecular nutrition.</p>
            <div className="space-y-4">
              <h4 className="text-white text-[10px] font-black uppercase tracking-widest">Protocol FAQ</h4>
              {FAQ_DATA.map((faq, i) => (
                <details key={i} className="group border-b border-white/10 pb-4">
                  <summary className="cursor-pointer font-bold text-xs uppercase tracking-widest list-none group-hover:text-white transition-colors">{faq.q}</summary>
                  <p className="mt-4 text-[11px] leading-relaxed italic">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-white text-[10px] font-black uppercase tracking-widest mb-6">Quick Protocols</h4>
            <ul className="space-y-4 text-xs font-bold uppercase tracking-widest">
              <li><button onClick={() => setCurrentPage('catalog')}>Catalog</button></li>
              <li><button onClick={() => setCurrentPage('advisor')}>Advisor</button></li>
              <li><button onClick={() => setCurrentPage('blog')}>Research</button></li>
              <li>
                <button 
                  onClick={() => setCurrentPage('b2b-discovery')}
                  className="text-[#D4AF37] flex items-center gap-2 hover:brightness-110"
                >
                  B2B Partner Discovery
                  <span className="bg-[#D4AF37] text-emerald-950 text-[8px] px-1.5 py-0.5 rounded-full">NEW</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentPage('exhibitor-discovery')}
                  className="text-[#D4AF37] flex items-center gap-2 hover:brightness-110"
                >
                  Connect with Exhibitors
                  <span className="bg-[#D4AF37] text-emerald-950 text-[8px] px-1.5 py-0.5 rounded-full">ACTIVE</span>
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-[10px] font-black uppercase tracking-widest mb-6">Contact Lab</h4>
            <p className="text-sm font-bold mb-4">+48 739 256 482</p>
            <p className="text-xs">Warsaw, Poland</p>
            <p className="text-xs mt-2">info@nobelspiritlabs.store</p>
          </div>
        </div>
      </footer>
      <FloatingChat />
      <InquiryModal product={inquiryProduct} onClose={() => setInquiryProduct(null)} />
    </div>
  );
};

export default App;
