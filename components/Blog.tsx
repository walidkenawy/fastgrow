
import React, { useState } from 'react';
import { generateBlogVisual, getDeepIntelligence } from '../services/geminiService';
import { BlogPost } from '../types';
import IntelligenceDrawer from './IntelligenceDrawer';

interface BlogProps {
  blogs: BlogPost[];
}

const Blog: React.FC<BlogProps> = ({ blogs }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<Record<string, boolean>>({});
  const [postImages, setPostImages] = useState<Record<string, string>>({});
  const [isSynthesizingAll, setIsSynthesizingAll] = useState(false);
  
  // Intelligence State
  const [isIntelligenceOpen, setIsIntelligenceOpen] = useState(false);
  const [isSyncingIntelligence, setIsSyncingIntelligence] = useState(false);
  const [intelligenceData, setIntelligenceData] = useState<any>(null);
  const [activeIntelligencePost, setActiveIntelligencePost] = useState<BlogPost | null>(null);

  const handleSynthesizeAsset = async (post: BlogPost) => {
    if (isGenerating[post.id]) return;
    setIsGenerating(prev => ({ ...prev, [post.id]: true }));
    try {
      const result = await generateBlogVisual(post.title, post.summary, post.category);
      setPostImages(prev => ({ ...prev, [post.id]: result }));
    } catch (err) {
      console.error("Vision synthesis failed:", err);
    } finally {
      setIsGenerating(prev => ({ ...prev, [post.id]: false }));
    }
  };

  const handleSynthesizeAll = async () => {
    if (isSynthesizingAll) return;
    setIsSynthesizingAll(true);
    const targets = blogs.slice(0, 10);
    for (const post of targets) {
      if (!postImages[post.id]) {
        await handleSynthesizeAsset(post);
      }
    }
    setIsSynthesizingAll(false);
  };

  const handleDownloadVision = (e: React.MouseEvent, post: BlogPost) => {
    e.stopPropagation();
    const imageUrl = postImages[post.id] || post.image;
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `Nobel_Spirit_Research_${post.title.replace(/\s+/g, '_')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSharePost = async (e: React.MouseEvent, post: BlogPost) => {
    e.stopPropagation();
    const shareData = {
      title: `Nobel Spirit Research: ${post.title}`,
      text: post.summary,
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
      setCopiedId(post.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleExpandIntelligence = async (post: BlogPost) => {
    setActiveIntelligencePost(post);
    setIsIntelligenceOpen(true);
    setIsSyncingIntelligence(true);
    try {
      const data = await getDeepIntelligence(post.title, post.summary, post.category);
      setIntelligenceData(data);
    } catch (err) {
      alert("Linguistic analysis gateway timed out. Please retry.");
      setIsIntelligenceOpen(false);
    } finally {
      setIsSyncingIntelligence(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-24 selection:bg-[#D4AF37] selection:text-emerald-950">
      <div className="mb-24 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-4 px-5 py-2.5 rounded-full bg-emerald-950/5 border border-emerald-950/10 mb-8">
          <span className="w-2.5 h-2.5 bg-emerald-900 rounded-full animate-pulse"></span>
          <span className="text-emerald-900 text-[11px] font-black tracking-[0.4em] uppercase">Clinical Research Database</span>
        </div>
        <h1 className="text-7xl md:text-9xl font-bold text-stone-900 mb-8 tracking-tighter leading-none">
          RESEARCH <br />
          <span className="italic font-serif text-[#D4AF37]">ARCHIVE</span>
        </h1>
        <p className="text-2xl text-stone-500 italic font-serif leading-relaxed max-w-3xl mx-auto mb-12">
          Deep-dives into equine molecular nutrition and high-stakes performance strategies.
        </p>
        
        <button 
          onClick={handleSynthesizeAll}
          disabled={isSynthesizingAll}
          className={`mx-auto flex items-center gap-4 px-12 py-5 rounded-full font-black text-[10px] uppercase tracking-[0.4em] shadow-2xl transition-all ${isSynthesizingAll ? 'bg-stone-100 text-stone-400' : 'bg-emerald-950 text-[#D4AF37] hover:bg-emerald-900 active:scale-95'}`}
        >
          {isSynthesizingAll ? (
            <>
              <div className="w-4 h-4 border-2 border-stone-300 border-t-emerald-950 rounded-full animate-spin"></div>
              Synthesizing Daily Visual Archive...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a2 2 0 00-1.96 1.414l-.722 2.166a2 2 0 00.547 2.155l1.638 1.638a2 2 0 002.155.547l2.166-.722a2 2 0 001.414-1.96l-.477-2.387a2 2 0 00-.547-1.022z" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Synthesize All Research Visions
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {blogs.map(post => (
          <div key={post.id} className="group flex flex-col h-full bg-white rounded-[4rem] overflow-hidden border border-stone-100 shadow-sm hover:shadow-[0_40px_100px_-20px_rgba(6,78,59,0.1)] transition-all duration-[1000ms] animate-in fade-in slide-in-from-bottom-12">
            
            <div className="relative aspect-[16/9] overflow-hidden bg-stone-50">
              {isGenerating[post.id] && (
                <div className="absolute inset-0 z-40 bg-emerald-950/90 backdrop-blur-2xl flex flex-col items-center justify-center p-12 text-center animate-in fade-in duration-500">
                  <div className="w-16 h-16 border-4 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin mb-8"></div>
                  <p className="text-[12px] font-black text-white uppercase tracking-[0.5em] animate-pulse">Synthesizing Asset</p>
                </div>
              )}
              <img src={postImages[post.id] || post.image} alt={post.title} className={`w-full h-full object-cover transition-all duration-[2000ms] ${isGenerating[post.id] ? 'scale-110 blur-xl opacity-30' : 'group-hover:scale-110 opacity-100'}`} />
              
              <div className="absolute top-8 right-8 flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0 z-50">
                <button 
                  onClick={(e) => handleDownloadVision(e, post)}
                  className="bg-white/95 backdrop-blur p-4 rounded-2xl text-emerald-950 shadow-2xl hover:scale-110 active:scale-95 transition-all border border-stone-100"
                  title="Download Research Visual"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                </button>
                <button 
                  onClick={(e) => handleSharePost(e, post)}
                  className={`p-4 rounded-2xl shadow-2xl hover:scale-110 active:scale-95 transition-all border border-stone-100 ${copiedId === post.id ? 'bg-emerald-500 text-white' : 'bg-white/95 backdrop-blur text-emerald-950'}`}
                  title="Share Clinical Report"
                >
                  {copiedId === post.id ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                  )}
                </button>
              </div>

              {!postImages[post.id] && !isGenerating[post.id] && (
                <div className="absolute inset-0 bg-emerald-950/20 opacity-0 group-hover:opacity-100 transition-all duration-700 flex items-center justify-center">
                  <button onClick={() => handleSynthesizeAsset(post)} className="bg-white text-emerald-950 px-8 py-4 rounded-2xl text-[9px] font-black uppercase tracking-[0.3em] shadow-2xl hover:scale-105 transition-all border border-stone-200">
                    Synthesize Image
                  </button>
                </div>
              )}

              <div className="absolute top-8 left-8">
                <span className="bg-emerald-950/90 backdrop-blur-xl text-[#D4AF37] px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] border border-emerald-800/50">
                  {post.category}
                </span>
              </div>
            </div>
            
            <div className="p-12 md:p-16 flex-grow flex flex-col">
              <div className="flex items-center gap-4 mb-8">
                <span className="text-stone-400 text-[11px] font-bold uppercase tracking-[0.4em] flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full"></div>
                  {post.date}
                </span>
              </div>
              
              <h3 className="text-4xl font-bold text-stone-900 mb-8 group-hover:text-emerald-950 transition-colors tracking-tighter leading-[0.9]">
                {post.title}
              </h3>
              
              <p className="text-xl text-stone-500 leading-relaxed mb-12 italic font-serif">
                "{post.summary}"
              </p>

              <div className="mt-auto pt-12 border-t border-stone-50 flex items-center justify-between">
                <button 
                  onClick={() => handleExpandIntelligence(post)}
                  className="text-emerald-950 font-black text-[11px] uppercase tracking-[0.4em] flex items-center gap-4 group/link hover:text-emerald-700 transition-all"
                >
                  Expand Intelligence
                  <svg className="w-5 h-5 group-hover/link:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <IntelligenceDrawer 
        isOpen={isIntelligenceOpen}
        onClose={() => setIsIntelligenceOpen(false)}
        title={activeIntelligencePost?.title || ''}
        category={activeIntelligencePost?.category || ''}
        data={intelligenceData}
        isLoading={isSyncingIntelligence}
      />
    </div>
  );
};

export default Blog;
