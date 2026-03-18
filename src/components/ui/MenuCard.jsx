import React from 'react';

export default function MenuCard({ icon, title, bg, onClick }) {
    return (
        <button onClick={onClick} className={`${bg} dark:bg-slate-800 border dark:border-slate-700 border-white/50 shadow-sm hover:shadow-md dark:shadow-none transition-all rounded-2xl p-5 flex flex-col items-center justify-center text-center gap-3 aspect-square active:scale-95`}>
            <div className="bg-white dark:bg-slate-700 p-3 rounded-full shadow-sm dark:shadow-none transition-colors">
                {icon}
            </div>
            <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm transition-colors">{title}</span>
        </button>
    );
}
