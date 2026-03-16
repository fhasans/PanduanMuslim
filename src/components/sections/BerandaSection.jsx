import React from 'react';
import { BookOpen, Droplets, Heart, Book, Compass, Bookmark } from 'lucide-react';
import MenuCard from '../ui/MenuCard.jsx';

export default function BerandaSection({ setTab, onSecretTap }) {
    return (
        <div className="space-y-6">
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-800 to-emerald-600 text-white shadow-lg p-6 md:p-8">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3 cursor-pointer select-none" onClick={onSecretTap}>
                        <BookOpen size={24} className="text-amber-300 pointer-events-none" />
                        <span className="font-bold tracking-wider text-sm text-emerald-100 uppercase pointer-events-none">SunnahGuide</span>
                    </div>
                    <h1 className="text-2xl md:text-4xl font-extrabold leading-tight mb-3">
                        Sempurnakan Ibadahmu,<br />Sesuai Tuntunan Nabi ﷺ
                    </h1>
                    <p className="text-emerald-50 text-sm md:text-base opacity-90 leading-relaxed max-w-lg">
                        Panduan praktis wudhu, sholat, dan ibadah harian berlandaskan Al-Qur'an dan hadits shahih. Mudah dipahami untuk setiap muslim.
                    </p>
                </div>
            </div>

            <div>
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 px-1">Menu Utama</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <MenuCard icon={<Droplets size={28} className="text-blue-500" />} title="Wudhu & Bersuci" bg="bg-blue-50" onClick={() => setTab('wudhu')} />
                    <MenuCard icon={<Book size={28} className="text-emerald-500" />} title="Panduan Sholat" bg="bg-emerald-50" onClick={() => setTab('sholat')} />
                    <MenuCard icon={<Compass size={28} className="text-teal-500" />} title="Jadwal Shalat" bg="bg-teal-50" onClick={() => setTab('jadwal')} />
                    <MenuCard icon={<Heart size={28} className="text-amber-500" />} title="Puasa Ramadhan" bg="bg-amber-50" onClick={() => setTab('puasa')} />
                    <MenuCard icon={<BookOpen size={28} className="text-violet-500" />} title="Al-Qur'an" bg="bg-violet-50" onClick={() => setTab('quran')} />
                    <MenuCard icon={<Bookmark size={28} className="text-rose-500" />} title="Kumpulan Doa" bg="bg-rose-50" onClick={() => setTab('doa')} />
                    <MenuCard icon={<Book size={28} className="text-indigo-500" />} title="Juz Amma" bg="bg-indigo-50" onClick={() => setTab('hafalan')} />
                </div>
            </div>
        </div>
    );
}
