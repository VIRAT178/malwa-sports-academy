import React from "react";
import { ShieldCheck, Trophy, Sparkles, Eye, Flag, Target, HeartHandshake } from "lucide-react";
import { academyBuildingImg } from "../data";

export default function About() {
  const pillars = [
    {
      icon: <Trophy className="h-6 w-6 text-yellow-500" />,
      title: "Championship Culture",
      desc: "Every training session mimics pressure conditions to cultivate resilient minds capable of absolute victory under stress."
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-red-500" />,
      title: "Science-Backed Training",
      desc: "Our biomechanical tracking systems, high-speed camera sensors, and state-of-the-art physics labs ensure high-efficiency performance."
    },
    {
      icon: <Target className="h-6 w-6 text-teal-400" />,
      title: "Personalized Pathways",
      desc: "No template coaching. Each athlete receives a digital tracker customized by our world-class certified advisors."
    },
    {
      icon: <HeartHandshake className="h-6 w-6 text-purple-400" />,
      title: "Indore Community Trust",
      desc: "Rooted deeply near Mayank Blue Water Park, we serve as the premier sports launchpad for Indore, training state & national team prospective players."
    }
  ];

  return (
    <section className="bg-white py-16 sm:py-24 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 bg-red-50 border border-red-200 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-widest text-red-600">
            <Sparkles className="h-3.5 w-3.5" />
            <span>WHO WE ARE</span>
          </div>
          <h2 className="font-display text-4xl sm:text-6xl font-black uppercase text-zinc-900 tracking-wide">
            MALWA SPORTS <span className="text-red-600">ACADEMY</span>
          </h2>
          <p className="text-zinc-600 text-base sm:text-lg leading-relaxed">
            Founded with a vision to revolutionize grassroots athletics in Central India, Malwa Sports Academy (MSA) provides athletes with national-standard coaching, state-of-the-art facilities, and AI-enabled diagnostics.
          </p>
        </div>

        {/* Visual Story Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          
          {/* Left Side: Editorial Image Overlay */}
          <div className="lg:col-span-6 relative group">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-red-600 to-blue-600 opacity-10 blur-xl group-hover:opacity-25 transition duration-1000" />
            <div className="relative rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-md">
              <img
                src={academyBuildingImg}
                alt="Malwa Sports Academy Building"
                className="w-full h-80 object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-60" />
              
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl border border-zinc-200/80 bg-white/95 backdrop-blur-md shadow-lg">
                <p className="text-sm font-semibold text-zinc-800 italic">
                  "Our goal is to produce athletes who don't just participate, but dominate national levels. Indore has raw grit; we provide the precision tools."
                </p>
                <div className="mt-3 flex items-center justify-between border-t border-zinc-100 pt-2 text-xs">
                  <span className="font-black text-red-600 uppercase tracking-wider">MSA Leadership Board</span>
                  <span className="text-zinc-500 font-bold">Main Campus</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Mission & Vision Cards */}
          <div className="lg:col-span-6 space-y-6">
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50/50 p-6 sm:p-8 space-y-4 shadow-sm">
              <div className="flex items-center space-x-3 text-red-600">
                <Eye className="h-6 w-6" />
                <h3 className="font-title text-xl font-black uppercase tracking-wider">OUR VISION</h3>
              </div>
              <p className="text-zinc-600 text-sm sm:text-base leading-relaxed font-medium">
                To stand as India's benchmark multi-sports training academy, transforming Indore into an elite powerhouse of national and international medal-winning champions. We aim to integrate athletic development with psychological fortitude.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-zinc-50/50 p-6 sm:p-8 space-y-4 shadow-sm">
              <div className="flex items-center space-x-3 text-red-600">
                <Flag className="h-6 w-6" />
                <h3 className="font-title text-xl font-black uppercase tracking-wider">OUR MISSION</h3>
              </div>
              <p className="text-zinc-600 text-sm sm:text-base leading-relaxed font-medium">
                To offer world-class sport pathways that fuse professional coaching certifications with state-of-the-art telemetry and personalized diagnostics. We break socio-economic barriers to uplift every talented youth in Indore.
              </p>
            </div>
          </div>

        </div>

        {/* Pillars / Core values Grid */}
        <div className="border-t border-zinc-100 pt-16">
          <div className="text-center mb-12">
            <h3 className="font-title text-2xl sm:text-3xl font-black uppercase tracking-wider text-zinc-900">
              The Four Pillars of MSA
            </h3>
            <p className="text-zinc-500 text-xs sm:text-sm uppercase tracking-widest mt-1 font-bold">
              Engineered for athlete peak output
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((pillar, i) => (
              <div
                key={i}
                className="group rounded-xl border border-zinc-200 bg-white p-6 hover:border-red-600/40 hover:shadow-lg transition-all duration-300 space-y-3 shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-50 border border-zinc-100 group-hover:bg-red-50 group-hover:border-red-200 transition-colors">
                  {pillar.icon}
                </div>
                <h4 className="font-title text-lg font-bold uppercase tracking-wider text-zinc-900">
                  {pillar.title}
                </h4>
                <p className="text-zinc-600 text-xs sm:text-sm leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
