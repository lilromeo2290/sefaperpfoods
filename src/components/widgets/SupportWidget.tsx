'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, MessageSquare, Phone, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useApp } from '@/lib/store';
import { cn } from '@/lib/utils';

interface Msg { from: 'bot' | 'user'; text: string; }

const SUGGESTIONS = [
  'How do I place an order?',
  'What payment methods do you accept?',
  'Do you deliver to my area?',
  'Tell me about your shitor sizes',
];

const BOT_REPLIES: { match: RegExp; reply: string }[] = [
  { match: /order|buy|purchase/i, reply: 'To place an order: browse our Shop, add items to your cart, then checkout. You can pay with MTN/Telecel/AirtelTigo Mobile Money, Hubtel, Paystack, ExpressPay, Visa or Mastercard. Delivery is 1-2 days in Accra, 2-3 days elsewhere.' },
  { match: /payment|pay|momo|mobile money|card/i, reply: 'We accept MTN MoMo, Telecel Cash, AirtelTigo Money, Hubtel, Paystack, ExpressPay, Visa and Mastercard. All payments are SSL-encrypted and confirmed instantly.' },
  { match: /deliver|shipping|area|region/i, reply: 'We deliver nationwide across all 16 regions of Ghana. Accra, Kumasi, Takoradi, Ho, Koforidua & Tamale get 24-48h delivery. Other areas 2-4 days. You will receive SMS + WhatsApp tracking updates.' },
  { match: /shitor|chili|pepper/i, reply: 'SBF Special Shitor comes in 120g (GHS 18), 250g (GHS 30), 500g (GHS 55), 1kg (GHS 100) and 5kg bulk (GHS 450). It is slow-roast in Dzodze with smoked fish, dried shrimp and sun-dried peppers. No preservatives.' },
  { match: /tom brown|porridge|breakfast/i, reply: 'SBF Tom Brown Powder is a roasted cereal blend (maize, soybean, groundnut, millet). Available in 400g (GHS 32), 800g (GHS 58), 1.5kg (GHS 95) and 5kg bulk (GHS 280). Quick 3-minute preparation — perfect for kids and the whole family.' },
  { match: /distributor|wholesale|bulk|resell/i, reply: 'Our distributor program offers bulk pricing, dedicated invoices, branch order management and regional exclusivity. Tap "Become a Distributor" to apply — we approve within 48 hours.' },
  { match: /track|status|where/i, reply: 'You can track any order from the My Account page using your order reference (e.g. SBF-2026-1234). You will also get SMS + WhatsApp updates at every stage: received → paid → processing → dispatched → in transit → delivered.' },
  { match: /refund|return|cancel/i, reply: 'We offer full refunds for damaged or incorrect items reported within 48 hours of delivery. Just contact us with your order reference and a photo. Refunds are processed back to your original payment method within 3-5 business days.' },
  { match: /hello|hi|hey|good (morning|afternoon|evening)/i, reply: 'Hello and welcome to Sefaperp Foods! 🌶️ I am your AI assistant. How can I help you today — orders, payments, delivery, or product info?' },
];

