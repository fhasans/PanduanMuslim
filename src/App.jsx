import React, { useState, useEffect } from 'react';
import {
    BookOpen,
    Droplets,
    Moon,
    Heart,
    Home,
    Book,
    Compass,
    Bookmark,
    Sun,
    Download
} from 'lucide-react';
import { DesktopNavButton, MobileNavButton } from './components/layout/NavButtons.jsx';
import BerandaSection from './components/sections/BerandaSection.jsx';
import WudhuSection from './components/sections/WudhuSection.jsx';
import PuasaSection from './components/sections/PuasaSection.jsx';
import HafalanSection from './components/sections/HafalanSection.jsx';
import SholatSectionWrapper from './components/sections/sholat/SholatSectionWrapper.jsx';
import QuranSection from './components/sections/quran/QuranSection.jsx';
import JadwalSholatSection from './components/sections/JadwalSholatSection.jsx';
import DoaSection from './components/sections/DoaSection.jsx';
import PinnedSchedule from './components/layout/PinnedSchedule.jsx';
import RandomAyat from './components/layout/RandomAyat.jsx';
import QadhaTracker from './components/sections/qadha/QadhaTracker.jsx';

export default function App() {
    const [activeTab, setActiveTab] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('lastActiveTab') || 'beranda';
        }
        return 'beranda';
    });
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [secretTapCount, setSecretTapCount] = useState(0);
    const [lastTapTime, setLastTapTime] = useState(0);
    const [showQadhaTracker, setShowQadhaTracker] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('theme');
            if (saved) return saved === 'dark';
            return window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        return false;
    });
    const [isIOS, setIsIOS] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);
    const [showIOSPrompt, setShowIOSPrompt] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('lastActiveTab', activeTab);
        }
    }, [activeTab]);

    useEffect(() => {
        const handleBeforeInstallPrompt = (e) => {
            // Prevent Chrome 67 and earlier from automatically showing the prompt
            e.preventDefault();
            // Stash the event so it can be triggered later.
            setDeferredPrompt(e);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        // Detect iOS
        const userAgent = window.navigator.userAgent.toLowerCase();
        const ios = /iphone|ipad|ipod/.test(userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
        setIsIOS(ios);

        // Detect if already installed (standalone)
        const standalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
        setIsStandalone(standalone);

        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, [isDarkMode]);

    const handleInstallClick = async () => {
        if (isIOS) {
            setShowIOSPrompt(true);
            return;
        }
        if (!deferredPrompt) return;
        // Show the install prompt
        deferredPrompt.prompt();
        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);
        // We've used the prompt, and can't use it again, throw it away
        setDeferredPrompt(null);
    };

    const handleLogoClick = () => {
        setActiveTab('beranda');
        const now = Date.now();
        if (now - lastTapTime > 600) {
            setSecretTapCount(1);
        } else {
            const newCount = secretTapCount + 1;
            setSecretTapCount(newCount);
            if (newCount >= 7) {
                setShowQadhaTracker(true);
                setSecretTapCount(0);
            }
        }
        setLastTapTime(now);
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'wudhu': return <WudhuSection />;
            case 'sholat': return <SholatSectionWrapper />;
            case 'puasa': return <PuasaSection />;
            case 'hafalan': return <HafalanSection />;
            case 'quran': return <QuranSection />;
            case 'jadwal': return <JadwalSholatSection />;
            case 'doa': return <DoaSection />;
            default: return <BerandaSection setTab={setActiveTab} onSecretTap={handleLogoClick} />;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans text-slate-800 dark:text-slate-100 pb-20 md:pb-0 transition-colors">
            {showQadhaTracker && <QadhaTracker onClose={() => setShowQadhaTracker(false)} />}
            
            {/* Mobile Pinned Schedule - sticky top */}
            <div className="md:hidden sticky top-0 z-40 bg-white">
                <PinnedSchedule />
            </div>

            <nav className="hidden md:block sticky top-0 z-50 bg-white shadow-sm border-b border-emerald-100">
                <div className="max-w-4xl mx-auto px-4 sm:px-6">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2 cursor-pointer select-none" onClick={handleLogoClick}>
                                <BookOpen className="h-8 w-8 text-emerald-600" />
                                <span className="font-bold text-xl text-emerald-900">Sunnah<span className="text-emerald-500">Guide</span></span>
                            </div>
                            <button 
                                onClick={() => setIsDarkMode(!isDarkMode)}
                                className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
                            >
                                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                            </button>
                            {(deferredPrompt || (isIOS && !isStandalone)) && (
                                <button 
                                    onClick={handleInstallClick}
                                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 px-4 rounded-xl transition-all shadow-sm shadow-emerald-200"
                                >
                                    <Download size={14} /> {isIOS ? 'Cara Instal' : 'Install App'}
                                </button>
                            )}
                        </div>
                        <div className="flex space-x-1 shrink-0 overflow-x-auto no-scrollbar">
                            <DesktopNavButton icon={<Home size={18} />} label="Beranda" active={activeTab === 'beranda'} onClick={() => setActiveTab('beranda')} />
                            <DesktopNavButton icon={<Droplets size={18} />} label="Wudhu" active={activeTab === 'wudhu'} onClick={() => setActiveTab('wudhu')} />
                            <DesktopNavButton icon={<Moon size={18} />} label="Sholat" active={activeTab === 'sholat'} onClick={() => setActiveTab('sholat')} />
                            <DesktopNavButton icon={<Heart size={18} />} label="Puasa" active={activeTab === 'puasa'} onClick={() => setActiveTab('puasa')} />
                            <DesktopNavButton icon={<Book size={18} />} label="Hafalan" active={activeTab === 'hafalan'} onClick={() => setActiveTab('hafalan')} />
                            <DesktopNavButton icon={<BookOpen size={18} />} label="Qur'an" active={activeTab === 'quran'} onClick={() => setActiveTab('quran')} />
                            <DesktopNavButton icon={<Compass size={18} />} label="Jadwal" active={activeTab === 'jadwal'} onClick={() => setActiveTab('jadwal')} />
                            <DesktopNavButton icon={<Bookmark size={18} />} label="Doa" active={activeTab === 'doa'} onClick={() => setActiveTab('doa')} />
                        </div>
                    </div>
                </div>
            </nav>
            
            {/* Desktop Pinned Schedule - sticky right below nav */}
            <div className="hidden md:block sticky top-16 z-40 shadow-sm border-b border-emerald-100/50">
                <PinnedSchedule />
            </div>

            {/* Random Ayat Pinned Section */}
            <RandomAyat />

            <main className="max-w-4xl mx-auto px-4 py-6 animate-in fade-in duration-500">
                {renderContent()}
            </main>

            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 h-16 px-1 z-50 safe-area-pb shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] overflow-x-auto no-scrollbar">
                <div className="flex items-center w-max min-w-full justify-around h-full px-2 gap-1 pb-1">
                    <MobileNavButton icon={<Home size={20} />} label="Beranda" active={activeTab === 'beranda'} onClick={() => setActiveTab('beranda')} />
                    <MobileNavButton icon={<Droplets size={20} />} label="Wudhu" active={activeTab === 'wudhu'} onClick={() => setActiveTab('wudhu')} />
                    <MobileNavButton icon={<Moon size={20} />} label="Sholat" active={activeTab === 'sholat'} onClick={() => setActiveTab('sholat')} />
                    <MobileNavButton icon={<Heart size={20} />} label="Puasa" active={activeTab === 'puasa'} onClick={() => setActiveTab('puasa')} />
                    <MobileNavButton icon={<Book size={20} />} label="Hafalan" active={activeTab === 'hafalan'} onClick={() => setActiveTab('hafalan')} />
                    <MobileNavButton icon={<BookOpen size={20} />} label="Qur'an" active={activeTab === 'quran'} onClick={() => setActiveTab('quran')} />
                    <MobileNavButton icon={<Compass size={20} />} label="Jadwal" active={activeTab === 'jadwal'} onClick={() => setActiveTab('jadwal')} />
                    <MobileNavButton icon={<Bookmark size={20} />} label="Doa" active={activeTab === 'doa'} onClick={() => setActiveTab('doa')} />
                </div>
            </nav>

            {/* Mobile Floating Install Button */}
            {(deferredPrompt || (isIOS && !isStandalone)) && (
                <button
                    onClick={handleInstallClick}
                    className="md:hidden fixed bottom-20 left-4 z-50 flex items-center gap-2 bg-emerald-600 text-white font-bold py-3 px-5 rounded-full shadow-lg active:scale-95 transition-transform animate-bounce"
                >
                    <Download size={20} /> {isIOS ? 'Instal di iPhone' : 'Install App'}
                </button>
            )}

            {/* iOS Install Instruction Modal */}
            {showIOSPrompt && (
                <div className="fixed inset-0 z-[60] flex items-end justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl animate-in slide-in-from-bottom duration-300">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-bold text-emerald-900 dark:text-emerald-100">Instal di iPhone/iPad</h3>
                            <button onClick={() => setShowIOSPrompt(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-2xl font-bold">&times;</button>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 mb-6 text-sm leading-relaxed">
                            Safari di iPhone tidak mendukung instalasi otomatis. Untuk menginstal aplikasi ini:
                        </p>
                        <ol className="space-y-4 mb-6">
                            <li className="flex items-start gap-3">
                                <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 p-2 rounded-lg shrink-0 text-xs font-bold w-7 h-7 flex items-center justify-center">1</div>
                                <p className="text-sm text-slate-700 dark:text-slate-200">Klik tombol <b>Bagikan (Share)</b> <span className="inline-block px-1 bg-slate-100 dark:bg-slate-700 rounded text-[10px]">↑</span> di navigasi Safari.</p>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 p-2 rounded-lg shrink-0 text-xs font-bold w-7 h-7 flex items-center justify-center">2</div>
                                <p className="text-sm text-slate-700 dark:text-slate-200">Scroll ke bawah dan pilih <b>"Tambah ke Layar Utama" (Add to Home Screen)</b>.</p>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 p-2 rounded-lg shrink-0 text-xs font-bold w-7 h-7 flex items-center justify-center">3</div>
                                <p className="text-sm text-slate-700 dark:text-slate-200">Klik <b>Tambah (Add)</b> di pojok kanan atas.</p>
                            </li>
                        </ol>
                        <button 
                            onClick={() => setShowIOSPrompt(false)}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-emerald-200 dark:shadow-none"
                        >
                            Saya Mengerti
                        </button>
                    </div>
                </div>
            )}

            {/* Mobile Floating Theme Toggle */}
            <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="md:hidden fixed bottom-20 right-4 z-50 p-3 rounded-full bg-white shadow-lg border border-slate-200 text-slate-700 active:scale-95 transition-transform"
            >
                {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
            </button>
            <div className="hidden md:block text-center py-4 text-slate-300 text-[10px] select-none">
                Build: 1.1.3-fix (Latest)
            </div>
            <div className="md:hidden text-center pt-2 pb-24 text-slate-300 text-[10px] select-none">
                Build: 1.1.3-fix (Latest)
            </div>
        </div>
    );
}
