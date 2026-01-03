
import React, { useState, useMemo, useEffect } from 'react';
import { Product } from '../types';
import ProductCard from './ProductCard';
import { generateProductMockup } from '../services/geminiService';
import { downloadCSV } from '../services/csvService';
import { clearImages } from '../services/dbService';

interface CatalogProps {
  onSelectProduct: (id: string) => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onUpdateProductImage: (id: string, newImage: string) => void;
  onInquiry?: (product: Product) => void;
  formatPrice: (price: number) => string;
  products: Product[];
}

const Catalog: React.FC<CatalogProps> = ({ onSelectProduct, onAddToCart, onUpdateProductImage, onInquiry, formatPrice, products }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [visibleCount, setVisibleCount] = useState(24);
  
  const [isRestoring, setIsRestoring] = useState(false);
  const [restorationProgress, setRestorationProgress] = useState({ current: 0, total: 0, currentName: '', phase: 'Initializing' });
  const [shouldStop, setShouldStop] = useState(false);
  const [quotaError, setQuotaError] = useState<string | null>(null);

  const categories = ['All', 'Performance', 'Digestive', 'Orthopedic', 'Metabolic', 'Grooming'];

  const filteredProducts = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    return products.filter(product => {
      const matchesSearch = !term || 
        product.name.toLowerCase().includes(term) || 
        product.category.toLowerCase().includes(term);
      const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, activeCategory, products]);

  const displayedProducts = filteredProducts.slice(0, visibleCount);

  const synthesizedCount = useMemo(() => {
    return products.filter(p => p.image.startsWith('data:image')).length;
  }, [products]);

  /**
   * SILENT INTEGRITY CHECK
   * Triggers a small recovery task for the items currently on screen.
   */
  useEffect(() => {
    const integrityCheck = async () => {
      if (isRestoring) return;
      
      const missingInView = displayedProducts.filter(p => !p.image.startsWith('data:image'));
      if (missingInView.length === 0) return;

      // Small background batch (max 4 at a time to stay under quota)
      for (const product of missingInView.slice(0, 4)) {
        if (shouldStop) break;
        try {
          const mockupUrl = await generateProductMockup(product.name, product.category, 'full', product.image);
          if (mockupUrl) onUpdateProductImage(product.id, mockupUrl);
          await new Promise(res => setTimeout(res, 6000));
        } catch (error: any) {
          if (error?.message?.includes('DAILY_QUOTA')) break;
        }
      }
    };

    const timer = setTimeout(integrityCheck, 3500);
    return () => clearTimeout(timer);
  }, [displayedProducts.length, activeCategory, onUpdateProductImage, isRestoring]);

  /**
   * MASTER RESTORATION PROTOCOL
   * Systematically recovers every missing image in the project.
   */
  const handleMasterRestoration = async () => {
    if (isRestoring) return;
    
    const targets = products.filter(p => !p.image.startsWith('data:image'));
    if (targets.length === 0) {
      alert("Visual Integrity 100%. All Laboratory Archives are fully restored.");
      return;
    }

    setIsRestoring(true);
    setShouldStop(false);
    setQuotaError(null);
    setRestorationProgress({ current: 0, total: targets.length, currentName: targets[0].name, phase: 'Phase 1: Flagship Recovery' });

    for (let i = 0; i < targets.length; i++) {
      if (shouldStop) break;
      const product = targets[i];
      
      // Update phase name
      const phaseName = i < 24 ? 'Phase 1: Flagship Recovery' : 'Phase 2: Bulk Archive Sync';
      
      setRestorationProgress(prev => ({ 
        ...prev, 
        current: i + 1, 
        currentName: product.name,
        phase: phaseName
      }));
      
      try {
        const mockupUrl = await generateProductMockup(product.name, product.category, 'full', product.image);
        if (mockupUrl) onUpdateProductImage(product.id, mockupUrl);
        
        // Throttling logic: slower for first few to ensure quality, then slightly faster
        const delay = i < 10 ? 9000 : 7000;
        await new Promise(resolve => setTimeout(resolve, delay));
      } catch (error: any) {
        if (error?.message?.includes('DAILY_QUOTA')) {
          setQuotaError("Protocol Paused: Daily Gemini API Quota Reached. Stored visuals are safe in the Lab Vault.");
          break;
        }
        console.error(`Restoration failed for ${product.id}:`, error);
        await new Promise(resolve => setTimeout(resolve, 15000)); 
      }
    }
    setIsRestoring(false);
  };

  /**
   * MASTER RESET (WIPE)
   */
  const handleWipeAndRestore = async () => {
    const confirmed = window.confirm("WARNING: This will purge ALL generated images from the local database and restart the Restoration Protocol from scratch. Continue?");
    if (!confirmed) return;
    
    await clearImages();
    window.location.reload();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      {/* RESTORATION OVERLAY */}
      {isRestoring && (
        <div className="fixed inset-0 z-[600] bg-emerald-950/98 backdrop-blur-3xl flex items-center justify-center p-6">
          <div className="max-w-3xl w-full bg-white rounded-[4rem] p-16 shadow-[0_100px_200px_rgba(0,0,0,0.6)] relative border border-[#D4AF37]/40 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-4 bg-stone-100 overflow-hidden rounded-t-[4rem]">
              <div 
                className="h-full bg-gradient-to-r from-emerald-900 via-[#D4AF37] to-emerald-900 transition-all duration-[2500ms] ease-in-out shadow-[0_0_20px_#D4AF37]"
                style={{ width: `${(restorationProgress.current / restorationProgress.total) * 100}%` }}
              ></div>
            </div>
            
            <div className="text-center">
              <div className="w-28 h-28 bg-emerald-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-inner relative">
                <svg className="w-14 h-14 text-emerald-900 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeWidth="2" /></svg>
                <div className="absolute -bottom-2 -right-2 bg-emerald-500 w-6 h-6 rounded-full border-4 border-white animate-ping"></div>
              </div>
              
              <h2 className="text-xs font-black text-[#D4AF37] uppercase tracking-[1em] mb-4">Laboratory System Restore</h2>
              <h1 className="text-6xl font-bold text-stone-900 mb-10 tracking-tighter">RECOVERING <br/>ARCHIVES</h1>
              
              <div className="mb-12 p-10 bg-stone-50 rounded-[3rem] border border-stone-200">
                <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-3">{restorationProgress.phase}</p>
                <p className="text-2xl font-bold text-emerald-950 truncate px-4">{restorationProgress.currentName}</p>
                
                <div className="mt-10 flex justify-center items-center gap-16">
                   <div className="text-center">
                     <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mb-1">Restored</p>
                     <p className="text-4xl font-black text-emerald-950">{restorationProgress.current}</p>
                   </div>
                   <div className="h-16 w-px bg-stone-200"></div>
                   <div className="text-center">
                     <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mb-1">Integrity Gap</p>
                     <p className="text-4xl font-black text-[#D4AF37]">{restorationProgress.total - restorationProgress.current}</p>
                   </div>
                </div>
              </div>

              {quotaError ? (
                <div className="bg-red-50 p-10 rounded-[2.5rem] border border-red-200 mb-10">
                   <p className="text-red-700 font-bold text-sm leading-relaxed italic font-serif mb-6">"{quotaError}"</p>
                   <button onClick={() => setIsRestoring(false)} className="px-12 py-5 bg-red-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">Close Command Center</button>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  <div className="flex items-center justify-center gap-4 text-emerald-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                    <p className="text-[10px] font-black uppercase tracking-[0.5em]">Global Restructuring Active</p>
                  </div>
                  <button onClick={() => setShouldStop(true)} className="px-12 py-5 border-2 border-stone-200 text-stone-400 rounded-full text-[10px] font-black uppercase tracking-widest hover:text-red-600 hover:border-red-100 transition-all">
                    Abort Restoration
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-24">
        <div>
          <h2 className="text-xs font-black text-emerald-900 uppercase tracking-[0.5em] mb-6 flex items-center gap-4">
             Archive Command
             <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          </h2>
          <h1 className="text-[7rem] font-bold text-stone-900 mb-8 tracking-tighter leading-[0.85]">Visual <br/><span className="text-[#D4AF37] italic font-serif">Integrity</span></h1>
          
          <div className="flex items-center gap-8 mt-6">
             <div className="bg-white px-8 py-5 rounded-[2rem] border border-stone-100 shadow-sm flex items-center gap-5">
                <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]"></div>
                <div>
                  <p className="text-[10px] font-black text-emerald-950 uppercase tracking-widest">{synthesizedCount} Protocols Synced</p>
                  <p className="text-[9px] text-stone-400 font-bold uppercase tracking-widest">Molecular Integrity Stable</p>
                </div>
             </div>
             <div className="bg-white px-8 py-5 rounded-[2rem] border border-stone-100 shadow-sm flex items-center gap-5">
                <div className={`w-3 h-3 rounded-full ${products.length - synthesizedCount === 0 ? 'bg-emerald-500' : 'bg-[#D4AF37] animate-pulse shadow-[0_0_10px_#D4AF37]'}`}></div>
                <div>
                  <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">{products.length - synthesizedCount} Awaiting Restoration</p>
                  <p className="text-[9px] text-stone-400 font-bold uppercase tracking-widest">Dossier Gap Detected</p>
                </div>
             </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-6">
          <button 
            onClick={handleWipeAndRestore}
            className="bg-white border-2 border-stone-100 text-stone-400 px-10 py-6 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all shadow-md active:scale-95"
          >
             Purge Local Cache
          </button>
          <button 
            onClick={handleMasterRestoration} 
            disabled={isRestoring}
            className="bg-emerald-950 text-[#D4AF37] px-16 py-8 rounded-full font-black text-xs uppercase tracking-[0.5em] hover:scale-105 transition-all shadow-[0_30px_60px_rgba(6,78,59,0.4)] active:scale-95 disabled:opacity-50 border border-emerald-900"
          >
            Restore Visual Archive
          </button>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-wrap gap-4 mb-20 bg-white/70 backdrop-blur-3xl p-6 rounded-[3.5rem] border border-stone-100 w-fit shadow-2xl">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => {
              setActiveCategory(cat);
              setQuotaError(null);
            }}
            className={`px-12 py-5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeCategory === cat ? 'bg-emerald-950 text-[#D4AF37] shadow-xl scale-110' : 'bg-transparent text-stone-400 hover:text-emerald-950'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ERROR MESSAGE */}
      {quotaError && !isRestoring && (
        <div className="mb-20 p-12 bg-orange-50 rounded-[4rem] border-2 border-orange-200 flex items-center gap-12 animate-in slide-in-from-top-10 shadow-2xl">
          <div className="w-20 h-20 bg-orange-500 rounded-[2.5rem] flex items-center justify-center shrink-0 shadow-[0_20px_40px_rgba(249,115,22,0.4)]">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeWidth="2.5"/></svg>
          </div>
          <div>
            <p className="text-2xl font-black text-orange-950 uppercase tracking-widest mb-2">Restoration Throttled: Quota Check</p>
            <p className="text-lg font-bold text-orange-800 italic font-serif leading-relaxed max-w-4xl">
              The Gemini API Daily Protocol Limit has been reached. Stored mockups are safely archived in the Lab Vault. Restoration sequence will automatically resume in the next cycle.
            </p>
          </div>
        </div>
      )}

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-16">
        {displayedProducts.map(product => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onClick={onSelectProduct}
            onAddToCart={onAddToCart}
            onUpdateImage={onUpdateProductImage}
            onInquiry={onInquiry}
            formatPrice={formatPrice}
          />
        ))}
      </div>
      
      {/* LOAD MORE */}
      {visibleCount < filteredProducts.length && (
        <div className="mt-48 text-center pb-32">
          <button onClick={() => setVisibleCount(v => v + 24)} className="px-28 py-12 bg-emerald-950 text-[#D4AF37] rounded-full font-black text-sm uppercase tracking-[0.7em] shadow-[0_50px_100px_rgba(6,78,59,0.3)] hover:scale-110 transition-all active:scale-95 border border-emerald-900 group">
            Access Deep Archive Layers
            <span className="block text-[10px] opacity-40 mt-3 group-hover:opacity-80 transition-opacity">Decrypting Further Protocols...</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Catalog;
