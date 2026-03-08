import React from 'react';

export default function MenuCard({ icon, title, bg, onClick }) {
    return (
        <button onClick={onClick} className={`${bg} border border-white/50 shadow-sm hover:shadow-md transition-all rounded-2xl p-5 flex flex-col items-center justify-center text-center gap-3 aspect-square active:scale-95`}>
            <div className="bg-white p-3 rounded-full shadow-sm">
                {icon}
            </div>
            <span className="font-semibold text-slate-800 text-sm">{title}</span>
        </button>
    );
}
