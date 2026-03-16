import React, { useState } from 'react';
import { User, CheckCircle2, History, Minus, Plus, Calendar, Trash2, ArrowLeft } from 'lucide-react';

export default function QadhaDashboard({ profile, onUpdate, onDelete, onBack }) {
    
    // Quick modify
    const handleDecrement = () => {
        if (profile.totalQadha > 0) {
            const newPayment = {
                id: Date.now().toString(),
                date: new Date().toISOString(),
                amount: 1
            };
            const currentPayments = profile.payments || [];
            onUpdate({ 
                ...profile, 
                totalQadha: profile.totalQadha - 1,
                payments: [newPayment, ...currentPayments] 
            });
        }
    };
    
    const handleIncrement = () => {
        onUpdate({ ...profile, totalQadha: profile.totalQadha + 1 });
    };

    const handleDeletePayment = (paymentId) => {
        const currentPayments = profile.payments || [];
        const paymentToDelete = currentPayments.find(p => p.id === paymentId);
        
        if (paymentToDelete) {
            const newPayments = currentPayments.filter(p => p.id !== paymentId);
            onUpdate({
                ...profile,
                totalQadha: profile.totalQadha + paymentToDelete.amount,
                payments: newPayments
            });
        }
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center gap-3">
                 <button onClick={onBack} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-600 dark:text-slate-300 transition-colors bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700">
                    <ArrowLeft size={20} />
                </button>
                <h2 className="text-xl font-bold flex-1 text-slate-800 dark:text-slate-100">Detail Qadha</h2>
                <button 
                    onClick={() => {
                        if(window.confirm(`Hapus permanen profil ${profile.name}?`)) {
                            onDelete(profile.id);
                        }
                    }}
                    className="p-2 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700"
                    title="Hapus Profil"
                >
                    <Trash2 size={20} />
                </button>
            </div>

            {/* 3-Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                {/* LEFT: Riwayat Batal Puasa (4 columns) */}
                <div className="lg:col-span-4 bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col h-[500px]">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4 mb-4 shrink-0">
                        <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 text-base">
                            <History size={18} className="text-slate-400 dark:text-slate-500" /> Riwayat Batal
                        </h3>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2.5 py-1 rounded-full font-medium">
                            Umur {profile.pubertyAge}+
                        </div>
                    </div>
                    
                    <div className="space-y-3 overflow-y-auto flex-1 pr-1 custom-scrollbar">
                        {profile.yearlyLogs && profile.yearlyLogs.filter(log => log.missedFasts > 0).length > 0 ? (
                            profile.yearlyLogs.map((log) => (
                                log.missedFasts > 0 && (
                                    <div key={log.yearIndex} className="flex justify-between items-center p-3.5 bg-slate-50 dark:bg-slate-900/50 rounded-xl text-sm border border-slate-100 dark:border-slate-700 hover:border-red-100 dark:hover:border-red-900/20 transition-colors">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-slate-700 dark:text-slate-200 font-bold">Ramadhan {log.gregorianYear}</span>
                                            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                                                {log.gregorianStartStr} - {log.gregorianEndStr}
                                            </span>
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            <span className="text-red-500 dark:text-red-400 font-bold bg-red-50 dark:bg-red-900/20 px-2.5 py-1 rounded-lg text-xs shrink-0">
                                                {log.missedFasts} Hari
                                            </span>
                                            <span className="text-[9px] text-slate-400 uppercase tracking-tighter">Batal</span>
                                        </div>
                                    </div>
                                )
                            ))
                        ) : (
                             <div className="text-center py-12 text-sm text-slate-400 dark:text-slate-500 italic">
                                Belum ada catatan batal puasa.
                            </div>
                        )}
                    </div>
                </div>

                {/* CENTER: Total Card + Controls (4 columns) */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    {/* Total Card */}
                    <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-[2.5rem] p-8 text-white shadow-xl shadow-emerald-900/10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-white opacity-10 rounded-full -mr-12 -mt-12 blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-400 opacity-10 rounded-full -ml-8 -mb-8 blur-2xl"></div>
                        
                        <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                            <div className="px-3.5 py-1.5 bg-emerald-800/40 backdrop-blur-md rounded-full text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 border border-emerald-400/20">
                                <User size={12} className="text-emerald-300" /> {profile.name}
                            </div>
                            
                            <div className="space-y-1">
                                <p className="text-emerald-100 text-sm font-medium">Sisa Hutang</p>
                                <div className="flex items-baseline justify-center gap-2">
                                    <span className="text-7xl font-black tracking-tighter tabular-nums drop-shadow-md">{profile.totalQadha}</span>
                                    <span className="text-lg font-bold text-emerald-200 uppercase tracking-wider">Hari</span>
                                </div>
                            </div>
                            
                            {profile.totalQadha === 0 && (
                                <div className="bg-white/10 backdrop-blur-sm text-emerald-50 border border-white/20 px-5 py-2.5 rounded-2xl flex items-center gap-2 text-sm mt-4 font-semibold">
                                    <CheckCircle2 size={20} className="text-emerald-300" />
                                    Lunas Alhamdulillah
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
                        <h3 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-6 text-center">Update Manual</h3>
                        <div className="flex items-center justify-center gap-4">
                            <button 
                                onClick={handleIncrement}
                                className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all active:scale-90 shadow-sm"
                                title="Tambah Hutang"
                            >
                                <Plus size={24} />
                            </button>
                            <button 
                                onClick={handleDecrement}
                                disabled={profile.totalQadha === 0}
                                className="flex-1 h-14 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed text-white font-black rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg shadow-emerald-200 dark:shadow-none text-base tracking-wide"
                            >
                                <Minus size={20} /> Bayar 1 Hari
                            </button>
                        </div>
                        <p className="text-center text-[10px] text-slate-400 dark:text-slate-500 mt-5 leading-relaxed font-medium">
                            Klik "Bayar 1 Hari" tiap kali selesai puasa.
                        </p>
                    </div>
                </div>

                {/* RIGHT: Riwayat Pembayaran (4 columns) */}
                <div className="lg:col-span-4 bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col h-[500px]">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4 mb-4 shrink-0">
                        <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 text-base">
                            <CheckCircle2 size={18} className="text-emerald-500" /> Riwayat Bayar
                        </h3>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2.5 py-1 rounded-full font-medium">
                            Terbaru
                        </div>
                    </div>
                    
                    <div className="space-y-3 overflow-y-auto flex-1 pr-1 custom-scrollbar">
                        {profile.payments && profile.payments.length > 0 ? (
                            profile.payments.map((payment) => {
                                const dateObj = new Date(payment.date);
                                const formattedDate = dateObj.toLocaleDateString('id-ID', {
                                    day: 'numeric', month: 'long', year: 'numeric',
                                });
                                const formattedTime = dateObj.toLocaleTimeString('id-ID', {
                                    hour: '2-digit', minute: '2-digit'
                                });
                                
                                return (
                                    <div key={payment.id} className="flex justify-between items-center p-3.5 bg-emerald-50/50 dark:bg-emerald-900/20 rounded-xl text-sm border border-emerald-100 dark:border-emerald-800/30 hover:border-emerald-200 dark:hover:border-emerald-700 transition-colors group">
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-emerald-900 dark:text-emerald-300 font-bold">{formattedDate}</span>
                                            <span className="text-[10px] text-emerald-600/70 dark:text-emerald-500/70 font-medium">Pukul {formattedTime}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="flex flex-col items-center">
                                                <span className="text-emerald-700 dark:text-emerald-400 font-black text-xs">1H</span>
                                                <span className="text-[8px] text-emerald-600/50 uppercase font-black">Lunas</span>
                                            </div>
                                            <button 
                                                onClick={() => handleDeletePayment(payment.id)}
                                                className="p-1.5 text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-white dark:hover:bg-slate-900 rounded-lg transition-all"
                                                title="Hapus / Batal Bayar"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                )
                            })
                        ) : (
                            <div className="text-center py-12 text-sm text-slate-400 dark:text-slate-500 italic">
                                Belum ada riwayat bayar.
                            </div>
                        )}
                    </div>
                </div>

            </div>
            <div className="pb-10"></div>
        </div>
    );
}
