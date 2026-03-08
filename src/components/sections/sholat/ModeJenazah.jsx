import React from 'react';
import { Users } from 'lucide-react';
import AccordionCard from '../../ui/AccordionCard.jsx';

export default function ModeJenazah() {
    return (
        <div className="space-y-6 animate-in fade-in p-2 md:p-0">
            <div className="bg-slate-800 text-white p-6 rounded-3xl text-center shadow-md bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]">
                <Users size={40} className="mx-auto text-emerald-400 mb-3" />
                <h3 className="text-xl md:text-2xl font-bold mb-2">Panduan Sholat Jenazah</h3>
                <p className="text-slate-300 text-sm">Hukumnya Fardhu Kifayah. Dilakukan dengan 4 kali takbir, tanpa ruku' dan tanpa sujud.</p>
            </div>

            <AccordionCard title="1. Niat Sholat Jenazah" defaultOpen={true}>
                <div className="space-y-4">
                    <div>
                        <span className="font-bold text-sm text-emerald-700">A. Mayit Laki-laki (Sebagai Imam):</span>
                        <div className="flex justify-between items-start gap-2 bg-slate-50 p-3 rounded-lg mt-1">
                            <p className="font-semibold text-slate-800">"Ushallii 'alaa haadzal mayyiti arba'a takbiiraatin fardhal kifaayati imaaman lillaahi ta'aalaa."</p>
                                                    </div>
                    </div>

                    <div>
                        <span className="font-bold text-sm text-emerald-700">B. Mayit Laki-laki (Sebagai Makmum):</span>
                        <div className="flex justify-between items-start gap-2 bg-slate-50 p-3 rounded-lg mt-1">
                            <p className="font-semibold text-slate-800">"Ushallii 'alaa haadzal mayyiti arba'a takbiiraatin fardhal kifaayati makmuuman lillaahi ta'aalaa."</p>
                                                    </div>
                    </div>

                    <div>
                        <span className="font-bold text-sm text-indigo-700">C. Mayit Perempuan (Sebagai Imam):</span>
                        <div className="flex justify-between items-start gap-2 bg-slate-50 p-3 rounded-lg mt-1">
                            <p className="font-semibold text-slate-800">"Ushallii 'alaa haadzihil mayyitati arba'a takbiiraatin fardhal kifaayati imaaman lillaahi ta'aalaa."</p>
                                                    </div>
                    </div>

                    <div>
                        <span className="font-bold text-sm text-indigo-700">D. Mayit Perempuan (Sebagai Makmum):</span>
                        <div className="flex justify-between items-start gap-2 bg-slate-50 p-3 rounded-lg mt-1">
                            <p className="font-semibold text-slate-800">"Ushallii 'alaa haadzihil mayyitati arba'a takbiiraatin fardhal kifaayati makmuuman lillaahi ta'aalaa."</p>
                                                    </div>
                    </div>
                </div>
            </AccordionCard>

            <AccordionCard title="2. Tata Cara & Bacaan 4 Takbir" defaultOpen={true}>
                <div className="space-y-6">
                    <div className="flex gap-4">
                        <div className="bg-slate-100 text-slate-800 w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0">1</div>
                        <div className="w-full">
                            <h5 className="font-bold text-slate-800">Takbir Pertama (Membaca Al-Fatihah)</h5>
                            <p className="text-sm text-slate-600 mt-1 mb-2">Setelah takbiratul ihram, langsung membaca Surah Al-Fatihah (tanpa doa iftitah).</p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="bg-slate-100 text-slate-800 w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0">2</div>
                        <div className="w-full">
                            <h5 className="font-bold text-slate-800">Takbir Kedua (Membaca Sholawat)</h5>
                            <p className="text-sm text-slate-600 mt-1 mb-2">Membaca sholawat nabi. Boleh sholawat pendek atau sholawat Ibrahimiyyah (seperti di tahiyat akhir).</p>
                            <div className="bg-slate-50 p-3 rounded-lg flex justify-between items-start gap-2">
                                <p className="font-medium text-slate-800 text-sm">"Allaahumma shalli 'alaa Sayyidinaa Muhammad wa 'alaa aali Sayyidinaa Muhammad."</p>
                                                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="bg-slate-100 text-slate-800 w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0">3</div>
                        <div className="w-full">
                            <h5 className="font-bold text-slate-800">Takbir Ketiga (Mendoakan Mayit)</h5>
                            <p className="text-sm text-slate-600 mt-1 mb-2">Ganti <strong>"lahu"</strong> menjadi <strong>"laha"</strong> jika mayitnya perempuan.</p>
                            <div className="bg-slate-50 p-3 rounded-lg flex justify-between items-start gap-2">
                                <div>
                                    <p className="font-medium text-slate-800 text-sm">"Allaahummaghfir lahu warhamhu wa 'aafihi wa'fu 'anhu."</p>
                                    <p className="text-xs text-slate-500 italic mt-1">Arti: "Ya Allah, ampunilah dia, rahmatilah dia, bebaskanlah dia, dan maafkanlah dia."</p>
                                </div>
                                                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="bg-slate-100 text-slate-800 w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0">4</div>
                        <div className="w-full">
                            <h5 className="font-bold text-slate-800">Takbir Keempat (Doa Penutup & Salam)</h5>
                            <p className="text-sm text-slate-600 mt-1 mb-2">Ganti <strong>"ajrahu"</strong> dan <strong>"ba'dahu"</strong> menjadi <strong>"ajrahaa"</strong> dan <strong>"ba'dahaa"</strong> jika perempuan. Setelah ini langsung Salam.</p>
                            <div className="bg-slate-50 p-3 rounded-lg flex justify-between items-start gap-2">
                                <div>
                                    <p className="font-medium text-slate-800 text-sm">"Allaahumma laa tahrimnaa ajrahu wa laa taftinnaa ba'dahu waghfir lanaa wa lahu."</p>
                                    <p className="text-xs text-slate-500 italic mt-1">Arti: "Ya Allah, janganlah Engkau halangi kami untuk mendapatkan pahalanya, dan janganlah Engkau beri fitnah kami sepeninggalnya, dan ampunilah kami dan dia."</p>
                                </div>
                                                            </div>
                        </div>
                    </div>
                </div>
            </AccordionCard>
        </div>
    );
}
