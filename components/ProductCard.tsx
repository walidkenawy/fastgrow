
import React, { useState } from 'react';
import { Product } from '../types';
import { generateProductMockup } from '../services/geminiService';

interface ProductCardProps {
  product: Product;
  onClick?: (id: string) => void;
  onAddToCart?: (product: Product, quantity: number) => void;
  onUpdateImage?: (id: string, newImage: string) => void;
  formatPrice: (price: number) => string;
}

const BenefitIcon: React.FC<{ benefit: string; index: number }> = ({ benefit, index }) => {
  const getIcon = (text: string) => {
    const t = text.toLowerCase();
    if (t.includes('energy') || t.includes('muscle')) return <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />;
    if (t.includes('digestive') || t.includes('gut')) return <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />;
    return <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751A11.959 11.959 0 0112 2.714z" />;
  };

  return (
    <div className="relative group/benefit flex items-center justify-center w-8 h-8 rounded-lg bg-stone-50 border border-stone-100">
      <svg className="w-4 h-4 text-emerald-950" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">{getIcon(benefit)}</svg>
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-emerald-950 text-white text-[8px] font-black uppercase tracking-widest rounded opacity-0 group-hover/benefit:opacity-100 transition-all pointer-events-none whitespace-nowrap z-50">
        {benefit}
      </div>
    </div>
  );
};

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick, onAddToCart, onUpdateImage, formatPrice }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const handleSynthesizeMockup = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isGenerating || !onUpdateImage) return;
    setIsGenerating(true);
    try {
      // Use the current product image as a base for the AI to "brand" it
      const result = await generateProductMockup(product.name, product.category, 'full', product.image);
      if (result) onUpdateImage(product.id, result); 
    } catch (err) {
      console.error("Synthesis failed:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product, 1);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
    }
  };

  return (
    <div 
      className="group bg-white rounded-[2.5rem] overflow-hidden border border-stone-100 shadow-sm hover:shadow-2xl transition-all duration-700 cursor-pointer flex flex-col h-full" 
      onClick={() => onClick && onClick(product.id)}
    >
      <div className="relative h-[380px] bg-white overflow-hidden p-6">
        {isGenerating && (
          <div className="absolute inset-0 z-40 bg-white/95 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300">
            <div className="w-10 h-10 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-[9px] font-black text-emerald-950 uppercase tracking-[0.3em] animate-pulse">Rendering Brand Identity</p>
          </div>
        )}

        <img src={product.image} className={`w-full h-full object-contain transition-all duration-1000 ${isGenerating ? 'blur-xl opacity-30' : 'group-hover:scale-110'}`} />

        <div className="absolute top-4 left-4 z-40 opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-x-4 group-hover:translate-x-0">
          <button 
            onClick={handleSynthesizeMockup}
            className="px-5 py-3 bg-emerald-950 text-[#D4AF37] rounded-xl shadow-2xl transition-all hover:scale-105 border border-emerald-900 flex items-center gap-3 active:scale-95"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a2 2 0 00-1.96 1.414l-.722 2.166a2 2 0 00.547 2.155l1.638 1.638a2 2 0 002.155.547l2.166-.722a2 2 0 001.414-1.96l-.477-2.387a2 2 0 00-.547-1.022z" strokeWidth="2" /></svg>
            <span className="text-[9px] font-black uppercase tracking-widest">Manifest Brand</span>
          </button>
        </div>
      </div>
      
      <div className="p-10 pt-0 flex flex-col flex-grow">
        <div className="mb-4">
          <span className="text-[9px] font-black text-emerald-900 uppercase tracking-widest mb-1 block opacity-60">{product.category} Protocol</span>
          <h3 className="text-2xl font-bold text-stone-900 tracking-tight leading-none">{product.name}</h3>
        </div>
        <p className="text-stone-500 text-xs mb-8 italic font-serif leading-relaxed line-clamp-2">{product.shortDescription}</p>
        
        <div className="flex gap-2 mb-8">
          {product.benefits.slice(0, 3).map((b, i) => (
            <BenefitIcon key={i} benefit={b} index={i} />
          ))}
        </div>

        <div className="mt-auto pt-8 border-t border-stone-50 flex items-center justify-between">
          <span className="text-2xl font-black text-stone-900 tracking-tighter">{formatPrice(product.price)}</span>
          <button 
            onClick={handleQuickAdd} 
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${justAdded ? 'bg-emerald-500 text-white' : 'bg-stone-50 text-emerald-950 hover:bg-[#D4AF37]/20 shadow-sm'}`}
          >
            {justAdded ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeWidth="3"/></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 6v12m6-6H6" strokeWidth="2.5"/></svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
