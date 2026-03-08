import React from 'react';

export default function ModeButton({ icon, label, active, onClick }) {
    return (
        <button onClick={onClick} className={`flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 py-3 px-2 rounded-xl text-xs md:text-sm font-bold transition-all ${active ? 'bg-white text-emerald-700 shadow border-b-2 border-emerald-500' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
            }`}>
            {icon} <span>{label}</span>
        </button>
    );
}
