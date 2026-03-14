import React, { useState } from 'react';
import AccordionCard from '../../ui/AccordionCard.jsx';
import NiatBox from '../../ui/NiatBox.jsx';
import { bacaanSholatLengkap, dataSholatWajib } from '../../../data/sholatData.jsx';

export default function SholatWajibView({ onGoToDzikir }) {
    const [selectedWaktu, setSelectedWaktu] = useState(dataSholatWajib[0]);
    const [bacaanMode, setBacaanMode] = useState('syafii'); // 'syafii' | 'nabi'

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
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-tighter mb-2 block">Pilih Peran Sholat:</span>
                    <NiatBox 
                        sendiri={selectedWaktu.niatSendiri}
                        imam={selectedWaktu.niatImam}
                        makmum={selectedWaktu.niatMakmum}
                        artiSendiri={selectedWaktu.artiNiat}
                        artiImam={selectedWaktu.artiNiat}
                        artiMakmum={selectedWaktu.artiNiat}
                    />
                </div>

                {/* Toggle Mazhab Bacaan */}
                <div className="mb-6 bg-white border border-slate-200 rounded-2xl p-1 flex gap-1 shadow-sm">
                    <button
                        onClick={() => setBacaanMode('syafii')}
                        className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${bacaanMode === 'syafii' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                        📚 Imam Syafi'i (Default)
                    </button>
                    <button
                        onClick={() => setBacaanMode('nabi')}
                        className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${bacaanMode === 'nabi' ? 'bg-amber-500 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                        ☪️ Yang Dilakukan Nabi ﷺ
                    </button>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-xl text-sm text-blue-800 border border-blue-200 mb-6">
                    <span className="font-bold">Catatan Penting 1:</span> Untukmu yang sedang belajar, tidak apa-apa membaca panduan sambil memegang handphone, sholatmu tetap sah. Tenang saja, Allah tidak menuntut kesempurnaan pada hamba-Nya. Dia menghargai setiap usahamu yang terbata-bata. Teruslah melangkah, sesungguhnya Allah cinta pada hamba-Nya yang kembali merayu-Nya. Dan ampunan Allah jauh lebih luas dan besar daripada dosa dosa hamba-Nya, Maka mintalah maka kamu akan diampuni. Jadi jika kamu berniat untuk kembali, kembali lah dengan sungguh sungguh.
                </div>
                <div className="bg-blue-50 p-4 rounded-xl text-sm text-blue-800 border border-blue-200 mb-6">
                    <span className="font-bold">Catatan Penting 2:</span> Semua bacaan di bawah ini adalah tuntunan sahih. Tuma'ninah (tenang sejenak di setiap gerakan) adalah rukun sholat.
                </div>

                <div className="space-y-4">
                    {bacaanSholatLengkap.map((item, idx) => {
                        // Determine the active text based on mode and whether options exist
                        const activeData = item.options ? item.options[bacaanMode] : { latin: item.latin, arti: item.arti };
                        const hasVariant = !!item.options;

                        return (
                            <AccordionCard
                                key={idx}
                                title={item.gerakan}
                                icon={idx + 1}
                                defaultOpen={idx === 0}
                                extraBadge={
                                    <div className="flex items-center gap-1.5 ml-2 flex-wrap">
                                        {item.instruksi && (
                                            <span className="text-[10px] md:text-xs font-semibold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                                                {item.instruksi}
                                            </span>
                                        )}
                                        {hasVariant && (
                                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${bacaanMode === 'syafii' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                                {bacaanMode === 'syafii' ? "Syafi'i" : 'Nabi ﷺ'}
                                            </span>
                                        )}
                                    </div>
                                }
                            >
                                <div className="bg-slate-50 p-3 rounded-lg mb-2 flex justify-between items-start gap-2">
                                    <p className="font-semibold text-emerald-900 text-lg leading-relaxed">
                                        "{activeData.latin}"
                                    </p>
                                </div>
                                <p className="text-sm text-slate-600 italic mb-3">Artinya: "{activeData.arti}"</p>
                                {activeData.catatan && (
                                    <div className={`text-xs p-3 rounded-xl leading-relaxed border ${bacaanMode === 'nabi' ? 'bg-amber-50 text-amber-900 border-amber-100' : 'bg-emerald-50 text-emerald-900 border-emerald-100'}`}>
                                        <span className="font-bold">📖 Sumber: </span>{activeData.catatan}
                                    </div>
                                )}
                            </AccordionCard>
                        );
                    })}
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
