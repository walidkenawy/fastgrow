
import React, { useState } from 'react';

interface HQMapProps {
  className?: string;
  title?: string;
  description?: string;
}

const HQMap: React.FC<HQMapProps> = ({ className = "", title, description }) => {
  const [isZoomed, setIsZoomed] = useState(false);
  
  // Refined coordinates for al. Komisji Edukacji Narodowej 34, 02-797 Warszawa
  const HQ_LAT_LNG = { lat: 52.1461, lng: 21.0474 };
  
  // Dynamic zoom levels: 13 for City view, 19 for detailed Street view
  const currentZoom = isZoomed ? 19 : 13;

  return (
    <div className={`relative group ${className}`}>
      {(title || description) && (
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">{title || "Global HQ & Lab Facility"}</h4>
            <p className="text-sm font-bold text-emerald-950">{description || "al. Komisji Edukacji Narodowej 34, 02-797 Warszawa, Poland"}</p>
          </div>
          <button 
            onClick={() => setIsZoomed(!isZoomed)}
            className="bg-emerald-950 text-[#D4AF37] p-3 rounded-xl shadow-lg hover:scale-110 transition-transform z-10"
            title={isZoomed ? "Switch to City View" : "Zoom to Laboratory Street"}
          >
            {isZoomed ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" /></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
            )}
          </button>
        </div>
      )}

      <div className={`relative h-[450px] rounded-[3rem] overflow-hidden border-4 border-white shadow-2xl transition-all duration-700 ${isZoomed ? 'ring-4 ring-[#D4AF37]/30' : ''}`}>
        <iframe 
          title="Nobel Spirit HQ Location"
          src={`https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d1000!2d${HQ_LAT_LNG.lng}!3d${HQ_LAT_LNG.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2spl!4v1700000000000!5m2!1sen!2spl&z=${currentZoom}`}
          className="w-full h-full border-0 grayscale saturate-50 hover:grayscale-0 transition-all duration-700"
          allowFullScreen
          loading="lazy"
        ></iframe>
        
        {/* Overlay Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <div className="bg-emerald-950/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-2">
             <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
             <span className="text-[10px] font-black text-white uppercase tracking-widest">Laboratory Online</span>
          </div>
          <div className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-stone-200 shadow-sm flex items-center gap-2">
             <span className="text-[9px] font-black text-stone-600 uppercase tracking-widest">
               {isZoomed ? "Street Perspective" : "Metropolitan Context"}
             </span>
          </div>
        </div>

        {!title && (
          <button 
            onClick={() => setIsZoomed(!isZoomed)}
            className="absolute bottom-6 right-6 bg-emerald-950 text-[#D4AF37] p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default HQMap;
