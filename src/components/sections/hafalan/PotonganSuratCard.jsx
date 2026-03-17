import React, { useState, useRef } from 'react';
import { ChevronDown, ChevronUp, Trash2, Play, Pause, Music, RefreshCw, Loader2 } from 'lucide-react';

const API_BASE = 'https://equran.id/api/v2';

const toArabicNumerals = (num) => {
    const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return num.toString().split('').map(n => arabicNumbers[n]).join('');
};

export default function PotonganSuratCard({ item, index, isAdminMode, onDelete, onUpgrade }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isUpgrading, setIsUpgrading] = useState(false);
    const audioRef = useRef(null);

    const togglePlay = (e) => {
        e.stopPropagation();
        if (!audioRef.current) return;
        if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); }
        else { audioRef.current.play(); setIsPlaying(true); }
    };

    // Upgrade card lama: re-fetch per-ayat dari API
    const handleUpgrade = async (e) => {
        e.stopPropagation();
        if (!item.nomor) return;
        setIsUpgrading(true);
        try {
            const ayat = item.ayat || '';
            const parts = ayat.toString().split('-');
            const start = parseInt(parts[0]);
            const end = parts[1] ? parseInt(parts[1]) : start;

            const res = await fetch(`${API_BASE}/surat/${item.nomor}`);
            if (!res.ok) throw new Error('Gagal fetch');
            const data = await res.json();
            const allAyat = data.data?.ayat || [];

            const ayatList = allAyat
                .filter(a => a.nomorAyat >= start && a.nomorAyat <= end)
                .map(a => ({
                    nomorAyat: a.nomorAyat,
                    teksArab: a.teksArab,
                    teksLatin: a.teksLatin,
                    teksIndonesia: a.teksIndonesia,
                }));

            if (ayatList.length > 0) {
                const upgraded = { ...item, ayatList, arab: undefined, latin: undefined, arti: undefined };
                // Simpan ke localStorage
                const existing = JSON.parse(localStorage.getItem('potonganSuratCustom') || '[]');
                const updated = existing.map(i => i.id === item.id ? upgraded : i);
                localStorage.setItem('potonganSuratCustom', JSON.stringify(updated));
                onUpgrade(upgraded);
            }
        } catch (err) {
            console.error('Upgrade gagal:', err);
        } finally {
            setIsUpgrading(false);
        }
    };

    const ayatList = item.ayatList || null;
    const isOldFormat = !ayatList;

    return (
        <div className={`bg-white border rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden ${isAdminMode ? 'border-red-200 ring-1 ring-red-100' : 'border-slate-100'}`}>

            {/* ── Header card ── */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-colors ${isOpen ? 'bg-slate-50/60' : 'hover:bg-slate-50'}`}
            >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="relative w-8 h-8 shrink-0">
                        <svg viewBox="0 0 32 32" className="w-full h-full text-emerald-100">
                            <polygon points="16,1 31,8.5 31,23.5 16,31 1,23.5 1,8.5" fill="currentColor" stroke="#6ee7b7" strokeWidth="1.5" />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-emerald-700">
                            {index + 1}
                        </span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-800 text-sm truncate">{item.judul}</h4>
                        <p className="text-xs text-slate-400 mt-0.5">{item.surat} · Ayat {item.ayat}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 ml-3">
                    {/* Upgrade button untuk format lama */}
                    {isOldFormat && (
                        <button
                            onClick={handleUpgrade}
                            disabled={isUpgrading}
                            className="flex items-center gap-1 bg-amber-100 hover:bg-amber-200 text-amber-700 text-[10px] font-bold px-2 py-1 rounded-lg transition-colors"
                            title="Perbarui tampilan per-ayat"
                        >
                            {isUpgrading
                                ? <Loader2 size={11} className="animate-spin" />
                                : <RefreshCw size={11} />}
                            <span>Perbarui</span>
                        </button>
                    )}

                    {item.audioBase64 && !isOpen && (
                        <button
                            onClick={togglePlay}
                            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${isPlaying ? 'bg-emerald-500 text-white' : 'bg-emerald-100 text-emerald-600 hover:bg-emerald-500 hover:text-white'}`}
                        >
                            {isPlaying ? <Pause size={13} /> : <Play size={13} />}
                        </button>
                    )}

                    {isAdminMode && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                            className="w-7 h-7 rounded-full bg-red-100 hover:bg-red-500 text-red-500 hover:text-white flex items-center justify-center transition-all"
                        >
                            <Trash2 size={13} />
                        </button>
                    )}

                    <div className="text-slate-400">
                        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                </div>
            </div>

            {/* ── Konten expand ── */}
            {isOpen && (
                <div className="border-t border-slate-100">
                    {/* Audio Player */}
                    {item.audioBase64 && (
                        <div className="mx-4 mt-4 bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                            <div className="flex items-center gap-2 mb-2">
                                <Music size={13} className="text-emerald-600" />
                                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">Audio Tilawah</span>
                                {item.audioName && <span className="text-xs text-emerald-500 truncate">· {item.audioName}</span>}
                            </div>
                            <audio src={item.audioBase64} controls className="w-full" style={{ height: '36px' }} />
                        </div>
                    )}

                    {/* ── Format BARU: per-ayat ── */}
                    {ayatList ? (
                        <div className="space-y-4 p-4">
                            {ayatList.map((ayat) => (
                                <div key={ayat.nomorAyat} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                                    {/* Bar nomor ayat */}
                                    <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border-b border-slate-100">
                                        <div className="relative w-7 h-7 shrink-0">
                                            <svg viewBox="0 0 28 28" className="w-full h-full text-indigo-100">
                                                <polygon points="14,1 27,7.5 27,20.5 14,27 1,20.5 1,7.5" fill="currentColor" stroke="#a5b4fc" strokeWidth="1" />
                                            </svg>
                                            <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-indigo-700">
                                                {ayat.nomorAyat}
                                            </span>
                                        </div>
                                        <span className="text-xs text-slate-400 font-medium">Ayat {ayat.nomorAyat}</span>
                                    </div>

                                    {/* Teks Arab — marker ﴿X﴾ di akhir teks (kiri secara visual RTL) */}
                                    <div className="px-5 pt-5 pb-3">
                                        <p
                                            className="text-right text-2xl md:text-3xl leading-[2.6] text-slate-800"
                                            style={{ fontFamily: 'serif', direction: 'rtl', unicodeBidi: 'embed' }}
                                        >
                                            {ayat.teksArab}
                                            {' '}
                                            <span className="text-indigo-400 text-xl font-bold" style={{ fontFamily: 'serif' }}>
                                                ﴿{toArabicNumerals(ayat.nomorAyat)}﴾
                                            </span>
                                        </p>
                                    </div>

                                    {/* Latin & Terjemahan */}
                                    <div className="px-5 pb-4 space-y-2 border-t border-slate-100 pt-3">
                                        {ayat.teksLatin && (
                                            <p className="text-sm text-indigo-600 italic leading-relaxed font-medium">
                                                {ayat.teksLatin}
                                                {' '}
                                                <span className="not-italic font-bold text-indigo-400 text-xs">
                                                    ﴿{toArabicNumerals(ayat.nomorAyat)}﴾
                                                </span>
                                            </p>
                                        )}
                                        {ayat.teksIndonesia && (
                                            <p className="text-sm text-slate-600 leading-relaxed">
                                                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 text-slate-500 font-bold text-[10px] mr-1 shrink-0">
                                                    {ayat.nomorAyat}
                                                </span>
                                                {ayat.teksIndonesia}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        /* ── Format LAMA: tampilkan dengan pesan upgrade ── */
                        <div className="p-4 space-y-4">
                            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
                                <RefreshCw size={13} className="text-amber-600 shrink-0" />
                                <p className="text-xs text-amber-700">
                                    Data ini menggunakan format lama. Klik tombol <strong>"Perbarui"</strong> di atas untuk menampilkan per-ayat dengan nomor pembatas.
                                </p>
                            </div>

                            {item.arab && (
                                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                                    <p className="text-right text-2xl md:text-3xl leading-[2.5] text-slate-800"
                                        style={{ fontFamily: 'serif', direction: 'rtl' }}>
                                        {item.arab}
                                    </p>
                                </div>
                            )}
                            {item.latin && (
                                <p className="text-sm text-indigo-600 italic leading-relaxed font-medium px-1">
                                    "{item.latin}"
                                </p>
                            )}
                            {item.arti && (
                                <p className="text-sm text-slate-600 leading-relaxed border-l-2 border-emerald-300 pl-3">
                                    <span className="font-semibold text-slate-700">Artinya: </span>{item.arti}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Audio hidden untuk play mini */}
            {item.audioBase64 && !isOpen && (
                <audio ref={audioRef} src={item.audioBase64} onEnded={() => setIsPlaying(false)} className="hidden" />
            )}
        </div>
    );
}
