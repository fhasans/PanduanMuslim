import React from 'react';
import AccordionCard from '../../ui/AccordionCard.jsx';

export default function WitirView() {
    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="bg-indigo-50 p-5 rounded-2xl border border-indigo-200">
                <h3 className="font-bold text-indigo-800 mb-2">Panduan Sholat Witir</h3>
                <p className="text-sm text-indigo-900 leading-relaxed mb-4">
                    Witir adalah sholat penutup malam yang rakaatnya ganjil. Disunnahkan dikerjakan dengan <strong>2 rakaat salam, lalu ditambah 1 rakaat salam</strong>.
                </p>

                <AccordionCard title="Niat Sholat Witir" defaultOpen={true}>
                    <div className="space-y-4">
                        <div className="bg-white p-4 rounded-xl border border-indigo-100">
                            <span className="font-bold text-slate-700 block mb-2 text-sm">Niat 2 Rakaat Witir</span>
                            <div className="flex justify-between items-start gap-2">
                                <p className="font-semibold text-emerald-700 mb-1 text-sm">"Ushallii sunnatal witri rak'ataini..."</p>
                                                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-indigo-100">
                            <span className="font-bold text-slate-700 block mb-2 text-sm">Niat 1 Rakaat Witir (Penutup)</span>
                            <div className="flex justify-between items-start gap-2">
                                <p className="font-semibold text-emerald-700 mb-1 text-sm">"Ushallii sunnatal witri rak'atan..."</p>
                                                            </div>
                        </div>
                    </div>
                </AccordionCard>

                <div className="mt-4">
                    <AccordionCard title="Bacaan Sahih Setelah Witir (1 Rakaat Terakhir)">
                        <p className="text-sm text-slate-600 mb-3">Nabi ﷺ membaca dzikir ini 3 kali, dan pada bacaan ketiga, beliau memanjangkan dan mengeraskan suaranya:</p>

                        <div className="bg-slate-50 p-3 rounded-lg mb-2">
                            <div className="flex justify-between items-start gap-2">
                                <p className="font-bold text-lg text-slate-800 mb-1">
                                    "Subhaanal malikil qudduus." (Dibaca 3x)
                                </p>
                                                            </div>
                            <p className="text-sm text-slate-500 italic mb-3">Artinya: "Maha Suci Engkau yang Maha Merajai lagi Maha Suci dari kekurangan."</p>

                            <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between items-start gap-2">
                                <p className="font-bold text-lg text-slate-800 mb-1">
                                    "Rabbil malaa-ikati war-ruuh." (Dibaca 1x setelah yang ke-3)
                                </p>
                                                            </div>
                            <p className="text-sm text-slate-500 italic">Artinya: "Tuhan para malaikat dan Jibril."</p>
                        </div>
                    </AccordionCard>
                </div>
            </div>
        </div>
    );
}
