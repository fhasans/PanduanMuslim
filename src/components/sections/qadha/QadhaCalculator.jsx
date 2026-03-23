import React, { useState } from 'react';
import { Calculator, ArrowRight, Save, ArrowLeft, AlertCircle, Heart } from 'lucide-react';
import { getRamadansInRange } from '../../../utils/hijri.js';

export default function QadhaCalculator({ onSave, onCancel }) {
    const [step, setStep] = useState(1);
    const [creationMode, setCreationMode] = useState('kalkulasi'); // 'kalkulasi' or 'manual'
    const [name, setName] = useState('');
    const [dob, setDob] = useState(''); // Optional
    const [pubertyAge, setPubertyAge] = useState('15');
    const [fixedMissedDays, setFixedMissedDays] = useState(''); // Optional: for manual input
    const [yearlyLogs, setYearlyLogs] = useState([]);
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');
    const [isCalculating, setIsCalculating] = useState(false);

    const handleNextStep = () => {
        if (!name.trim()) {
            setError('Nama harus diisi');
            return;
        }

        const puberty = parseInt(pubertyAge);
        const manualMissed = parseInt(fixedMissedDays) || 0;

        if (creationMode === 'kalkulasi') {
            if (!dob) {
                setError('Tanggal Lahir harus diisi untuk kalkulasi otomatis');
                return;
            }
            if (isNaN(puberty) || puberty < 5) {
                setError('Umur akil baligh tidak valid');
                return;
            }
        } else {
            if (manualMissed <= 0) {
                setError('Masukkan jumlah bolong puasa');
                return;
            }
        }

        if (!/^\d{6}$/.test(pin)) {
            setError('PIN harus berupa 6 digit angka');
            return;
        }

        if (creationMode === 'manual') {
            handleSaveProfile([]);
            return;
        }

        const birthDateObj = new Date(dob);
        const today = new Date();

        let ageNum = today.getFullYear() - birthDateObj.getFullYear();
        const m = today.getMonth() - birthDateObj.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDateObj.getDate())) {
            ageNum--;
        }

        if (puberty >= ageNum) {
            setError('Umur Akil Baligh harus lebih kecil dari umur saat ini.');
            return;
        }

        setError('');
        setIsCalculating(true);

        // Calculate the exact date user hit puberty
        const pubertyDate = new Date(birthDateObj);
        pubertyDate.setFullYear(pubertyDate.getFullYear() + puberty);

        // setTimeout to show loading state
        setTimeout(() => {
            const ramadans = getRamadansInRange(pubertyDate.toISOString(), today.toISOString());
            const initialLogs = ramadans.map((r, i) => ({
                yearIndex: i + 1,
                gregorianYear: r.gregorianYear,
                hijriYear: r.hijriYear,
                gregorianStartStr: r.gregorianStartStr,
                gregorianEndStr: r.gregorianEndStr,
                daysInMonth: r.days || 30,
                missedFasts: 0
            }));

            setYearlyLogs(initialLogs);
            setIsCalculating(false);
            setStep(2);
        }, 500);
    };

    const handleMissedFastChange = (index, value, maxDays) => {
        let parsed = parseInt(value) || 0;
        if (parsed < 0) parsed = 0;
        if (parsed > maxDays) parsed = maxDays;

        const newLogs = [...yearlyLogs];
        newLogs[index].missedFasts = parsed;
        setYearlyLogs(newLogs);
    };

    const handleSaveProfile = (logsToSave = yearlyLogs) => {
        const calculatedMissed = logsToSave.reduce((acc, log) => acc + log.missedFasts, 0);
        const manualMissed = parseInt(fixedMissedDays) || 0;
        const totalQadha = creationMode === 'manual' ? manualMissed : (calculatedMissed + manualMissed);
        
        let currentAge = 0;
        if (dob && creationMode === 'kalkulasi') {
            const birthDateObj = new Date(dob);
            const today = new Date();
            currentAge = today.getFullYear() - birthDateObj.getFullYear();
            const m = today.getMonth() - birthDateObj.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDateObj.getDate())) {
                currentAge--;
            }
        }

        const profile = {
            id: Date.now().toString(),
            name,
            dob: creationMode === 'kalkulasi' ? dob : null,
            currentAge,
            pubertyAge: creationMode === 'kalkulasi' ? (parseInt(pubertyAge) || 0) : 0,
            fixedMissedDays: manualMissed,
            totalQadha,
            yearlyLogs: logsToSave,
            pin,
            createdAt: new Date().toISOString()
        };

        onSave(profile);
    };

    return (
        <div className="max-w-[1400px] mx-auto md:px-4">
            <div className="flex flex-col lg:flex-row gap-8 items-start">
                
                {/* SIDE PANEL (L): INFO & NOTES */}
                {step === 1 && (
                    <div className="w-full lg:w-[390px] space-y-6 lg:sticky lg:top-8 animate-in fade-in slide-in-from-left-4 duration-700">
                        {/* RELIGIOUS NOTE */}
                        <div className="p-6 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-[2rem] text-white shadow-2xl shadow-emerald-900/20 relative overflow-hidden group">
                            <div className="absolute -top-4 -right-4 p-4 opacity-10 group-hover:scale-125 transition-transform duration-700">
                                <Heart size={120} fill="currentColor" />
                            </div>
                            <h4 className="text-sm font-black mb-4 flex items-center gap-2">
                                <Heart size={18} fill="white" className="animate-pulse" /> Sebuah Pesan untuk Anda
                            </h4>
                            <p className="text-[14px] leading-relaxed font-semibold text-emerald-50 italic">
                                "Ketika Anda sudah berniat dan mengusahakan mengqadha/mengganti puasa yang Anda lalaikan semampu dan sebisa anda, Allah sudah mencatat pahalanya secara full sebanyak atau sebesar apapun tanggungan itu. Jadi ketika Anda terhalang oleh umur yang tidak cukup untuk menuntaskan niatan/usaha tersebut, pahala Anda tetap dicatat full oleh Allah"
                            </p>
                        </div>

                        {/* CARA MENGISI */}
                        <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                            <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2 uppercase tracking-wider">
                                <AlertCircle size={16} className="text-emerald-500" /> Tahapan Pengisian:
                            </h4>
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="h-7 w-7 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 text-[12px] font-black flex items-center justify-center shrink-0">1</div>
                                    <p className="text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                                        Pilih metode di Tab <b>Kalkulasi</b> atau <b>Input Manual</b> sesuai kebutuhan Anda.
                                    </p>
                                </div>
                                <div className="flex gap-4">
                                    <div className="h-7 w-7 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 text-[12px] font-black flex items-center justify-center shrink-0">2</div>
                                    <p className="text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                                        Isi <b>Nama Profil</b> dan <b>6 Digit PIN</b> Keamanan sebagai akses data pribadi Anda.
                                    </p>
                                </div>
                                <div className="flex gap-4">
                                    <div className="h-7 w-7 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 text-[12px] font-black flex items-center justify-center shrink-0">3</div>
                                    <p className="text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                                        Gunakan <b>Kalkulasi</b> jika bingung jumlah hutang, atau <b>Manual</b> jika sudah punya catatan total pasti.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* MAIN FORM PANEL (R) */}
                <div className="flex-1 w-full animate-in fade-in slide-in-from-right-4 duration-700">
                    <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden">
                        {/* HEADER */}
                        <div className="p-5 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/80 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                {step === 2 && (
                                    <button onClick={() => setStep(1)} className="p-2 -ml-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-2xl text-slate-600 dark:text-slate-400 transition-all">
                                        <ArrowLeft size={20} />
                                    </button>
                                )}
                                <div className="p-3 bg-emerald-100 dark:bg-emerald-900/40 rounded-2xl text-emerald-600 dark:text-emerald-400 shadow-inner">
                                    <Calculator size={24} />
                                </div>
                                <div>
                                    <h3 className="font-black text-lg text-slate-800 dark:text-slate-100 uppercase tracking-tight">Kalkulator Qadha</h3>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        {step === 1 ? 'Lengkapi Data Diri' : 'Rincian Batal Puasa per Tahun'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 md:p-8 space-y-8">
                            {error && (
                                <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl text-sm flex items-start gap-3 border border-red-100 dark:border-red-900/30">
                                    <AlertCircle size={18} className="shrink-0" />
                                    <p className="font-semibold">{error}</p>
                                </div>
                            )}

                            {step === 1 && (
                                <div className="space-y-8">
                                    {/* COMMON FIELDS */}
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Nama Profil <span className="text-red-500">*</span></label>
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full p-5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-sans text-xl font-bold text-slate-800 dark:text-slate-200"
                                                placeholder="Contoh: Fulan bin Fulan"
                                            />
                                        </div>

                                        {/* TAB SWITCHER */}
                                        <div className="bg-slate-100 dark:bg-slate-900/50 p-2 rounded-[1.5rem] flex gap-2">
                                            <button 
                                                onClick={() => {
                                                    setCreationMode('kalkulasi');
                                                    setFixedMissedDays('');
                                                    setError('');
                                                }}
                                                className={`flex-1 py-4 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 uppercase tracking-widest ${creationMode === 'kalkulasi' ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-lg' : 'text-slate-500'}`}
                                            >
                                                <Calculator size={16} /> Kalkulasi
                                            </button>
                                            <button 
                                                onClick={() => {
                                                    setCreationMode('manual');
                                                    setDob('');
                                                    setError('');
                                                }}
                                                className={`flex-1 py-4 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 uppercase tracking-widest ${creationMode === 'manual' ? 'bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-lg' : 'text-slate-500'}`}
                                            >
                                                <Save size={16} /> Manual
                                            </button>
                                        </div>

                                        {/* CONDITIONAL RENDERING */}
                                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                                            {creationMode === 'kalkulasi' ? (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Tanggal Lahir <span className="text-red-500">*</span></label>
                                                        <input
                                                            type="date"
                                                            value={dob}
                                                            onChange={(e) => setDob(e.target.value)}
                                                            className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-mono"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Umur Akil Baligh</label>
                                                        <input
                                                            type="number"
                                                            value={pubertyAge}
                                                            onChange={(e) => setPubertyAge(e.target.value)}
                                                            className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-mono text-lg font-bold"
                                                            placeholder="15"
                                                        />
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="space-y-2">
                                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Jumlah Bolong Puasa <span className="text-red-500">*</span></label>
                                                    <div className="relative">
                                                        <input
                                                            type="number"
                                                            value={fixedMissedDays}
                                                            onChange={(e) => setFixedMissedDays(e.target.value)}
                                                            className="w-full p-6 pr-20 bg-amber-50/30 dark:bg-amber-900/10 border-2 border-amber-100 dark:border-amber-800/30 rounded-3xl outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all font-mono text-4xl font-black text-amber-600 dark:text-amber-400"
                                                            placeholder="0"
                                                        />
                                                        <span className="absolute right-8 top-1/2 -translate-y-1/2 text-xs font-black text-amber-300 dark:text-amber-700 uppercase tracking-widest">Hari</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-2 pt-6 border-t border-slate-100 dark:border-slate-800">
                                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Set PIN Keamanan (6 Digit) <span className="text-red-500">*</span></label>
                                            <input
                                                type="password"
                                                inputMode="numeric"
                                                maxLength={6}
                                                value={pin}
                                                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                                                className="w-full p-5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-mono text-center text-4xl tracking-[0.8em]"
                                                placeholder="••••••"
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-4 flex gap-4">
                                        <button
                                            onClick={onCancel}
                                            disabled={isCalculating}
                                            className="flex-1 py-5 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 text-slate-600 dark:text-slate-300 font-black rounded-2xl transition-all uppercase tracking-widest text-xs"
                                        >
                                            Batal
                                        </button>
                                        <button
                                            onClick={handleNextStep}
                                            disabled={isCalculating}
                                            className="flex-[2] py-5 px-6 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-black rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-emerald-700/20 active:scale-[0.98] uppercase tracking-widest text-xs"
                                        >
                                            {isCalculating ? 'Diproses...' : (creationMode === 'manual' ? 'Simpan Profil' : 'Lanjut ke Rincian')}
                                            {!isCalculating && (creationMode === 'manual' ? <Save size={18} /> : <ArrowRight size={18} />)}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                                    <div className="bg-amber-50 dark:bg-amber-900/20 rounded-3xl p-5 border border-amber-100 dark:border-amber-800/30 flex items-start gap-4">
                                        <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={20} />
                                        <p className="text-sm text-amber-800 dark:text-amber-200/80 leading-relaxed font-medium">
                                            Masukkan jumlah batal puasa tiap tahun ramadhan. Sejak Anda berumur <b>{pubertyAge}</b> tahun hingga sekarang.
                                        </p>
                                    </div>

                                    <div className="space-y-4 max-h-[45vh] overflow-y-auto pr-3 custom-scrollbar">
                                        {yearlyLogs.map((log, idx) => (
                                            <div key={log.yearIndex} className="p-5 bg-slate-50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-800 transition-all border border-slate-200 dark:border-slate-800 rounded-[1.5rem] flex items-center justify-between group shadow-sm hover:shadow-md">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <p className="font-black text-slate-800 dark:text-slate-100">Ramadhan {log.gregorianYear}</p>
                                                        <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-full font-black tracking-tighter">{log.hijriYear} H</span>
                                                    </div>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                                                        {log.gregorianStartStr} — {log.gregorianEndStr}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <input
                                                        type="number"
                                                        value={log.missedFasts}
                                                        onChange={(e) => handleMissedFastChange(idx, e.target.value, log.daysInMonth)}
                                                        className="w-20 p-3 text-center bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 font-mono font-black text-xl text-emerald-600 dark:text-emerald-400 transition-all"
                                                        min="0"
                                                        max={log.daysInMonth}
                                                    />
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hari</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => handleSaveProfile()}
                                        className="w-full py-5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-[2rem] flex items-center justify-center gap-3 transition-all shadow-2xl shadow-emerald-700/30 active:scale-[0.98] uppercase tracking-[0.2em] text-sm"
                                    >
                                        <Save size={20} /> Selesaikan Profil
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
