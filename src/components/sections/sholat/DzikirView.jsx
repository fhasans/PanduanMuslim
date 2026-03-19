import React, { useState, useRef, useEffect } from 'react';
import { Check, Moon, BookOpen, Info, Home, Briefcase } from 'lucide-react';
import AccordionCard from '../../ui/AccordionCard.jsx';
import TasbihCounter from '../../ui/TasbihCounter.jsx';
import { dzikirPerWaktu, PAKET_DOA_PRIBADI } from '../../../data/dzikirData.js';

// ---- Tab / Waktu Config ----
const TABS = [
    { key: 'subuh',    label: 'Subuh',    emoji: '🌅' },
    { key: 'dzuhur',   label: 'Dzuhur',   emoji: '☀️' },
    { key: 'ashar',    label: 'Ashar',    emoji: '🕐' },
    { key: 'maghrib',  label: 'Maghrib',  emoji: '🌇' },
    { key: 'isya',     label: 'Isya',     emoji: '🌙' },
    { key: 'tahajjud', label: 'Tahajjud', emoji: '✨' },
    { key: 'taubat',   label: 'Taubat',   emoji: '🤲' },
];

// ---- Single Dzikir Card Renderer ----
function DzikirCard({ item, idx, offset = 0 }) {
    if (item.isSequence) {
        return (
            <AccordionCard title={item.judul} icon={idx + 1 + offset} defaultOpen={idx === 0 && offset === 0}>
                {item.desc && <p className="text-xs text-slate-500 italic mb-4">{item.desc}</p>}
                <div className="space-y-6">
                    {item.items.map((sub, sid) => (
                        <div key={sid} className="border-b border-slate-100 last:border-none pb-4 last:pb-0">
                            <p className="font-bold text-sm text-emerald-700 mb-1">{sub.judul}</p>
                            <div className="bg-emerald-50/50 p-3 rounded-xl mb-2">
                                <p className="font-medium text-base leading-relaxed text-emerald-900">"{sub.latin}"</p>
                            </div>
                            <p className="text-xs text-slate-500 italic mb-3">Artinya: "{sub.arti}"</p>
                            {sub.target > 0 && <TasbihCounter target={sub.target} label={`Hitung ${sub.judul}`} />}
                        </div>
                    ))}
                </div>
            </AccordionCard>
        );
    }

    return (
        <AccordionCard title={item.judul} icon={idx + 1 + offset} defaultOpen={idx === 0 && offset === 0}>
            {item.desc && <p className="text-xs text-slate-500 italic mb-3">{item.desc}</p>}
            <div className="mb-3 p-3 rounded-xl flex justify-between items-start gap-2 bg-emerald-50">
                <p className="font-medium text-base leading-relaxed text-emerald-900">"{item.latin}"</p>
            </div>
            <p className="text-sm text-slate-600 italic border-l-2 border-slate-300 pl-3 mb-3">Artinya: "{item.arti}"</p>
            {item.target > 0 && <TasbihCounter target={item.target} />}
        </AccordionCard>
    );
}

