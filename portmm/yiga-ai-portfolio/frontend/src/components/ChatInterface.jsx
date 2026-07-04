import React, { useState, useRef, useEffect } from 'react';
import { Send, Terminal, Cpu } from 'lucide-react';

export default function ChatInterface() {
  const [messages, setMessages] = useState([
    { text: "System Initialized. Ask me anything about Yiga's engineering background or source code repositories.", isBot: true }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const queryText = input;
    setMessages(prev => [...prev, { text: queryText, isBot: false }]);
    setInput("");
    setLoading(true);

    try {
      const deriveCodespaceBackend = () => {
        if (typeof window === 'undefined') return '';
        const hostname = window.location.hostname;
        const match = hostname.match(/^(.*)-(\d+)\.app\.github\.dev$/);
        if (!match) return '';
        return `https://${match[1]}-8000.app.github.dev`;
      };

      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL?.replace(/\/+$/, '') || deriveCodespaceBackend();
      const endpoint = BACKEND_URL ? `${BACKEND_URL}/api/chat` : '/api/chat';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: queryText })
      });
      const data = await response.json();

      // backend may return reply as string OR structured content; normalize to text
      const replyText = typeof data.reply === 'string'
        ? data.reply
        : JSON.stringify(data.reply, null, 2);

      setMessages(prev => [...prev, { text: replyText, isBot: true, agent: data.agent_used }]);
    } catch (err) {
      setMessages(prev => [...prev, { text: "Network Timeout: Make sure your FastAPI local port server is active.", isBot: true }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#090D14] border border-slate-900 shadow-2xl rounded-2xl p-6 h-[480px] flex flex-col justify-between relative group/card hover:border-slate-800 transition-colors duration-300">
      
      {/* Console Top Header Accent */}
      <div className="flex justify-between items-center border-b border-slate-900 pb-4 mb-4">
        <div className="flex items-center gap-2">
          <Terminal size={14} className="text-emerald-400 animate-pulse" />
          <span className="text-xs font-mono tracking-widest text-slate-400 uppercase">LANGGRAPH_ORCHESTRATOR</span>
        </div>
        <span className="text-[10px] font-mono text-slate-600 bg-slate-900 px-2 py-0.5 rounded border border-slate-800/40">v1.2.0</span>
      </div>

      {/* Message Output Thread Container */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin">
        {messages.map((msg, i) => (
          <div key={i} className={`flex flex-col ${msg.isBot ? 'items-start' : 'items-end'}`}>
            {msg.agent && (
              <span className="text-[9px] font-mono text-slate-500 mb-1 flex items-center gap-1 uppercase tracking-widest">
                <Cpu size={10} className="text-cyan-500" /> ROUTED_TO: {msg.agent}
              </span>
            )}
            <div className={`p-4 rounded-xl text-sm max-w-[85%] leading-relaxed ${
              msg.isBot 
                ? 'bg-slate-900/60 text-slate-300 border border-slate-800/80 font-light' 
                : 'bg-emerald-500 text-slate-950 font-semibold shadow-[0_4px_12px_rgba(16,185,129,0.1)]'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 animate-pulse">
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" />
            Graph compilation routing executing...
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Message Submission Target Field */}
      <form onSubmit={handleSend} className="flex gap-2 mt-4 pt-4 border-t border-slate-900">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Query agent about portfolio, skills, context..."
          className="flex-1 bg-slate-950 text-slate-200 border border-slate-900 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500/30 transition-all font-light"
        />
        <button 
          type="submit" 
          disabled={loading}
          className="bg-slate-900 hover:bg-slate-800 disabled:opacity-50 px-4 rounded-xl text-emerald-400 border border-slate-800 transition-all flex items-center justify-center"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
