import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import AccordionCard from '../ui/AccordionCard.jsx';
import TabButton from '../ui/TabButton.jsx';
import ImsakiyahSection from './ImsakiyahSection.jsx';

export default function PuasaSection() {
    const [subTab, setSubTab] = useState('imsakiyah');

    return (
        <div className="p-4 md:p-0 space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 text-center">Puasa Ramadhan</h2>

            <div className="bg-slate-100/70 p-1 rounded-xl flex gap-1 overflow-x-auto no-scrollbar">
                <TabButton label="Jadwal Imsakiyah" active={subTab === 'imsakiyah'} onClick={() => setSubTab('imsakiyah')} />
                <TabButton label="Panduan Puasa" active={subTab === 'panduan'} onClick={() => setSubTab('panduan')} />
            </div>

            <div className="pt-2 animate-in fade-in">
                {subTab === 'imsakiyah' && <ImsakiyahSection />}
                
                {subTab === 'panduan' && (
                    <div className="space-y-6">
                        <AccordionCard title="Niat Puasa Ramadhan" defaultOpen={true}>
                            <div className="bg-amber-50 p-3 rounded-lg border-l-4 border-amber-500 mb-2 flex justify-between items-start gap-2">
                                <p className="font-semibold text-amber-900 text-lg leading-relaxed">
                                    "Nawaitu shauma ghadin 'an adaa-i fardhi syahri ramadhaana haadzihis sanati lillaahi ta'aalaa."
                                </p>
                                                            </div>
                            <p className="text-slate-600 text-sm italic">
                                Artinya: "Aku berniat puasa esok hari untuk menunaikan fardhu di bulan Ramadhan tahun ini karena Allah Ta'ala."
                            </p>
                        </AccordionCard>

                        <AccordionCard title="Hal yang Membatalkan Puasa" defaultOpen={true}>
                            <ul className="space-y-3">
                                <li className="flex gap-3"><CheckCircle2 className="text-red-500 shrink-0" size={18} /> <span className="text-slate-700 text-sm">Makan dan minum dengan sengaja.</span></li>
                                <li className="flex gap-3"><CheckCircle2 className="text-red-500 shrink-0" size={18} /> <span className="text-slate-700 text-sm">Muntah dengan sengaja.</span></li>
                                <li className="flex gap-3"><CheckCircle2 className="text-red-500 shrink-0" size={18} /> <span className="text-slate-700 text-sm">Keluarnya darah Haid atau Nifas bagi wanita.</span></li>
                            </ul>
                        </AccordionCard>
                    </div>
                )}
            </div>
        </div>
    );
}
