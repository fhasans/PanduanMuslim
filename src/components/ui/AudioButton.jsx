import React, { useState } from 'react';
import { Volume2 } from 'lucide-react';

export default function AudioButton({ text, className = "" }) {
    const [isPlaying, setIsPlaying] = useState(false);

    const playAudio = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            window.speechSynthesis.resume();

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'id-ID';
            utterance.rate = 0.80;

            utterance.onstart = () => setIsPlaying(true);
            utterance.onend = () => setIsPlaying(false);
            utterance.onerror = (event) => {
                console.error("Audio error:", event);
                setIsPlaying(false);
            };

            window.speechSynthesis.speak(utterance);
        } else {
            alert("Maaf, pelayar web anda tidak menyokong ciri audio.");
        }
    };

    return (
        <button
            onClick={playAudio}
            className={`text-emerald-600 hover:text-emerald-800 p-2 rounded-full transition-colors shadow-sm border border-emerald-100 ${className} ${isPlaying ? 'bg-emerald-200 animate-pulse scale-110' : 'hover:bg-emerald-100'}`}
            title="Dengarkan Audio"
        >
            <Volume2 size={18} />
        </button>
    );
}
