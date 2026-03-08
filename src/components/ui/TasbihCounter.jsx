import React, { useState } from 'react';
import { RotateCcw, Plus } from 'lucide-react';

export default function TasbihCounter({ target = 33, label = "" }) {
    const [count, setCount] = useState(0);

    const isInfinite = target === null;

    const handleIncrement = (e) => {
        e.stopPropagation();
        if (isInfinite || count < target) {
            setCount(prev => prev + 1);
            // Haptic feedback if available
            if (window.navigator.vibrate) {
                window.navigator.vibrate(50);
            }
        }
    };

    const handleReset = (e) => {
        e.stopPropagation();
        setCount(0);
        if (window.navigator.vibrate) {
            window.navigator.vibrate(80);
        }
    };

    const isFinished = !isInfinite && count >= target;

    return (
        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-100/50">
            <button
                onClick={handleIncrement}
                disabled={isFinished}
                className={`flex-1 flex items-center justify-between px-4 py-3 rounded-2xl transition-all active:scale-[0.98] ${
                    isFinished 
                    ? 'bg-emerald-100 text-emerald-700 font-bold' 
                    : 'bg-emerald-600 text-white shadow-lg shadow-emerald-200 active:bg-emerald-700'
                }`}
            >
                <div className="flex flex-col items-start translate-y-0.5">
                    <span className="text-[10px] uppercase tracking-wider opacity-80 font-bold">
                        {label || (isInfinite ? "Ketuk Hitung Sebanyaknya" : "Ketuk untuk Menghitung")}
                    </span>
                    <span className="text-sm font-extrabold">
                        {isFinished ? "Selesai" : isInfinite ? "Banyaknya bacaan" : `Bacaan ke-${count + 1}`}
                    </span>
                </div>
                
                <div className="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-xl backdrop-blur-sm">
                    {!isFinished && <Plus size={16} strokeWidth={3} />}
                    <span className="text-xl font-black">{count}</span>
                    {!isInfinite && <span className="text-xs font-bold opacity-60">/ {target}</span>}
                </div>
            </button>

            <button
                onClick={handleReset}
                className="p-4 rounded-2xl bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors active:rotate-180 duration-500"
                title="Reset Hitungan"
            >
                <RotateCcw size={20} />
            </button>
        </div>
    );
}
