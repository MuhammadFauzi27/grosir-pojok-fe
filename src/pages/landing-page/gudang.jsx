import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

// ─── Skeleton Card ────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm animate-pulse">
    <div className="flex justify-between items-start mb-4">
      <div className="flex-1 pr-4">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
        <div className="h-3 bg-gray-100 rounded w-1/3" />
      </div>
      <div className="h-7 bg-gray-200 rounded-full w-20" />
    </div>
    <div className="space-y-2">
      <div className="flex justify-between">
        <div className="h-3 bg-gray-100 rounded w-16" />
        <div className="h-3 bg-gray-200 rounded w-24" />
      </div>
      <div className="flex justify-between">
        <div className="h-3 bg-gray-100 rounded w-12" />
        <div className="h-3 bg-gray-200 rounded w-28" />
      </div>
    </div>
  </div>
);

// ─── Stok Badge Helper ─────────────────────────────────────────────────────────
const getStokBadge = (jumlah) => {
  if (jumlah === 0) return { label: 'Habis', cls: 'bg-red-100 text-red-700' };
  if (jumlah <= 10) return { label: 'Kritis', cls: 'bg-red-100 text-red-700' };
  if (jumlah <= 30) return { label: 'Menipis', cls: 'bg-amber-100 text-amber-700' };
  return { label: 'Aman', cls: 'bg-[#8df3b4] text-[#065f46]' };
};

