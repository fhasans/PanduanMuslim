import React from 'react';
import AccordionCard from '../../ui/AccordionCard.jsx';
import TasbihCounter from '../../ui/TasbihCounter.jsx';

export default function TarawihView() {
    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="bg-amber-50 p-5 rounded-2xl border border-amber-200">
                <h3 className="font-bold text-amber-800 mb-2">Panduan Sholat Tarawih</h3>
                <p className="text-sm text-amber-900 leading-relaxed mb-4">
                    Sholat Tarawih sunnah dikerjakan setelah sholat Isya di bulan Ramadhan. Nabi ﷺ mengerjakannya 11 rakaat (8 Tarawih + 3 Witir), namun boleh juga dikerjakan 23 rakaat. Dilakukan dengan cara <strong>2 rakaat salam, 2 rakaat salam</strong>.
                </p>

                <AccordionCard title="Niat Sholat Tarawih (2 Rakaat)" defaultOpen={true}>
                    <div className="flex justify-between items-start gap-2 bg-white p-3 rounded-lg">
                        <p className="font-semibold text-emerald-700 mb-1">
                            "Ushallii sunnatat taraawiihi rak'ataini (imaman / makmuuman / lillaahi ta'aalaa)."
                        </p>
                    </div>
                    <p className="text-xs text-slate-500 italic mt-2">
                        Pilih "imaman" jika jadi imam, "makmuuman" jika jadi makmum, atau langsung "lillaahi ta'aalaa" jika sholat sendiri.
                    </p>
                </AccordionCard>

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
