import React from 'react';
import { useNavigate } from 'react-router-dom';

export const TambahBarangPage = () => {
  const navigate = useNavigate();

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
              {/* Note: Jika butuh input ID Barang, bisa ditambahkan di sini */}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nama Barang</label>
                <input type="text" placeholder="Contoh: Beras Premium 5kg" className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0b2154] focus:border-[#0b2154] text-sm" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Kategori</label>
                <div className="relative">
                  <select className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-1 focus:ring-[#0b2154] focus:border-[#0b2154] text-sm bg-white">
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

          {/* Section 2: Harga Satuan (Revisi: Hanya menyisakan 1 text field) */}
          <div className="mb-6">
            <h2 className="text-base font-bold text-gray-900 mb-2 border-b pb-2">Harga Satuan</h2>
            <p className="text-xs text-gray-500 mb-4 leading-relaxed">
              Tentukan harga jual grosir untuk barang ini.
            </p>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Harga Jual</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-sm text-gray-500 font-medium">Rp</span>
                <input 
                  type="text" 
                  defaultValue="150000" 
                  className="block w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#0b2154] focus:border-[#0b2154]" 
                />
              </div>
            </div>
          </div>

          {/* Section 3: Stok Awal */}
          <div>
            <h2 className="text-base font-bold text-gray-900 mb-4 border-b pb-2">Stok Awal</h2>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Jumlah Fisik</label>
                <input type="number" defaultValue="50" className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0b2154] focus:border-[#0b2154] text-sm" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Satuan Dasar</label>
                <div className="relative">
                  <select className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-1 focus:ring-[#0b2154] focus:border-[#0b2154] text-sm bg-white">
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