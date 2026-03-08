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
                                                    Panduan Tata Cara Sholat {item.steps === 'taubat' ? 'Taubat' : 'Sunnah'}
                                                </h5>
                                                
                                                {item.steps === 'taubat' ? (
                                                    <div className="space-y-4">
                                                        <div className="bg-emerald-50 border-emerald-100 border p-4 rounded-2xl">
                                                            <p className="text-xs text-emerald-800 font-medium leading-relaxed">
                                                                Sholat Taubat dikerjakan sebanyak <strong>2 rakaat</strong> (sendiri) dengan tata cara yang sama seperti sholat sunnah biasa, namun dengan niat bertaubat. Berikut rincian bacaan per gerakan:
                                                            </p>
                                                        </div>

                                                        <div className="space-y-3">
                                                            {/* Filter and map the full prayer readings for a 2-rakaat sunnah flow */}
                                                            {bacaanSholatLengkap
                                                                .filter(b => !["Tasyahud Awal (Duduk Rakaat Kedua)"].includes(b.gerakan))
                                                                .map((b, bIdx) => {
                                                                    // Define which steps are rakaat 1 vs rakaat 2 for clarity
                                                                    let badge = null;
                                                                    if (["Takbiratul Ihram", "Doa Iftitah (Shafi'i)"].includes(b.gerakan)) badge = "Persiapan";
                                                                    if (["Membaca Al-Fatihah (Wajib)", "Ruku'", "I'dtidal (Bangkit dari Ruku')", "Sujud"].includes(b.gerakan)) badge = "Rakaat 1 & 2";
                                                                    if (["Tasyahud Akhir (Duduk Terakhir)", "Salam"].includes(b.gerakan)) badge = "Penutup";

                                                                    return (
                                                                        <div key={bIdx} className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm transition-all hover:border-emerald-200">
                                                                            <div className="bg-slate-50/50 px-4 py-2 border-b border-slate-50 flex justify-between items-center">
                                                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gerakan {bIdx + 1}</span>
                                                                                {badge && <span className="text-[9px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">{badge}</span>}
                                                                            </div>
                                                                            <div className="p-4">
                                                                                <h6 className="font-bold text-slate-800 text-sm mb-2">{b.gerakan}</h6>
                                                                                <div className="bg-emerald-50/30 p-3 rounded-xl border border-emerald-50/50 mb-2">
                                                                                    <p className="font-bold text-emerald-900 text-base leading-relaxed">"{b.latin}"</p>
                                                                                </div>
                                                                                <p className="text-[11px] text-slate-500 italic">Artinya: "{b.arti}"</p>
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })}
                                                            
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
                                                    </div>
                                                ) : (
                                                    <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden divide-y divide-slate-50 shadow-sm">
                                                        <div className="p-3 bg-slate-50/50">
                                                            <p className="text-[11px] text-slate-500 italic">Ikuti urutan gerakan standar berikut untuk 2 rakaat sholat sunnah:</p>
                                                        </div>
                                                        {commonSunnahSteps.map((step, i) => (
                                                            <div key={i} className="px-4 py-3 flex items-center gap-3 hover:bg-emerald-50/30 transition-colors group">
                                                                <span className="w-6 h-6 flex items-center justify-center bg-slate-100 text-slate-500 rounded-full text-[10px] font-bold shrink-0 transition-transform group-hover:scale-110">
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
