import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/client';
import WLogo from './WLogo';
import {
  X,
  Send,
  Sparkles,
  Bot,
  RotateCcw,
} from 'lucide-react';
import { WORLD_LANGUAGES } from './LanguageSelector';

const LOCALIZED_GREETINGS = {
  en: "Hello! 👋 I'm **WanderBot**, your personal Wanderlust AI Concierge. I can help you discover extraordinary stays, calculate trip budgets, plan day-by-day itineraries, or guide you on hosting your property. How can I help you today?",
  hi: "नमस्ते! 👋 मैं **WanderBot** हूँ, आपका व्यक्तिगत Wanderlust AI यात्रा सहायक। मैं आपके लिए असाधारण विला खोजने, यात्रा बजट का सटीक अनुमान लगाने, दिन-प्रतिदिन के यात्रा कार्यक्रम की योजना बनाने या अपनी प्रॉपर्टी लिस्ट करने में मदद कर सकता हूँ। आज मैं आपकी क्या सहायता करूँ?",
  es: "¡Hola! 👋 Soy **WanderBot**, tu conserje de viajes personal con IA en Wanderlust. Puedo ayudarte a descubrir estancias extraordinarias, calcular presupuestos de viaje o publicar tu propiedad. ¿En qué te puedo ayudar hoy?",
  fr: "Bonjour ! 👋 Je suis **WanderBot**, votre concierge IA personnel sur Wanderlust. Je peux vous aider à découvrir des séjours extraordinaires, estimer votre budget ou publier votre annonce. Comment puis-je vous aider aujourd'hui ?",
  de: "Hallo! 👋 Ich bin **WanderBot**, Ihr persönlicher KI-Reiseconcierge auf Wanderlust. Ich helfe Ihnen bei traumhaften Unterkünften, Reisebudgets und Reiseplänen. Wie kann ich Ihnen helfen?",
  ja: "こんにちは！👋 私はWanderlust専属AIコンシェルジュの **WanderBot** です。贅沢なヴィラの検索、旅行費用のAI試算、旅程プランの作成など、どんなことでもお気軽にお尋ねください！",
  zh: "您好！👋 我是您的专属AI旅行管家 **WanderBot**。我可以帮您寻找独家度假别墅、使用AI预估旅行开销、生成定制日度行程，或指导您发布房源。请问今天有什么可以帮您的？",
  ar: "مرحباً بك! 👋 أنا **WanderBot**، مساعد السفر الذكي الخاص بك على واندرلوست. يمكنني مساعدتك في العثور على إقامات ساحرة، وتقدير الميزانية، والتخطيط لرحلتك. كيف أساعدك اليوم؟",
  it: "Ciao! 👋 Sono **WanderBot**, il tuo concierge di viaggio AI su Wanderlust. Posso aiutarti a trovare soggiorni straordinari, stimare il budget o pianificare itinerari. Come posso aiutarti?",
  pt: "Olá! 👋 Sou o **WanderBot**, seu concierge pessoal de IA na Wanderlust. Posso ajudar você a encontrar estadias incríveis, calcular orçamentos ou planejar roteiros. Como posso ajudar?",
  ru: "Здравствуйте! 👋 Я **WanderBot**, ваш персональный ИИ-консьерж Wanderlust. Я помогу вам найти роскошное жилье, рассчитать бюджет поездки или спланировать маршрут. Чем могу помочь?",
};

