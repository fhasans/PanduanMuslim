import React, { useState, useEffect } from 'react';
import { Search, ChevronRight, BookOpen, Loader2, AlertCircle } from 'lucide-react';
import SurahDetail from './SurahDetail.jsx';

const API_BASE = 'https://equran.id/api/v2';

export default function QuranSection() {
    const [surahs, setSurahs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [selectedSurah, setSelectedSurah] = useState(null);

    useEffect(() => {
        fetch(`${API_BASE}/surat`)
            .then(res => {
                if (!res.ok) throw new Error('Gagal memuat data');
                return res.json();
            })
            .then(data => {
                setSurahs(data.data || []);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    // Normalize: lowercase, remove hyphens/spaces/apostrophes, strip common Arabic definite article prefixes
    const normalize = (str) =>
        str.toLowerCase()
           .replace(/[-\s''`]/g, '')
           .replace(/^(al|at|an|ar|as|ash|az|ad|adh|adz)/i, '');

    const q = normalize(search);

    const filtered = surahs.filter(s =>
        !search ||
        normalize(s.namaLatin).includes(q) ||
        s.arti.toLowerCase().includes(search.toLowerCase()) ||
        String(s.nomor).startsWith(search.trim())
    );


    if (selectedSurah) {
        return (
            <SurahDetail
                surah={selectedSurah}
                onBack={() => setSelectedSurah(null)}
            />
        );
    }

    return (
        <div className="p-4 md:p-0 space-y-6">
            {/* Header */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-900 to-indigo-700 text-white shadow-lg p-6">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                <div className="relative z-10 flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <BookOpen size={20} className="text-yellow-300" />
                            <span className="text-indigo-200 text-xs font-bold uppercase tracking-widest">Al-Qur'an Digital</span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-extrabold leading-tight mb-1">
                            Al-Qur'an
                        </h2>
                        <p className="text-indigo-200 text-sm">114 Surah · Teks Arab · Terjemahan Indonesia · Audio</p>
                    </div>
                    <div className="text-right shrink-0 ml-4">
                        <p className="text-3xl font-arabic text-yellow-300 leading-none">ٱلْقُرْءَان</p>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
                    <Search size={18} />
                </div>
                <input
                    type="text"
                    placeholder="Cari nama, arti, atau nomor surah..."
                    className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>

            {/* Content */}
            {loading && (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                    <Loader2 size={36} className="animate-spin mb-3 text-indigo-400" />
                    <p className="text-sm font-medium">Memuat daftar surah...</p>
                </div>
            )}

            {error && (
                <div className="flex flex-col items-center justify-center py-16 text-slate-400 bg-red-50 rounded-2xl border border-red-100">
                    <AlertCircle size={36} className="mb-3 text-red-400" />
                    <p className="text-sm font-medium text-red-600">Gagal memuat data: {error}</p>
                    <p className="text-xs text-red-400 mt-1">Periksa koneksi internet Anda</p>
                </div>
            )}

            {!loading && !error && (
                <div className="grid gap-2">
                    <p className="text-xs text-slate-400 font-medium px-1">
                        Menampilkan {filtered.length} dari {surahs.length} surah
                    </p>
                    {filtered.length === 0 ? (
                        <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                            <Search className="mx-auto text-slate-300 mb-2" size={28} />
                            <p className="text-slate-500 font-medium text-sm">Surah tidak ditemukan</p>
                        </div>
                    ) : (
                        filtered.map(surah => (
                            <button
                                key={surah.nomor}
                                onClick={() => setSelectedSurah(surah)}
                                className="w-full flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 hover:border-indigo-200 hover:shadow-md transition-all text-left active:scale-[0.99] group"
                            >
                                {/* Number badge */}
                                <div className="relative shrink-0 w-11 h-11">
                                    <svg viewBox="0 0 44 44" className="w-full h-full text-indigo-100 group-hover:text-indigo-200 transition-colors">
                                        <polygon points="22,2 42,12 42,32 22,42 2,32 2,12" fill="currentColor" stroke="#a5b4fc" strokeWidth="1"/>
                                    </svg>
                                    <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-indigo-700">{surah.nomor}</span>
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-slate-800 text-sm">{surah.namaLatin}</h3>
                                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${surah.tempatTurun === 'Mekah' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                            {surah.tempatTurun}
                                        </span>
                                    </div>
                                    <p className="text-slate-400 text-xs mt-0.5">{surah.arti} · {surah.jumlahAyat} Ayat</p>
                                </div>

                                {/* Arabic name */}
                                <div className="shrink-0 text-right">
                                    <p className="text-indigo-600 font-bold text-base leading-none" style={{ fontFamily: 'serif' }}>{surah.nama}</p>
                                </div>

                                <ChevronRight size={16} className="shrink-0 text-slate-300 group-hover:text-indigo-400 transition-colors" />
                            </button>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
