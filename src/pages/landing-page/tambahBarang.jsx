import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const DEFAULT_KATEGORI = ['Makanan', 'Minuman', 'Sembako'];

// Konversi string ke Pascal Case (huruf pertama tiap kata kapital, spasi dipertahankan)
const toPascalCase = (str) =>
  str
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

const INITIAL_FORM = {
  nama_barang: '',
  kategori: '',
  harga_barang: '',
  nama_satuan: '',
  jumlah_stok: '',
};

export const TambahBarangPage = () => {
  const navigate = useNavigate();

  // ─── Form State ───────────────────────────────────────────────────────────
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  // ─── Dropdown Options (dari API) ──────────────────────────────────────────
  const [kategoriList, setKategoriList] = useState(DEFAULT_KATEGORI);
  const [satuanList, setSatuanList] = useState([]);
  const [loadingFormData, setLoadingFormData] = useState(true);

  // ─── Autocomplete Search Nama Barang ─────────────────────────────────────
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchTimeout = useRef(null);
  const namaInputRef = useRef(null);
  const dropdownRef = useRef(null);

  // ─── Mode: barang yang dipilih dari autocomplete ──────────────────────────
  // Jika selectedBarang tidak null → mode edit (PUT/PATCH), bukan POST baru
  const [selectedBarang, setSelectedBarang] = useState(null);
  // Track nilai stok asli untuk kalkulasi `perubahan`
  const [originalStok, setOriginalStok] = useState(0);

  // ─── Tambah Kategori Kustom ──────────────────────────────────────────────
  const [isAddingKategori, setIsAddingKategori] = useState(false);
  const [newKategoriInput, setNewKategoriInput] = useState('');
  const newKategoriRef = useRef(null);

  // ─── Submit State ─────────────────────────────────────────────────────────
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [apiError, setApiError] = useState('');

  // =========================================================================
  // 1. Fetch form-data saat halaman pertama dimuat
  // =========================================================================
  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const res = await api.get('/barang/form-data');
        const { kategori, satuan } = res.data?.data ?? {};

        // Kategori: fallback ke default jika null/kosong
        if (Array.isArray(kategori) && kategori.length > 0) {
          setKategoriList(kategori);
        } else {
          setKategoriList(DEFAULT_KATEGORI);
        }

        // Satuan dasar
        if (Array.isArray(satuan) && satuan.length > 0) {
          setSatuanList(satuan);
          setForm((prev) => ({ ...prev, nama_satuan: satuan[0].nama_satuan }));
        }
      } catch (err) {
        console.error('Gagal fetch form-data:', err);
        // Tetap pakai default kategori
        setKategoriList(DEFAULT_KATEGORI);
      } finally {
        setLoadingFormData(false);
      }
    };

    fetchFormData();
  }, []);

  // =========================================================================
  // 2. Tutup dropdown jika klik di luar area input/dropdown
  // =========================================================================
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        namaInputRef.current &&
        !namaInputRef.current.contains(e.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // =========================================================================
  // 3. Debounce search nama barang → GET /barang?search=...
  // =========================================================================
  const handleNamaChange = (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, nama_barang: value }));
    setErrors((prev) => ({ ...prev, nama_barang: '' }));

    // Reset mode edit jika user mengetik ulang setelah pilih
    if (selectedBarang) {
      setSelectedBarang(null);
      setOriginalStok(0);
    }

    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    if (value.trim().length < 2) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    searchTimeout.current = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const res = await api.get('/barang', { params: { search: value.trim(), limit: 10 } });
        const results = res.data?.data ?? [];
        setSearchResults(results);
        setShowDropdown(results.length > 0);
      } catch (err) {
        console.error('Gagal search barang:', err);
        setSearchResults([]);
        setShowDropdown(false);
      } finally {
        setSearchLoading(false);
      }
    }, 350);
  };

  // =========================================================================
  // 4. Klik item autocomplete → GET /barang/{id} → isi form
  // =========================================================================
  const handleSelectBarang = useCallback(async (barang) => {
    setShowDropdown(false);
    setSearchResults([]);
    setApiError('');
    setSuccessMsg('');

    try {
      const res = await api.get(`/barang/${barang.id_barang}`);
      const detail = res.data?.data ?? barang;

      setSelectedBarang(detail);
      setOriginalStok(detail.jumlah_stok ?? 0);
      setForm({
        nama_barang: detail.nama_barang ?? '',
        kategori: detail.kategori ?? '',
        harga_barang: detail.harga_barang != null ? String(detail.harga_barang) : '',
        nama_satuan: detail.nama_satuan ?? '',
        jumlah_stok: detail.jumlah_stok != null ? String(detail.jumlah_stok) : '',
      });
    } catch (err) {
      console.error('Gagal fetch detail barang:', err);
      // Gunakan data dari list hasil search sebagai fallback
      setSelectedBarang(barang);
      setOriginalStok(barang.jumlah_stok ?? 0);
      setForm({
        nama_barang: barang.nama_barang ?? '',
        kategori: barang.kategori ?? '',
        harga_barang: barang.harga_barang != null ? String(barang.harga_barang) : '',
        nama_satuan: barang.nama_satuan ?? '',
        jumlah_stok: barang.jumlah_stok != null ? String(barang.jumlah_stok) : '',
      });
    }
  }, []);

  // =========================================================================
  // 5. Validasi form
  // =========================================================================
  const validate = () => {
    const newErrors = {};
    if (!form.nama_barang.trim()) newErrors.nama_barang = 'Nama barang wajib diisi';
    if (!form.kategori) newErrors.kategori = 'Kategori wajib dipilih';
    if (!form.harga_barang || isNaN(Number(form.harga_barang)) || Number(form.harga_barang) < 0)
      newErrors.harga_barang = 'Harga harus berupa angka ≥ 0';
    if (!form.nama_satuan) newErrors.nama_satuan = 'Satuan dasar wajib dipilih';
    if (form.jumlah_stok === '' || isNaN(Number(form.jumlah_stok)) || Number(form.jumlah_stok) < 0)
      newErrors.jumlah_stok = 'Jumlah stok harus berupa angka ≥ 0';
    return newErrors;
  };

  // =========================================================================
  // 6. Deteksi apakah hanya stok yang berubah (untuk PATCH) atau ada data barang
  // =========================================================================
  const isOnlyStokChanged = () => {
    if (!selectedBarang) return false;
    return (
      form.nama_barang === selectedBarang.nama_barang &&
      form.kategori === selectedBarang.kategori &&
      form.harga_barang === String(selectedBarang.harga_barang) &&
      String(form.jumlah_stok) !== String(originalStok)
    );
  };

  const isDataBarangChanged = () => {
    if (!selectedBarang) return false;
    return (
      form.nama_barang !== selectedBarang.nama_barang ||
      form.kategori !== selectedBarang.kategori ||
      form.harga_barang !== String(selectedBarang.harga_barang)
    );
  };

  // =========================================================================
  // 7. Submit handler
  // =========================================================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    setSuccessMsg('');

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setIsSubmitting(true);

    try {
      // ── MODE EDIT: barang dipilih dari autocomplete ────────────────────
      if (selectedBarang) {
        const { id_barang } = selectedBarang;
        const stokBaru = Number(form.jumlah_stok);
        const stokLama = originalStok;
        const dataBarangBerubah = isDataBarangChanged();
        const stokBerubah = stokBaru !== stokLama;

        // Hanya stok yang berubah → PATCH /stok/{id}/penyesuaian
        if (!dataBarangBerubah && stokBerubah) {
          await api.patch(`/stok/${id_barang}/penyesuaian`, {
            perubahan: stokBaru - stokLama,
          });
          setSuccessMsg('Stok berhasil diperbarui!');
        }
        // Data barang berubah → PUT /barang/{id}
        else if (dataBarangBerubah) {
          await api.put(`/barang/${id_barang}`, {
            nama_barang: form.nama_barang,
            kategori: form.kategori,
            harga_barang: Number(form.harga_barang),
          });
          // Jika stok juga berubah, jalankan PATCH setelahnya
          if (stokBerubah) {
            await api.patch(`/stok/${id_barang}/penyesuaian`, {
              perubahan: stokBaru - stokLama,
            });
          }
          setSuccessMsg('Data barang berhasil diperbarui!');
        } else {
          setApiError('Tidak ada perubahan yang terdeteksi.');
        }
      }
      // ── MODE TAMBAH BARU: POST /barang ─────────────────────────────────
      else {
        await api.post('/barang', {
          nama_barang: form.nama_barang,
          kategori: form.kategori,
          harga_barang: Number(form.harga_barang),
          nama_satuan: form.nama_satuan,
          jumlah_stok: Number(form.jumlah_stok),
        });
        setSuccessMsg('Barang baru berhasil ditambahkan!');
        // Reset form setelah sukses POST
        setForm(INITIAL_FORM);
        setSelectedBarang(null);
        setOriginalStok(0);
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Terjadi kesalahan. Silakan coba lagi.';
      setApiError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // =========================================================================
  // Helper: format rupiah saat input
  // =========================================================================
  const handleHargaChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '');
    setForm((prev) => ({ ...prev, harga_barang: raw }));
    setErrors((prev) => ({ ...prev, harga_barang: '' }));
  };

  const formatRupiah = (val) => {
    if (!val) return '';
    return Number(val).toLocaleString('id-ID');
  };

  const isEditMode = !!selectedBarang;

  // =========================================================================
  // RENDER
  // =========================================================================
  return (
    <div className="min-h-screen bg-slate-50 font-sans max-w-md mx-auto relative shadow-sm border-x border-gray-200 pb-24">

      {/* Header Sticky dengan Tombol Back */}
      <div className="bg-white px-4 py-4 flex items-center border-b border-gray-200 sticky top-0 z-10">
        <button onClick={() => navigate('/gudang')} className="mr-3 text-gray-600 hover:text-gray-900">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
          </svg>
        </button>
        <div>
          <h1 className="text-lg font-bold text-[#0b2154]">
            {isEditMode ? 'Edit Barang' : 'Tambah Barang Baru'}
          </h1>
          {isEditMode && (
            <p className="text-xs text-amber-600 font-medium">
              Mode edit — ID #{selectedBarang.id_barang}
            </p>
          )}
        </div>
      </div>

      <div className="p-4">

        {/* Banner sukses */}
        {successMsg && (
          <div className="mb-4 flex items-start gap-3 bg-green-50 border border-green-200 text-green-800 rounded-xl p-4">
            <svg className="mt-0.5 shrink-0" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span className="text-sm font-medium">{successMsg}</span>
          </div>
        )}

        {/* Banner error API */}
        {apiError && (
          <div className="mb-4 flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">
            <svg className="mt-0.5 shrink-0" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span className="text-sm font-medium">{apiError}</span>
          </div>
        )}

        {/* Card Form Utama */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">

            {/* Section 1: Informasi Dasar */}
            <div className="mb-6">
              <h2 className="text-base font-bold text-gray-900 mb-4 border-b pb-2">Informasi Dasar</h2>

              <div className="space-y-4">

                {/* Input Nama Barang + Autocomplete */}
                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Nama Barang
                  </label>
                  <div className="relative">
                    <input
                      ref={namaInputRef}
                      type="text"
                      value={form.nama_barang}
                      onChange={handleNamaChange}
                      onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
                      placeholder="Ketik nama barang untuk mencari..."
                      autoComplete="off"
                      className={`block w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-1 text-sm pr-8 ${
                        errors.nama_barang
                          ? 'border-red-400 focus:ring-red-400'
                          : isEditMode
                          ? 'border-amber-400 focus:ring-amber-400 bg-amber-50'
                          : 'border-gray-300 focus:ring-[#0b2154] focus:border-[#0b2154]'
                      }`}
                    />
                    {/* Spinner saat search */}
                    {searchLoading && (
                      <div className="absolute right-2.5 top-2.5">
                        <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0b2154" strokeWidth="2.5">
                          <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                          <path d="M12 2a10 10 0 0 1 10 10" />
                        </svg>
                      </div>
                    )}
                    {/* Badge "Edit Mode" di kanan input */}
                    {isEditMode && !searchLoading && (
                      <div className="absolute right-2.5 top-2.5 text-amber-500">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Dropdown hasil pencarian */}
                  {showDropdown && (
                    <div
                      ref={dropdownRef}
                      className="absolute z-50 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden"
                    >
                      <div className="px-3 py-1.5 border-b bg-gray-50">
                        <p className="text-xs text-gray-500 font-medium">
                          {searchResults.length} barang ditemukan — klik untuk autocomplete
                        </p>
                      </div>
                      <ul className="max-h-56 overflow-y-auto divide-y divide-gray-100">
                        {searchResults.map((item) => (
                          <li
                            key={item.id_barang}
                            onMouseDown={(e) => {
                              e.preventDefault(); // cegah blur sebelum click selesai
                              handleSelectBarang(item);
                            }}
                            className="flex items-center justify-between px-3 py-2.5 hover:bg-blue-50 cursor-pointer transition-colors"
                          >
                            <div>
                              <p className="text-sm font-semibold text-gray-800">{item.nama_barang}</p>
                              <p className="text-xs text-gray-500">
                                {item.kategori} · {item.nama_satuan}
                              </p>
                            </div>
                            <div className="text-right ml-3">
                              <p className="text-xs font-bold text-[#0b2154]">
                                Rp {Number(item.harga_barang).toLocaleString('id-ID')}
                              </p>
                              <p className="text-xs text-gray-400">Stok: {item.jumlah_stok}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {errors.nama_barang && (
                    <p className="mt-1 text-xs text-red-500">{errors.nama_barang}</p>
                  )}
                </div>

                {/* Kategori */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Kategori</label>

                  {/* Mode normal: dropdown */}
                  {!isAddingKategori ? (
                    <>
                      <div className="relative">
                        <select
                          value={form.kategori}
                          onChange={(e) => {
                            if (e.target.value === '__ADD_NEW__') {
                              // Aktifkan mode input manual
                              setIsAddingKategori(true);
                              setNewKategoriInput('');
                              setForm((prev) => ({ ...prev, kategori: '' }));
                              setTimeout(() => newKategoriRef.current?.focus(), 50);
                              return;
                            }
                            setForm((prev) => ({ ...prev, kategori: e.target.value }));
                            setErrors((prev) => ({ ...prev, kategori: '' }));
                          }}
                          disabled={loadingFormData}
                          className={`block w-full px-3 py-2.5 border rounded-lg appearance-none focus:outline-none focus:ring-1 text-sm bg-white ${
                            errors.kategori
                              ? 'border-red-400 focus:ring-red-400'
                              : 'border-gray-300 focus:ring-[#0b2154] focus:border-[#0b2154]'
                          } disabled:opacity-60`}
                        >
                          <option value="">Pilih Kategori...</option>
                          {kategoriList.map((kat) => (
                            <option key={kat} value={kat}>{kat}</option>
                          ))}
                          {/* Pemisah + opsi tambah */}
                          <option disabled value="">──────────────</option>
                          <option value="__ADD_NEW__">+ Tambah Kategori Baru</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-500">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                        </div>
                      </div>
                      {errors.kategori && <p className="mt-1 text-xs text-red-500">{errors.kategori}</p>}
                    </>
                  ) : (
                    /* Mode input kategori baru */
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <input
                            ref={newKategoriRef}
                            type="text"
                            value={newKategoriInput}
                            onChange={(e) => setNewKategoriInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                const val = toPascalCase(newKategoriInput.trim());
                                if (!val) return;
                                // Tambahkan ke list jika belum ada
                                if (!kategoriList.includes(val)) {
                                  setKategoriList((prev) => [...prev, val]);
                                }
                                setForm((prev) => ({ ...prev, kategori: val }));
                                setErrors((prev) => ({ ...prev, kategori: '' }));
                                setIsAddingKategori(false);
                                setNewKategoriInput('');
                              }
                              if (e.key === 'Escape') {
                                setIsAddingKategori(false);
                                setNewKategoriInput('');
                              }
                            }}
                            placeholder="Contoh: Mie Instan"
                            className={`block w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-1 text-sm ${
                              errors.kategori
                                ? 'border-red-400 focus:ring-red-400'
                                : 'border-[#0b2154] ring-1 ring-[#0b2154]'
                            }`}
                          />
                          {/* Preview Pascal Case */}
                          {newKategoriInput.trim() && (
                            <p className="absolute -bottom-5 left-0 text-[11px] text-gray-400">
                              Akan disimpan sebagai:{' '}
                              <span className="font-semibold text-[#0b2154]">
                                {toPascalCase(newKategoriInput.trim())}
                              </span>
                            </p>
                          )}
                        </div>
                        {/* Tombol Konfirmasi */}
                        <button
                          type="button"
                          onClick={() => {
                            const val = toPascalCase(newKategoriInput.trim());
                            if (!val) return;
                            if (!kategoriList.includes(val)) {
                              setKategoriList((prev) => [...prev, val]);
                            }
                            setForm((prev) => ({ ...prev, kategori: val }));
                            setErrors((prev) => ({ ...prev, kategori: '' }));
                            setIsAddingKategori(false);
                            setNewKategoriInput('');
                          }}
                          disabled={!newKategoriInput.trim()}
                          className="shrink-0 px-3 py-2.5 bg-[#0b2154] text-white text-sm font-bold rounded-lg disabled:opacity-40 hover:bg-blue-900"
                        >
                          OK
                        </button>
                        {/* Tombol Batal */}
                        <button
                          type="button"
                          onClick={() => {
                            setIsAddingKategori(false);
                            setNewKategoriInput('');
                          }}
                          className="shrink-0 px-3 py-2.5 bg-gray-100 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-200"
                        >
                          ✕
                        </button>
                      </div>
                      {/* Spacer untuk preview text */}
                      {newKategoriInput.trim() && <div className="h-3" />}
                      <p className="text-[11px] text-gray-400">
                        Tekan <kbd className="px-1 py-0.5 bg-gray-100 rounded text-gray-600 font-mono">Enter</kbd> untuk menyimpan,{' '}
                        <kbd className="px-1 py-0.5 bg-gray-100 rounded text-gray-600 font-mono">Esc</kbd> untuk batal.
                      </p>
                      {errors.kategori && <p className="text-xs text-red-500">{errors.kategori}</p>}
                    </div>
                  )}

                  {/* Badge kategori terpilih saat mode tambah baru selesai */}
                  {!isAddingKategori && form.kategori && (
                    <p className="mt-1 text-xs text-gray-400">
                      Terpilih:{' '}
                      <span className="font-semibold text-[#0b2154]">{form.kategori}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Section 2: Harga Jual */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Harga Jual</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-sm text-gray-500 font-medium">Rp</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={formatRupiah(form.harga_barang)}
                  onChange={handleHargaChange}
                  placeholder="0"
                  className={`block w-full pl-9 pr-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-1 ${
                    errors.harga_barang
                      ? 'border-red-400 focus:ring-red-400'
                      : 'border-gray-300 focus:ring-[#0b2154] focus:border-[#0b2154]'
                  }`}
                />
              </div>
              {errors.harga_barang && <p className="mt-1 text-xs text-red-500">{errors.harga_barang}</p>}
            </div>

            {/* Section 3: Stok */}
            <div>
              <h2 className="text-base font-bold text-gray-900 mb-4 border-b pb-2">
                {isEditMode ? 'Stok Saat Ini' : 'Stok Awal'}
              </h2>

              {/* Info perubahan stok saat edit */}
              {isEditMode && String(form.jumlah_stok) !== String(originalStok) && form.jumlah_stok !== '' && (
                <div className="mb-3 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-700 font-medium">
                  Perubahan stok:{' '}
                  <span className={Number(form.jumlah_stok) - originalStok >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {Number(form.jumlah_stok) - originalStok >= 0 ? '+' : ''}
                    {Number(form.jumlah_stok) - originalStok} {form.nama_satuan}
                  </span>
                  {' '}(dari {originalStok} → {form.jumlah_stok})
                </div>
              )}

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Jumlah Fisik</label>
                  <input
                    type="number"
                    min="0"
                    value={form.jumlah_stok}
                    onChange={(e) => {
                      setForm((prev) => ({ ...prev, jumlah_stok: e.target.value }));
                      setErrors((prev) => ({ ...prev, jumlah_stok: '' }));
                    }}
                    placeholder="0"
                    className={`block w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-1 text-sm ${
                      errors.jumlah_stok
                        ? 'border-red-400 focus:ring-red-400'
                        : 'border-gray-300 focus:ring-[#0b2154] focus:border-[#0b2154]'
                    }`}
                  />
                  {errors.jumlah_stok && <p className="mt-1 text-xs text-red-500">{errors.jumlah_stok}</p>}
                </div>

                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Satuan Dasar</label>
                  <div className="relative">
                    <select
                      value={form.nama_satuan}
                      onChange={(e) => {
                        setForm((prev) => ({ ...prev, nama_satuan: e.target.value }));
                        setErrors((prev) => ({ ...prev, nama_satuan: '' }));
                      }}
                      // Satuan tidak bisa diubah saat mode edit (sesuai kontrak API)
                      disabled={loadingFormData || isEditMode}
                      className={`block w-full px-3 py-2.5 border rounded-lg appearance-none focus:outline-none focus:ring-1 text-sm bg-white ${
                        errors.nama_satuan
                          ? 'border-red-400 focus:ring-red-400'
                          : 'border-gray-300 focus:ring-[#0b2154] focus:border-[#0b2154]'
                      } disabled:opacity-60 disabled:cursor-not-allowed`}
                    >
                      {satuanList.length > 0 ? (
                        satuanList.map((s) => (
                          <option key={s.id_satuan} value={s.nama_satuan}>{s.nama_satuan}</option>
                        ))
                      ) : (
                        // Fallback jika API satuan gagal
                        <>
                          <option value="pcs">pcs</option>
                          <option value="pak">pak</option>
                          <option value="dus">dus</option>
                          <option value="kg">kg</option>
                          <option value="liter">liter</option>
                        </>
                      )}
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-500">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                    </div>
                  </div>
                  {isEditMode && (
                    <p className="mt-1 text-xs text-gray-400">Satuan tidak dapat diubah</p>
                  )}
                  {errors.nama_satuan && <p className="mt-1 text-xs text-red-500">{errors.nama_satuan}</p>}
                </div>
              </div>
            </div>

          </div>
        </form>
      </div>

      {/* Footer Aksi (Simpan & Batal) */}
      <div className="fixed bottom-0 left-0 w-full max-w-md mx-auto sm:left-auto bg-white border-t border-gray-200 p-4">
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate('/gudang')}
            disabled={isSubmitting}
            className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-lg border border-gray-200 hover:bg-gray-200 disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting || loadingFormData}
            className="flex-[2] py-3 bg-[#0b2154] text-white font-bold rounded-lg hover:bg-blue-900 shadow-sm disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                  <path d="M12 2a10 10 0 0 1 10 10" />
                </svg>
                Menyimpan...
              </>
            ) : isEditMode ? (
              'Simpan Perubahan'
            ) : (
              'Simpan Barang'
            )}
          </button>
        </div>
      </div>

    </div>
  );
};