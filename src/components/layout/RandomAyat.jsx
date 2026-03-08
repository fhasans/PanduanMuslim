import React, { useState, useEffect } from 'react';
import { Quote, Loader2, RefreshCw } from 'lucide-react';

export default function RandomAyat() {
    const [ayat, setAyat] = useState(null);
    const [loading, setLoading] = useState(true);

    const toArabicNumerals = (num) => {
        const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
        return num.toString().split('').map(n => arabicNumbers[n]).join('');
    };

    const fetchRandomAyat = async () => {
        setLoading(true);
        try {
            // Pick a random surah 1 to 114
            const surahNum = Math.floor(Math.random() * 114) + 1;
            const res = await fetch(`https://equran.id/api/v2/surat/${surahNum}`);
            const data = await res.json();
            
            if (data.code === 200 && data.data) {
                const surahData = data.data;
                const totalAyat = surahData.jumlahAyat;
                
                // Pick a random ayat from that surah
                const ayatNum = Math.floor(Math.random() * totalAyat);
                const randomAyatData = surahData.ayat[ayatNum];
                
                setAyat({
                    suratId: surahNum,
                    suratName: surahData.namaLatin,
                    ayatNumber: randomAyatData.nomorAyat,
                    arab: `${randomAyatData.teksArab} ﴿${toArabicNumerals(randomAyatData.nomorAyat)}﴾`,
                    latin: `${randomAyatData.teksLatin} (${randomAyatData.nomorAyat})`,
                    indo: `${randomAyatData.teksIndonesia} (${randomAyatData.nomorAyat})`
                });
            }
        } catch (error) {
            console.error("Failed to fetch random ayat:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRandomAyat();
    }, []);

    if (loading) {
        return (
            <div className="bg-slate-50 border-b border-slate-100 p-4 flex justify-center items-center">
                <Loader2 size={16} className="text-emerald-500 animate-spin mr-2" />
                <span className="text-xs text-slate-400 font-medium">Menyajikan Ayat Harian...</span>
            </div>
        );
    }

    if (!ayat) return null;

    return (
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100 p-5 relative overflow-hidden">
            {/* Background Deco */}
            <Quote size={100} className="absolute -bottom-6 -right-6 text-emerald-600/5 rotate-12" />
            
            <div className="max-w-3xl mx-auto relative z-10 flex flex-col items-center">
                <div className="flex items-center gap-2 mb-3">
                    <span className="bg-emerald-100/80 border border-emerald-200 text-emerald-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full tracking-wider uppercase">
                        Ayat Harian
                    </span>
                    <button onClick={fetchRandomAyat} className="p-1 text-emerald-500 hover:text-emerald-700 bg-white rounded-full shadow-sm border border-emerald-100 transition-colors">
                        <RefreshCw size={12} />
                    </button>
                </div>
                
                <h4 className="font-arabic text-xl md:text-2xl text-slate-800 leading-relaxed font-bold mb-3 w-full text-center" dir="rtl">
                    {ayat.arab}
                </h4>
                
                <p className="text-xs text-slate-500 italic mb-2 font-medium text-center">"{ayat.latin}"</p>
                <p className="text-sm text-slate-700 font-medium w-full text-center leading-relaxed">"{ayat.indo}"</p>
                
                <p className="text-[10px] font-bold text-emerald-600 mt-3 uppercase tracking-widest text-center">
                    — Q.S. {ayat.suratName} : {ayat.ayatNumber}
                </p>
            </div>
        </div>
    );
}
