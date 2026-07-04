import React, { useState, useRef, useEffect } from 'react';
import Navigation from './components/Navigation';
import ProfileCard from './components/ProfileCard';
import ChatInterface from './components/ChatInterface';

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const handleToggleVoice = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    // Restart from beginning each time user triggers it.
    try {
      audioRef.current.currentTime = 0;
    } catch (_) {}

    audioRef.current.play()
      .then(() => setIsPlaying(true))
      .catch(err => console.log("Audio play blocked by browser authorization validation rules:", err));
  };

  useEffect(() => {
    audioRef.current = new Audio('/audio/voice_preview_junior.mp3');
    audioRef.current.preload = 'auto';

    // Keep state synced so button/status reflects actual playback.
    const audioEl = audioRef.current;
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => setIsPlaying(false);

    audioEl.addEventListener('play', onPlay);
    audioEl.addEventListener('pause', onPause);
    audioEl.addEventListener('ended', onEnded);

    // Try to start voice immediately on load.
    // Browsers may block autoplay unless the user has interacted recently.
    audioEl.play()
      .then(() => {
        try { audioEl.currentTime = 0; } catch (_) {}
      })
      .catch(err => {
        console.log('Autoplay blocked by browser policy; voice will start after user interaction.', err);
      });

    return () => {
      audioEl.removeEventListener('play', onPlay);
      audioEl.removeEventListener('pause', onPause);
      audioEl.removeEventListener('ended', onEnded);
      audioEl?.pause();
    };
  }, []);



  return (
    <div className="min-h-screen bg-[#05070B] text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Sticky Header Nav Layout */}
      <Navigation />

      {/* Main Structural Layout Grid Frame */}
      <main className="max-w-7xl w-full mx-auto px-6 grid md:grid-cols-12 gap-12 md:gap-6 items-center my-auto py-12 md:py-24">
        
        {/* Left Side Profile Description Block */}
        <div className="md:col-span-7">
          <ProfileCard isPlaying={isPlaying} onToggleVoice={handleToggleVoice} />
        </div>

        {/* Right Side Conversational Engine Console Block */}
        <div className="md:col-span-5">
          <ChatInterface />
        </div>

      </main>

      {/* Base Signature Footer Branding */}
      <footer className="max-w-7xl w-full mx-auto px-6 py-6 border-t border-slate-900/60 flex justify-between items-center text-[10px] font-mono text-slate-600 tracking-wider">
        <p>LOCAL_NODE: GAYAZA_UGANDA</p>
        <p>© 2026 YIGA JUNIOR. INFRASTRUCTURE LABS.</p>
      </footer>
    </div>
  );
}
