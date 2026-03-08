import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import AccordionCard from '../ui/AccordionCard.jsx';

export default function WudhuSection() {
    return (
        <div className="p-4 md:p-0 space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 text-center">Panduan Wudhu</h2>
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-blue-800 text-sm mb-6 text-center">
                Bacaan Niat (Latin): <br />
                <div className="flex justify-center items-start gap-2 mt-2">
                    <span className="font-bold text-base block">"Nawaitul wudhuu-a liraf'il hadatsil ashghari fardhal lillaahi ta'aalaa."</span>
                                    </div>
                <span className="italic mt-1 block">Artinya: "Aku berniat wudhu untuk menghilangkan hadats kecil fardhu karena Allah Ta'ala."</span>
            </div>
            <div className="space-y-3">
                {[
                    "Membaca Basmalah ('Bismillah').",
                    "Mencuci kedua telapak tangan 3x.",
                    "Berkumur dan menghirup air ke hidung 3x.",
                    "Membasuh seluruh wajah 3x.",
                    "Membasuh tangan kanan hingga siku 3x, lalu tangan kiri 3x.",
                    "Mengusap kepala hingga telinga 1x.",
                    "Mencuci kaki kanan hingga mata kaki 3x, lalu kaki kiri 3x.",
                    "Tertib (berurutan)."
                ].map((step, idx) => (
                    <div key={idx} className="flex gap-3 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                        <CheckCircle2 className="text-blue-500 shrink-0 mt-0.5" size={20} />
                        <p className="text-slate-700">{step}</p>
                    </div>
                ))}
            </div>
            <AccordionCard title="Doa Setelah Wudhu" defaultOpen={true}>
                <div className="flex justify-between items-start gap-2 mb-2 bg-emerald-50 p-3 rounded-lg">
                    <p className="font-semibold text-emerald-900 leading-relaxed">
                        "Asyhadu allaa ilaaha illallaah wahdahu laa syariikalah, wa asyhadu anna Muhammadan 'abduhu wa rasuuluh. Allahummaj'alnii minat tawwaabiina waj'alnii minal mutathahhiriin."
                    </p>
                                    </div>
                <p className="text-sm text-slate-600 italic">
                    Artinya: "Aku bersaksi tiada Tuhan selain Allah Yang Maha Esa, tiada sekutu bagi-Nya. Dan aku bersaksi bahwa Muhammad adalah hamba dan utusan-Nya. Ya Allah, jadikanlah aku termasuk orang yang bertaubat dan orang yang bersuci."
                </p>
            </AccordionCard>
        </div>
    );
}
