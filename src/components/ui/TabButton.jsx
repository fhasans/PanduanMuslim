import React from 'react';

export default function TabButton({ label, active, onClick }) {
    return (
        <button onClick={onClick} className={`flex-1 min-w-max py-2.5 px-4 text-sm font-semibold rounded-lg transition-all ${active ? 'bg-emerald-100 text-emerald-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}>
            {label}
        </button>
    );
}
