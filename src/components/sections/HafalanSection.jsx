import React, { useState } from 'react';
import { Search, Filter, ChevronDown, Book, Bookmark } from 'lucide-react';
import AccordionCard from '../ui/AccordionCard.jsx';
import { dataJuzAmma } from '../../data/juzAmmaData.js';
import { potonganSuratData } from '../../data/potonganSuratData.js';

export default function HafalanSection() {
    const [activeTab, setActiveTab] = useState('juzamma'); // 'juzamma' or 'potongan'
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');

    const filteredSurat = dataJuzAmma.filter(surat => {
        const matchSearch = surat.surat.toLowerCase().includes(search.toLowerCase()) ||
            surat.artiNama.toLowerCase().includes(search.toLowerCase());

        let matchFilter = true;
        if (filter === '<10') matchFilter = surat.jumlahAyat < 10;
        if (filter === '10-20') matchFilter = surat.jumlahAyat >= 10 && surat.jumlahAyat <= 20;
        if (filter === '>20') matchFilter = surat.jumlahAyat > 20;

        return matchSearch && matchFilter;
    });

    return (
        <div className="p-4 md:p-0 space-y-6">
            <div className="text-center md:text-left mb-4">
                <h2 className="text-2xl font-bold text-slate-900">Hafalan & Bacaan</h2>
                <p className="text-slate-500 text-sm mt-1">Hafalkan surah pendek atau potongan ayat bermakna untuk shalat Anda.</p>
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
                <div className="space-y-4 animate-in fade-in">
                    <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                        <p className="text-sm text-indigo-800 font-medium">
                            Potongan ayat yang ringkas namun maknanya bulat dan mendalam, sangat direkomendasikan untuk dibaca setelah surat Al-Fatihah di dalam shalat.
                        </p>
                    </div>
                    
                    <div className="grid gap-4">
                        {potonganSuratData.map((potongan, idx) => (
                            <AccordionCard
                                key={idx}
                                title={potongan.judul}
                                subtitle={`${potongan.surat} : Ayat ${potongan.ayat}`}
                                icon={idx + 1}
                                defaultOpen={idx === 0}
                            >
                                <div className="space-y-4">
                                    <div className="bg-indigo-50 p-4 rounded-xl flex flex-col items-end gap-3 border border-indigo-100">
                                        <p className="font-arabic text-2xl md:text-3xl leading-loose font-bold text-slate-800 text-right w-full">
                                            {potongan.arab}
                                        </p>
                                                                            </div>
                                    <div className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100 leading-relaxed font-medium">
                                        "{potongan.latin}"
                                    </div>
                                    <p className="text-sm text-slate-600 italic border-l-2 border-indigo-200 pl-3">
                                        Artinya: "{potongan.arti}"
                                    </p>
                                </div>
                            </AccordionCard>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
