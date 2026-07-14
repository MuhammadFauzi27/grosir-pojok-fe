import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

// ─── Skeleton Card ────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm animate-pulse">
    <div className="flex justify-between items-start mb-3">
      <div className="h-4 bg-gray-200 rounded w-2/3" />
      <div className="h-4 bg-gray-100 rounded w-1/4" />
    </div>
    <div className="h-3 bg-gray-100 rounded w-1/2 mb-4" />
    <div className="h-9 bg-gray-100 rounded-lg w-full" />
  </div>
);

// ─── Normalisasi response API ─────────────────────────────────────────────────
// Menerima berbagai kemungkinan shape: array, { data: [] }, { transaksi: [] },
// { items: [] }, { penjualan: [] }, { rows: [] }
const normalizeToArray = (raw) => {
  if (Array.isArray(raw)) return raw;
  if (!raw) return [];

  const candidates = ['data', 'transaksi', 'penjualan', 'items', 'rows', 'result'];
  for (const key of candidates) {
    if (Array.isArray(raw[key])) return raw[key];
  }
  return [];
};

// ─── Ambil nilai no_nota yang aman ────────────────────────────────────────────
// Beberapa API mengembalikan field berbeda, coba semua kemungkinan
const getNoNota = (item) =>
  item?.no_nota_jual ?? item?.no_nota ?? item?.nomor_nota ?? item?.id_penjualan ?? null;

