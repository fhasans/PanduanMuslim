import React, { useState, useRef } from 'react';
import { Check, Moon, BookOpen, Info } from 'lucide-react';
import AccordionCard from '../../ui/AccordionCard.jsx';
import TasbihCounter from '../../ui/TasbihCounter.jsx';
import { dzikirPerWaktu } from '../../../data/dzikirData.js';

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
function DzikirCard({ item, idx }) {
    if (item.isSequence) {
        return (
            <AccordionCard title={item.judul} icon={idx + 1} defaultOpen={idx === 0}>
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
        <AccordionCard title={item.judul} icon={idx + 1} defaultOpen={idx === 0}>
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
    const [customDoaList, setCustomDoaList] = useState([]);
    const [customInput, setCustomInput] = useState('');
    const bottomRef = useRef(null);

    const waktu = dzikirPerWaktu[activeTab];

    const handleAddCustomDoa = (e) => {
        e.preventDefault();
        if (!customInput.trim()) return;
        setCustomDoaList([...customDoaList, { id: Date.now(), text: customInput.trim() }]);
        setCustomInput('');
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    };

    return (
        <div className="animate-in fade-in space-y-5">
            {/* Custom Doa Input */}
            <form onSubmit={handleAddCustomDoa} className="flex gap-2">
                <input
                    type="text"
                    placeholder="Tulis doa khusus Anda di sini..."
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
            {waktu.catatan && (
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex gap-3 items-start">
                    <Info size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-blue-800 leading-relaxed">{waktu.catatan}</p>
                </div>
            )}

            {/* Dzikir Cards */}
            <div className="space-y-4" key={activeTab}>
                {waktu.items.map((item, idx) => (
                    <DzikirCard key={`${activeTab}-${idx}`} item={item} idx={idx} />
                ))}

                {/* Custom Doa section */}
                {customDoaList.length > 0 && (
                    <div className="mt-6 border-t-2 border-dashed border-sky-200 pt-6 space-y-4">
                        <h3 className="font-bold text-sky-800 flex items-center gap-2">
                            <BookOpen size={16} className="text-sky-500" /> Doa Khusus (Pribadi)
                        </h3>
                        {customDoaList.map((doa, idx) => (
                            <AccordionCard key={doa.id} title={`Doa Khusus ${idx + 1}`} icon={<Check size={14} className="text-sky-600" />} defaultOpen={true}>
                                <div className="p-3 bg-sky-50 border border-sky-100 rounded-xl">
                                    <p className="text-slate-800 text-sm leading-relaxed whitespace-pre-line">{doa.text}</p>
                                </div>
                            </AccordionCard>
                        ))}
                    </div>
                )}

                <div ref={bottomRef} className="h-1"></div>
            </div>
        </div>
    );
}
