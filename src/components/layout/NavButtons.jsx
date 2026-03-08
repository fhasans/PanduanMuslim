import React from 'react';

export function DesktopNavButton({ icon, label, active, onClick }) {
    return (
        <button onClick={onClick} className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${active ? 'bg-emerald-100 text-emerald-800' : 'text-slate-500 hover:bg-slate-100 hover:text-emerald-600'}`}>
            {icon} <span>{label}</span>
        </button>
    );
}

export function MobileNavButton({ icon, label, active, onClick }) {
    return (
        <button onClick={onClick} className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${active ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}>
            <div className={`${active ? 'bg-emerald-100' : 'bg-transparent'} p-1.5 rounded-xl transition-all`}>
                {icon}
            </div>
            <span className="text-[10px] font-medium">{label}</span>
        </button>
    );
}
