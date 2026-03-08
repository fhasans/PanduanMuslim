import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function AccordionCard({ title, subtitle, icon, defaultOpen = false, children, extraBadge }) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full text-left p-5 flex justify-between items-center transition-colors ${isOpen ? 'bg-slate-50/50' : 'hover:bg-slate-50'}`}
            >
                <div className="flex items-center gap-3">
                    {icon && <div className="bg-emerald-100 text-emerald-700 w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0">{icon}</div>}
                    <div>
                        <h4 className="font-bold text-slate-800 flex items-center gap-2">
                            {title}
                            {extraBadge}
                        </h4>
                        {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
                    </div>
                </div>
                <div className="shrink-0 ml-4 text-slate-400">
                    {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
            </button>

            {isOpen && (
                <div className="p-5 border-t border-slate-100 animate-in fade-in slide-in-from-top-2 duration-200">
                    {children}
                </div>
            )}
        </div>
    );
}
