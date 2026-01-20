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
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

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
              Fast, familiar, frictionless. Low latency inference with verifiable results.
              Compatible with existing tools: tRPC SDK, EVM, and wagmi integration.
            </p>
            <div className="flex gap-4">
              <Link href="/dashboard">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Enter Dashboard
                  <ArrowRight className="ml-2 w-5 h-5" />
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
              Decentralized by design. Bronze/Silver/Gold redundancy tiers with threshold-based
              verification. PASS/FAIL/DISPUTE resolution ensures trust and reliability.
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
              Trust, settled on-chain. Every inference result is recorded as an on-chain receipt
              with proof-of-inference (v0). Fully auditable and verifiable.
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
                Plug & play integration. Router API with BullMQ, Node Agents (Python FastAPI),
                Verifier (N-of-M consistency), and Solidity Contracts for on-chain receipts.
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
                href="mailto:x07514475479@gmail.com"
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
