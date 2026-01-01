
import React, { useState, useMemo, useEffect } from 'react';
import { Product } from '../types';
import ProductCard from './ProductCard';
import { generateProductMockup } from '../services/geminiService';

interface CatalogProps {
  onSelectProduct: (id: string) => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onUpdateProductImage: (id: string, newImage: string) => void;
  formatPrice: (price: number) => string;
  products: Product[];
}

const Catalog: React.FC<CatalogProps> = ({ onSelectProduct, onAddToCart, onUpdateProductImage, formatPrice, products }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [visibleCount, setVisibleCount] = useState(24);
  
  // Mass Synthesis State
  const [isMassSynthesizing, setIsMassSynthesizing] = useState(false);
  const [synthesisProgress, setSynthesisProgress] = useState({ current: 0, total: 0, currentName: '' });
  const [shouldStop, setShouldStop] = useState(false);

  const categories = ['All', 'Performance', 'Digestive', 'Orthopedic', 'Metabolic', 'Grooming'];

  const filteredProducts = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    return products.filter(product => {
      const matchesSearch = !term || 
        product.name.toLowerCase().includes(term) || 
        product.category.toLowerCase().includes(term) ||
        product.formula.toLowerCase().includes(term);
      
      const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, activeCategory, products]);

  const displayedProducts = filteredProducts.slice(0, visibleCount);

  /**
   * AUTO-SYNTHESIS ENGINE (IMMEDIATE MOCKUP MANIFESTATION)
   * Automatically replaces the first 6 placeholder images with branded AI mockups.
   * If a product already has a mockup (data URL), it can pass it as a base for refinement.
   */
  useEffect(() => {
    const autoSynthesizeFirstItems = async () => {
      // Find items that are still using generic Unsplash images
      const targets = displayedProducts.slice(0, 6).filter(p => !p.image.startsWith('data:image'));
      if (targets.length === 0) return;

      console.log(`%c[AUTO-SYNTHESIS] Initiating immediate brand manifestation for ${targets.length} units...`, "color: #D4AF37; font-weight: bold;");

      for (const product of targets) {
        try {
          const mockupUrl = await generateProductMockup(product.name, product.category, 'full', product.image);
          if (mockupUrl) {
            onUpdateProductImage(product.id, mockupUrl);
          }
        } catch (error) {
          console.warn(`Auto-synthesis failed for ${product.id}`);
        }
      }
    };

    const timer = setTimeout(autoSynthesizeFirstItems, 1000);
    return () => clearTimeout(timer);
  }, [displayedProducts.length, onUpdateProductImage]);

  /**
   * THE MASS SYNTHESIS ENGINE
   * Iterates through the entire catalog to generate unique, branded mockups.
   * Uses existing images as base to ensure the brand vision is preserved.
   */
  const handleMassSynthesis = async () => {
    if (isMassSynthesizing) return;
    
    // We synthesize everything that isn't already "Manifested" (data URL)
    // or we can synthesize everything to re-apply the latest "NubaEqui" prompt logic.
    const targets = products.filter(p => !p.image.startsWith('data:image'));
    if (targets.length === 0) {
      if (!confirm("All products are already synthesized. Re-synthesize all units with the new 9.0 Protocol?")) return;
      targets.push(...products);
    }

    setIsMassSynthesizing(true);
    setShouldStop(false);
    setSynthesisProgress({ current: 0, total: targets.length, currentName: targets[0].name });

    for (let i = 0; i < targets.length; i++) {
      if (shouldStop) break;

      const product = targets[i];
      setSynthesisProgress(prev => ({ ...prev, current: i + 1, currentName: product.name }));

      try {
        // ALWAYS pass product.image as baseImage. If it's a data URL, Gemini 2.5 will refine it.
        const mockupUrl = await generateProductMockup(product.name, product.category, 'full', product.image);
        if (mockupUrl) {
          onUpdateProductImage(product.id, mockupUrl);
        }
        // Small delay to prevent API flooding and allow UI updates
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`Synthesis failed for ${product.id}:`, error);
      }
    }

    setIsMassSynthesizing(false);
    setSynthesisProgress({ current: 0, total: 0, currentName: '' });
  };

  const stopSynthesis = () => setShouldStop(true);

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      {/* Mass Synthesis Progress Overlay */}
      {isMassSynthesizing && (
        <div className="fixed inset-0 z-[500] bg-emerald-950/95 backdrop-blur-3xl flex items-center justify-center p-6 animate-in fade-in duration-500">
          <div className="max-w-2xl w-full bg-white rounded-[4rem] p-16 shadow-[0_80px_160px_-40px_rgba(0,0,0,0.5)] border border-white/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-stone-100">
              <div 
                className="h-full bg-[#D4AF37] transition-all duration-1000 ease-out"
                style={{ width: `${(synthesisProgress.current / synthesisProgress.total) * 100}%` }}
              ></div>
            </div>
            
            <div className="text-center">
              <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-10 border border-emerald-100">
                <div className="w-12 h-12 border-4 border-emerald-900/20 border-t-emerald-900 rounded-full animate-spin"></div>
              </div>
              
              <h2 className="text-xs font-black text-[#D4AF37] uppercase tracking-[0.6em] mb-4">Laboratory Batch Protocol</h2>
              <h1 className="text-5xl font-bold text-stone-900 mb-8 tracking-tighter leading-none">
                SYNTHESIZING <br />
                <span className="italic font-serif">ARCHIVE ASSETS</span>
              </h1>
              
              <div className="bg-stone-50 rounded-[2rem] p-8 mb-10 border border-stone-100">
                <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2">Currently Processing</p>
                <p className="text-xl font-bold text-emerald-950 truncate">{synthesisProgress.currentName}</p>
                <div className="mt-6 flex justify-between items-center px-4">
                   <span className="text-[9px] font-black text-stone-300 uppercase tracking-widest">{synthesisProgress.current} Units Complete</span>
                   <span className="text-[9px] font-black text-stone-300 uppercase tracking-widest">{synthesisProgress.total} Units Total</span>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <p className="text-[10px] text-stone-400 font-medium italic mb-4">
                  Molecular rendering is a computationally intensive process. Please remain on this protocol page until synthesis is finalized.
                </p>
                <button 
                  onClick={stopSynthesis}
                  className="mx-auto px-12 py-5 border-2 border-stone-100 text-stone-400 rounded-full text-[10px] font-black uppercase tracking-[0.3em] hover:bg-stone-50 hover:text-red-500 hover:border-red-100 transition-all"
                >
                  Terminate Batch Protocol
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-16">
        <div className="max-w-xl">
          <h2 className="text-xs font-black text-emerald-900 uppercase tracking-[0.4em] mb-4">Laboratory Archives</h2>
          <h1 className="text-6xl font-bold text-stone-900 mb-6 tracking-tighter">Molecular Catalog</h1>
          <p className="text-xl text-stone-500 italic font-serif leading-relaxed">
            Browsing <span className="text-stone-900 font-bold">{filteredProducts.length}</span> verified performance protocols.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto items-center">
          <button 
            onClick={handleMassSynthesis}
            className="flex items-center gap-3 bg-[#D4AF37] text-emerald-950 px-8 py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl group"
          >
            <svg className="w-5 h-5 group-hover:rotate-180 transition-transform duration-1000" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a2 2 0 00-1.96 1.414l-.722 2.166a2 2 0 00.547 2.155l1.638 1.638a2 2 0 002.155.547l2.166-.722a2 2 0 001.414-1.96l-.477-2.387a2 2 0 00-.547-1.022z" /></svg>
            Synthesize Entire Archive
          </button>
          
          <div className="relative flex-grow sm:flex-grow-0">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full sm:w-[320px] pl-12 pr-6 py-4 bg-white border border-stone-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all shadow-sm text-sm font-medium text-stone-800 placeholder:text-stone-400"
              placeholder="Search Archive Reference..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-3 mb-12">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => {
              setActiveCategory(cat);
              setVisibleCount(24);
            }}
            className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${
              activeCategory === cat 
                ? 'bg-emerald-950 text-gold-500 border-emerald-950 shadow-lg' 
                : 'bg-white text-stone-400 border-stone-100 hover:border-emerald-900/20'
            }`}
            style={activeCategory === cat ? { color: '#D4AF37' } : {}}
          >
            {cat}
          </button>
        ))}
      </div>

      {displayedProducts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {displayedProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onClick={onSelectProduct}
                onAddToCart={onAddToCart}
                onUpdateImage={onUpdateProductImage}
                formatPrice={formatPrice}
              />
            ))}
          </div>
          
          {visibleCount < filteredProducts.length && (
            <div className="mt-24 text-center">
              <div className="inline-flex flex-col items-center">
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.3em] mb-6">
                  Showing {visibleCount} of {filteredProducts.length} Results
                </p>
                <button 
                  onClick={() => setVisibleCount(prev => prev + 24)}
                  className="px-12 py-5 bg-emerald-950 text-white rounded-full font-black text-xs uppercase tracking-[0.3em] hover:bg-emerald-900 transition-all shadow-2xl hover:-translate-y-1"
                  style={{ color: '#D4AF37' }}
                >
                  Retrieve Next 24 Formulations
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="py-40 text-center bg-white rounded-[4rem] border border-stone-100 shadow-sm">
          <div className="w-24 h-24 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-8 text-stone-200">
             <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-3xl font-bold text-stone-900 mb-4 tracking-tighter">Null Reference Found</h3>
          <p className="text-stone-500 mb-10 italic font-serif">No products match your specific laboratory query.</p>
          <button 
            onClick={() => { setSearchTerm(''); setActiveCategory('All'); }}
            className="text-emerald-900 font-black text-[10px] uppercase tracking-widest border-b-2 border-emerald-900 pb-1"
          >
            Clear All Archive Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Catalog;
