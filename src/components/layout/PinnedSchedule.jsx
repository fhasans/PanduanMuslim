import React, { useState, useEffect } from 'react';
import { MapPin, Sun, Sunrise, Sunset, Moon, Loader2, Sparkles, LayoutGrid } from 'lucide-react';

export default function PinnedSchedule() {
    // Default location
    const [provinsi, setProvinsi] = useState('DKI Jakarta');
    const [kabkota, setKabkota] = useState('Kota Jakarta');

    
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const today = new Date();
    const todayDate = today.getDate();
    const thisMonth = today.getMonth() + 1;
    const thisYear = today.getFullYear();

    // Check Ramadhan (roughly 18 Feb 2026 - 19 Mar 2026 for 1447H)
    const isRamadhan = (thisYear === 2026 && ((thisMonth === 2 && todayDate >= 18) || (thisMonth === 3 && todayDate <= 19)));

    useEffect(() => {
        // Load default from local storage if any
        const savedProv = localStorage.getItem('user_provinsi');
        const savedKab = localStorage.getItem('user_kabkota');
        if (savedProv && savedKab) {
            setProvinsi(savedProv);
            setKabkota(savedKab);
        }
    }, []);

    useEffect(() => {
        setLoading(true);
        const url = isRamadhan 
            ? 'https://equran.id/api/v2/imsakiyah' 
            : 'https://equran.id/api/v2/shalat';
            
        const body = isRamadhan 
            ? { provinsi, kabkota }
            : { provinsi, kabkota, bulan: thisMonth, tahun: thisYear };

        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        })
        .then(r => r.json())
        .then(d => {
            const arr = isRamadhan ? d.data?.imsakiyah : d.data?.jadwal;
            if (arr) {
                const todayEntry = arr.find(j => parseInt(j.tanggal, 10) === todayDate);
                setData(todayEntry);
            }
            setLoading(false);
        })
        .catch(() => {
            setLoading(false);
        });
    }, [provinsi, kabkota, isRamadhan, todayDate, thisMonth, thisYear]);

    if (!data && !loading) return null;

    const items = isRamadhan ? [
        { label: 'Imsak', time: data?.imsak, icon: <Moon size={12} className="text-purple-400" /> },
        { label: 'Subuh', time: data?.subuh, icon: <Sunrise size={12} className="text-blue-400" /> },
        { label: 'Maghrib', time: data?.maghrib, icon: <Sunset size={12} className="text-red-400" /> },
    ] : [
        { label: 'Subuh', time: data?.subuh, icon: <Sunrise size={12} className="text-blue-400" /> },
        { label: 'Dzuhur', time: data?.dzuhur, icon: <Sun size={12} className="text-amber-400" /> },
        { label: 'Ashar', time: data?.ashar, icon: <Sun size={12} className="text-orange-400" /> },
        { label: 'Maghrib', time: data?.maghrib, icon: <Sunset size={12} className="text-red-400" /> },
        { label: 'Isya', time: data?.isya, icon: <Moon size={12} className="text-indigo-400" /> },
    ];

    return (
        <div className="bg-slate-900 border-b border-indigo-900 shadow-md relative z-40">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-2">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    {/* Info Side */}
                    <div className="flex justify-between items-center md:justify-start gap-4">
                        <div className="flex items-center gap-1.5 min-w-0">
                            {isRamadhan ? <Sparkles size={14} className="text-amber-300 shrink-0" /> : <MapPin size={14} className="text-emerald-400 shrink-0" />}
                            <div className="truncate text-xs font-semibold text-slate-200">
                                {isRamadhan ? 'Spesial Ramadhan' : 'Jadwal Shalat'}
                                <span className="text-slate-500 font-normal px-1 md:hidden">·</span>
                                <span className="text-slate-400 font-normal truncate hidden md:inline ml-1">- {kabkota}</span>
                                <span className="text-slate-400 font-normal truncate md:hidden">{kabkota.replace(/Kota |Kab. /g, '')}</span>
                            </div>
                        </div>
                    </div>

                    {/* Schedule Side */}
                    <div className="flex items-center justify-between md:justify-end gap-3 sm:gap-6 overflow-x-auto no-scrollbar pb-1 md:pb-0">
                        {loading ? (
                            <div className="flex items-center gap-2 text-slate-500 text-xs py-1">
                                <Loader2 size={12} className="animate-spin" /> Memuat...
                            </div>
                        ) : (
                            items.map(item => (
                                <div key={item.label} className="flex flex-col sm:flex-row items-center sm:gap-2 shrink-0">
                                    <div className="flex items-center gap-1">
                                        {item.icon}
                                        <span className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider">{item.label}</span>
                                    </div>
                                    <span className="text-sm font-bold text-white tabular-nums leading-none mt-0.5 sm:mt-0">{item.time || '-'}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
