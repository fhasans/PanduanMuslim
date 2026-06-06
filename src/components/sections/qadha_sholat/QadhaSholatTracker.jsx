import React, { useState, useEffect } from 'react';
import { X, Lock, Users, PlusCircle, UserCircle2, Loader2, MapPin, ChevronDown, KeyRound, User, Clock } from 'lucide-react';
import { supabase } from '../../../lib/supabase.js';
import QadhaSholatDashboard from './QadhaSholatDashboard.jsx';

const BASE_API = 'https://equran.id/api/v2/shalat';

export default function QadhaSholatTracker({ onClose }) {
    const [activeUser, setActiveUser] = useState(null);
    const [isRegistering, setIsRegistering] = useState(false);
    
    // Auth State
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Registration Location State
    const [provinsi, setProvinsi] = useState([]);
    const [kabkota, setKabkota] = useState([]);
    const [selectedProvinsi, setSelectedProvinsi] = useState(() => localStorage.getItem('user_provinsi') || '');
    const [selectedKabkota, setSelectedKabkota] = useState(() => localStorage.getItem('user_kabkota') || '');
    const [loadingProv, setLoadingProv] = useState(false);
    const [loadingKab, setLoadingKab] = useState(false);

    // Check localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('qadha_sholat_active_user');
        if (saved) {
            try {
                setActiveUser(JSON.parse(saved));
            } catch (e) {}
        }
    }, []);

    useEffect(() => {
        if (isRegistering) {
            fetchProvinsi();
        }
    }, [isRegistering]);

    useEffect(() => {
        if (selectedProvinsi) {
            fetchKabkota(selectedProvinsi);
        } else {
            setKabkota([]);
            setSelectedKabkota('');
        }
    }, [selectedProvinsi]);

    const fetchProvinsi = async () => {
        setLoadingProv(true);
        try {
            const res = await fetch(`${BASE_API}/provinsi`);
            const data = await res.json();
            setProvinsi(data.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingProv(false);
        }
    };

    const fetchKabkota = async (prov) => {
        setLoadingKab(true);
        setSelectedKabkota('');
        try {
            const res = await fetch(`${BASE_API}/kabkota`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ provinsi: prov }),
            });
            const data = await res.json();
            setKabkota(data.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingKab(false);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { data, error: dbError } = await supabase
                .from('qadha_sholat_users')
                .select('*')
                .eq('username', username)
                .single();

            if (dbError || !data) {
                setError('Username tidak ditemukan.');
                setLoading(false);
                return;
            }

            if (data.password !== password) {
                setError('Password salah.');
                setLoading(false);
                return;
            }

            // Update last_active_at
            const nowIso = new Date().toISOString();
            await supabase
                .from('qadha_sholat_users')
                .update({ last_active_at: nowIso })
                .eq('id', data.id);

            data.last_active_at = nowIso;
            localStorage.setItem('qadha_sholat_active_user', JSON.stringify(data));
            setActiveUser(data);
        } catch (err) {
            console.error(err);
            setError('Terjadi kesalahan sistem.');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        if (!username || !password || !selectedProvinsi || !selectedKabkota) {
            setError('Semua form wajib diisi.');
            return;
        }

        setLoading(true);
        try {
            // Check if username exists
            const { data: existing } = await supabase
                .from('qadha_sholat_users')
                .select('id')
                .eq('username', username)
                .single();

            if (existing) {
                setError('Username sudah dipakai.');
                setLoading(false);
                return;
            }

            const nowIso = new Date().toISOString();
            const { data, error: insertError } = await supabase
                .from('qadha_sholat_users')
                .insert([{
                    username,
                    password,
                    provinsi: selectedProvinsi,
                    kabkota: selectedKabkota,
                    last_active_at: nowIso
                }])
                .select()
                .single();

            if (insertError) throw insertError;

            localStorage.setItem('qadha_sholat_active_user', JSON.stringify(data));
            setActiveUser(data);
            setIsRegistering(false);
        } catch (err) {
            console.error(err);
            setError('Gagal mendaftar. Coba username lain.');
        } finally {
            setLoading(false);
        }
    };

    if (activeUser) {
        return (
            <div className="fixed inset-0 z-[100] bg-slate-50 dark:bg-slate-950 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="bg-slate-900 border-b border-slate-800 text-white p-4 shadow-md flex items-center justify-between relative z-10 shrink-0">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-indigo-500/20 rounded-lg">
                            <Clock size={18} className="text-indigo-400" />
                        </div>
                        <span className="font-bold tracking-wide">Qadha Sholat</span>
                    </div>
                    <button onClick={() => {
                        localStorage.removeItem('qadha_sholat_active_user');
                        setActiveUser(null);
                    }} className="p-2 hover:bg-slate-800 rounded-full transition-colors active:scale-95 text-xs text-red-400 font-bold">
                        Logout
                    </button>
                    <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors active:scale-95">
                        <X size={20} className="text-slate-300" />
                    </button>
                </div>
                <QadhaSholatDashboard user={activeUser} onBack={onClose} />
            </div>
        );
    }


    return (
        <div className="fixed inset-0 z-[100] bg-slate-50 dark:bg-slate-950 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Header */}
            <div className="bg-slate-900 border-b border-slate-800 text-white p-4 shadow-md flex items-center justify-between relative z-10 shrink-0">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-indigo-500/20 rounded-lg">
                        <Clock size={18} className="text-indigo-400" />
                    </div>
                    <span className="font-bold tracking-wide">Qadha Sholat</span>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-slate-800 rounded-full transition-colors active:scale-95"
                >
                    <X size={20} className="text-slate-300" />
                </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 flex items-center justify-center">
                <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-8 border border-slate-100 dark:border-slate-800">
                    
                    <div className="text-center mb-8">
                        <div className="mx-auto w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mb-4 text-indigo-600 dark:text-indigo-400">
                            <Users size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                            {isRegistering ? 'Buat Akun' : 'Selamat Datang'}
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            {isRegistering ? 'Daftar untuk melacak qadha sholat' : 'Masuk untuk melacak qadha sholat'}
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-xl text-red-600 dark:text-red-400 text-sm font-medium text-center">
                            {error}
                        </div>
                    )}

                    {isRegistering ? (
                        <form onSubmit={handleRegister} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Username</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User size={16} className="text-slate-400" />
                                    </div>
                                    <input 
                                        type="text" 
                                        value={username}
                                        onChange={e => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 dark:text-slate-100" 
                                        placeholder="Ketik username (tanpa spasi)"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <KeyRound size={16} className="text-slate-400" />
                                    </div>
                                    <input 
                                        type="password" 
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 dark:text-slate-100" 
                                        placeholder="Ketik password"
                                    />
                                </div>
                            </div>

                            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Lokasi Jadwal Sholat</label>
                                    <button 
                                        type="button"
                                        onClick={() => {
                                            setSelectedProvinsi(localStorage.getItem('user_provinsi') || '');
                                            setSelectedKabkota(localStorage.getItem('user_kabkota') || '');
                                        }}
                                        className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                                    >
                                        <MapPin size={10} /> Pakai Default
                                    </button>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="relative">
                                        <select
                                            value={selectedProvinsi}
                                            onChange={e => setSelectedProvinsi(e.target.value)}
                                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 pl-3 pr-8 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none text-slate-700 dark:text-slate-200"
                                            disabled={loadingProv}
                                        >
                                            <option value="">Provinsi</option>
                                            {provinsi.map(p => <option key={p} value={p}>{p}</option>)}
                                        </select>
                                        <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-slate-400">
                                            {loadingProv ? <Loader2 size={12} className="animate-spin" /> : <ChevronDown size={12} />}
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <select
                                            value={selectedKabkota}
                                            onChange={e => setSelectedKabkota(e.target.value)}
                                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 pl-3 pr-8 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none text-slate-700 dark:text-slate-200"
                                            disabled={!selectedProvinsi || loadingKab}
                                        >
                                            <option value="">Kota/Kab</option>
                                            {kabkota.map(k => <option key={k} value={k}>{k}</option>)}
                                        </select>
                                        <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-slate-400">
                                            {loadingKab ? <Loader2 size={12} className="animate-spin" /> : <ChevronDown size={12} />}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 transition-all active:scale-95 flex justify-center items-center gap-2"
                            >
                                {loading && <Loader2 size={16} className="animate-spin" />}
                                Daftar Sekarang
                            </button>

                            <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-4">
                                Sudah punya akun? <button type="button" onClick={() => {setIsRegistering(false); setError('');}} className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline">Login disini</button>
                            </p>
                        </form>
                    ) : (
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Username</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User size={16} className="text-slate-400" />
                                    </div>
                                    <input 
                                        type="text" 
                                        value={username}
                                        onChange={e => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 dark:text-slate-100" 
                                        placeholder="Ketik username"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <KeyRound size={16} className="text-slate-400" />
                                    </div>
                                    <input 
                                        type="password" 
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 dark:text-slate-100" 
                                        placeholder="Ketik password"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 transition-all active:scale-95 flex justify-center items-center gap-2"
                            >
                                {loading && <Loader2 size={16} className="animate-spin" />}
                                Masuk
                            </button>

                            <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-4">
                                Belum punya akun? <button type="button" onClick={() => {setIsRegistering(true); setError('');}} className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline">Buat akun baru</button>
                            </p>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
