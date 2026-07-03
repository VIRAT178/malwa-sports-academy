import React, { useRef } from "react";
import { Flame, ChevronLeft, ChevronRight } from "lucide-react";
import { SPORTS_PROGRAMS } from "../data";

interface SportsTrackProps {
  selectedSportId: string;
  onSportSelect: (sportId: string) => void;
}

export default function SportsTrack({ selectedSportId, onSportSelect }: SportsTrackProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  // Reorder sports to match the screenshot prominence
  const prioritizedSports = [
    ...SPORTS_PROGRAMS.filter(s => s.id === "volleyball"),
    ...SPORTS_PROGRAMS.filter(s => s.id === "athletics"),
    ...SPORTS_PROGRAMS.filter(s => s.id === "kabaddi"),
    ...SPORTS_PROGRAMS.filter(s => s.id === "badminton"),
    ...SPORTS_PROGRAMS.filter(s => s.id === "tabletennis"),
    ...SPORTS_PROGRAMS.filter(s => s.id === "indoorgames"),
    ...SPORTS_PROGRAMS.filter(s => s.id === "swimming"),
    ...SPORTS_PROGRAMS.filter(s => s.id === "rifleshooting"),
    ...SPORTS_PROGRAMS.filter(s => s.id === "gym"),
    ...SPORTS_PROGRAMS.filter(s => !["volleyball", "athletics", "kabaddi", "badminton", "tabletennis", "indoorgames", "swimming", "rifleshooting", "gym"].includes(s.id))
  ];

  const getCustomDisplayName = (sportName: string) => {
    if (sportName === "Gym & Fitness") return "ATHLETIC GYM";
    return sportName;
  };

  return (
    <div className="bg-white border-b border-zinc-200 py-3.5 px-4 sm:px-6 lg:px-8 shadow-sm relative z-40">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left Indicator */}
        <div className="flex items-center space-x-2 text-red-600 shrink-0 select-none">
          <Flame className="h-4.5 w-4.5 text-red-600 fill-red-600 animate-pulse" />
          <span className="font-title text-[11px] sm:text-xs font-black uppercase tracking-widest leading-none">
            SELECT SPORTS ACADEMY TRACK
          </span>
        </div>

        {/* Scrollable Track Wrapper with Arrow Buttons */}
        <div className="relative flex-grow flex items-center min-w-0">
          <button 
            onClick={() => scroll("left")}
            className="absolute left-0 z-10 bg-white/90 border border-zinc-200 hover:bg-zinc-50 p-1.5 rounded-full shadow-sm text-zinc-600 md:flex hidden items-center justify-center -translate-x-1/2"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div 
            ref={scrollContainerRef}
            className="flex items-center space-x-2.5 overflow-x-auto pb-1 md:pb-0 w-full scrollbar-none px-1"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {prioritizedSports.map((sport) => {
              const isActive = selectedSportId === sport.id;
              return (
                <button
                  key={sport.id}
                  onClick={() => onSportSelect(sport.id)}
                  className={`px-4 sm:px-5 py-2.5 rounded border text-[10px] sm:text-[11px] font-black tracking-widest uppercase transition-all duration-200 shrink-0 ${
                    isActive
                      ? "bg-red-600 border-red-600 text-white shadow-md shadow-red-900/10 hover:bg-red-700"
                      : "bg-white border-zinc-200 text-zinc-600 hover:border-zinc-400 hover:text-zinc-900"
                  }`}
                  id={`track-sport-${sport.id}`}
                >
                  {getCustomDisplayName(sport.name)}
                </button>
              );
            })}
          </div>

          <button 
            onClick={() => scroll("right")}
            className="absolute right-0 z-10 bg-white/90 border border-zinc-200 hover:bg-zinc-50 p-1.5 rounded-full shadow-sm text-zinc-600 md:flex hidden items-center justify-center translate-x-1/2"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
