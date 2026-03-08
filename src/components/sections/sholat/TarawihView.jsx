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

    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="bg-amber-50 p-5 rounded-3xl border border-amber-200">
                <h3 className="font-bold text-amber-800 mb-2">Panduan Sholat Tarawih</h3>
                <p className="text-sm text-amber-900 leading-relaxed mb-4">
                    Sholat Tarawih dilakukan dengan cara <strong>2 rakaat salam, 2 rakaat salam</strong>. Umumnya dilakukan 8 rakaat atau 20 rakaat, lalu ditutup dengan Witir.
                </p>

                <AccordionCard title="Niat Sholat Tarawih (2 Rakaat)" defaultOpen={true}>
                    <div className="bg-emerald-50/30 p-1 rounded-2xl">
                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-tighter px-3 mb-1 block">Pilih Peran:</span>
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
                                <div key={i} className="px-4 py-3 flex items-center gap-3 hover:bg-amber-50/50 transition-colors">
                                    <span className="w-6 h-6 flex items-center justify-center bg-amber-100 text-amber-700 rounded-full text-[10px] font-bold shrink-0">
                                        {i + 1}
                                    </span>
                                    <span className="text-xs font-semibold text-slate-700">{step}</span>
                                </div>
                            ))}
                        </div>
                    </AccordionCard>
                </div>


                <div className="mt-4 space-y-4">
                    <h3 className="font-bold text-slate-800 px-1">Bacaan Setiap Selesai 2 Rakaat</h3>
                    
                    <AccordionCard title="Dzikir Pujian (Umum)">
                        <div className="space-y-4">
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <p className="font-bold text-emerald-900 text-lg leading-relaxed mb-2 uppercase">
                                    "Subhaanal malikil ma'buud, Subhaanal malikil maujuud, Subhaanal malikil hayyil ladzii laa yanaamu wa laa yamuut."
                                </p>
                                <p className="text-sm text-slate-500 italic">
                                    Maha Suci Tuhan yang disembah, Maha Suci Tuhan yang Ada, Maha Suci Tuhan yang Hidup yang tidak tidur dan tidak mati.
                                </p>
                                <TasbihCounter target={null} label="Dibaca sebanyak-banyaknya" />
                            </div>

                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <p className="font-bold text-emerald-900 text-lg leading-relaxed mb-2 uppercase">
                                    "Subbuuhun qudduusun rabbul malaa-ikati warruuh."
                                </p>
                                <p className="text-sm text-slate-500 italic">
                                    Maha Suci, Maha Quddus, Tuhan para malaikat dan Jibril.
                                </p>
                                <TasbihCounter target={null} label="Dibaca sebanyak-banyaknya" />
                            </div>
                        </div>
                    </AccordionCard>

                    <AccordionCard title="Dzikir Kalimat Thayyibah">
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <p className="font-bold text-emerald-900 text-lg leading-relaxed mb-2 uppercase">
                                "Subhaanallaahi wal hamdu lillaahi wa laa ilaaha illallaahu wallaa hu akbar, wa laa haula wa laa quwwata illaa billaahil 'aliyyil 'adzhiim."
                            </p>
                            <p className="text-sm text-slate-500 italic">
                                Maha Suci Allah, segala puji bagi Allah, tiada Tuhan selain Allah, Allah Maha Besar. Tiada daya dan upaya kecuali dengan pertolongan Allah Yang Maha Tinggi lagi Maha Agung.
                            </p>
                            <TasbihCounter target={null} label="Dibaca sebanyak-banyaknya" />
                        </div>
                    </AccordionCard>
                </div>

                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mt-6">
                    <span className="font-bold text-blue-800 block mb-2 text-xs uppercase tracking-wider">Catatan Fiqih</span>
                    <p className="text-sm text-blue-900 leading-relaxed">
                        Meskipun bacaan di atas populer di Indonesia, perlu diingat bahwa tidak ada bacaan khusus yang "wajib" di sela-sela rakaat Tarawih. Anda boleh berdoa apa saja atau hanya berdiam sejenak untuk istirahat.
                    </p>
                </div>
            </div>
        </div>
    );
}
