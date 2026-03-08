import React, { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, Loader2, AlertCircle, MapPin } from 'lucide-react';
import QuranAudioButton from '../../ui/QuranAudioButton.jsx';

const API_BASE = 'https://equran.id/api/v2';

const QORI_LIST = [
    { id: '01', name: 'Abdullah Al-Juhany' },
    { id: '02', name: 'Abdul Muhsin Al-Qasim' },
    { id: '03', name: 'Abdurrahman as-Sudais' },
    { id: '04', name: 'Ibrahim Al-Dossari' },
    { id: '05', name: 'Misyari Rasyid Al-Afasi' },
    { id: '06', name: 'Yasser Al-Dosari' }
];

const toArabicNumerals = (num) => {
    const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return num.toString().split('').map(n => arabicNumbers[n]).join('');
};

export default function SurahDetail({ surah, onBack }) {
    const [detail, setDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showTranslation, setShowTranslation] = useState(true);
    const [showLatin, setShowLatin] = useState(true);
    const [qori, setQori] = useState('06'); // Default to Yasser Al-Dosari

    useEffect(() => {
        setLoading(true);
        setDetail(null);
        fetch(`${API_BASE}/surat/${surah.nomor}`)
            .then(res => {
                if (!res.ok) throw new Error('Gagal memuat surah');
                return res.json();
            })
            .then(data => {
                setDetail(data.data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, [surah.nomor]);

    return (
        <div className="p-4 md:p-0 space-y-4">
            {/* Header */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-900 to-indigo-700 text-white shadow-lg p-5">
                <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>
                <div className="relative z-10">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-indigo-200 hover:text-white text-sm font-medium mb-4 transition-colors"
                    >
                        <ArrowLeft size={16} /> Kembali ke Daftar Surah
                    </button>

                    <div className="text-center">
                        <p className="text-4xl font-bold mb-1 leading-none" style={{ fontFamily: 'serif' }}>
                            {surah.nama}
                        </p>
                        <h2 className="text-xl font-extrabold mt-3">{surah.namaLatin}</h2>
                        <div className="flex items-center justify-center gap-3 mt-1 text-indigo-200 text-sm">
                            <span>{surah.arti}</span>
                            <span>·</span>
                            <span>{surah.jumlahAyat} Ayat</span>
                            <span>·</span>
                            <span className="flex items-center gap-1">
                                <MapPin size={12} /> {surah.tempatTurun}
                            </span>
                        </div>
                    </div>

                    {/* Audio for full surah */}
                    {detail?.audioFull && (
                        <div className="mt-4 flex flex-col sm:flex-row justify-center items-center gap-3">
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-indigo-200 font-medium">Murottal Lengkap:</span>
                                <QuranAudioButton audioUrl={detail.audioFull[qori]} className="bg-white/10 border-white/20" />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Bismillah (for all surahs except At-Taubah and Al-Fatihah) */}
            {surah.nomor !== 1 && surah.nomor !== 9 && (
                <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 text-center">
                    <p className="text-2xl md:text-3xl text-indigo-800 leading-relaxed" style={{ fontFamily: 'serif', direction: 'rtl' }}>
                        بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                    </p>
                    <p className="text-sm text-indigo-500 mt-1 italic">Bismillaahir rahmaanir rahiim</p>
                </div>
            )}

            {/* View toggles & Qori filter */}
            <div className="flex flex-col sm:flex-row gap-2 bg-slate-100 p-2 rounded-xl">
                <div className="flex gap-2 flex-1">
                    <button
                        onClick={() => setShowLatin(!showLatin)}
                        className={`flex-1 text-xs font-bold py-2 px-3 rounded-lg transition-all ${showLatin ? 'bg-white text-indigo-700 shadow' : 'text-slate-500'}`}
                    >
                        Latinasi
                    </button>
                    <button
                        onClick={() => setShowTranslation(!showTranslation)}
                        className={`flex-1 text-xs font-bold py-2 px-3 rounded-lg transition-all ${showTranslation ? 'bg-white text-indigo-700 shadow' : 'text-slate-500'}`}
                    >
                        Terjemahan
                    </button>
                </div>
                <div className="sm:max-w-[200px]">
                    <select
                        className="w-full text-xs font-bold py-2 px-3 rounded-lg bg-white text-indigo-700 shadow border-none outline-none appearance-none text-center sm:text-left"
                        value={qori}
                        onChange={(e) => setQori(e.target.value)}
                    >
                        {QORI_LIST.map((q) => (
                            <option key={q.id} value={q.id}>{q.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Loading / Error */}
            {loading && (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                    <Loader2 size={36} className="animate-spin mb-3 text-indigo-400" />
                    <p className="text-sm">Memuat ayat...</p>
                </div>
            )}
            {error && (
                <div className="flex flex-col items-center justify-center py-16 bg-red-50 rounded-2xl border border-red-100 text-center">
                    <AlertCircle size={32} className="mb-2 text-red-400" />
                    <p className="text-sm text-red-600 font-medium">{error}</p>
                </div>
            )}

            {/* Verses */}
            {detail && (
                <div className="space-y-4">
                    {detail.ayat?.map(ayat => (
                        <div key={ayat.nomorAyat} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden">
                            {/* Verse number bar */}
                            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-slate-100">
                                <div className="flex items-center gap-2">
                                    <div className="relative w-7 h-7">
                                        <svg viewBox="0 0 28 28" className="w-full h-full text-indigo-100">
                                            <polygon points="14,1 27,7.5 27,20.5 14,27 1,20.5 1,7.5" fill="currentColor" stroke="#a5b4fc" strokeWidth="1"/>
                                        </svg>
                                        <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-indigo-700">{ayat.nomorAyat}</span>
                                    </div>
                                    <span className="text-xs text-slate-400 font-medium">Ayat {ayat.nomorAyat}</span>
                                </div>
                                {ayat.audio?.[qori] && (
                                    <QuranAudioButton audioUrl={ayat.audio[qori]} />
                                )}
                            </div>

                            {/* Arabic text */}
                            <div className="p-5 pb-3">
                                <p
                                    className="text-right text-2xl md:text-3xl leading-[2.5] text-slate-800"
                                    style={{ fontFamily: 'serif', direction: 'rtl' }}
                                >
                                    {ayat.teksArab} ﴿{toArabicNumerals(ayat.nomorAyat)}﴾
                                </p>
                            </div>

                            {/* Latin & Translation */}
                            {(showLatin || showTranslation) && (
                                <div className="px-5 pb-4 space-y-2 border-t border-slate-50 pt-3">
                                    {showLatin && ayat.teksLatin && (
                                        <p className="text-sm text-indigo-600 italic leading-relaxed font-medium">
                                            {ayat.teksLatin} ﴿{toArabicNumerals(ayat.nomorAyat)}﴾
                                        </p>
                                    )}
                                    {showTranslation && ayat.teksIndonesia && (
                                        <p className="text-sm text-slate-600 leading-relaxed">
                                            <span className="font-semibold text-slate-500">{ayat.nomorAyat}.</span> {ayat.teksIndonesia}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Tafsir link (bottom) */}
                    {detail.suratSelanjutnya && (
                        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 text-center">
                            <p className="text-sm text-indigo-600">
                                <BookOpen size={14} className="inline mr-1" />
                                Lanjut ke: <span className="font-bold">{detail.suratSelanjutnya.namaLatin}</span>
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
