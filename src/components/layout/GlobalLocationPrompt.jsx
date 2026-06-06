import React, { useState, useEffect } from 'react';
import { MapPin, ChevronDown, Loader2, Compass } from 'lucide-react';

const BASE_API = 'https://equran.id/api/v2/shalat';

export default function GlobalLocationPrompt({ onComplete }) {
    const [provinsi, setProvinsi] = useState([]);
    const [kabkota, setKabkota] = useState([]);
    
    const [selectedProvinsi, setSelectedProvinsi] = useState('');
    const [selectedKabkota, setSelectedKabkota] = useState('');
    
    const [loadingProv, setLoadingProv] = useState(true);
    const [loadingKab, setLoadingKab] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    
    useEffect(() => {
        // Fetch provinsi
        fetch(`${BASE_API}/provinsi`)
            .then(r => r.json())
            .then(data => {
                setProvinsi(data.data || []);
                setLoadingProv(false);
            })
            .catch(err => {
                console.error(err);
                setLoadingProv(false);
            });
    }, []);

    useEffect(() => {
        if (selectedProvinsi) {
            setLoadingKab(true);
            setSelectedKabkota('');
            fetch(`${BASE_API}/kabkota`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ provinsi: selectedProvinsi }),
            })
            .then(r => r.json())
            .then(data => {
                setKabkota(data.data || []);
                setLoadingKab(false);
            })
            .catch(err => {
                console.error(err);
                setLoadingKab(false);
            });
        } else {
            setKabkota([]);
            setSelectedKabkota('');
        }
    }, [selectedProvinsi]);

    const handleSave = () => {
        if (!selectedProvinsi || !selectedKabkota) return;
        
        setIsSaving(true);
        // Save to localStorage
        localStorage.setItem('user_provinsi', selectedProvinsi);
        localStorage.setItem('user_kabkota', selectedKabkota);
        
        // Reload to apply globally
        setTimeout(() => {
            window.location.reload();
        }, 500);
    };

    return (
        <div className="fixed inset-0 z-[200] bg-slate-950 flex flex-col items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8 border border-slate-100 dark:border-slate-800 animate-in zoom-in-95 duration-500 delay-100">
                <div className="text-center mb-8">
                    <div className="mx-auto w-20 h-20 bg-emerald-50 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-6 text-emerald-600 dark:text-emerald-400 relative">
                        <MapPin size={40} className="absolute z-10 animate-bounce" />
                        <Compass size={60} className="opacity-20 animate-spin-slow" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-2">
                        Pilih Lokasi Anda
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                        Pilih provinsi dan kota/kabupaten Anda agar jadwal sholat dan waktu pengingat bisa menyesuaikan secara akurat.
                    </p>
                </div>

                <div className="space-y-4 mb-8">
                    <div className="relative">
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Provinsi</label>
                        <div className="relative">
                            <select
                                value={selectedProvinsi}
                                onChange={e => setSelectedProvinsi(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3.5 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none text-slate-800 dark:text-slate-100 font-medium"
                                disabled={loadingProv}
                            >
                                <option value="" disabled>Pilih Provinsi...</option>
                                {provinsi.map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">
                                {loadingProv ? <Loader2 size={16} className="animate-spin" /> : <ChevronDown size={16} />}
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Kota / Kabupaten</label>
                        <div className="relative">
                            <select
                                value={selectedKabkota}
                                onChange={e => setSelectedKabkota(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3.5 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none text-slate-800 dark:text-slate-100 font-medium"
                                disabled={!selectedProvinsi || loadingKab}
                            >
                                <option value="" disabled>Pilih Kota/Kabupaten...</option>
                                {kabkota.map(k => <option key={k} value={k}>{k}</option>)}
                            </select>
                            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">
                                {loadingKab ? <Loader2 size={16} className="animate-spin" /> : <ChevronDown size={16} />}
                            </div>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleSave}
                    disabled={!selectedProvinsi || !selectedKabkota || isSaving}
                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2"
                >
                    {isSaving ? (
                        <><Loader2 size={20} className="animate-spin" /> Menyimpan...</>
                    ) : (
                        'Lanjutkan ke Aplikasi'
                    )}
                </button>
            </div>
        </div>
    );
}
