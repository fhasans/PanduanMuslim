import React, { useState, useCallback } from 'react';
import { Search, Filter, ChevronDown, Book, Bookmark, Shield, ShieldOff } from 'lucide-react';
import AccordionCard from '../ui/AccordionCard.jsx';
import { dataJuzAmma } from '../../data/juzAmmaData.js';
import PotonganSuratForm from './hafalan/PotonganSuratForm.jsx';
import PotonganSuratCard from './hafalan/PotonganSuratCard.jsx';
import { supabase } from '../../lib/supabase.js';

// Ambil data potongan dari localStorage telah digantikan dengan fetch Supabase

export default function HafalanSection() {
    const [activeTab, setActiveTab] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('hafalanActiveTab') || 'juzamma';
        }
        return 'juzamma';
    });

    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('hafalanActiveTab', activeTab);
        }
    }, [activeTab]);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');

    // Potongan surat state
    const [potonganList, setPotonganList] = useState([]);
    const [loadingPotongan, setLoadingPotongan] = useState(true);

    React.useEffect(() => {
        async function fetchPotongan() {
            setLoadingPotongan(true);
            const { data, error } = await supabase
                .from('potongan_surat')
                .select('*')
                .order('created_at', { ascending: false });

            if (!error && data) {
                setPotonganList(data);
            }
            setLoadingPotongan(false);
        }
        fetchPotongan();
    }, []);

    // Admin mode: klik "Hafalan & Bacaan" 5x (Persist di localStorage)
    const [titleClickCount, setTitleClickCount] = useState(0);
    const [isAdminMode, setIsAdminMode] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('hafalanAdminMode') === 'true';
        }
        return false;
    });

    const handleTitleClick = useCallback(() => {
        const next = titleClickCount + 1;
        console.log(`Title click: ${next}/5`);
        if (next >= 5) {
            const newMode = !isAdminMode;
            setIsAdminMode(newMode);
            localStorage.setItem('hafalanAdminMode', newMode.toString());
            console.log(`Admin Mode: ${newMode}`);
            setTitleClickCount(0);
        } else {
            setTitleClickCount(next);
        }
    }, [titleClickCount, isAdminMode]);

    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            window.enableHafalanAdmin = () => {
                setIsAdminMode(true);
                localStorage.setItem('hafalanAdminMode', 'true');
                console.log('Admin mode enabled via console.');
                return 'Admin Mode Aktif! Silakan cek tab Potongan Surat.';
            };
        }
    }, []);

    // Tambah potongan baru dari form (prepend to list)
    const handleAdd = useCallback((newItem) => {
        setPotonganList(prev => [newItem, ...prev]);
    }, []);

    // Hapus card (admin mode)
    const handleDelete = useCallback(async (id) => {
        const itemToDelete = potonganList.find(i => i.id === id);
        if (!itemToDelete) return;

        // Delete from DB
        const { error } = await supabase.from('potongan_surat').delete().eq('id', id);
        if (error) {
            console.error('Gagal menghapus data dari DB:', error.message);
            return;
        }

        // Jika ada audio_name atau audio_url, coba hapus dari bucket Storage juga
        if (itemToDelete.audio_url) {
            // Kita coba ekstrak filename dari url. Struktur path kita biasanya "audio/namafile.mp3"
            const urlParts = itemToDelete.audio_url.split('/');
            const filename = urlParts[urlParts.length - 1];
            if (filename) {
                const filePath = `audio/${filename}`;
                await supabase.storage.from('tilawah').remove([filePath]);
            }
        }

        setPotonganList(prev => prev.filter(item => item.id !== id));
    }, [potonganList]);

    // Upgrade card lama ke format per-ayat (dipanggil dari card)
    const handleUpgrade = useCallback((upgradedItem) => {
        setPotonganList(prev => prev.map(item => item.id === upgradedItem.id ? upgradedItem : item));
    }, []);

    // Filter Juz Amma
    const filteredSurat = dataJuzAmma.filter(surat => {
        const matchSearch =
            surat.surat.toLowerCase().includes(search.toLowerCase()) ||
            surat.artiNama.toLowerCase().includes(search.toLowerCase());
        let matchFilter = true;
        if (filter === '<10') matchFilter = surat.jumlahAyat < 10;
        if (filter === '10-20') matchFilter = surat.jumlahAyat >= 10 && surat.jumlahAyat <= 20;
        if (filter === '>20') matchFilter = surat.jumlahAyat > 20;
        return matchSearch && matchFilter;
    });

    return (
        <div className="p-4 md:p-0 space-y-6">
            {/* Judul — klik 5x untuk admin mode */}
            <div className="text-center md:text-left mb-4">
                <div className="flex items-center gap-2 md:justify-start justify-center">
                    <div className="relative">
                        <h2
                            className="text-2xl font-bold text-slate-900 dark:text-slate-50 cursor-pointer select-none active:scale-95 transition-all hover:text-indigo-600 dark:hover:text-indigo-400 px-2 py-1 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
                            onClick={handleTitleClick}
                            title="Klik 5x untuk Mode Admin"
                        >
                            Hafalan &amp; Bacaan
                        </h2>
                        {titleClickCount > 0 && (
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-bold px-2 py-1 rounded-full animate-bounce shadow-md pointer-events-none">
                                {titleClickCount}/5
                            </div>
                        )}
                    </div>
                    {isAdminMode && (
                        <span className="flex items-center gap-1 bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full border border-red-200">
                            <Shield size={11} />
                            Admin
                        </span>
                    )}
                </div>
                <p className="text-slate-500 text-sm mt-1">
                    {isAdminMode
                        ? 'Mode admin aktif — klik tombol merah untuk hapus card.'
                        : 'Hafalkan surah pendek atau potongan ayat bermakna untuk shalat Anda.'}
                </p>
            </div>

            {/* Tab Navigation */}
            <div className="flex bg-slate-100 p-1 rounded-xl w-full max-w-sm mb-6">
                <button
                    onClick={() => setActiveTab('juzamma')}
                    className={`flex-1 text-sm py-2 font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${activeTab === 'juzamma' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <Book size={16} /> Juz Amma
                </button>
                <button
                    onClick={() => setActiveTab('potongan')}
                    className={`flex-1 text-sm py-2 font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${activeTab === 'potongan' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <Bookmark size={16} /> Potongan Surat
                </button>
            </div>

            {/* ===== TAB JUZ AMMA ===== */}
            {activeTab === 'juzamma' ? (
                <div className="space-y-4 animate-in fade-in">
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
                                <Search size={18} />
                            </div>
                            <input
                                type="text"
                                placeholder="Cari nama atau arti surah..."
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="relative shrink-0 w-full sm:w-auto">
                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
                                <Filter size={18} />
                            </div>
                            <select
                                className="w-full sm:w-auto bg-slate-50 border border-slate-200 rounded-xl py-2 pl-10 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none text-slate-700 font-medium"
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                            >
                                <option value="all">Semua Ayat</option>
                                <option value="<10">Kurang dari 10 Ayat</option>
                                <option value="10-20">10 hingga 20 Ayat</option>
                                <option value=">20">Lebih dari 20 Ayat</option>
                            </select>
                            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">
                                <ChevronDown size={16} />
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-4">
                        {filteredSurat.length > 0 ? (
                            filteredSurat.map((surat, idx) => (
                                <AccordionCard
                                    key={idx}
                                    title={`Surat ${surat.surat}`}
                                    subtitle={`Arti: ${surat.artiNama} • ${surat.jumlahAyat} Ayat`}
                                    icon={surat.nomor}
                                    defaultOpen={false}
                                >
                                    <div className="space-y-4">
                                        <div className="bg-indigo-50 p-4 rounded-xl flex justify-between items-start gap-2">
                                            <p className="font-semibold text-lg text-slate-800 leading-relaxed">{surat.bacaan}</p>
                                        </div>
                                        <p className="text-sm text-slate-600 italic border-l-2 border-indigo-200 pl-3">
                                            "{surat.arti}"
                                        </p>
                                    </div>
                                </AccordionCard>
                            ))
                        ) : (
                            <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                <Search className="mx-auto text-slate-300 mb-2" size={32} />
                                <p className="text-slate-500 font-medium">Surah tidak ditemukan</p>
                            </div>
                        )}
                    </div>
                </div>

            ) : (
                // ===== TAB POTONGAN SURAT =====
                <div className="space-y-4 animate-in fade-in">
                    {/* Info banner */}
                    <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                        <p className="text-sm text-indigo-800 font-medium">
                            Potongan ayat yang ringkas namun maknanya bulat dan mendalam,
                            sangat direkomendasikan untuk dibaca setelah surat Al-Fatihah di dalam shalat.
                        </p>
                    </div>

                    {/* FORM TAMBAH */}
                    <PotonganSuratForm onAdd={handleAdd} />

                    {/* Admin mode banner */}
                    {isAdminMode && (
                        <div className="flex items-center justify-between bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                            <div className="flex items-center gap-2 text-red-700 text-sm font-medium">
                                <Shield size={15} />
                                Mode Admin Aktif — Tombol hapus tersedia pada setiap card
                            </div>
                            <button
                                onClick={() => setIsAdminMode(false)}
                                className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-bold"
                            >
                                <ShieldOff size={13} /> Nonaktifkan
                            </button>
                        </div>
                    )}

                    {/* LIST CARDS */}
                    <div className="grid gap-4">
                        {loadingPotongan ? (
                            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200">
                                <p className="text-slate-500 font-semibold animate-pulse">Memuat data dari server...</p>
                            </div>
                        ) : potonganList.length > 0 ? (
                            potonganList.map((item, idx) => (
                                <PotonganSuratCard
                                    key={item.id}
                                    item={item}
                                    index={idx}
                                    isAdminMode={isAdminMode}
                                    onDelete={handleDelete}
                                    onUpgrade={handleUpgrade}
                                    onUpdateItem={(updatedItem) => setPotonganList(prev => prev.map(p => p.id === updatedItem.id ? updatedItem : p))}
                                />
                            ))
                        ) : (
                            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                <Bookmark className="mx-auto text-slate-300 mb-3" size={36} />
                                <p className="text-slate-500 font-semibold">Belum ada potongan surat</p>
                                <p className="text-slate-400 text-sm mt-1">Gunakan form di atas untuk menambahkan</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
