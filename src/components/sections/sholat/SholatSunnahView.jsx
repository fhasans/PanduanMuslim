import React from 'react';
import { CheckCircle2, BookOpen, Quote } from 'lucide-react';
import AccordionCard from '../../ui/AccordionCard.jsx';
import TasbihCounter from '../../ui/TasbihCounter.jsx';
import { dataSholatSunnah } from '../../../data/sholatData.jsx';

export default function SholatSunnahView() {
    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <p className="text-sm text-blue-800 font-medium">
                    Sholat Rawatib terbagi menjadi Mu'akkad (sangat dianjurkan) dan Ghairu Mu'akkad. Terdapat juga sholat sunnah waktu seperti Dhuha dan sholat sunnah mutlak seperti sholat Taubat.
                </p>
            </div>

            {dataSholatSunnah.map((grup, idx) => (
                <div key={idx} className="space-y-4">
                    <h3 className="text-lg font-bold text-slate-800 border-b pb-2">{grup.kategori}</h3>
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
                                    subtitle={item.keutamaan ? `Keutamaan: ${item.keutamaan}` : 'Niat sholat sunnah'}
                                    defaultOpen={false}
                                >
                                    <div className="bg-slate-50 p-3 rounded-lg mb-2 flex justify-between items-start gap-2">
                                        <p className="font-semibold text-slate-800 leading-relaxed">"{item.niat}"</p>
                                    </div>
                                    <p className="text-sm text-slate-500 italic mb-2 text-center">Artinya: "{item.arti}"</p>

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
                                            </div>
                                        </div>
                                    )}
                                </AccordionCard>
                            )
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
