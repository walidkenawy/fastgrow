
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Navbar from './components/Navbar';
import SettingsBar from './components/SettingsBar';
import Hero from './components/Hero';
import AIDietConsultant from './components/AIDietConsultant';
import Catalog from './components/Catalog';
import ProductCard from './components/ProductCard';
import ContactForm from './components/ContactForm';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import Blog from './components/Blog';
import Events from './components/Events';
import FloatingChat from './components/FloatingChat';
import { PRODUCTS, BLOG_POSTS, EQUINE_EVENTS } from './constants';
import { Product, CartItem, Currency, Language, BlogPost, EquineEvent } from './types';
import { getExchangeRates, translateContentBatch } from './services/geminiService';
import { getAllImages, saveImage } from './services/dbService';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // Global Settings
  const [currency, setCurrency] = useState<Currency>({ code: 'PLN', symbol: 'zł', label: 'Polish Zloty' });
  const [language, setLanguage] = useState<Language>({ code: 'en', name: 'English', flag: '🇬🇧' });
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({ PLN: 1 });
  const [isSyncing, setIsSyncing] = useState(false);

  // Persistence Registry for AI Assets - Initialized as empty, populated via IndexedDB
  const [customImages, setCustomImages] = useState<Record<string, string>>({});

  // Base Content State (Linguistic versions)
  const [baseProducts, setBaseProducts] = useState<Product[]>(PRODUCTS);
  const [baseBlogs, setBaseBlogs] = useState<BlogPost[]>(BLOG_POSTS);
  const [baseEvents, setBaseEvents] = useState<EquineEvent[]>(EQUINE_EVENTS);

  // Persistence Load (IndexedDB is async)
  useEffect(() => {
    const loadImages = async () => {
      try {
        const storedImages = await getAllImages();
        setCustomImages(storedImages);
      } catch (err) {
        console.error("Failed to load images from IndexedDB", err);
      }
    };
    loadImages();
  }, []);

  /**
   * THE UNIFIED CONTENT ENGINE
   * This useMemo ensures that whenever customImages OR the linguistic base content changes,
   * the final 'translated' version displayed to the user is immediately updated.
   */
  const translatedProducts = useMemo(() => 
    baseProducts.map(p => ({ ...p, image: customImages[p.id] || p.image })), 
  [baseProducts, customImages]);

  const translatedBlogs = useMemo(() => 
    baseBlogs.map(b => ({ ...b, image: customImages[b.id] || b.image })), 
  [baseBlogs, customImages]);

  const translatedEvents = useMemo(() => 
    baseEvents.map(e => ({ ...e, image: customImages[e.id] || e.image })), 
  [baseEvents, customImages]);

  // Global Image Update Handler - Triggers immediate state update and async DB save
  const handleUpdateImage = async (id: string, newImage: string) => {
    // 1. Update State Immediately for instant UI response
    setCustomImages(prev => ({ ...prev, [id]: newImage }));
    
    // 2. Persist to IndexedDB in background
    try {
      await saveImage(id, newImage);
    } catch (err) {
      console.error("Failed to save image to IndexedDB", err);
    }
  };

  // Translation Sync Logic
  useEffect(() => {
    const syncLinguistics = async () => {
      if (language.code === 'en') {
        setBaseProducts(PRODUCTS);
        setBaseBlogs(BLOG_POSTS);
        setBaseEvents(EQUINE_EVENTS);
        return;
      }

      setIsSyncing(true);
      try {
        const [pBatch, bBatch, eBatch] = await Promise.all([
          translateContentBatch(PRODUCTS.slice(0, 12), language.name, 'product'),
          translateContentBatch(BLOG_POSTS.slice(0, 10), language.name, 'blog'),
          translateContentBatch(EQUINE_EVENTS.slice(0, 10), language.name, 'event')
        ]);

        setBaseProducts(pBatch);
        setBaseBlogs(bBatch);
        setBaseEvents(eBatch);
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

  const renderContent = () => {
    switch (currentPage) {
      case 'home':
        return (
          <>
            <Hero onStart={() => setCurrentPage('advisor')} onUpdateImage={handleUpdateImage} currentImage={customImages['hero_bg']} />
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
                      onUpdateImage={handleUpdateImage}
                      formatPrice={formatPrice}
                    />
                  ))}
                </div>
              </div>
            </section>
          </>
        );
      case 'advisor':
        return <AIDietConsultant onSelectProduct={handleProductSelect} onAddToCart={addToCart} onUpdateProductImage={handleUpdateImage} formatPrice={formatPrice} products={translatedProducts} />;
      case 'catalog':
        return <Catalog onSelectProduct={handleProductSelect} onAddToCart={addToCart} onUpdateProductImage={handleUpdateImage} formatPrice={formatPrice} products={translatedProducts} />;
      case 'events':
        return <Events events={translatedEvents} onUpdateImage={handleUpdateImage} />;
      case 'blog':
        return <Blog blogs={translatedBlogs} onUpdateImage={handleUpdateImage} />;
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
            onUpdateImage={handleUpdateImage}
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
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-16">
          <div className="col-span-2">
            <h2 className="text-4xl font-bold text-white mb-6">Nobel Spirit® Labs</h2>
            <p className="text-stone-500 leading-relaxed italic font-serif text-lg">
              International benchmark for equine performance bio-technology. Our lab-verified molecular nutrition protocols are engineering victory for the world's elite sport horse community.
            </p>
          </div>
          <div>
            <h4 className="text-white text-[10px] font-black uppercase tracking-widest mb-6">Archive Access</h4>
            <ul className="space-y-4 text-xs font-bold uppercase tracking-widest">
              <li><button onClick={() => setCurrentPage('catalog')} className="hover:text-gold-500 transition-colors">Molecular Catalog</button></li>
              <li><button onClick={() => setCurrentPage('blog')} className="hover:text-gold-500 transition-colors">Research Repository</button></li>
              <li><button onClick={() => setCurrentPage('events')} className="hover:text-gold-500 transition-colors">Global Events</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-[10px] font-black uppercase tracking-widest mb-6">Legal Metadata</h4>
            <ul className="space-y-4 text-xs font-bold uppercase tracking-widest">
              <li>Privacy Protocol</li>
              <li>Terms of Logistics</li>
              <li>Lab Certifications</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[10px] font-black uppercase tracking-[0.3em]">
          <span>© 1984-2026 Nobel Spirit® Labs. All rights reserved.</span>
          <div className="flex gap-8 mt-6 md:mt-0">
             <span>Riyadh</span>
             <span>Warsaw</span>
             <span>Dubai</span>
             <span>Kentucky</span>
          </div>
        </div>
      </footer>
      <FloatingChat />
    </div>
  );
};

export default App;
