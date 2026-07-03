import React from "react";
import { getSportIcon } from "../types";
import { SPORTS_PROGRAMS } from "../data";
import { ChevronLeft, Calendar, Clock, Award, Users, BookOpen, UserCheck, Dumbbell, Sparkles } from "lucide-react";

interface SportsDetailProps {
  sportId: string;
  onBack: () => void;
  onRegisterClick: () => void;
}

export default function SportsDetail({ sportId, onBack, onRegisterClick }: SportsDetailProps) {
  const sport = SPORTS_PROGRAMS.find((s) => s.id === sportId) || SPORTS_PROGRAMS[0];

  return (
    <section className="bg-white min-h-screen py-10 relative">
      <div className="absolute inset-0 sports-grid-pattern opacity-5 pointer-events-none" />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Navigation Back Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <button
            onClick={onBack}
            className="flex items-center space-x-1.5 text-xs font-black uppercase tracking-wider text-zinc-600 hover:text-zinc-900 bg-white border border-zinc-200 hover:border-zinc-400 rounded-lg px-4 py-2 transition shadow-sm cursor-pointer"
            id="sport-detail-back"
          >
            <ChevronLeft className="h-4 w-4 text-red-600" />
            <span>Back to Club</span>
          </button>
          
          <span className="text-[10px] sm:text-xs font-mono text-zinc-500 uppercase font-bold sm:text-right">
            Malwa Sports Academy Syllabus
          </span>
        </div>

        {/* Cinematic Custom Hero Card */}
        <div className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-zinc-950 shadow-lg h-[340px] sm:h-[420px]">
          {/* Cover image */}
          <div 
            className="absolute inset-0 bg-cover transform scale-100 transition-all duration-700"
            style={{ 
              backgroundImage: `url(${sport.bgImage})`,
              backgroundPosition: sport.bgPosition || "center 15%",
              filter: "brightness(0.65) contrast(1.1)"
            }}
          />
          
          {/* Elegant dark overlay gradient to ensure high-contrast white text legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />
          
          {/* Transparent container for texts directly over the image */}
          <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 p-4 sm:p-6 text-white z-10 space-y-2">
            <div className="flex items-center space-x-2 text-red-500 font-bold text-xs tracking-widest uppercase">
              <Sparkles className="h-4 w-4 text-red-500" />
              <span>MSA PERFORMANCE PROGRAM</span>
            </div>
            
            <div className="flex items-start sm:items-center space-x-3.5">
              <span className="flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 h-11 w-11 sm:h-12 sm:w-12 rounded-full text-white shrink-0 shadow-md">
                {getSportIcon(sport.id, "h-5 w-5 text-white")}
              </span>
              <h1 className="font-display text-xl sm:text-4xl font-black uppercase text-white tracking-wide leading-tight sm:leading-none">
                {sport.name} <span className="text-red-500">PROGRAM</span>
              </h1>
            </div>

            <p className="text-zinc-200 text-xs sm:text-sm max-w-2xl font-medium leading-relaxed pt-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
              {sport.tagline}
            </p>
          </div>
        </div>

        {/* Split Grid Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Overview, Methodology, and Training Specs */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Overview */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 space-y-4 shadow-sm">
              <h3 className="font-title text-lg sm:text-xl font-black uppercase tracking-wider text-zinc-900 border-b border-zinc-150 pb-3 flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-red-600" />
                <span>Program Overview</span>
              </h3>
              <p className="text-zinc-600 text-sm sm:text-base leading-relaxed font-medium">
                {sport.description}
              </p>
            </div>

            {/* Elite Training Methodology */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 space-y-4 shadow-sm">
              <h3 className="font-title text-lg sm:text-xl font-black uppercase tracking-wider text-zinc-900 border-b border-zinc-150 pb-3 flex items-center space-x-2">
                <Dumbbell className="h-5 w-5 text-red-600" />
                <span>Modern Training Methodology</span>
              </h3>
              
              <div className="grid grid-cols-1 gap-4">
                {sport.methodology.map((m, idx) => (
                  <div key={idx} className="flex items-start space-x-3 text-sm">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-red-50 text-red-600 font-black border border-red-100">
                      {idx + 1}
                    </div>
                    <p className="text-zinc-600 font-semibold leading-relaxed">
                      {m}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Training Schedule */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 space-y-4 shadow-sm">
              <h3 className="font-title text-lg sm:text-xl font-black uppercase tracking-wider text-zinc-900 border-b border-zinc-150 pb-3 flex items-center space-x-2">
                <Clock className="h-5 w-5 text-red-600" />
                <span>Club Schedule</span>
              </h3>
              <div className="flex items-center space-x-3 bg-zinc-50 border border-zinc-200 p-4 rounded-xl">
                <Calendar className="h-5 w-5 text-red-600" />
                <span className="text-zinc-800 text-sm font-black">{sport.schedule}</span>
              </div>
              <p className="text-zinc-500 text-xs font-bold">
                * Athletes are expected to report 15 minutes prior to the scheduled timing in complete MSA training kit.
              </p>
            </div>

          </div>

          {/* Right Column: Brackets, Facilities, Coaches & Registration Trigger */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Admissions Banner */}
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center space-y-4 shadow-sm relative">
              <div className="absolute top-2 right-2 bg-red-600 text-white font-black text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                Limited Slots
              </div>
              
              <h4 className="font-title text-lg font-black uppercase tracking-wider text-red-600">
                Begin Your Pathway
              </h4>
              <p className="text-zinc-650 text-xs font-semibold leading-relaxed">
                Book a professional trial and evaluation session with our head sport analyst near Mayank Blue Water Park, Indore.
              </p>
              
              <button
                onClick={onRegisterClick}
                className="w-full rounded-xl bg-red-600 hover:bg-red-700 text-xs font-black uppercase tracking-widest text-white py-3.5 shadow-md transition-colors cursor-pointer"
                id={`detail-register-cta-${sport.id}`}
              >
                APPLY FOR TRIAL
              </button>
            </div>

            {/* Age Brackets */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 space-y-3 shadow-sm">
              <h4 className="font-title text-xs font-black uppercase tracking-widest text-zinc-500 flex items-center space-x-2">
                <Users className="h-4 w-4 text-red-600" />
                <span>Eligibility Groups</span>
              </h4>
              <div className="space-y-2">
                {sport.ageGroups.map((group, idx) => (
                  <div key={idx} className="bg-zinc-50 p-2.5 rounded-lg border border-zinc-200 text-xs font-bold text-zinc-700">
                    {group}
                  </div>
                ))}
              </div>
            </div>

            {/* Coaches */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 space-y-3 shadow-sm">
              <h4 className="font-title text-xs font-black uppercase tracking-widest text-zinc-500 flex items-center space-x-2">
                <UserCheck className="h-4 w-4 text-red-600" />
                <span>Certified Coaches</span>
              </h4>
              <div className="space-y-2.5">
                {sport.coaches.map((c, idx) => (
                  <div key={idx} className="flex items-start space-x-2">
                    <div className="h-1.5 w-1.5 bg-red-600 rounded-full" />
                    <span className="text-xs font-bold text-zinc-700">{c}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Facilities Specific */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 space-y-3 shadow-sm">
              <h4 className="font-title text-xs font-black uppercase tracking-widest text-zinc-500 flex items-center space-x-2">
                <Award className="h-4 w-4 text-red-600" />
                <span>Academy Amenities</span>
              </h4>
              <div className="space-y-2">
                {sport.facilities.map((fac, idx) => (
                  <div key={idx} className="bg-zinc-50 px-3 py-2 rounded border border-zinc-200 text-[11px] text-zinc-650 font-bold">
                    {fac}
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
