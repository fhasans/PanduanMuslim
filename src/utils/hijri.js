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
