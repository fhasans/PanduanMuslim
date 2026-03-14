import React, { useState } from 'react';
import { CheckCircle2, BookOpen, Quote, ListChecks, Moon } from 'lucide-react';
import AccordionCard from '../../ui/AccordionCard.jsx';
import TasbihCounter from '../../ui/TasbihCounter.jsx';
import NiatBox from '../../ui/NiatBox.jsx';
import { dataSholatSunnah, bacaanSholatLengkap } from '../../../data/sholatData.jsx';

// Full reading cards for 2-rakaat sunnah (excludes Tasyahud Awal for 2 rakaat prayers)
function BacaanLengkapSunnah({ bacaanMode }) {
    const filtered = bacaanSholatLengkap.filter(b => !["Tasyahud Awal (Duduk Rakaat Kedua)"].includes(b.gerakan));
    return (
        <div className="space-y-3 mt-3">
            {filtered.map((b, bIdx) => {
                const activeData = b.options ? b.options[bacaanMode] : { latin: b.latin, arti: b.arti };
                const hasVariant = !!b.options;
                return (
                    <div key={bIdx} className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm transition-all hover:border-emerald-200">
                        <div className="bg-slate-50/50 px-4 py-2 border-b border-slate-50 flex justify-between items-center">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gerakan {bIdx + 1}</span>
                            <div className="flex gap-1">
                                {hasVariant && (
                                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${bacaanMode === 'syafii' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                        {bacaanMode === 'syafii' ? "Syafi'i" : 'Nabi ﷺ'}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="p-4">
                            <h6 className="font-bold text-slate-800 text-sm mb-1">{b.gerakan}</h6>
                            <p className="text-[10px] text-slate-400 mb-2">{b.instruksi}</p>
                            <div className="bg-emerald-50/30 p-3 rounded-xl border border-emerald-50/50 mb-2">
                                <p className="font-bold text-emerald-900 text-base leading-relaxed">"{activeData.latin}"</p>
                            </div>
                            <p className="text-[11px] text-slate-500 italic">Artinya: "{activeData.arti}"</p>
                            {activeData.catatan && (
                                <div className="mt-2 text-[10px] p-2 rounded-lg bg-amber-50 text-amber-900 border border-amber-100 leading-relaxed">
                                    <span className="font-bold">📖 </span>{activeData.catatan}
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function TahajjudSteps({ item, bacaanMode }) {
    return (
        <div className="space-y-4">
            {/* Waktu & Cara Pelaksanaan */}
            <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl">
                <h6 className="font-bold text-indigo-800 text-sm mb-2 flex items-center gap-2">
                    <Moon size={14} /> Waktu & Cara Pelaksanaan
                </h6>
                <p className="text-xs text-indigo-900 leading-relaxed mb-2">{item.waktu}</p>
                <p className="text-xs text-indigo-700 leading-relaxed italic">{item.caraTidurDulu}</p>
            </div>

            {/* Jumlah Rakaat */}
            <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl">
                <h6 className="font-bold text-emerald-800 text-sm mb-2">Jumlah Rakaat</h6>
                {item.rakaat.map((r, i) => (
                    <p key={i} className="text-xs text-emerald-900 leading-relaxed">{r.keterangan}</p>
                ))}
            </div>

            {/* Bacaan Per Gerakan */}
            <div>
                <h6 className="font-bold text-slate-800 text-sm mb-1 flex items-center gap-2">
                    <ListChecks size={14} className="text-emerald-500" /> Bacaan Per Gerakan (2 Rakaat)
                </h6>
                <p className="text-[11px] text-slate-400 mb-2">Sama dengan sholat sunnah biasa. Ikuti urutan bacaan berikut:</p>
                <BacaanLengkapSunnah bacaanMode={bacaanMode} />
            </div>
        </div>
    );
}

function TaubatSteps({ item, bacaanMode }) {
    return (
        <div className="space-y-4">
            <div className="bg-emerald-50 border-emerald-100 border p-4 rounded-2xl">
                <p className="text-xs text-emerald-800 font-medium leading-relaxed">
                    Sholat Taubat dikerjakan sebanyak <strong>2 rakaat</strong> (sendiri) dengan tata cara yang sama seperti sholat sunnah biasa, namun dengan niat bertaubat. Berikut rincian bacaan per gerakan:
                </p>
            </div>
            <BacaanLengkapSunnah bacaanMode={bacaanMode} />
            <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl mt-4">
                <h6 className="font-bold text-amber-800 text-sm mb-2 flex items-center gap-2">
                    <Quote size={14} /> Langkah Setelah Salam:
                </h6>
                <ul className="text-xs text-amber-900 space-y-2 list-decimal list-inside font-medium leading-relaxed">
                    <li>Duduk tenang dan mulai membaca Istighfar (list di bawah).</li>
                    <li>Resapi setiap kata, akui kesalahan di hadapan Allah.</li>
                    <li>Baca doa Sayyidul Istighfar dengan penuh harap.</li>
                    <li>Berjanji (azam) dalam hati untuk tidak mengulangi perbuatan tersebut.</li>
                </ul>
            </div>
        </div>
    );
}

export default function SholatSunnahView() {
    const [bacaanMode, setBacaanMode] = useState('syafii');

    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <p className="text-sm text-blue-800 font-medium leading-relaxed">
                    Sholat Rawatib terbagi menjadi Mu'akkad (sangat dianjurkan) dan Ghairu Mu'akkad. Terdapat juga sholat sunnah waktu seperti Dhuha, sholat Malam (Tahajjud), dan sholat sunnah mutlak seperti Taubat.
                </p>
            </div>

            {/* Toggle Mazhab Bacaan */}
            <div className="bg-white border border-slate-200 rounded-2xl p-1 flex gap-1 shadow-sm sticky top-2 z-10 backdrop-blur">
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

            {dataSholatSunnah.map((grup, idx) => (
                <div key={idx} className="space-y-4">
                    <h3 className="text-lg font-bold text-slate-800 border-b pb-2 flex items-center gap-2">
                        {grup.kategori === 'Sholat Malam' && <Moon size={18} className="text-indigo-500" />}
                        {grup.kategori}
                    </h3>
                    <div className="grid gap-4">
                        {grup.daftar.map((item, itemIdx) => (
                            item.larangan ? (
                                <div key={itemIdx} className="bg-red-50 border border-red-200 rounded-2xl p-5 shadow-sm">
                                    <h4 className="font-bold text-red-700 mb-2 flex items-center gap-2">
                                        <CheckCircle2 size={18} className="text-red-500" /> {item.nama}
                                    </h4>
                                    <p className="text-sm text-red-800 leading-relaxed font-medium">{item.arti}</p>
                                </div>
                            ) : (
                                <AccordionCard
                                    key={itemIdx}
                                    title={item.nama}
                                    subtitle={item.keutamaan ? `Keutamaan: ${item.keutamaan}` : 'Panduan Niat & Tata Cara'}
                                    defaultOpen={false}
                                >
                                    <div className="space-y-4">
                                        <div className="bg-emerald-50/50 p-1 rounded-xl">
                                            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-tighter px-3 mb-1 block">Pilih Peran:</span>
                                            <NiatBox 
                                                sendiri={item.niatSendiri}
                                                imam={item.niatImam}
                                                makmum={item.niatMakmum}
                                                artiSendiri={item.arti}
                                                artiImam={item.arti}
                                                artiMakmum={item.arti}
                                            />
                                        </div>

                                        {item.steps && (
                                            <div className="mt-4">
                                                <h5 className="font-bold text-slate-800 mb-3 flex items-center gap-2 text-sm">
                                                    <ListChecks size={16} className="text-emerald-500" /> 
                                                    Panduan Tata Cara{' '}
                                                    {item.steps === 'tahajjud' ? 'Sholat Tahajjud' 
                                                     : item.steps === 'taubat' ? 'Sholat Taubat' 
                                                     : 'Sholat Sunnah 2 Rakaat'}
                                                </h5>
                                                
                                                {item.steps === 'tahajjud' ? (
                                                    <TahajjudSteps item={item} bacaanMode={bacaanMode} />
                                                ) : item.steps === 'taubat' ? (
                                                    <TaubatSteps item={item} bacaanMode={bacaanMode} />
                                                ) : (
                                                    <BacaanLengkapSunnah bacaanMode={bacaanMode} />
                                                )}
                                            </div>
                                        )}

                                        {item.dzikirKhusus && item.dzikirKhusus.map((dz, dzIdx) => (
                                            <div key={dzIdx} className="mt-4 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                                                <h5 className="font-bold text-emerald-800 mb-3 flex items-center gap-2 text-sm uppercase tracking-wider">
                                                    <Quote size={14} /> Bacaan Khusus (Dianjurkan)
                                                </h5>
                                                <p className="font-bold text-emerald-900 text-lg leading-relaxed mb-3">"{dz.latin}"</p>
                                                <TasbihCounter target={dz.target} label={dz.label} />
                                            </div>
                                        ))}

                                        {item.doaSetelah && (
                                            <div className="mt-4 pt-4 border-t border-slate-200">
                                                <h5 className="font-bold text-emerald-800 mb-2 flex items-center gap-2">
                                                    <BookOpen size={16} /> Doa Setelah Sholat
                                                </h5>
                                                <div className="bg-white p-4 rounded-xl border border-slate-200 mb-2">
                                                    <p className="font-bold text-emerald-900 text-lg leading-relaxed mb-2">"{item.doaSetelah.latin}"</p>
                                                    <p className="text-sm text-slate-600 italic">Artinya: "{item.doaSetelah.arti}"</p>
                                                    {item.doaSetelah.sumber && (
                                                        <p className="text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-100">{item.doaSetelah.sumber}</p>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </AccordionCard>
                            )
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
