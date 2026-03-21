import React, { useState, useEffect } from 'react';
import { X, Lock, Users, PlusCircle, UserCircle2, Loader2 } from 'lucide-react';
import { supabase } from '../../../lib/supabase.js';
import QadhaCalculator from './QadhaCalculator.jsx';
import QadhaDashboard from './QadhaDashboard.jsx';

export default function QadhaTracker({ onClose }) {
    const [profiles, setProfiles] = useState({});
    const [activeProfileId, setActiveProfileId] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [verifyingProfile, setVerifyingProfile] = useState(null);
    const [pinInput, setPinInput] = useState('');
    const [pinError, setPinError] = useState('');
    const [showPin, setShowPin] = useState(false);

    useEffect(() => {
        fetchProfiles();
    }, []);

    const fetchProfiles = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('qadha_profiles')
                .select('*')
                .order('created_at', { ascending: true });

            if (error) throw error;

            // Transform array to object { id: profile }
            const profilesObj = {};
            data.forEach(p => {
                profilesObj[p.id] = {
                    ...p,
                    yearlyLogs: p.yearly_logs, // Map snake_case to camelCase
                    pubertyAge: p.puberty_age,
                    totalQadha: p.total_qadha,
                    currentAge: p.current_age,
                    createdAt: p.created_at,
                    pin: p.pin
                };
            });
            
            setProfiles(profilesObj);
        } catch (err) {
            console.error("Error fetching profiles:", err);
            setError("Gagal memuat profil.");
        } finally {
            setLoading(false);
        }
    };

    const handleSaveProfile = async (profileData) => {
        setLoading(true);
        try {
            const { error } = await supabase
                .from('qadha_profiles')
                .insert([{
                    id: profileData.id,
                    name: profileData.name,
                    dob: profileData.dob,
                    current_age: profileData.currentAge,
                    puberty_age: profileData.pubertyAge,
                    total_qadha: profileData.totalQadha,
                    yearly_logs: profileData.yearlyLogs,
                    payments: profileData.payments || [],
                    pin: profileData.pin
                }]);

            if (error) throw error;

            setProfiles(prev => ({ ...prev, [profileData.id]: profileData }));
            setActiveProfileId(profileData.id);
            setIsCreating(false);
        } catch (err) {
            console.error("Error saving profile:", err);
            alert("Gagal menyimpan profil ke database.");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (updatedProfile) => {
        // Optimistic update
        setProfiles(prev => ({ ...prev, [updatedProfile.id]: updatedProfile }));
        
        try {
            const { error } = await supabase
                .from('qadha_profiles')
                .update({
                    total_qadha: updatedProfile.totalQadha,
                    payments: updatedProfile.payments || []
                })
                .eq('id', updatedProfile.id);

            if (error) throw error;
        } catch (err) {
            console.error("Error updating profile:", err);
            // Revert on error?
            fetchProfiles(); 
        }
    };

    const handleDeleteProfile = async (profileId) => {
        setLoading(true);
        try {
            const { error } = await supabase
                .from('qadha_profiles')
                .delete()
                .eq('id', profileId);

            if (error) throw error;

            setProfiles(prev => {
                const updated = { ...prev };
                delete updated[profileId];
                return updated;
            });
            
            if (activeProfileId === profileId) {
                setActiveProfileId(null);
            }
        } catch (err) {
            console.error("Error deleting profile:", err);
            alert("Gagal menghapus profil dari database.");
        } finally {
            setLoading(false);
        }
    };

    const handleProfileSelect = (profile) => {
        setVerifyingProfile(profile);
        setPinInput('');
        setPinError('');
    };

    const handleVerifyPin = () => {
        if (pinInput === verifyingProfile.pin) {
            setActiveProfileId(verifyingProfile.id);
            setVerifyingProfile(null);
        } else {
            setPinError("PIN salah. Silakan coba lagi.");
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

            {/* PIN Verification Modal */}
            {verifyingProfile && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-slate-800 w-full max-w-xs rounded-3xl shadow-2xl p-6 space-y-6 animate-in zoom-in-95 duration-200">
                        <div className="text-center space-y-2">
                            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center mx-auto">
                                <Lock size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Verifikasi PIN</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Masukkan 6 digit PIN untuk profil <b>{verifyingProfile.name}</b></p>
                        </div>

                        <div className="space-y-4">
                            <div className="relative">
                                <input 
                                    type={showPin ? "text" : "password"}
                                    maxLength={6}
                                    value={pinInput}
                                    onChange={(e) => setPinInput(e.target.value)}
                                    placeholder="••••••"
                                    className="w-full py-4 text-center text-2xl font-black tracking-[1em] bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-2xl focus:border-emerald-500 focus:outline-none transition-all placeholder:tracking-normal placeholder:font-normal placeholder:text-slate-300"
                                    autoFocus
                                />
                                <button 
                                    onClick={() => setShowPin(!showPin)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                >
                                    {showPin ? <X size={18} /> : <Lock size={18} />}
                                </button>
                            </div>

                            {pinError && (
                                <p className="text-[10px] text-center text-red-500 font-bold animate-shake">{pinError}</p>
                            )}

                            <div className="flex gap-3">
                                <button 
                                    onClick={() => setVerifyingProfile(null)}
                                    className="flex-1 py-3 text-sm font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
                                >
                                    Batal
                                </button>
                                <button 
                                    onClick={handleVerifyPin}
                                    disabled={pinInput.length !== 6}
                                    className="flex-1 py-3 text-sm font-bold bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-lg shadow-emerald-500/20 transition-all active:scale-95 disabled:opacity-50"
                                >
                                    Masuk
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

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

                            {loading && profileList.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 gap-3">
                                    <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                                    <p className="text-sm text-slate-500">Memuat profil...</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {profileList.map(profile => (
                                        <button 
                                            key={profile.id}
                                            onClick={() => handleProfileSelect(profile)}
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
                                    
                                    {profileList.length === 0 && !loading && (
                                        <div className="text-center py-4">
                                            <p className="text-slate-500 dark:text-slate-400 text-sm">Belum ada profil qadha.</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            <button 
                                onClick={() => setIsCreating(true)}
                                disabled={loading}
                                className="w-full py-4 px-4 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-800 border-dashed text-emerald-700 dark:text-emerald-400 font-semibold rounded-2xl flex items-center justify-center gap-2 transition-colors mt-6 disabled:opacity-50"
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

