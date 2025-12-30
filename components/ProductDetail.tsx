
import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { generateProductMockup, getProductIntelligence } from '../services/geminiService';
import IntelligenceDrawer from './IntelligenceDrawer';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  formatPrice: (price: number) => string;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onBack, onAddToCart, formatPrice }) => {
  const [displayImage, setDisplayImage] = useState(product.image);
  const [isGenerating, setIsGenerating] = useState(false);
  const [genType, setGenType] = useState<'full' | 'horse' | 'background'>('full');
  const [addedNotify, setAddedNotify] = useState(false);
  const [fadeKey, setFadeKey] = useState(0);
  const [showLabMenu, setShowLabMenu] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isGenerated, setIsGenerated] = useState(false);
  const [expandedIng, setExpandedIng] = useState<number | null>(null);
  const [isShared, setIsShared] = useState(false);
  
  // Intelligence State
  const [isIntelligenceOpen, setIsIntelligenceOpen] = useState(false);
  const [isSyncingIntelligence, setIsSyncingIntelligence] = useState(false);
  const [intelligenceData, setIntelligenceData] = useState<any>(null);

  const [selectedBreed, setSelectedBreed] = useState<string>('Arabian');
  const [selectedLighting, setSelectedLighting] = useState<string>('Soft Diffuse');

  const breeds = ['Arabian', 'Friesian', 'Thoroughbred', 'Andalusian', 'Quarter Horse'];
  const lightingStyles = ['High Contrast', 'Soft Diffuse', 'Luxury Warm', 'Minimalist White'];

  useEffect(() => {
    setDisplayImage(product.image);
    setFadeKey(prev => prev + 1);
    setQuantity(1);
    setIsGenerated(false);
    setExpandedIng(null);
    setIntelligenceData(null);
  }, [product.id, product.image]);

  const handleImageSwap = (newImg: string) => {
    if (newImg === displayImage) return;
    setFadeKey(prev => prev + 1);
    setDisplayImage(newImg);
  };

  const handleGenerateMockup = async (type: 'full' | 'horse' | 'background' = 'full') => {
    setIsGenerating(true);
    setGenType(type);
    const currentBaseImage = displayImage.startsWith('data:image') ? displayImage : undefined;
    const specifics = type === 'horse' 
      ? `printed ${selectedBreed} horse artwork on the bag label` 
      : type === 'background' 
        ? `${selectedLighting} studio lighting and environment` 
        : `full packaging redesign with ${selectedLighting} lighting`;

    try {
      const mockupUrl = await generateProductMockup(product.name, product.category, type, currentBaseImage, specifics);
      handleImageSwap(mockupUrl);
      setIsGenerated(true);
    } catch (error) {
      alert("Laboratory simulation failed. The molecular rendering pipeline is currently congested.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExpandMolecularIntelligence = async () => {
    setIsIntelligenceOpen(true);
    setIsSyncingIntelligence(true);
    try {
      const data = await getProductIntelligence(product);
      setIntelligenceData(data);
    } catch (err) {
      alert("Intelligence sync failed. Please check your uplink.");
      setIsIntelligenceOpen(false);
    } finally {
      setIsSyncingIntelligence(false);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: `Nobel Spirit Protocol: ${product.name}`,
      text: `Reviewing the ${product.name} protocol. ${product.shortDescription}`,
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

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = displayImage;
    link.download = `${product.name.replace(/\s+/g, '_')}_Elite_Mockup.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAdd = () => {
    const finalProduct = isGenerated ? { ...product, image: displayImage } : product;
    onAddToCart(finalProduct, quantity);
    setAddedNotify(true);
    setTimeout(() => setAddedNotify(false), 3000);
  };

  const adjustQuantity = (delta: number) => {
    setQuantity(prev => Math.max(1, prev + delta));
  };

  const galleryImages = Array.from(new Set([product.image, ...(product.gallery || [])])).slice(0, 5);

  return (
    <div className="bg-stone-50 min-h-screen pb-32">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button 
          onClick={onBack}
          className="flex items-center text-stone-400 hover:text-emerald-900 transition-colors mb-12 group uppercase text-[10px] font-black tracking-[0.3em]"
        >
          <svg className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Archives
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
          <div className="space-y-10 lg:sticky lg:top-32">
            <div className="relative aspect-square rounded-[3rem] overflow-hidden shadow-2xl bg-white border-[12px] border-white group">
              {isGenerating && (
                <div className="absolute inset-0 z-40 bg-emerald-950/70 backdrop-blur-md flex flex-col items-center justify-center text-white p-12 text-center">
                  <div className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mb-6"></div>
                  <p className="font-black tracking-[0.3em] uppercase text-[10px] text-[#D4AF37]">
                    {genType === 'horse' ? 'Rendering Subject' : genType === 'background' ? 'Refining Lighting' : 'Synthesizing Protocol'}
                  </p>
                </div>
              )}
              
              <div key={fadeKey} className="w-full h-full animate-in fade-in duration-700">
                <img src={displayImage} alt={product.name} className={`w-full h-full object-cover transition-all duration-700 ${isGenerating ? 'opacity-30 blur-xl scale-105' : 'opacity-100'}`} />
              </div>

              <div className="absolute top-6 right-6 z-30 flex gap-2">
                <button 
                  onClick={handleShare}
                  className={`backdrop-blur p-4 rounded-2xl border border-stone-200 shadow-2xl hover:scale-105 active:scale-95 transition-all ${isShared ? 'bg-emerald-500 text-white' : 'bg-white/95 text-emerald-950'}`}
                  title="Share Information"
                >
                  {isShared ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                  )}
                </button>
                {isGenerated && !isGenerating && (
                  <button onClick={handleDownload} className="bg-white/95 backdrop-blur text-emerald-950 p-4 rounded-2xl border border-stone-200 shadow-2xl hover:scale-105 active:scale-95 transition-all" title="Download Vision Asset">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  </button>
                )}
              </div>
              
              <div className="absolute bottom-6 right-6 z-30 flex flex-col items-end">
                <button onClick={() => setShowLabMenu(!showLabMenu)} disabled={isGenerating} className={`bg-emerald-950 text-white px-8 py-5 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl transition-all active:scale-95 flex items-center gap-4 border border-emerald-800 ${isGenerating ? 'opacity-50' : 'hover:bg-emerald-900'}`}>
                  <span style={{color: '#D4AF37'}}><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a2 2 0 00-1.96 1.414l-.722 2.166a2 2 0 00.547 2.155l1.638 1.638a2 2 0 002.155.547l2.166-.722a2 2 0 001.414-1.96l-.477-2.387a2 2 0 00-.547-1.022z" /></svg></span>
                  {showLabMenu ? 'Exit Lab' : 'AI Mockup Lab'}
                </button>

                {showLabMenu && (
                  <div className="absolute bottom-full right-0 mb-6 bg-white/98 backdrop-blur-2xl border border-stone-200 rounded-[2.5rem] p-8 shadow-[0_30px_100px_rgba(0,0,0,0.2)] w-[360px] animate-in slide-in-from-bottom-6 duration-500">
                    <div className="mb-6 pb-4 border-b border-stone-100 flex justify-between items-center"><h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-950">Visual Protocols</h4></div>
                    <div className="space-y-8">
                      <div className="space-y-3">
                        <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Printed Subject Matter</label>
                        <div className="flex gap-2">
                          <select value={selectedBreed} onChange={(e) => setSelectedBreed(e.target.value)} className="flex-grow bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-[10px] font-bold outline-none">
                            {breeds.map(b => <option key={b} value={b}>{b}</option>)}
                          </select>
                          <button onClick={() => handleGenerateMockup('horse')} className="bg-emerald-900 text-white px-4 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-emerald-950 transition-all">Swap Art</button>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Laboratory Environment</label>
                        <div className="flex gap-2">
                          <select value={selectedLighting} onChange={(e) => setSelectedLighting(e.target.value)} className="flex-grow bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-[10px] font-bold outline-none">
                            {lightingStyles.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                          <button onClick={() => handleGenerateMockup('background')} className="bg-emerald-900 text-white px-4 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-emerald-950 transition-all">Relight</button>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-stone-100"><button onClick={() => handleGenerateMockup('full')} className="w-full bg-[#D4AF37] text-emerald-950 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-xl hover:brightness-105 active:scale-95 transition-all">Synthesize Full Redesign</button></div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-4 px-2">
              {galleryImages.map((img, idx) => (
                <button key={idx} onClick={() => { handleImageSwap(img); setIsGenerated(false); }} className={`relative w-24 aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-300 ${displayImage === img ? 'border-emerald-900 shadow-lg scale-105' : 'border-white hover:border-stone-200'}`}>
                  <img src={img} alt="Product view" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            <div className="mb-12">
              <div className="flex items-center gap-4 mb-6">
                <span className="px-4 py-1.5 rounded-full bg-emerald-950 text-[#D4AF37] text-[9px] font-black uppercase tracking-[0.3em]">ELITE FORMULATION</span>
                {isGenerated && <span className="text-emerald-700 text-[9px] font-black uppercase tracking-widest animate-pulse flex items-center gap-2"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>Custom Protocol Asset Active</span>}
              </div>
              <h1 className="text-6xl md:text-7xl font-bold text-stone-900 mb-6 tracking-tighter leading-none">{product.name}</h1>
              <p className="text-stone-400 font-mono text-[10px] uppercase tracking-[0.3em]">REF: {product.id.toUpperCase()}</p>
            </div>

            <div className="mb-12 p-10 bg-white rounded-[3rem] border border-stone-100 shadow-xl relative overflow-hidden">
              {addedNotify && (<div className="absolute top-0 left-0 w-full py-2 bg-emerald-800 text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.4em] text-center animate-in slide-in-from-top duration-500 z-50">Allocated to Stable</div>)}
              <div className="flex items-baseline justify-between mb-10">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Total Protocol Value (Ex VAT)</span>
                  <span key={quantity} className="text-5xl font-bold text-stone-900 tracking-tight animate-in zoom-in-95 duration-300">{formatPrice(product.price * quantity)}</span>
                </div>
              </div>
              <p className="text-xl text-stone-600 leading-relaxed italic font-serif mb-10 border-l-4 border-emerald-900 pl-8">"{product.shortDescription}"</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center justify-between bg-stone-100 border border-stone-200 rounded-2xl p-2 h-[72px] transition-all hover:bg-stone-200/50">
                  <button onClick={() => adjustQuantity(-1)} className="w-12 h-12 rounded-xl flex items-center justify-center hover:bg-white hover:text-emerald-900 transition-all text-stone-500 disabled:opacity-30 disabled:cursor-not-allowed" disabled={quantity <= 1}><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M20 12H4" /></svg></button>
                  <div className="flex flex-col items-center"><span className="text-[8px] font-black text-stone-400 uppercase tracking-widest mb-0.5">Quantity</span><span key={quantity} className="text-xl font-bold text-stone-900 tabular-nums animate-in zoom-in-90 duration-200">{quantity}</span></div>
                  <button onClick={() => adjustQuantity(1)} className="w-12 h-12 rounded-xl flex items-center justify-center hover:bg-white hover:text-emerald-900 transition-all text-stone-500"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg></button>
                </div>
                <button onClick={handleAdd} className="h-[72px] bg-emerald-950 text-[#D4AF37] rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] hover:bg-emerald-900 transition-all shadow-xl active:scale-[0.98] border border-emerald-800">Reserve Formulation</button>
              </div>
              <div className="mt-6"><button onClick={handleExpandMolecularIntelligence} className="w-full border border-stone-200 text-emerald-900 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-3 hover:bg-stone-50 transition-all"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>Expand Molecular Intelligence</button></div>
            </div>

            <div className="space-y-12">
              <section>
                <h3 className="text-[10px] font-black text-emerald-950 uppercase tracking-[0.3em] mb-6 border-b border-stone-100 pb-4">Protocol Specifications</h3>
                <p className="text-stone-600 leading-relaxed text-lg mb-8">{product.description}</p>
                <div className="p-8 bg-stone-50 border-2 border-dashed border-stone-200 rounded-3xl"><h4 className="text-[10px] font-black text-emerald-900 uppercase tracking-widest mb-3">Molecular Matrix</h4><p className="font-mono text-stone-700 text-sm leading-relaxed">{product.formula}</p></div>
              </section>

              {product.ingredientDetails && product.ingredientDetails.length > 0 && (
                <section>
                  <h3 className="text-[10px] font-black text-emerald-950 uppercase tracking-[0.3em] mb-6 border-b border-stone-100 pb-4">Ingredient Breakdown</h3>
                  <div className="space-y-4">
                    {product.ingredientDetails.map((ing, idx) => (
                      <div key={idx} className="bg-white border border-stone-100 rounded-2xl overflow-hidden shadow-sm">
                        <button onClick={() => setExpandedIng(expandedIng === idx ? null : idx)} className="w-full flex items-center justify-between p-6 text-left hover:bg-stone-50 transition-colors"><span className="text-sm font-bold text-stone-900">{ing.name}</span><svg className={`w-4 h-4 text-stone-400 transition-transform ${expandedIng === idx ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg></button>
                        {expandedIng === idx && (<div className="px-6 pb-6 animate-in fade-in slide-in-from-top-1 duration-300"><p className="text-sm text-stone-600 italic font-serif leading-relaxed">{ing.purpose}</p></div>)}
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      </div>
      <IntelligenceDrawer isOpen={isIntelligenceOpen} onClose={() => setIsIntelligenceOpen(false)} title={product.name} category={product.category} data={intelligenceData} isLoading={isSyncingIntelligence} />
    </div>
  );
};

export default ProductDetail;
