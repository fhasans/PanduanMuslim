import React, { useState } from 'react';
import AccordionCard from '../../ui/AccordionCard.jsx';
import { bacaanSholatLengkap, dataSholatWajib } from '../../../data/sholatData.jsx';

export default function SholatWajibView({ onGoToDzikir }) {
    const [selectedWaktu, setSelectedWaktu] = useState(dataSholatWajib[0]);

    return (
        <div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-4 -mx-2 px-2 md:mx-0 md:px-0">
                {dataSholatWajib.map((waktu) => (
                    <button
                        key={waktu.id}
                        onClick={() => setSelectedWaktu(waktu)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-full whitespace-nowrap text-sm font-bold border transition-all ${selectedWaktu.id === waktu.id ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                            }`}
                    >
                        {waktu.nama}
                    </button>
                ))}
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-slate-100 p-3 rounded-xl">{selectedWaktu.icon}</div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-800">Sholat {selectedWaktu.nama} ({selectedWaktu.rakaat} Rakaat)</h3>
                            <p className="text-slate-500 text-sm">{selectedWaktu.waktu}</p>
                        </div>
                    </div>
                    <button 
                        onClick={onGoToDzikir}
                        className="text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-3 py-2 rounded-lg transition-colors border border-emerald-100 mt-1"
                    >
                        Bacaan Setelah Sholat {selectedWaktu.nama} →
                    </button>
                </div>

                <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100 mb-6">
                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-3 block">Niat (Lafadz)</span>
                    <div className="bg-white/60 p-3 rounded-lg border-l-4 border-emerald-500 mb-2 flex justify-between items-start gap-2">
                        <p className="font-semibold text-emerald-900 text-lg leading-relaxed">
                            "{selectedWaktu.niat}"
                        </p>
                                            </div>
                    <p className="text-slate-600 text-sm italic">Artinya: "{selectedWaktu.artiNiat}"</p>
                </div>

                <div className="bg-blue-50 p-4 rounded-xl text-sm text-blue-800 border border-blue-200 mb-6">
                    <span className="font-bold">Catatan Penting:</span> Semua bacaan di bawah ini adalah tuntunan sahih. Tuma'ninah (tenang sejenak di setiap gerakan) adalah rukun sholat.
                </div>

                <div className="space-y-4">
                    {bacaanSholatLengkap.map((item, idx) => (
                        <AccordionCard
                            key={idx}
                            title={item.gerakan}
                            icon={idx + 1}
                            defaultOpen={idx === 0}
                            extraBadge={
                                item.instruksi ? (
                                    <span className="text-[10px] md:text-xs font-semibold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full ml-2">
                                        {item.instruksi}
                                    </span>
                                ) : null
                            }
                        >
                            <div className="bg-slate-50 p-3 rounded-lg mb-2 flex justify-between items-start gap-2">
                                <p className="font-semibold text-emerald-900 text-lg leading-relaxed">
                                    "{item.latin}"
                                </p>
                                                            </div>
                            <p className="text-sm text-slate-600 italic">Artinya: "{item.arti}"</p>
                        </AccordionCard>
                    ))}
                </div>

                <div className="mt-8 flex justify-center">
                    <button 
                        onClick={onGoToDzikir}
                        className="flex items-center gap-2 group text-emerald-600 font-bold hover:text-emerald-700 transition-colors bg-emerald-50 hover:bg-emerald-100 px-6 py-4 rounded-2xl border-2 border-dashed border-emerald-200"
                    >
                        <span>Bacaan Setelah Sholat {selectedWaktu.nama}</span>
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
