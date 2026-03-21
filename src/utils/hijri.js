export function getRamadansInRange(startDateStr, endDateStr) {
    const formatter = new Intl.DateTimeFormat('id-ID-u-ca-islamic', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric'
    });

    const parseHijri = (d) => {
        const parts = formatter.format(d).split(' ')[0].split('/'); // id-ID format: "9/2/1445 H" -> "9/2/1445"
        return {
            day: parseInt(parts[0]),     // DD
            month: parseInt(parts[1]),   // MM
            year: parseInt(parts[2])     // YYYY
        };
    };

    let start = new Date(startDateStr);
    let end = new Date(endDateStr);

    let ramadans = [];
    let currentRamadan = null;

    let d = new Date(start);
    d.setHours(12, 0, 0, 0);

    const getGregorianMonthName = (date) => date.toLocaleString('id-ID', { month: 'long' });

    while (d <= end) {
        const h = parseHijri(d);
        if (h.month === 9) {
            if (!currentRamadan) {
                currentRamadan = {
                    hijriYear: h.year,
                    startDate: new Date(d),
                    endDate: new Date(d),
                    days: 1
                };
            } else {
                currentRamadan.endDate = new Date(d);
                currentRamadan.days++;
            }
        } else {
            if (currentRamadan) {
                currentRamadan.gregorianStartStr = `${currentRamadan.startDate.getDate()} ${getGregorianMonthName(currentRamadan.startDate)} ${currentRamadan.startDate.getFullYear()}`;
                currentRamadan.gregorianEndStr = `${currentRamadan.endDate.getDate()} ${getGregorianMonthName(currentRamadan.endDate)} ${currentRamadan.endDate.getFullYear()}`;
                ramadans.push({...currentRamadan, gregorianYear: currentRamadan.startDate.getFullYear()});
                currentRamadan = null;

                d.setDate(d.getDate() + 320); // skip to next year
                continue;
            }
        }
        d.setDate(d.getDate() + 1);
    }
    
    if (currentRamadan) {
       currentRamadan.gregorianStartStr = `${currentRamadan.startDate.getDate()} ${getGregorianMonthName(currentRamadan.startDate)} ${currentRamadan.startDate.getFullYear()}`;
       currentRamadan.gregorianEndStr = `${currentRamadan.endDate.getDate()} ${getGregorianMonthName(currentRamadan.endDate)} ${currentRamadan.endDate.getFullYear()}`;
       ramadans.push({...currentRamadan, gregorianYear: currentRamadan.startDate.getFullYear()});
    }

    return ramadans;
}

export function getTodayHijri() {
    const formatter = new Intl.DateTimeFormat('id-ID-u-ca-islamic', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric'
    });

    const formatted = formatter.format(new Date());
    const matches = formatted.match(/\d+/g);
    if (!matches || matches.length < 3) {
        // Fallback or error log
        return { day: 1, month: 1, year: 1447 };
    }
    return {
        day: parseInt(matches[0]),
        month: parseInt(matches[1]),
        year: parseInt(matches[2])
    };
}

export function getFastingStatus(hijriDate) {
    const { day, month } = hijriDate;
    
    // 1 Shawwal: Eid al-Fitr
    if (month === 10 && day === 1) {
        return { halal: false, reason: "Haram: Hari Raya Idul Fitri" };
    }
    
    // 10 Dhu al-Hijjah: Eid al-Adha
    if (month === 12 && day === 10) {
        return { halal: false, reason: "Haram: Hari Raya Idul Adha" };
    }
    
    // 11, 12, 13 Dhu al-Hijjah: Tashreeq days
    if (month === 12 && (day === 11 || day === 12 || day === 13)) {
        return { halal: false, reason: "Haram: Hari Tasyrik" };
    }
    
    // Ramadan month (should fast Ramadan itself)
    if (month === 9) {
        return { halal: false, reason: "Bulan Ramadhan: Fokus Puasa Ramadhan" };
    }

    return { halal: true, reason: "Halal: Waktu yang diperbolehkan untuk puasa Qadha" };
}

