import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BotMessageSquare,
  Send,
  User,
  Sprout,
  Sparkles,
  ExternalLink,
  Info,
  ShieldAlert,
  HelpCircle,
} from 'lucide-react';
import { useTranslation } from '../locales';
import { api } from '../services/api';
import { ChatResponse, ChatMessageItem } from '../types';

export const ChatbotPage: React.FC = () => {
  const { t, language } = useTranslation();

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessageItem[]>([
    {
      role: 'assistant',
      message_text:
        'Hello! I am your First Farmer Agriculture Assistant. Ask me about crop requirements, cultivation steps, pest control, harvesting maturity, or value-added processing.',
      related_links: [
        { title: 'Explore Crops', url: '/crops' },
        { title: 'Crop Recommendation', url: '/recommendations' },
      ],
      source_attribution: 'First Farmer Knowledge Base',
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string>('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: ChatMessageItem = {
      role: 'user',
      message_text: query.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post<ChatResponse>('/chat', {
        message: query.trim(),
        conversation_id: conversationId || undefined,
        language: language,
      });

      if (res.conversation_id && !conversationId) {
        setConversationId(res.conversation_id);
      }

      const botMsg: ChatMessageItem = {
        role: 'assistant',
        message_text: res.reply,
        related_links: res.related_links,
        source_attribution: res.source_attribution,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          message_text: 'Sorry, I encountered an issue contacting the knowledge base. Please try again.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    'How to cultivate Rice?',
    'Early blight in Tomato',
    'Value-added products from Banana',
    'Recommend crops for black soil',
    'How does high humidity affect crops?',
  ];

  return (
    <div className="space-y-6 pb-8 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-forest bg-sage-light px-2.5 py-1 rounded-full mb-2">
          <BotMessageSquare className="w-3.5 h-3.5" />
          <span>Agricultural Guidance Assistant</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-agri-text">
          {t.chatbot}
        </h1>
        <p className="text-sm text-agri-muted mt-1">
          Instant answers grounded in verified agronomy, ICAR bulletins, and state agricultural university recommendations.
        </p>
      </div>

      {/* Chat Container */}
      <div className="bg-white rounded-3xl border border-agri-border shadow-xs overflow-hidden flex flex-col h-[600px]">
        {/* Top Chat Bar */}
        <div className="px-6 py-3.5 bg-sage-light/50 border-b border-agri-border flex items-center justify-between text-xs font-semibold text-agri-muted">
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 rounded-full bg-forest animate-pulse" />
            <span className="text-forest font-bold">Knowledge Base Online</span>
          </div>
          <span className="text-[11px]">Grounded in verified agronomy records</span>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start space-x-3 ${
                m.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 text-white font-bold text-xs shadow-xs ${
                  m.role === 'user' ? 'bg-forest' : 'bg-forest-light'
                }`}
              >
                {m.role === 'user' ? <User className="w-4 h-4" /> : <Sprout className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-forest text-white'
                    : 'bg-agri-page text-agri-text border border-agri-border'
                }`}
              >
                <div className="whitespace-pre-wrap">{m.message_text}</div>

                {/* Related Links Pill Row */}
                {m.related_links && m.related_links.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-agri-border/60 flex flex-wrap gap-2">
                    <span className="text-[10px] font-bold text-agri-muted block w-full">
                      Related Library Links:
                    </span>
                    {m.related_links.map((link, lidx) => (
                      <Link
                        key={lidx}
                        to={link.url}
                        className="inline-flex items-center space-x-1 px-2.5 py-1 bg-white border border-agri-border rounded-lg text-forest hover:bg-sage-light font-bold text-[11px] transition-colors"
                      >
                        <span>{link.title}</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    ))}
                  </div>
                )}

                {/* Source attribution */}
                {m.source_attribution && (
                  <div className="mt-2 text-[10px] text-agri-muted/80 italic">
                    Source: {m.source_attribution}
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-start space-x-3">
              <div className="w-9 h-9 rounded-2xl bg-forest-light text-white flex items-center justify-center flex-shrink-0">
                <Sprout className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-4 rounded-2xl bg-agri-page border border-agri-border text-xs text-agri-muted flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-forest animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-forest animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 rounded-full bg-forest animate-bounce [animation-delay:0.4s]" />
                <span className="ml-1">Consulting agricultural knowledge base...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick prompt chips */}
        <div className="px-6 py-2.5 bg-agri-page border-t border-agri-border flex items-center space-x-2 overflow-x-auto text-[11px]">
          <span className="font-bold text-agri-muted whitespace-nowrap">Suggested:</span>
          {quickPrompts.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="px-2.5 py-1 rounded-lg bg-white border border-agri-border text-agri-text hover:bg-sage-light hover:text-forest whitespace-nowrap transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white border-t border-agri-border">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.askQuestion}
              className="flex-1 px-4 py-3 rounded-2xl border border-agri-border bg-agri-page text-sm text-agri-text focus:outline-none focus:ring-2 focus:ring-forest"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-3 bg-forest hover:bg-forest-light text-white rounded-2xl transition-all disabled:opacity-40 shadow-sm"
              aria-label="Send message"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
