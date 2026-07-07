import React from 'react';
import { useNavigate } from 'react-router-dom';

export const KasirPage = () => {
  const navigate = useNavigate();

  return (
    // pb-[250px] disesuaikan untuk ruang scroll yang lebih pas
    <div className="min-h-screen bg-slate-50 font-sans max-w-md mx-auto relative shadow-sm border-x border-gray-200 pb-[250px]">
      
      {/* Header Kasir */}
      <div className="bg-white px-5 py-4 flex items-center justify-between border-b border-gray-200 sticky top-0 z-10">
        <button className="text-gray-800">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <h1 className="text-xl font-bold text-[#0b2154]">Grosir Pojok</h1>
        <button className="text-[#0b2154]">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" x2="16.65" y1="21" y2="16.65" />
          </svg>
        </button>
      </div>

      {/* Info Order */}
      <div className="px-5 pt-6 pb-4">
        <h2 className="text-lg font-bold text-gray-900">Current Order</h2>
        <p className="text-sm text-gray-500">Order #INV-20231024-001</p>
      </div>

      {/* List Pesanan */}
      <div className="px-5 space-y-4">
        
        {/* Item 1 */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="flex gap-3">
              <div className="w-14 h-14 bg-blue-50 rounded-lg border border-blue-100 flex items-center justify-center text-blue-800">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 leading-tight">Indomie Goreng<br/>Special</h3>
                <p className="text-xs text-gray-500 mt-1">SKU: IND-GRG-001</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-[#0b2154] text-sm">Rp 110.000</p>
              <p className="text-xs text-gray-400 line-through">Rp 120.000</p>
            </div>
          </div>
          <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
            <div className="flex rounded-md overflow-hidden border border-gray-200 text-xs font-medium">
              <button className="bg-[#1e3a8a] text-white px-3 py-1.5">Dus</button>
              <button className="bg-white text-gray-600 px-3 py-1.5 border-l border-r border-gray-200">Pak</button>
              <button className="bg-white text-gray-600 px-3 py-1.5">Pcs</button>
            </div>
            <div className="flex items-center gap-3 border border-gray-200 rounded-md px-2 py-1">
              <button className="text-gray-500 hover:text-gray-900"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
              <span className="font-semibold text-sm w-4 text-center">2</span>
              <button className="text-gray-500 hover:text-gray-900"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
            </div>
          </div>
        </div>

        {/* Item 2 */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="flex gap-3">
              <div className="w-14 h-14 bg-[#3E2723] rounded-lg border border-gray-200 flex items-center justify-center text-amber-50">
                <span className="font-bold text-xs text-center leading-none">KAPAL<br/>API</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 leading-tight">Kapal Api Mix</h3>
                <p className="text-xs text-gray-500 mt-1">SKU: KPL-MIX-055</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-[#0b2154] text-sm">Rp 12.500</p>
            </div>
          </div>
          <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
            <div className="flex rounded-md overflow-hidden border border-gray-200 text-xs font-medium">
              <button className="bg-white text-gray-600 px-3 py-1.5">Dus</button>
              <button className="bg-[#1e3a8a] text-white px-3 py-1.5 border-l border-r border-[#1e3a8a]">Pak</button>
              <button className="bg-white text-gray-600 px-3 py-1.5 border-l border-gray-200">Pcs</button>
            </div>
            <div className="flex items-center gap-3 border border-gray-200 rounded-md px-2 py-1">
              <button className="text-gray-500 hover:text-gray-900"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
              <span className="font-semibold text-sm w-4 text-center">5</span>
              <button className="text-gray-500 hover:text-gray-900"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
            </div>
          </div>
        </div>

        {/* Tombol Scan or Search Item */}
        <button className="w-full mt-2 flex items-center justify-center gap-2 py-4 border-2 border-dashed border-[#a5b4fc] bg-indigo-50/30 rounded-xl text-[#0b2154] font-bold text-sm hover:bg-indigo-50 transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
          </svg>
          Scan or Search Item
        </button>
      </div>

      {/* Floating Summary & Payment Button (Tetap Fixed) */}
      <div className="fixed bottom-20 left-0 w-full max-w-md mx-auto sm:left-auto bg-white border-t border-gray-200 p-4 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="flex justify-between items-center text-[10px] text-gray-600 mb-1">
          <span>Subtotal (7 items)</span>
          <span className="font-medium text-gray-900">Rp 282.500</span>
        </div>
        <div className="flex justify-between items-center text-[10px] text-gray-600 mb-2">
          <span>Tax (11%)</span>
          <span className="font-medium text-gray-900">Rp 31.075</span>
        </div>
        <div className="flex justify-between items-end mb-3">
          <span className="font-bold text-[15px] text-gray-900">Total</span>
          <span className="font-bold text-[19px] text-[#0b2154] leading-none">Rp 313.575</span>
        </div>
        <button 
          onClick={() => navigate('/nota-kasir')}
          className="w-full bg-[#0b2154] text-white py-2.5 rounded-lg font-bold text-[12px] uppercase tracking-wide flex items-center justify-center gap-1.5 hover:bg-blue-900 transition-colors"
        >
          Proceed to Payment 
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
          </svg>
        </button>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 w-full max-w-md mx-auto sm:left-auto bg-white border-t border-gray-200 z-30">
        <div className="flex justify-evenly items-center h-20 px-6">
          <button className="flex flex-col items-center justify-center w-24 h-14 bg-[#a7f3d0] text-[#065f46] rounded-2xl transition-colors">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="16" height="20" x="4" y="2" rx="2" /><line x1="8" x2="16" y1="6" y2="6" /><line x1="16" x2="16" y1="14" y2="18" /><path d="M16 10h.01" /><path d="M12 10h.01" /><path d="M8 10h.01" /><path d="M12 14h.01" /><path d="M8 14h.01" /><path d="M12 18h.01" /><path d="M8 18h.01" />
            </svg>
            <span className="text-[11px] font-bold mt-1">POS</span>
          </button>
          <button onClick={() => navigate('/riwayat-kasir')} className="flex flex-col items-center justify-center w-24 h-14 text-gray-500 hover:text-gray-900 transition-colors">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><polyline points="10 9 9 9 8 9"/>
            </svg>
            <span className="text-[11px] font-medium mt-1">Riwayat</span>
          </button>
        </div>
      </div>
    </div>
  );
};