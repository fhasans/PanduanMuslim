import React, { useState } from 'react';
import TabButton from '../../ui/TabButton.jsx';
import SholatWajibView from './SholatWajibView.jsx';
import SholatSunnahView from './SholatSunnahView.jsx';
import DzikirView from './DzikirView.jsx';

export default function ModeHarian() {
    const [subTab, setSubTab] = useState('wajib');

    return (
        <div className="space-y-4 p-2 md:p-0">
            <div className="bg-slate-100/70 p-1 rounded-xl flex gap-1 overflow-x-auto no-scrollbar">
                <TabButton label="Sholat Wajib" active={subTab === 'wajib'} onClick={() => setSubTab('wajib')} />
                <TabButton label="Sunnah Rawatib" active={subTab === 'sunnah'} onClick={() => setSubTab('sunnah')} />
                <TabButton label="Dzikir Setelah" active={subTab === 'dzikir'} onClick={() => setSubTab('dzikir')} />
            </div>
            <div className="pt-2">
                {subTab === 'wajib' && <SholatWajibView onGoToDzikir={() => setSubTab('dzikir')} />}
                {subTab === 'sunnah' && <SholatSunnahView />}
                {subTab === 'dzikir' && <DzikirView />}
            </div>
        </div>
    );
}
