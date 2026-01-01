
import React, { useState } from 'react';
import { getDietaryAdvice } from '../services/geminiService';
import { Product } from '../types';
import ProductCard from './ProductCard';

interface AIDietConsultantProps {
  onSelectProduct: (id: string) => void;
  onAddToCart: (product: Product, quantity?: number) => void;
  onUpdateProductImage: (id: string, newImage: string) => void;
  formatPrice: (price: number) => string;
  products: Product[];
}

const AIDietConsultant: React.FC<AIDietConsultantProps> = ({ 
  onSelectProduct, 
  onAddToCart, 
  onUpdateProductImage,
  formatPrice, 
  products 
}) => {
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    advice: string;
    nutritionalGoals: string[];
    recommendedProducts: Product[];
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    setLoading(true);
    try {
      const data = await getDietaryAdvice(userInput);
      const recommendedProducts = products.filter(p => data.recommendedProductIds.includes(p.id));
      setResult({
        advice: data.advice,
        nutritionalGoals: data.nutritionalGoals,
        recommendedProducts
      });
    } catch (error) {
      alert("Something went wrong with the AI consultation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-5xl font-bold text-stone-900 mb-4 tracking-tighter">Precision Performance Advisor</h2>
        <p className="text-stone-600 max-w-2xl mx-auto italic font-serif text-lg">
          Describe your horse's condition, activity level, and performance goals. 
          Our molecular nutrition engine will analyze the requirements.
        </p>
      </div>

      <div className="bg-white rounded-[3rem] p-10 shadow-2xl border border-stone-100">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-[10px] font-black text-emerald-900 uppercase tracking-[0.3em] mb-4">
              Diagnostic Input Area
            </label>
            <textarea
              className="w-full h-48 p-6 bg-stone-50 border-2 border-dashed border-stone-200 rounded-[2rem] focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all resize-none font-medium text-stone-800"
              placeholder="Example: My 8-year-old dressage horse needs more focus and better topline muscle. He is currently on high protein hay but lacks the 'spark' in the arena..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-6 rounded-2xl text-white font-black text-xs uppercase tracking-[0.4em] shadow-xl transition-all ${
              loading ? 'bg-stone-300 cursor-not-allowed' : 'bg-emerald-950 hover:bg-emerald-900 active:scale-[0.98]'
            }`}
            style={{ color: !loading ? '#D4AF37' : undefined }}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-stone-900" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing Bio-Data...
              </div>
            ) : 'Initiate Analysis'}
          </button>
        </form>

        {result && (
          <div className="mt-16 space-y-12 animate-in fade-in slide-in-from-bottom duration-1000">
            <div className="p-8 bg-emerald-950 rounded-[2.5rem] border border-emerald-900 shadow-2xl">
              <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.4em] mb-6 flex items-center">
                Official Recommendation
              </h4>
              <p className="text-stone-100 leading-relaxed italic text-lg font-serif">"{result.advice}"</p>
            </div>

            <div>
              <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em] mb-6 flex items-center">
                Biometric Focus
              </h4>
              <div className="flex flex-wrap gap-3">
                {result.nutritionalGoals.map((goal, i) => (
                  <span key={i} className="px-5 py-2.5 bg-stone-100 text-stone-800 rounded-full text-xs font-black uppercase tracking-widest border border-stone-200">
                    {goal}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em] mb-8">Nobel Spirit Protocol Integration</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {result.recommendedProducts.map(product => (
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIDietConsultant;
