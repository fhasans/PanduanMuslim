import React from 'react';
import { X, Sparkles, Footprints, Calculator, ShieldCheck, Bookmark, ArrowRight } from 'lucide-react';

export default function FeatureHighlightPopup({ onClose }) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 relative">
                {/* Decorative Header */}
                <div className="h-32 bg-gradient-to-br from-emerald-500 to-teal-700 relative flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                    <Sparkles className="text-white opacity-20 absolute -top-4 -left-4" size={80} />
                    <div className="text-center relative z-10">
                        <h2 className="text-2xl font-black text-white uppercase tracking-widest drop-shadow-md">Fitur Baru!</h2>
                        <p className="text-emerald-50 text-[10px] font-bold uppercase tracking-[0.3em]">Qadha Tracker v1.2.0</p>
                    </div>
                </div>

                <div className="p-8 space-y-6">
                    <div className="space-y-4">
                        <FeatureItem 
                            icon={<Calculator className="text-emerald-500" size={20} />} 
                            title="Kalkulator Qadha Terpadu"
                            desc="Pilih antara metode Kalkulasi Otomatis (berdasarkan umur) atau Input Manual dengan antarmuka yang lebih bersih."
                        />
                        <FeatureItem 
                            icon={<ShieldCheck className="text-amber-500" size={20} />} 
                            title="Edukasi Hukum & Dalil"
                            desc="Kini tersedia catatan lengkap mengenai Udhur (Sakit, Safar, Haid) & Kelalaian beserta dalil Al-Qur'an & Hadits."
                        />
                        <FeatureItem 
                            icon={<Bookmark className="text-blue-500" size={20} />} 
                            title="Interactive Tooltips"
                            desc="Cukup arahkan kursor (hover) pada dalil di profile untuk membaca arti ayat/hadits secara langsung."
                        />
                        <FeatureItem 
                            icon={<Footprints className="text-purple-500" size={20} />} 
                            title="Layout Responsif"
                            desc="Panel informasi dipindahkan ke samping untuk pengalaman pengisian yang lebih nyaman dan lega."
                        />
                    </div>

                    <div className="pt-4">
                        <button 
                            onClick={onClose}
                            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-emerald-500/20 active:scale-95 group uppercase tracking-widest text-xs"
                        >
                            Mulai Menjelajah <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>

                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 text-white rounded-full transition-colors"
                >
                    <X size={20} />
                </button>
            </div>
        </div>
    );
}

function FeatureItem({ icon, title, desc }) {
    return (
        <div className="flex gap-4 items-start group">
            <div className="mt-1 p-2 bg-slate-50 dark:bg-slate-900 rounded-xl group-hover:scale-110 transition-transform duration-300">
                {icon}
            </div>
            <div className="space-y-0.5">
                <h4 className="font-black text-slate-800 dark:text-slate-100 text-sm">{title}</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
            </div>
        </div>
    );
}
