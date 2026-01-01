
import React, { useState } from 'react';
import { CartItem, Currency } from '../types';
import { OrderPayload, executeOmnichannelDispatch } from '../services/orderService';

interface CartProps {
  items: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onNavigate: (page: string) => void;
  formatPrice: (price: number) => string;
  currency: Currency;
}

type CheckoutStep = 'cart' | 'info' | 'payment' | 'processing' | 'success';
type PaymentMethod = 'paypal' | 'bank';

interface ClientInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
}

const Cart: React.FC<CartProps> = ({ items, onUpdateQuantity, onNavigate, formatPrice, currency }) => {
  const [step, setStep] = useState<CheckoutStep>('cart');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('bank');
  const [processStatus, setProcessStatus] = useState<string>('Initializing...');
  const [clientInfo, setClientInfo] = useState<ClientInfo>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    country: 'Poland'
  });

  const subtotal = items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const tax = subtotal * 0.23; // PL VAT
  const total = subtotal + tax;

  const handleToInfo = () => {
    setStep('info');
    window.scrollTo(0, 0);
  };

  const handleToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
    window.scrollTo(0, 0);
  };

  const handleFinalize = async () => {
    setStep('processing');
    
    const orderPayload: OrderPayload = {
      client: clientInfo,
      items: items,
      total: total,
      paymentMethod: paymentMethod,
      currency: currency
    };

    try {
      // Automatic Omnichannel Dispatch
      await executeOmnichannelDispatch(orderPayload, setProcessStatus);
    } catch (err) {
      console.error("Critical Failure in Dispatch Protocol", err);
    } finally {
      setStep('success');
      window.scrollTo(0, 0);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setClientInfo(prev => ({ ...prev, [name]: value }));
  };

  if (step === 'success') {
    return (
      <div className="max-w-4xl mx-auto py-32 px-4 text-center animate-in fade-in zoom-in duration-700">
        <div className="w-24 h-24 bg-emerald-950 rounded-full flex items-center justify-center mx-auto mb-10 shadow-2xl border-4 border-white">
          <svg className="w-12 h-12 text-[#D4AF37]" style={{color: '#D4AF37'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-6xl font-black text-stone-900 mb-6 tracking-tighter uppercase">Protocol Activated</h2>
        
        <div className="bg-emerald-50 border border-emerald-100 p-10 rounded-[3rem] mb-12 max-w-2xl mx-auto shadow-sm">
          <h4 className="text-[10px] font-black text-emerald-900 uppercase tracking-[0.4em] mb-10 text-center border-b border-emerald-200 pb-4">Automated Confirmation Channels</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-left">
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-emerald-900 rounded-md flex items-center justify-center shrink-0 mt-1">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeWidth="3"/></svg>
                </div>
                <div>
                  <p className="text-[9px] font-black text-emerald-900 uppercase tracking-widest mb-1">HQ Dispatch</p>
                  <p className="text-stone-500 text-[11px]">Laboratory alert sent to: <span className="text-emerald-950 font-bold">2010onlyforyou77@gmail.com</span></p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-emerald-900 rounded-md flex items-center justify-center shrink-0 mt-1">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeWidth="3"/></svg>
                </div>
                <div>
                  <p className="text-[9px] font-black text-emerald-900 uppercase tracking-widest mb-1">Personal Archive</p>
                  <p className="text-stone-500 text-[11px]">Full dossier sent to: <span className="text-emerald-950 font-bold">{clientInfo.email}</span></p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-emerald-500 rounded-md flex items-center justify-center shrink-0 mt-1">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                </div>
                <div>
                  <p className="text-[9px] font-black text-emerald-900 uppercase tracking-widest mb-1">Mobile Alert</p>
                  <p className="text-stone-500 text-[11px]">Instant WhatsApp sent to: <span className="text-emerald-950 font-bold">{clientInfo.phone}</span></p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-emerald-200 mt-10">
            <p className="text-[10px] font-black text-emerald-900 uppercase tracking-widest mb-1">Laboratory Reference</p>
            <p className="font-mono text-emerald-700 font-bold tracking-tighter uppercase">NS-{Math.random().toString(36).substr(2, 9)}</p>
          </div>
        </div>

        <button 
          onClick={() => onNavigate('home')}
          className="bg-emerald-950 text-white px-12 py-5 rounded-full font-black text-xs uppercase tracking-[0.3em] hover:bg-emerald-900 transition-all shadow-xl active:scale-95 border border-emerald-900"
          style={{color: '#D4AF37'}}
        >
          Return to Headquarters
        </button>
      </div>
    );
  }

  if (step === 'processing') {
    return (
      <div className="max-w-4xl mx-auto py-48 px-4 text-center animate-in fade-in duration-500">
        <div className="relative w-32 h-32 mx-auto mb-12">
          <div className="absolute inset-0 border-4 border-stone-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
             <span className="text-xs font-black text-emerald-950">NS-LAB</span>
          </div>
        </div>
        <h2 className="text-4xl font-black text-stone-900 mb-4 tracking-tighter uppercase">Executing Omnichannel Dispatch</h2>
        <div className="flex flex-col items-center gap-2">
          <p className="text-stone-400 font-black uppercase text-[10px] tracking-[0.5em] animate-pulse">
            {processStatus}
          </p>
          <div className="flex gap-1">
             <span className="w-1 h-1 bg-[#D4AF37] rounded-full animate-bounce"></span>
             <span className="w-1 h-1 bg-[#D4AF37] rounded-full animate-bounce [animation-delay:0.2s]"></span>
             <span className="w-1 h-1 bg-[#D4AF37] rounded-full animate-bounce [animation-delay:0.4s]"></span>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-32 px-4 text-center">
        <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-8 border-2 border-dashed border-stone-200">
          <svg className="w-8 h-8 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-stone-900 mb-4 tracking-tight uppercase">Stable Order Empty</h2>
        <p className="text-stone-500 mb-12 italic font-serif">You have no reserved performance units in your current protocol.</p>
        <button 
          onClick={() => onNavigate('catalog')}
          className="bg-emerald-950 text-white px-10 py-4 rounded-full font-black text-xs uppercase tracking-widest hover:bg-emerald-900 transition-all"
          style={{color: '#D4AF37'}}
        >
          Explore Archives
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="flex flex-wrap items-center gap-4 md:gap-8 mb-16 overflow-x-auto pb-4 scrollbar-hide">
        {[
          { id: 'cart', label: '01 Review' },
          { id: 'info', label: '02 Logistics' },
          { id: 'payment', label: '03 Secure Pay' }
        ].map((s, idx) => (
          <React.Fragment key={s.id}>
            <div className="flex items-center gap-3 shrink-0">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black transition-all ${
                step === s.id ? 'bg-emerald-950 text-[#D4AF37]' : 'bg-stone-100 text-stone-400'
              }`}>
                {idx + 1}
              </div>
              <span className={`text-[10px] uppercase font-black tracking-[0.3em] ${
                step === s.id ? 'text-emerald-950' : 'text-stone-300'
              }`}>
                {s.label}
              </span>
            </div>
            {idx < 2 && <div className="hidden md:block w-12 h-px bg-stone-200"></div>}
          </React.Fragment>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2">
          {step === 'cart' && (
            <div className="space-y-6 animate-in slide-in-from-left duration-500">
              <h2 className="text-5xl font-black text-stone-900 tracking-tighter uppercase mb-10">Unit Review</h2>
              {items.map((item) => (
                <div key={item.product.id} className="bg-white rounded-[2rem] p-6 border border-stone-100 shadow-sm flex items-center gap-8 group">
                  <div className="w-32 h-32 rounded-2xl overflow-hidden bg-stone-100 shrink-0 border-2 border-white shadow-md">
                    <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  
                  <div className="flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-xl font-bold text-stone-900 tracking-tight">{item.product.name}</h3>
                        <p className="text-[10px] font-black text-emerald-900 uppercase tracking-widest">{item.product.category} Protocol</p>
                      </div>
                      <span className="text-lg font-bold text-stone-900">{formatPrice(item.product.price * item.quantity)}</span>
                    </div>
                    
                    <div className="flex items-center gap-6 mt-6">
                      <div className="flex items-center bg-stone-100 rounded-full px-4 py-1.5 border border-stone-200">
                        <button onClick={() => onUpdateQuantity(item.product.id, -1)} className="p-1 hover:text-emerald-900 transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                          </svg>
                        </button>
                        <span className="mx-6 text-sm font-bold text-stone-800">{item.quantity}</span>
                        <button onClick={() => onUpdateQuantity(item.product.id, 1)} className="p-1 hover:text-emerald-900 transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>
                      <button 
                        onClick={() => onUpdateQuantity(item.product.id, -item.quantity)}
                        className="text-[10px] font-black uppercase text-stone-400 hover:text-red-600 transition-colors tracking-widest"
                      >
                        Remove Unit
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {step === 'info' && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
              <h2 className="text-5xl font-black text-stone-900 tracking-tighter uppercase mb-10">Stable Identification</h2>
              <form id="info-form" onSubmit={handleToPayment} className="space-y-8 bg-white p-12 rounded-[3rem] border border-stone-100 shadow-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Full Name / Stable Name</label>
                    <input required name="fullName" value={clientInfo.fullName} onChange={handleInputChange} className="w-full px-6 py-4 bg-stone-50 border border-stone-200 rounded-2xl focus:border-emerald-900 outline-none transition-all font-bold" placeholder="e.g. Royal Windsor Stables" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Email Address (Automatic Confirmation)</label>
                    <input required type="email" name="email" value={clientInfo.email} onChange={handleInputChange} className="w-full px-6 py-4 bg-stone-50 border border-stone-200 rounded-2xl focus:border-emerald-900 outline-none transition-all font-bold" placeholder="contact@stable.com" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Contact Phone (Automatic WhatsApp)</label>
                    <input required name="phone" value={clientInfo.phone} onChange={handleInputChange} className="w-full px-6 py-4 bg-stone-50 border border-stone-200 rounded-2xl focus:border-emerald-900 outline-none transition-all font-bold" placeholder="+48 ..." />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Country</label>
                    <select name="country" value={clientInfo.country} onChange={handleInputChange} className="w-full px-6 py-4 bg-stone-50 border border-stone-200 rounded-2xl focus:border-emerald-900 outline-none transition-all font-bold appearance-none">
                      <option>Poland</option>
                      <option>United Kingdom</option>
                      <option>Germany</option>
                      <option>United Arab Emirates</option>
                      <option>Saudi Arabia</option>
                      <option>United States</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Shipping Destination Address</label>
                  <input required name="address" value={clientInfo.address} onChange={handleInputChange} className="w-full px-6 py-4 bg-stone-50 border border-stone-200 rounded-2xl focus:border-emerald-900 outline-none transition-all font-bold" placeholder="Street Name and Number" />
                </div>
              </form>
            </div>
          )}

          {step === 'payment' && (
            <div className="space-y-10 animate-in slide-in-from-right duration-500">
              <h2 className="text-5xl font-black text-stone-900 tracking-tighter uppercase mb-10">Payment Systems</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                <button 
                  onClick={() => setPaymentMethod('bank')}
                  className={`p-10 rounded-[2.5rem] border-2 transition-all flex flex-col items-center gap-6 ${paymentMethod === 'bank' ? 'border-[#D4AF37] bg-emerald-50' : 'border-stone-100 bg-white hover:border-stone-200'}`}
                >
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${paymentMethod === 'bank' ? 'bg-emerald-950 text-[#D4AF37]' : 'bg-stone-50 text-stone-400'}`}>
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14v20c0 4.418 7.163 8 16 8s16-3.582 16-8V14M8 30c0 4.418 7.163 8 16 8s16-3.582 16-8M8 22c0 4.418 7.163 8 16 8s16-3.582 16-8" /></svg>
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-black text-emerald-950 uppercase tracking-widest">Bank Transfer</h3>
                  </div>
                </button>

                <button 
                  onClick={() => setPaymentMethod('paypal')}
                  className={`p-10 rounded-[2.5rem] border-2 transition-all flex flex-col items-center gap-6 ${paymentMethod === 'paypal' ? 'border-[#D4AF37] bg-emerald-50' : 'border-stone-100 bg-white hover:border-stone-200'}`}
                >
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${paymentMethod === 'paypal' ? 'bg-[#003087] text-white' : 'bg-stone-50 text-stone-400'}`}>
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.398a.641.641 0 0 1 .632-.534H14.5c1.947 0 3.5.385 4.545 1.135 1.045.75 1.545 1.835 1.445 3.25-.1 1.415-.815 2.62-2.145 3.615l-.105.075c1.19 1.125 1.635 2.62 1.335 4.485-.455 2.815-2.615 4.5-6.47 4.5h-2.175c-.295 0-.555.205-.62.495l-.755 3.337c-.06.265-.295.49-.56.49h-.003-.003z"/></svg>
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-black text-emerald-950 uppercase tracking-widest">PayPal</h3>
                  </div>
                </button>
              </div>

              {paymentMethod === 'bank' ? (
                <div className="bg-white p-12 rounded-[3rem] border border-stone-100 shadow-xl space-y-10 animate-in fade-in duration-500">
                   <p className="text-sm font-bold text-emerald-950">Laboratory Bank Account: PL 44 1240 1037 1111 0010 4221 4482</p>
                </div>
              ) : (
                <div className="bg-white p-12 rounded-[3rem] border border-stone-100 shadow-xl space-y-8 animate-in fade-in duration-500 text-center">
                  <p className="text-lg font-bold text-emerald-900">finance@nobelspirit.pl</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-emerald-950 rounded-[3rem] p-10 text-white shadow-2xl sticky top-32">
            <h3 className="text-xs font-black uppercase tracking-[0.4em] mb-10 text-emerald-400">Omnichannel Summary</h3>
            
            <div className="space-y-6 mb-12">
              <div className="flex justify-between text-sm">
                <span className="text-stone-400">Total Units</span>
                <span className="font-bold">{items.length} Protocols</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-stone-400">Total Value</span>
                <span className="font-bold" style={{color: '#D4AF37'}}>{formatPrice(total)}</span>
              </div>
            </div>

            {step === 'cart' && (
              <button onClick={handleToInfo} className="w-full bg-[#D4AF37] text-emerald-950 py-6 rounded-2xl font-black text-xs uppercase tracking-[0.4em] hover:brightness-110 transition-all shadow-xl active:scale-[0.98]">Logistics Setup</button>
            )}

            {step === 'info' && (
              <button form="info-form" type="submit" className="w-full bg-[#D4AF37] text-emerald-950 py-6 rounded-2xl font-black text-xs uppercase tracking-[0.4em] hover:brightness-110 transition-all shadow-xl active:scale-[0.98]">Confirm Logistics</button>
            )}

            {step === 'payment' && (
              <button onClick={handleFinalize} className="w-full bg-[#D4AF37] text-emerald-950 py-6 rounded-2xl font-black text-xs uppercase tracking-[0.4em] hover:brightness-110 transition-all shadow-xl active:scale-[0.98]">Finalize & Dispatch</button>
            )}
            
            <div className="mt-8 border-t border-white/10 pt-8 space-y-3">
              <div className="flex items-center gap-3 opacity-60">
                 <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                 <span className="text-[9px] font-black uppercase tracking-widest">Auto-Email Enabled</span>
              </div>
              <div className="flex items-center gap-3 opacity-60">
                 <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                 <span className="text-[9px] font-black uppercase tracking-widest">Auto-WhatsApp Enabled</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
