import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const TambahBarangPage = () => {
  const navigate = useNavigate();

  // State untuk mengatur status checked pada kemasan
  const [kemasan, setKemasan] = useState({ dus: true, pak: false, pcs: true });

  const toggleKemasan = (jenis) => {
    setKemasan({ ...kemasan, [jenis]: !kemasan[jenis] });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans max-w-md mx-auto relative shadow-sm border-x border-gray-200 pb-24">
      
      {/* Header Sticky dengan Tombol Back */}
      <div className="bg-white px-4 py-4 flex items-center border-b border-gray-200 sticky top-0 z-10">
        <button onClick={() => navigate('/gudang')} className="mr-3 text-gray-600 hover:text-gray-900">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
          </svg>
        </button>
        <h1 className="text-lg font-bold text-[#0b2154]">Tambah Barang Baru</h1>
      </div>

      <div className="p-4">
        {/* Card Form Utama */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          
          {/* Section 1: Informasi Dasar */}
          <div className="mb-6">
            <h2 className="text-base font-bold text-gray-900 mb-4 border-b pb-2">Informasi Dasar</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">ID Barang / SKU</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 5v14"/><path d="M8 5v14"/><path d="M12 5v14"/><path d="M17 5v14"/><path d="M21 5v14"/>
                    </svg>
                  </div>
                  <input type="text" placeholder="Contoh: BRG-001" className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#0b2154] text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nama Barang</label>
                <input type="text" placeholder="Contoh: Beras Premium 5kg" className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#0b2154] text-sm" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Kategori</label>
                <div className="relative">
                  <select className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg appearance-none focus:ring-1 focus:ring-[#0b2154] text-sm bg-white">
                    <option value="">Pilih Kategori...</option>
                    <option value="sembako">Sembako</option>
                    <option value="minuman">Minuman</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-500">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Kemasan & Harga Satuan */}
          <div className="mb-6">
            <h2 className="text-base font-bold text-gray-900 mb-2 border-b pb-2">Kemasan & Harga Satuan</h2>
            <p className="text-xs text-gray-500 mb-4 leading-relaxed">
              Pilih unit kemasan yang tersedia untuk barang ini dan tentukan harga jual grosir per unitnya.
            </p>
            
            <div className="space-y-3">
              {/* Row Dus */}
              <div className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${kemasan.dus ? 'bg-blue-50/40 border-blue-200' : 'bg-white border-gray-200'}`}>
                <button type="button" onClick={() => toggleKemasan('dus')} className="flex items-center justify-center w-6 h-6 shrink-0">
                  {kemasan.dus ? (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="#1e40af" stroke="#1e40af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="m9 12 2 2 4-4" stroke="#ffffff"/></svg>
                  ) : (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="4"/></svg>
                  )}
                </button>
                <span className="font-bold text-sm w-10">Dus</span>
                <div className="relative flex-1">
                  <span className="absolute left-3 top-2.5 text-sm text-gray-500 font-medium">Rp</span>
                  <input type="text" defaultValue="150000" className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-[#0b2154]" />
                </div>
              </div>

              {/* Row Pak */}
              <div className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${kemasan.pak ? 'bg-blue-50/40 border-blue-200' : 'bg-white border-gray-200'}`}>
                <button type="button" onClick={() => toggleKemasan('pak')} className="flex items-center justify-center w-6 h-6 shrink-0">
                  {kemasan.pak ? (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="#1e40af" stroke="#1e40af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="m9 12 2 2 4-4" stroke="#ffffff"/></svg>
                  ) : (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="4"/></svg>
                  )}
                </button>
                <span className="font-bold text-sm w-10">Pak</span>
                <div className="relative flex-1">
                  <span className="absolute left-3 top-2.5 text-sm text-gray-500 font-medium">Rp</span>
                  <input type="text" defaultValue="0" className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-[#0b2154]" />
                </div>
              </div>

              {/* Row Pcs */}
              <div className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${kemasan.pcs ? 'bg-blue-50/40 border-blue-200' : 'bg-white border-gray-200'}`}>
                <button type="button" onClick={() => toggleKemasan('pcs')} className="flex items-center justify-center w-6 h-6 shrink-0">
                  {kemasan.pcs ? (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="#1e40af" stroke="#1e40af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="m9 12 2 2 4-4" stroke="#ffffff"/></svg>
                  ) : (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="4"/></svg>
                  )}
                </button>
                <span className="font-bold text-sm w-10">Pcs</span>
                <div className="relative flex-1">
                  <span className="absolute left-3 top-2.5 text-sm text-gray-500 font-medium">Rp</span>
                  <input type="text" defaultValue="6500" className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-[#0b2154]" />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Stok Awal */}
          <div>
            <h2 className="text-base font-bold text-gray-900 mb-4 border-b pb-2">Stok Awal</h2>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Jumlah Fisik</label>
                <input type="number" defaultValue="50" className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#0b2154] text-sm" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Satuan Dasar</label>
                <div className="relative">
                  <select className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg appearance-none focus:ring-1 focus:ring-[#0b2154] text-sm bg-white">
                    <option value="pcs">Pcs</option>
                    <option value="pak">Pak</option>
                    <option value="dus">Dus</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-500">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Footer Aksi (Simpan & Batal) */}
      <div className="fixed bottom-0 left-0 w-full max-w-md mx-auto sm:left-auto bg-white border-t border-gray-200 p-4">
        <div className="flex gap-3">
          <button onClick={() => navigate('/gudang')} className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-lg border border-gray-200 hover:bg-gray-200">
            Batal
          </button>
          <button className="flex-[2] py-3 bg-[#0b2154] text-white font-bold rounded-lg hover:bg-blue-900 shadow-sm">
            Simpan Barang
          </button>
        </div>
      </div>

    </div>
  );
};