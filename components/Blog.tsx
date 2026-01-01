
import React, { useState, useMemo, useEffect } from 'react';
import { generateBlogVisual, getDeepIntelligence } from '../services/geminiService';
import { BlogPost } from '../types';
import IntelligenceDrawer from './IntelligenceDrawer';

interface BlogProps {
  blogs: BlogPost[];
  onUpdateImage: (id: string, newImage: string) => void;
}

const Blog: React.FC<BlogProps> = ({ blogs, onUpdateImage }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleCount, setVisibleCount] = useState(12);
  const [isGenerating, setIsGenerating] = useState<Record<string, boolean>>({});
  
  // Intelligence State
  const [isIntelligenceOpen, setIsIntelligenceOpen] = useState(false);
  const [isSyncingIntelligence, setIsSyncingIntelligence] = useState(false);
  const [intelligenceData, setIntelligenceData] = useState<any>(null);
  const [activeIntelligencePost, setActiveIntelligencePost] = useState<BlogPost | null>(null);

  const filteredBlogs = useMemo(() => {
    return blogs.filter(post => {
      const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch && matchesCategory;
    });
  }, [activeCategory, searchTerm, blogs]);

  const displayedBlogs = filteredBlogs.slice(0, visibleCount);

  /**
   * UNIVERSAL BRAND MANIFESTATION ENGINE
   * Automatically synthesizes blog visuals as they enter the viewport.
   * If a mockup already exists (data URL), it uses it as a base for higher fidelity.
   */
  useEffect(() => {
    const autoSynthesize = async () => {
      // Prioritize items that haven't been synthesized at all (no data URL)
      // or items that could benefit from refinement.
      const targets = displayedBlogs.filter(b => !b.image.startsWith('data:image')).slice(0, 4);
      
      for (const post of targets) {
        if (isGenerating[post.id]) continue;
        
        setIsGenerating(prev => ({ ...prev, [post.id]: true }));
        try {
          const result = await generateBlogVisual(post.title, post.summary, post.category);
          if (result) onUpdateImage(post.id, result);
        } catch (err) {
          console.error(`Auto-synthesis failed for blog ${post.id}`);
        } finally {
          setIsGenerating(prev => ({ ...prev, [post.id]: false }));
        }
      }
    };
    
    const t = setTimeout(autoSynthesize, 800);
    return () => clearTimeout(t);
  }, [displayedBlogs, onUpdateImage]);

  const handleExpandIntelligence = async (post: BlogPost) => {
    setActiveIntelligencePost(post);
    setIsIntelligenceOpen(true);
    setIsSyncingIntelligence(true);
    try {
      const data = await getDeepIntelligence(post.title, post.summary, post.category);
      setIntelligenceData(data);
    } catch (err) {
      setIsIntelligenceOpen(false);
    } finally {
      setIsSyncingIntelligence(false);
    }
  };

  return (
    <div className="bg-stone-50 min-h-screen">
      <div className="relative h-[60vh] bg-emerald-950 flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=2400" className="w-full h-full object-cover opacity-20 grayscale" />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-50 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <h1 className="text-8xl font-black text-white tracking-tighter leading-none mb-4">RESEARCH <span className="text-[#D4AF37] italic font-serif">ARCHIVE</span></h1>
          <p className="text-xl text-stone-300 font-serif italic max-w-2xl">Precision molecular insights for the global equestrian elite.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-20 relative z-20 pb-40">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {displayedBlogs.map(post => (
            <div key={post.id} className="bg-white rounded-[3rem] overflow-hidden border border-stone-100 shadow-xl group">
              <div className="relative aspect-[16/9] bg-stone-50 overflow-hidden">
                {isGenerating[post.id] && (
                  <div className="absolute inset-0 z-40 bg-emerald-950/90 backdrop-blur-xl flex flex-col items-center justify-center p-12 text-center">
                    <div className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-[10px] font-black text-white uppercase tracking-widest animate-pulse">Rendering Publication</p>
                  </div>
                )}
                <img src={post.image} className={`w-full h-full object-cover transition-all duration-1000 ${isGenerating[post.id] ? 'blur-xl' : 'group-hover:scale-105'}`} />
              </div>
              <div className="p-12">
                <div className="flex gap-4 mb-6">
                  <span className="bg-emerald-50 text-emerald-900 px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border border-emerald-100">{post.category}</span>
                </div>
                <h3 className="text-3xl font-bold text-stone-900 mb-6 tracking-tight leading-none">{post.title}</h3>
                <p className="text-stone-500 italic font-serif leading-relaxed mb-10">{post.summary}</p>
                <button onClick={() => handleExpandIntelligence(post)} className="text-emerald-950 font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-4 hover:translate-x-2 transition-transform">
                  Expand Intelligence
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 8l4 4m0 0l-4 4m4-4H3" strokeWidth="3"/></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <IntelligenceDrawer isOpen={isIntelligenceOpen} onClose={() => setIsIntelligenceOpen(false)} title={activeIntelligencePost?.title || ''} category={activeIntelligencePost?.category || ''} data={intelligenceData} isLoading={isSyncingIntelligence} />
    </div>
  );
};

export default Blog;
