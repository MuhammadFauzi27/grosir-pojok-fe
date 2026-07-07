import React from 'react';
// 1. Import useNavigate dari react-router-dom
import { useNavigate } from 'react-router-dom';

export const GudangPage = () => {
  // 2. Deklarasikan navigate
  const navigate = useNavigate();

  const dataBarang = [
    { id: 'BRG-001', nama: 'Beras Maknyus 5kg', stok: '150 Sak', kategori: 'Sembako', harga: 'Rp 65.000', status: 'aman' },
    { id: 'BRG-002', nama: 'Gula Pasir Gulaku 1kg', stok: '25 Pcs', kategori: 'Sembako', harga: 'Rp 16.500', status: 'kritis' },
    { id: 'BRG-003', nama: 'Minyak Goreng Bimoli 2L', stok: '80 Pouch', kategori: 'Sembako', harga: 'Rp 34.000', status: 'aman' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-24 font-sans max-w-md mx-auto relative shadow-sm border-x border-gray-200">
      <div className="p-5 pt-8">
        <h1 className="text-2xl font-bold text-[#0b2154] mb-1">Data Barang</h1>
        <p className="text-sm text-gray-600">Kelola inventaris gudang, harga, dan stok terkini.</p>
      </div>

      <div className="px-5 mb-4">
        <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
          <div className="relative mb-3">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" x2="16.65" y1="21" y2="16.65" />
              </svg>
            </div>
            <input type="text" placeholder="Cari nama barang atau kode..." className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0b2154] focus:border-[#0b2154] text-sm" />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <button className="whitespace-nowrap px-4 py-1.5 bg-[#1e3a8a] text-white text-sm font-medium rounded-full">Semua Kategori</button>
            <button className="whitespace-nowrap px-4 py-1.5 bg-blue-50 text-[#1e3a8a] border border-blue-200 text-sm font-medium rounded-full">Sembako</button>
            <button className="whitespace-nowrap px-4 py-1.5 bg-blue-50 text-[#1e3a8a] border border-blue-200 text-sm font-medium rounded-full">Minuman</button>
          </div>
        </div>
      </div>

      <div className="px-5 space-y-3">
        {dataBarang.map((item, index) => (
          <div key={index} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-gray-900 text-[15px]">{item.nama}</h3>
                <p className="text-sm text-gray-500 mt-0.5">{item.id}</p>
              </div>
              <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${item.status === 'aman' ? 'bg-[#8df3b4] text-[#065f46]' : 'bg-red-100 text-red-700'}`}>{item.stok}</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm"><span className="text-gray-600">Kategori</span><span className="font-medium text-gray-900">{item.kategori}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-600">Harga</span><span className="font-medium text-gray-900">{item.harga}</span></div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Tambahkan fungsi onClick={...} pada tombol ini */}
      <button 
        onClick={() => navigate('/tambah-barang')}
        className="fixed bottom-24 right-4 sm:right-auto sm:ml-[340px] bg-[#006A4E] text-white p-4 rounded-2xl shadow-lg hover:bg-[#00523b] transition-colors"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>

      <div className="fixed bottom-0 left-0 w-full max-w-md mx-auto sm:left-auto bg-white border-t border-gray-200">
        <div className="flex justify-center items-center h-20 px-6">
          <button className="flex flex-col items-center justify-center w-32 h-14 bg-[#a7f3d0] text-[#065f46] rounded-2xl transition-colors">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
              <path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" />
            </svg>
            <span className="text-[11px] font-bold mt-1">Inventory</span>
          </button>
        </div>
      </div>
    </div>
  );
};