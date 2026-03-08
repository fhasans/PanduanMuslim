import React from 'react';
import AccordionCard from '../../ui/AccordionCard.jsx';

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

                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mt-4">
                    <span className="font-bold text-blue-800 block mb-2">Dzikir Jeda Antara Tarawih</span>
                    <p className="text-sm text-blue-900 leading-relaxed">
                        Menurut sunnah yang sahih dari Nabi ﷺ, tidak ada bacaan atau dzikir khusus yang diwajibkan di sela-sela rakaat Tarawih. Waktu jeda ini aslinya digunakan untuk istirahat ("Tarwiha" = istirahat). Namun dibolehkan memperbanyak istighfar atau doa secara mandiri.
                    </p>
                </div>
            </div>
        </div>
    );
}
