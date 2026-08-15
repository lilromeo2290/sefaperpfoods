'use client';

import {
  Heart, Target, Eye, Shield, Award, Users, Leaf, Factory, FlaskConical,
  CheckCircle2, ChevronRight, Sparkles, Truck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useApp } from '@/lib/store';

export function AboutSection() {
  const { setView } = useApp();

  return (
    <div>
      {/* Hero */}
      <section className="relative gradient-brown text-cream py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-grain opacity-10" />
        <div className="container mx-auto px-4 md:px-6 relative">
          <div className="max-w-3xl">
            <Badge className="bg-cream/10 text-gold border border-gold/30">Our Story</Badge>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-gold mt-3 text-balance">
              From a family kitchen in Dzodze to tables across Ghana
            </h1>
            <p className="text-cream/80 mt-4 text-lg">
              Sefaperp Foods is a Ghanaian food processing company born in Dzodze, Volta Region. We slow-craft authentic Shitor, Tom Brown and traditional foods in small batches — without shortcuts, without preservatives.
            </p>
          </div>
        </div>
      </section>

      {/* History */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-brown border-4 border-white bg-cream">
                <img src="/story-products.png" alt="Sefaperp Foods — prepared with care, made for you, in our Dzodze facility" className="h-full w-full object-contain" />
              </div>
            </div>
            <div className="space-y-5">
              <Badge className="bg-cream-dark text-brown-dark border border-gold/30">Company History</Badge>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-brown-dark">
                Six years of slow-craft tradition
              </h2>
              <div className="space-y-4 text-brown/80 leading-relaxed">
                <p>
                  Sefaperp Foods began in 2018 when two brothers from Dzodze — Kojo and Kofi — started roasting chili peppers and stone-grinding roasted maize in their family kitchen. The recipes had been passed down from their grandmother, who insisted that authentic Shitor requires patience: sun-dried peppers, slow-roasted over low heat, smoked fish added by hand, oils rising to the surface only after hours of careful simmering.
                </p>
                <p>
                  Word spread beyond Dzodze. Orders came from Ho, Accra, Kumasi. In 2020, we built our first small factory in Ketu North — FDA-approved, HACCP-compliant — but we kept our grandmother's slow-craft method. Every batch is still simmered in small quantities, taste-tested before packing, and shipped fresh.
                </p>
                <p>
                  Today we ship nationwide to all 16 regions of Ghana, supply over 50 distributors, and serve more than 2,400 happy customers — but our promise has not changed: authentic Ghanaian taste, delivered fresh.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission / Vision */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-8 border-gold/20 hover:shadow-brown transition-shadow">
              <div className="h-12 w-12 rounded-xl gradient-gold flex items-center justify-center mb-4 shadow-gold">
                <Target className="h-6 w-6 text-brown-dark" />
              </div>
              <h3 className="font-display text-2xl font-bold text-brown-dark mb-2">Our Mission</h3>
              <p className="text-brown/80 leading-relaxed">
                To preserve and share authentic Ghanaian food heritage by crafting premium traditional foods in small batches — without preservatives, without shortcuts — and delivering them fresh to every household in Ghana and beyond. We exist to put real Ghanaian taste on every table.
              </p>
            </Card>
            <Card className="p-8 border-gold/20 hover:shadow-brown transition-shadow">
              <div className="h-12 w-12 rounded-xl gradient-brown flex items-center justify-center mb-4 shadow-brown">
                <Eye className="h-6 w-6 text-gold" />
              </div>
              <h3 className="font-display text-2xl font-bold text-brown-dark mb-2">Our Vision</h3>
              <p className="text-brown/80 leading-relaxed">
                To be Africa's most loved authentic food brand — recognised globally for quality, integrity, and the preservation of indigenous recipes. We envision Sefaperp Foods in every Ghanaian diaspora kitchen from London to Toronto, and a thriving distributor network creating jobs across all 16 regions of Ghana.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Food safety + manufacturing */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge className="bg-cream-dark text-brown-dark border border-gold/30">Quality & Safety</Badge>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-brown-dark mt-2">
              From farm to jar — every step audited
            </h2>
            <p className="text-brown/70 mt-3">
              Our Dzodze facility is FDA-approved, HACCP-compliant, and audited quarterly by independent food safety consultants.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Food Safety */}
            <Card className="p-6 border-gold/15">
              <h3 className="font-display text-xl font-bold text-brown-dark mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5 text-gold" /> Food Safety Standards
              </h3>
              <ul className="space-y-2.5">
                {[
                  'FDA Ghana certification (renewed annually)',
                  'HACCP-compliant process flow',
                  'Quarterly independent food safety audits',
                  'All staff trained in GMP (Good Manufacturing Practices)',
                  'Metal detector on every packaging line',
                  'Batch traceability from raw material to consumer',
                  'Microbiological testing of every production batch',
                  'Cold-chain monitoring for sensitive ingredients',
                ].map((s) => (
                  <li key={s} className="flex items-start gap-2 text-sm text-brown/80">
                    <CheckCircle2 className="h-4 w-4 text-brand-green shrink-0 mt-0.5" /> {s}
                  </li>
                ))}
              </ul>
            </Card>

            {/* Manufacturing */}
            <Card className="p-6 border-gold/15">
              <h3 className="font-display text-xl font-bold text-brown-dark mb-4 flex items-center gap-2">
                <Factory className="h-5 w-5 text-gold" /> Manufacturing Process
              </h3>
              <ol className="space-y-3">
                {[
                  { step: 'Sourcing', body: 'Sun-dried chili peppers from Volta & Northern Region farmers. Smoked fish & dried shrimp from Keta lagoon cooperatives.' },
                  { step: 'Cleaning & sorting', body: 'Manual + mechanical sorting to remove stems, stones and defective material. Triple-wash with potable water.' },
                  { step: 'Slow-roasting', body: 'Peppers roasted in small batches over low heat for 4-6 hours until darkened and aromatic. No industrial shortcuts.' },
                  { step: 'Blending & simmering', body: 'Roasted ingredients blended with spices and simmered with smoked fish, dried shrimp and oil until oils rise.' },
                  { step: 'Hot-filling & sealing', body: 'Paste hot-filled into sterilised jars, vacuum-sealed, and pasteurised to ensure shelf stability.' },
                  { step: 'Quality check & labelling', body: 'Every batch taste-tested, pH-checked, and metal-detected before labelling and dispatch.' },
                ].map((s, i) => (
                  <li key={s.step} className="flex gap-3">
                    <span className="h-7 w-7 rounded-full gradient-gold text-brown-dark flex items-center justify-center text-sm font-bold shrink-0">{i + 1}</span>
                    <div>
                      <p className="font-semibold text-brown-dark text-sm">{s.step}</p>
                      <p className="text-xs text-brown/70 mt-0.5">{s.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </Card>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 md:py-24 border-y border-gold/15">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <Badge className="bg-brown text-cream"><Award className="h-3 w-3 mr-1" /> Certifications</Badge>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-brown-dark mt-2">Certified for your trust</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: 'FDA Ghana', sub: 'Food & Drugs Authority', icon: Shield },
              { title: 'HACCP', sub: 'Hazard Analysis Critical Control Point', icon: FlaskConical },
              { title: 'GSA', sub: 'Ghana Standards Authority', icon: Award },
              { title: 'Made in Ghana', sub: 'Ghana Enterprises Agency', icon: Sparkles },
            ].map((c) => (
              <Card key={c.title} className="p-5 text-center border-gold/15 hover:shadow-brown transition-shadow">
                <div className="h-14 w-14 rounded-2xl gradient-gold flex items-center justify-center mx-auto mb-3 shadow-gold">
                  <c.icon className="h-7 w-7 text-brown-dark" />
                </div>
                <p className="font-display font-bold text-brown-dark">{c.title}</p>
                <p className="text-xs text-brown/60 mt-1">{c.sub}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge className="bg-cream-dark text-brown-dark border border-gold/30">Our Team</Badge>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-brown-dark mt-2">The family behind Sefaperp Foods</h2>
            <p className="text-brown/70 mt-3">From our Dzodze kitchen to your table — meet the people who keep our tradition alive.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { name: 'Kojo Sefaperp', role: 'Co-founder & Head of Production', initials: 'KS' },
              { name: 'Kofi Sefaperp', role: 'Co-founder & Operations Director', initials: 'KF' },
              { name: 'Ama Dzodze', role: 'Quality Assurance Manager', initials: 'AD' },
              { name: 'Yaw Mensah', role: 'Distribution & Logistics Lead', initials: 'YM' },
            ].map((m) => (
              <Card key={m.name} className="p-6 text-center border-gold/15 hover:shadow-brown transition-shadow">
                <div className="h-20 w-20 rounded-full gradient-brown flex items-center justify-center mx-auto mb-3 shadow-brown">
                  <span className="font-display font-bold text-gold text-2xl">{m.initials}</span>
                </div>
                <p className="font-display font-bold text-brown-dark">{m.name}</p>
                <p className="text-xs text-brown/60 mt-1">{m.role}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-brown-dark text-balance max-w-2xl mx-auto">
            Taste the difference that small-batch, slow-craft tradition makes.
          </h2>
          <p className="text-brown/70 mt-3 max-w-xl mx-auto">
            Join 2,400+ happy customers across all 16 regions of Ghana. Fresh from Dzodze to your door.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
            <Button size="lg" className="gradient-gold text-brown-dark hover:opacity-90 font-semibold h-12 px-6" onClick={() => setView('products')}>
              Shop Products <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
            <Button size="lg" variant="outline" className="border-brown text-brown hover:bg-cream h-12 px-6" onClick={() => setView('distributor')}>
              <Users className="h-4 w-4 mr-2" /> Become a Distributor
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
