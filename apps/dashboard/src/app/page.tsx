'use client';

import { useEffect, useRef, useState } from 'react';
import { DotGridBackground } from '@/components/marketing/DotGridBackground';
import { AnimatedGeometry } from '@/components/marketing/AnimatedGeometry';
import { MarqueePills } from '@/components/marketing/MarqueePills';
import { SectionNav } from '@/components/marketing/SectionNav';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Mail, Github } from 'lucide-react';

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentSection, setCurrentSection] = useState(0);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  // IntersectionObserver to track current section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            const index = sectionRefs.current.indexOf(entry.target as HTMLDivElement);
            if (index !== -1) {
              setCurrentSection(index);
            }
          }
        });
      },
      {
        threshold: 0.5,
        rootMargin: '-20% 0px -20% 0px',
      }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      sectionRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  const scrollToSection = (index: number) => {
    const section = sectionRefs.current[index];
    if (section && containerRef.current) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const keywords1 = [
    'Low Latency',
    'Verifiable',
    'tRPC SDK',
    'EVM Compatible',
    'wagmi Integration',
    'Edge Speed',
  ];

  const keywords2 = [
    'N-of-M Redundancy',
    'Consistency Verification',
    'Bronze/Silver/Gold',
    'Threshold PASS/FAIL',
    'DISPUTE Resolution',
  ];

  const keywords3 = [
    'On-Chain Receipts',
    'Settlement',
    'Proof-of-Inference',
    'Auditable Results',
    'v0 Protocol',
  ];

  const keywords4 = [
    'Router API',
    'BullMQ',
    'Node Agents',
    'Verifier',
    'Contracts',
    'FastAPI',
    'Ollama',
    'PaddleOCR',
  ];

  return (
    <div
      ref={containerRef}
      className="h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth"
      style={{ scrollBehavior: 'smooth' }}
    >
      {/* Section 1: Fast, familiar, frictionless */}
      <section
        ref={(el) => { sectionRefs.current[0] = el; }}
        className="h-screen snap-start snap-always flex items-center relative bg-slate-950"
      >
        <DotGridBackground />
        <div className="container mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-6">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Verifiable Inference,
              <br />
              at edge speed.
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed">
              Fast, familiar, frictionless. A prototype for low-latency inference with
              verification-oriented system design. Compatible with existing tools such as
              EVM-based wallets and TypeScript clients.
            </p>
            <div className="flex gap-4">
              <Link href="/dashboard">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Enter Dashboard
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/pitch">
                <Button variant="outline" size="lg" className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10">
                  Pitch Deck
                </Button>
              </Link>
            </div>
            <div className="flex flex-wrap gap-2 mt-8">
              {keywords1.map((keyword, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full bg-blue-600/20 border border-blue-500/30 text-slate-300 text-sm"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
          <div className="hidden lg:block h-[600px] relative">
            <AnimatedGeometry variant={1} />
          </div>
        </div>
      </section>

      {/* Section 2: Decentralized by design */}
      <section
        ref={(el) => { sectionRefs.current[1] = el; }}
        className="h-screen snap-start snap-always flex items-center relative bg-slate-950"
      >
        <DotGridBackground />
        <div className="container mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="hidden lg:block h-[600px] relative order-2">
            <AnimatedGeometry variant={2} />
          </div>
          <div className="space-y-6 order-1">
            <h2 className="text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              N-of-M redundancy
              <br />
              + consistency verification
            </h2>
            <p className="text-xl text-slate-300 leading-relaxed">
              Decentralized by design. Bronze, Silver, and Gold redundancy tiers model how
              threshold-based verification could classify results as PASS, FAIL, or DISPUTE.
            </p>
            <div className="flex flex-wrap gap-2 mt-8">
              {keywords2.map((keyword, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full bg-purple-600/20 border border-purple-500/30 text-slate-300 text-sm"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Trust, settled on-chain */}
      <section
        ref={(el) => { sectionRefs.current[2] = el; }}
        className="h-screen snap-start snap-always flex items-center relative bg-slate-950"
      >
        <DotGridBackground />
        <div className="container mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-6">
            <h2 className="text-6xl font-bold bg-gradient-to-r from-pink-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              On-chain receipts,
              <br />
              auditable results
            </h2>
            <p className="text-xl text-slate-300 leading-relaxed">
              Receipt-oriented by design. The prototype includes an on-chain settlement model
              and receipt flow to make verification and accountability explicit in the system
              architecture.
            </p>
            <div className="flex flex-wrap gap-2 mt-8">
              {keywords3.map((keyword, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full bg-pink-600/20 border border-pink-500/30 text-slate-300 text-sm"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
          <div className="hidden lg:block h-[600px] relative">
            <AnimatedGeometry variant={3} />
          </div>
        </div>
      </section>

      {/* Section 4: Plug & play integration */}
      <section
        ref={(el) => { sectionRefs.current[3] = el; }}
        className="h-screen snap-start snap-always flex items-center relative bg-slate-950"
      >
        <DotGridBackground />
        <div className="container mx-auto px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-12">
            <div className="space-y-6">
              <h2 className="text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Drop-in API,
                <br />
                queue-based routing
              </h2>
              <p className="text-xl text-slate-300 leading-relaxed">
              Queue-based integration across a Router API, Python node agents, verifier
              workers, and contract packages. The current repository demonstrates the system
              boundaries even where full live integration is still in progress.
              </p>
              <div className="flex gap-4 mt-8">
                <Link href="/dashboard">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    Launch App
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden lg:block h-[400px] relative">
              <AnimatedGeometry variant={4} />
            </div>
          </div>

          {/* Marquee Pills */}
          <div className="space-y-4">
            <MarqueePills items={keywords4} speed={25} direction="left" />
            <MarqueePills items={[...keywords4].reverse()} speed={30} direction="right" />
          </div>

          {/* Contact Links */}
          <div className="mt-16 pt-8 border-t border-slate-800">
            <div className="flex flex-wrap gap-6 justify-center items-center">
              <a
                href="mailto:contact@edgenet.ai"
                className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors"
              >
                <Mail className="w-5 h-5" />
                <span>Email</span>
              </a>
              <a
                href="https://github.com/ninglinLiu/edgenetai"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors"
              >
                <Github className="w-5 h-5" />
                <span>GitHub</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Section Navigation */}
      <SectionNav
        sections={4}
        currentSection={currentSection}
        onNavigate={scrollToSection}
      />
    </div>
  );
}