const LOCALIZED_SUGGESTIONS = {
  en: [
    '🏖️ Find beachfront villas in Greece',
    '💰 How does booking & buyer protection work?',
    '🏔️ Suggest cozy alpine chalets',
    '🏡 How do I host my property on Wanderlust?',
  ],
  hi: [
    '🏖️ ग्रीस में समुद्र तट के सामने विला खोजें',
    '💰 बुकिंग और खरीदार सुरक्षा कैसे काम करती है?',
    '🏔️ आरामदायक अल्पाइन शैले का सुझाव दें',
    '🏡 मैं Wanderlust पर अपनी संपत्ति कैसे लिस्ट करूँ?',
  ],
  es: [
    '🏖️ Buscar villas frente a la playa en Grecia',
    '💰 ¿Cómo funciona la reserva y la protección al viajero?',
    '🏔️ Recomendar chalets alpinos acogedores',
    '🏡 ¿Cómo publico mi propiedad en Wanderlust?',
  ],
  fr: [
    '🏖️ Trouver des villas en bord de mer en Grèce',
    '💰 Comment fonctionnent la réservation et la protection voyageur ?',
    '🏔️ Suggérer des chalets alpins chaleureux',
    '🏡 Comment mettre mon logement en location sur Wanderlust ?',
  ],
  de: [
    '🏖️ Strandvillen in Griechenland finden',
    '💰 Wie funktionieren Buchung und Käuferschutz?',
    '🏔️ Gemütliche alpine Chalets empfehlen',
    '🏡 Wie inseriere ich meine Unterkunft auf Wanderlust?',
  ],
  ja: [
    '🏖️ ギリシャのビーチフロントヴィラを探す',
    '💰 予約と旅行者保護の仕組みは？',
    '🏔️ おすすめのアルペンシャレーを教えて',
    '🏡 Wanderlustで物件を掲載するには？',
  ],
  zh: [
    '🏖️ 寻找希腊海滨独栋别墅',
    '💰 预订流程与买家保障如何运作？',
    '🏔️ 推荐舒适的高山雪景木屋',
    '🏡 如何在 Wanderlust 上发布我的房源？',
  ],
  ar: [
    '🏖️ البحث عن فيلات شاطئية في اليونان',
    '💰 كيف يعمل الحجز وحماية المشتري؟',
    '🏔️ اقتراح شاليهات جبلية دافئة',
    '🏡 كيف أقوم بنشر عقاري على واندرلوست؟',
  ],
  it: [
    '🏖️ Trova ville sul mare in Grecia',
    '💰 Come funzionano le prenotazioni e la protezione?',
    '🏔️ Consiglia accoglienti chalet alpini',
    '🏡 Come posso pubblicare il mio alloggio?',
  ],
  pt: [
    '🏖️ Encontrar vilas à beira-mar na Grécia',
    '💰 Como funciona a reserva e a proteção ao hóspede?',
    '🏔️ Sugerir chalés alpinos acolhedores',
    '🏡 Como publicar meu imóvel no Wanderlust?',
  ],
  ru: [
    '🏖️ Найти виллы на побережье в Греции',
    '💰 Как работает бронирование и защита покупателя?',
    '🏔️ Порекомендуйте уютные альпийские шале',
    '🏡 Как разместить жилье на Wanderlust?',
  ],
};

const LOCALIZED_PLACEHOLDERS = {
  en: 'Ask WanderBot in any language...',
  hi: 'WanderBot से किसी भी भाषा में पूछें...',
  es: 'Pregunta a WanderBot en cualquier idioma...',
  fr: 'Posez vos questions à WanderBot dans n\'importe quelle langue...',
  de: 'Fragen Sie WanderBot in jeder Sprache...',
  ja: 'どの言語でもWanderBotにご質問ください...',
  zh: '用任何语言向 WanderBot 提问...',
  ar: 'اسأل واندر بوت بأي لغة...',
  it: 'Chiedi a WanderBot in qualsiasi lingua...',
  pt: 'Pergunte ao WanderBot em qualquer idioma...',
  ru: 'Спросите WanderBot на любом языке...',
};

