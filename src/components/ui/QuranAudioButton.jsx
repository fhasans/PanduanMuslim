import React, { useState, useRef } from 'react';
import { Volume2, Pause } from 'lucide-react';

export default function QuranAudioButton({ audioUrl, className = "" }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    const toggleAudio = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!audioUrl) return;

        if (!audioRef.current) {
            audioRef.current = new Audio(audioUrl);
            audioRef.current.onended = () => setIsPlaying(false);
            audioRef.current.onerror = () => setIsPlaying(false);
        }

        if (isPlaying) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            setIsPlaying(false);
        } else {
            // Stop any existing global audio
            if (window.__quranAudio && window.__quranAudio !== audioRef.current) {
                window.__quranAudio.pause();
                window.__quranAudio.currentTime = 0;
                if (window.__quranAudioSetPlaying) window.__quranAudioSetPlaying(false);
            }
            window.__quranAudio = audioRef.current;
            window.__quranAudioSetPlaying = setIsPlaying;
            audioRef.current.play().catch(() => setIsPlaying(false));
            setIsPlaying(true);
        }
    };

    return (
        <button
            onClick={toggleAudio}
            className={`p-2 rounded-full transition-all shadow-sm border ${isPlaying
                ? 'bg-emerald-500 text-white border-emerald-600 animate-pulse scale-110'
                : 'text-emerald-600 hover:text-emerald-800 border-emerald-100 hover:bg-emerald-100'
            } ${className}`}
            title={isPlaying ? "Hentikan Audio" : "Putar Audio"}
        >
            {isPlaying ? <Pause size={16} /> : <Volume2 size={16} />}
        </button>
    );
}
