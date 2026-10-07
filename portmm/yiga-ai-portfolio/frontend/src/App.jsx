import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Phone } from 'lucide-react';
import Logo from './assets/logo/c4751d7d-39ff-4416-8d0e-35e6b71b69ae.svg';
import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import SkillsSection from './components/SkillsSection';
import AboutSection from './components/AboutSection';
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

    const audioEl = audioRef.current;
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => setIsPlaying(false);

    audioEl.addEventListener('play', onPlay);
    audioEl.addEventListener('pause', onPause);
    audioEl.addEventListener('ended', onEnded);

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
    <div className="min-h-screen bg-white text-gray-900">
      <Navigation />
      <HeroSection />
      <SkillsSection />
      <AboutSection />

      {/* Chat Section */}
      <section id="chat" className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Ask Me Anything</h2>
          <p className="text-gray-600 mb-12">Ask my agent about my experience, projects, or anything about Yiga Junior.</p>
          <ChatInterface />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <img src={Logo} alt="Yiga Junior — AI Engineer" className="mb-4 h-16 w-auto max-w-full rounded bg-white p-2" />
              <p className="text-gray-400 text-sm">Full-Stack AI Engineer building the future of AI models and multi-agent systems.</p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">EXPLORE</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-emerald-400 transition">Projects</a></li>
                <li><a href="#skills" className="hover:text-emerald-400 transition">Skills</a></li>
                <li><a href="#about" className="hover:text-emerald-400 transition">About</a></li>
                <li><a href="#chat" className="hover:text-emerald-400 transition">Chat</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">SOCIAL</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="https://github.com/CLEMON-256" target="_blank" rel="noreferrer" className="hover:text-emerald-400 transition">GitHub</a></li>
                <li><a href="https://www.linkedin.com/feed/" target="_blank" rel="noreferrer" className="hover:text-emerald-400 transition">LinkedIn</a></li>
                <li><a href="https://x.com/home" target="_blank" rel="noreferrer" className="hover:text-emerald-400 transition">Twitter</a></li>
                <li><a href="https://www.instagram.com/" target="_blank" rel="noreferrer" className="hover:text-emerald-400 transition">Instagram</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">CONTACT</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="mailto:junioryiga91@gmail.com" className="hover:text-emerald-400 transition">junioryiga91@gmail.com</a></li>
                <li><a href="tel:0793030322" className="hover:text-emerald-400 transition">+256 793 030 322</a></li>
                <li><a href="https://wa.me/256793030322" target="_blank" rel="noreferrer" className="hover:text-emerald-400 transition">Chat on WhatsApp</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex justify-between items-center text-gray-400 text-sm">
            <p>&copy; 2026 Yiga Junior. All rights reserved.</p>
            <p>Based in Gayaza, Uganda 🇺🇬</p>
          </div>
        </div>
      </footer>

      <a
        href="https://wa.me/256793030322"
        target="_blank"
        rel="noreferrer"
        aria-label="Chat with Yiga on WhatsApp"
        className="fixed bottom-6 left-6 z-50 inline-flex items-center gap-3 rounded-full bg-[#3ec4bf] px-6 py-4 font-semibold text-slate-950 shadow-lg transition hover:bg-[#35b8b3] hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700"
      >
        <span className="relative block h-6 w-6">
          <MessageCircle size={24} aria-hidden="true" />
          <Phone size={11} aria-hidden="true" className="absolute left-[7px] top-[7px]" />
        </span>
        <span>Chat with Yiga Junior</span>
      </a>
    </div>
  );
}
