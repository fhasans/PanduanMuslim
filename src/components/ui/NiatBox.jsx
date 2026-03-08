import React, { useState } from 'react';
import { User, Users, Crown } from 'lucide-react';

export default function NiatBox({ 
    sendiri = "", 
    imam = "", 
    makmum = "", 
    artiSendiri = "",
    artiImam = "",
    artiMakmum = ""
}) {
    const roles = [];
    if (sendiri) roles.push({ id: 'sendiri', label: 'Sendiri', icon: <User size={14} />, text: sendiri, arti: artiSendiri });
    if (imam) roles.push({ id: 'imam', label: 'Imam', icon: <Crown size={14} />, text: imam, arti: artiImam });
    if (makmum) roles.push({ id: 'makmum', label: 'Makmum', icon: <Users size={14} />, text: makmum, arti: artiMakmum });

    const [activeRole, setActiveRole] = useState(roles[0]?.id || 'sendiri');
    const current = roles.find(r => r.id === activeRole) || roles[0];

    if (roles.length <= 1 && !sendiri) return null;

    return (
        <div className="space-y-4">
            {roles.length > 1 && (
                <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
                    {roles.map(role => (
                        <button
                            key={role.id}
                            onClick={() => setActiveRole(role.id)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                activeRole === role.id 
                                ? 'bg-white text-emerald-600 shadow-sm' 
                                : 'text-slate-500 hover:text-slate-700'
                            }`}
                        >
                            {role.icon}
                            {role.label}
                        </button>
                    ))}
                </div>
            )}

            <div className="bg-white/60 p-4 rounded-xl border-l-4 border-emerald-500 shadow-sm">
                <p className="font-bold text-emerald-900 text-lg leading-relaxed mb-2">
                    "{current.text}"
                </p>
                <p className="text-slate-600 text-sm italic">
                    Artinya: "{current.arti}"
                </p>
            </div>
        </div>
    );
}
