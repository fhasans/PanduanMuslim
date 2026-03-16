import React, { useState, useEffect } from 'react';
import { X, Lock, Users, PlusCircle, UserCircle2 } from 'lucide-react';
import QadhaCalculator from './QadhaCalculator.jsx';
import QadhaDashboard from './QadhaDashboard.jsx';

export default function QadhaTracker({ onClose }) {
    const [profiles, setProfiles] = useState({});
    const [activeProfileId, setActiveProfileId] = useState(null);
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('sg_qadha_profiles');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setProfiles(parsed);
                // Auto select profile if only one is present
                const keys = Object.keys(parsed);
                if(keys.length === 1 && !activeProfileId) {
                    setActiveProfileId(keys[0]);
                }
            } catch (e) {
                console.error("Failed to parse qadha profiles from local storage");
            }
        }
    }, []);

    const saveProfiles = (newProfiles) => {
        setProfiles(newProfiles);
        localStorage.setItem('sg_qadha_profiles', JSON.stringify(newProfiles));
    };

    const handleSaveProfile = (profileData) => {
        const newProfiles = { ...profiles, [profileData.id]: profileData };
        saveProfiles(newProfiles);
        setActiveProfileId(profileData.id);
        setIsCreating(false);
    };

    const handleUpdateProfile = (updatedProfile) => {
        const newProfiles = { ...profiles, [updatedProfile.id]: updatedProfile };
        saveProfiles(newProfiles);
    };

    const handleDeleteProfile = (profileId) => {
        const newProfiles = { ...profiles };
        delete newProfiles[profileId];
        saveProfiles(newProfiles);
        if (activeProfileId === profileId) {
            setActiveProfileId(null);
        }
    };

    const profileList = Object.values(profiles);

    return (
        <div className="fixed inset-0 z-[100] bg-slate-50 dark:bg-slate-950 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Header */}
            <div className="bg-slate-900 border-b border-slate-800 text-white p-4 shadow-md flex items-center justify-between relative z-10 shrink-0">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-amber-500/20 rounded-lg">
                        <Lock size={18} className="text-amber-400" />
                    </div>
                    <span className="font-bold tracking-wide">Qadha Tracker</span>
                </div>
                <button 
                    onClick={onClose}
                    className="p-2 hover:bg-slate-800 rounded-full transition-colors active:scale-95"
                >
                    <X size={20} className="text-slate-300" />
                </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 relative">
                <div className={`${activeProfileId ? 'max-w-5xl' : 'max-w-md'} mx-auto h-full space-y-4`}>
                    {/* View Active Profile */}
                    {activeProfileId && profiles[activeProfileId] && !isCreating && (
                        <QadhaDashboard 
                            profile={profiles[activeProfileId]} 
                            onUpdate={handleUpdateProfile} 
                            onDelete={handleDeleteProfile}
                            onBack={() => setActiveProfileId(null)}
                        />
                    )}

                    {/* Create Profile Form */}
                    {isCreating && (
                        <QadhaCalculator 
                            onSave={handleSaveProfile} 
                            onCancel={() => {
                                setIsCreating(false);
                                if (profileList.length === 0) {
                                  onClose();
                                }
                            }} 
                        />
                    )}

                    {/* List Profiles Menu */}
                    {!activeProfileId && !isCreating && (
                        <div className="space-y-6">
                            <div className="text-center pt-8 pb-4">
                                <div className="mx-auto w-16 h-16 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-400 dark:text-slate-500">
                                    <Users size={32} />
                                </div>
                                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">Pilih Profil</h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                                    Pilih profil pengguna untuk melihat atau memperbarui catatan qadha puasa.
                                </p>
                            </div>

                            <div className="space-y-3">
                                {profileList.map(profile => (
                                    <button 
                                        key={profile.id}
                                        onClick={() => setActiveProfileId(profile.id)}
                                        className="w-full flex items-center p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:border-emerald-200 dark:hover:border-emerald-500/50 hover:shadow-emerald-100 dark:hover:shadow-emerald-900/20 transition-all text-left group"
                                    >
                                        <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl mr-4 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/50 transition-colors">
                                           <UserCircle2 size={24} className="text-emerald-600 dark:text-emerald-400" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-slate-800 dark:text-slate-200">{profile.name}</h3>
                                            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                                                Sisa: {profile.totalQadha} Hari
                                            </p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                            
                            {profileList.length === 0 && (
                                <div className="text-center py-4">
                                    <p className="text-slate-500 dark:text-slate-400 text-sm">Belum ada profil qadha.</p>
                                </div>
                            )}

                            <button 
                                onClick={() => setIsCreating(true)}
                                className="w-full py-4 px-4 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-800 border-dashed text-emerald-700 dark:text-emerald-400 font-semibold rounded-2xl flex items-center justify-center gap-2 transition-colors mt-6"
                            >
                                <PlusCircle size={20} /> Buat Profil Baru
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

