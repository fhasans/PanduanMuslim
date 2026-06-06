import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase.js';
import { Clock, CheckCircle2, AlertCircle } from 'lucide-react';

const SHOLAT_KEYS = ['subuh', 'dzuhur', 'ashar', 'maghrib', 'isya'];

export default function SholatReminderCard({ setTab, onSuccess }) {
    const [user, setUser] = useState(null);
    const [currentRange, setCurrentRange] = useState(null); // { name, start, end, endTimeStr }
    const [loading, setLoading] = useState(true);

    // Fetch schedule and determine current range
    const checkSchedule = async () => {
        let activeUser = null;
        let prov = 'DKI Jakarta';
        let kab = 'Kota Jakarta';

        const savedUser = localStorage.getItem('qadha_sholat_active_user');
        if (savedUser) {
            try {
                activeUser = JSON.parse(savedUser);
                prov = activeUser.provinsi;
                kab = activeUser.kabkota;
                setUser(activeUser);
            } catch (e) {}
        } else {
            const savedProv = localStorage.getItem('user_provinsi');
            const savedKab = localStorage.getItem('user_kabkota');
            if (savedProv && savedKab) {
                prov = savedProv;
                kab = savedKab;
            }
        }

        const now = new Date();
        const thisMonth = now.getMonth() + 1;
        const thisYear = now.getFullYear();

        try {
            const res = await fetch('https://equran.id/api/v2/shalat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ provinsi: prov, kabkota: kab, bulan: thisMonth, tahun: thisYear })
            });

            const data = await res.json();
            if (!data.data || !data.data.jadwal) return;

            const jadwalList = data.data.jadwal;
            const todayEntry = jadwalList.find(j => parseInt(j.tanggal, 10) === now.getDate());
            if (!todayEntry) return;

            // Define prayer times for today
            const parseTime = (timeStr) => {
                if (!timeStr || timeStr === '-') return null;
                const [h, m] = timeStr.split(':').map(Number);
                return new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0);
            };

            const tSubuh = parseTime(todayEntry.subuh);
            const tDzuhur = parseTime(todayEntry.dzuhur);
            const tAshar = parseTime(todayEntry.ashar);
            const tMaghrib = parseTime(todayEntry.maghrib);
            const tIsya = parseTime(todayEntry.isya);
            const tSubuhEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 5, 30, 0);
            
            // Tomorrow's Subuh (for Isya boundary)
            const tNextSubuh = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 4, 30, 0); // Approximation if we don't have tomorrow's exact time

            const ranges = [
                { name: 'subuh', start: tSubuh, end: tSubuhEnd, endTimeStr: '05:30' },
                { name: 'dzuhur', start: tDzuhur, end: tAshar, endTimeStr: todayEntry.ashar },
                { name: 'ashar', start: tAshar, end: tMaghrib, endTimeStr: todayEntry.maghrib },
                { name: 'maghrib', start: tMaghrib, end: tIsya, endTimeStr: todayEntry.isya },
                { name: 'isya', start: tIsya, end: tNextSubuh, endTimeStr: 'Subuh Esok' },
            ];

            // Find which range we are in currently
            let activeRange = null;
            for (let r of ranges) {
                if (r.start && r.end && now >= r.start && now < r.end) {
                    activeRange = r;
                    break;
                }
            }

            // Fallback for before Subuh (still counts as Isya from previous day)
            if (!activeRange && tSubuh && now < tSubuh) {
                activeRange = { name: 'isya', start: new Date(now.getTime() - 86400000), end: tSubuh, endTimeStr: todayEntry.subuh };
            }

            setCurrentRange(activeRange);

            // Auto-tracking logic for authenticated user
            if (activeUser && activeRange) {
                // Check if we already processed this range for today
                const lastProcessedRangeStr = localStorage.getItem('qadha_last_processed_range');
                const currentRangeId = `${now.toISOString().split('T')[0]}_${activeRange.name}`;

                if (lastProcessedRangeStr) {
                    const [lastDateStr, lastName] = lastProcessedRangeStr.split('_');
                    // If we've moved to a new range, we need to auto-insert the PREVIOUS range as pending
                    if (lastProcessedRangeStr !== currentRangeId) {
                        // We missed the previous one! (assuming it's not completed)
                        // Actually, if we just shifted, let's insert it.
                        // Wait, if they answered it, lastProcessedRangeStr might just be an answered state.
                        // We will store "answered" state separately.
                        const answered = localStorage.getItem(`qadha_answered_${lastProcessedRangeStr}`);
                        if (!answered) {
                            // User ignored it! Auto insert as pending.
                            const oldDate = new Date();
                            if (lastName === 'isya' && activeRange.name === 'subuh') {
                                oldDate.setDate(oldDate.getDate() - 1); // it was yesterday's isya
                            }
                            const dateToLog = oldDate.toISOString().split('T')[0];
                            const timeToLog = oldDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':');
                            
                            await supabase.from('qadha_sholat_logs').insert([{
                                user_id: activeUser.id,
                                sholat_name: lastName,
                                date: dateToLog,
                                time: timeToLog,
                                status: 'pending'
                            }]);
                        }
                    }
                }
                
                // Update current range tracking
                localStorage.setItem('qadha_last_processed_range', currentRangeId);
            }

        } catch (err) {
            console.error("Error checking schedule:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkSchedule();
        const interval = setInterval(checkSchedule, 60000); // Check every minute for boundary shifts
        return () => clearInterval(interval);
    }, []);

    const handleAction = async (isSudah) => {
        if (!user || !currentRange) return;
        
        const now = new Date();
        const dateStr = now.toISOString().split('T')[0];
        const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':');
        const currentRangeId = `${dateStr}_${currentRange.name}`;

        try {
            await supabase.from('qadha_sholat_logs').insert([{
                user_id: user.id,
                sholat_name: currentRange.name,
                date: dateStr,
                time: timeStr,
                status: isSudah ? 'completed' : 'pending'
            }]);
            
            // Mark this range as answered so we don't auto-insert it later
            localStorage.setItem(`qadha_answered_${currentRangeId}`, 'true');
            // Optimistically update UI
            setCurrentRange({ ...currentRange, answered: true });

            if (onSuccess) onSuccess();
        } catch (e) {
            console.error("Gagal menyimpan riwayat sholat", e);
            alert("Terjadi kesalahan.");
        }
    };

    if (loading || !currentRange) return null;

    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const currentRangeId = `${dateStr}_${currentRange.name}`;
    const isAnswered = currentRange.answered || localStorage.getItem(`qadha_answered_${currentRangeId}`) === 'true';

    // If answered, we don't show the card? Or maybe we just show "Sudah tercatat"
    if (isAnswered) {
        return null; // Hide card once answered for this prayer
    }

    return (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border-l-4 border-l-indigo-500 shadow-md shadow-indigo-500/10 mb-6 flex flex-col md:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-start gap-4 w-full">
                <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl text-indigo-500 shrink-0">
                    <Clock size={24} />
                </div>
                <div className="flex-1">
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        Waktu {currentRange.name.toUpperCase()}
                        <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full text-slate-500 font-medium">
                            Sampai {currentRange.endTimeStr}
                        </span>
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        {user ? (
                            `Hai ${user.username}, apakah kamu sudah melaksanakan sholat ${currentRange.name}? (Batas waktu sholat ${currentRange.name} sampai ${currentRange.endTimeStr})`
                        ) : (
                            `Sekarang sedang memasuki waktu sholat ${currentRange.name}. Batas waktu sholat ${currentRange.name} sampai ${currentRange.endTimeStr}. Jangan lupa sholat ya!`
                        )}
                    </p>
                </div>
            </div>
            
            {user && (
                <div className="flex gap-2 w-full md:w-auto shrink-0 mt-2 md:mt-0">
                    <button 
                        onClick={() => handleAction(false)}
                        className="flex-1 md:flex-none px-6 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold rounded-xl transition-colors text-sm"
                    >
                        Belum
                    </button>
                    <button 
                        onClick={() => handleAction(true)}
                        className="flex-1 md:flex-none px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-colors text-sm flex items-center justify-center gap-2"
                    >
                        <CheckCircle2 size={16} /> Sudah
                    </button>
                </div>
            )}
        </div>
    );
}
