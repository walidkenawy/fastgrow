
import React, { useState } from 'react';
import { Currency, Language, CurrencyCode } from '../types';

interface SettingsBarProps {
  currentCurrency: Currency;
  onCurrencyChange: (currency: Currency) => void;
  currentLanguage: Language;
  onLanguageChange: (language: Language) => void;
  isSyncing: boolean;
}

const currencies: Currency[] = [
  { code: 'PLN', symbol: 'zł', label: 'Polish Zloty' },
  { code: 'USD', symbol: '$', label: 'US Dollar' },
  { code: 'EUR', symbol: '€', label: 'Euro' },
  { code: 'GBP', symbol: '£', label: 'British Pound' },
  { code: 'SAR', symbol: 'SR', label: 'Saudi Riyal' },
  { code: 'AED', symbol: 'DH', label: 'UAE Dirham' },
];

const languages: Language[] = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
];

const SettingsBar: React.FC<SettingsBarProps> = ({ 
  currentCurrency, 
  onCurrencyChange, 
  currentLanguage, 
  onLanguageChange,
  isSyncing
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-emerald-950/5 border-b border-emerald-950/10 py-2.5 px-6">
      <div className="max-w-7xl mx-auto flex justify-end items-center gap-8">
        
        {isSyncing && (
          <div className="flex items-center gap-3 animate-pulse">
            <div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full animate-ping"></div>
            <span className="text-[9px] font-black text-emerald-900 uppercase tracking-widest">Molecular Linguistics Sync...</span>
          </div>
        )}

        <div className="flex items-center gap-6">
          {/* Language Selector */}
          <div className="relative group">
            <button className="flex items-center gap-2.5 text-[10px] font-black text-stone-500 uppercase tracking-widest hover:text-emerald-950 transition-colors">
              <span className="text-sm">{currentLanguage.flag}</span>
              {currentLanguage.name}
              <svg className="w-3 h-3 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <div className="absolute top-full right-0 mt-2 bg-white/95 backdrop-blur-xl border border-stone-100 rounded-2xl shadow-2xl p-2 min-w-[160px] z-[100] opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all translate-y-2 group-hover:translate-y-0">
              {languages.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => onLanguageChange(lang)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-3 transition-all ${currentLanguage.code === lang.code ? 'bg-emerald-950 text-[#D4AF37]' : 'text-stone-400 hover:bg-stone-50 hover:text-emerald-950'}`}
                >
                  <span className="text-sm">{lang.flag}</span>
                  {lang.name}
                </button>
              ))}
            </div>
          </div>

          <div className="h-4 w-px bg-stone-200"></div>

          {/* Currency Selector */}
          <div className="relative group">
            <button className="flex items-center gap-2.5 text-[10px] font-black text-stone-500 uppercase tracking-widest hover:text-emerald-950 transition-colors">
              <span className="text-[#D4AF37] font-serif italic text-sm">{currentCurrency.symbol}</span>
              {currentCurrency.code}
              <svg className="w-3 h-3 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <div className="absolute top-full right-0 mt-2 bg-white/95 backdrop-blur-xl border border-stone-100 rounded-2xl shadow-2xl p-2 min-w-[160px] z-[100] opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all translate-y-2 group-hover:translate-y-0">
              {currencies.map(curr => (
                <button
                  key={curr.code}
                  onClick={() => onCurrencyChange(curr)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-between transition-all ${currentCurrency.code === curr.code ? 'bg-emerald-950 text-[#D4AF37]' : 'text-stone-400 hover:bg-stone-50 hover:text-emerald-950'}`}
                >
                  <span className="flex items-center gap-3">
                    <span className="text-[#D4AF37] font-serif italic">{curr.symbol}</span>
                    {curr.code}
                  </span>
                  <span className="text-[8px] opacity-40">{curr.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsBar;
