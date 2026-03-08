import React, { useState, useEffect } from 'react';
import {
    MapPin, ChevronDown, Loader2, AlertCircle, Star,
    Clock, Sun, Sunrise, Sunset, Moon, RefreshCw
} from 'lucide-react';

const BASE = 'https://equran.id/api/v2/imsakiyah';

// Waktu fields with icons and labels
const WAKTU_CONFIG = [
    { key: 'imsak',   label: 'Imsak',   color: 'text-purple-600',  bg: 'bg-purple-50',  border: 'border-purple-200',  icon: <Moon size={14} /> },
    { key: 'subuh',   label: 'Subuh',   color: 'text-blue-600',    bg: 'bg-blue-50',    border: 'border-blue-200',    icon: <Sunrise size={14} /> },
    { key: 'dzuhur',  label: 'Dzuhur',  color: 'text-amber-600',   bg: 'bg-amber-50',   border: 'border-amber-200',   icon: <Sun size={14} /> },
    { key: 'ashar',   label: 'Ashar',   color: 'text-orange-600',  bg: 'bg-orange-50',  border: 'border-orange-200',  icon: <Clock size={14} /> },
    { key: 'maghrib', label: 'Maghrib', color: 'text-red-600',     bg: 'bg-red-50',     border: 'border-red-200',     icon: <Sunset size={14} /> },
    { key: 'isya',    label: 'Isya',    color: 'text-indigo-600',  bg: 'bg-indigo-50',  border: 'border-indigo-200',  icon: <Moon size={14} /> },
];