// ---- Main Component ----
export default function DzikirView() {
    const [activeTab, setActiveTab] = useState('subuh');
    const [mode, setMode] = useState('leluasa'); // 'leluasa' or 'pekerja'
    const [customDoaList, setCustomDoaList] = useState([]);
    const [customInput, setCustomInput] = useState('');
    const bottomRef = useRef(null);

    const isSubuhIsya = activeTab === 'subuh' || activeTab === 'isya';
    const isPekerjaModeTab = ['dzuhur', 'ashar', 'maghrib'].includes(activeTab);

    // Auto-switch mode based on tab when user first clicks it (optional, but follows image logic)
    useEffect(() => {
        if (isSubuhIsya) setMode('leluasa');
        else if (isPekerjaModeTab) setMode('pekerja');
    }, [activeTab]);

    const waktu = dzikirPerWaktu[activeTab];

    const handleAddCustomDoa = (e) => {
        e.preventDefault();
        if (!customInput.trim()) return;
        setCustomDoaList([...customDoaList, { id: Date.now(), text: customInput.trim() }]);
        setCustomInput('');
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    };

    // --- MODE 2 LOGIC: Dzikir Inti vs Lanjutan ---
    const getGroupedItems = () => {
        const items = [...waktu.items];
        
        if (mode === 'pekerja' && isPekerjaModeTab) {
            // A. Dzikir Inti (Istighfar, Perlindungan Neraka, Pujian Kedamaian, Ayat Kursi, Sapu Jagat)
            const inti = [];
            const lanjutan = [];

            items.forEach(item => {
                const title = item.judul.toLowerCase();
                if (title.includes('istighfar') || 
                    title.includes('neraka') || 
                    title.includes('kedamaian') || 
                    title.includes('ayat kursi')) {
                    inti.push(item);
                } else if (title.includes('penutup')) {
                    // Extract Sapu Jagat from Penutup if exists
                    const sapuJagat = item.items?.find(sub => sub.judul.toLowerCase().includes('sapu jagat'));
                    if (sapuJagat) {
                        inti.push({ ...sapuJagat, judul: 'Doa Sapu Jagat (1x)' });
                    }
                } else {
                    lanjutan.push(item);
                }
            });

            return { inti, lanjutan };
        }

        return { full: [...items, PAKET_DOA_PRIBADI] };
    };

    const grouped = getGroupedItems();

    return (
        <div className="animate-in fade-in space-y-5">
            {/* Mode Switcher */}
            <div className="flex bg-slate-100 p-1 rounded-2xl">
                <button 
                    onClick={() => setMode('leluasa')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        mode === 'leluasa' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                    <Home size={14} /> Mode Leluasa {(activeTab === 'subuh' || activeTab === 'isya') && '(Home)'}
                </button>
                <button 
                    onClick={() => setMode('pekerja')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        mode === 'pekerja' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                    <Briefcase size={14} /> Mode Pekerja {isPekerjaModeTab && '(Mushola Umum)'}
                </button>
            </div>

            {/* Custom Doa Input */}
            <form onSubmit={handleAddCustomDoa} className="flex gap-2">
                <input
                    type="text"
                    placeholder="Tulis doa khusus pribadi Anda..."
                    className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 shadow-sm"
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                />
                <button
                    type="submit"
                    disabled={!customInput.trim()}
                    className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl px-4 flex items-center justify-center transition-colors shadow-sm"
                >
                    <Check size={20} />
                </button>
            </form>

            {/* Waktu Selector Tabs */}
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1">
                {TABS.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full whitespace-nowrap text-xs font-bold border transition-all flex-shrink-0 ${
                            activeTab === tab.key
                                ? 'bg-emerald-600 text-white border-emerald-600 shadow-md scale-105'
                                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                    >
                        <span>{tab.emoji}</span> {tab.label}
                    </button>
                ))}
            </div>

            {/* Catatan Info */}
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl">
                <div className="flex gap-3 items-start mb-2">
                    <Info size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm font-bold text-blue-900 uppercase tracking-wider">
                        {mode === 'leluasa' ? `MODE 1: LELUASA DI RUMAH` : `MODE 2: PEKERJA / MUSHOLA UMUM`}
                    </p>
                </div>
                <p className="text-xs text-blue-800 leading-relaxed italic ml-7">
                    {mode === 'leluasa' 
                        ? "Lakukan semuanya sambil duduk tenang di atas sajadah." 
                        : "Tujuan mode ini: Memprioritaskan amalan inti, lalu segera memberikan sajadah kepada orang yang antre."
                    }
                </p>
            </div>

            {/* Dzikir Cards */}
            <div className="space-y-4" key={`${activeTab}-${mode}`}>
                {grouped.full ? (
                    grouped.full.map((item, idx) => (
                        <DzikirCard key={`${activeTab}-${idx}`} item={item} idx={idx} />
                    ))
                ) : (
                    <>
                        <div className="pt-2 pb-1">
                            <h3 className="text-sm font-black text-emerald-900 bg-emerald-100/50 px-3 py-1.5 rounded-lg inline-block">
                                A. DZIKIR INTI (Atas Sajadah)
                            </h3>
                        </div>
                        {grouped.inti.map((item, idx) => (
                            <DzikirCard key={`inti-${idx}`} item={item} idx={idx} />
                        ))}

                        <div className="pt-6 pb-1">
                            <h3 className="text-sm font-black text-amber-900 bg-amber-100/50 px-3 py-1.5 rounded-lg inline-block">
                                B. DZIKIR LANJUTAN (Sambil Berjalan / Meja Kerja)
                            </h3>
                        </div>
                        {grouped.lanjutan.map((item, idx) => (
                            <DzikirCard key={`lanjutan-${idx}`} item={item} idx={idx} offset={grouped.inti.length} />
                        ))}
                        
                        {/* Append Paket Doa Pribadi manually in Mode 2 Lanjutan */}
                        <DzikirCard item={PAKET_DOA_PRIBADI} idx={grouped.lanjutan.length} offset={grouped.inti.length} />
                    </>
                )}

                {/* Custom Doa section */}
                {customDoaList.length > 0 && (
                    <div className="mt-8 border-t-2 border-dashed border-sky-200 pt-6 space-y-4">
                        <h3 className="font-bold text-sky-800 flex items-center gap-2 px-1">
                            <BookOpen size={16} className="text-sky-500" /> Doa Khusus Pribadi Tambahan
                        </h3>
                        {customDoaList.map((doa, idx) => (
                            <AccordionCard key={doa.id} title={`Doa Tambahan ${idx + 1}`} icon={<Check size={14} className="text-sky-600" />} defaultOpen={true}>
                                <div className="p-4 bg-sky-50 border border-sky-100 rounded-2xl">
                                    <p className="text-slate-800 text-sm leading-relaxed whitespace-pre-line">{doa.text}</p>
                                </div>
                            </AccordionCard>
                        ))}
                    </div>
                )}

                <div ref={bottomRef} className="h-4"></div>
            </div>
        </div>
    );
}
