import React, { useState } from 'react';
import TabButton from '../../ui/TabButton.jsx';
import TarawihView from './TarawihView.jsx';
import WitirView from './WitirView.jsx';

export default function ModeRamadhan() {
    const [subTab, setSubTab] = useState('tarawih');

    return (
        <div className="space-y-4 p-2 md:p-0">
            <div className="bg-slate-100/70 p-1 rounded-xl flex gap-1 overflow-x-auto no-scrollbar">
                <TabButton label="Sholat Tarawih" active={subTab === 'tarawih'} onClick={() => setSubTab('tarawih')} />
                <TabButton label="Sholat Witir" active={subTab === 'witir'} onClick={() => setSubTab('witir')} />
            </div>
            <div className="pt-2">
                {subTab === 'tarawih' && <TarawihView />}
                {subTab === 'witir' && <WitirView />}
            </div>
        </div>
    );
}
