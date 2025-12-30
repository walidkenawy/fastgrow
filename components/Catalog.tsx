
import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import ProductCard from './ProductCard';

interface CatalogProps {
  onSelectProduct: (id: string) => void;
  onAddToCart: (product: Product, quantity: number) => void;
  formatPrice: (price: number) => string;
  products: Product[];
}

const Catalog: React.FC<CatalogProps> = ({ onSelectProduct, onAddToCart, formatPrice, products }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [visibleCount, setVisibleCount] = useState(24);

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

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-16">
        <div className="max-w-xl">
          <h2 className="text-xs font-black text-emerald-900 uppercase tracking-[0.4em] mb-4">Laboratory Archives</h2>
          <h1 className="text-6xl font-bold text-stone-900 mb-6 tracking-tighter">Molecular Catalog</h1>
          <p className="text-xl text-stone-500 italic font-serif leading-relaxed">
            Browsing <span className="text-stone-900 font-bold">{filteredProducts.length}</span> of <span className="text-stone-900 font-bold">{products.length}</span> verified performance protocols.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          <div className="relative flex-grow">
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
