import React, { useState } from 'react';
import { Calculator, ArrowRight, Save, ArrowLeft, AlertCircle } from 'lucide-react';
import { getRamadansInRange } from '../../../utils/hijri.js';

export default function QadhaCalculator({ onSave, onCancel }) {
    const [step, setStep] = useState(1);
    const [name, setName] = useState('');
    const [dob, setDob] = useState(''); // Date of Birth YYYY-MM-DD
    const [pubertyAge, setPubertyAge] = useState('');
    const [yearlyLogs, setYearlyLogs] = useState([]);
    const [error, setError] = useState('');
    const [isCalculating, setIsCalculating] = useState(false);

    const handleNextStep = () => {
        if (!name.trim()) {
            setError('Nama harus diisi');
            return;
        }
        if (!dob) {
            setError('Tanggal Lahir harus diisi');
            return;
        }

        const puberty = parseInt(pubertyAge);
        if (isNaN(puberty) || puberty < 5) {
            setError('Umur akil baligh tidak valid');
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
            setError('Gagal dikalkulasi. Umur Akil Baligh harus lebih kecil dari umur saat ini.');
            return;
        }
        
        setError('');
        setIsCalculating(true);
        
        // Calculate the exact date user hit puberty
        const pubertyDate = new Date(birthDateObj);
        pubertyDate.setFullYear(pubertyDate.getFullYear() + puberty);

        // setTimeout to allow UI to update to loading state if computation takes time
        setTimeout(() => {
            const ramadans = getRamadansInRange(pubertyDate.toISOString(), today.toISOString());
            
            const initialLogs = ramadans.map((r, i) => ({
                yearIndex: i + 1,
                gregorianYear: r.gregorianYear,
                hijriYear: r.hijriYear,
                gregorianStartStr: r.gregorianStartStr,
                gregorianEndStr: r.gregorianEndStr,
                daysInMonth: r.days, // typically 29 or 30
                missedFasts: 0
            }));
            
            setYearlyLogs(initialLogs);
            setIsCalculating(false);
            setStep(2);
        }, 100);
    };

    const handleMissedFastChange = (index, value, maxDays) => {
        let parsed = parseInt(value) || 0;
        if (parsed < 0) parsed = 0;
        if (parsed > maxDays) parsed = maxDays;
        
        const newLogs = [...yearlyLogs];
        newLogs[index].missedFasts = parsed;
        setYearlyLogs(newLogs);
    };

    const handleSave = () => {
        const totalQadha = yearlyLogs.reduce((acc, log) => acc + log.missedFasts, 0);
        
        const birthDateObj = new Date(dob);
        const today = new Date();
        let currentAge = today.getFullYear() - birthDateObj.getFullYear();
        const m = today.getMonth() - birthDateObj.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDateObj.getDate())) {
            currentAge--;
        }

        const profile = {
            id: Date.now().toString(),
            name,
            dob,
            currentAge,
            pubertyAge: parseInt(pubertyAge),
            totalQadha,
            yearlyLogs,
            createdAt: new Date().toISOString()
        };
        onSave(profile);
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex items-center gap-3">
                {step === 2 && (
                    <button onClick={() => setStep(1)} className="p-2 -ml-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-600 dark:text-slate-400 transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                )}
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/40 rounded-xl text-emerald-600 dark:text-emerald-400">
                    <Calculator size={20} />
                </div>
                <div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-200">Kalkulator Qadha</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        {step === 1 ? 'Data Diri Profil Baru' : 'Catatan Batal Puasa per Tahun'}
                    </p>
                </div>
            </div>

            <div className="p-4 md:p-6 space-y-6">
                {error && (
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm flex items-start gap-2 border border-red-100 dark:border-red-900/30">
                        <AlertCircle size={16} className="mt-0.5 shrink-0" />
                        <p>{error}</p>
                    </div>
                )}

                {step === 1 && (
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Nama Profil</label>
                            <input 
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-sans text-slate-800 dark:text-slate-200"
                                placeholder="Contoh: Fulan"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Tanggal Lahir</label>
                                <input 
                                    type="date"
                                    value={dob}
                                    onChange={(e) => setDob(e.target.value)}
                                    className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-mono text-slate-800 dark:text-slate-200"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Umur Akil Baligh</label>
                                <input 
                                    type="number"
                                    value={pubertyAge}
                                    onChange={(e) => setPubertyAge(e.target.value)}
                                    className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-mono text-slate-800 dark:text-slate-200"
                                    placeholder="15"
                                />
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Standar umumnya 15 tahun.</p>
                            </div>
                        </div>

                        <div className="pt-2 flex gap-3">
                            <button 
                                onClick={onCancel}
                                disabled={isCalculating}
                                className="flex-1 py-3 px-4 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 dark:text-slate-300 font-semibold rounded-xl transition-colors"
                            >
                                Batal
                            </button>
                            <button 
                                onClick={handleNextStep}
                                disabled={isCalculating}
                                className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm shadow-emerald-200 dark:shadow-none"
                            >
                                {isCalculating ? 'Mengkalkulasi...' : 'Lanjut'} {!isCalculating && <ArrowRight size={18} />}
                            </button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6">
                        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-3 border border-amber-100 dark:border-amber-800/30 flex items-start gap-3">
                            <AlertCircle className="text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" size={18} />
                            <p className="text-sm text-amber-800 dark:text-amber-200/80 leading-relaxed">
                                Kalkulasi otomatis kapan saja Ramadhan jatuh sejak Anda berumur <strong>{pubertyAge}</strong> tahun hingga saat ini. Masukkan jumlah batal pada setiap tahunnya.
                            </p>
                        </div>
                        
                        <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2 no-scrollbar">
                            {yearlyLogs.map((log, idx) => (
                                <div key={log.yearIndex} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100/50 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700 rounded-xl gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <p className="font-bold text-slate-800 dark:text-slate-200 tracking-tight">Ramadhan {log.gregorianYear}</p>
                                            <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full font-bold">{log.hijriYear} H</span>
                                        </div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
                                            {log.gregorianStartStr} - {log.gregorianEndStr}
                                            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal ml-1">({log.daysInMonth} Hari)</span>
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 self-end md:self-auto">
                                        <input 
                                            type="number"
                                            value={log.missedFasts}
                                            onChange={(e) => handleMissedFastChange(idx, e.target.value, log.daysInMonth)}
                                            className="w-16 p-2 text-center bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono font-bold text-slate-800 dark:text-slate-200"
                                            min="0"
                                            max={log.daysInMonth}
                                        />
                                        <span className="text-sm text-slate-500 dark:text-slate-400 font-medium w-8">Hari</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="pt-2 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 sticky bottom-0 flex gap-3">
                            <button 
                                onClick={handleSave}
                                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm shadow-emerald-200 dark:shadow-none"
                            >
                                <Save size={18} /> Simpan Profil
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
