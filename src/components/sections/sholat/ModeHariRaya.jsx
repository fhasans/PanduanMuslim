import React from 'react';
import { MoonStar } from 'lucide-react';
import AccordionCard from '../../ui/AccordionCard.jsx';

export default function ModeHariRaya() {
    return (
        <div className="space-y-6 animate-in fade-in p-2 md:p-0">
            <div className="bg-emerald-800 text-white p-6 rounded-3xl text-center shadow-md bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]">
                <MoonStar size={40} className="mx-auto text-amber-300 mb-3" />
                <h3 className="text-xl md:text-2xl font-bold mb-2">Panduan Sholat Idul Fitri & Idul Adha</h3>
                <p className="text-emerald-100 text-sm">Dilaksanakan di lapangan atau masjid pada pagi hari raya. Berjumlah 2 rakaat tanpa adzan dan iqamah.</p>
            </div>

            <AccordionCard title="Niat Sholat Ied" defaultOpen={true}>
                <div className="space-y-4">
                    <div>
                        <span className="font-bold text-sm text-emerald-600">Idul Fitri:</span>
                        <div className="flex justify-between items-start gap-2 bg-slate-50 p-2 rounded mt-1">
                            <p className="font-semibold text-slate-800">"Ushallii sunnata li 'iidil fithri rak'ataini (imaman/makmuuman) lillaahi ta'aalaa."</p>
                                                    </div>
                    </div>
                    <div>
                        <span className="font-bold text-sm text-amber-600">Idul Adha:</span>
                        <div className="flex justify-between items-start gap-2 bg-slate-50 p-2 rounded mt-1">
                            <p className="font-semibold text-slate-800">"Ushallii sunnata li 'iidil adl-haa rak'ataini (imaman/makmuuman) lillaahi ta'aalaa."</p>
                                                    </div>
                    </div>
                </div>
            </AccordionCard>

            <AccordionCard title="Tata Cara Khusus Sholat Ied" defaultOpen={true}>
                <div className="space-y-6">
                    <div className="flex gap-4">
                        <div className="bg-emerald-100 text-emerald-800 w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0">1</div>
                        <div className="w-full">
                            <h5 className="font-bold text-slate-800">Rakaat Pertama (7x Takbir)</h5>
                            <p className="text-sm text-slate-600 mt-1">Setelah takbiratul ihram dan doa iftitah, melakukan takbir zawaid (tambahan) sebanyak 7 kali sebelum membaca Al-Fatihah.</p>
                            <div className="mt-2 bg-slate-50 p-3 rounded-lg border border-slate-100 flex justify-between items-start gap-2">
                                <div>
                                    <span className="text-xs font-bold text-slate-400">BACAAN DI ANTARA TAKBIR:</span>
                                    <p className="font-medium text-slate-800 mt-1 text-sm">"Subhaanallaah walhamdulillaah wa laa ilaaha illallaah wallaahu akbar."</p>
                                </div>
                                                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="bg-emerald-100 text-emerald-800 w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0">2</div>
                        <div className="w-full">
                            <h5 className="font-bold text-slate-800">Rakaat Kedua (5x Takbir)</h5>
                            <p className="text-sm text-slate-600 mt-1">Setelah bangkit dari sujud (takbir intiqal), melakukan takbir tambahan sebanyak 5 kali sebelum membaca Al-Fatihah. Bacaan di sela takbir sama seperti rakaat pertama.</p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="bg-emerald-100 text-emerald-800 w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0">3</div>
                        <div className="w-full">
                            <h5 className="font-bold text-slate-800">Mendengarkan Khutbah</h5>
                            <p className="text-sm text-slate-600 mt-1">Selesai sholat (salam), jamaah sangat dianjurkan untuk duduk tenang mendengarkan khutbah Ied hingga selesai.</p>
                        </div>
                    </div>
                </div>
            </AccordionCard>
        </div>
    );
}
