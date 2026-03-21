import React, { useState, useEffect } from 'react';
import { User, CheckCircle2, History, Minus, Plus, Calendar, Trash2, ArrowLeft, Timer, Play, StopCircle, Loader2, AlertTriangle, Sparkles, BookOpen, Sunrise, Sunset } from 'lucide-react';
import { getTodayHijri, getFastingStatus, getSunnahRecommendations } from '../../../utils/hijri.js';

export default function QadhaDashboard({ profile, onUpdate, onDelete, onBack }) {
    
    const [showPinModal, setShowPinModal] = useState(false);
    const [enteredPin, setEnteredPin] = useState('');
    const [pinError, setPinError] = useState('');

    // Fasting Status & Timer State
    const [hijriDate, setHijriDate] = useState(getTodayHijri());
    const [fastingStatus, setFastingStatus] = useState(getFastingStatus(getTodayHijri()));
    const [sunnahRecs, setSunnahRecs] = useState(() => getSunnahRecommendations(hijriDate));
    const [prayerData, setPrayerData] = useState(null);

    useEffect(() => {
        setSunnahRecs(getSunnahRecommendations(hijriDate));
    }, [hijriDate]);
    const [isFasting, setIsFasting] = useState(() => {
        const saved = localStorage.getItem(`qadha_active_${profile.id}`);
        if (!saved) return false;
        const { date } = JSON.parse(saved);
        return date === new Date().toDateString();
    });
    const [timerValue, setTimerValue] = useState('');
    const [isMaghrib, setIsMaghrib] = useState(false);
    const [showSuccessToast, setShowSuccessToast] = useState(false);

    useEffect(() => {
        // Fetch Prayer Times for Jakarta Selatan
        const fetchPrayers = async () => {
            try {
                const today = new Date();
                const response = await fetch('https://equran.id/api/v2/shalat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        provinsi: 'DKI Jakarta',
                        kabkota: 'Kota Jakarta',
                        bulan: today.getMonth() + 1,
                        tahun: today.getFullYear()
                    })
                });
                const d = await response.json();
                const todayEntry = d.data?.jadwal?.find(j => parseInt(j.tanggal, 10) === today.getDate());
                setPrayerData(todayEntry);
            } catch (e) {
                console.error("Failed to fetch prayer times for Qadha timer", e);
            }
        };
        fetchPrayers();
    }, []);

    useEffect(() => {
        let interval;
        if (isFasting && prayerData?.maghrib) {
            interval = setInterval(() => {
                const now = new Date();
                const [h, m] = prayerData.maghrib.split(':');
                const maghribTime = new Date();
                maghribTime.setHours(parseInt(h), parseInt(m), 0);

                const diff = maghribTime - now;
                if (diff <= 0) {
                    setTimerValue('00:00:00');
                    clearInterval(interval);
                    // Automatic finish when timer ends
                    handleFinishFasting(true);
                } else {
                    const hours = Math.floor(diff / (1000 * 60 * 60)).toString().padStart(2, '0');
                    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
                    const secs = Math.floor((diff % (1000 * 60)) / 1000).toString().padStart(2, '0');
                    setTimerValue(`${hours}:${mins}:${secs}`);
                }
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isFasting, prayerData]);

    const handleStartFasting = () => {
        setIsFasting(true);
        localStorage.setItem(`qadha_active_${profile.id}`, JSON.stringify({
            date: new Date().toDateString(),
        }));
    };

    const handleFinishFasting = (isAuto = false) => {
        setIsFasting(false);
        setIsMaghrib(false);
        localStorage.removeItem(`qadha_active_${profile.id}`);
        // Record payment
        handleDecrement(); 
        
        if (isAuto) {
            setShowSuccessToast(true);
            setTimeout(() => setShowSuccessToast(false), 5000);
        }
    };

    const handleCancelFasting = () => {
        if(window.confirm("Batalkan sesi puasa hari ini?")) {
            setIsFasting(false);
            localStorage.removeItem(`qadha_active_${profile.id}`);
        }
    };
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

    const handleConfirmDelete = () => {
        if (enteredPin === profile.pin) {
            onDelete(profile.id);
            setShowPinModal(false);
        } else {
            setPinError('PIN salah! Silakan coba lagi.');
            setEnteredPin('');
        }
    };

    return (
        <div className="space-y-4">
            {/* Success Toast */}
            {showSuccessToast && (
                <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[150] w-[90%] max-w-sm animate-in slide-in-from-top duration-500">
                    <div className="bg-emerald-600 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-4">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                            <Sparkles size={24} />
                        </div>
                        <div>
                            <p className="font-bold">Alhamdulillah!</p>
                            <p className="text-xs opacity-90">Puasa selesai & hutang otomatis berkurang.</p>
                        </div>
                    </div>
                </div>
            )}

            {/* PIN Verification Modal */}
            {showPinModal && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-slate-800 w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Trash2 size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Verifikasi PIN</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                                Masukkan 6 digit PIN untuk menghapus profil <b>{profile.name}</b>.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <input 
                                type="password"
                                inputMode="numeric"
                                maxLength={6}
                                autoFocus
                                value={enteredPin}
                                onChange={(e) => {
                                    setPinError('');
                                    setEnteredPin(e.target.value.replace(/\D/g, ''));
                                }}
                                className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-center text-2xl font-mono tracking-[0.5em] focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all"
                                placeholder="******"
                            />
                            
                            {pinError && (
                                <p className="text-center text-xs text-red-500 font-semibold animate-bounce">{pinError}</p>
                            )}

                            <div className="flex gap-3 mt-2">
                                <button 
                                    onClick={() => {
                                        setShowPinModal(false);
                                        setEnteredPin('');
                                        setPinError('');
                                    }}
                                    className="flex-1 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-bold rounded-xl transition-colors"
                                >
                                    Batal
                                </button>
                                <button 
                                    onClick={handleConfirmDelete}
                                    disabled={enteredPin.length !== 6}
                                    className="flex-1 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold rounded-xl transition-colors shadow-lg shadow-red-200 dark:shadow-none"
                                >
                                    Hapus
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="flex items-center gap-3">
                 <button onClick={onBack} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-600 dark:text-slate-300 transition-colors bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700">
                    <ArrowLeft size={20} />
                </button>
                <h2 className="text-xl font-bold flex-1 text-slate-800 dark:text-slate-100">Detail Qadha</h2>
                <button 
                    onClick={() => setShowPinModal(true)}
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

                    {/* Fasting Status & Timer */}
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Status Puasa Hari Ini</h3>
                            <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${fastingStatus.halal ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                {fastingStatus.halal ? 'Halal' : 'Haram'}
                            </div>
                        </div>
                        
                        <div className={`p-4 rounded-2xl border ${fastingStatus.halal ? 'bg-emerald-50/50 border-emerald-100 dark:bg-emerald-900/10 dark:border-emerald-800/30' : 'bg-red-50/50 border-red-100 dark:bg-red-900/10 dark:border-red-800/30'}`}>
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-xl ${fastingStatus.halal ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                                    {fastingStatus.halal ? <Sparkles size={20} /> : <AlertTriangle size={20} />}
                                </div>
                                <div className="flex-1">
                                    <p className={`text-sm font-bold ${fastingStatus.halal ? 'text-emerald-900 dark:text-emerald-100' : 'text-red-900 dark:text-red-100'}`}>
                                        {fastingStatus.reason}
                                    </p>
                                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                                        Tanggal Hijriah: {hijriDate.day}/{hijriDate.month}/{hijriDate.year} H
                                    </p>
                                </div>
                            </div>
                        </div>

                        {fastingStatus.halal && (
                            <div className="pt-2">
                                {!isFasting ? (
                                    <button 
                                        onClick={handleStartFasting}
                                        disabled={profile.totalQadha === 0 || !prayerData}
                                        className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg shadow-emerald-100"
                                    >
                                        {!prayerData ? <Loader2 className="animate-spin" size={20} /> : <Play size={20} />}
                                        Start Qadha Hari Ini
                                    </button>
                                ) : (
                                    <div className="bg-slate-900 rounded-3xl p-6 text-white text-center space-y-4 shadow-xl border border-slate-800">
                                        <div className="flex items-center justify-center gap-2 mb-2">
                                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Qadha Sedang Berjalan</span>
                                        </div>
                                        
                                        <div className="space-y-1">
                                            <p className="text-slate-500 text-[10px] font-medium uppercase tracking-tighter">Waktu Berbuka (Maghrib)</p>
                                            <p className="text-5xl font-black tracking-tighter tabular-nums font-mono text-emerald-400">{timerValue || '--:--:--'}</p>
                                        </div>

                                        <div className="flex gap-3 pt-2">
                                            {isMaghrib ? (
                                                <button 
                                                    onClick={handleFinishFasting}
                                                    className="flex-1 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-2xl flex items-center justify-center gap-2 animate-bounce shadow-lg shadow-emerald-500/20"
                                                >
                                                    <CheckCircle2 size={24} /> Selesaikan Puasa
                                                </button>
                                            ) : (
                                                <button 
                                                    onClick={handleCancelFasting}
                                                    className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-2xl flex items-center justify-center gap-2 text-xs"
                                                >
                                                    <StopCircle size={18} /> Batalkan
                                                </button>
                                            )}
                                        </div>
                                        
                                        <div className="flex items-center justify-center gap-4 text-[10px] text-slate-500 font-medium">
                                            <div className="flex items-center gap-1">
                                                <Sunrise size={12} /> Subuh: {prayerData?.subuh}
                                            </div>
                                            <div className="flex items-center gap-1 text-emerald-500">
                                                <Sunset size={12} /> Maghrib: {prayerData?.maghrib}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Sunnah Fasting Section */}
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Puasa Sunah</h3>
                            <BookOpen size={14} className="text-slate-300" />
                        </div>
                        
                        <div className="space-y-3">
                            {sunnahRecs.length > 0 ? (
                                sunnahRecs.map((rec, idx) => {
                                    const isObj = typeof rec === 'object' && rec !== null;
                                    const name = isObj ? rec.name : rec;
                                    const range = isObj ? rec.range : null;
                                    
                                    if (!name) return null;

                                    return (
                                        <div key={idx} className="flex items-center gap-3 p-3 bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800/30 rounded-2xl">
                                            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                                                <Sparkles size={16} />
                                            </div>
                                            <div>
                                                <span className="text-sm font-bold text-indigo-900 dark:text-indigo-100 block">{name}</span>
                                                {range && (
                                                    <span className="text-[10px] text-indigo-500 dark:text-indigo-400 font-medium flex items-center gap-1 mt-0.5">
                                                        <Calendar size={10} /> {range}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="text-center py-4 bg-slate-50/50 dark:bg-slate-900/20 border border-dashed border-slate-200 dark:border-slate-700/50 rounded-2xl">
                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium italic">Belum ada anjuran berpuasa sunnah</p>
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
