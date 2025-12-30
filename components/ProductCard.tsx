
import React, { useState } from 'react';
import { Product } from '../types';
import { generateProductMockup } from '../services/geminiService';

interface ProductCardProps {
  product: Product;
  onClick?: (id: string) => void;
  onAddToCart?: (product: Product, quantity: number) => void;
  formatPrice: (price: number) => string;
}

const BenefitIcon: React.FC<{ benefit: string; index: number }> = ({ benefit, index }) => {
  const getIcon = (text: string) => {
    const t = text.toLowerCase();
    if (t.includes('energy') || t.includes('performance') || t.includes('explosive') || t.includes('velocity')) 
      return (
        <g strokeLinecap="round" strokeLinejoin="round">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          <path d="M17 10l2 2m-2-2l2-2" className="opacity-40" />
          <circle cx="12" cy="12" r="10" className="opacity-10" />
        </g>
      );
    if (t.includes('digestive') || t.includes('gastric') || t.includes('shield') || t.includes('protection'))
      return (
        <g strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M9 12l2 2 4-4" className="opacity-60" />
          <path d="M12 7v3" className="opacity-40" />
        </g>
      );
    if (t.includes('joint') || t.includes('orthopedic') || t.includes('synovial') || t.includes('flex') || t.includes('skeletal'))
      return (
        <g strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          <circle cx="12" cy="12" r="2" fill="currentColor" className="opacity-40" />
        </g>
      );
    if (t.includes('purity') || t.includes('lab') || t.includes('science') || t.includes('verified') || t.includes('certified'))
      return (
        <g strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          <path d="M12 6v6l3 3" className="opacity-30" />
          <circle cx="12" cy="12" r="9" className="opacity-10" strokeDasharray="2 4" />
        </g>
      );
    return (
      <g strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 3v3m0 12v3M3 12h3m12 0h3" />
        <path d="M18.36 5.64l-2.12 2.12M7.76 16.24l-2.12 2.12M18.36 18.36l-2.12-2.12M7.76 7.76L5.64 5.64" className="opacity-40" />
      </g>
    );
  };

  const transitionDelay = `${index * 100}ms`;

  return (
    <div 
      className="group/tooltip relative flex items-center justify-center w-12 h-12 rounded-2xl bg-white border border-stone-100 hover:border-[#D4AF37]/50 hover:bg-stone-50 transition-all duration-500 shadow-sm hover:shadow-xl group-hover:scale-105"
      style={{ transitionDelay }}
    >
      <svg className="w-6 h-6" style={{ color: '#D4AF37' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.2">
        {getIcon(benefit)}
      </svg>
      <div className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 opacity-0 group-hover/tooltip:opacity-100 pointer-events-none transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] translate-y-2 group-hover/tooltip:translate-y-0 scale-95 group-hover/tooltip:scale-100 z-[100]">
        <div className="relative bg-emerald-950/98 backdrop-blur-2xl text-white text-[9px] font-black uppercase tracking-[0.3em] px-6 py-3.5 rounded-2xl whitespace-nowrap shadow-[0_30px_70px_rgba(0,0,0,0.5)] border border-white/10">
          <div className="absolute top-0 left-4 right-4 h-[2px] bg-[#D4AF37] opacity-80 rounded-full"></div>
          <span className="flex items-center gap-2">
            <span className="w-1 h-1 bg-[#D4AF37] rounded-full"></span>
            {benefit}
          </span>
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-emerald-950/98"></div>
        </div>
      </div>
    </div>
  );
};

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick, onAddToCart, formatPrice }) => {
  const [imageUrl, setImageUrl] = useState<string>(product.image);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [isScienceExpanded, setIsScienceExpanded] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [showLabMenu, setShowLabMenu] = useState(false);
  const [isShared, setIsShared] = useState(false);

  const getCategoryDisplay = (category: Product['category']) => {
    switch (category) {
      case 'Performance': return { label: 'PERFORMANCE ELITE', color: 'bg-orange-500' };
      case 'Digestive': return { label: 'DIGESTIVE SHIELD', color: 'bg-emerald-600' };
      case 'Orthopedic': return { label: 'ORTHO-MATRIX', color: 'bg-blue-600' };
      case 'Metabolic': return { label: 'METABOLIC CORE', color: 'bg-amber-600' };
      case 'Grooming': return { label: 'GROOMING FINISH', color: 'bg-purple-600' };
      default: return { label: `${(category as string).toUpperCase()} PROTOCOL`, color: 'bg-stone-800' };
    }
  };

  const { label, color } = getCategoryDisplay(product.category);

  const handleGenerateAI = async (variation: 'full' | 'horse' | 'background' = 'full', e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (isGenerating) return;
    setIsGenerating(true);
    setShowLabMenu(false);
    const baseImage = imageUrl.startsWith('data:image') ? imageUrl : undefined;
    const specifics = variation === 'horse' ? 'printed horse artwork' : variation === 'background' ? 'studio lighting' : 'full packshot';
    try {
      const result = await generateProductMockup(product.name, product.category, variation, baseImage, specifics);
      setImageUrl(result);
      setIsGenerated(true);
    } catch (err) {
      console.error(err);
      alert("Laboratory rendering pipeline is currently congested.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `${product.name.replace(/\s+/g, '_')}_Mockup.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareData = {
      title: `Nobel Spirit: ${product.name}`,
      text: `${product.shortDescription}\nPrice: ${formatPrice(product.price)}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share failed');
      }
    } else {
      navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
      setIsShared(true);
      setTimeout(() => setIsShared(false), 2000);
    }
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart({ ...product, image: imageUrl }, 1);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
    }
  };

  return (
    <div className="group relative h-full perspective-[1500px]" onClick={() => onClick && onClick(product.id)}>
      <div className={`bg-white rounded-[3rem] overflow-hidden shadow-sm border border-stone-100 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] flex flex-col h-full cursor-pointer transform-gpu group-hover:[transform:rotateY(4deg)_rotateX(-2deg)_translateZ(30px)] group-hover:shadow-[0_50px_100px_-30px_rgba(6,78,59,0.2)] group-hover:border-[#D4AF37]/20 ${justAdded ? 'ring-2 ring-emerald-500/30' : ''}`}>
        <div className="relative h-80 overflow-hidden shrink-0 bg-stone-100/30">
          <div className={`absolute top-5 right-5 z-[60] transition-all duration-500 flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-2xl shadow-xl border border-white/20 pointer-events-none ${justAdded ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-4 scale-75'}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>
            <span className="text-[9px] font-black uppercase tracking-[0.2em]">Allocated</span>
          </div>

          {isGenerating && (
            <div className="absolute inset-0 z-40 bg-emerald-950/80 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
              <div className="w-16 h-16 border-4 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin mb-6"></div>
              <p className="text-[12px] font-black text-white uppercase tracking-[0.4em] animate-pulse">Synthesizing Vision</p>
            </div>
          )}
          
          <img src={imageUrl} alt={product.name} className={`w-full h-full object-cover transition-all duration-1000 ${isGenerating ? 'scale-110 blur-2xl opacity-30' : 'group-hover:scale-105 opacity-100'}`} />

          <div className="absolute top-5 left-5 z-20">
            <span className={`${color} backdrop-blur-md bg-opacity-90 px-5 py-2 rounded-2xl text-[8px] font-black tracking-[0.3em] text-white shadow-lg border border-white/10`}>{label}</span>
          </div>

          <div className="absolute top-5 right-5 z-40 flex flex-col items-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
            <button 
              onClick={handleShare}
              className={`p-3 rounded-2xl shadow-xl border border-stone-100 hover:scale-110 active:scale-95 transition-all ${isShared ? 'bg-emerald-500 text-white' : 'bg-white/95 backdrop-blur text-emerald-950'}`}
              title="Share Protocol Information"
            >
              {isShared ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
              )}
            </button>
            {isGenerated && (
              <button onClick={handleDownload} className="bg-white/95 backdrop-blur text-emerald-950 p-3 rounded-2xl shadow-xl border border-stone-100 hover:scale-110 active:scale-95 transition-all" title="Download Visualization">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              </button>
            )}
            <button onClick={(e) => { e.stopPropagation(); setShowLabMenu(!showLabMenu); }} className={`p-3 rounded-2xl shadow-xl transition-all hover:scale-110 ${showLabMenu ? 'bg-emerald-950 text-white' : 'bg-white/95 text-emerald-950 border border-stone-100'}`}>
              <svg className={`w-5 h-5 transition-transform duration-700 ${showLabMenu ? 'rotate-180' : ''}`} style={{ color: '#D4AF37' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a2 2 0 00-1.96 1.414l-.722 2.166a2 2 0 00.547 2.155l1.638 1.638a2 2 0 002.155.547l2.166-.722a2 2 0 001.414-1.96l-.477-2.387a2 2 0 00-.547-1.022z" /></svg>
            </button>
            {showLabMenu && (
              <div className="bg-white/98 backdrop-blur-xl rounded-2xl shadow-2xl border border-stone-100 p-3 min-w-[200px] animate-in slide-in-from-top-4 duration-500 z-50">
                <p className="px-4 py-2 text-[9px] font-black text-stone-300 uppercase tracking-widest border-b border-stone-50 mb-1">Redesign Protocols</p>
                {['Full Redesign', 'Horse Subject', 'Studio Light'].map((v, i) => (
                  <button key={v} onClick={(e) => handleGenerateAI(i === 0 ? 'full' : i === 1 ? 'horse' : 'background', e)} className="w-full text-left px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest text-emerald-950 hover:bg-stone-50 transition-all">{v}</button>
                ))}
              </div>
            )}
          </div>
          
          <div className="absolute inset-0 bg-emerald-950/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-[2px]">
            <button onClick={handleQuickAdd} disabled={justAdded} className={`px-10 py-5 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.4em] shadow-2xl transform translate-y-8 group-hover:translate-y-0 transition-all duration-700 ${justAdded ? 'bg-emerald-500 text-white scale-105' : 'bg-white text-emerald-950 hover:scale-105 active:scale-95'}`}>
              {justAdded ? 'Allocation Confirmed' : 'Initiate Allocation'}
            </button>
          </div>
        </div>
        
        <div className="p-10 flex flex-col flex-grow">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-stone-900 mb-2 leading-tight tracking-tighter">{product.name}</h3>
            <div className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full animate-pulse"></span><p className="text-emerald-900 text-[9px] font-black uppercase tracking-[0.5em] opacity-80" style={{color: '#D4AF37'}}>Molecular Tier</p></div>
          </div>
          <p className="text-stone-500 text-[15px] mb-8 line-clamp-2 italic font-serif leading-relaxed">"{product.shortDescription}"</p>
          <div className="mb-10">
            <h4 className="text-[9px] font-black text-stone-400 uppercase tracking-[0.3em] mb-4 flex items-center gap-3">Diagnostic Summary<div className="h-[1px] flex-grow bg-stone-100"></div></h4>
            <div className="flex gap-4">{product.benefits.slice(0, 4).map((benefit, i) => (<BenefitIcon key={i} benefit={benefit} index={i} />))}</div>
          </div>
          <div className="mb-10 pt-6 border-t border-stone-50">
            <button onClick={(e) => { e.stopPropagation(); setIsScienceExpanded(!isScienceExpanded); }} className="flex items-center justify-between w-full group/btn">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-900 group-hover/btn:text-[#D4AF37] transition-colors">Lab Methodology</span>
              <div className={`w-8 h-8 rounded-xl border border-stone-100 flex items-center justify-center transition-all ${isScienceExpanded ? 'bg-emerald-950 text-white border-emerald-950' : 'bg-white group-hover/btn:border-[#D4AF37]'}`}>
                <svg className={`w-3 h-3 transition-transform duration-500 ${isScienceExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </button>
            {isScienceExpanded && (
              <div className="mt-4 p-6 bg-stone-50 rounded-2xl border border-stone-100 text-[11px] text-stone-600 italic font-serif leading-relaxed animate-in slide-in-from-top-2 duration-500">{product.scienceNote}</div>
            )}
          </div>
          <div className="pt-8 border-t border-stone-100 mt-auto flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-stone-300 uppercase tracking-widest mb-1">Archive Value</span>
              <span className="text-3xl font-bold text-stone-900 tracking-tighter">{formatPrice(product.price)}</span>
            </div>
            <button onClick={handleQuickAdd} disabled={justAdded} className={`w-14 h-14 rounded-2xl shadow-xl transition-all flex items-center justify-center border border-stone-100 active:scale-95 ${justAdded ? 'bg-emerald-500 text-white' : 'bg-emerald-950 text-[#D4AF37] hover:bg-emerald-900'}`} title="Add to Protocol">
              {justAdded ? (<svg className="w-6 h-6 animate-in zoom-in duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>) : (<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v12m6-6H6" /></svg>)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
