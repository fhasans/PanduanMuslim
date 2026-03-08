import React, { useState, useEffect } from 'react';
import {
    MapPin, ChevronDown, Loader2, AlertCircle, Calendar,
    Clock, Sun, Sunrise, Sunset, Moon, RefreshCw, Star
} from 'lucide-react';

const BASE = 'https://equran.id/api/v2/shalat';

const WAKTU_CONFIG = [
    { key: 'imsak',   label: 'Imsak',   color: 'text-slate-500',   bg: 'bg-slate-50',     icon: <Moon size={14} /> },
    { key: 'subuh',   label: 'Subuh',   color: 'text-blue-600',    bg: 'bg-blue-50',      icon: <Sunrise size={14} /> },
    { key: 'dzuhur',  label: 'Dzuhur',  color: 'text-amber-600',   bg: 'bg-amber-50',     icon: <Sun size={14} /> },
    { key: 'ashar',   label: 'Ashar',   color: 'text-orange-600',  bg: 'bg-orange-50',    icon: <Clock size={14} /> },
    { key: 'maghrib', label: 'Maghrib', color: 'text-red-600',     bg: 'bg-red-50',       icon: <Sunset size={14} /> },
    { key: 'isya',    label: 'Isya',    color: 'text-indigo-600',  bg: 'bg-indigo-50',    icon: <Moon size={14} /> },
];

