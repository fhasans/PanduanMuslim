import React, { useState, useRef } from 'react';
import { ChevronDown, ChevronUp, Trash2, Play, Pause, Music } from 'lucide-react';

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

    const handleAudioEnded = () => setIsPlaying(false);

    return (
        <div className={`bg-white border rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden ${isAdminMode ? 'border-red-200' : 'border-slate-200'}`}>
            {/* Header card */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full text-left p-5 flex justify-between items-center cursor-pointer transition-colors ${isOpen ? 'bg-slate-50/50' : 'hover:bg-slate-50'}`}
            >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    {/* Nomor */}
                    <div className="bg-emerald-100 text-emerald-700 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                        {index + 1}
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-800 text-sm truncate">{item.judul}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">{item.surat} · Ayat {item.ayat}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 ml-3">
                    {/* Audio play button mini (jika ada audio) */}
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

            {/* Konten yang bisa di-expand */}
            {isOpen && (
                <div className="px-5 pb-5 pt-1 border-t border-slate-100 space-y-4">
                    {/* Teks Arab */}
                    <div className="bg-gradient-to-br from-indigo-50 to-slate-50 border border-indigo-100 p-4 rounded-xl">
                        <p className="font-arabic text-2xl md:text-3xl leading-loose text-slate-800 text-right direction-rtl">
                            {item.arab}
                        </p>
                    </div>

                    {/* Latin */}
                    <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
                        <p className="text-sm text-slate-700 leading-relaxed font-medium italic">
                            "{item.latin}"
                        </p>
                    </div>

                    {/* Arti */}
                    <p className="text-sm text-slate-600 leading-relaxed border-l-2 border-emerald-300 pl-3">
                        <span className="font-semibold text-slate-700">Artinya: </span>
                        {item.arti}
                    </p>

                    {/* Audio Player */}
                    {item.audioBase64 && (
                        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                            <div className="flex items-center gap-2 mb-2">
                                <Music size={14} className="text-emerald-600" />
                                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">Audio Tilawah</span>
                                {item.audioName && (
                                    <span className="text-xs text-emerald-500 truncate">• {item.audioName}</span>
                                )}
                            </div>
                            <audio
                                ref={audioRef}
                                src={item.audioBase64}
                                controls
                                onEnded={handleAudioEnded}
                                onPlay={() => setIsPlaying(true)}
                                onPause={() => setIsPlaying(false)}
                                className="w-full"
                                style={{ height: '36px' }}
                            />
                        </div>
                    )}
                </div>
            )}

            {/* Audio hidden untuk play mini */}
            {item.audioBase64 && (
                <audio
                    ref={isOpen ? undefined : audioRef}
                    src={item.audioBase64}
                    onEnded={handleAudioEnded}
                    className="hidden"
                />
            )}
        </div>
    );
}
