import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles, AlertCircle, HelpCircle, Loader2 } from 'lucide-react';
import { supportService } from '../services/support';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  category?: string;
  timestamp: string;
}

const FREQUENT_QUESTIONS = [
  'How do I upload an image?',
  'Why was my image rejected?',
  'What does image quality mean?',
  'What are the DR severity categories?',
  'What is Grad-CAM?',
  'How do I view history?',
  'How do I download a report?',
  'What does model confidence mean?',
];

export const SupportChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'Hello! I am your EYESCREEN AI assistant. I can answer questions about fundus upload requirements, quality checks, Grad-CAM heatmaps, and report generation.',
      category: 'general',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const response = await supportService.sendMessage(query);
      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: response.reply,
        category: response.category || 'assistance',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const errorMsg: ChatMessage = {
        id: `error-${Date.now()}`,
        sender: 'assistant',
        text: 'The AI Support service is momentarily unreachable. Please verify your backend server connection.',
        category: 'system_error',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
    } finally {
      setLoading(false);
    }

  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="group flex items-center gap-2.5 rounded-full bg-brand-900 hover:bg-brand-800 px-5 py-3.5 text-sm font-bold text-white shadow-xl hover:scale-105 transition duration-200"
            aria-label="Open AI Support Chat"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-medgreen-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-medgreen-primary"></span>
            </span>
            <MessageSquare className="h-5 w-5" />
            <span>AI Support</span>
          </button>
        )}
      </div>

      {/* Chat Panel / Slide-over Modal */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[92vw] sm:w-[420px] h-[580px] max-h-[85vh] rounded-3xl border border-medical-border bg-white shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200 text-left">
          {/* Top header */}
          <div className="flex items-center justify-between border-b border-medical-border bg-brand-900 px-5 py-4 text-white">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-white/10 p-2 text-white border border-white/20">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  EYESCREEN AI Support
                  <span className="rounded bg-medgreen-primary/20 px-1.5 py-0.5 text-[9px] font-mono text-emerald-300">24×7</span>
                </h4>

                <p className="text-[11px] text-gray-300">Platform assistance & FAQ agent</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1.5 text-gray-300 hover:text-white hover:bg-white/10 transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs bg-medical-bg">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`rounded-full p-2 shrink-0 ${
                    m.sender === 'user' ? 'bg-brand-900 text-white' : 'bg-white border border-medical-border text-brand-primary'
                  }`}
                >
                  {m.sender === 'user' ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
                </div>

                <div
                  className={`max-w-[80%] rounded-2xl p-3.5 space-y-1 ${
                    m.sender === 'user'
                      ? 'bg-brand-primary text-white rounded-tr-none shadow-sm'
                      : 'bg-white border border-medical-border text-medical-text rounded-tl-none shadow-sm'
                  }`}
                >
                  {m.category && m.sender === 'assistant' && (
                    <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-brand-primary font-bold tracking-wider">
                      <Sparkles className="h-2.5 w-2.5" />
                      <span>Category: {m.category}</span>
                    </div>
                  )}
                  <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>
                  <span className={`block text-[9px] text-right font-mono ${m.sender === 'user' ? 'text-white/80' : 'text-medical-text-muted'}`}>
                    {m.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-medical-text-muted text-xs italic p-2">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-brand-primary" />
                <span>AI is formulating response...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick FAQ Question Chips */}
          <div className="border-t border-medical-border bg-white p-2 overflow-x-auto flex gap-1.5 scrollbar-none">
            {FREQUENT_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                className="shrink-0 rounded-full border border-medical-border bg-medical-bg px-3 py-1 text-[11px] text-medical-text hover:border-brand-primary hover:text-brand-primary transition"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Chat input box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2 border-t border-medical-border bg-white p-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about upload, Grad-CAM, quality..."
              className="flex-1 rounded-xl border border-medical-border bg-medical-bg px-3.5 py-2 text-xs text-medical-text placeholder-medical-text-muted focus:border-brand-primary focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="rounded-xl bg-brand-900 p-2.5 text-white hover:bg-brand-800 transition disabled:opacity-40"
              title="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>

          {/* Disclaimer Footer */}
          <div className="border-t border-medical-border bg-medical-bg px-4 py-1.5 text-[10px] text-medical-text-muted text-center">
            Informational assistant only. Not clinical or physician advice.
          </div>
        </div>
      )}
    </>
  );
};