const BULAN = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export default function JadwalSholatSection() {
    const today = new Date();
    const todayDate = today.getDate();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();

    const [provinsi, setProvinsi] = useState([]);
    const [kabkota, setKabkota] = useState([]);
    const [jadwal, setJadwal] = useState([]);

    const [selectedProvinsi, setSelectedProvinsi] = useState('');
    const [selectedKabkota, setSelectedKabkota] = useState('');
    const [selectedBulan, setSelectedBulan] = useState(currentMonth);
    const [selectedTahun, setSelectedTahun] = useState(currentYear);

    const [loadingProv, setLoadingProv] = useState(true);
    const [loadingKab, setLoadingKab] = useState(false);
    const [loadingJadwal, setLoadingJadwal] = useState(false);
    const [error, setError] = useState(null);

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

    // Fetch schedule
    useEffect(() => {
        if (!selectedProvinsi || !selectedKabkota) { setJadwal([]); return; }
        setLoadingJadwal(true);
        setJadwal([]);
        setError(null);
        fetch(`${BASE}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                provinsi: selectedProvinsi, 
                kabkota: selectedKabkota, 
                bulan: parseInt(selectedBulan), 
                tahun: parseInt(selectedTahun) 
            }),
        })
            .then(r => r.json())
            .then(d => {
                setJadwal(d.data?.jadwal || []);
                setLoadingJadwal(false);
            })
            .catch(() => {
                setError('Gagal memuat jadwal shalat.');
                setLoadingJadwal(false);
            });
    }, [selectedKabkota, selectedBulan, selectedTahun]);

    const isCurrentViewToday = parseInt(selectedBulan) === currentMonth && parseInt(selectedTahun) === currentYear;

    // Find today's entry
    const todayEntry = isCurrentViewToday ? jadwal.find(j => {
        const dayNum = parseInt(j.tanggal, 10);
        return dayNum === todayDate;
    }) : null;

    return (
        <div className="space-y-4 p-4 md:p-0">
            {/* Header */}
            <div className="bg-gradient-to-r from-teal-700 to-emerald-700 rounded-2xl p-5 text-white shadow-md">
                <div className="flex items-center gap-2 mb-1">
                    <Calendar size={16} className="text-emerald-200" />
                    <span className="text-xs font-bold uppercase tracking-widest text-emerald-100">Jadwal Shalat Bulanan</span>
                </div>
                <h3 className="text-xl md:text-2xl font-extrabold mb-1">Jadwal Shalat Nusantara</h3>
                <p className="text-emerald-100 text-xs">Pilih lokasi dan bulan untuk melihat jadwal shalat 5 waktu.</p>
            </div>

            {/* Selectors */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-sm">
                <div className="flex items-center gap-2 text-slate-600 mb-1">
                    <MapPin size={15} className="text-teal-600" />
                    <span className="text-sm font-semibold">Tentukan Lokasi & Waktu</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="relative">
                        <select
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-4 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 appearance-none text-slate-700 font-medium"
                            value={selectedProvinsi}
                            onChange={e => setSelectedProvinsi(e.target.value)}
                            disabled={loadingProv}
                        >
                            <option value="">{loadingProv ? 'Memuat...' : '-- Provinsi --'}</option>
                            {provinsi.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">
                            {loadingProv ? <Loader2 size={15} className="animate-spin" /> : <ChevronDown size={15} />}
                        </div>
                    </div>

                    <div className="relative">
                        <select
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-4 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 appearance-none text-slate-700 font-medium"
                            value={selectedKabkota}
                            onChange={e => setSelectedKabkota(e.target.value)}
                            disabled={!selectedProvinsi || loadingKab}
                        >
                            <option value="">{loadingKab ? 'Memuat...' : !selectedProvinsi ? '-- Kota --' : '-- Pilih Kota --'}</option>
                            {kabkota.map(k => <option key={k} value={k}>{k}</option>)}
                        </select>
                        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">
                            {loadingKab ? <Loader2 size={15} className="animate-spin" /> : <ChevronDown size={15} />}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                        <select
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-4 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 appearance-none text-slate-700 font-medium"
                            value={selectedBulan}
                            onChange={e => setSelectedBulan(e.target.value)}
                        >
                            {BULAN.map((b, i) => <option key={b} value={i + 1}>{b}</option>)}
                        </select>
                        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">
                            <ChevronDown size={15} />
                        </div>
                    </div>

                    <div className="relative">
                        <select
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-4 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 appearance-none text-slate-700 font-medium"
                            value={selectedTahun}
                            onChange={e => setSelectedTahun(e.target.value)}
                        >
                            {[currentYear-1, currentYear, currentYear+1].map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">
                            <ChevronDown size={15} />
                        </div>
                    </div>
                </div>
            </div>

            {error && (
                <div className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-xl p-4">
                    <AlertCircle size={18} className="text-red-400 shrink-0" />
                    <p className="text-sm text-red-600">{error}</p>
                </div>
            )}

            {loadingJadwal && (
                <div className="flex flex-col items-center justify-center py-14 text-slate-400">
                    <Loader2 size={32} className="animate-spin mb-3 text-teal-500" />
                    <p className="text-sm font-medium">Memuat jadwal {BULAN[selectedBulan-1]}...</p>
                </div>
            )}

            {!loadingJadwal && todayEntry && (
                <div className="bg-gradient-to-br from-teal-600 to-emerald-600 rounded-2xl p-5 text-white shadow-lg">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <Star size={14} className="text-yellow-300 fill-yellow-300" />
                            <span className="text-xs font-bold uppercase tracking-widest text-teal-100">Shalat Hari Ini</span>
                        </div>
                        <span className="text-xs font-semibold bg-white/20 px-2 py-0.5 rounded text-white">{todayDate} {BULAN[selectedBulan-1]} {selectedTahun}</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {WAKTU_CONFIG.map(w => (
                            <div key={w.key} className="bg-white/15 rounded-xl p-2.5 text-center backdrop-blur-sm border border-white/10">
                                <div className="flex items-center justify-center gap-1 text-teal-100 mb-1">
                                    {w.icon}
                                    <span className="text-[10px] font-bold uppercase tracking-wide">{w.label}</span>
                                </div>
                                <p className="font-extrabold text-xl leading-none">{todayEntry[w.key] || '-'}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {!loadingJadwal && jadwal.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                        <h4 className="font-bold text-slate-700 text-sm">
                            {selectedKabkota} — {BULAN[selectedBulan-1]} {selectedTahun}
                        </h4>
                    </div>

                    <div className="md:hidden divide-y divide-slate-50">
                        {jadwal.map((j, idx) => {
                            const dayNum = parseInt(j.tanggal, 10);
                            const isToday = isCurrentViewToday && dayNum === todayDate;
                            return (
                                <div key={idx} className={`p-4 ${isToday ? 'bg-teal-50/50 border-l-4 border-l-teal-500' : ''}`}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isToday ? 'bg-teal-500 text-white' : 'bg-slate-200 text-slate-600'}`}>
                                            {j.tanggal}
                                        </div>
                                        <span className={`text-xs font-medium ${isToday ? 'text-teal-600' : 'text-slate-400'}`}>
                                            {j.hari}
                                        </span>
                                    </div>
                                    <div className="flex overflow-x-auto gap-2 pb-1 no-scrollbar">
                                        {WAKTU_CONFIG.map(w => (
                                            <div key={w.key} className={`shrink-0 border rounded-lg p-2 text-center min-w-[60px] ${isToday ? 'bg-white border-teal-100' : 'bg-slate-50 border-slate-100'}`}>
                                                <p className={`text-[10px] font-bold ${w.color} uppercase`}>{w.label}</p>
                                                <p className="text-xs font-bold text-slate-700 mt-0.5">{j[w.key] || '-'}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100">
                                    <th className="text-left py-3 px-4 font-semibold text-slate-500 text-xs w-20">Tgl</th>
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
                                    const isToday = isCurrentViewToday && dayNum === todayDate;
                                    return (
                                        <tr key={idx} className={`border-b border-slate-50 transition-colors ${isToday ? 'bg-teal-50 border-l-4 border-l-teal-500 font-bold' : 'hover:bg-slate-50/60'}`}>
                                            <td className="py-2.5 px-4 tabular-nums">
                                                <div className="flex items-center gap-2">
                                                    <span className={`min-w-[20px] text-center ${isToday ? 'text-teal-700' : 'text-slate-600'}`}>{j.tanggal}</span>
                                                    <span className="text-[10px] text-slate-400 font-medium">{j.hari.substring(0,3)}</span>
                                                </div>
                                            </td>
                                            {WAKTU_CONFIG.map(w => (
                                                <td key={w.key} className={`py-2.5 px-3 text-center tabular-nums ${isToday ? 'text-teal-900' : 'text-slate-600'}`}>
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
            
            {!loadingJadwal && !loadingKab && selectedKabkota && jadwal.length === 0 && !error && (
                <div className="text-center py-10 text-slate-400">
                    <RefreshCw size={28} className="mx-auto mb-2" />
                    <p className="text-sm">Tidak ada data jadwal untuk lokasi ini.</p>
                </div>
            )}
        </div>
    );
}
