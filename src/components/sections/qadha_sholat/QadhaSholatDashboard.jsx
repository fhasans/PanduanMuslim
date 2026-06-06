import React, { useState, useEffect, useRef } from 'react';
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

const SUNNAH_RULES = {
    'dhuha': { name: 'Dhuha', min: 2, default_max: 8, increment: 2, witir: false, fixed: false },
    'tahajjud': { name: 'Tahajjud', min: 2, default_max: 12, increment: 2, witir: true, fixed: false },
    'qiyamul_lail': { name: 'Qiyamul Lail', min: 2, default_max: 12, increment: 2, witir: true, fixed: false },
    'tarawih': { name: 'Tarawih', min: 2, default_max: 20, increment: 2, witir: true, fixed: false },
    'taubat': { name: 'Sholat Taubat', min: 2, default_max: 6, increment: 2, witir: 'optional', fixed: false },
    'qobliyah_subuh': { name: 'Qobliyah Subuh', fixed: 2 },
    'qobliyah_dzuhur': { name: 'Qobliyah Dzuhur', min: 2, default_max: 4, increment: 2, witir: false, fixed: false },
    'qobliyah_ashar': { name: 'Qobliyah Ashar', min: 2, default_max: 4, increment: 2, witir: false, fixed: false },
    'qobliyah_maghrib': { name: 'Qobliyah Maghrib', fixed: 2 },
    'qobliyah_isya': { name: 'Qobliyah Isya', fixed: 2 },
    'badiyah_dzuhur': { name: "Ba'diyah Dzuhur", fixed: 2 },
    'badiyah_maghrib': { name: "Ba'diyah Maghrib", fixed: 2 },
    'badiyah_isya': { name: "Ba'diyah Isya", fixed: 2 },
};

const PENDING_VERSES = [
    { min: 100, verse: `"(Penghuni surga bertanya): 'Apakah yang memasukkan kamu ke dalam Saqar (neraka)?' Mereka menjawab: 'Kami dahulu tidak termasuk orang-orang yang mengerjakan shalat.'" (QS. Al-Muddaththir: 42-43)` },
    { min: 80, verse: `"Dan ia tidak mau membenarkan (Rasul dan Al-Qur'an) dan tidak mau mengerjakan shalat, tetapi ia mendustakan dan berpaling." (QS. Al-Qiyamah: 31-32)` },
    { min: 70, verse: `"Maka datanglah sesudah mereka, pengganti (yang jelek) yang menyia-nyiakan shalat dan memperturutkan hawa nafsunya, maka mereka kelak akan menemui kesesatan." (QS. Maryam: 59)` },
    { min: 60, verse: `"Dan barangsiapa berpaling dari peringatan-Ku, maka sesungguhnya baginya penghidupan yang sempit, dan Kami akan menghimpunkannya pada hari kiamat dalam keadaan buta." (QS. Thaha: 124)` },
    { min: 40, verse: `"Sesungguhnya orang-orang munafik itu menipu Allah... Dan apabila mereka berdiri untuk shalat, mereka berdiri dengan malas." (QS. An-Nisa: 142)` },
    { min: 20, verse: `"Maka kecelakaanlah bagi orang-orang yang shalat, (yaitu) orang-orang yang lalai dari shalatnya." (QS. Al-Ma'un: 4-5)` },
];

const FORGIVING_VERSES = [
    `"Katakanlah: 'Hai hamba-hamba-Ku yang melampaui batas terhadap diri mereka sendiri, janganlah kamu berputus asa dari rahmat Allah. Sesungguhnya Allah mengampuni dosa-dosa semuanya.'" (QS. Az-Zumar: 53)`,
    `"Sesungguhnya Allah menyukai orang-orang yang bertaubat dan menyukai orang-orang yang mensucikan diri." (QS. Al-Baqarah: 222)`,
    `"Dan dirikanlah shalat... Sesungguhnya perbuatan-perbuatan yang baik itu menghapuskan (dosa) perbuatan-perbuatan yang buruk." (QS. Hud: 114)`,
    `"Dan bahwasanya seorang manusia tiada memperoleh selain apa yang telah diusahakannya." (QS. An-Najm: 39)`,
    `"Kecuali orang-orang yang bertaubat, beriman dan mengerjakan amal saleh; maka kejahatan mereka diganti Allah dengan kebajikan." (QS. Al-Furqan: 70)`,
    `"Dan orang-orang yang berjihad untuk (mencari keridhaan) Kami, benar-benar akan Kami tunjukkan kepada mereka jalan-jalan Kami. Dan sesungguhnya Allah benar-benar beserta orang-orang yang berbuat baik." (QS. Al-'Ankabut: 69)`
];

