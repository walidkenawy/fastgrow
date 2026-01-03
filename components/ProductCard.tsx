
import React, { useState } from 'react';
import { Product } from '../types';
import { generateProductMockup } from '../services/geminiService';

interface ProductCardProps {
  product: Product;
  onClick?: (id: string) => void;
  onAddToCart?: (product: Product, quantity: number) => void;
  onInquiry?: (product: Product) => void;
  onUpdateImage?: (id: string, newImage: string) => void;
  formatPrice: (price: number) => string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick, onAddToCart, onInquiry, onUpdateImage, formatPrice }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product, quantity);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
    }
  };

  const handleInquiry = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onInquiry) {
      onInquiry(product);
    }
  };

  const handleRedesign = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onUpdateImage || isGenerating) return;
    setIsGenerating(true);
    try {
      const mockupUrl = await generateProductMockup(product.name, product.category, 'full', product.image);
      if (mockupUrl) {
        onUpdateImage(product.id, mockupUrl);
      }
    } catch (error) {
      console.error("Mockup generation failed", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const shareUrl = window.location.href;
  const shareText = `Check out the ${product.name} protocol from Nobel Spirit Labs!`;

  const socialLinks = [
    { name: 'FB', url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, color: '#1877F2' },
    { name: 'X', url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, color: '#000000' },
    { name: 'IG', url: `https://www.instagram.com/`, color: '#E4405F' },
  ];

  return (
    <div className="group bg-white rounded-[2.5rem] overflow-hidden border border-stone-100 shadow-sm hover:shadow-2xl transition-all duration-700 cursor-pointer flex flex-col h-full" onClick={() => onClick && onClick(product.id)}>
      <div className="relative h-[320px] bg-white overflow-hidden p-6">
        {isGenerating && (
          <div className="absolute inset-0 z-40 bg-white/95 flex flex-col items-center justify-center p-8 text-center animate-pulse">
            <div className="w-10 h-10 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-[9px] font-black text-emerald-950 uppercase tracking-widest">Synthesizing Protocol</p>
          </div>
        )}
        <img src={product.image} className="w-full h-full object-contain transition-all duration-1000 group-hover:scale-110" alt={product.name} />
        
        {/* Redesign Trigger */}
        <button 
          onClick={handleRedesign}
          disabled={isGenerating}
          className="absolute top-4 right-4 bg-white/80 backdrop-blur shadow-md p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#D4AF37] hover:text-white"
          title="Regenerate Visual"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
        </button>
      </div>
      
      <div className="p-8 flex flex-col flex-grow">
        <div className="mb-4">
          <span className="text-[9px] font-black text-emerald-900 uppercase tracking-widest opacity-60">{product.category} Protocol</span>
          <h3 className="text-xl font-bold text-stone-900 tracking-tight leading-none">{product.name}</h3>
        </div>
        
        <p className="text-stone-500 text-xs mb-4 italic font-serif line-clamp-2">{product.shortDescription}</p>

        {/* Why Nobel Spirit Section */}
        <div className="mb-6 p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100/30">
          <h4 className="text-[9px] font-black text-emerald-900 uppercase tracking-widest mb-2 flex items-center gap-2">
            <span className="w-1 h-1 bg-emerald-500 rounded-full"></span>
            Why Nobel Spirit?
          </h4>
          <p className="text-[10px] text-stone-600 font-medium leading-relaxed italic">
            Molecularly stable, lab-verified potency, and 98% biological availability within 120 minutes.
          </p>
        </div>

        {/* Social Share Icons */}
        <div className="mb-8 flex items-center gap-3" onClick={e => e.stopPropagation()}>
          <span className="text-[8px] font-black text-stone-400 uppercase tracking-widest">Share Protocol:</span>
          {socialLinks.map(link => (
            <a 
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white transition-transform hover:scale-110 shadow-sm"
              style={{ backgroundColor: link.color }}
            >
              <span className="text-[9px] font-black">{link.name}</span>
            </a>
          ))}
        </div>
        
        <div className="mt-auto space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xl font-black text-stone-900 tracking-tighter">{formatPrice(product.price)}</span>
            <div className="flex items-center bg-stone-50 rounded-xl px-2 py-1 border border-stone-100" onClick={e => e.stopPropagation()}>
              <button onClick={() => setQuantity(q => Math.max(1, q-1))} className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg transition-all">-</button>
              <span className="px-4 text-xs font-black">{quantity}</span>
              <button onClick={() => setQuantity(q => q+1)} className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg transition-all">+</button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            <button 
              onClick={handleQuickAdd} 
              className={`w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl ${justAdded ? 'bg-emerald-500 text-white' : 'bg-emerald-950 text-[#D4AF37] hover:brightness-110'}`}
            >
              {justAdded ? 'Batch Allocated ✓' : 'Reserve Protocol'}
            </button>
            <button 
              onClick={handleInquiry}
              className="w-full py-3 rounded-xl text-[9px] font-black uppercase tracking-widest border border-stone-200 text-stone-500 hover:bg-stone-50 transition-all"
            >
              Contact for Price
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
