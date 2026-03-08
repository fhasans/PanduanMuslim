import React from 'react';
import AccordionCard from '../../ui/AccordionCard.jsx';
import TasbihCounter from '../../ui/TasbihCounter.jsx';
import NiatBox from '../../ui/NiatBox.jsx';
import { ListChecks } from 'lucide-react';

export default function WitirView() {
    const witirSteps = [
        "Takbiratul Ihram & Niat",
        "Membaca Al-Fatihah (Wajib)",
        "Membaca Surat Pendek (Sunnah)",
        "Ruku' dengan Tuma'ninah",
        "I'tidal dengan Tuma'ninah",
        "Sujud dengan Tuma'ninah",
        "Duduk di Antara Dua Sujud",
        "Sujud Kedua",
        "Bangun untuk Rakaat Kedua (Ulangi Langkah 2-8)",
        "Tasyahud Akhir & Salam",
        "Dilanjutkan Rakaat Terakhir (Witir 1 Rakaat)"
    ];

    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="bg-indigo-50 p-5 rounded-3xl border border-indigo-200">
                <h3 className="font-bold text-indigo-800 mb-2">Panduan Sholat Witir</h3>
                <p className="text-sm text-indigo-900 leading-relaxed mb-4">
                    Witir adalah sholat penutup malam yang rakaatnya ganjil. Disunnahkan dikerjakan dengan <strong>2 rakaat salam, lalu ditambah 1 rakaat salam</strong>.
                </p>

                <div className="space-y-4">
                    <AccordionCard title="1. Niat Witir (2 Rakaat Pertama)" defaultOpen={true}>
                        <div className="bg-emerald-50/30 p-1 rounded-2xl">
                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-tighter px-3 mb-1 block">Pilih Peran:</span>
                        <NiatBox 
                            sendiri="Ushallii sunnatal witri rak'ataini lillaahi ta'aalaa."
                            imam="Ushallii sunnatal witri rak'ataini imaaman lillaahi ta'aalaa."
                            makmum="Ushallii sunnatal witri rak'ataini makmuuman lillaahi ta'aalaa."
                            artiSendiri="Aku berniat sholat sunnah Witir dua rakaat karena Allah Ta'ala."
                            artiImam="Aku berniat sholat sunnah Witir dua rakaat sebagai Imam karena Allah Ta'ala."
                            artiMakmum="Aku berniat sholat sunnah Witir dua rakaat sebagai Makmum karena Allah Ta'ala."
                        />
                        </div>
                    </AccordionCard>

                    <AccordionCard title="2. Niat Witir (1 Rakaat Terakhir)">
                        <div className="bg-emerald-50/30 p-1 rounded-2xl">
                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-tighter px-3 mb-1 block">Pilih Peran:</span>
                        <NiatBox 
                            sendiri="Ushallii sunnatal witri rak'atan lillaahi ta'aalaa."
                            imam="Ushallii sunnatal witri rak'atan imaaman lillaahi ta'aalaa."
                            makmum="Ushallii sunnatal witri rak'atan makmuuman lillaahi ta'aalaa."
                            artiSendiri="Aku berniat sholat sunnah Witir satu rakaat karena Allah Ta'ala."
                            artiImam="Aku berniat sholat sunnah Witir satu rakaat sebagai Imam karena Allah Ta'ala."
                            artiMakmum="Aku berniat sholat sunnah Witir satu rakaat sebagai Makmum karena Allah Ta'ala."
                        />
                        </div>
                    </AccordionCard>
                    
                    <AccordionCard title="Tata Cara Lengkap (3 Rakaat)">
                        <div className="bg-white border border-indigo-100 rounded-2xl overflow-hidden divide-y divide-slate-50">
                            <div className="p-4 bg-slate-50">
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    Lakukan sholat 2 rakaat terlebih dahulu seperti sholat sunnah biasa, akhiri dengan salam. Kemudian berdiri lagi untuk mengerjakan 1 rakaat penutup.
                                </p>
                            </div>
                            {witirSteps.map((step, i) => (
                                <div key={i} className="px-4 py-3 flex items-center gap-3 hover:bg-indigo-50/50 transition-colors">
                                    <span className="w-6 h-6 flex items-center justify-center bg-indigo-100 text-indigo-700 rounded-full text-[10px] font-bold shrink-0">
                                        {i + 1}
                                    </span>
                                    <span className="text-xs font-semibold text-slate-700">{step}</span>
                                </div>
                            ))}
                        </div>
                    </AccordionCard>
                </div>

                <div className="mt-6 space-y-4">
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

                <div className="mt-8">
                    <h3 className="font-bold text-slate-800 px-1 mb-4">Bacaan Setelah Witir Selesai (1 Rakaat Terakhir)</h3>
                    <AccordionCard title="Dzikir Utama Setelah Witir" defaultOpen={true}>
                        <p className="text-sm text-slate-600 mb-3 leading-relaxed">Nabi ﷺ membaca dzikir ini 3 kali, dan pada bacaan ketiga, beliau memanjangkan dan mengeraskan suaranya:</p>

                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-4">
                            <div className="mb-2 text-center">
                                <p className="font-bold text-lg text-emerald-900 uppercase leading-relaxed">
                                    "Subhaanal malikil qudduus."
                                </p>
                                <p className="text-sm text-slate-500 italic mt-1">"Maha Suci Engkau yang Maha Merajai lagi Maha Suci dari kekurangan."</p>
                            </div>
                            <TasbihCounter target={3} label="Dibaca 3x (Yg ketiga dikeraskan)" />
                        </div>

                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <div className="mb-2 text-center">
                                <p className="font-bold text-lg text-emerald-900 uppercase leading-relaxed">
                                    "Rabbil malaa-ikati war-ruuh."
                                </p>
                                <p className="text-sm text-slate-500 italic mt-1">"Tuhan para malaikat dan Jibril."</p>
                            </div>
                            <TasbihCounter target={1} label="Dibaca 1x" />
                        </div>
                    </AccordionCard>

                    <div className="mt-4">
                        <AccordionCard title="Doa Setelah Witir (Tambahan)">
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <p className="font-bold text-emerald-900 text-lg leading-relaxed mb-2 text-center">
                                    "Allaahumma innii a'uudzu bi ridhaaka min sakhathika, wa bi mu'aafaatika min 'uquubatika, wa a'uudzu bika minka laa uhshii tsanaa-an 'alaika anta kamaa atsnaitaa 'alaa nafsika."
                                </p>
                                <p className="text-sm text-slate-500 italic text-center leading-relaxed">
                                    Artinya: "Ya Allah, aku berlindung dengan ridha-Mu dari kemurkaan-Mu, dengan keselamatan-Mu dari siksaan-Mu. Aku berlindung kepada-Mu dari-Mu. Aku tidak mampu menghitung pujian bagi-Mu, sebagaimana Engkau memuji diri-Mu sendiri."
                                </p>
                            </div>
                        </AccordionCard>
                    </div>
                </div>
            </div>
        </div>
    );
}
