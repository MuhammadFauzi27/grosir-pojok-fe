import React, { useState } from 'react';

export const LoginPage = () => {
  // State UI murni untuk efek transisi tombol saat diklik
  const [role, setRole] = useState('kasir');

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      {/* Container Utama / Card Login */}
      <div className="bg-white rounded-xl shadow-lg w-full max-w-sm overflow-hidden border border-gray-100">
        
        {/* Garis Aksen Biru di atas Card */}
        <div className="h-2 bg-[#0b2154] w-full"></div>

        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#0b2154] mb-1">Grosir Pojok</h1>
            <p className="text-gray-500 text-sm">Sistem Informasi Internal</p>
          </div>

          {/* Pemilihan Peran (Role) */}
          <div className="mb-6">
            <label className="block text-xs font-bold text-gray-800 tracking-wider mb-3 uppercase">
              Pilih Peran
            </label>
            <div className="flex gap-4">
              {/* Tombol Kasir */}
              <button
                type="button"
                onClick={() => setRole('kasir')}
                className={`flex-1 py-4 flex flex-col items-center justify-center gap-2 rounded-md border-2 transition-all ${
                  role === 'kasir'
                    ? 'border-[#0b2154] bg-blue-50/50 text-[#0b2154]'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                }`}
              >
                {/* SVG Ikon Kalkulator (Hardcoded) */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="16" height="20" x="4" y="2" rx="2" />
                  <line x1="8" x2="16" y1="6" y2="6" />
                  <line x1="16" x2="16" y1="14" y2="18" />
                  <path d="M16 10h.01" /><path d="M12 10h.01" /><path d="M8 10h.01" />
                  <path d="M12 14h.01" /><path d="M8 14h.01" />
                  <path d="M12 18h.01" /><path d="M8 18h.01" />
                </svg>
                <span className="font-semibold text-sm">Kasir</span>
              </button>

              {/* Tombol Pegawai Gudang */}
              <button
                type="button"
                onClick={() => setRole('gudang')}
                className={`flex-1 py-4 flex flex-col items-center justify-center gap-2 rounded-md border-2 transition-all ${
                  role === 'gudang'
                    ? 'border-[#0b2154] bg-blue-50/50 text-[#0b2154]'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                }`}
              >
                {/* SVG Ikon Kardus/Box (Hardcoded) */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                  <path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" />
                </svg>
                <span className="font-semibold text-sm text-center leading-tight">
                  Pegawai Gudang
                </span>
              </button>
            </div>
          </div>

          {/* Form Login */}
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            
            {/* Input ID Pengguna */}
            <div>
              <label className="block text-xs font-bold text-gray-800 tracking-wider mb-2 uppercase">
                ID Pengguna
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  {/* SVG Ikon User */}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Masukkan ID Anda"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#0b2154] focus:border-[#0b2154] text-sm transition-colors"
                />
              </div>
            </div>

            {/* Input Kata Sandi */}
            <div>
              <label className="block text-xs font-bold text-gray-800 tracking-wider mb-2 uppercase">
                Kata Sandi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  {/* SVG Ikon Gembok */}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#0b2154] focus:border-[#0b2154] text-sm transition-colors"
                />
              </div>
            </div>

            {/* Tombol Masuk */}
            <button
              type="submit"
              className="w-full bg-[#0b2154] text-white py-3.5 rounded-md font-semibold mt-2 flex items-center justify-center gap-2 hover:bg-blue-900 transition-colors shadow-sm"
            >
              Masuk Sistem 
              {/* SVG Ikon Panah */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              Versi 2.4.1 • <span className="font-bold text-[#0b2154] cursor-pointer hover:underline">Bantuan Teknis</span>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};