const COMPLETED_VERSES = [
    { min: 100, verse: `"Hai jiwa yang tenang. Kembalilah kepada Tuhanmu dengan hati yang puas lagi diridhai-Nya. Maka masuklah ke dalam jama'ah hamba-hamba-Ku, masuklah ke dalam syurga-Ku." (QS. Al-Fajr: 27-30)` },
    { min: 90, verse: `"Sesungguhnya orang-orang yang mengatakan: 'Tuhan kami ialah Allah' kemudian mereka meneguhkan pendirian mereka (istiqomah), maka malaikat akan turun kepada mereka..." (QS. Fussilat: 30)` },
    { min: 80, verse: `"...Tanda-tanda mereka tampak pada muka mereka dari bekas sujud." (QS. Al-Fath: 29)` },
    { min: 70, verse: `"Dan orang-orang yang memelihara shalatnya. Mereka itu (kekal) di surga lagi dimuliakan." (QS. Al-Ma'arij: 34-35)` },
    { min: 60, verse: `"Dan perintahkanlah kepada keluargamu mendirikan shalat dan bersabarlah kamu dalam mengerjakannya. Kami tidak meminta rezeki kepadamu, Kamilah yang memberi rezeki kepadamu." (QS. Thaha: 132)` },
    { min: 50, verse: `"Sesungguhnya beruntunglah orang-orang yang beriman, (yaitu) orang-orang yang khusyu' dalam shalatnya." (QS. Al-Mu'minun: 1-2)` },
    { min: 40, verse: `"Laki-laki yang tidak dilalaikan oleh perniagaan dan tidak (pula) oleh jual beli dari mengingati Allah, dan (dari) mendirikan sembahyang..." (QS. An-Nur: 37)` },
    { min: 30, verse: `"Dirikanlah shalat. Sesungguhnya shalat itu mencegah dari (perbuatan-perbuatan) keji dan mungkar." (QS. Al-'Ankabut: 45)` },
    { min: 20, verse: `"Jadikanlah sabar dan shalat sebagai penolongmu. Dan sesungguhnya yang demikian itu sungguh berat, kecuali bagi orang-orang yang khusyu'." (QS. Al-Baqarah: 45)` },
    { min: 10, verse: `"(Yaitu) orang-orang yang beriman dan hati mereka manjadi tenteram dengan mengingat Allah. Ingatlah, hanya dengan mengingati Allah-lah hati menjadi tenteram." (QS. Ar-Ra'd: 28)` },
    { min: 0, verse: `"Sesungguhnya Aku ini adalah Allah, tidak ada Tuhan (yang hak) selain Aku, maka sembahlah Aku dan dirikanlah shalat untuk mengingat Aku." (QS. Thaha: 14)` },
];

const getRakaat = (log) => {
    if (RAKAAT_MAP[log.sholat_name]) return RAKAAT_MAP[log.sholat_name];
    
    const fixedSunnah = Object.values(SUNNAH_RULES).find(r => r.name.toLowerCase() === log.sholat_name.toLowerCase() && r.fixed);
    if (fixedSunnah) return fixedSunnah.fixed;
    
    let total = 0;
    const rakaatMatch = log.sholat_name.match(/(\d+)\s*Rakaat/i);
    if (rakaatMatch) total += parseInt(rakaatMatch[1], 10);
    
    const witirMatch = log.sholat_name.match(/(\d+)\s*Witir/i);
    if (witirMatch) total += parseInt(witirMatch[1], 10);
    
    return total > 0 ? total : 0;
};

const sortLogsChronologically = (a, b) => {
    if (a.created_at && b.created_at) {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    }
    if (a.id && b.id && typeof a.id === 'number') {
        return a.id - b.id;
    }
    const dateA = a.date || '';
    const dateB = b.date || '';
    if (dateA !== dateB) return dateA.localeCompare(dateB);
    
    const timeA = a.time || '';
    const timeB = b.time || '';
    if (timeA !== '-' && timeB !== '-' && timeA !== timeB) {
        return timeA.localeCompare(timeB);
    }
    return 0; 
};

