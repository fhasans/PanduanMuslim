import React from 'react';
import { CheckCircle2, BookOpen, Quote, ListChecks } from 'lucide-react';
import AccordionCard from '../../ui/AccordionCard.jsx';
import TasbihCounter from '../../ui/TasbihCounter.jsx';
import NiatBox from '../../ui/NiatBox.jsx';
import { dataSholatSunnah, bacaanSholatLengkap } from '../../../data/sholatData.jsx';

export default function SholatSunnahView() {
    // Helper to filter essential steps for 2 rakaat sunnah
    const commonSunnahSteps = [
        "Takbiratul Ihram", 
        "Doa Iftitah (Shafi'i)", 
        "Membaca Al-Fatihah (Wajib)", 
        "Membaca Surat Pendek / Potongan Ayat Al-Qur'an (Sunnah)", 
        "Ruku'", 
        "I'dtidal (Bangkit dari Ruku')", 
        "Sujud", 
        "Duduk di Antara Dua Sujud (Sunnah)", 
        "Sujud Kedua", 
        "Bangun ke Rakaat Kedua (Ulangi Langkah 3-8)", 
        "Tasyahud Akhir (Duduk Terakhir)", 
        "Doa Sebelum Salam", 
        "Salam"
    ];

    const getTaubatSteps = () => [
        { title: "Niat Sholat Taubat", desc: "Berniat di dalam hati untuk bertaubat kepada Allah." },
        { title: "Gerakan Sholat 2 Rakaat", desc: "Lakukan sholat 2 rakaat seperti sholat sunnah biasa (niat, takbir, al-fatihah, ruku, sujud, dll) hingga salam." },
        { title: "Membaca Istighfar", desc: "Setelah salam, perbanyak membaca istighfar (minimal 100x)." },
        { title: "Membaca Sayyidul Istighfar", desc: "Membaca doa taubat utama (Sayyidul Istighfar)." },
        { title: "Berazam (Berjanji)", desc: "Menanamkan tekad di dalam hati untuk tidak mengulangi maksiat tersebut." }
    ];

    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <p className="text-sm text-blue-800 font-medium leading-relaxed">
                    Sholat Rawatib terbagi menjadi Mu'akkad (sangat dianjurkan) dan Ghairu Mu'akkad. Terdapat juga sholat sunnah waktu seperti Dhuha dan sholat sunnah mutlak seperti sholat Taubat.
                </p>
            </div>

            {dataSholatSunnah.map((grup, idx) => (
                <div key={idx} className="space-y-4">
                    <h3 className="text-lg font-bold text-slate-800 border-b pb-2 flex items-center gap-2">
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
                                                    Tata Cara Sholat {item.steps === 'taubat' ? 'Taubat' : 'Sunnah'}
                                                </h5>
                                                
                                                {item.steps === 'taubat' ? (
                                                    <div className="space-y-2">
                                                        {getTaubatSteps().map((s, i) => (
                                                            <div key={i} className="bg-white border border-slate-100 p-3 rounded-xl shadow-sm">
                                                                <span className="text-[10px] font-bold text-emerald-600 block mb-0.5">Langkah {i+1}:</span>
                                                                <p className="font-bold text-slate-800 mb-1 text-sm">{s.title}</p>
                                                                <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden divide-y divide-slate-50">
                                                        {commonSunnahSteps.map((step, i) => (
                                                            <div key={i} className="px-4 py-2.5 flex items-center gap-3 hover:bg-slate-50 transition-colors">
                                                                <span className="w-5 h-5 flex items-center justify-center bg-slate-100 text-slate-500 rounded-full text-[10px] font-bold shrink-0">
                                                                    {i + 1}
                                                                </span>
                                                                <span className="text-xs font-semibold text-slate-700">{step}</span>
                                                            </div>
                                                        ))}
                                                    </div>
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
