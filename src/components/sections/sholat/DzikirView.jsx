import React, { useState, useRef } from 'react';
import { Star, Check, Plus } from 'lucide-react';
import AccordionCard from '../../ui/AccordionCard.jsx';
import { dzikirUmum, dzikirKhusus } from '../../../data/dzikirData.js';

export default function DzikirView() {
    const [tipe, setTipe] = useState('umum');
    const [customDoaList, setCustomDoaList] = useState([]);
    const [customInput, setCustomInput] = useState('');
    const bottomRef = useRef(null);

    const handleAddCustomDoa = (e) => {
        e.preventDefault();
        if (!customInput.trim()) return;
        
        const newDoa = {
            id: Date.now(),
            text: customInput.trim()
        };
        
        setCustomDoaList([...customDoaList, newDoa]);
        setCustomInput('');
        
        // Scroll to the bottom after state updates
        setTimeout(() => {
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    return (
        <div className="animate-in fade-in space-y-4">
            {/* Custom Doa Input Form */}
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

            <div className="flex bg-slate-100 p-1 rounded-lg w-full max-w-sm">
                <button onClick={() => setTipe('umum')} className={`flex-1 text-sm py-2 font-bold rounded-md transition-colors ${tipe === 'umum' ? 'bg-white text-emerald-700 shadow' : 'text-slate-500'}`}>Dzuhur, Ashar, Isya</button>
                <button onClick={() => setTipe('subuhmaghrib')} className={`flex-1 text-sm py-2 font-bold rounded-md transition-colors ${tipe === 'subuhmaghrib' ? 'bg-white text-emerald-700 shadow' : 'text-slate-500'}`}>Subuh & Maghrib</button>
            </div>

            <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                <p className="text-sm text-emerald-800 font-medium">
                    Dzikir dibaca perlahan setelah salam. Ketuk untuk membuka teks dzikir.
                </p>
            </div>

            <div className="space-y-4">
                {dzikirUmum.map((dzikir, idx) => (
                    <AccordionCard key={idx} title={dzikir.judul} icon={idx + 1} defaultOpen={idx === 0}>
                        <div className="mb-3 p-3 rounded-lg flex justify-between items-start gap-2 bg-emerald-50">
                            <p className="font-medium text-lg leading-relaxed text-emerald-900">{dzikir.latin}</p>
                                                    </div>
                        <p className="text-sm text-slate-600 italic border-l-2 border-slate-300 pl-3">Artinya: "{dzikir.arti}"</p>
                    </AccordionCard>
                ))}

                {tipe === 'subuhmaghrib' && (
                    <div className="mt-6 border-t-2 border-dashed border-emerald-200 pt-6 space-y-4">
                        <h3 className="font-bold text-emerald-800 flex items-center gap-2">
                            <Star className="text-amber-500" size={20} /> Tambahan Subuh & Maghrib
                        </h3>
                        {dzikirKhusus.map((dzikir, idx) => (
                            <AccordionCard key={'khusus' + idx} title={dzikir.judul} icon="+" defaultOpen={true}>
                                <div className="mb-3 p-3 rounded-lg flex justify-between items-start gap-2 bg-amber-50 border border-amber-100">
                                    <p className="font-medium text-lg leading-relaxed text-amber-900">{dzikir.latin}</p>
                                                                    </div>
                                <p className="text-sm text-slate-600 italic border-l-2 border-amber-300 pl-3">Artinya: "{dzikir.arti}"</p>
                            </AccordionCard>
                        ))}
                    </div>
                )}
                
                {customDoaList.length > 0 && (
                    <div className="mt-6 border-t-2 border-dashed border-sky-200 pt-6 space-y-4">
                        <h3 className="font-bold text-sky-800 flex items-center gap-2">
                            <Star className="text-sky-500" size={20} /> Doa Khusus (Pribadi)
                        </h3>
                        {customDoaList.map((doa, idx) => (
                            <AccordionCard key={doa.id} title={`Doa Khusus ${idx + 1}`} icon={<Check size={14} className="text-sky-600" />} defaultOpen={true}>
                                <div className="p-3 bg-sky-50 border border-sky-100 rounded-lg">
                                    <p className="text-slate-800 text-sm leading-relaxed whitespace-pre-line">{doa.text}</p>
                                </div>
                            </AccordionCard>
                        ))}
                    </div>
                )}
                
                {/* Scroll anchor */}
                <div ref={bottomRef} className="h-1"></div>
            </div>
        </div>
    );
}