export default function ImsakiyahSection() {
    const [provinsi, setProvinsi] = useState([]);
    const [kabkota, setKabkota] = useState([]);
    const [jadwal, setJadwal] = useState([]);

    const [selectedProvinsi, setSelectedProvinsi] = useState('');
    const [selectedKabkota, setSelectedKabkota] = useState('');

    const [loadingProv, setLoadingProv] = useState(true);
    const [loadingKab, setLoadingKab] = useState(false);
    const [loadingJadwal, setLoadingJadwal] = useState(false);
    const [error, setError] = useState(null);

    // Today's date info for highlighting
    const today = new Date();
    const todayDate = today.getDate();
    const todayMonth = today.getMonth() + 1; // 1-indexed
    const todayYear = today.getFullYear();

    // Fetch provinces on mount
    useEffect(() => {
        fetch(`${BASE}/provinsi`)
            .then(r => r.json())
            .then(d => {
                setProvinsi(d.data || []);
                setLoadingProv(false);
            })
            .catch(() => {
                setError('Gagal memuat daftar provinsi.');
                setLoadingProv(false);
            });
    }, []);

    // Fetch kabkota when province changes
    useEffect(() => {
        if (!selectedProvinsi) { setKabkota([]); setSelectedKabkota(''); setJadwal([]); return; }
        setLoadingKab(true);
        setKabkota([]);
        setSelectedKabkota('');
        setJadwal([]);
        fetch(`${BASE}/kabkota`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ provinsi: selectedProvinsi }),
        })
            .then(r => r.json())
            .then(d => {
                setKabkota(d.data || []);
                setLoadingKab(false);
            })
            .catch(() => {
                setError('Gagal memuat daftar kota.');
                setLoadingKab(false);
            });
    }, [selectedProvinsi]);

    // Fetch schedule when kabkota changes
    useEffect(() => {
        if (!selectedProvinsi || !selectedKabkota) { setJadwal([]); return; }
        setLoadingJadwal(true);
        setJadwal([]);
        setError(null);
        fetch(`${BASE}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ provinsi: selectedProvinsi, kabkota: selectedKabkota }),
        })
            .then(r => r.json())
            .then(d => {
                setJadwal(d.data?.imsakiyah || []);
                setLoadingJadwal(false);
            })
            .catch(() => {
                setError('Gagal memuat jadwal imsakiyah.');
                setLoadingJadwal(false);
            });
    }, [selectedKabkota]);

    // Find today's entry in jadwal (match by date number)
    const todayEntry = jadwal.find(j => {
        // j.tanggal might be like "1" or "01" or a date string
        const dayNum = parseInt(j.tanggal, 10);
        return dayNum === todayDate;
    });

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="bg-gradient-to-r from-violet-700 to-indigo-700 rounded-2xl p-5 text-white">
                <div className="flex items-center gap-2 mb-1">
                    <Star size={16} className="text-yellow-300 fill-yellow-300" />
                    <span className="text-xs font-bold uppercase tracking-widest text-violet-200">Ramadhan 1447 H</span>
                </div>
                <h3 className="text-xl font-extrabold">Jadwal Imsakiyah</h3>
                <p className="text-violet-200 text-xs mt-0.5">Data untuk 517 kab/kota di Indonesia · via Equran.id</p>
            </div>

            {/* Location selectors */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-sm">
                <div className="flex items-center gap-2 text-slate-600 mb-1">
                    <MapPin size={15} className="text-violet-500" />
                    <span className="text-sm font-semibold">Pilih Lokasi Anda</span>
                </div>

                {/* Province select */}
                <div className="relative">
                    <select
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-4 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 appearance-none text-slate-700 font-medium disabled:opacity-50"
                        value={selectedProvinsi}
                        onChange={e => setSelectedProvinsi(e.target.value)}
                        disabled={loadingProv}
                    >
                        <option value="">{loadingProv ? 'Memuat provinsi...' : '-- Pilih Provinsi --'}</option>
                        {provinsi.map(p => (
                            <option key={p} value={p}>{p}</option>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">
                        {loadingProv ? <Loader2 size={15} className="animate-spin" /> : <ChevronDown size={15} />}
                    </div>
                </div>

                {/* Kabkota select */}
                <div className="relative">
                    <select
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-4 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 appearance-none text-slate-700 font-medium disabled:opacity-50"
                        value={selectedKabkota}
                        onChange={e => setSelectedKabkota(e.target.value)}
                        disabled={!selectedProvinsi || loadingKab}
                    >
                        <option value="">
                            {loadingKab ? 'Memuat kota...' : !selectedProvinsi ? '-- Pilih provinsi dahulu --' : '-- Pilih Kabupaten/Kota --'}
                        </option>
                        {kabkota.map(k => (
                            <option key={k} value={k}>{k}</option>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">
                        {loadingKab ? <Loader2 size={15} className="animate-spin" /> : <ChevronDown size={15} />}
                    </div>
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-xl p-4">
                    <AlertCircle size={18} className="text-red-400 shrink-0" />
                    <p className="text-sm text-red-600">{error}</p>
                </div>
            )}

            {/* Loading jadwal */}
            {loadingJadwal && (
                <div className="flex flex-col items-center justify-center py-14 text-slate-400">
                    <Loader2 size={32} className="animate-spin mb-3 text-violet-400" />
                    <p className="text-sm font-medium">Memuat jadwal imsakiyah...</p>
                </div>
            )}

            {/* Today's highlight card */}
            {!loadingJadwal && todayEntry && (
                <div className="bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl p-5 text-white shadow-lg">
                    <div className="flex items-center gap-2 mb-3">
                        <Star size={14} className="text-yellow-300 fill-yellow-300" />
                        <span className="text-xs font-bold uppercase tracking-widest text-violet-200">Hari Ini — {todayDate}/{todayMonth}/{todayYear}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        {WAKTU_CONFIG.map(w => (
                            <div key={w.key} className="bg-white/15 rounded-xl p-2.5 text-center backdrop-blur-sm">
                                <div className="flex items-center justify-center gap-1 text-violet-200 mb-1">
                                    {w.icon}
                                    <span className="text-[10px] font-bold uppercase">{w.label}</span>
                                </div>
                                <p className="font-extrabold text-lg leading-none">{todayEntry[w.key] || '-'}</p>
                            </div>
                        ))}
                    </div>
                    <p className="text-[11px] text-violet-200 mt-3 text-center">
                        Imsak: <strong className="text-white">{todayEntry.imsak}</strong> · Buka: <strong className="text-white">{todayEntry.maghrib}</strong>
                    </p>
                </div>
            )}

            {/* Full schedule table */}
            {!loadingJadwal && jadwal.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                        <h4 className="font-bold text-slate-700 text-sm">
                            Jadwal Lengkap — {selectedKabkota}
                        </h4>
                        <span className="text-xs text-violet-500 font-semibold bg-violet-50 px-2 py-0.5 rounded-full">
                            30 Hari
                        </span>
                    </div>

                    {/* Mobile: card list */}
                    <div className="md:hidden divide-y divide-slate-50">
                        {jadwal.map((j, idx) => {
                            const dayNum = parseInt(j.tanggal, 10);
                            const isToday = dayNum === todayDate;
                            return (
                                <div key={idx} className={`p-4 ${isToday ? 'bg-violet-50 border-l-4 border-l-violet-500' : ''}`}>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${isToday ? 'bg-violet-500 text-white' : 'bg-slate-100 text-slate-600'}`}>
                                                {j.tanggal}
                                            </div>
                                            {isToday && <span className="text-[10px] font-bold bg-violet-500 text-white px-2 py-0.5 rounded-full">Hari Ini</span>}
                                        </div>
                                        <span className="text-xs text-slate-400">{j.tanggalHijriah || ''}</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-1.5">
                                        {WAKTU_CONFIG.map(w => (
                                            <div key={w.key} className={`${w.bg} ${w.border} border rounded-lg p-1.5 text-center`}>
                                                <p className={`text-[10px] font-bold ${w.color} uppercase`}>{w.label}</p>
                                                <p className="text-xs font-semibold text-slate-700 mt-0.5">{j[w.key] || '-'}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Desktop: table */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100">
                                    <th className="text-left py-3 px-4 font-semibold text-slate-500 text-xs">Tgl</th>
                                    {WAKTU_CONFIG.map(w => (
                                        <th key={w.key} className={`py-3 px-3 font-bold text-xs ${w.color}`}>
                                            <div className="flex items-center justify-center gap-1">{w.icon}{w.label}</div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {jadwal.map((j, idx) => {
                                    const dayNum = parseInt(j.tanggal, 10);
                                    const isToday = dayNum === todayDate;
                                    return (
                                        <tr key={idx} className={`border-b border-slate-50 transition-colors ${isToday ? 'bg-violet-50 font-bold' : 'hover:bg-slate-50/60'}`}>
                                            <td className="py-2.5 px-4">
                                                <div className="flex items-center gap-2">
                                                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isToday ? 'bg-violet-500 text-white' : 'text-slate-500'}`}>
                                                        {j.tanggal}
                                                    </span>
                                                    {isToday && <span className="text-[9px] font-bold text-violet-500 bg-violet-100 px-1.5 rounded-full">Hari Ini</span>}
                                                </div>
                                            </td>
                                            {WAKTU_CONFIG.map(w => (
                                                <td key={w.key} className={`py-2.5 px-3 text-center ${isToday ? w.color : 'text-slate-600'}`}>
                                                    {j[w.key] || '-'}
                                                </td>
                                            ))}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Empty state */}
            {!loadingJadwal && !loadingKab && selectedKabkota && jadwal.length === 0 && !error && (
                <div className="text-center py-10 text-slate-400">
                    <RefreshCw size={28} className="mx-auto mb-2" />
                    <p className="text-sm">Tidak ada data jadwal untuk lokasi ini.</p>
                </div>
            )}

            {/* Prompt state */}
            {!selectedProvinsi && !loadingProv && (
                <div className="text-center py-10 bg-violet-50/50 rounded-2xl border border-dashed border-violet-200">
                    <MapPin size={28} className="mx-auto mb-2 text-violet-300" />
                    <p className="text-sm text-violet-500 font-medium">Pilih provinsi dan kota di atas</p>
                    <p className="text-xs text-violet-400 mt-1">untuk melihat jadwal imsakiyah Ramadhan 1447 H</p>
                </div>
            )}
        </div>
    );
}
