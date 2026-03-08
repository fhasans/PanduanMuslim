import React, { useState, useEffect } from 'react';
import { Search, List, Loader2, AlertCircle, Bookmark, Star } from 'lucide-react';
import AccordionCard from '../ui/AccordionCard.jsx';

export default function DoaSection() {
    const [doaList, setDoaList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [selectedGroup, setSelectedGroup] = useState('Semua');

    useEffect(() => {
        fetch('https://equran.id/api/doa')
            .then(res => res.json())
            .then(data => {
                setDoaList(data.data || []);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    // Get unique groups
    const groups = ['Semua', ...new Set(doaList.map(d => d.grup))].filter(Boolean);

    // Normalize: lowercase, remove special chars
    const normalize = (str) =>
        (str || '').toLowerCase()
           .replace(/[-\s''`]/g, '');

    const q = normalize(search);

    const filtered = doaList.filter(d => {
        const matchSearch = !search ||
            normalize(d.nama).includes(q) ||
            normalize(d.tr).includes(q) ||
            normalize(d.idn).includes(q) ||
            (d.tag && d.tag.some(t => normalize(t).includes(q)));
        
        const matchGroup = selectedGroup === 'Semua' || d.grup === selectedGroup;

        return matchSearch && matchGroup;
    });

    return (
        <div className="p-4 md:p-0 space-y-6">
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-800 to-emerald-600 text-white shadow-lg p-6">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                <div className="relative z-10 flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Bookmark size={20} className="text-amber-300 fill-amber-300" />
                            <span className="text-emerald-100 text-xs font-bold uppercase tracking-widest">Kumpulan Doa</span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-extrabold leading-tight mb-1">
                            Doa Harian As-Sunnah
                        </h2>
                        <p className="text-emerald-100 text-sm">Doa dan Dzikir berdasarkan Al-Qur'an dan Hadits Shahih</p>
                    </div>
                    <div className="text-right shrink-0 ml-4 hidden sm:block">
                        <p className="text-4xl font-arabic text-amber-300 leading-none">الدعاء</p>
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                <div className="relative">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
                        <Search size={18} />
                    </div>
                    <input
                        type="text"
                        placeholder="Cari doa, arti, atau kata kunci..."
                        className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-sm"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                
                {/* Horizontal scroll for groups */}
                <div className="flex overflow-x-auto no-scrollbar gap-2 pb-1">
                    {groups.map(g => (
                        <button
                            key={g}
                            onClick={() => setSelectedGroup(g)}
                            className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-colors border ${selectedGroup === g ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                        >
                            {g}
                        </button>
                    ))}
                </div>
            </div>

            {loading && (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                    <Loader2 size={36} className="animate-spin mb-3 text-emerald-400" />
                    <p className="text-sm font-medium">Memuat kumpulan doa...</p>
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
                <div className="space-y-4 pt-2">
                    <p className="text-xs text-slate-400 font-medium px-1">
                        Menampilkan {filtered.length} doa {selectedGroup !== 'Semua' && `di kategori ${selectedGroup}`}
                    </p>
                    
                    {filtered.length === 0 ? (
                        <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                            <Search className="mx-auto text-slate-300 mb-2" size={28} />
                            <p className="text-slate-500 font-medium text-sm">Doa tidak ditemukan</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filtered.map(doa => (
                                <AccordionCard key={doa.id} title={doa.nama}>
                                    <div className="space-y-4 text-right">
                                        <p className="font-arabic text-2xl md:text-3xl leading-loose font-bold text-slate-800 tracking-wide mt-2">
                                            {doa.ar}
                                        </p>
                                    </div>
                                    <div className="mt-4 space-y-3">
                                        <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-100">
                                            <p className="font-semibold text-emerald-800 text-sm mb-2 italic">
                                                "{doa.tr}"
                                            </p>
                                            <p className="text-slate-600 text-sm">
                                                Artinya: "{doa.idn}"
                                            </p>
                                        </div>
                                        {doa.tentang && (
                                            <div className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg whitespace-pre-line">
                                                {doa.tentang}
                                            </div>
                                        )}
                                        <div className="flex justify-end pt-2">
                                                                                    </div>
                                    </div>
                                </AccordionCard>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );

}
