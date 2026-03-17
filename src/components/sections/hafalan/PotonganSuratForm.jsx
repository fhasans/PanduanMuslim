import React, { useState, useEffect, useRef } from 'react';
import { Loader2, ChevronDown, Plus, Music, AlertCircle, CheckCircle2, X, Search } from 'lucide-react';

const API_BASE = 'https://equran.id/api/v2';

export default function PotonganSuratForm({ onAdd }) {
    const [surahs, setSurahs] = useState([]);
    const [loadingSurahs, setLoadingSurahs] = useState(true);
    const [surahError, setSurahError] = useState(null);

    const [selectedSurah, setSelectedSurah] = useState('');
    const [searchSurah, setSearchSurah] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [ayatAwal, setAyatAwal] = useState('');
    const [ayatAkhir, setAyatAkhir] = useState('');
    const [audioFile, setAudioFile] = useState(null);
    const [audioPreview, setAudioPreview] = useState(null);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const audioInputRef = useRef(null);
    const dropdownRef = useRef(null);

    // Filter logic per menu Quran
    const normalize = (str) =>
        str.toLowerCase()
           .replace(/[-\s''`]/g, '')
           .replace(/^(al|at|an|ar|as|ash|az|ad|adh|adz)/i, '');

    const q = normalize(searchSurah);

    const filteredSurahs = surahs.filter(s =>
        !searchSurah ||
        normalize(s.namaLatin).includes(q) ||
        s.arti.toLowerCase().includes(searchSurah.toLowerCase()) ||
        String(s.nomor).startsWith(searchSurah.trim())
    );

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        fetch(`${API_BASE}/surat`)
            .then(res => {
                if (!res.ok) throw new Error('Gagal memuat daftar surah');
                return res.json();
            })
            .then(data => {
                setSurahs(data.data || []);
                setLoadingSurahs(false);
            })
            .catch(err => {
                setSurahError(err.message);
                setLoadingSurahs(false);
            });
    }, []);

    const handleAudioChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setAudioFile(file);
        setAudioPreview(URL.createObjectURL(file));
    };

    const removeAudio = () => {
        setAudioFile(null);
        setAudioPreview(null);
        if (audioInputRef.current) audioInputRef.current.value = '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError(null);
        setSubmitSuccess(false);

        if (!selectedSurah) return setSubmitError('Pilih surah terlebih dahulu.');
        if (!ayatAwal || !ayatAkhir) return setSubmitError('Masukkan range ayat (awal dan akhir).');
        if (parseInt(ayatAwal) > parseInt(ayatAkhir)) return setSubmitError('Ayat awal tidak boleh lebih besar dari ayat akhir.');

        const surahInfo = surahs.find(s => String(s.nomor) === String(selectedSurah));
        if (!surahInfo) return setSubmitError('Surah tidak ditemukan.');

        setIsSubmitting(true);

        try {
            const res = await fetch(`${API_BASE}/surat/${selectedSurah}`);
            if (!res.ok) throw new Error('Gagal mengambil data surah dari API.');
            const data = await res.json();
            const allAyat = data.data?.ayat || [];

            const start = parseInt(ayatAwal);
            const end = parseInt(ayatAkhir);

            // Simpan per-ayat (bukan gabungan string)
            const selectedAyat = allAyat
                .filter(a => a.nomorAyat >= start && a.nomorAyat <= end)
                .map(a => ({
                    nomorAyat: a.nomorAyat,
                    teksArab: a.teksArab,
                    teksLatin: a.teksLatin,
                    teksIndonesia: a.teksIndonesia,
                }));

            if (selectedAyat.length === 0) {
                throw new Error(`Ayat ${start}–${end} tidak ditemukan di surah ${surahInfo.namaLatin}.`);
            }

            // Audio ke base64
            let audioBase64 = null;
            if (audioFile) {
                audioBase64 = await fileToBase64(audioFile);
            }

            const ayatLabel = start === end ? String(start) : `${start}-${end}`;

            const newEntry = {
                id: Date.now(),
                surat: surahInfo.namaLatin,
                namaArab: surahInfo.nama,
                nomor: surahInfo.nomor,
                ayat: ayatLabel,
                judul: `${surahInfo.namaLatin} : Ayat ${start === end ? start : `${start}–${end}`}`,
                // Simpan array ayat (per-ayat)
                ayatList: selectedAyat,
                audioBase64,
                audioName: audioFile ? audioFile.name : null,
                createdAt: new Date().toISOString(),
            };

            const existing = JSON.parse(localStorage.getItem('potonganSuratCustom') || '[]');
            existing.push(newEntry);
            localStorage.setItem('potonganSuratCustom', JSON.stringify(existing));

            onAdd(newEntry);

            setSelectedSurah('');
            setSearchSurah('');
            setAyatAwal('');
            setAyatAkhir('');
            removeAudio();
            setSubmitSuccess(true);
            setTimeout(() => setSubmitSuccess(false), 3000);
        } catch (err) {
            setSubmitError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-4 flex items-center gap-3">
                <div className="bg-white/20 rounded-xl p-2">
                    <Plus size={18} className="text-white" />
                </div>
                <div>
                    <h3 className="font-bold text-white text-sm">Tambah Potongan Surat</h3>
                    <p className="text-emerald-100 text-xs mt-0.5">Pilih surah, range ayat, dan upload audio tilawah</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
                {/* Field 1: Pilih Surah */}
                <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Surah</label>
                    {loadingSurahs ? (
                        <div className="flex items-center gap-2 text-slate-400 text-sm py-2">
                            <Loader2 size={16} className="animate-spin" />
                            <span>Memuat daftar surah...</span>
                        </div>
                    ) : surahError ? (
                        <div className="flex items-center gap-2 text-red-500 text-sm">
                            <AlertCircle size={15} /><span>{surahError}</span>
                        </div>
                    ) : (
                        <div className="relative" ref={dropdownRef}>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
                                    <Search size={16} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Cari nama, arti, atau nomor surah..."
                                    value={searchSurah}
                                    onChange={e => {
                                        setSearchSurah(e.target.value);
                                        setSelectedSurah(''); // Reset selection when typing
                                        setIsDropdownOpen(true);
                                    }}
                                    onFocus={() => setIsDropdownOpen(true)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-11 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 text-slate-800"
                                />
                                <ChevronDown size={16} className={`absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                            </div>

                            {/* Dropdown Options */}
                            {isDropdownOpen && (
                                <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto p-1 text-sm">
                                    {filteredSurahs.length > 0 ? (
                                        filteredSurahs.map(s => (
                                            <button
                                                key={s.nomor}
                                                type="button"
                                                onClick={() => {
                                                    setSelectedSurah(s.nomor);
                                                    setSearchSurah(`${s.nomor}. ${s.namaLatin} (${s.arti})`);
                                                    setIsDropdownOpen(false);
                                                }}
                                                className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors flex items-center justify-between group ${String(selectedSurah) === String(s.nomor) ? 'bg-emerald-50 text-emerald-700 font-medium' : 'hover:bg-slate-50 text-slate-700'} active:scale-[0.98]`}
                                            >
                                                <span>{s.nomor}. {s.namaLatin} <span className="text-slate-500 font-normal">({s.arti})</span></span>
                                                <span className="text-xs text-slate-400 group-hover:text-emerald-500 whitespace-nowrap ml-2">{s.jumlahAyat} ayat</span>
                                            </button>
                                        ))
                                    ) : (
                                        <div className="px-3 py-4 text-center text-slate-500">
                                            Surah tidak ditemukan
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Field 2: Range Ayat */}
                <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Range Ayat</label>
                    <div className="flex items-center gap-3">
                        <input
                            type="number" min="1" placeholder="Ayat awal"
                            value={ayatAwal} onChange={e => setAyatAwal(e.target.value)}
                            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 text-slate-800"
                            required
                        />
                        <span className="text-slate-400 font-bold text-sm shrink-0">–</span>
                        <input
                            type="number" min="1" placeholder="Ayat akhir"
                            value={ayatAkhir} onChange={e => setAyatAkhir(e.target.value)}
                            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 text-slate-800"
                            required
                        />
                    </div>
                    <p className="text-xs text-slate-400 mt-1.5">Contoh: Ayat 1 sampai 5 → masukkan 1 dan 5</p>
                </div>

                {/* Field 3: Upload Audio */}
                <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">
                        Audio Tilawah <span className="text-slate-400 font-normal normal-case">(opsional)</span>
                    </label>
                    {audioPreview ? (
                        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center gap-3">
                            <div className="bg-emerald-100 rounded-lg p-2 shrink-0">
                                <Music size={16} className="text-emerald-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-emerald-800 truncate">{audioFile?.name}</p>
                                <audio src={audioPreview} controls className="w-full mt-1.5" style={{ height: '32px' }} />
                            </div>
                            <button type="button" onClick={removeAudio}
                                className="shrink-0 bg-red-100 hover:bg-red-200 text-red-500 rounded-lg p-1.5 transition-colors">
                                <X size={14} />
                            </button>
                        </div>
                    ) : (
                        <label className="flex items-center gap-3 bg-slate-50 border-2 border-dashed border-slate-200 hover:border-emerald-400 hover:bg-emerald-50 rounded-xl py-3 px-4 cursor-pointer transition-all group">
                            <div className="bg-slate-200 group-hover:bg-emerald-100 rounded-lg p-2 shrink-0 transition-colors">
                                <Music size={16} className="text-slate-500 group-hover:text-emerald-600 transition-colors" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-600 group-hover:text-emerald-700">Klik untuk upload audio</p>
                                <p className="text-xs text-slate-400">MP3, WAV, M4A, OGG</p>
                            </div>
                            <input ref={audioInputRef} type="file" accept="audio/*" className="hidden" onChange={handleAudioChange} />
                        </label>
                    )}
                </div>

                {submitError && (
                    <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3 text-red-700 text-sm">
                        <AlertCircle size={16} className="shrink-0 mt-0.5" /><span>{submitError}</span>
                    </div>
                )}
                {submitSuccess && (
                    <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-emerald-700 text-sm">
                        <CheckCircle2 size={16} className="shrink-0" /><span>Potongan surat berhasil ditambahkan!</span>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting || loadingSurahs}
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:from-slate-300 disabled:to-slate-300 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-emerald-200 active:scale-[0.98]"
                >
                    {isSubmitting ? (
                        <><Loader2 size={16} className="animate-spin" /><span>Mengambil data dari API...</span></>
                    ) : (
                        <><Plus size={16} /><span>Tambahkan Potongan Surat</span></>
                    )}
                </button>
            </form>
        </div>
    );
}

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}
