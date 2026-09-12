import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, MessageSquare, HelpCircle, Loader2 } from 'lucide-react';
import { supportService } from '../services/support';
import { SafetyDisclaimer } from '../components/SafetyDisclaimer';
import { ParallaxCard } from '../components/ParallaxCard';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  category?: string;
  timestamp: string;
}

const FAQ_QUESTIONS = [
  'How do I upload an image?',
  'Why was my image rejected?',
  'What does image quality mean?',
  'What are the DR severity categories?',
  'What is Grad-CAM?',
  'How do I view history?',
  'How do I download a report?',
  'What does model confidence mean?',
];

export const Support: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text: 'Hello! I am your EYESCREEN AI Support specialist. I can guide you through fundus image acquisition protocols, quality gate rejection criteria, Grad-CAM interpretability heatmaps, and report exports.',
      category: 'general',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await supportService.sendMessage(query);
      const assistantMsg: Message = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: res.reply,
        category: res.category || 'general',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const errorMsg: Message = {
        id: `error-${Date.now()}`,
        sender: 'assistant',
        text: 'The support assistant service is temporarily unreachable from the backend server. Please verify the FastAPI backend connection.',
        category: 'system_error',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6 md:p-10 max-w-5xl mx-auto flex flex-col min-h-[calc(100vh-5rem)] text-left">
      {/* Header */}
      <div className="border-b border-[#DCE7F2] pb-4">
        <div className="flex items-center gap-2 text-xs font-mono text-[#0B4A7A] uppercase tracking-wider font-bold">
          <MessageSquare className="h-3.5 w-3.5" /> 24×7 Platform Support Assistant
        </div>
        <h1 className="text-2xl md:text-4xl font-black text-[#0B4A7A] uppercase tracking-wider mt-1">
          <span className="bg-gradient-to-r from-[#0B4A7A] via-[#1677C8] to-[#083B63] bg-clip-text text-transparent">
            EYE SCREEN AI SUPPORT
          </span>
        </h1>
        <p className="text-xs text-[#64748B] mt-1">
          Interactive consultation for screening requirements, explainability heatmaps, and system operations.
        </p>
      </div>

      {/* Main Chat Shell with Parallax */}
      <ParallaxCard depth={10} tiltAmount={3} className="flex-1 flex flex-col">
        <div className="flex-1 rounded-3xl border border-[#CBD5E1] bg-white flex flex-col overflow-hidden shadow-sm h-[600px]">
          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs md:text-sm bg-[#F8FBFF]">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex items-start gap-3 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`rounded-xl p-2.5 shrink-0 ${
                    m.sender === 'user' ? 'bg-[#0B4A7A] text-white shadow-sm' : 'bg-white border border-[#DCE7F2] text-[#1677C8]'
                  }`}
                >
                  {m.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>

                <div
                  className={`max-w-[78%] rounded-2xl p-4 space-y-1.5 ${
                    m.sender === 'user'
                      ? 'bg-[#0B4A7A] text-white rounded-tr-none shadow-sm'
                      : 'bg-white border border-[#DCE7F2] text-[#16324F] rounded-tl-none shadow-sm'
                  }`}
                >
                  {m.category && m.sender === 'assistant' && (
                    <span className="inline-block rounded-full bg-[#EAF5FF] border border-[#DCE7F2] px-2 py-0.5 text-[10px] font-mono font-bold text-[#1677C8] uppercase tracking-wider mb-1">
                      {m.category}
                    </span>
                  )}
                  <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>
                  <span className="block text-[10px] opacity-70 font-mono text-right">{m.timestamp}</span>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-3">
                <div className="rounded-xl p-2.5 bg-white border border-[#DCE7F2] text-[#1677C8]">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="rounded-2xl bg-white border border-[#DCE7F2] p-4 text-xs text-[#64748B] flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-[#1677C8]" />
                  <span>Synthesizing response...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick FAQ Chips */}
          <div className="border-t border-[#DCE7F2] bg-[#F8FBFF] p-3 px-6 overflow-x-auto flex items-center gap-2 no-scrollbar">
            <HelpCircle className="h-3.5 w-3.5 text-[#1677C8] shrink-0" />
            {FAQ_QUESTIONS.map((faq, i) => (
              <button
                key={i}
                onClick={() => handleSend(faq)}
                className="shrink-0 rounded-full border border-[#CBD5E1] bg-white px-3 py-1 text-[11px] font-semibold text-[#0B4A7A] hover:bg-[#EAF5FF] hover:border-[#1677C8] transition shadow-2xs"
              >
                {faq}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-4 bg-white border-t border-[#DCE7F2]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about fundus requirements, Grad-CAM, or ECE calibration..."
                className="flex-1 rounded-xl border border-[#CBD5E1] bg-white px-4 py-2.5 text-xs text-[#16324F] placeholder-[#94A3B8] focus:border-[#1677C8] focus:outline-none focus:ring-2 focus:ring-[#1677C8]/20 shadow-2xs"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="rounded-xl bg-[#0B4A7A] hover:bg-[#083B63] p-2.5 text-white transition shadow-sm disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </ParallaxCard>

      <ParallaxCard depth={6} tiltAmount={2}>
        <SafetyDisclaimer />
      </ParallaxCard>
    </div>
  );
};
