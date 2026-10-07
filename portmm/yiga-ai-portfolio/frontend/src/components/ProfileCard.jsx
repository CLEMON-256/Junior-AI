import { Volume2, VolumeX, Mail, Phone, ExternalLink } from 'lucide-react';

export default function ProfileCard({ isPlaying, onToggleVoice }) {
  return (
    <div className="space-y-6 md:pr-8 animate-fade-in">

      <div className="mb-6">
        <img
          src="/IMG-20260924-WA0001.jpg"
          alt="Yiga Junior"
          className="w-full max-w-sm h-auto rounded-xl shadow-lg border border-emerald-500/20"
        />
      </div>

      <div className="space-y-3">
        <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 bg-emerald-400/5 border border-emerald-500/10 px-3 py-1 rounded-full">
          ● Ready for Immediate Production Impact
        </span>
        <h2 className="text-4xl md:text-6xl font-black text-white leading-none uppercase tracking-tight">
          Fullstack <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-500">
            AI Engineer
          </span>
        </h2>
      </div>

      <p className="text-slate-400 text-base md:text-lg leading-relaxed font-light max-w-xl">
        Based out of Gayaza, I specialize in architecting end-to-end machine learning models and multi-agent infrastructures.
        I map complex workflows with <strong className="text-slate-200">CrewAI</strong>, 
        <strong className="text-slate-200">Microsoft AutoGen</strong>, and <strong className="text-slate-200">LangGraph</strong>, 
        handling everything from application logic to cloud-deployed pipelines.
      </p>

      {/* Audio Controller Section */}
      <div className="pt-2">
        <button
          onClick={onToggleVoice}
          className={`group flex items-center gap-3 px-6 py-3.5 rounded-xl text-sm font-mono uppercase tracking-wider border transition-all duration-300 ${
            isPlaying 
              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.05)]' 
              : 'bg-emerald-500 text-slate-950 border-transparent hover:bg-emerald-400 shadow-[0_4px_20px_rgba(16,185,129,0.15)]'
          }`}
        >
          {isPlaying ? <VolumeX size={16} /> : <Volume2 size={16} className="animate-bounce" />}
          {isPlaying ? "Pause AI Agent Voice" : "Play AI Agent Voice"}
        </button>
      </div>



      {/* Direct Contact Grid Layout */}
      <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-900 max-w-md font-mono text-xs text-slate-400">
        <a href="tel:0793030322" className="flex items-center gap-2 hover:text-slate-200 transition-colors group">
          <Phone size={14} className="text-slate-600 group-hover:text-emerald-400" /> 0793030322
        </a>
        <a href="mailto:junioryiga91@gmail.com" className="flex items-center gap-2 hover:text-slate-200 transition-colors group">
          <Mail size={14} className="text-slate-600 group-hover:text-emerald-400" /> junioryiga91@gmail.com
        </a>
        <a href="https://github.com/CLEMON-256" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-slate-200 transition-colors group col-span-2">
          <ExternalLink size={14} className="text-slate-600 group-hover:text-emerald-400" /> github.com/CLEMON-256
        </a>
      </div>
    </div>
  );
}