function drawEffect(ctx, fx, fy, fw, fh, timeOffset = 0, baseLineWidth = 2, isMaxLevel = false) {
  ctx.save(); 
  ctx.strokeStyle = isMaxLevel ? '#000000' : '#ff5900';
  ctx.shadowColor = 'rgba(255, 0, 0, 1)';
  ctx.shadowBlur = 8;

  ctx.setLineDash([]);
  
  function drawHellfireSymbiote(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const dist = Math.sqrt(dx*dx + dy*dy);
    
    ctx.save();
    ctx.translate(x1, y1);
    ctx.rotate(Math.atan2(dy, dx));

    ctx.beginPath();
    const ext = 80; 
    ctx.moveTo(-ext, -ext);           
    ctx.lineTo(dist + ext, -ext);     
    ctx.lineTo(dist - ext, ext);      
    ctx.lineTo(ext, ext);             
    ctx.closePath();
    ctx.clip();

    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    // Base Magma/Symbiote Line
    ctx.lineWidth = baseLineWidth;
    ctx.beginPath();
    for(let x=0; x<=dist; x+=5) {
        let y = Math.sin(x*0.05 + timeOffset*0.1) * (baseLineWidth * 0.2);
        if(x===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    }
    ctx.stroke();

    // Burning Tendrils
    const numTendrils = 4;
    for(let i=0; i<numTendrils; i++) {
        ctx.beginPath();
        ctx.lineWidth = baseLineWidth * (0.6 - i*0.1);
        let speed = 0.06 + i*0.02;
        let phase = i * 2.5;
        
        for(let x=0; x<=dist; x+=8) {
            let baseWave = Math.sin(x*0.04 + timeOffset*speed + phase) * (baseLineWidth * 0.8) + 
                         Math.cos(x*0.02 - timeOffset*speed*0.5) * (baseLineWidth * 0.4);
            let fireFlicker = Math.sin(x*0.2 - timeOffset*0.3 + i) * (baseLineWidth * 0.3); // Jitter seperti api
            
            let y = baseWave + fireFlicker;
            if(x===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
        }
        ctx.stroke();
    }

    // Floating Embers (Partikel Api Melayang)
    ctx.fillStyle = '#facc15'; 
    for(let x=10; x<dist; x+=25) {
        let flicker = Math.sin(x*12.5 + timeOffset*0.2);
        if (flicker > 0) {
            let pSpeed = 1 + flicker;
            let pOffset = (timeOffset * pSpeed) % (baseLineWidth * 4);
            let dir = (x % 2 === 0) ? 1 : -1;
            let pY = dir * (baseLineWidth*0.5 + pOffset);

            ctx.globalAlpha = Math.max(0, 1 - (pOffset / (baseLineWidth*4)));
            ctx.beginPath();
            ctx.arc(x, pY, baseLineWidth*0.15 + flicker*2, 0, Math.PI*2);
            ctx.fill();
        }
    }
    ctx.globalAlpha = 1.0;
    ctx.restore();
  }

  drawHellfireSymbiote(fx, fy, fx+fw, fy); 

  ctx.restore();
}

export default function QadhaSholatDashboard({ user, onBack }) {
    const [pendingLogs, setPendingLogs] = useState([]);
    const [completedLogs, setCompletedLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [selectedCompletedIds, setSelectedCompletedIds] = useState(new Set());
    
    // Manual Input State
    const [showManualInput, setShowManualInput] = useState(false);
    const [manualSholat, setManualSholat] = useState('subuh');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Sunnah Input State
    const [showSunnahInput, setShowSunnahInput] = useState(false);
    const [selectedSunnah, setSelectedSunnah] = useState(null);
    const [sunnahRakaat, setSunnahRakaat] = useState(2);
    const [sunnahWitir, setSunnahWitir] = useState(1);
    const [isSubmittingSunnah, setIsSubmittingSunnah] = useState(false);

    // Dynamic Tracking State
    const [pendingVerse, setPendingVerse] = useState("");
    const [isForgiving, setIsForgiving] = useState(false);
    const prevPendingRakaatRef = useRef(null);

    // Canvas Refs
    const canvasRef = useRef(null);
    const containerRef = useRef(null);

    const pendingTotalRakaat = pendingLogs.reduce((acc, l) => acc + getRakaat(l), 0);
    const pendingTotalWaktu = pendingLogs.length;

    // Color Logic Variables
    const numFires = pendingTotalRakaat >= 20 ? Math.floor((pendingTotalRakaat - 20) / 10) + 1 : 0;
    const maroonRatio = Math.min(1, numFires * 0.15); // Cap at 100% maroon
    const pendingBgColor = `rgb(${Math.round(255 - maroonRatio * (255 - 128))}, ${Math.round(255 - maroonRatio * 255)}, ${Math.round(255 - maroonRatio * 255)})`;
    const isPendingDark = maroonRatio > 0.5;

    const completedTotalRakaat = completedLogs.reduce((acc, l) => acc + getRakaat(l), 0);
    
    let darknessRatio = 1.0; // Start pure black
    darknessRatio -= Math.floor(completedTotalRakaat / 5) * 0.15; // 5 completed rakaat = whiter
    darknessRatio += Math.floor(pendingTotalRakaat / 20) * 0.2; // 20 pending rakaat = darker
    // Ensure "berkurang kelipatan 10" helps whiten (implicitly handled since lower pending means less darkness added)
    darknessRatio = Math.max(0, Math.min(1, darknessRatio)); // Clamp between 0 and 1
    const isCompletedDark = darknessRatio >= 0.5;

    // Canvas Hellfire Animation Effect
    useEffect(() => {
        if (numFires < 1) return;
        
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let timeOffset = 0;

        const resize = () => {
            canvas.width = container.offsetWidth + 100;
            canvas.height = container.offsetHeight + 100;
        };
        
        resize();
        window.addEventListener('resize', resize);

        const baseLineWidth = Math.min(15, numFires + 1);
        const isMaxLevel = numFires >= 15;

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            timeOffset += 1;
            drawEffect(ctx, 50, 50, container.offsetWidth, container.offsetHeight, timeOffset, baseLineWidth, isMaxLevel);
            animationFrameId = window.requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('resize', resize);
            window.cancelAnimationFrame(animationFrameId);
        };
    }, [numFires, pendingLogs.length]); // Re-run when fires change or list items change height

    useEffect(() => {
        if (prevPendingRakaatRef.current === null) {
            // First load initialization
            prevPendingRakaatRef.current = pendingTotalRakaat;
            const match = PENDING_VERSES.find(v => pendingTotalRakaat >= v.min);
            if (pendingTotalRakaat >= 20 && match) setPendingVerse(match.verse);
            return;
        }

        const prev = prevPendingRakaatRef.current;
        
        // Logika penurunan: jika rakaat berkurang dan melewati batas puluhan ke bawah
        if (pendingTotalRakaat < prev && Math.floor(prev / 10) > Math.floor(pendingTotalRakaat / 10)) {
            setIsForgiving(true);
            setPendingVerse(FORGIVING_VERSES[Math.floor(Math.random() * FORGIVING_VERSES.length)]);
        } 
        // Logika penambahan: jika rakaat bertambah dan melewati batas puluhan ke atas, membatalkan masa 'forgiving'
        else if (pendingTotalRakaat > prev && Math.floor(pendingTotalRakaat / 10) > Math.floor(prev / 10)) {
            setIsForgiving(false);
        }
        
        // Jika sedang TIDAK dalam masa forgiving, update ayat neraka sesuai jumlah rakaat saat ini
        if (!isForgiving || (pendingTotalRakaat > prev && Math.floor(pendingTotalRakaat / 10) > Math.floor(prev / 10))) {
            setIsForgiving(false);
            if (pendingTotalRakaat < 20) {
                setPendingVerse("");
            } else {
                const match = PENDING_VERSES.find(v => pendingTotalRakaat >= v.min);
                if (match) setPendingVerse(match.verse);
            }
        }

        prevPendingRakaatRef.current = pendingTotalRakaat;
    }, [pendingTotalRakaat, isForgiving]);

    useEffect(() => {
        fetchLogs();
    }, [user.id]);

    useEffect(() => {
        if (selectedSunnah && SUNNAH_RULES[selectedSunnah] && !SUNNAH_RULES[selectedSunnah].fixed) {
            setSunnahRakaat(SUNNAH_RULES[selectedSunnah].min || 2);
            setSunnahWitir(SUNNAH_RULES[selectedSunnah].witir === 'optional' ? 0 : (SUNNAH_RULES[selectedSunnah].witir ? 1 : 0));
        }
    }, [selectedSunnah]);

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

            setPendingLogs(pending.sort(sortLogsChronologically));
            setCompletedLogs(completed.sort(sortLogsChronologically));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const toggleSelect = (id) => {
        const newSet = new Set(selectedIds);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setSelectedIds(newSet);
    };

    const selectAll = () => {
        if (selectedIds.size === pendingLogs.length) setSelectedIds(new Set());
        else setSelectedIds(new Set(pendingLogs.map(l => l.id)));
    };

    const toggleSelectCompleted = (id) => {
        const newSet = new Set(selectedCompletedIds);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setSelectedCompletedIds(newSet);
    };

    const selectAllCompleted = () => {
        if (selectedCompletedIds.size === completedLogs.length) setSelectedCompletedIds(new Set());
        else setSelectedCompletedIds(new Set(completedLogs.map(l => l.id)));
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
            
            const itemsToMove = pendingLogs.filter(l => selectedIds.has(l.id));
            setPendingLogs(prev => prev.filter(l => !selectedIds.has(l.id)));
            setCompletedLogs(prev => {
                const updated = [...prev, ...itemsToMove.map(i => ({...i, status: 'completed'}))];
                return updated.sort(sortLogsChronologically);
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

    const handleMarkInvalidCompleted = async () => {
        if (selectedCompletedIds.size === 0) return;
        setLoading(true);
        try {
            const idsArray = Array.from(selectedCompletedIds);
            const { error } = await supabase
                .from('qadha_sholat_logs')
                .delete()
                .in('id', idsArray);

            if (error) throw error;
            
            setCompletedLogs(prev => prev.filter(l => !selectedCompletedIds.has(l.id)));
            setSelectedCompletedIds(new Set());
        } catch (err) {
            console.error(err);
            alert('Gagal menghapus riwayat sholat.');
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
                return updated.sort(sortLogsChronologically);
            });
            setShowManualInput(false);
        } catch (err) {
            console.error(err);
            alert('Gagal menambah qadha manual.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAddSunnah = async (e) => {
        e.preventDefault();
        if (!selectedSunnah) return;
        
        setIsSubmittingSunnah(true);
        try {
            const now = new Date();
            const dateStr = now.toISOString().split('T')[0];
            const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':');
            
            const rule = SUNNAH_RULES[selectedSunnah];
            let finalName = rule.name;
            
            if (!rule.fixed) {
                if (rule.witir === true) {
                    finalName = `${rule.name} (${sunnahRakaat} Rakaat + ${sunnahWitir} Witir)`;
                } else if (rule.witir === 'optional' && sunnahWitir > 0) {
                    finalName = `${rule.name} (${sunnahRakaat} Rakaat + ${sunnahWitir} Witir)`;
                } else {
                    finalName = `${rule.name} (${sunnahRakaat} Rakaat)`;
                }
            }

            const newLog = {
                user_id: user.id,
                sholat_name: finalName,
                date: dateStr,
                time: timeStr,
                status: 'completed'
            };

            const { data, error } = await supabase
                .from('qadha_sholat_logs')
                .insert([newLog])
                .select()
                .single();

            if (error) throw error;

            setCompletedLogs(prev => {
                const updated = [...prev, data];
                return updated.sort(sortLogsChronologically);
            });
            setShowSunnahInput(false);
            setSelectedSunnah(null);
        } catch (err) {
            console.error(err);
            alert('Gagal mencatat sholat sunnah.');
        } finally {
            setIsSubmittingSunnah(false);
        }
    };

    const handleWitirMinus = () => {
        if (!selectedSunnah) return;
        const isOpt = SUNNAH_RULES[selectedSunnah].witir === 'optional';
        if (sunnahWitir === 1 && isOpt) setSunnahWitir(0);
        else if (sunnahWitir > 1) setSunnahWitir(sunnahWitir - 2);
    };

    const handleWitirPlus = () => {
        if (sunnahWitir === 0) setSunnahWitir(1);
        else if (sunnahWitir < 11) setSunnahWitir(sunnahWitir + 2);
    };

    const formatIndoDate = (dateString) => {
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    // Calculate Completed Statistics
    const getStats = (keyword) => {
        const logs = completedLogs.filter(l => l.sholat_name.toLowerCase().includes(keyword.toLowerCase()));
        const rakaat = logs.reduce((acc, l) => acc + getRakaat(l), 0);
        return { waktu: logs.length, rakaat };
    };

    const fardhuLogs = completedLogs.filter(l => SHOLAT_ORDER.includes(l.sholat_name.toLowerCase()));
    const totalFardhuRakaat = fardhuLogs.reduce((acc, l) => acc + getRakaat(l), 0);
    const totalFardhuWaktu = fardhuLogs.length;

    const taubatStats = getStats('taubat');
    const tahajjudStats = getStats('tahajjud');
    const qiyamulLailStats = getStats('qiyamul lail');
    const tarawihStats = getStats('tarawih');

    const completedVerseMatch = COMPLETED_VERSES.find(v => completedTotalRakaat >= v.min);
    const completedVerse = completedVerseMatch ? completedVerseMatch.verse : "";

    return (
        <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 p-4 md:p-6 relative">
            <div className="max-w-6xl mx-auto space-y-6">
                
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

                {/* NEW SUMMARY CARDS TOP SECTION */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                    
                    {/* NEW CARD: Total Hutang Sholat Summary */}
                    <div 
                        ref={containerRef}
                        className={`rounded-2xl p-6 transition-colors duration-700 shadow-sm border ${isPendingDark ? 'border-red-900/50' : 'border-slate-100 dark:border-slate-800'} flex flex-col justify-center relative`}
                        style={{ backgroundColor: pendingBgColor, color: isPendingDark ? 'white' : 'inherit' }}
                    >
                        {numFires >= 1 && (
                            <canvas 
                                ref={canvasRef} 
                                className="absolute -inset-[50px] pointer-events-none z-10"
                                style={{ width: 'calc(100% + 100px)', height: 'calc(100% + 100px)' }}
                            />
                        )}
                        
                        <div className="relative z-20">
                            <h3 className={`font-bold text-lg mb-6 ${isPendingDark ? 'text-white' : 'text-slate-800 dark:text-slate-100'}`}>Summary Hutang Sholat</h3>
                            <div className="flex justify-between items-end mb-4">
                                <div>
                                    <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${isPendingDark ? 'opacity-80' : 'text-slate-500'}`}>Total 5 Waktu</p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl font-black">{pendingTotalWaktu}</span>
                                        <span className={`text-sm font-bold ${isPendingDark ? 'opacity-80' : 'text-slate-500'}`}>Waktu</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${isPendingDark ? 'opacity-80' : 'text-slate-500'}`}>Total Rakaat</p>
                                    <div className="text-3xl font-black flex items-center justify-end gap-2 text-rose-500">
                                        {pendingTotalRakaat >= 20 ? '😈' : (pendingTotalRakaat >= 10 ? '⚠️' : '')}
                                        <span className={isPendingDark ? 'text-white' : 'text-slate-800 dark:text-slate-100'}>{pendingTotalRakaat}</span>
                                        {pendingTotalRakaat >= 20 ? '😈' : (pendingTotalRakaat >= 10 ? '⚠️' : '')}
                                    </div>
                                </div>
                            </div>

                            {/* Ayat & Fire Icons */}
                            {pendingVerse && (
                                <div className={`mt-4 pt-4 border-t ${isPendingDark ? 'border-red-400/30' : 'border-slate-200 dark:border-slate-700'}`}>
                                    <p className={`text-xs font-medium italic mb-3 leading-relaxed ${isForgiving ? (isPendingDark ? 'text-emerald-300' : 'text-emerald-600 dark:text-emerald-400') : ''}`}>{pendingVerse}</p>
                                    {numFires > 0 && !isForgiving && (
                                        <div className="flex flex-wrap gap-1">
                                            {Array.from({ length: numFires }).map((_, i) => (
                                                <span key={i} className="text-xl">🔥</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* NEW CARD: Total Sholat Sejauh Ini Summary */}
                    {(() => {
                        return (
                            <div 
                                className={`rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-between relative overflow-hidden transition-colors duration-700`}
                                style={{ 
                                    backgroundColor: `rgba(0, 0, 0, ${darknessRatio})`, 
                                    color: isCompletedDark ? 'white' : '#1e293b'
                                }}
                            >
                                <div className={`absolute inset-0 bg-white -z-20`}></div>
                                <div className={`absolute inset-0 bg-black -z-10 transition-opacity duration-700`} style={{ opacity: darknessRatio }}></div>

                                <div className="relative z-10 space-y-4">
                                    <h3 className={`font-bold text-lg ${isCompletedDark ? 'text-white' : 'text-slate-800 dark:text-slate-100'}`}>Pencapaian Kebaikan Anda</h3>
                                    
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                                        <div>
                                            <p className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 ${isCompletedDark ? 'text-slate-300' : 'text-slate-500'}`}>Sholat 5 Waktu</p>
                                            <p className="font-black text-lg">{totalFardhuWaktu} <span className="font-normal text-[10px] opacity-70 uppercase">Waktu</span> <span className="text-emerald-500 mx-1">•</span> <span className="text-emerald-500">{totalFardhuRakaat}</span> <span className="font-normal text-[10px] opacity-70 uppercase">Rakaat</span></p>
                                        </div>
                                        {taubatStats.waktu > 0 && <div>
                                            <p className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 ${isCompletedDark ? 'text-slate-300' : 'text-slate-500'}`}>Sholat Taubat</p>
                                            <p className="font-black text-lg">{taubatStats.waktu} <span className="font-normal text-[10px] opacity-70 uppercase">x</span> <span className="text-emerald-500 mx-1">•</span> <span className="text-emerald-500">{taubatStats.rakaat}</span> <span className="font-normal text-[10px] opacity-70 uppercase">Rakaat</span></p>
                                        </div>}
                                        {tahajjudStats.waktu > 0 && <div>
                                            <p className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 ${isCompletedDark ? 'text-slate-300' : 'text-slate-500'}`}>Tahajjud</p>
                                            <p className="font-black text-lg">{tahajjudStats.waktu} <span className="font-normal text-[10px] opacity-70 uppercase">x</span> <span className="text-emerald-500 mx-1">•</span> <span className="text-emerald-500">{tahajjudStats.rakaat}</span> <span className="font-normal text-[10px] opacity-70 uppercase">Rakaat</span></p>
                                        </div>}
                                        {qiyamulLailStats.waktu > 0 && <div>
                                            <p className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 ${isCompletedDark ? 'text-slate-300' : 'text-slate-500'}`}>Qiyamul Lail</p>
                                            <p className="font-black text-lg">{qiyamulLailStats.waktu} <span className="font-normal text-[10px] opacity-70 uppercase">x</span> <span className="text-emerald-500 mx-1">•</span> <span className="text-emerald-500">{qiyamulLailStats.rakaat}</span> <span className="font-normal text-[10px] opacity-70 uppercase">Rakaat</span></p>
                                        </div>}
                                        {tarawihStats.waktu > 0 && <div>
                                            <p className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 ${isCompletedDark ? 'text-slate-300' : 'text-slate-500'}`}>Tarawih</p>
                                            <p className="font-black text-lg">{tarawihStats.waktu} <span className="font-normal text-[10px] opacity-70 uppercase">x</span> <span className="text-emerald-500 mx-1">•</span> <span className="text-emerald-500">{tarawihStats.rakaat}</span> <span className="font-normal text-[10px] opacity-70 uppercase">Rakaat</span></p>
                                        </div>}
                                    </div>

                                    <div className={`pt-3 border-t ${isCompletedDark ? 'border-slate-700' : 'border-slate-200 dark:border-slate-800'} flex items-end justify-between`}>
                                        <span className="font-bold text-sm uppercase tracking-wide">Total Keseluruhan</span>
                                        <div className="text-3xl font-black text-emerald-500 flex items-center gap-2">
                                            {completedTotalRakaat >= 100 ? '👼' : (completedTotalRakaat > 0 ? '🌊' : '')}
                                            {completedTotalRakaat}
                                            {completedTotalRakaat >= 100 ? '👼' : (completedTotalRakaat > 0 ? '🌊' : '')}
                                        </div>
                                    </div>

                                    <div className="pt-2">
                                        <p className={`text-xs font-medium italic mb-3 leading-relaxed opacity-90 ${isCompletedDark ? 'text-slate-300' : 'text-slate-600 dark:text-slate-400'}`}>{completedVerse}</p>
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            {Array.from({ length: Math.floor(completedTotalRakaat / 5) }).map((_, i) => (
                                                <span key={i} className="text-lg">❤️</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })()}

                </div>

                {/* HORIZONTAL GRID LAYOUT FOR LISTS */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                    
                    {/* List Qadha (Pending) */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-full">
                        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <h4 className="font-bold text-slate-700 dark:text-slate-200 text-sm">Daftar Hutang Sholat</h4>
                                <div className="flex items-center gap-3">
                                    {pendingLogs.length > 0 && (
                                        <button onClick={selectAll} className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
                                            {selectedIds.size === pendingLogs.length ? 'Batal Pilih Semua' : 'Pilih Semua'}
                                        </button>
                                    )}
                                </div>
                            </div>
                            
                            <button 
                                onClick={() => setShowManualInput(!showManualInput)}
                                className="w-full py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 text-xs shadow-sm"
                            >
                                <Plus size={14} /> Tambah Manual
                            </button>

                            {selectedIds.size > 0 && (
                                <div className="grid grid-cols-2 gap-2 animate-in fade-in zoom-in duration-200 mt-1">
                                    <button 
                                        onClick={handleMarkDone}
                                        disabled={loading}
                                        className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold transition-colors shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-1.5 text-xs"
                                    >
                                        <CheckCircle2 size={14} /> Sudah
                                    </button>
                                    <button 
                                        onClick={handleMarkInvalid}
                                        disabled={loading}
                                        className="w-full py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold transition-colors shadow-lg shadow-rose-500/20 flex items-center justify-center gap-1.5 text-xs"
                                    >
                                        <XCircle size={14} /> Tidak Valid
                                    </button>
                                </div>
                            )}
                        </div>

                        {showManualInput && (
                            <div className="p-4 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 animate-in fade-in slide-in-from-top-2">
                                <h4 className="font-bold text-slate-700 dark:text-slate-200 mb-3 text-xs border-b border-slate-100 dark:border-slate-800 pb-2">Input Qadha Manual</h4>
                                <form onSubmit={handleAddManual} className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-wider">Waktu Sholat</label>
                                        <div className="flex flex-wrap gap-2">
                                            {SHOLAT_ORDER.map(sholat => (
                                                <button
                                                    key={sholat}
                                                    type="button"
                                                    onClick={() => setManualSholat(sholat)}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                                                        manualSholat === sholat 
                                                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/20' 
                                                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                                                    }`}
                                                >
                                                    {sholat.charAt(0).toUpperCase() + sholat.slice(1)}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <button 
                                            type="submit" 
                                            disabled={isSubmitting}
                                            className="w-full py-2.5 bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 text-white rounded-xl font-bold transition-colors disabled:opacity-50 text-sm"
                                        >
                                            {isSubmitting ? 'Menyimpan...' : 'Simpan Qadha'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[500px] overflow-y-auto no-scrollbar flex-1">
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
                                            <div className="absolute right-0 bottom-0 opacity-5 dark:opacity-10 pointer-events-none transition-transform group-hover:scale-110 group-hover:-translate-y-1 group-hover:-translate-x-1 duration-300">
                                                <div className="text-3xl font-black uppercase whitespace-nowrap -mr-4 -mb-2">
                                                    {formatIndoDate(log.date)} {log.time !== '-' ? log.time : ''}
                                                </div>
                                            </div>
                                            
                                            <h5 className="font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wide flex items-center gap-2">
                                                {log.sholat_name} <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full text-slate-500">{getRakaat(log)} Rakaat</span>
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
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-full">
                        <div className="px-4 py-3 border-b border-emerald-100 dark:border-emerald-900/30 bg-emerald-50 dark:bg-emerald-900/10 flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-bold text-emerald-800 dark:text-emerald-400 text-sm">Daftar Sholat Diselesaikan</h4>
                                    <p className="text-[10px] text-emerald-600 dark:text-emerald-500 font-medium">{completedLogs.reduce((acc, l) => acc + getRakaat(l), 0)} Rakaat total dicatat</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {completedLogs.length > 0 && (
                                        <button onClick={selectAllCompleted} className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline mr-2">
                                            {selectedCompletedIds.size === completedLogs.length ? 'Batal Pilih Semua' : 'Pilih Semua'}
                                        </button>
                                    )}
                                    <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center shrink-0">
                                        <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={() => setShowSunnahInput(!showSunnahInput)}
                                className="w-full py-2 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-900/60 rounded-xl font-bold transition-colors flex items-center justify-center gap-1.5 text-xs shadow-sm"
                            >
                                <Plus size={14} /> Ingin catat sholat sunnah hari ini?
                            </button>

                            {selectedCompletedIds.size > 0 && (
                                <div className="animate-in fade-in zoom-in duration-200 mt-1">
                                    <button 
                                        onClick={handleMarkInvalidCompleted}
                                        disabled={loading}
                                        className="w-full py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold transition-colors shadow-lg shadow-rose-500/20 flex items-center justify-center gap-1.5 text-xs"
                                    >
                                        <XCircle size={14} /> Singkirkan yang Tidak Valid ({selectedCompletedIds.size})
                                    </button>
                                </div>
                            )}
                        </div>

                        {showSunnahInput && (
                            <div className="p-4 bg-emerald-50/50 dark:bg-emerald-900/10 border-b border-slate-100 dark:border-slate-800 animate-in fade-in slide-in-from-top-2">
                                <form onSubmit={handleAddSunnah} className="space-y-4">
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-wider">Pilih Sholat Sunnah</label>
                                        <div className="flex flex-wrap gap-1.5">
                                            {Object.entries(SUNNAH_RULES).map(([key, rule]) => (
                                                <button
                                                    key={key}
                                                    type="button"
                                                    onClick={() => setSelectedSunnah(key)}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                                                        selectedSunnah === key 
                                                            ? 'bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-600/20' 
                                                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                                                    }`}
                                                >
                                                    {rule.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {selectedSunnah && !SUNNAH_RULES[selectedSunnah].fixed && (
                                        <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Jumlah Rakaat</span>
                                                <div className="flex items-center gap-3">
                                                    <button type="button" onClick={() => setSunnahRakaat(Math.max(SUNNAH_RULES[selectedSunnah].min, sunnahRakaat - SUNNAH_RULES[selectedSunnah].increment))} className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center hover:bg-slate-200 font-bold text-slate-600 dark:text-slate-300">-</button>
                                                    <span className="font-black text-sm w-4 text-center text-slate-800 dark:text-slate-100">{sunnahRakaat}</span>
                                                    <button type="button" onClick={() => setSunnahRakaat(sunnahRakaat + SUNNAH_RULES[selectedSunnah].increment)} className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center hover:bg-slate-200 font-bold text-slate-600 dark:text-slate-300">+</button>
                                                </div>
                                            </div>
                                            
                                            {(SUNNAH_RULES[selectedSunnah].witir === true || SUNNAH_RULES[selectedSunnah].witir === 'optional') && (
                                                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700">
                                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                                        Witir <span className="text-[10px] text-slate-400 font-normal">Maks. 11</span>
                                                        {SUNNAH_RULES[selectedSunnah].witir === 'optional' && <span className="text-[10px] bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 ml-1.5 rounded text-slate-500">Opsional</span>}
                                                    </span>
                                                    <div className="flex items-center gap-3">
                                                        <button type="button" onClick={handleWitirMinus} className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center hover:bg-slate-200 font-bold text-slate-600 dark:text-slate-300">-</button>
                                                        <span className="font-black text-sm w-4 text-center text-slate-800 dark:text-slate-100">{sunnahWitir}</span>
                                                        <button type="button" onClick={handleWitirPlus} className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center hover:bg-slate-200 font-bold text-slate-600 dark:text-slate-300">+</button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <button 
                                        type="submit" 
                                        disabled={isSubmittingSunnah || !selectedSunnah}
                                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-colors disabled:opacity-50 text-sm"
                                    >
                                        {isSubmittingSunnah ? 'Menyimpan...' : 'Simpan Sholat Sunnah'}
                                    </button>
                                </form>
                            </div>
                        )}

                        <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[500px] overflow-y-auto no-scrollbar opacity-80 flex-1">
                            {loading && completedLogs.length === 0 ? (
                                <div className="py-10 text-center text-slate-400 text-sm">Memuat data...</div>
                            ) : completedLogs.length === 0 ? (
                                <div className="py-8 text-center text-slate-400 text-xs font-medium">
                                    Belum ada riwayat sholat yang diselesaikan.
                                </div>
                            ) : (
                                completedLogs.map((log) => (
                                    <div 
                                        key={log.id} 
                                        onClick={() => toggleSelectCompleted(log.id)}
                                        className={`p-3 px-4 flex items-center gap-4 cursor-pointer transition-colors ${selectedCompletedIds.has(log.id) ? 'bg-emerald-50/50 dark:bg-emerald-900/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                                    >
                                        <div className="shrink-0 text-emerald-500">
                                            {selectedCompletedIds.has(log.id) ? <CheckSquare size={18} /> : <Square size={18} className="text-slate-300 dark:text-slate-600" />}
                                        </div>
                                        <div className="flex-1 relative overflow-hidden group">
                                            <div className="absolute right-0 bottom-0 opacity-5 dark:opacity-10 pointer-events-none transition-transform group-hover:scale-110 group-hover:-translate-y-1 group-hover:-translate-x-1 duration-300">
                                                <div className="text-3xl font-black uppercase whitespace-nowrap -mr-4 -mb-2">
                                                    {formatIndoDate(log.date)} {log.time !== '-' ? log.time : ''}
                                                </div>
                                            </div>
                                            
                                            <h5 className="font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wide flex items-center gap-2 text-sm leading-tight">
                                                {log.sholat_name} <span className="text-[10px] bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded-full text-slate-400 shrink-0">{getRakaat(log)} Rakaat</span>
                                            </h5>
                                            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-1 flex items-center gap-1">
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
        </div>
    );
}
