'use client';

import { Phone, Mail, MapPin, Clock, Send, MessageCircle, Facebook, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/lib/store';
import { toast } from 'sonner';

export function ContactSection() {
  const { setChatOpen } = useApp();

  return (
    <div className="min-h-screen">
      <div className="gradient-brown text-cream py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <Badge className="bg-cream/10 text-gold border border-gold/30">Contact Us</Badge>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-gold mt-3 text-balance">
            We're here to help
          </h1>
          <p className="text-cream/80 mt-3 max-w-2xl">
            Questions about products, orders, deliveries or distributorship? Reach us through any channel below — we respond within 24 hours, Monday to Saturday.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-6 mb-12">
          {[
            { icon: Phone, label: 'Call us', value: '+233 247 968 973', sub: 'Mon-Sat, 8am - 7pm', href: 'tel:+233247968973' },
            { icon: Phone, label: 'Alt line', value: '+233 553 878 748', sub: 'WhatsApp & calls', href: 'tel:+233553878748' },
            { icon: Mail, label: 'Email us', value: 'hello@sbffoods.com', sub: '24-hour response', href: 'mailto:hello@sbffoods.com' },
          ].map((c) => (
            <Card key={c.label} className="p-6 border-gold/15 text-center">
              <div className="h-12 w-12 rounded-xl gradient-gold flex items-center justify-center mx-auto mb-3 shadow-gold">
                <c.icon className="h-6 w-6 text-brown-dark" />
              </div>
              <p className="text-xs text-brown/60 uppercase tracking-wider">{c.label}</p>
              {c.href ? (
                <a href={c.href} className="block font-display text-lg font-bold text-brown-dark hover:text-gold mt-1">{c.value}</a>
              ) : (
                <p className="font-display text-lg font-bold text-brown-dark mt-1">{c.value}</p>
              )}
              <p className="text-xs text-brown/60 mt-1">{c.sub}</p>
            </Card>
          ))}
        </div>

        {/* Address strip (since we removed the visit-us card) */}
        <Card className="p-5 border-gold/15 mb-8 flex items-center gap-3 justify-center text-center">
          <MapPin className="h-5 w-5 text-gold shrink-0" />
          <p className="text-sm text-brown-dark">
            <span className="font-semibold">Visit us:</span> Dzodze, Ketu North • Volta Region, Ghana
          </p>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form */}
          <Card className="p-6 border-gold/15">
            <h2 className="font-display text-2xl font-bold text-brown-dark mb-1">Send us a message</h2>
            <p className="text-sm text-brown/60 mb-4">We'll get back to you within 24 hours.</p>
            <form
              className="space-y-3"
              onSubmit={(e) => { e.preventDefault(); toast.success('Message sent! We will respond within 24 hours.'); (e.target as HTMLFormElement).reset(); }}
            >
              <div className="grid sm:grid-cols-2 gap-3">
                <Input required placeholder="Full name" className="bg-cream border-gold/30 text-brown-dark" />
                <Input required type="tel" placeholder="Phone number" className="bg-cream border-gold/30 text-brown-dark" />
              </div>
              <Input required type="email" placeholder="Email address" className="bg-cream border-gold/30 text-brown-dark" />
              <Input placeholder="Subject (optional)" className="bg-cream border-gold/30 text-brown-dark" />
              <textarea
                required
                placeholder="Your message..."
                rows={5}
                className="w-full px-3 py-2 rounded-lg border border-gold/30 bg-cream text-brown-dark placeholder:text-brown/40 text-sm resize-none"
              />
              <Button type="submit" className="w-full gradient-gold text-brown-dark hover:opacity-90 font-semibold h-11">
                <Send className="h-4 w-4 mr-2" /> Send Message
              </Button>
            </form>
          </Card>

          {/* Channels + Hours */}
          <div className="space-y-6">
            <Card className="p-6 border-gold/15">
              <h3 className="font-display text-xl font-bold text-brown-dark mb-3">Other channels</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start border-brown text-brown hover:bg-cream h-12" onClick={() => setChatOpen(true)}>
                  <MessageCircle className="h-5 w-5 mr-3 text-gold" />
                  <div className="text-left">
                    <p className="font-semibold">Live Chat (AI Assistant)</p>
                    <p className="text-xs text-brown/60">Instant answers, 24/7</p>
                  </div>
                </Button>
                <a href="https://wa.me/233553878748" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="w-full justify-start border-brown text-brown hover:bg-cream h-12">
                    <svg viewBox="0 0 24 24" className="h-5 w-5 mr-3 fill-[#25D366]">
                      <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24z"/>
                    </svg>
                    <div className="text-left">
                      <p className="font-semibold">WhatsApp</p>
                      <p className="text-xs text-brown/60">+233 553 878 748</p>
                    </div>
                  </Button>
                </a>
                <a href="https://m.me/sbffoods" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="w-full justify-start border-brown text-brown hover:bg-cream h-12">
                    <Facebook className="h-5 w-5 mr-3 text-[#1877F2]" />
                    <div className="text-left">
                      <p className="font-semibold">Facebook Messenger</p>
                      <p className="text-xs text-brown/60">@sbffoods</p>
                    </div>
                  </Button>
                </a>
              </div>
            </Card>

            <Card className="p-6 border-gold/15">
              <h3 className="font-display text-xl font-bold text-brown-dark mb-3 flex items-center gap-2">
                <Clock className="h-5 w-5 text-gold" /> Business Hours
              </h3>
              <div className="space-y-1.5 text-sm">
                {[
                  { day: 'Monday - Friday', hours: '8:00 AM - 7:00 PM' },
                  { day: 'Saturday', hours: '9:00 AM - 5:00 PM' },
                  { day: 'Sunday', hours: 'Closed' },
                  { day: 'Public Holidays', hours: 'By appointment' },
                ].map((h) => (
                  <div key={h.day} className="flex justify-between">
                    <span className="text-brown/70">{h.day}</span>
                    <span className="font-medium text-brown-dark">{h.hours}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
