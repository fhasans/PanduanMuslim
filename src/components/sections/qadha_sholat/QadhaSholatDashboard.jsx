import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Trash2, CheckCircle2, Clock, Calendar, CheckSquare, Square, XCircle } from 'lucide-react';
import { supabase } from '../../../lib/supabase.js';
import SholatReminderCard from './SholatReminderCard.jsx';

const SHOLAT_ORDER = ['subuh', 'dzuhur', 'ashar', 'maghrib', 'isya'];
const RAKAAT_MAP = {
    'subuh': 2,
    'dzuhur': 4,
    'ashar': 4,
    'maghrib': 3,
    'isya': 4
};

export default function QadhaSholatDashboard({ user, onBack }) {
    const [pendingLogs, setPendingLogs] = useState([]);
    const [completedLogs, setCompletedLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedIds, setSelectedIds] = useState(new Set());
    
    // Manual Input State
    const [showManualInput, setShowManualInput] = useState(false);
    const [manualSholat, setManualSholat] = useState('subuh');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchLogs();
    }, [user.id]);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('qadha_sholat_logs')
                .select('*')
                .eq('user_id', user.id);

            if (error) throw error;

            const pending = data.filter(d => d.status === 'pending');
            const completed = data.filter(d => d.status === 'completed');

            const sorter = (a, b) => {
                if (a.date !== b.date) return new Date(a.date) - new Date(b.date);
                return SHOLAT_ORDER.indexOf(a.sholat_name) - SHOLAT_ORDER.indexOf(b.sholat_name);
            };

            setPendingLogs(pending.sort(sorter));
            setCompletedLogs(completed.sort(sorter));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const toggleSelect = (id) => {
        const newSet = new Set(selectedIds);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setSelectedIds(newSet);
    };

    const selectAll = () => {
        if (selectedIds.size === pendingLogs.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(pendingLogs.map(l => l.id)));
        }
    };

    const handleMarkDone = async () => {
        if (selectedIds.size === 0) return;
        setLoading(true);
        try {
            const idsArray = Array.from(selectedIds);
            const { error } = await supabase
                .from('qadha_sholat_logs')
                .update({ status: 'completed' })
                .in('id', idsArray);

            if (error) throw error;
            
            // Move from pending to completed
            const itemsToMove = pendingLogs.filter(l => selectedIds.has(l.id));
            setPendingLogs(prev => prev.filter(l => !selectedIds.has(l.id)));
            setCompletedLogs(prev => {
                const updated = [...prev, ...itemsToMove.map(i => ({...i, status: 'completed'}))];
                return updated.sort((a, b) => {
                    if (a.date !== b.date) return new Date(a.date) - new Date(b.date);
                    return SHOLAT_ORDER.indexOf(a.sholat_name) - SHOLAT_ORDER.indexOf(b.sholat_name);
                });
            });
            setSelectedIds(new Set());
        } catch (err) {
            console.error(err);
            alert('Gagal mengupdate status.');
        } finally {
            setLoading(false);
        }
    };

    const handleMarkInvalid = async () => {
        if (selectedIds.size === 0) return;
        setLoading(true);
        try {
            const idsArray = Array.from(selectedIds);
            const { error } = await supabase
                .from('qadha_sholat_logs')
                .delete()
                .in('id', idsArray);

            if (error) throw error;
            
            setPendingLogs(prev => prev.filter(l => !selectedIds.has(l.id)));
            setSelectedIds(new Set());
        } catch (err) {
            console.error(err);
            alert('Gagal menghapus sholat.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddManual = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const now = new Date();
            const dateStr = now.toISOString().split('T')[0];
            const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':');

            const newLog = {
                user_id: user.id,
                sholat_name: manualSholat,
                date: dateStr,
                time: timeStr,
                status: 'pending'
            };

            const { data, error } = await supabase
                .from('qadha_sholat_logs')
                .insert([newLog])
                .select()
                .single();

            if (error) throw error;

            setPendingLogs(prev => {
                const updated = [...prev, data];
                return updated.sort((a, b) => {
                    if (a.date !== b.date) return new Date(a.date) - new Date(b.date);
                    return SHOLAT_ORDER.indexOf(a.sholat_name) - SHOLAT_ORDER.indexOf(b.sholat_name);
                });
            });
            setShowManualInput(false);
        } catch (err) {
            console.error(err);
            alert('Gagal menambah qadha manual.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatIndoDate = (dateString) => {
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    return (
        <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 p-4 md:p-6 relative">
            <div className="max-w-3xl mx-auto space-y-6">
                
                {/* Header Profile */}
                <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                    <button onClick={onBack} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                        <ArrowLeft size={20} className="text-slate-600 dark:text-slate-300" />
                    </button>
                    <div>
                        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Hai, {user.username}</h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Lokasi: {user.kabkota}, {user.provinsi}</p>
                    </div>
                </div>

                <SholatReminderCard setTab={() => {}} onSuccess={fetchLogs} />

                {/* Dashboard Stats & Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-indigo-600 rounded-2xl p-5 text-white shadow-lg shadow-indigo-600/20 flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Clock size={80} />
                        </div>
                        <div className="relative z-10 flex justify-between items-end">
                            <div>
                                <p className="text-indigo-100 text-sm font-medium mb-1">Total Hutang Sholat</p>
                                <h3 className="text-4xl font-black">{pendingLogs.length} <span className="text-base font-normal opacity-80">Waktu</span></h3>
                            </div>
                            <div className="text-right">
                                <p className="text-indigo-200 text-xs font-medium mb-0.5">Total Rakaat</p>
                                <p className="text-2xl font-bold">{pendingLogs.reduce((acc, l) => acc + RAKAAT_MAP[l.sholat_name], 0)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col gap-3 justify-center">
                        <button 
                            onClick={() => setShowManualInput(!showManualInput)}
                            className="w-full py-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                        >
                            <Plus size={18} /> Tambah Manual
                        </button>
                        
                        {selectedIds.size > 0 && (
                            <div className="grid grid-cols-2 gap-2 animate-in fade-in zoom-in duration-200">
                                <button 
                                    onClick={handleMarkDone}
                                    disabled={loading}
                                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold transition-colors shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-1.5 text-xs sm:text-sm"
                                >
                                    <CheckCircle2 size={16} /> Sudah
                                </button>
                                <button 
                                    onClick={handleMarkInvalid}
                                    disabled={loading}
                                    className="w-full py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold transition-colors shadow-lg shadow-rose-500/20 flex items-center justify-center gap-1.5 text-xs sm:text-sm"
                                >
                                    <XCircle size={16} /> Tidak Valid
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Manual Input Form */}
                {showManualInput && (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm animate-in fade-in slide-in-from-top-4 duration-200">
                        <h4 className="font-bold text-slate-700 dark:text-slate-200 mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">Input Qadha Manual</h4>
                        <form onSubmit={handleAddManual} className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Waktu Sholat</label>
                                <select 
                                    value={manualSholat}
                                    onChange={(e) => setManualSholat(e.target.value)}
                                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 dark:text-slate-200"
                                >
                                    <option value="subuh">Subuh</option>
                                    <option value="dzuhur">Dzuhur</option>
                                    <option value="ashar">Ashar</option>
                                    <option value="maghrib">Maghrib</option>
                                    <option value="isya">Isya</option>
                                </select>
                            </div>
                            <div>
                                <button 
                                    type="submit" 
                                    disabled={isSubmitting}
                                    className="w-full py-3 bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 text-white rounded-xl font-bold transition-colors disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Menyimpan...' : 'Simpan Qadha'}
                                </button>
                                <p className="text-center text-[10px] text-slate-400 mt-2">
                                    Catatan: Sistem akan memberikan watermark tanggal & waktu sesuai waktu Anda menekan tombol simpan.
                                </p>
                            </div>
                        </form>
                    </div>
                )}

                {/* List Qadha (Pending) */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between">
                        <h4 className="font-bold text-slate-700 dark:text-slate-200 text-sm">Daftar Hutang Sholat</h4>
                        {pendingLogs.length > 0 && (
                            <button onClick={selectAll} className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
                                {selectedIds.size === pendingLogs.length ? 'Batal Pilih Semua' : 'Pilih Semua'}
                            </button>
                        )}
                    </div>

                    <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[400px] overflow-y-auto no-scrollbar">
                        {loading && pendingLogs.length === 0 ? (
                            <div className="py-10 text-center text-slate-400 text-sm">Memuat data...</div>
                        ) : pendingLogs.length === 0 ? (
                            <div className="py-12 text-center text-slate-400 flex flex-col items-center gap-2">
                                <CheckCircle2 size={32} className="text-emerald-400/50" />
                                <p className="text-sm font-medium">Alhamdulillah, tidak ada hutang sholat.</p>
                            </div>
                        ) : (
                            pendingLogs.map((log) => (
                                <div 
                                    key={log.id} 
                                    onClick={() => toggleSelect(log.id)}
                                    className={`p-4 flex items-center gap-4 cursor-pointer transition-colors ${selectedIds.has(log.id) ? 'bg-indigo-50/50 dark:bg-indigo-900/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                                >
                                    <div className="shrink-0 text-indigo-500">
                                        {selectedIds.has(log.id) ? <CheckSquare size={20} /> : <Square size={20} className="text-slate-300 dark:text-slate-600" />}
                                    </div>
                                    <div className="flex-1 relative overflow-hidden group">
                                        {/* Watermark Tanggal & Jam */}
                                        <div className="absolute right-0 bottom-0 opacity-5 dark:opacity-10 pointer-events-none transition-transform group-hover:scale-110 group-hover:-translate-y-1 group-hover:-translate-x-1 duration-300">
                                            <div className="text-3xl font-black uppercase whitespace-nowrap -mr-4 -mb-2">
                                                {formatIndoDate(log.date)} {log.time !== '-' ? log.time : ''}
                                            </div>
                                        </div>
                                        
                                        <h5 className="font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wide flex items-center gap-2">
                                            {log.sholat_name} <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full text-slate-500">{RAKAAT_MAP[log.sholat_name]} Rakaat</span>
                                        </h5>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5 flex items-center gap-1">
                                            <Calendar size={10} /> {formatIndoDate(log.date)} {log.time !== '-' && <span className="ml-1 flex items-center gap-1"><Clock size={10}/> {log.time}</span>}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* List Completed (Total Sholat Sejauh Ini) */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
                    <div className="px-4 py-3 border-b border-emerald-100 dark:border-emerald-900/30 bg-emerald-50 dark:bg-emerald-900/10 flex items-center justify-between">
                        <div>
                            <h4 className="font-bold text-emerald-800 dark:text-emerald-400 text-sm">Total Sholat Anda Sejauh Ini</h4>
                            <p className="text-[10px] text-emerald-600 dark:text-emerald-500 font-medium">{completedLogs.reduce((acc, l) => acc + RAKAAT_MAP[l.sholat_name], 0)} Rakaat diselesaikan</p>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                            <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400" />
                        </div>
                    </div>

                    <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[300px] overflow-y-auto no-scrollbar opacity-70">
                        {loading && completedLogs.length === 0 ? (
                            <div className="py-10 text-center text-slate-400 text-sm">Memuat data...</div>
                        ) : completedLogs.length === 0 ? (
                            <div className="py-8 text-center text-slate-400 text-xs font-medium">
                                Belum ada riwayat sholat yang diselesaikan.
                            </div>
                        ) : (
                            completedLogs.map((log) => (
                                <div key={log.id} className="p-3 px-4 flex items-center gap-4">
                                    <div className="flex-1 relative overflow-hidden group">
                                        {/* Watermark Tanggal & Jam */}
                                        <div className="absolute right-0 bottom-0 opacity-5 dark:opacity-10 pointer-events-none transition-transform group-hover:scale-110 group-hover:-translate-y-1 group-hover:-translate-x-1 duration-300">
                                            <div className="text-3xl font-black uppercase whitespace-nowrap -mr-4 -mb-2">
                                                {formatIndoDate(log.date)} {log.time !== '-' ? log.time : ''}
                                            </div>
                                        </div>
                                        
                                        <h5 className="font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wide flex items-center gap-2 text-sm">
                                            {log.sholat_name} <span className="text-[10px] bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded-full text-slate-400">{RAKAAT_MAP[log.sholat_name]} Rakaat</span>
                                        </h5>
                                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-0.5 flex items-center gap-1">
                                            <Calendar size={10} /> {formatIndoDate(log.date)} {log.time !== '-' && <span className="ml-1 flex items-center gap-1"><Clock size={10}/> {log.time}</span>}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
