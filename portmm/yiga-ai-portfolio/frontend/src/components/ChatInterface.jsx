import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Send, Volume2, VolumeX } from 'lucide-react';

export default function ChatInterface() {
  const [messages, setMessages] = useState([
    { text: "System Initialized. Ask agent anything about Yiga's engineering background or source code repositories.", isBot: true }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [voiceRepliesEnabled, setVoiceRepliesEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState("");
  const messagesRef = useRef(null);
  const recognitionRef = useRef(null);
  const speechRecognitionAvailable = typeof window !== 'undefined'
    && Boolean(window['SpeechRecognition'] || window['webkitSpeechRecognition']);

  const speakReply = (text) => {
    if (!('speechSynthesis' in window)) {
      setVoiceStatus("Spoken replies are not supported in this browser.");
      return;
    }

    const spokenText = text
      .replace(/```[\s\S]*?```/g, " Code example omitted. ")
      .replace(/https?:\/\/\S+/g, " link ")
      .replace(/[*_#`]/g, "");
    const utterance = new SpeechSynthesisUtterance(spokenText);
    utterance.lang = 'en-US';
    utterance.onerror = () => setVoiceStatus("The browser could not play the spoken reply.");
    utterance.onend = () => setVoiceStatus("");
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setVoiceStatus("Speaking reply...");
  };

  const startVoiceInput = () => {
    const SpeechRecognition = window['SpeechRecognition'] || window['webkitSpeechRecognition'];
    if (!SpeechRecognition) {
      setVoiceStatus("Voice input is not supported in this browser. You can type your question instead.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.trim();
      setInput(transcript);
      setVoiceStatus("Voice question captured. Review it, then press send.");
    };
    recognition.onerror = (event) => {
      const message = event.error === 'not-allowed'
        ? "Microphone access was denied. Allow microphone access in your browser settings and try again."
        : `Voice input failed (${event.error}). You can type your question instead.`;
      setVoiceStatus(message);
    };
    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    try {
      recognitionRef.current = recognition;
      recognition.start();
      setIsListening(true);
      setVoiceStatus("Listening... Ask your question.");
    } catch {
      recognitionRef.current = null;
      setIsListening(false);
      setVoiceStatus("Could not start voice input. Check microphone access and try again.");
    }
  };

  useEffect(() => () => {
    recognitionRef.current?.stop();
    window.speechSynthesis?.cancel();
  }, []);

  useEffect(() => {
    const messagesElement = messagesRef.current;
    messagesElement?.scrollTo({
      top: messagesElement.scrollHeight,
      behavior: 'smooth',
    });
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

      const replyText = typeof data.reply === 'string'
        ? data.reply
        : Array.isArray(data.reply)
          ? data.reply
              .filter(part => part?.type === 'text' && typeof part.text === 'string')
              .map(part => part.text)
              .join('\n')
          : typeof data.reply?.content === 'string'
            ? data.reply.content
            : JSON.stringify(data.reply, null, 2);

      setMessages(prev => [...prev, { text: replyText, isBot: true, agent: data.agent_used }]);
      if (voiceRepliesEnabled) speakReply(replyText);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown network error";
      setMessages(prev => [...prev, {
        text: `Could not reach Yiga Junior Agent (${message}). Check your connection and try again.`,
        isBot: true,
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 shadow-lg rounded-xl p-6 h-[500px] flex flex-col justify-between">
      
      {/* Chat Header */}
      <div className="flex flex-wrap justify-between items-center gap-3 border-b border-gray-200 pb-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-sm font-semibold text-gray-900">Yiga Junior Agent</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setVoiceRepliesEnabled(enabled => {
                if (enabled) {
                  window.speechSynthesis?.cancel();
                  setVoiceStatus("");
                }
                return !enabled;
              });
            }}
            aria-pressed={voiceRepliesEnabled}
            className={`flex items-center gap-1 rounded-lg border px-2 py-1.5 text-xs transition ${
              voiceRepliesEnabled
                ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                : 'border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {voiceRepliesEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
            Speak replies {voiceRepliesEnabled ? 'on' : 'off'}
          </button>
          <button
            type="button"
            onClick={() => {
              if (isListening) {
                recognitionRef.current?.stop();
                return;
              }
              startVoiceInput();
            }}
            disabled={!speechRecognitionAvailable || loading}
            aria-label={isListening ? 'Stop voice input' : 'Ask by voice'}
            title={speechRecognitionAvailable ? 'Ask by voice' : 'Voice input is not supported in this browser'}
            className="flex items-center gap-1 rounded-lg border border-gray-300 px-2 py-1.5 text-xs text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isListening ? <MicOff size={15} /> : <Mic size={15} />}
            {isListening ? 'Stop' : 'Talk'}
          </button>
        </div>
      </div>
      {voiceStatus && (
        <p role="status" aria-live="polite" className="mb-3 text-xs text-gray-600">
          {voiceStatus}
        </p>
      )}

      {/* Messages */}
      <div ref={messagesRef} className="flex-1 overflow-y-auto space-y-4 pr-2">
        {messages.map((msg, i) => (
          <div key={i} className={`flex flex-col ${msg.isBot ? 'items-start' : 'items-end'}`}>
            {msg.agent && (
              <span className="text-xs text-gray-500 mb-1 font-medium">
                Agent: {msg.agent}
              </span>
            )}
            <div className={`p-4 rounded-lg text-sm max-w-[85%] leading-relaxed ${
              msg.isBot 
                ? 'bg-gray-100 text-gray-800 border border-gray-200'
                : 'bg-emerald-600 text-white'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" />
            <span>Thinking...</span>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask agent"
          className="flex-1 bg-gray-50 text-gray-900 border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
        />
        <button 
          type="submit" 
          disabled={loading}
          className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 px-4 py-3 rounded-lg text-white transition-all flex items-center justify-center"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
