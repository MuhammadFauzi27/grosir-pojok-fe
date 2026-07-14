import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import api from '../../services/api';

// ─── Helper: normalisasi data nota ke shape yang seragam ────────────────────
// API bisa mengembalikan berbagai nama field, kita normalkan semuanya.
const normalizeNota = (raw) => {
  if (!raw) return null;

  // Jika response dibungkus { data: {...} }
  const src = raw?.data ?? raw;

  return {
    no_nota_jual : src.no_nota_jual  ?? src.no_nota    ?? src.nomor_nota ?? '-',
    tanggal_jual : src.tanggal_jual  ?? src.tanggal    ?? src.created_at ?? null,
    nama_kasir   : src.nama_kasir    ?? src.kasir       ?? src.username   ?? '-',

    // Total: coba semua kemungkinan field nama
    total_nota   : Number(
      src.total_nota  ??
      src.total_jual  ??
      src.total       ??
      src.grand_total ??
      0
    ),

    // Items: coba semua kemungkinan nama array detail
    items: (
      src.items       ??
      src.detail_jual ??
      src.detail      ??
      src.details     ??
      src.barang      ??
      []
    ).map((item) => ({
      id_detail_jual : item.id_detail_jual ?? item.id ?? Math.random(),
      nama_barang    : item.nama_barang    ?? item.nama   ?? item.name ?? '-',
      nama_satuan    : item.nama_satuan    ?? item.satuan ?? item.unit ?? '',
      jumlah_jual    : Number(item.jumlah_jual ?? item.jumlah ?? item.qty ?? item.jumlah_per_barang ?? 1),
      subtotal_jual  : Number(
        item.subtotal_jual ??
        item.subtotal      ??
        item.total_harga   ??
        item.total         ??
        0
      ),
      // Harga satuan: gunakan subtotal/jumlah jika tidak tersedia
      harga_satuan   : Number(
        item.harga_jual  ??
        item.harga       ??
        item.price       ??
        (
          (item.subtotal_jual ?? item.subtotal ?? 0) /
          (item.jumlah_jual   ?? item.jumlah   ?? 1)
        )
      ),
    })),
  };
};

