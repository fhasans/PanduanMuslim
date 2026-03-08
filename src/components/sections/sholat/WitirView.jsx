import React from 'react';
import AccordionCard from '../../ui/AccordionCard.jsx';
import TasbihCounter from '../../ui/TasbihCounter.jsx';

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

                <div className="mt-4 space-y-4">
                    <h3 className="font-bold text-slate-800 px-1">Bacaan Setiap Selesai 2 Rakaat</h3>
                    <AccordionCard title="Dzikir Jeda Witir">
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <p className="font-bold text-emerald-900 text-lg leading-relaxed mb-2 uppercase">
                                "Subbuuhun qudduusun rabbul malaa-ikati warruuh."
                            </p>
                            <TasbihCounter target={null} label="Dibaca sebanyak-banyaknya" />
                        </div>
                    </AccordionCard>
                </div>

                <div className="mt-6">
                    <h3 className="font-bold text-slate-800 px-1 mb-4">Bacaan Setelah Witir Selesai (1 Rakaat Terakhir)</h3>
                    <AccordionCard title="Dzikir Utama Setelah Witir" defaultOpen={true}>
                        <p className="text-sm text-slate-600 mb-3">Nabi ﷺ membaca dzikir ini 3 kali, dan pada bacaan ketiga, beliau memanjangkan dan mengeraskan suaranya:</p>

                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-4">
                            <div className="mb-2">
                                <p className="font-bold text-lg text-emerald-900 uppercase">
                                    "Subhaanal malikil qudduus."
                                </p>
                                <p className="text-sm text-slate-500 italic">"Maha Suci Engkau yang Maha Merajai lagi Maha Suci dari kekurangan."</p>
                            </div>
                            <TasbihCounter target={3} label="Dibaca 3x (Yg ketiga dikeraskan)" />
                        </div>

                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <div className="mb-2">
                                <p className="font-bold text-lg text-emerald-900 uppercase">
                                    "Rabbil malaa-ikati war-ruuh."
                                </p>
                                <p className="text-sm text-slate-500 italic">"Tuhan para malaikat dan Jibril."</p>
                            </div>
                            <TasbihCounter target={1} label="Dibaca 1x" />
                        </div>
                    </AccordionCard>

                    <AccordionCard title="Doa Setelah Witir (Tambahan)">
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <p className="font-bold text-emerald-900 text-lg leading-relaxed mb-2 uppercase">
                                "Allaahumma innii a'uudzu bi ridhaaka min sakhathika, wa bi mu'aafaatika min 'uquubatika, wa a'uudzu bika minka laa uhshii tsanaa-an 'alaika anta kamaa atsnaita 'alaa nafsika."
                            </p>
                            <p className="text-sm text-slate-500 italic">
                                Ya Allah, aku berlindung dengan ridha-Mu dari kemurkaan-Mu, dengan keselamatan-Mu dari siksaan-Mu. Aku berlindung kepada-Mu dari-Mu. Aku tidak mampu menghitung pujian bagi-Mu, sebagaimana Engkau memuji diri-Mu sendiri.
                            </p>
                        </div>
                    </AccordionCard>
                </div>
            </div>
        </div>
    );
}
