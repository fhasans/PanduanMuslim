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
    Download,
    Lock,
    RefreshCw,
    ChevronLeft,
    ChevronRight,
    X as CloseIcon
} from 'lucide-react';
import { DesktopNavButton, MobileNavButton } from './components/layout/NavButtons.jsx';
import FeatureHighlightPopup from './components/layout/FeatureHighlightPopup.jsx';
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
    const [showUpdateBanner, setShowUpdateBanner] = useState(false);
    const [showFeaturePopup, setShowFeaturePopup] = useState(false);
    const [isSidebarMinimized, setIsSidebarMinimized] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('sidebarMinimized') === 'true';
        }
        return false;
    });
    const APP_VERSION = '1.2.2';

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('lastActiveTab', activeTab);
        }
    }, [activeTab]);

    useEffect(() => {
        // Check for version update history
        if (typeof window !== 'undefined') {
            const lastSeenVersion = localStorage.getItem('last_seen_version');
            if (lastSeenVersion !== APP_VERSION) {
                // Show highlight popup for new version
                setShowFeaturePopup(true);
            }
        }
    }, []);

    const handleClosePopup = () => {
        setShowFeaturePopup(false);
        localStorage.setItem('last_seen_version', APP_VERSION);
    };

    const toggleSidebar = () => {
        const newState = !isSidebarMinimized;
        setIsSidebarMinimized(newState);
        localStorage.setItem('sidebarMinimized', newState.toString());
    };

    useEffect(() => {
        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
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
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        setDeferredPrompt(null);
    };

    const NAV_ITEMS = [
        { id: 'beranda', label: 'Beranda', icon: <Home size={20} /> },
        { id: 'wudhu', label: 'Wudhu', icon: <Droplets size={20} /> },
        { id: 'sholat', label: 'Sholat', icon: <Moon size={20} /> },
        { id: 'puasa', label: 'Puasa', icon: <Heart size={20} /> },
        { id: 'hafalan', label: 'Hafalan', icon: <Book size={20} /> },
        { id: 'quran', label: "Qur'an", icon: <BookOpen size={20} /> },
        { id: 'jadwal', label: 'Jadwal', icon: <Compass size={20} /> },
        { id: 'doa', label: 'Doa', icon: <Bookmark size={20} /> },
        { id: 'qadha', label: 'Qadha Puasa', icon: <Lock size={20} /> },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'wudhu': return <WudhuSection />;
            case 'sholat': return <SholatSectionWrapper />;
            case 'puasa': return <PuasaSection />;
            case 'hafalan': return <HafalanSection />;
            case 'quran': return <QuranSection />;
            case 'jadwal': return <JadwalSholatSection />;
            case 'doa': return <DoaSection />;
            case 'qadha': return <QadhaTracker onClose={() => setActiveTab('beranda')} />;
            default: return <BerandaSection setTab={setActiveTab} />;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100 transition-colors flex flex-col md:flex-row relative">
            
            {/* Update Available Banner (Always Top) */}
            {showUpdateBanner && (
                <div className="fixed top-0 left-0 right-0 z-[70] bg-emerald-600 text-white py-2 px-4 shadow-xl border-b border-emerald-500/50 animate-in slide-in-from-top duration-500">
                    <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-white/20 rounded-lg animate-spin-slow">
                                <RefreshCw size={18} />
                            </div>
                            <div>
                                <p className="text-xs font-black uppercase tracking-widest leading-none">Update Tersedia!</p>
                                <p className="text-[10px] text-emerald-100 font-medium">Versi baru Panduan Muslim telah siap digunakan.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => window.location.reload()}
                                className="bg-white text-emerald-700 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider hover:bg-emerald-50 transition-colors shadow-sm"
                            >
                                Refresh Sekarang
                            </button>
                            <button 
                                onClick={() => setShowUpdateBanner(false)}
                                className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
                            >
                                <CloseIcon size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Feature Highlight Popup */}
            {showFeaturePopup && (
                <FeatureHighlightPopup onClose={handleClosePopup} />
            )}

            {/* ===== DESKTOP SIDEBAR (LEFT) ===== */}
            <aside className={`hidden md:flex flex-col h-screen sticky top-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-50 shadow-sm overflow-y-auto shrink-0 select-none transition-all duration-300 ease-in-out ${isSidebarMinimized ? 'w-20' : 'w-64 lg:w-72'}`}>
                <div className={`p-4 ${isSidebarMinimized ? 'px-2' : 'px-6'}`}>
                    {/* Header: Logo + Toggle */}
                    <div className="flex items-center justify-between mb-8">
                        <div 
                            className={`flex items-center gap-2 cursor-pointer active:scale-95 transition-all duration-300 ${isSidebarMinimized ? 'w-full justify-center' : ''}`} 
                            onClick={() => setActiveTab('beranda')}
                        >
                            <div className="p-2 bg-emerald-600 rounded-xl shadow-lg shadow-emerald-600/20 shrink-0">
                                <BookOpen className="h-6 w-6 text-white" />
                            </div>
                            {!isSidebarMinimized && (
                                <span className="font-black text-xl text-emerald-900 dark:text-emerald-50 tracking-tight uppercase animate-in fade-in duration-500">
                                    Sunnah<span className="text-emerald-500">Guide</span>
                                </span>
                            )}
                        </div>
                    </div>

                    <nav className="space-y-1">
                        {NAV_ITEMS.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                title={isSidebarMinimized ? item.label : ''}
                                className={`w-full flex items-center rounded-2xl font-bold transition-all group relative ${isSidebarMinimized ? 'aspect-square justify-center p-0 mb-1' : 'gap-3 px-4 py-3.5 mb-1'} ${
                                    activeTab === item.id 
                                        ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-600/30 active:scale-[0.98]' 
                                        : 'text-slate-500 dark:text-slate-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:text-emerald-600 dark:hover:text-emerald-400'
                                }`}
                            >
                                <span className={`${activeTab === item.id ? 'scale-110' : 'group-hover:scale-110'} transition-transform duration-300 shrink-0`}>
                                    {item.icon}
                                </span>
                                {!isSidebarMinimized && (
                                    <span className="text-sm whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-300">{item.label}</span>
                                )}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Sidebar Bottom Actions */}
                <div className={`mt-auto p-4 space-y-3 ${isSidebarMinimized ? 'px-2' : 'px-6'}`}>
                    <button 
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        title={isSidebarMinimized ? (isDarkMode ? 'Tema Terang' : 'Tema Gelap') : ''}
                        className={`w-full flex items-center bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all font-bold border border-slate-100 dark:border-slate-700/50 ${isSidebarMinimized ? 'aspect-square justify-center p-0 rounded-2xl' : 'gap-3 px-4 py-3 rounded-2xl text-sm'}`}
                    >
                        <div className={`p-1.5 bg-white dark:bg-slate-800 rounded-lg shadow-sm shrink-0 transition-transform ${isSidebarMinimized ? 'scale-110' : ''}`}>
                            {isDarkMode ? <Sun size={18} className="text-amber-500" /> : <Moon size={18} className="text-blue-500" />}
                        </div>
                        {!isSidebarMinimized && <span className="animate-in fade-in duration-300">{isDarkMode ? 'Tema Terang' : 'Tema Gelap'}</span>}
                    </button>

                    {(deferredPrompt || (isIOS && !isStandalone)) && (
                        <button 
                            onClick={handleInstallClick}
                            title={isSidebarMinimized ? 'Download App' : ''}
                            className={`w-full flex items-center bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 transition-all font-black uppercase tracking-widest border border-emerald-100 dark:border-emerald-800/50 ${isSidebarMinimized ? 'aspect-square justify-center p-0 rounded-2xl' : 'gap-3 px-4 py-3 rounded-2xl text-[10px]'}`}
                        >
                            <Download size={18} className="shrink-0" /> 
                            {!isSidebarMinimized && <span className="animate-in fade-in duration-300 whitespace-nowrap">{isIOS ? 'PWA' : 'Instal'}</span>}
                        </button>
                    )}

                    {/* Collapse Toggle Button */}
                    <button 
                        onClick={toggleSidebar}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-emerald-700 dark:hover:bg-emerald-200 transition-all text-xs font-black uppercase tracking-widest border-none shadow-lg shadow-slate-900/10 ${isSidebarMinimized ? 'aspect-square justify-center p-0' : ''}`}
                    >
                        <div className={`shrink-0 transition-transform duration-500 ${isSidebarMinimized ? 'scale-125' : ''}`}>
                            {isSidebarMinimized ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                        </div>
                        {!isSidebarMinimized && <span className="animate-in fade-in duration-300">Minimize</span>}
                    </button>

                    <div className="text-center pt-2">
                        <p className={`text-slate-300 dark:text-slate-600 font-bold uppercase tracking-widest leading-none ${isSidebarMinimized ? 'text-[6px]' : 'text-[10px]'}`}>
                            {isSidebarMinimized ? 'v1.2' : `Build ${APP_VERSION}`}
                        </p>
                    </div>
                </div>
            </aside>

            {/* ===== MAIN CONTENT AREA ===== */}
            <div className="flex-1 flex flex-col min-w-0 min-h-screen">
                
                {/* Mobile Header (Hidden on Desktop) */}
                <header className="md:hidden sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 px-4 py-3 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-2" onClick={() => setActiveTab('beranda')}>
                        <BookOpen className="h-6 w-6 text-emerald-600" />
                        <span className="font-black text-lg text-emerald-900 dark:text-emerald-50 tracking-tight">
                            Sunnah<span className="text-emerald-500">Guide</span>
                        </span>
                    </div>
                    <button
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 active:scale-90 transition-transform"
                    >
                        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                </header>

                {/* Shared Top Components (Schedule & Random Ayat) */}
                <div className="w-full">
                    <div className="sticky md:relative top-12 md:top-0 z-40 bg-white dark:bg-slate-900/80 backdrop-blur-md md:bg-transparent shadow-sm md:shadow-none border-b border-emerald-100/50 dark:border-emerald-900/20 md:border-none">
                        <PinnedSchedule />
                    </div>
                    <RandomAyat />
                </div>

                {/* Content Container */}
                <main className="flex-1 w-full max-w-5xl mx-auto px-4 md:px-8 py-6 pb-24 md:pb-8">
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
                        {renderContent()}
                    </div>
                </main>
            </div>

            {/* ===== MOBILE BOTTOM NAVBAR ===== */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 h-16 px-1 z-50 safe-area-pb shadow-[0_-4px_10px_rgba(0,0,0,0.05)] overflow-x-auto no-scrollbar select-none">
                <div className="flex items-center w-max min-w-full justify-around h-full px-2 gap-1 pb-1">
                    {NAV_ITEMS.map((item) => (
                        <MobileNavButton 
                            key={item.id}
                            icon={item.icon} 
                            label={item.label === 'Qadha Puasa' ? 'Qadha' : item.label} 
                            active={activeTab === item.id} 
                            onClick={() => setActiveTab(item.id)} 
                        />
                    ))}
                </div>
            </nav>

            {/* IOS Install Instruction Modal */}
            {showIOSPrompt && (
                <div className="fixed inset-0 z-[70] flex items-end justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-[2rem] p-8 shadow-2xl animate-in slide-in-from-bottom duration-300">
                        <div className="flex justify-between items-start mb-6">
                            <h3 className="text-2xl font-black text-emerald-900 dark:text-emerald-50 uppercase tracking-tight">Instal PWA</h3>
                            <button onClick={() => setShowIOSPrompt(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1">&times;</button>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 mb-8 text-sm leading-relaxed">
                            Safari di iPhone tidak mendukung instalasi otomatis. Untuk menginstal aplikasi ini:
                        </p>
                        <ol className="space-y-5 mb-10">
                            {[
                                { text: "Klik tombol Bagikan (Share) ↑ di navigasi Safari.", id: 1 },
                                { text: "Scroll ke bawah dan pilih Tambah ke Layar Utama (Add to Home Screen).", id: 2 },
                                { text: "Klik Tambah (Add) di pojok kanan atas.", id: 3 }
                            ].map((step) => (
                                <li key={step.id} className="flex items-start gap-4">
                                    <div className="bg-emerald-600 text-white p-2 rounded-xl shrink-0 text-[10px] font-black w-7 h-7 flex items-center justify-center shadow-lg shadow-emerald-500/20">{step.id}</div>
                                    <p className="text-xs text-slate-700 dark:text-slate-200 font-bold leading-tight mt-1">{step.text}</p>
                                </li>
                            ))}
                        </ol>
                        <button 
                            onClick={() => setShowIOSPrompt(false)}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-emerald-500/20 active:scale-95 uppercase tracking-widest text-xs"
                        >
                            Saya Mengerti
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