export const NotaKasirPage = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { no_nota } = useParams();

  const [nota, setNota]         = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg]   = useState('');

  // ─── Prioritas 1: data sudah dikirim via location.state dari kasir.jsx ───
  useEffect(() => {
    const fromState = location.state?.penjualan;
    if (fromState) {
      console.log('[NotaKasir] Menggunakan data dari state:', fromState);
      setNota(normalizeNota(fromState));
    }
  }, [location.state]);

  // ─── Prioritas 2: fetch dari API jika tidak ada state (buka via URL langsung) ───
  const fetchNota = useCallback(async () => {
    if (!no_nota) return;
    // Jika sudah ada dari state, tidak perlu fetch
    if (location.state?.penjualan) return;

    setIsLoading(true);
    setErrorMsg('');
    try {
      const response = await api.get(`/penjualan/${no_nota}`);
      console.log('[NotaKasir] Response API:', response.data);
      const normalized = normalizeNota(response.data);
      if (!normalized) throw new Error('Data nota kosong');
      setNota(normalized);
    } catch (error) {
      console.error('Gagal mengambil detail nota:', error);
      setErrorMsg('Nota tidak ditemukan atau gagal dimuat.');
      setNota(null);
    } finally {
      setIsLoading(false);
    }
  }, [no_nota, location.state]);

  useEffect(() => {
    fetchNota();
  }, [fetchNota]);

  // ─── Helpers ──────────────────────────────────────────────────────────────
  const formatRupiah = (value) =>
    `Rp ${Number(value || 0).toLocaleString('id-ID')}`;

  const formatTanggal = (isoDate) => {
    if (!isoDate) return '-';
    try {
      return new Date(isoDate).toLocaleString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
      });
    } catch {
      return String(isoDate);
    }
  };

  // ─── Hitung ulang total dari items jika total_nota masih 0 ───────────────
  const totalBayar =
    nota?.total_nota > 0
      ? nota.total_nota
      : (nota?.items ?? []).reduce((acc, it) => acc + it.subtotal_jual, 0);

  // =========================================================================
  // RENDER
  // =========================================================================
  return (
    <div className="min-h-screen bg-slate-50 font-sans max-w-md mx-auto p-4 sm:p-6 pb-10">

      {/* Loading */}
      {isLoading && (
        <div className="text-center py-20 text-gray-400 text-sm animate-pulse">
          Memuat nota...
        </div>
      )}

      {/* Error */}
      {!isLoading && errorMsg && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 text-center">
          <svg className="mx-auto mb-3 text-red-400" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p className="text-red-600 text-sm mb-4">{errorMsg}</p>
          <button
            onClick={() => navigate('/riwayat-kasir')}
            className="text-[#0b2154] font-bold text-sm hover:underline"
          >
            Kembali ke Riwayat
          </button>
        </div>
      )}

      {/* Card Nota Utama */}
      {!isLoading && !errorMsg && nota && (
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
          <p className="text-center text-gray-500 text-sm mb-6">Nota #{nota.no_nota_jual}</p>
          <hr className="border-gray-200 mb-6" />

          {/* Info Transaksi */}
          <div className="grid grid-cols-2 gap-4 text-sm mb-6">
            <div>
              <p className="text-gray-500 text-xs uppercase font-bold tracking-wider">Tanggal</p>
              <p className="font-semibold text-gray-900">{formatTanggal(nota.tanggal_jual)}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-500 text-xs uppercase font-bold tracking-wider">Kasir</p>
              <p className="font-semibold text-gray-900">{nota.nama_kasir}</p>
            </div>
          </div>
          <hr className="border-gray-200 mb-6 border-dashed" />

          {/* Rincian Barang */}
          <div className="space-y-4 mb-6">
            <h2 className="font-bold text-gray-900 mb-2">Rincian Barang</h2>

            {nota.items.length === 0 && (
              <p className="text-sm text-gray-400">Tidak ada rincian item.</p>
            )}

            {nota.items.map((item) => (
              <div key={item.id_detail_jual} className="flex justify-between items-start">
                <div className="flex-1 pr-4">
                  <p className="text-sm font-medium text-gray-900">{item.nama_barang} x {item.jumlah_jual}</p>
                  {/*<p className="text-xs text-gray-500">*/}
                  {/*   {item.nama_satuan}*/}
                  {/*</p>*/}
                </div>
                <p className="text-sm font-semibold text-gray-900 shrink-0">
                  {formatRupiah(item.subtotal_jual)}
                </p>
              </div>
            ))}
          </div>

          <hr className="border-gray-200 mb-4" />

          {/* Totalan */}
          <div className="space-y-2 mb-8">
            {/* Subtotal per item jika ada lebih dari 1 item */}
            {nota.items.length > 1 && (
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal ({nota.items.length} item)</span>
                <span>{formatRupiah(totalBayar)}</span>
              </div>
            )}
            <div className="flex justify-between pt-2 border-t border-gray-100 mt-2">
              <span className="font-bold text-gray-900 text-base">Total Bayar</span>
              <span className="font-bold text-[#0b2154] text-xl">{formatRupiah(totalBayar)}</span>
            </div>
          </div>

          {/* Tombol Navigasi */}
          <button
            onClick={() => navigate('/kasir')}
            className="w-full bg-[#006A4E] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 mb-4 hover:bg-[#00523b] transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21H8"/><path d="M16 11H8"/>
            </svg>
            Kembali ke Kasir
          </button>

          <button
            onClick={() => navigate('/riwayat-kasir')}
            className="text-[#0b2154] font-bold text-sm w-full py-2 hover:underline"
          >
            Lihat Semua Riwayat
          </button>

        </div>
      )}
    </div>
  );
};