const SideChatbot = () => {
  const { i18n } = useTranslation();
  const currentLang = (i18n.language || 'en').split('-')[0];

  const getGreeting = (lang) => ({
    role: 'bot',
    content: LOCALIZED_GREETINGS[lang] || LOCALIZED_GREETINGS.en,
  });

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([getGreeting(currentLang)]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Update initial message if only greeting exists when language is switched
  useEffect(() => {
    if (messages.length === 1 && messages[0].role === 'bot') {
      setMessages([getGreeting(currentLang)]);
    }
  }, [currentLang]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      inputRef.current?.focus();
    }
  }, [isOpen, messages]);

  const handleSend = async (messageText = input) => {
    const textToSend = messageText.trim();
    if (!textToSend || loading) return;

    const newMessages = [...messages, { role: 'user', content: textToSend }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await api.post('/ai/chat', {
        message: textToSend,
        history: newMessages,
        language: currentLang,
      });

      setMessages((prev) => [
        ...prev,
        { role: 'bot', content: response.data.reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'bot',
          content:
            currentLang === 'hi'
              ? 'क्षमा करें, अस्थायी नेटवर्क समस्या है। कृपया कुछ ही पलों में पुनः प्रयास करें।'
              : currentLang === 'es'
              ? 'Lo siento, hay una dificultad temporal de conexión. Por favor, intenta de nuevo.'
              : "I'm sorry, I'm having a momentary connection glitch. Please try asking again in a moment!",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([getGreeting(currentLang)]);
  };

  // Render text with basic markdown bold support
  const renderMessageContent = (content) => {
    const parts = content.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  const activeLangObj = WORLD_LANGUAGES.find((l) => l.code === currentLang) || WORLD_LANGUAGES[0];
  const suggestions = LOCALIZED_SUGGESTIONS[currentLang] || LOCALIZED_SUGGESTIONS.en;
  const placeholder = LOCALIZED_PLACEHOLDERS[currentLang] || LOCALIZED_PLACEHOLDERS.en;

  return (
    <div className="side-chatbot-wrapper" id="wanderlust-ai-chatbot">
      {/* Floating Trigger Button when closed */}
      {!isOpen && (
        <button
          className="chatbot-trigger-btn"
          onClick={() => setIsOpen(true)}
          aria-label="Open AI Concierge Chatbot"
          id="open-side-chatbot-btn"
        >
          <div className="chatbot-trigger-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <WLogo size={22} />
          </div>
          <span className="chatbot-trigger-text">AI Concierge</span>
          <span className="chatbot-online-pulse"></span>
        </button>
      )}

      {/* Chat Window when open */}
      {isOpen && (
        <div className="chatbot-window">
          {/* Header */}
          <div className="chatbot-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="chatbot-avatar-badge">
                <Bot size={20} color="#FFFFFF" />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <h4 style={{ margin: 0, fontSize: '0.98rem', color: '#111827' }}>
                    WanderBot AI
                  </h4>
                  <span className="chatbot-live-tag">Online</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                  <span style={{ fontSize: '0.74rem', color: '#6B7280' }}>
                    {activeLangObj.flag} {activeLangObj.nativeName}
                  </span>
                  <span style={{ fontSize: '0.70rem', color: '#7C3AED', fontWeight: 600, background: '#F5F3FF', padding: '1px 6px', borderRadius: 4 }}>
                    Multi-Lang AI
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <button
                className="chatbot-action-icon"
                onClick={handleResetChat}
                title="Restart conversation"
              >
                <RotateCcw size={16} />
              </button>
              <button
                className="chatbot-action-icon"
                onClick={() => setIsOpen(false)}
                title="Close chatbot"
                id="close-side-chatbot-btn"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="chatbot-body">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`chat-bubble-row ${msg.role === 'user' ? 'user-row' : 'bot-row'}`}
              >
                {msg.role === 'bot' && (
                  <div className="bubble-avatar bot">
                    <Bot size={14} color="#7C3AED" />
                  </div>
                )}
                <div className={`chat-bubble ${msg.role}`}>
                  <p style={{ margin: 0, whiteSpace: 'pre-line' }}>
                    {renderMessageContent(msg.content)}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {loading && (
              <div className="chat-bubble-row bot-row">
                <div className="bubble-avatar bot">
                  <Bot size={14} color="#7C3AED" />
                </div>
                <div className="chat-bubble bot typing">
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggested Prompts (visible on few messages) */}
          {messages.length <= 2 && (
            <div className="chatbot-suggestions">
              <div
                style={{
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  color: '#9CA3AF',
                  textTransform: 'uppercase',
                  marginBottom: 6,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <Sparkles size={12} color="#7C3AED" />
                <span>
                  {currentLang === 'hi'
                    ? 'त्वरित सुझाव'
                    : currentLang === 'es'
                    ? 'Sugerencias rápidas'
                    : currentLang === 'fr'
                    ? 'Suggestions rapides'
                    : 'Quick Suggestions'}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {suggestions.map((prompt, i) => (
                  <button
                    key={i}
                    className="chatbot-prompt-btn"
                    onClick={() => handleSend(prompt)}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Footer */}
          <form
            className="chatbot-input-row"
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            <input
              ref={inputRef}
              type="text"
              className="chatbot-input"
              placeholder={placeholder}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              id="chatbot-message-input"
            />
            <button
              type="submit"
              className="chatbot-send-btn"
              disabled={loading || !input.trim()}
              id="chatbot-send-btn"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default SideChatbot;
