import React, { useState, useRef } from 'react';
import { ChevronDown, ChevronUp, Trash2, Play, Pause, Music } from 'lucide-react';

// Konversi angka ke angka Arab (sama seperti SurahDetail)
const toArabicNumerals = (num) => {
    const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return num.toString().split('').map(n => arabicNumbers[n]).join('');
};

export default function PotonganSuratCard({ item, index, isAdminMode, onDelete }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    const togglePlay = (e) => {
        e.stopPropagation();
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play();
            setIsPlaying(true);
        }
    };

    // Dukung format lama (arab/latin/arti string) dan format baru (ayatList array)
    const ayatList = item.ayatList || null;

    return (
        <div className={`bg-white border rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden ${isAdminMode ? 'border-red-200 ring-1 ring-red-100' : 'border-slate-100'}`}>

            {/* ── Header card ── */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-colors ${isOpen ? 'bg-slate-50/60' : 'hover:bg-slate-50'}`}
            >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    {/* Nomor hexagon */}
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
                    {/* Play mini (jika ada audio & card sedang tutup) */}
                    {item.audioBase64 && !isOpen && (
                        <button
                            onClick={togglePlay}
                            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${isPlaying ? 'bg-emerald-500 text-white' : 'bg-emerald-100 text-emerald-600 hover:bg-emerald-500 hover:text-white'}`}
                            title={isPlaying ? 'Pause' : 'Putar audio'}
                        >
                            {isPlaying ? <Pause size={13} /> : <Play size={13} />}
                        </button>
                    )}

                    {/* Tombol hapus admin */}
                    {isAdminMode && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                            className="w-7 h-7 rounded-full bg-red-100 hover:bg-red-500 text-red-500 hover:text-white flex items-center justify-center transition-all"
                            title="Hapus card ini"
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
                                {item.audioName && (
                                    <span className="text-xs text-emerald-500 truncate">· {item.audioName}</span>
                                )}
                            </div>
                            <audio
                                src={item.audioBase64}
                                controls
                                className="w-full"
                                style={{ height: '36px' }}
                            />
                        </div>
                    )}

                    {/* ── Render per ayat (format baru) ── */}
                    {ayatList ? (
                        <div className="space-y-3 p-4">
                            {ayatList.map((ayat) => (
                                <div
                                    key={ayat.nomorAyat}
                                    className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
                                >
                                    {/* Nomor ayat bar */}
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

                                    {/* Teks Arab */}
                                    <div className="p-5 pb-3">
                                        <p
                                            className="text-right text-2xl md:text-3xl leading-[2.5] text-slate-800"
                                            style={{ fontFamily: 'serif', direction: 'rtl' }}
                                        >
                                            {ayat.teksArab} ﴿{toArabicNumerals(ayat.nomorAyat)}﴾
                                        </p>
                                    </div>

                                    {/* Latin & Terjemahan */}
                                    <div className="px-5 pb-4 space-y-2 border-t border-slate-50 pt-3">
                                        {ayat.teksLatin && (
                                            <p className="text-sm text-indigo-600 italic leading-relaxed font-medium">
                                                {ayat.teksLatin} ﴿{toArabicNumerals(ayat.nomorAyat)}﴾
                                            </p>
                                        )}
                                        {ayat.teksIndonesia && (
                                            <p className="text-sm text-slate-600 leading-relaxed">
                                                <span className="font-semibold text-slate-500">{ayat.nomorAyat}.</span>{' '}
                                                {ayat.teksIndonesia}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        /* ── Render format lama (fallback string) ── */
                        <div className="p-4 space-y-4">
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

            {/* Audio hidden untuk play mini (saat card tutup) */}
            {item.audioBase64 && !isOpen && (
                <audio
                    ref={audioRef}
                    src={item.audioBase64}
                    onEnded={() => setIsPlaying(false)}
                    className="hidden"
                />
            )}
        </div>
    );
}
