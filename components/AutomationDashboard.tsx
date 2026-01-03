
import React, { useState, useEffect } from 'react';
import { getMasterSheetData, SheetRow } from '../services/sheetService';

const AutomationDashboard: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [view, setView] = useState<'editor' | 'data' | 'settings'>('data');
  const [rows, setRows] = useState<SheetRow[]>([]);

  useEffect(() => {
    if (view === 'data') {
      setRows(getMasterSheetData());
    }
  }, [view]);

  const bots = [
    {
      id: 'bot-01',
      name: 'Buyer Confirmation Bot',
      event: 'Data Change (Adds Only)',
      table: 'Orders',
      condition: 'ISNOTBLANK([Email])',
      tasks: [
        { name: 'Send Email to Customer', type: 'Email', recipient: '[Customer Email]', status: 'Enabled' }
      ]
    },
    {
      id: 'bot-02',
      name: 'Admin Notification Bot',
      event: 'Data Change (Adds Only)',
      table: 'Orders',
      tasks: [
        { name: 'Notify Headquarters', type: 'Email', recipient: '2010onlyforyou77@gmail.com', status: 'Enabled' }
      ]
    }
  ];

  return (
    <div className="bg-[#f1f3f4] min-h-screen flex flex-col font-sans">
      {/* AppSheet Header */}
      <header className="bg-[#1a73e8] text-white p-4 flex items-center justify-between shadow-md z-[100]">
        <div className="flex items-center gap-6">
          <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full transition-all">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth="2.5"/></svg>
          </button>
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
                <svg className="w-5 h-5 text-[#1a73e8]" fill="currentColor" viewBox="0 0 24 24"><path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/></svg>
             </div>
             <div>
               <h1 className="text-sm font-bold leading-tight">Nobel Spirit App</h1>
               <p className="text-[10px] opacity-70">AppSheet Lab Edition</p>
             </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
           <button className="bg-white text-[#1a73e8] px-4 py-1.5 rounded text-[11px] font-bold shadow-sm hover:bg-stone-50 transition-all">SAVE</button>
           <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-[11px] font-bold">NS</div>
        </div>
      </header>

      <div className="flex flex-grow overflow-hidden">
        {/* AppSheet Sidebar */}
        <aside className="w-64 bg-white border-r border-stone-200 flex flex-col pt-6">
          <div className="px-4 mb-8">
            <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-4">App Components</p>
            <nav className="space-y-1">
              {[
                { id: 'data', label: 'Data', icon: 'M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7c-2 0-3 1-3 3z' },
                { id: 'editor', label: 'Automation', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
                { id: 'settings', label: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
              ].map(item => (
                <button 
                  key={item.id}
                  onClick={() => setView(item.id as any)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-r-full transition-all ${view === item.id ? 'bg-[#e8f0fe] text-[#1a73e8]' : 'text-stone-600 hover:bg-stone-50'}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d={item.icon} strokeWidth="2"/></svg>
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
          <div className="px-4 mt-auto pb-8">
            <div className="bg-[#f8f9fa] p-4 rounded-xl border border-stone-100">
               <p className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1">Plan</p>
               <p className="text-xs font-black text-emerald-950">AppSheet Core (Paid)</p>
            </div>
          </div>
        </aside>

        {/* AppSheet Workspace */}
        <main className="flex-grow overflow-y-auto p-12">
          {view === 'data' && (
            <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-500">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-stone-800">Tables</h2>
                <button className="text-[#1a73e8] text-sm font-bold flex items-center gap-2 hover:underline">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeWidth="2.5"/></svg>
                  Add Table
                </button>
              </div>

              <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-stone-100 bg-stone-50/50 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#1a73e8] rounded-lg flex items-center justify-center shadow-sm">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7c-2 0-3 1-3 3zM9 4v16M4 11h16" strokeWidth="2"/></svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-stone-900">Orders</h3>
                      <p className="text-[11px] text-stone-400">Spreadsheet source: NobelSpirit_Master_Sheet</p>
                    </div>
                  </div>
                  <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest">Connected</span>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="bg-stone-50 border-b border-stone-100">
                        {['Row ID', 'Timestamp', 'Customer', 'Product', 'Total', 'Bot Status'].map(h => (
                          <th key={h} className="px-6 py-4 font-bold text-stone-500 uppercase text-[10px] tracking-widest">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-50">
                      {rows.map(row => (
                        <tr key={row.id} className="hover:bg-blue-50/30 transition-colors">
                          <td className="px-6 py-4 font-mono text-xs text-blue-600">{row.id}</td>
                          <td className="px-6 py-4 text-stone-500">{new Date(row.timestamp).toLocaleDateString()}</td>
                          <td className="px-6 py-4 font-bold text-stone-800">{row.customer}</td>
                          <td className="px-6 py-4 text-stone-500 max-w-[150px] truncate">{row.product}</td>
                          <td className="px-6 py-4 font-black">{row.total}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[10px] font-bold ${row.status === 'Processed' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${row.status === 'Processed' ? 'bg-emerald-500' : 'bg-orange-500'}`}></span>
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {view === 'editor' && (
            <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-right duration-500">
               <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-stone-800">Automations</h2>
                <button className="bg-[#1a73e8] text-white px-6 py-2 rounded text-sm font-bold flex items-center gap-2 shadow-md">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeWidth="2.5"/></svg>
                  New Bot
                </button>
              </div>

              {bots.map(bot => (
                <div key={bot.id} className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm group">
                  <div className="p-6 border-b border-stone-100 flex items-center justify-between group-hover:bg-stone-50 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeWidth="2"/></svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-stone-900">{bot.name}</h3>
                        <p className="text-[11px] text-stone-400">Trigger: {bot.event} on {bot.table}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                       <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked className="sr-only peer" readOnly />
                          <div className="w-9 h-5 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#1a73e8]"></div>
                       </label>
                       <button className="text-stone-400 hover:text-stone-600 transition-all"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" strokeWidth="2.5"/></svg></button>
                    </div>
                  </div>
                  
                  <div className="p-8 space-y-8">
                     <div>
                       <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-4">Event Configuration</h4>
                       <div className="grid grid-cols-2 gap-6">
                         <div className="p-4 bg-stone-50 rounded-lg border border-stone-100">
                           <p className="text-[9px] font-bold text-stone-400 uppercase mb-1">Event Type</p>
                           <p className="text-sm font-medium text-stone-800">{bot.event}</p>
                         </div>
                         <div className="p-4 bg-stone-50 rounded-lg border border-stone-100">
                           <p className="text-[9px] font-bold text-stone-400 uppercase mb-1">Condition</p>
                           <p className="text-sm font-mono text-[#1a73e8]">{bot.condition || 'None'}</p>
                         </div>
                       </div>
                     </div>

                     <div>
                       <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-4">Run Process</h4>
                       <div className="space-y-3">
                         {bot.tasks.map((task, i) => (
                           <div key={i} className="flex items-center justify-between p-4 bg-white border border-stone-200 rounded-lg shadow-sm">
                             <div className="flex items-center gap-4">
                               <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded flex items-center justify-center">
                                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeWidth="2.5"/></svg>
                               </div>
                               <div>
                                 <p className="text-sm font-bold text-stone-800">{task.name}</p>
                                 <p className="text-[10px] text-stone-400">Task Type: {task.type} to {task.recipient}</p>
                               </div>
                             </div>
                             <button className="text-[#1a73e8] text-xs font-bold hover:underline">Edit Task</button>
                           </div>
                         ))}
                         <button className="w-full py-3 border-2 border-dashed border-stone-200 rounded-lg text-stone-400 text-xs font-bold hover:bg-stone-50 hover:border-blue-200 hover:text-blue-500 transition-all">Add Step</button>
                       </div>
                     </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AutomationDashboard;