export function getSunnahRecommendations(hijriDate, gregorianDate = new Date()) {
    const { day, month, year } = hijriDate;
    const dayOfWeek = gregorianDate.getDay(); // 0 = Sun, 1 = Mon, ...
    const recommendations = [];

    // Exclude Ramadan for sunnah recommendations (must fast Ramadan)
    if (month === 9) return [];

    const formatShortDate = (date) => {
        return date.toLocaleString('id-ID', { day: 'numeric', month: 'short' });
    };

    const getGregorianDate = (targetDay, targetMonth, targetYear) => {
        let d = new Date(gregorianDate);
        d.setHours(12, 0, 0, 0);
        
        const formatter = new Intl.DateTimeFormat('id-ID-u-ca-islamic', {
            day: 'numeric', month: 'numeric', year: 'numeric'
        });

        // Search within a wider window
        for (let i = -60; i < 60; i++) {
            let testDate = new Date(d);
            testDate.setDate(d.getDate() + i);
            const formatted = formatter.format(testDate);
            const matches = formatted.match(/\d+/g);
            
            if (!matches || matches.length < 3) continue;

            const hDay = parseInt(matches[0]);
            const hMonth = parseInt(matches[1]);
            const hYear = parseInt(matches[2]);

            if (hDay === targetDay && hMonth === targetMonth && hYear === targetYear) {
                return testDate;
            }
        }
        return null;
    };

    // Monday (Senin)
    if (dayOfWeek === 1) {
        recommendations.push({
            name: "Puasa Sunah Senin",
            range: `${gregorianDate.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}`
        });
    }
    
    // Thursday (Kamis)
    if (dayOfWeek === 4) {
        recommendations.push({
            name: "Puasa Sunah Kamis",
            range: `${gregorianDate.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}`
        });
    }

    // Ayyamul Bidh (13, 14, 15 of Hijri month)
    const isTashreek = month === 12 && (day === 11 || day === 12 || day === 13);
    if ((day === 13 || day === 14 || day === 15) && !isTashreek) {
        const d13 = getGregorianDate(13, month, year);
        const d15 = getGregorianDate(15, month, year);
        recommendations.push({
            name: "Puasa Ayyamul Bidh",
            range: `${d13 && d15 ? `${formatShortDate(d13)} - ${formatShortDate(d15)}` : 'Tanggal 13, 14, 15'} (${hijriMonthName(month)})`
        });
    }

    // Muharram: Tasu'a (9) and Ashura (10)
    if (month === 1 && (day === 9 || day === 10)) {
        const d9 = getGregorianDate(9, 1, year);
        const d10 = getGregorianDate(10, 1, year);
        recommendations.push({
            name: "Puasa Tasu'a & Asyura",
            range: `${d9 && d10 ? `${formatShortDate(d9)} - ${formatShortDate(d10)}` : '9-10 Muharram'}`
        });
    }

    // Shawwal: 6 days
    if (month === 10 && day >= 2 && day <= 30) {
        const d2 = getGregorianDate(2, 10, year);
        const d7 = getGregorianDate(7, 10, year);
        const d30 = getGregorianDate(30, 10, year) || getGregorianDate(29, 10, year);
        
        recommendations.push({
            name: "Puasa Sunah 6 Hari Syawal",
            range: `${d2 && d7 ? `Utama: ${formatShortDate(d2)} - ${formatShortDate(d7)}` : 'Pilih 6 hari'} (Hingga ${d30 ? formatShortDate(d30) : 'akhir bulan'})`
        });
    }

    // Dhu al-Hijjah: first 9 days
    if (month === 12 && day >= 1 && day <= 9) {
        const d1 = getGregorianDate(1, 12, year);
        const d9 = getGregorianDate(9, 12, year);
        recommendations.push({
            name: "Puasa Sunah Awal Dzulhijjah",
            range: `${d1 && d9 ? `${formatShortDate(d1)} - ${formatShortDate(d9)}` : '1-9 Dzulhijjah'}`
        });
    }

    // Shaban
    if (month === 8) {
        recommendations.push({
            name: "Anjuran Puasa Sunah Sya'ban",
            range: "Selama bulan Sya'ban"
        });
    }

    return recommendations;
}

function hijriMonthName(month) {
    const months = [
        "Muharram", "Safar", "Rabi'ul Awal", "Rabi'ul Akhir", 
        "Jumadil Awal", "Jumadil Akhir", "Rajab", "Sya'ban", 
        "Ramadhan", "Syawal", "Dzulqa'dah", "Dzulhijjah"
    ];
    return months[month - 1] || "";
}
