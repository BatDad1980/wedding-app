import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, Bot, Loader2, Camera, Mic, X } from 'lucide-react';
import { getWeddingAdvice } from '../services/geminiService';
import { ChatMessage } from '../types';

const AIPlanner: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Hello, darling. How can I help you plan your beautiful day today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 1. iPhone "Bounce" Fix - Now correctly placed inside the component
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Voice not supported on this browser.");
    const recognition = new SpeechRecognition();
    recognition.onresult = (event: any) => {
      setInput(event.results[0][0].transcript);
    };
    recognition.start();
  };

  const handleSend = async () => {
    if ((!input.trim() && !image) || loading) return;

    const userMsg: ChatMessage = { role: 'user', text: input || "Check out this photo!" };
    setMessages(prev => [...prev, userMsg]);

    const currentInput = input;
    const currentImage = image;

    setInput('');
    setImage(null);
    setLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const response = await getWeddingAdvice(currentInput, history, currentImage || undefined);
      setMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "I'm having a little trouble connecting. Let's try again!" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] animate-fadeIn">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-stone-800 text-rose-300 flex items-center justify-center shadow-lg">
          <Sparkles size={20} />
        </div>
        <div>
          <h2 className="text-xl font-bold">Wedding Concierge</h2>
          <p className="text-[10px] uppercase tracking-widest text-emerald-500 font-bold">Online & Ready</p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar space-y-4 pb-4 px-1">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center mt-1 ${msg.role === 'user' ? 'bg-rose-100 text-rose-500' : 'bg-stone-100 text-stone-500'
                }`}>
                {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
              </div>
              <div className={`p-4 rounded-3xl text-sm leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-rose-500 text-white rounded-tr-none' : 'bg-white border border-stone-100 text-stone-700 rounded-tl-none'
                }`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="flex gap-2">
              <div className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center">
                <Loader2 size={12} className="animate-spin text-stone-400" />
              </div>
              <div className="p-4 rounded-3xl bg-white border border-stone-100 text-stone-400 italic text-xs">
                Planning something perfect...
              </div>
            </div>
          </div>
        )}
      </div>

      {image && (
        <div className="px-4 mb-2 animate-fadeIn">
          <div className="relative w-24 h-24 group">
            <img src={image} className="w-full h-full object-cover rounded-2xl border-2 border-rose-200 shadow-md" alt="Preview" />
            <button onClick={() => setImage(null)} className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-1 shadow-lg hover:bg-rose-600">
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      <div className="mt-auto bg-white p-2 rounded-2xl shadow-xl border border-rose-50 flex items-center gap-1">
        <button onClick={() => document.getElementById('cam-input')?.click()} className="p-3 text-stone-400 hover:text-rose-500 transition-colors active:scale-90">
          <Camera size={22} />
        </button>

        <button onClick={startListening} className="p-3 text-stone-400 hover:text-rose-500 transition-colors active:scale-90">
          <Mic size={22} />
        </button>

        <input id="cam-input" type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileChange} />

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={image ? "Ask about this photo..." : "Talk to your planner..."}
          className="flex-1 bg-transparent border-none outline-none px-2 py-3 text-sm placeholder:text-stone-300"
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />

        <button
          onClick={handleSend}
          disabled={loading || (!input.trim() && !image)}
          className="bg-stone-800 text-rose-100 p-3 rounded-xl disabled:opacity-30 transition-all active:scale-95"
        >
          {loading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
        </button>
      </div>
    </div>
  );
};

export default AIPlanner;