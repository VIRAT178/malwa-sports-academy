import React, { useState, useEffect, useRef } from "react";
import { SPORTS_PROGRAMS } from "../data";
import { ChevronLeft, ChevronRight, Play, Sparkles } from "lucide-react";

interface HeroProps {
  onLearnMore: (sportId: string) => void;
  onAdmissionsClick: () => void;
}

export default function Hero({ onLearnMore, onAdmissionsClick }: HeroProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const autoPlayTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    autoPlayTimer.current = setInterval(() => {
      handleNext();
    }, 6000);
    return () => {
      if (autoPlayTimer.current) clearInterval(autoPlayTimer.current);
    };
  }, [currentIndex]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % SPORTS_PROGRAMS.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + SPORTS_PROGRAMS.length) % SPORTS_PROGRAMS.length);
  };

  const currentSport = SPORTS_PROGRAMS[currentIndex];

  return (
    <section className="relative w-full h-[75vh] sm:h-[80vh] md:h-[85vh] overflow-hidden bg-zinc-950 text-white flex flex-col md:flex-row items-stretch">
      
      {/* 1. BACKGROUND IMAGE SLIDES - RESPONSIVE PLACEMENT */}
      {/* Mobile/Tablet: Full Bleed | Desktop: Right Split Side */}
      <div className="absolute inset-0 md:left-[42%] md:right-0 z-0 overflow-hidden bg-zinc-900">
        {SPORTS_PROGRAMS.map((sport, idx) => (
          <div
            key={sport.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              idx === currentIndex ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"
            }`}
          >
            <img
              src={sport.bgImage}
              alt={sport.name}
              className="w-full h-full object-cover"
              style={{
                backgroundPosition: sport.bgPosition || "center center",
              }}
              referrerPolicy="no-referrer"
            />
          </div>
        ))}
        {/* Mobile/Tablet Gradient Mask (Dims the background to guarantee text readability) */}
        <div className="absolute inset-0 bg-black/40 md:hidden pointer-events-none" />
        
        {/* Desktop Gradient Mask (Soft gradient on the right side) */}
        <div className="hidden md:block absolute inset-y-0 left-0 right-0 bg-gradient-to-r from-black/60 via-transparent to-black/10 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* 2. DIAGONAL TRANSITION SPLIT (WHITE SLANTED BAR) */}
      {/* Only visible on desktop to separate solid color column and image container */}
      <div className="hidden md:block absolute left-[39%] top-0 bottom-0 w-[8%] bg-white transform -skew-x-12 z-20 shadow-[0_0_40px_rgba(255,255,255,0.4)]" />

      {/* 3. LEFT TEXT CONTENT COLUMN - RESPONSIBLY TRANSFORMS FROM OVERLAY TO SOLID SIDEBAR */}
      <div className="relative z-10 w-full md:w-[42%] h-full flex flex-col justify-center px-4 sm:px-6 md:pl-12 md:pr-10 lg:pl-16 lg:pr-12 py-12 md:py-0 bg-black/45 md:bg-zinc-950 shrink-0">
        <div className="space-y-4 sm:space-y-6 max-w-xl md:max-w-none animate-fade-in">
          
          {/* Subheader Badge */}
          <div className="inline-flex items-center space-x-2 bg-red-600/15 border border-red-500/25 px-3 py-1 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest text-red-500 w-fit">
            <Sparkles className="h-3 sm:h-3.5 w-3 sm:w-3.5" />
            <span>MALWA SPORTS ACADEMY (MSA)</span>
          </div>

          {/* Heading */}
          <h1 className="font-sans text-3xl sm:text-5xl md:text-4.5xl lg:text-5.5xl xl:text-6.5xl font-black italic uppercase leading-none tracking-tight drop-shadow-md md:drop-shadow-none">
            {currentSport.tagline.split(" ")[0]} <br />
            <span className="text-red-500">
              {currentSport.tagline.split(" ").slice(1).join(" ")}
            </span>
          </h1>

          {/* Description */}
          <p className="text-zinc-200 md:text-zinc-400 text-xs sm:text-sm md:text-base font-semibold leading-relaxed max-w-lg drop-shadow-md md:drop-shadow-none">
            {currentSport.description}
          </p>

          {/* Call To Actions */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
            <button
              onClick={() => onLearnMore(currentSport.id)}
              className="px-5 py-3 sm:px-6 sm:py-3.5 bg-red-600 hover:bg-red-700 font-black text-xs uppercase tracking-widest text-white rounded-xl transition transform hover:-translate-y-0.5 cursor-pointer shadow-lg flex items-center gap-2"
              id={`hero-explore-cta-${currentSport.id}`}
            >
              <span>EXPLORE DETAILS</span>
              <Play className="h-3 w-3 fill-white" />
            </button>
            <button
              onClick={onAdmissionsClick}
              className="px-5 py-3 sm:px-6 sm:py-3.5 border border-zinc-400 md:border-zinc-700 hover:border-white hover:bg-white hover:text-black font-black text-xs uppercase tracking-widest text-white md:text-zinc-300 rounded-xl transition cursor-pointer"
              id="hero-join-cta"
            >
              JOIN ACADEMY
            </button>
          </div>

        </div>
      </div>

      {/* 4. CONTROLS & PAGINATION */}
      {/* Dots Indicator: Bottom Left */}
      <div className="absolute bottom-6 left-4 sm:left-8 z-30 flex items-center space-x-2">
        {SPORTS_PROGRAMS.map((sport, idx) => (
          <button
            key={sport.id}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
              idx === currentIndex ? "w-6 bg-red-600" : "w-2.5 bg-zinc-600/85 hover:bg-zinc-400"
            }`}
            title={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* Arrow Navigation: Bottom Right */}
      <div className="absolute bottom-6 right-4 sm:right-8 z-30 flex items-center space-x-2">
        <button
          onClick={handlePrev}
          className="p-2.5 rounded-xl bg-black/60 hover:bg-red-600 text-white border border-white/10 hover:border-red-500 transition cursor-pointer"
          title="Previous Slide"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          onClick={handleNext}
          className="p-2.5 rounded-xl bg-black/60 hover:bg-red-600 text-white border border-white/10 hover:border-red-500 transition cursor-pointer"
          title="Next Slide"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

    </section>
  );
}
