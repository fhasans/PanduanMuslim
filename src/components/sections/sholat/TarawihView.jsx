import React from 'react';
import AccordionCard from '../../ui/AccordionCard.jsx';
import TasbihCounter from '../../ui/TasbihCounter.jsx';
import NiatBox from '../../ui/NiatBox.jsx';
import { ListChecks } from 'lucide-react';

export default function TarawihView() {
    const tarawihSteps = [
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
        "Istirahat / Membaca Dzikir Sela (Lihat di bawah)"
    ];

    const pilihanDzikir = [
        {
            title: "Pilihan 1 (Syahadat & Istighfar)",
            items: [
                { latin: "Asyhadu an laa ilaha illallah.", hint: "Dibaca 1 atau 3 kali", target: 3 },
                { latin: "Astaghfirullah.", hint: "Dibaca 1 atau 3 kali", target: 3 }
            ]
        },
        {
            title: "Pilihan 2 (Mohon Ampunan)",
            items: [
                { latin: "Allahumma innaka 'afuwwun kariim tuhibbul 'afwa fa'fu 'anni.", hint: "Dibaca berulang kali", target: null }
            ]
        },
        {
            title: "Pilihan 3 (Mohon Ridha & Surga)",
            items: [
                { latin: "Allahumma inna nas'aluka ridhoka wal jannah, wa na'udzubika min sakhothika wan naar.", hint: "Dibaca berulang kali", target: null }
            ]
        },
        {
            title: "Pilihan 4 (Shalawat Nabi)",
            items: [
                { latin: "Allahumma shalli 'ala sayyidina Muhammad.", hint: "Dibaca berulang kali", target: null }
            ]
        }
    ];

    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="bg-amber-50 p-5 rounded-3xl border border-amber-200 shadow-sm transition-all hover:shadow-md">
                <h3 className="font-bold text-amber-800 mb-2 flex items-center gap-2 text-lg">
                    <span className="p-1.5 bg-amber-100 rounded-lg">🕌</span> Panduan Sholat Tarawih
                </h3>
                <p className="text-sm text-amber-900 leading-relaxed mb-4">
                    Sholat Tarawih dilakukan dengan cara <strong>2 rakaat salam, 2 rakaat salam</strong>. Umumnya dilakukan 8 rakaat atau 20 rakaat di bulan Ramadhan, lalu ditutup dengan Witir.
                </p>

                <AccordionCard title="Niat Sholat Tarawih (2 Rakaat)" defaultOpen={true}>
                    <div className="bg-emerald-50/40 p-1 rounded-2xl border border-emerald-100/50">
                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-tighter px-3 pt-2 block">Sesuaikan Peran:</span>
                        <NiatBox 
                            sendiri="Ushallii sunnatat taraawiihi rak'ataini lillaahi ta'aalaa."
                            imam="Ushallii sunnatat taraawiihi rak'ataini imaaman lillaahi ta'aalaa."
                            makmum="Ushallii sunnatat taraawiihi rak'ataini makmuuman lillaahi ta'aalaa."
                            artiSendiri="Aku berniat sholat sunnah Tarawih dua rakaat karena Allah Ta'ala."
                            artiImam="Aku berniat sholat sunnah Tarawih dua rakaat sebagai Imam karena Allah Ta'ala."
                            artiMakmum="Aku berniat sholat sunnah Tarawih dua rakaat sebagai Makmum karena Allah Ta'ala."
                        />
                    </div>
                </AccordionCard>

                <div className="mt-4">
                    <AccordionCard title="Tata Cara Per 2 Rakaat">
                        <div className="bg-white border border-amber-100 rounded-2xl overflow-hidden divide-y divide-slate-50">
                            {tarawihSteps.map((step, i) => (
                                <div key={i} className="px-4 py-3 flex items-center gap-3 hover:bg-amber-50/50 transition-colors group">
                                    <span className="w-6 h-6 flex items-center justify-center bg-amber-100 text-amber-700 rounded-full text-[10px] font-bold shrink-0 shadow-inner group-hover:scale-110 transition-transform">
                                        {i + 1}
                                    </span>
                                    <span className="text-xs font-semibold text-slate-700">{step}</span>
                                </div>
                            ))}
                        </div>
                    </AccordionCard>
                </div>

                <div className="mt-6 space-y-4">
                    <div className="flex items-center gap-2 px-1">
                        <div className="h-1 w-6 bg-amber-400 rounded-full"></div>
                        <h3 className="font-bold text-slate-800">Bacaan Setiap Selesai 2 Rakaat</h3>
                    </div>
                    
                    {pilihanDzikir.map((pilihan, idx) => (
                        <AccordionCard key={idx} title={pilihan.title}>
                            <div className="space-y-3">
                                {pilihan.items.map((item, iIdx) => (
                                    <div key={iIdx} className="bg-slate-50/80 p-4 rounded-xl border border-slate-100 backdrop-blur-sm">
                                        <p className="font-bold text-emerald-900 text-lg leading-relaxed mb-1 uppercase text-center">
                                            "{item.latin}"
                                        </p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center mb-3">
                                            {item.hint}
                                        </p>
                                        <TasbihCounter target={item.target} label={item.hint} />
                                    </div>
                                ))}
                            </div>
                        </AccordionCard>
                    ))}

                    <AccordionCard title="Dzikir Pujian & Thayyibah (Alternatif)">
                        <div className="space-y-4">
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <p className="font-bold text-emerald-900 text-lg leading-relaxed mb-2 uppercase text-center">
                                    "Subhaanal malikil ma'buud, Subhaanal malikil maujuud, Subhaanal malikil hayyil ladzii laa yanaamu wa laa yamuut."
                                </p>
                                <p className="text-xs text-slate-500 italic text-center leading-relaxed">
                                    "Maha Suci Tuhan yang disembah, Maha Suci Tuhan yang Ada, Maha Suci Tuhan yang Hidup yang tidak tidur dan tidak mati."
                                </p>
                                <div className="mt-3">
                                    <TasbihCounter target={null} label="Maha Suci Allah" />
                                </div>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <p className="font-bold text-emerald-900 text-lg leading-relaxed mb-2 uppercase text-center">
                                    "Subbuuhun qudduusun rabbul malaa-ikati warruuh."
                                </p>
                                <p className="text-xs text-slate-500 italic text-center">
                                    "Maha Suci, Maha Quddus, Tuhan para malaikat dan Jibril."
                                </p>
                                <div className="mt-3">
                                    <TasbihCounter target={null} label="Subbuuhun Qudduusun" />
                                </div>
                            </div>
                        </div>
                    </AccordionCard>
                </div>

                <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50 mt-8 backdrop-blur-sm">
                    <span className="font-black text-blue-800 block mb-1.5 text-[10px] uppercase tracking-widest opacity-60">Catatan Fiqih</span>
                    <p className="text-xs text-blue-900/80 leading-relaxed font-medium">
                        Bacaan di atas adalah pilihan yang umum diamalkan. Tidak ada keharusan membaca dzikir tertentu di sela rakaat. Anda boleh beristirahat sejenak atau membaca doa apa pun yang baik.
                    </p>
                </div>
            </div>
        </div>
    );
}