export function SupportWidget() {
  const { chatOpen, setChatOpen } = useApp();
  const [messages, setMessages] = useState<Msg[]>([
    {
      from: 'bot',
      text: 'Hello and welcome to Sefaperp Foods! 🌶️ I am your AI assistant. Ask me anything about products, ordering, payments or delivery.',
    },
  ]);
  const [input, setInput] = useState('');
  const [unread, setUnread] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, chatOpen]);

  const send = (text: string) => {
    if (!text.trim()) return;
    setMessages((m) => [...m, { from: 'user', text }]);
    setInput('');
    // AI reply
    setTimeout(() => {
      const found = BOT_REPLIES.find((r) => r.match.test(text));
      const reply = found?.reply || 'Thanks for your message! For complex queries, please WhatsApp us at +233 553 878 748 or call our support line at +233 247 968 973. You can also tap "Contact" in the menu.';
      setMessages((m) => [...m, { from: 'bot', text: reply }]);
      if (!chatOpen) setUnread(true);
    }, 600);
  };

  return (
    <>
      {/* Floating buttons */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 items-end">
        <a
          href="https://wa.me/233553878748?text=Hello%20SBF%20Foods%2C%20I%20have%20a%20question"
          target="_blank"
          rel="noopener noreferrer"
          className="h-12 w-12 rounded-full bg-[#25D366] text-white shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
          aria-label="Chat on WhatsApp"
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
            <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.515 5.26l-.999 3.648 3.973-1.711zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.017-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
          </svg>
        </a>
        <button
          onClick={() => { setChatOpen(!chatOpen); setUnread(false); }}
          className={cn(
            'h-12 w-12 rounded-full shadow-lg flex items-center justify-center transition-all',
            chatOpen ? 'bg-brand-red text-white rotate-90' : 'gradient-brown text-gold hover:scale-105'
          )}
          aria-label={chatOpen ? 'Close chat' : 'Open live chat'}
        >
          {chatOpen ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
          {unread && !chatOpen && (
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-brand-red ring-2 ring-cream" />
          )}
        </button>
      </div>

      {/* Chat panel */}
      {chatOpen && (
        <div className="fixed bottom-20 right-4 z-50 w-[calc(100%-2rem)] sm:w-96 max-h-[70vh] flex flex-col bg-cream rounded-2xl shadow-brown border border-gold/30 overflow-hidden animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="gradient-brown text-cream p-4 flex items-center gap-3">
            <div className="relative">
              <Avatar className="h-10 w-10 border-2 border-gold">
                <AvatarFallback className="gradient-gold text-brown-dark">
                  <Sparkles className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-brand-green ring-2 ring-brown" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm flex items-center gap-2">
                SBF Assistant
                <span className="text-[10px] bg-brand-green/30 px-1.5 py-0.5 rounded">AI</span>
              </p>
              <p className="text-xs text-cream/70">Online • typically replies instantly</p>
            </div>
            <button
              onClick={() => setChatOpen(false)}
              className="text-cream/70 hover:text-cream"
              aria-label="Close chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto scrollbar-thin p-3 space-y-3 bg-ghana-pattern">
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn('flex gap-2 items-end', m.from === 'user' && 'flex-row-reverse')}
              >
                {m.from === 'bot' && (
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="gradient-gold text-brown-dark text-[10px]">
                      SBF
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    'max-w-[78%] rounded-2xl px-3 py-2 text-sm',
                    m.from === 'bot'
                      ? 'bg-white text-brown-dark rounded-bl-sm'
                      : 'gradient-brown text-cream rounded-br-sm'
                  )}
                >
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>

          {/* Suggestions */}
          {messages.length <= 2 && (
            <div className="px-3 pb-2 flex flex-wrap gap-1.5 bg-cream border-t border-gold/15">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-[11px] px-2.5 py-1.5 rounded-full bg-cream-dark text-brown hover:bg-gold hover:text-brown-dark transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form
            className="p-3 border-t border-gold/15 bg-white flex items-center gap-2"
            onSubmit={(e) => { e.preventDefault(); send(input); }}
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="bg-cream border-gold/30 text-brown-dark placeholder:text-brown/40"
            />
            <Button type="submit" size="icon" className="gradient-gold text-brown-dark hover:opacity-90 shrink-0">
              <Send className="h-4 w-4" />
            </Button>
          </form>

          {/* Alt channels */}
          <div className="px-3 py-2 bg-brown text-cream flex items-center justify-between text-xs">
            <a href="https://wa.me/233553878748" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-gold">
              <MessageSquare className="h-3 w-3" /> WhatsApp
            </a>
            <a href="tel:+233247968973" className="flex items-center gap-1 hover:text-gold">
              <Phone className="h-3 w-3" /> Call us
            </a>
            <span className="text-cream/60">Powered by SBF AI</span>
          </div>
        </div>
      )}
    </>
  );
}
