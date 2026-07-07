import React from 'react';
import { useNavigate } from 'react-router-dom';

export const NotaKasirPage = () => {
  const navigate = useNavigate();

  // Data dummy transaksi untuk nota
  const items = [
    { nama: 'Beras Pandan Wangi 5kg', sku: 'BR-PW-5K', qty: 10, harga: 65000, total: 650000 },
    { nama: 'Minyak Goreng Sunco 2L', sku: 'MG-SC-2L', qty: 24, harga: 32000, total: 768000 },
    { nama: 'Gula Pasir Gulaku 1kg', sku: 'GL-GK-1K', qty: 50, harga: 14500, total: 725000 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans max-w-md mx-auto p-4 sm:p-6 pb-10">
      
      {/* Card Nota Utama */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        
        {/* Icon Success */}
        <div className="flex justify-center mb-4">
          <div className="bg-green-100 p-3 rounded-full text-[#006A4E]">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-1">Transaksi Berhasil</h1>
        <p className="text-center text-gray-500 text-sm mb-6">Nota #TRX-9982-A4</p>
        <hr className="border-gray-200 mb-6" />

        {/* Info Transaksi */}
        <div className="grid grid-cols-2 gap-4 text-sm mb-6">
          <div>
            <p className="text-gray-500 text-xs uppercase font-bold tracking-wider">Tanggal</p>
            <p className="font-semibold text-gray-900">24 Okt 2023, 14:32</p>
          </div>
          <div className="text-right">
            <p className="text-gray-500 text-xs uppercase font-bold tracking-wider">Kasir</p>
            <p className="font-semibold text-gray-900">KSR-01 (Budi)</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs uppercase font-bold tracking-wider">Pelanggan</p>
            <p className="font-semibold text-gray-900">Toko Makmur Jaya</p>
          </div>
          <div className="text-right">
            <p className="text-gray-500 text-xs uppercase font-bold tracking-wider">Tipe</p>
            <p className="font-semibold text-gray-900">Grosir / Tunai</p>
          </div>
        </div>
        <hr className="border-gray-200 mb-6 border-dashed" />

        {/* Rincian Barang */}
        <div className="space-y-4 mb-6">
          <h2 className="font-bold text-gray-900 mb-2">Rincian Barang</h2>
          {items.map((item, i) => (
            <div key={i} className="flex justify-between items-start">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{item.nama}</p>
                <p className="text-xs text-gray-500">{item.sku} • {item.qty} x Rp {item.harga.toLocaleString()}</p>
              </div>
              <p className="text-sm font-semibold text-gray-900 ml-4">Rp {item.total.toLocaleString()}</p>
            </div>
          ))}
        </div>

        <hr className="border-gray-200 mb-4" />

        {/* Totalan */}
        <div className="space-y-2 mb-8">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-semibold text-gray-900">Rp 2.143.000</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Diskon Grosir (5%)</span>
            <span className="font-semibold text-red-600">- Rp 107.150</span>
          </div>
          <div className="flex justify-between pt-2">
            <span className="font-bold text-gray-900">Total Bayar</span>
            <span className="font-bold text-[#0b2154] text-xl">Rp 2.035.850</span>
          </div>
        </div>

        {/* Tombol Navigasi yang diperbarui */}
        <button 
          onClick={() => navigate('/kasir')}
          className="w-full bg-[#006A4E] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 mb-4 hover:bg-[#00523b] transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21H8"/><path d="M16 11H8"/>
          </svg>
          Selesaikan & Potong Stok
        </button>

        <button className="text-[#0b2154] font-bold text-sm w-full py-2 hover:underline">
          Cetak Struk Fisik
        </button>

      </div>
    </div>
  );
};