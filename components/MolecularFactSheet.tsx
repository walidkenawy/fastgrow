
import React from 'react';
import { Product } from '../types';

interface MolecularFactSheetProps {
  product: Product;
}

const Barcode: React.FC<{ code: string }> = ({ code }) => {
  // Simple deterministic barcode generator using div strips
  const pattern = code.split('').map(char => char.charCodeAt(0) % 5 + 1);
  return (
    <div className="flex items-end h-10 gap-[1.5px]">
      {pattern.map((p, i) => (
        <React.Fragment key={i}>
          <div className="bg-stone-900" style={{ width: `${p}px`, height: '100%' }}></div>
          <div className="bg-transparent" style={{ width: '1px', height: '100%' }}></div>
          <div className="bg-stone-900" style={{ width: '1px', height: '100%' }}></div>
        </React.Fragment>
      ))}
    </div>
  );
};

const QRCodePlaceholder: React.FC = () => (
  <div className="w-20 h-20 bg-white border border-stone-200 p-1 flex flex-wrap gap-[1px] shadow-sm">
    {Array.from({ length: 144 }).map((_, i) => (
      <div 
        key={i} 
        className={`w-[4.5px] h-[4.5px] ${Math.random() > 0.65 ? 'bg-stone-900' : 'bg-transparent'}`}
      />
    ))}
  </div>
);

const MolecularFactSheet: React.FC<MolecularFactSheetProps> = ({ product }) => {
  return (
    <div className="bg-[#fcfcfc] border-2 border-stone-100 p-10 rounded-[3rem] shadow-sm relative overflow-hidden font-mono group hover:border-[#D4AF37]/30 transition-all duration-700">
      {/* Aesthetic Lab Elements */}
      <div className="absolute top-0 right-0 p-6 opacity-[0.05] pointer-events-none transition-transform group-hover:scale-110 duration-1000">
        <svg className="w-48 h-48" viewBox="0 0 100 100" fill="currentColor">
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.2" strokeDasharray="1 1" />
          <path d="M50 0 L50 100 M0 50 L100 50" stroke="currentColor" strokeWidth="0.1" />
          <path d="M25 25 L75 75 M75 25 L25 75" stroke="currentColor" strokeWidth="0.1" />
        </svg>
      </div>

      <div className="flex justify-between items-start mb-12 border-b border-stone-100 pb-10">
        <div>
          <h3 className="text-[16px] font-black text-emerald-950 uppercase tracking-[0.3em] mb-2">Nobel Spirit® Labs</h3>
          <p className="text-[10px] text-stone-400 font-bold uppercase tracking-[0.5em]">Molecular Integrity Protocol</p>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[11px] font-black text-emerald-900 mb-3 tracking-widest">{product.sku}</span>
          <Barcode code={product.sku} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-12 mb-12">
        <div className="space-y-6">
          <div className="border-l-4 border-[#D4AF37] pl-5">
            <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest mb-1.5">Batch Registration</p>
            <p className="text-[13px] font-bold text-stone-800">NS-BATCH-{new Date().getFullYear()}-{Math.floor(Math.random()*900+100)}A</p>
          </div>
          <div className="border-l-4 border-stone-200 pl-5">
            <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest mb-1.5">Analytical Category</p>
            <p className="text-[13px] font-bold text-stone-800">{product.category.toUpperCase()}</p>
          </div>
        </div>
        <div className="space-y-6">
          <div className="border-l-4 border-stone-200 pl-5">
            <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest mb-1.5">Molecular Form</p>
            <p className="text-[13px] font-bold text-stone-800">{product.form}</p>
          </div>
          <div className="border-l-4 border-stone-200 pl-5">
            <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest mb-1.5">Lab Net Weight</p>
            <p className="text-[13px] font-bold text-stone-800">{product.weight}</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-stone-100 p-8 rounded-[2rem] mb-12 shadow-inner">
        <p className="text-[9px] font-black text-stone-400 uppercase tracking-[0.4em] mb-6 flex items-center gap-3">
          Verification Matrix
          <div className="h-px flex-grow bg-stone-50"></div>
        </p>
        <div className="grid grid-cols-1 gap-4">
          {product.benefits.map((benefit, i) => (
            <div key={i} className="flex items-center justify-between text-[11px] border-b border-stone-50 pb-3">
              <span className="text-stone-500 uppercase tracking-[0.2em] font-medium">{benefit}</span>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                <span className="text-emerald-950 font-black tracking-widest">VERIFIED</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-end justify-between pt-8 border-t border-stone-50">
        <div className="flex gap-6 items-end">
          <div>
            <p className="text-[9px] font-black text-stone-400 uppercase tracking-[0.3em] mb-3">Authenticity Scan</p>
            <QRCodePlaceholder />
          </div>
          <div className="mb-2">
             <p className="text-[8px] text-stone-300 font-bold uppercase tracking-widest">Digital Certificate Issued</p>
             <p className="text-[9px] text-emerald-900 font-black uppercase tracking-widest">Protocol Secured</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black text-emerald-950 uppercase tracking-[0.5em] mb-2">NOBEL SPIRIT PERFORMANCE LABS</p>
          <p className="text-[8px] text-stone-300 tracking-[0.3em] font-medium">EST. 1984 | CLUJ-NAPOCA | WARSAW | RIYADH</p>
        </div>
      </div>
    </div>
  );
};

export default MolecularFactSheet;