export const RiwayatKasirPage = () => {
  const navigate = useNavigate();

  // ─── State ────────────────────────────────────────────────────────────────
  const [riwayatList, setRiwayatList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [searchInput, setSearchInput] = useState('');

  // debounce ref
  const searchTimeout = useRef(null);

  // =========================================================================
  // Fetch riwayat (dipanggil ulang setiap search berubah)
  // Mencoba /transaksi terlebih dulu, fallback ke /penjualan
  // =========================================================================
  const fetchRiwayat = useCallback(async (search = '') => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const params = { limit: 100 };
      if (search.trim()) params.search = search.trim();

      let response;
      try {
        response = await api.get('/transaksi', { params });
      } catch (firstErr) {
        // Jika endpoint /transaksi tidak tersedia, fallback ke /penjualan
        if (firstErr?.response?.status === 404) {
          response = await api.get('/penjualan', { params });
        } else {
          throw firstErr;
        }
      }

      const list = normalizeToArray(response.data);

      // Debug: tampilkan sample item agar field bisa diidentifikasi
      if (list.length > 0) {
        console.log('[RiwayatKasir] Sample item keys:', Object.keys(list[0]));
      } else {
        console.log('[RiwayatKasir] Response shape:', response.data);
      }

      setRiwayatList(list);
    } catch (error) {
      console.error('Gagal mengambil riwayat transaksi:', error);
      setErrorMsg('Gagal memuat riwayat transaksi. Periksa koneksi dan coba lagi.');
      setRiwayatList([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchRiwayat('');
  }, [fetchRiwayat]);

  // ─── Search: debounce 350ms (mirip gudang.jsx) ────────────────────────────
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchInput(val);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      fetchRiwayat(val);
    }, 350);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    fetchRiwayat('');
  };

  const handleRefresh = () => {
    setSearchInput('');
    fetchRiwayat('');
  };

  // ─── Navigasi ke nota dengan validasi ────────────────────────────────────
  const handleLihatNota = (item) => {
    const noNota = getNoNota(item);
    if (!noNota) {
      console.error('[RiwayatKasir] no_nota tidak ditemukan pada item:', item);
      alert('Nomor nota tidak ditemukan. Hubungi administrator.');
      return;
    }
    navigate(`/nota-kasir/${noNota}`);
  };

  const formatRupiah = (value) => `Rp ${Number(value || 0).toLocaleString('id-ID')}`;

  const formatTanggal = (isoDate) => {
    if (!isoDate) return '-';
    try {
      return (
        new Date(isoDate).toLocaleString('id-ID', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }) + ' WIB'
      );
    } catch {
      return isoDate;
    }
  };

  // =========================================================================
  // RENDER
  // =========================================================================
  return (
    <div className="min-h-screen bg-slate-50 font-sans max-w-md mx-auto relative shadow-sm border-x border-gray-200 pb-24">

      {/* Header */}
      <div className="bg-white px-5 py-4 flex items-center justify-between border-b border-gray-200 sticky top-0 z-10">
        <button className="text-gray-800">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <h1 className="text-xl font-bold text-[#0b2154]">Riwayat</h1>
        {/* Tombol refresh */}
        <button
          onClick={handleRefresh}
          className="p-1.5 rounded-lg text-gray-400 hover:text-[#0b2154] hover:bg-blue-50 transition-colors"
          title="Muat ulang data"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 4 23 10 17 10" />
            <polyline points="1 20 1 14 7 14" />
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
          </svg>
        </button>
      </div>

      {/* Search Bar */}
      <div className="px-5 pt-4 mb-3">
        <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" x2="16.65" y1="21" y2="16.65" />
              </svg>
            </div>
            <input
              type="text"
              value={searchInput}
              onChange={handleSearchChange}
              placeholder="Cari no. nota atau kasir..."
              className="block w-full pl-9 pr-9 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0b2154] focus:border-[#0b2154] text-sm"
            />
            {/* Clear button */}
            {searchInput && (
              <button
                onClick={handleClearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-700"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Jumlah hasil */}
      {!isLoading && !errorMsg && (
        <div className="px-5 mb-2">
          <p className="text-xs text-gray-400 font-medium">
            {riwayatList.length} transaksi ditemukan
            {searchInput ? ` · Pencarian: "${searchInput}"` : ''}
          </p>
        </div>
      )}

      {/* Pesan Error */}
      {!isLoading && errorMsg && (
        <div className="mx-5 mb-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-5 text-center">
            <svg className="mx-auto mb-2 text-red-400" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p className="text-sm font-semibold text-red-700 mb-1">Gagal memuat data</p>
            <p className="text-xs text-red-500 mb-3">{errorMsg}</p>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-red-100 text-red-700 text-sm font-semibold rounded-lg hover:bg-red-200"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      )}

      {/* Konten */}
      <div className="px-5 space-y-3">

        {/* Loading skeleton */}
        {isLoading && (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        )}

        {/* Empty state */}
        {!isLoading && !errorMsg && riwayatList.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
            <svg className="mx-auto mb-3 text-gray-300" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" x2="8" y1="13" y2="13" /><line x1="16" x2="8" y1="17" y2="17" />
            </svg>
            <p className="text-sm font-semibold text-gray-500 mb-1">Belum ada riwayat transaksi</p>
            <p className="text-xs text-gray-400">
              {searchInput
                ? 'Tidak ada transaksi yang cocok dengan pencarian.'
                : 'Belum ada transaksi yang tercatat.'}
            </p>
          </div>
        )}

        {/* List Transaksi */}
        {!isLoading && !errorMsg && riwayatList.map((item) => {
          const noNota = getNoNota(item);
          return (
            <div
              key={noNota ?? item.id ?? Math.random()}
              className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm"
            >
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold text-gray-900 text-sm">
                  {noNota ?? '—'}
                </h3>
                <span className="text-xs font-semibold text-[#0b2154] bg-blue-50 px-2 py-0.5 rounded-full">
                  {formatRupiah(item.total_nota ?? item.total ?? item.total_jual)}
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-3">
                {formatTanggal(item.tanggal_jual ?? item.tanggal ?? item.created_at)}
                {(item.nama_kasir ?? item.kasir) && (
                  <> • <span className="font-medium text-gray-700">{item.nama_kasir ?? item.kasir}</span></>
                )}
              </p>
              <button
                onClick={() => handleLihatNota(item)}
                disabled={!noNota}
                className={`w-full py-2.5 rounded-lg border font-bold text-xs flex items-center justify-center gap-2 transition-colors ${
                  noNota
                    ? 'border-gray-200 text-[#0b2154] hover:bg-slate-50'
                    : 'border-gray-100 text-gray-300 cursor-not-allowed'
                }`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                </svg>
                {noNota ? 'Lihat Nota' : 'ID Nota Tidak Tersedia'}
              </button>
            </div>
          );
        })}
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
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" x2="8" y1="13" y2="13" /><line x1="16" x2="8" y1="17" y2="17" /><polyline points="10 9 9 9 8 9" />
            </svg>
            <span className="text-[11px] font-bold mt-1">Riwayat</span>
          </button>
        </div>
      </div>

    </div>
  );
};