export const GudangPage = () => {
  const navigate = useNavigate();

  // ─── Data & Loading ───────────────────────────────────────────────────────
  const [barangList, setBarangList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ─── Filter & Search ──────────────────────────────────────────────────────
  const [searchInput, setSearchInput] = useState('');
  const [activeKategori, setActiveKategori] = useState('');   // '' = Semua
  const [kategoriTabs, setKategoriTabs] = useState([]);

  // debounce ref
  const searchTimeout = useRef(null);

  // =========================================================================
  // Fetch barang (dipanggil ulang setiap search/filter berubah)
  // =========================================================================
  const fetchBarang = useCallback(async (search = '', kategori = '') => {
    setLoading(true);
    setError('');
    try {
      const params = { limit: 100 };
      if (search.trim()) params.search = search.trim();
      if (kategori) params.kategori = kategori;

      const res = await api.get('/barang', { params });
      const data = res.data?.data ?? [];
      setBarangList(data);

      // Bangun tabs kategori unik dari seluruh data (tanpa filter kategori)
      if (!kategori && !search) {
        const unik = [...new Set(data.map((b) => b.kategori).filter(Boolean))];
        setKategoriTabs(unik);
      }
    } catch (err) {
      console.error('Gagal fetch barang:', err);
      setError('Gagal memuat data barang. Periksa koneksi dan coba lagi.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchBarang('', '');
  }, [fetchBarang]);

  // ─── Search: debounce 350ms ────────────────────────────────────────────────
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchInput(val);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      fetchBarang(val, activeKategori);
    }, 350);
  };

  // ─── Filter Kategori ──────────────────────────────────────────────────────
  const handleKategoriClick = (kat) => {
    setActiveKategori(kat);
    fetchBarang(searchInput, kat);
  };

  // ─── Refresh manual ──────────────────────────────────────────────────────
  const handleRefresh = () => {
    setSearchInput('');
    setActiveKategori('');
    fetchBarang('', '');
  };

  // =========================================================================
  // RENDER
  // =========================================================================
  return (
    <div className="min-h-screen bg-slate-50 pb-24 font-sans max-w-md mx-auto relative shadow-sm border-x border-gray-200">

      {/* Header */}
      <div className="p-5 pt-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0b2154] mb-1">Data Barang</h1>
          <p className="text-sm text-gray-600">Kelola inventaris gudang, harga, dan stok terkini.</p>
        </div>
        {/* Tombol refresh */}
        <button
          onClick={handleRefresh}
          className="mt-1 p-2 rounded-lg text-gray-500 hover:text-[#0b2154] hover:bg-blue-50 transition-colors"
          title="Muat ulang data"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 4 23 10 17 10" />
            <polyline points="1 20 1 14 7 14" />
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
          </svg>
        </button>
      </div>

      {/* Search + Filter */}
      <div className="px-5 mb-4">
        <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
          {/* Search input */}
          <div className="relative mb-3">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" x2="16.65" y1="21" y2="16.65" />
              </svg>
            </div>
            <input
              type="text"
              value={searchInput}
              onChange={handleSearchChange}
              placeholder="Cari nama barang..."
              className="block w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0b2154] focus:border-[#0b2154] text-sm"
            />
            {/* Clear button */}
            {searchInput && (
              <button
                onClick={() => { setSearchInput(''); fetchBarang('', activeKategori); }}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-700"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>

          {/* Kategori tabs — hanya tampil jika ada data */}
          {kategoriTabs.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
              <button
                onClick={() => handleKategoriClick('')}
                className={`whitespace-nowrap px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${
                  activeKategori === ''
                    ? 'bg-[#1e3a8a] text-white'
                    : 'bg-blue-50 text-[#1e3a8a] border border-blue-200 hover:bg-blue-100'
                }`}
              >
                Semua
              </button>
              {kategoriTabs.map((kat) => (
                <button
                  key={kat}
                  onClick={() => handleKategoriClick(kat)}
                  className={`whitespace-nowrap px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${
                    activeKategori === kat
                      ? 'bg-[#1e3a8a] text-white'
                      : 'bg-blue-50 text-[#1e3a8a] border border-blue-200 hover:bg-blue-100'
                  }`}
                >
                  {kat}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Jumlah hasil */}
      {!loading && !error && (
        <div className="px-5 mb-2">
          <p className="text-xs text-gray-400 font-medium">
            {barangList.length} barang ditemukan
            {activeKategori ? ` · Kategori: ${activeKategori}` : ''}
            {searchInput ? ` · Pencarian: "${searchInput}"` : ''}
          </p>
        </div>
      )}

      {/* Konten */}
      <div className="px-5 space-y-3">

        {/* Loading skeleton */}
        {loading && (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-5 text-center">
            <svg className="mx-auto mb-2 text-red-400" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p className="text-sm font-semibold text-red-700 mb-1">Gagal memuat data</p>
            <p className="text-xs text-red-500 mb-3">{error}</p>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-red-100 text-red-700 text-sm font-semibold rounded-lg hover:bg-red-200"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && barangList.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
            <svg className="mx-auto mb-3 text-gray-300" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
              <path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" />
            </svg>
            <p className="text-sm font-semibold text-gray-500 mb-1">Belum ada barang</p>
            <p className="text-xs text-gray-400">
              {searchInput || activeKategori
                ? 'Tidak ada barang yang cocok dengan filter.'
                : 'Tambah barang pertama dengan menekan tombol + di bawah.'}
            </p>
          </div>
        )}

        {/* List barang (read-only) */}
        {!loading && !error && barangList.map((item) => {
          const badge = getStokBadge(item.jumlah_stok ?? 0);
          return (
            <div key={item.id_barang} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              {/* Nama + badge stok */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1 pr-3 min-w-0">
                  <h3 className="font-bold text-gray-900 text-[15px] leading-snug truncate">
                    {item.nama_barang}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">ID #{item.id_barang}</p>
                </div>
                <span className={`shrink-0 text-xs font-bold px-3 py-1.5 rounded-full ${badge.cls}`}>
                  {item.jumlah_stok ?? 0} {item.nama_satuan}
                </span>
              </div>

              {/* Detail */}
              <div className="space-y-1.5 pt-2 border-t border-gray-100">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Kategori</span>
                  <span className="font-medium text-gray-900">{item.kategori ?? '—'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Satuan</span>
                  <span className="font-medium text-gray-900">{item.nama_satuan ?? '—'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Harga Jual</span>
                  <span className="font-semibold text-[#0b2154]">
                    Rp {Number(item.harga_barang ?? 0).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* Status stok label bawah */}
              <div className="mt-2.5 flex items-center gap-1.5">
                <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${badge.cls}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    badge.label === 'Aman' ? 'bg-[#065f46]' :
                    badge.label === 'Menipis' ? 'bg-amber-600' : 'bg-red-600'
                  }`} />
                  Stok {badge.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* FAB Tambah Barang */}
      <button
        onClick={() => navigate('/tambah-barang')}
        className="fixed bottom-24 right-4 sm:right-auto sm:ml-[340px] bg-[#006A4E] text-white p-4 rounded-2xl shadow-lg hover:bg-[#00523b] transition-colors active:scale-95"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>

      {/* Bottom Nav */}
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