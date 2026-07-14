import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

export const KasirPage = () => {
  const navigate = useNavigate();

  // ----- Data pegawai (kasir) yang sedang login -----
  const pegawai = (() => {
    try {
      return JSON.parse(localStorage.getItem('pegawai')) || null;
    } catch {
      return null;
    }
  })();

  // ----- State pencarian barang -----
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchWrapperRef = useRef(null);
  const debounceRef = useRef(null);

  // ----- State keranjang (current order) -----
  const [cartItems, setCartItems] = useState([]);

  // ----- State proses checkout -----
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Tutup dropdown jika klik di luar area search
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Normalisasi berbagai kemungkinan bentuk response API menjadi array
  const normalizeToArray = (raw) => {
    if (Array.isArray(raw)) return raw;
    if (raw && Array.isArray(raw.data)) return raw.data;
    if (raw && Array.isArray(raw.items)) return raw.items;
    return [];
  };

  // Ambil data barang sesuai kontrak GET /barang?search=
  // Response sudah lengkap (nama_barang, kategori, harga_barang,
  // nama_satuan, jumlah_stok) dalam satu request, dibungkus { data: [...] }.
  const fetchBarang = useCallback(async (term) => {
    setSearchLoading(true);
    setErrorMsg('');
    try {
      const response = await api.get('/barang', {
        params: term ? { search: term } : {},
      });
      const barangList = normalizeToArray(response.data);

      const mapped = barangList.map((barang) => ({
        id_barang: barang.id_barang,
        nama_barang: barang.nama_barang,
        kategori: barang.kategori,
        id_satuan: barang.id_satuan,
        nama_satuan: barang.nama_satuan,
        harga_barang: Number(barang.harga_barang) || 0,
        jumlah_stok: barang.jumlah_stok,
      }));

      setSearchResults(mapped);
    } catch (error) {
      console.error('Gagal mengambil data barang:', error);
      setErrorMsg('Gagal memuat data barang.');
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  }, []);

  // Debounce input pencarian nama barang
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowDropdown(true);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchBarang(value);
    }, 350);
  };

  const handleSearchFocus = () => {
    setShowDropdown(true);
    if (searchResults.length === 0) {
      fetchBarang(searchTerm);
    }
  };

  // Tambah barang hasil pencarian ke current order
  const handleAddItem = (stokItem) => {
    let stokPenuh = false;
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id_barang === stokItem.id_barang);
      if (existing) {
        const batasStok = Number(existing.jumlah_stok) || 0;
        if (existing.jumlah_per_barang >= batasStok) {
          stokPenuh = true;
          return prev;
        }
        return prev.map((item) =>
          item.id_barang === stokItem.id_barang
            ? { ...item, jumlah_per_barang: item.jumlah_per_barang + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          id_barang: stokItem.id_barang,
          nama_barang: stokItem.nama_barang,
          kategori: stokItem.kategori,
          id_satuan: stokItem.id_satuan,
          nama_satuan: stokItem.nama_satuan,
          harga_barang: stokItem.harga_barang,
          jumlah_stok: stokItem.jumlah_stok,
          jumlah_per_barang: 1,
        },
      ];
    });
    setSearchTerm('');
    setSearchResults([]);
    setShowDropdown(false);
    if (stokPenuh) {
      setErrorMsg(`Stok ${stokItem.nama_barang} hanya tersedia ${stokItem.jumlah_stok}, sudah mencapai batas.`);
    }
  };

  // Tombol tambah (+) dibatasi maksimal sebesar jumlah_stok barang tsb,
  // tidak peduli berapa pun nilai stoknya (20, 50, dst).
  const handleIncrease = (id_barang) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id_barang !== id_barang) return item;
        const batasStok = Number(item.jumlah_stok) || 0;
        if (item.jumlah_per_barang >= batasStok) return item;
        return { ...item, jumlah_per_barang: item.jumlah_per_barang + 1 };
      })
    );
  };

  const handleDecrease = (id_barang) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id_barang === id_barang
            ? { ...item, jumlah_per_barang: item.jumlah_per_barang - 1 }
            : item
        )
        .filter((item) => item.jumlah_per_barang > 0)
    );
  };

  const handleRemoveItem = (id_barang) => {
    setCartItems((prev) => prev.filter((item) => item.id_barang !== id_barang));
  };

  // Total sesuai harga asli, tanpa pajak
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.harga_barang * item.jumlah_per_barang,
    0
  );
  const totalItemCount = cartItems.reduce((sum, item) => sum + item.jumlah_per_barang, 0);

  const formatRupiah = (value) => `Rp ${Number(value || 0).toLocaleString('id-ID')}`;

  // Checkout sesuai kontrak POST /penjualan
  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      setErrorMsg('Belum ada barang di keranjang.');
      return;
    }

    setIsProcessing(true);
    setErrorMsg('');
    try {
      const payload = {
        username: pegawai?.username,
        items: cartItems.map((item) => ({
          id_barang: item.id_barang,
          jumlah_per_barang: item.jumlah_per_barang,
        })),
      };

      const response = await api.post('/penjualan', payload);

      setCartItems([]);
      const noNota = response.data?.no_nota_jual;
      navigate(`/nota-kasir/${noNota}`, { state: { penjualan: response.data } });
    } catch (error) {
      console.error('Gagal memproses transaksi:', error);
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMsg(error.response.data.message);
      } else {
        setErrorMsg('Transaksi gagal. Periksa kembali stok barang.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans max-w-md mx-auto relative shadow-sm border-x border-gray-200 pb-[250px]">

      {/* Header Kasir */}
      <div className="bg-white px-5 py-4 flex items-center justify-between border-b border-gray-200 sticky top-0 z-10">
        <button className="text-gray-800">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <h1 className="text-xl font-bold text-[#0b2154]">Grosir Pojok</h1>
        <div className="w-6" />
      </div>

      {/* Info Order */}
      <div className="px-5 pt-6 pb-4">
        <h2 className="text-lg font-bold text-gray-900">Current Order</h2>
        <p className="text-sm text-gray-500">
          {cartItems.length > 0 ? `${totalItemCount} item dalam keranjang` : 'Belum ada barang'}
        </p>
      </div>

      {/* Input Search Nama Barang */}
      <div className="px-5 pb-4" ref={searchWrapperRef}>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Cari Barang</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" x2="16.65" y1="21" y2="16.65" />
            </svg>
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={handleSearchFocus}
            placeholder="Contoh: Indomie Goreng"
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0b2154] focus:border-[#0b2154] text-sm"
          />

          {/* Dropdown hasil pencarian */}
          {showDropdown && (
            <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto z-20">
              {searchLoading && (
                <div className="px-4 py-3 text-sm text-gray-500">Mencari barang...</div>
              )}
              {!searchLoading && (!Array.isArray(searchResults) || searchResults.length === 0) && (
                <div className="px-4 py-3 text-sm text-gray-500">Barang tidak ditemukan.</div>
              )}
              {!searchLoading &&
                Array.isArray(searchResults) &&
                searchResults.map((item) => (
                  <button
                    key={`${item.id_barang}-${item.id_satuan}`}
                    onClick={() => handleAddItem(item)}
                    className="w-full text-left px-4 py-3 hover:bg-blue-50/60 border-b last:border-b-0 border-gray-100 flex justify-between items-center"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.nama_barang}</p>
                      <p className="text-xs text-gray-500">
                        {item.kategori} • Stok {item.jumlah_stok} {item.nama_satuan}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-[#0b2154] shrink-0 ml-3">
                      {formatRupiah(item.harga_barang)}
                    </span>
                  </button>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Pesan Error */}
      {errorMsg && (
        <div className="mx-5 mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-200 text-center">
          {errorMsg}
        </div>
      )}

      {/* List Pesanan */}
      <div className="px-5 space-y-4">
        {cartItems.length === 0 && (
          <div className="text-center py-10 text-gray-400 text-sm">
            Cari dan pilih barang untuk memulai transaksi.
          </div>
        )}

        {cartItems.map((item) => (
          <div key={item.id_barang} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="flex gap-3">
                <div className="w-14 h-14 bg-blue-50 rounded-lg border border-blue-100 flex items-center justify-center text-blue-800 shrink-0">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 leading-tight">{item.nama_barang}</h3>
                  <p className="text-xs text-gray-500 mt-1">{item.kategori}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Satuan: <span className="font-medium text-gray-700">{item.nama_satuan}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Stok tersedia: <span className="font-medium text-gray-700">{item.jumlah_stok}</span>
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-[#0b2154] text-sm">{formatRupiah(item.harga_barang)}</p>
              </div>
            </div>
            <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
              <button
                onClick={() => handleRemoveItem(item.id_barang)}
                className="text-xs font-medium text-red-500 hover:text-red-700 flex items-center gap-1"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                </svg>
                Hapus
              </button>
              <div className="flex items-center gap-3 border border-gray-200 rounded-md px-2 py-1">
                <button
                  onClick={() => handleDecrease(item.id_barang)}
                  className="text-gray-500 hover:text-gray-900"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /></svg>
                </button>
                <span className="font-semibold text-sm w-4 text-center">{item.jumlah_per_barang}</span>
                <button
                  onClick={() => handleIncrease(item.id_barang)}
                  disabled={item.jumlah_per_barang >= (Number(item.jumlah_stok) || 0)}
                  title={
                    item.jumlah_per_barang >= (Number(item.jumlah_stok) || 0)
                      ? 'Jumlah sudah mencapai batas stok'
                      : 'Tambah jumlah'
                  }
                  className={
                    item.jumlah_per_barang >= (Number(item.jumlah_stok) || 0)
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-500 hover:text-gray-900'
                  }
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Summary & Payment Button (Tetap Fixed) */}
      <div className="fixed bottom-20 left-0 w-full max-w-md mx-auto sm:left-auto bg-white border-t border-gray-200 p-4 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="flex justify-between items-center text-[10px] text-gray-600 mb-2">
          <span>Subtotal ({totalItemCount} items)</span>
          <span className="font-medium text-gray-900">{formatRupiah(subtotal)}</span>
        </div>
        <div className="flex justify-between items-end mb-3">
          <span className="font-bold text-[15px] text-gray-900">Total</span>
          <span className="font-bold text-[19px] text-[#0b2154] leading-none">{formatRupiah(subtotal)}</span>
        </div>
        <button
          onClick={handleCheckout}
          disabled={isProcessing || cartItems.length === 0}
          className={`w-full py-2.5 rounded-lg font-bold text-[12px] uppercase tracking-wide flex items-center justify-center gap-1.5 transition-colors ${
            isProcessing || cartItems.length === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-[#0b2154] text-white hover:bg-blue-900'
          }`}
        >
          {isProcessing ? 'Memproses...' : 'Selesaikan Transaksi'}
          {!isProcessing && (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
            </svg>
          )}
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
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" x2="8" y1="13" y2="13" /><line x1="16" x2="8" y1="17" y2="17" /><polyline points="10 9 9 9 8 9" />
            </svg>
            <span className="text-[11px] font-medium mt-1">Riwayat</span>
          </button>
        </div>
      </div>
    </div>
  );
};