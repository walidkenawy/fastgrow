
import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { generateProductMockup, getProductIntelligence } from '../services/geminiService';
import IntelligenceDrawer from './IntelligenceDrawer';
import MolecularFactSheet from './MolecularFactSheet';
import InquiryForm from './InquiryForm';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onUpdateImage: (id: string, newImage: string) => void;
  formatPrice: (price: number) => string;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onBack, onAddToCart, onUpdateImage, formatPrice }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const [addedNotify, setAddedNotify] = useState(false);
  const [showLabMenu, setShowLabMenu] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [expandedIng, setExpandedIng] = useState<number | null>(null);
  
  // Intelligence State
  const [isIntelligenceOpen, setIsIntelligenceOpen] = useState(false);
  const [isSyncingIntelligence, setIsSyncingIntelligence] = useState(false);
  const [intelligenceData, setIntelligenceData] = useState<any>(null);

  const handleGenerateMockup = async (type: 'full' | 'horse' | 'background' = 'full') => {
    setIsGenerating(true);
    setShowLabMenu(false);
    const currentBaseImage = product.image.startsWith('data:image') ? product.image : undefined;

    try {
      const mockupUrl = await generateProductMockup(product.name, product.category, type, currentBaseImage);
      onUpdateImage(product.id, mockupUrl);
    } catch (error) {
      alert("Molecular rendering pipeline congested.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadProtocol = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      const link = document.createElement('a');
      link.href = product.image;
      link.download = `NobelSpirit_${product.sku}_Protocol.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 1500);
  };

  const handleShareProtocol = async () => {
    const shareData = {
      title: `Nobel Spirit Protocol: ${product.name}`,
      text: `Deep analysis of ${product.name} - ${product.category} protocol.`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share failed');
      }
    } else {
      navigator.clipboard.writeText(`${shareData.title}\n${shareData.url}`);
      setIsShared(true);
      setTimeout(() => setIsShared(false), 2000);
    }
  };

  const handleExpandIntelligence = async () => {
    setIsIntelligenceOpen(true);
    setIsSyncingIntelligence(true);
    try {
      const data = await getProductIntelligence(product);
      setIntelligenceData(data);
    } catch (err) {
      alert("Intelligence sync failed.");
      setIsIntelligenceOpen(false);
    } finally {
      setIsSyncingIntelligence(false);
    }
  };

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, quantity);
    setAddedNotify(true);
    setTimeout(() => setAddedNotify(false), 3000);
  };

  return (
    <div className="bg-stone-50 min-h-screen pb-32">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button onClick={onBack} className="flex items-center text-stone-400 hover:text-emerald-900 transition-colors mb-12 uppercase text-[10px] font-black tracking-[0.3em]">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
          Back to Archives
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start mb-24">
          <div className="space-y-10 lg:sticky lg:top-32">
            <div className="relative aspect-square rounded-[3rem] overflow-hidden shadow-2xl bg-white border-[12px] border-white">
              {isGenerating && (
                <div className="absolute inset-0 z-40 bg-emerald-950/70 backdrop-blur-md flex flex-col items-center justify-center text-white p-12 text-center">
                  <div className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mb-6"></div>
                  <p className="font-black tracking-[0.3em] uppercase text-[10px] text-[#D4AF37]">Synthesizing Protocol</p>
                </div>
              )}

              {isDownloading && (
                <div className="absolute inset-0 z-50 bg-[#D4AF37]/80 backdrop-blur-md flex flex-col items-center justify-center p-12 text-center">
                  <div className="w-10 h-10 border-4 border-emerald-950/20 border-t-emerald-950 rounded-full animate-spin mb-4"></div>
                  <p className="text-[10px] font-black text-emerald-950 uppercase tracking-[0.4em]">Compiling Specs</p>
                </div>
              )}
              
              <img src={product.image} alt={product.name} className={`w-full h-full object-cover transition-all duration-700 ${isGenerating ? 'opacity-30 blur-xl' : 'opacity-100'}`} />

              <div className="absolute bottom-6 right-6 z-30">
                <button onClick={() => setShowLabMenu(!showLabMenu)} disabled={isGenerating} className="bg-emerald-950 text-white px-8 py-4 rounded-full font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl flex items-center gap-3">
                  <svg className="w-4 h-4" style={{color: '#D4AF37'}} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a2 2 0 00-1.96 1.414l-.722 2.166a2 2 0 00.547 2.155l1.638 1.638a2 2 0 002.155.547l2.166-.722a2 2 0 001.414-1.96l-.477-2.387a2 2 0 00-.547-1.022z" /></svg>
                  Redesign Lab
                </button>

                {showLabMenu && (
                  <div className="absolute bottom-full right-0 mb-4 bg-white/95 backdrop-blur-xl border border-stone-200 rounded-3xl p-4 shadow-2xl w-48 animate-in slide-in-from-bottom-4 duration-300">
                    {['Full Synthesis', 'Art Swap', 'Lighting Change'].map((v, i) => (
                      <button key={v} onClick={() => handleGenerateMockup(i === 0 ? 'full' : i === 1 ? 'horse' : 'background')} className="w-full text-left px-4 py-2.5 rounded-xl text-[9px] font-bold uppercase tracking-widest text-emerald-950 hover:bg-stone-50 transition-all">
                        {v}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-12">
              <h3 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.4em] mb-6 flex items-center gap-4">
                Laboratory Metadata
                <div className="h-px flex-grow bg-stone-200"></div>
              </h3>
              <MolecularFactSheet product={product} />
            </div>
          </div>

          <div className="flex flex-col">
            <h1 className="text-6xl font-bold text-stone-900 mb-6 tracking-tighter leading-none">{product.name}</h1>
            
            <div className="mb-12 p-10 bg-white rounded-[3rem] border border-stone-100 shadow-xl relative overflow-hidden">
              {addedNotify && (<div className="absolute top-0 left-0 w-full py-2 bg-emerald-800 text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.4em] text-center animate-in slide-in-from-top duration-500 z-50">Allocated to Stable</div>)}
              <span className="text-5xl font-bold text-stone-900 tracking-tight block mb-10">{formatPrice(product.price * quantity)}</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center justify-between bg-stone-100 border border-stone-200 rounded-2xl p-2 h-[72px]">
                  <button onClick={() => setQuantity(q => Math.max(1, q-1))} className="w-12 h-12 rounded-xl flex items-center justify-center hover:bg-white transition-all"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path d="M20 12H4" /></svg></button>
                  <span className="text-xl font-bold text-stone-900">{quantity}</span>
                  <button onClick={() => setQuantity(q => q+1)} className="w-12 h-12 rounded-xl flex items-center justify-center hover:bg-white transition-all"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path d="M12 4v16m8-8H4" /></svg></button>
                </div>
                <button onClick={handleAdd} className="h-[72px] bg-emerald-950 text-[#D4AF37] rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] hover:bg-emerald-900 transition-all shadow-xl active:scale-[0.98]">Reserve Formulation</button>
              </div>
              
              <div className="mt-8 flex gap-4">
                <button 
                  onClick={handleDownloadProtocol}
                  className="flex-grow border border-stone-200 text-stone-900 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-3 hover:bg-stone-50 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  Download Protocol
                </button>
                <button 
                  onClick={handleShareProtocol}
                  className={`px-8 border border-stone-200 rounded-2xl transition-all flex items-center justify-center gap-3 ${isShared ? 'bg-emerald-500 text-white border-emerald-500' : 'text-stone-900 hover:bg-stone-50'}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                  <span className="hidden sm:inline text-[10px] font-black uppercase tracking-[0.4em]">{isShared ? 'Shared' : 'Share'}</span>
                </button>
              </div>

              <div className="mt-4">
                <button onClick={handleExpandIntelligence} className="w-full bg-emerald-50 text-emerald-900 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-3 hover:bg-emerald-100 transition-all">
                  Expand Molecular Intelligence
                </button>
              </div>
            </div>

            <div className="space-y-12">
              <section>
                <h3 className="text-[10px] font-black text-emerald-950 uppercase tracking-[0.3em] mb-6 border-b border-stone-100 pb-4">Protocol Specifications</h3>
                <p className="text-stone-600 leading-relaxed text-lg mb-8">{product.description}</p>
                <div className="p-8 bg-stone-50 border-2 border-dashed border-stone-200 rounded-3xl">
                  <h4 className="text-[10px] font-black text-emerald-900 uppercase tracking widest mb-3">Molecular Matrix</h4>
                  <p className="font-mono text-stone-700 text-sm leading-relaxed">{product.formula}</p>
                </div>
              </section>

              {product.ingredientDetails && product.ingredientDetails.length > 0 && (
                <section>
                  <h3 className="text-[10px] font-black text-emerald-950 uppercase tracking-[0.3em] mb-6 border-b border-stone-100 pb-4">Ingredient Breakdown</h3>
                  <div className="space-y-4">
                    {product.ingredientDetails.map((ing, idx) => (
                      <div key={idx} className="bg-white border border-stone-100 rounded-2xl overflow-hidden shadow-sm">
                        <button onClick={() => setExpandedIng(expandedIng === idx ? null : idx)} className="w-full flex items-center justify-between p-6 text-left hover:bg-stone-50 transition-colors">
                          <span className="text-sm font-bold text-stone-900">{ing.name}</span>
                          <svg className={`w-4 h-4 text-stone-400 transition-transform ${expandedIng === idx ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                        </button>
                        {expandedIng === idx && (<div className="px-6 pb-6 animate-in fade-in slide-in-from-top-1 duration-300"><p className="text-sm text-stone-600 italic font-serif leading-relaxed">{ing.purpose}</p></div>)}
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>

        {/* Global Inquiry Form Embedded at Bottom */}
        <div className="max-w-4xl mx-auto">
          <InquiryForm product={product} embedded />
        </div>
      </div>
      <IntelligenceDrawer isOpen={isIntelligenceOpen} onClose={() => setIsIntelligenceOpen(false)} title={product.name} category={product.category} data={intelligenceData} isLoading={isSyncingIntelligence} />
    </div>
  );
};

export default ProductDetail;
