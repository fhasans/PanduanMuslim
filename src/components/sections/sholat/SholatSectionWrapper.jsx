import React, { useState } from 'react';
import { Clock, Star, Calendar, Users } from 'lucide-react';
import ModeButton from '../../ui/ModeButton.jsx';
import ModeHarian from './ModeHarian.jsx';
import ModeRamadhan from './ModeRamadhan.jsx';
import ModeHariRaya from './ModeHariRaya.jsx';
import ModeJenazah from './ModeJenazah.jsx';

export default function SholatSectionWrapper() {
    const [appMode, setAppMode] = useState('harian');

    return (
        <div className="space-y-6">
            <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold text-slate-900">Panduan Sholat</h2>
                <p className="text-slate-500 text-sm mt-1">Pilih mode ibadah sesuai waktu pelaksanaannya.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-slate-200/50 p-1.5 rounded-2xl">
                <ModeButton icon={<Clock size={16} />} label="Harian" active={appMode === 'harian'} onClick={() => setAppMode('harian')} />
                <ModeButton icon={<Star size={16} />} label="Ramadhan" active={appMode === 'ramadhan'} onClick={() => setAppMode('ramadhan')} />
                <ModeButton icon={<Calendar size={16} />} label="Hari Raya" active={appMode === 'hariraya'} onClick={() => setAppMode('hariraya')} />
                <ModeButton icon={<Users size={16} />} label="Jenazah" active={appMode === 'jenazah'} onClick={() => setAppMode('jenazah')} />
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-1 md:p-6 min-h-[50vh]">
                {appMode === 'harian' && <ModeHarian />}
                {appMode === 'ramadhan' && <ModeRamadhan />}
                {appMode === 'hariraya' && <ModeHariRaya />}
                {appMode === 'jenazah' && <ModeJenazah />}
            </div>
        </div>
    );
}
