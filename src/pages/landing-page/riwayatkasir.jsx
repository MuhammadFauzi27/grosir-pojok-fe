import React from 'react';
import { useNavigate } from 'react-router-dom';

export const RiwayatKasirPage = () => {
  const navigate = useNavigate();

  const riwayatTransaksi = [
    { id: 'TRX-20231027-0142', tanggal: '27 Okt 2023, 14:32 WIB', kasir: 'Budi Santoso', total: 'Rp 3.450.000', status: 'SELESAI' },
    { id: 'TRX-20231027-0141', tanggal: '27 Okt 2023, 14:15 WIB', kasir: 'Budi Santoso', total: 'Rp 8.125.000', status: 'SELESAI' },
    { id: 'TRX-20231027-0138', tanggal: '27 Okt 2023, 13:20 WIB', kasir: 'Budi Santoso', total: 'Rp 450.000', status: 'DIBATALKAN' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans max-w-md mx-auto relative shadow-sm border-x border-gray-200 pb-24">
      
      {/* Header Riwayat */}
      <div className="bg-white px-5 py-4 flex items-center justify-between border-b border-gray-200 sticky top-0 z-10">
        <button className="text-gray-800">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <h1 className="text-xl font-bold text-[#0b2154]">Riwayat</h1>
        <button className="text-[#0b2154]">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" x2="16.65" y1="21" y2="16.65" />
          </svg>
        </button>
      </div>

      {/* Statistik Cards */}
      <div className="p-5 space-y-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs text-gray-500 font-bold uppercase mb-1">Total Transaksi Hari Ini</p>
          <div className="flex items-end gap-2">
            <h2 className="text-2xl font-bold text-gray-900">142</h2>
            <span className="text-xs font-bold text-green-600 mb-1">↗ +12%</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-xs text-gray-500 font-bold uppercase mb-1">Pendapatan Hari Ini</p>
            <h2 className="text-lg font-bold text-gray-900">Rp 45.2M</h2>
            <span className="text-[10px] font-bold text-green-600">↗ +5%</span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-xs text-gray-500 font-bold uppercase mb-1">Barang Terjual</p>
            <h2 className="text-lg font-bold text-gray-900">2,841</h2>
            <span className="text-[10px] text-gray-400">unit</span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="px-5 flex gap-2 items-center mb-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/></svg>
          </div>
          <input type="text" placeholder="Cari nota..." className="w-full pl-9 pr-3 py-2 bg-slate-100 border-none rounded-lg text-sm" />
        </div>
        <button className="p-2.5 bg-slate-100 rounded-lg text-gray-600"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="21" y2="21"/><line x1="4" x2="20" y1="3" y2="3"/><line x1="12" x2="12" y1="3" y2="21"/></svg></button>
        <button className="p-2.5 bg-[#0b2154] rounded-lg text-white"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg></button>
      </div>

      {/* List Transaksi */}
      <div className="px-5 space-y-4 pb-10">
        {riwayatTransaksi.map((item, index) => (
          <div key={index} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-gray-900 text-sm">{item.id}</h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.status === 'SELESAI' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {item.status}
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-3">{item.tanggal} • <span className="font-medium text-gray-700">{item.kasir}</span></p>
            <p className="font-bold text-gray-900 text-base mb-3">{item.total}</p>
            <button className="w-full py-2.5 rounded-lg border border-gray-200 text-[#0b2154] font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-50">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              Lihat Nota
            </button>
          </div>
        ))}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 w-full max-w-md mx-auto sm:left-auto bg-white border-t border-gray-200 z-30">
        <div className="flex justify-evenly items-center h-20 px-6">
          <button onClick={() => navigate('/kasir')} className="flex flex-col items-center justify-center w-24 h-14 text-gray-500 hover:text-gray-900 transition-colors">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="16" height="20" x="4" y="2" rx="2" /><line x1="8" x2="16" y1="6" y2="6" /><line x1="16" x2="16" y1="14" y2="18" /><path d="M16 10h.01" /><path d="M12 10h.01" /><path d="M8 10h.01" /><path d="M12 14h.01" /><path d="M8 14h.01" /><path d="M12 18h.01" /><path d="M8 18h.01" />
            </svg>
            <span className="text-[11px] font-medium mt-1">POS</span>
          </button>
          <button className="flex flex-col items-center justify-center w-24 h-14 bg-[#a7f3d0] text-[#065f46] rounded-2xl transition-colors">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><polyline points="10 9 9 9 8 9"/>
            </svg>
            <span className="text-[11px] font-bold mt-1">Riwayat</span>
          </button>
        </div>
      </div>

    </div>
  );
};