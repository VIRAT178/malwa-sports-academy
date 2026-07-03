import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import SportsDetail from "./components/SportsDetail";
import Admissions from "./components/Admissions";
import AICoach from "./components/AICoach";
import Dashboard from "./components/Dashboard";
import ResetPassword from "./components/ResetPassword";
import Footer from "./components/Footer";
import EnquiryPopup from "./components/EnquiryPopup";
import MembershipPlans from "./components/MembershipPlans";
import CorporatePlans from "./components/CorporatePlans";
import { API_BASE } from "./config";
import { 
  SPORTS_PROGRAMS, COACHES, FEATURED_ATHLETES, UPCOMING_EVENTS, ACHIEVEMENTS, TESTIMONIALS, FACILITIES, logoImg 
} from "./data";
import { getSportIcon } from "./types";
import { 
  Trophy, Shield, MapPin, Users, Award, Star, Mail, Phone, Clock, Sparkles, Send, Eye, LogIn, ChevronRight, CheckCircle2 
} from "lucide-react";

export default function App() {
  const [currentView, setView] = useState<string>("home");
  const [selectedSportId, setSelectedSportId] = useState<string>("cricket");
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginRole, setLoginRole] = useState<"admin" | "coach" | "student" | "parent">("student");
  
  const [currentUser, setCurrentUser] = useState<any>(() => {
    try {
      const saved = localStorage.getItem("msa_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [resetToken, setResetToken] = useState<string>("");
  const [appLoading, setAppLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAppLoading(false);
    }, 2200);

    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get("view");
    const tokenParam = params.get("token");
    if (viewParam === "reset-password" && tokenParam) {
      setView("reset-password");
      setResetToken(tokenParam);
    }

    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("msa_user");
    setCurrentUser(null);
    setView("home");
  };
  
  // Auth Form State
  const [authMode, setAuthMode] = useState<"login" | "register" | "forgot">("login");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [authPhone, setAuthPhone] = useState("");
  const [authError, setAuthError] = useState("");
  const [authFeedback, setAuthFeedback] = useState("");
  const [authSubmitting, setAuthSubmitting] = useState(false);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthFeedback("");
    setAuthSubmitting(true);

    try {
      if (authMode === "login") {
        const response = await fetch(`${API_BASE}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: authEmail, password: authPassword, role: loginRole })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Failed to authenticate portal account.");

        setCurrentUser(data.user);
        localStorage.setItem("msa_user", JSON.stringify(data.user));
        setLoginModalOpen(false);
        setView("dashboard");
      } else if (authMode === "register") {
        const response = await fetch(`${API_BASE}/api/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            email: authEmail, 
            password: authPassword, 
            role: loginRole,
            name: authName,
            phone: authPhone
          })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Failed to register portal profile.");

        setCurrentUser(data.user);
        localStorage.setItem("msa_user", JSON.stringify(data.user));
        setLoginModalOpen(false);
        setView("dashboard");
      } else if (authMode === "forgot") {
        const response = await fetch(`${API_BASE}/api/auth/forgot-password`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: authEmail })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Failed to initiate recovery request.");

        setAuthFeedback(`✓ Passcode reset link transmitted successfully! Please check your mailbox or simulated inbox.`);
      }
    } catch (err: any) {
      setAuthError(err.message || "An unexpected error occurred.");
    } finally {
      setAuthSubmitting(false);
    }
  };
  
  // Contact state
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactQuery, setContactQuery] = useState("");
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactError, setContactError] = useState("");

  // Event Registration state
  const [eventRegModal, setEventRegModal] = useState<string | null>(null);
  const [eventRegName, setEventRegName] = useState("");
  const [eventRegMobile, setEventRegMobile] = useState("");
  const [eventRegSuccess, setEventRegSuccess] = useState(false);
  const [eventRegSubmitting, setEventRegSubmitting] = useState(false);
  const [eventRegError, setEventRegError] = useState("");
  const [eventRegToken, setEventRegToken] = useState("");

  // Statistics values
  const stats = [
    { label: "Active Athletes", value: "500+", desc: "State & National Pathways" },
    { label: "BCCI/FIBA Coaches", value: "25+", desc: "Certified Elite Leaders" },
    { label: "Championship Titles", value: "50+", desc: "Central India Regional Cups" },
    { label: "Evaluation Success", value: "95%", desc: "Positive Placement Ratio" }
  ];

  // Contact form submission
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactPhone.trim() || !contactQuery.trim()) return;

    setContactSubmitting(true);
    setContactError("");

    try {
      const response = await fetch(`${API_BASE}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: contactName,
          phone: contactPhone,
          query: contactQuery,
        }),
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.error || "Failed to record your inquiry");
      }

      setContactSubmitted(true);
      setContactName("");
      setContactPhone("");
      setContactQuery("");
      
      setTimeout(() => {
        setContactSubmitted(false);
      }, 5000);
    } catch (error: any) {
      console.error("Contact inquiry error:", error);
      setContactError(error.message || "Something went wrong. Please try again.");
    } finally {
      setContactSubmitting(false);
    }
  };

  // Event Registration Submission
  const handleEventRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventRegName.trim() || !eventRegMobile.trim() || !eventRegModal) return;

    setEventRegSubmitting(true);
    setEventRegError("");

    try {
      const response = await fetch(`${API_BASE}/api/event-register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          athleteName: eventRegName,
          eventTitle: eventRegModal,
          mobileNumber: eventRegMobile,
        }),
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.error || "Failed to reserve slot");
      }

      setEventRegToken(resData.token);
      setEventRegSuccess(true);
    } catch (error: any) {
      console.error("Event registration error:", error);
      setEventRegError(error.message || "Failed to reserve seat. Try again.");
    } finally {
      setEventRegSubmitting(false);
    }
  };

  if (appLoading) {
    return (
      <div className="fixed inset-0 bg-white z-[9999] flex flex-col items-center justify-center select-none" id="preloader">
        <div className="flex flex-col items-center space-y-10 max-w-md px-6 text-center">
          
          {/* Animated circular loader with MSA Logo lettermark */}
          <div className="relative h-64 w-64 flex items-center justify-center">
            {/* Spinning Outer Cyan/Blue Arc 1 */}
            <div className="absolute inset-0 rounded-full border-4 border-sky-400 border-r-transparent border-t-transparent animate-spin" />
            {/* Spinning Outer Blue Arc 2 */}
            <div className="absolute inset-2 rounded-full border-4 border-blue-600 border-l-transparent border-b-transparent animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
            
            {/* MSA logo */}
            <img 
              src={logoImg}
              alt="MSA Logo"
              className="h-20 w-auto object-contain relative z-10"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Typography / Branding Titles */}
          <div className="space-y-3">
            <h2 className="font-serif text-3xl sm:text-3.5xl font-black tracking-tight text-zinc-900 uppercase leading-none">
              MALWA SPORTS <span className="text-red-600">ACADEMY</span>
            </h2>
            <p className="text-[10px] font-black tracking-[0.25em] text-zinc-400 uppercase">
              SANWER ROAD, INDORE
            </p>
          </div>

          {/* Premium Loading Progress Bar */}
          <div className="w-56 h-1 bg-zinc-100 rounded-full overflow-hidden relative border border-zinc-200/50">
            <div className="bg-gradient-to-r from-blue-600 to-red-600 rounded-full animate-loader-bar" />
          </div>

          {/* Status Indicators */}
          <div className="text-[10.5px] font-black uppercase tracking-[0.2em] text-zinc-500 animate-pulse">
            ELITE PERFORMANCE LOADING
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col font-sans relative selection:bg-red-600 selection:text-white">
      
      {/* Dynamic Background Aura */}
      <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-red-100/10 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-1/4 h-[400px] w-[400px] rounded-full bg-red-100/5 blur-[120px] pointer-events-none z-0" />

      {/* Global Navbar */}
      <Navbar 
        currentView={currentView}
        setView={setView}
        onLoginClick={() => setLoginModalOpen(true)}
        selectedSportId={selectedSportId}
        setSelectedSportId={setSelectedSportId}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Layout Views */}
      <main className="flex-grow z-10">

        {/* ==================== 1. HOME VIEW ==================== */}
        {currentView === "home" && (
          <div className="space-y-16 sm:space-y-24 pb-16 sm:pb-24">
            
            {/* Automatic Dynamic Background Sliding Hero */}
            <Hero 
              onLearnMore={(sportId) => {
                setSelectedSportId(sportId);
                setView("sports-detail");
              }}
              onAdmissionsClick={() => setView("admissions")}
            />

            {/* Sports Programs Interactive Grid */}
            <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" id="home-programs-section">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-16 border-b border-zinc-200 pb-6">
                <div>
                  <span className="text-xs font-black text-red-600 uppercase tracking-widest block">ACADEMY DIRECTORY</span>
                  <h2 className="font-display text-3xl sm:text-5xl font-black uppercase tracking-wide text-zinc-900 mt-1">
                    {SPORTS_PROGRAMS.length} CORE SPORTS <span className="text-red-600">PROGRAMS</span>
                  </h2>
                </div>
                <p className="text-zinc-600 text-xs sm:text-sm max-w-md font-medium">
                  Click on any sports program below to explore specialized age brackets, custom biomechanical methodologies, schedules, and certified coaching staff.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {SPORTS_PROGRAMS.map((sport) => (
                  <div
                    key={sport.id}
                    onClick={() => {
                      setSelectedSportId(sport.id);
                      setView("sports-detail");
                    }}
                    className="group relative h-80 sm:h-96 rounded-2xl overflow-hidden border border-zinc-200/10 bg-zinc-950 cursor-pointer shadow-md hover:border-red-600 hover:shadow-2xl transition-all duration-300 flex flex-col justify-end"
                  >
                    {/* Background Image covering entire card */}
                    <div className="absolute inset-0 z-0">
                      <img 
                        src={sport.bgImage} 
                        alt={sport.name} 
                        className="h-full w-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                        style={{ 
                          objectPosition: sport.bgPosition || "center top",
                          filter: "brightness(0.75) contrast(1.05)"
                        }}
                        referrerPolicy="no-referrer"
                      />
                      {/* Dark dynamic gradient mask to guarantee high-contrast text */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent pointer-events-none" />
                    </div>

                    {/* Floating sports icon badge */}
                    <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-md h-11 w-11 rounded-full flex items-center justify-center border border-white/20 shadow-lg text-white z-10 transition group-hover:scale-110 group-hover:bg-red-600 group-hover:border-red-500">
                      {getSportIcon(sport.id, "h-5 w-5 text-white")}
                    </div>

                    {/* Content Section positioned at the bottom on top of background */}
                    <div className="relative z-10 p-6 space-y-3">
                      <div>
                        <span className="text-[9px] bg-red-600 text-white font-black uppercase px-2.5 py-1 rounded-full tracking-widest inline-block mb-2 shadow-sm">
                          MSA PATHWAY
                        </span>
                        
                        <h3 className="font-display text-2xl sm:text-3xl font-black uppercase text-white tracking-wider flex items-center justify-between gap-2">
                          <span>{sport.name}</span>
                          <ChevronRight className="h-5 w-5 text-red-500 group-hover:translate-x-1 group-hover:text-red-400 transition-transform" />
                        </h3>
                      </div>
                      
                      <p className="text-zinc-300 text-xs sm:text-sm font-semibold leading-relaxed line-clamp-2">
                        {sport.tagline}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Immersive Facilities Showcase */}
            <section className="bg-zinc-50 py-16 border-y border-zinc-200">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
                  <span className="text-xs font-black text-red-600 uppercase tracking-widest block">PREMIUM AMENITIES</span>
                  <h2 className="font-display text-3xl sm:text-5xl font-black uppercase tracking-wide text-zinc-900">
                    IMMERSIVE <span className="text-red-600">FACILITIES</span>
                  </h2>
                  <p className="text-zinc-600 text-xs sm:text-sm font-medium">
                    Our training grounds in Indore are curated to match national olympic arenas to prevent injury and promote peak performance metrics.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {FACILITIES.map((fac, idx) => (
                    <div key={idx} className="group rounded-2xl overflow-hidden border border-zinc-200 bg-white shadow-sm hover:shadow-xl transition-all duration-300">
                      <div className="h-44 sm:h-52 overflow-hidden relative">
                        <img 
                          src={fac.image} 
                          alt={fac.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-95"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      </div>
                      <div className="p-5 sm:p-6 space-y-2">
                        <h3 className="font-title text-lg font-black uppercase tracking-wider text-zinc-900">
                          {fac.title}
                        </h3>
                        <p className="text-zinc-600 text-xs sm:text-sm leading-relaxed">
                          {fac.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Gallery Preview Masonry */}
            <section id="gallery-section" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-16 border-b border-zinc-200">
              <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
                <span className="text-xs font-black text-red-600 uppercase tracking-widest block">INSTANT SNAPSHOTS</span>
                <h2 className="font-display text-3xl sm:text-5xl font-black uppercase text-zinc-900">
                  CAMPUS <span className="text-red-600">GALLERY</span>
                </h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  "/src/assets/images/academy_building_1782710611155.jpg",
                  "/src/assets/images/cricket_athlete_1782710625811.jpg",
                  "/src/assets/images/football_athlete_1782710639879.jpg",
                  "/src/assets/images/basketball_athlete_1782710652463.jpg",
                  "/src/assets/images/swimming_pool_1782710679951.jpg",
                  "/src/assets/images/shooting_range_1782710691800.jpg",
                  "/src/assets/images/gym.jpg",
                  "/src/assets/images/badminton_player_1782710729529.jpg"
                ].map((img, idx) => (
                  <div key={idx} className="h-44 sm:h-56 rounded-xl overflow-hidden border border-zinc-200 bg-zinc-100 group shadow-sm">
                    <img 
                      src={img} 
                      alt="MSA Facilities Practice"
                      className="w-full h-full object-cover object-center opacity-90 group-hover:opacity-100 group-hover:scale-105 transition duration-500"
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* Featured Coaches */}
            <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
              <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
                <span className="text-xs font-black text-red-600 uppercase tracking-widest block">MEET THE MASTERS</span>
                <h2 className="font-display text-3xl sm:text-5xl font-black uppercase text-zinc-900 tracking-wide">
                  CERTIFIED <span className="text-red-600">COACHING STAFF</span>
                </h2>
                <p className="text-zinc-600 text-xs sm:text-sm font-medium">
                  Our professional advisory council includes BCCI, FIBA, and AFC-licensed veterans with historical championship training backgrounds.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {COACHES.map((coach) => (
                  <div key={coach.id} className="group rounded-2xl border border-zinc-250 bg-white overflow-hidden shadow-sm hover:shadow-xl hover:border-red-500/30 transition duration-300">
                    <div className="h-64 overflow-hidden relative">
                      <img 
                        src={coach.image} 
                        alt={coach.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500 opacity-95"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      
                      <div className="absolute bottom-4 left-4">
                        <span className="bg-red-600 text-white font-mono font-bold text-[9px] px-2 py-0.5 rounded-full uppercase tracking-widest">
                          {coach.experience} Experience
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-4 sm:p-5 space-y-3">
                      <div>
                        <h4 className="font-title text-lg font-black uppercase text-zinc-900">{coach.name}</h4>
                        <span className="block text-zinc-500 text-[10px] uppercase font-black tracking-widest">{coach.role}</span>
                      </div>
                      
                      <p className="text-zinc-600 text-xs font-medium leading-relaxed">
                        {coach.bio}
                      </p>

                      <div className="border-t border-zinc-150 pt-2.5 space-y-1">
                        <span className="block text-[9px] text-zinc-400 uppercase font-black tracking-wider">SPECIALTY CORE</span>
                        <span className="text-xs text-red-600 font-bold">{coach.specialty}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Why Choose MSA Section (High tech icon cards) */}
            <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
                <div className="inline-flex items-center space-x-2 bg-red-50 border border-red-100 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest text-red-600">
                  <Award className="h-3.5 w-3.5" />
                  <span>WHY CHOOSE MALWA SPORTS ACADEMY</span>
                </div>
                <h2 className="font-display text-3xl sm:text-5xl font-black uppercase tracking-wide text-zinc-900">
                  ENGINEERED FOR <span className="text-red-600">VICTORY</span>
                </h2>
                <p className="text-zinc-600 text-xs sm:text-sm font-medium">
                  We blend certified biomechanical guidelines with intense psychological grit to groom professional, world-class athletes on Sanwer Road, Indore.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                <div className="group rounded-2xl border border-zinc-200 bg-white p-8 space-y-4 hover:border-red-500/40 hover:shadow-2xl transition duration-300 shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600 border border-red-100">
                    <Trophy className="h-6 w-6" />
                  </div>
                  <h3 className="font-title text-xl font-black uppercase tracking-wider text-zinc-900">Elite Coaching Certifications</h3>
                  <p className="text-zinc-600 text-xs sm:text-sm leading-relaxed">
                    Our coaching council comprises BCCI Level 3 coaches, AFC licensed football guides, and FIBA legends with comprehensive international matches exposure.
                  </p>
                </div>

                <div className="group rounded-2xl border border-zinc-200 bg-white p-8 space-y-4 hover:border-red-500/40 hover:shadow-2xl transition duration-300 shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600 border border-red-100">
                    <Shield className="h-6 w-6" />
                  </div>
                  <h3 className="font-title text-xl font-black uppercase tracking-wider text-zinc-900">Advanced Athletic Telemetry</h3>
                  <p className="text-zinc-600 text-xs sm:text-sm leading-relaxed">
                    We track every athlete using GPS-enabled chest strap vest monitors to track speed, sprint frequency, cardiovascular rate thresholds, and post-session recovery periods.
                  </p>
                </div>

                <div className="group rounded-2xl border border-zinc-200 bg-white p-8 space-y-4 hover:border-red-500/40 hover:shadow-2xl transition duration-300 shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600 border border-red-100">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <h3 className="font-title text-xl font-black uppercase tracking-wider text-zinc-900">Modern Sports Facilities</h3>
                  <p className="text-zinc-600 text-xs sm:text-sm leading-relaxed">
                    From Sius Ascor electronic rifle targets and high-repetition shooting machines to Olympic-size temperature regulated pools and lush turf fields.
                  </p>
                </div>

              </div>
            </section>

            {/* ==================== SCOUTING & EVALUATION PASS SECTION ==================== */}
            <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" id="home-scouting-section">
              <div className="relative rounded-3xl border border-zinc-200 bg-zinc-50 p-8 sm:p-12 overflow-hidden shadow-xl text-zinc-900">
                {/* Background red glows for premium dynamic feel in light theme */}
                <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-red-600/5 blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-zinc-200/50 blur-3xl pointer-events-none" />
                
                <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                  {/* Left Column: Heading, Badge, Description */}
                  <div className="lg:col-span-7 space-y-6">
                    <div className="inline-flex items-center space-x-2 bg-red-50 border border-red-200 px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-red-600">
                      <Trophy className="h-3.5 w-3.5" />
                      <span>MSA SCOUTING & SELECTION PATHWAYS OPEN</span>
                    </div>
                    
                    <div className="space-y-3">
                      <h2 className="font-display text-3xl sm:text-5xl font-black uppercase tracking-wide leading-tight text-zinc-900">
                        UNLEASH YOUR POTENTIAL: <br />
                        <span className="text-red-600">CAMPUS TRIALS ACTIVE</span>
                      </h2>
                      <p className="text-zinc-650 text-xs sm:text-sm leading-relaxed font-semibold">
                        Malwa Sports Academy is actively scouting for promising young athletes across Madhya Pradesh. We provide elite athletic evaluations to select individuals for fully sponsored sports scholarship positions, including professional coaching, boarding, specialized sports science diagnostics, and academic support.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-2">
                      <button
                        onClick={() => setView("admissions")}
                        className="rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-widest px-8 py-4 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg shadow-red-600/25 flex items-center justify-center gap-2 cursor-pointer"
                        id="scouting-apply-btn"
                      >
                        <span>Apply For Trial Pass</span>
                        <ChevronRight className="h-4 w-4" />
                      </button>
                      
                      <button
                        onClick={() => {
                          const element = document.getElementById("home-programs-section");
                          if (element) {
                            element.scrollIntoView({ behavior: "auto" });
                          }
                        }}
                        className="rounded-xl border border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-700 hover:text-zinc-900 font-black text-xs uppercase tracking-widest px-8 py-4 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                        id="scouting-explore-btn"
                      >
                        Explore Core Sports
                      </button>
                    </div>
                  </div>

                  {/* Right Column: Perks Grid */}
                  <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-sm space-y-2">
                      <div className="h-10 w-10 rounded-xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center">
                        <Award className="h-5 w-5" />
                      </div>
                      <h4 className="font-title text-sm font-black uppercase text-zinc-900 tracking-wider">100% Scholarship</h4>
                      <p className="text-zinc-600 text-[11px] leading-relaxed font-semibold">
                        Full financial sponsorship covering advanced athletic kits, lodging, dietary plans, and tournaments.
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-sm space-y-2">
                      <div className="h-10 w-10 rounded-xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center">
                        <Users className="h-5 w-5" />
                      </div>
                      <h4 className="font-title text-sm font-black uppercase text-zinc-900 tracking-wider">Elite Mentors</h4>
                      <p className="text-zinc-600 text-[11px] leading-relaxed font-semibold">
                        Train daily under certified BCCI, FIBA, and AFC-licensed head coaches with global exposure.
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-sm space-y-2">
                      <div className="h-10 w-10 rounded-xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center">
                        <Shield className="h-5 w-5" />
                      </div>
                      <h4 className="font-title text-sm font-black uppercase text-zinc-900 tracking-wider">Hi-Tech Facilities</h4>
                      <p className="text-zinc-600 text-[11px] leading-relaxed font-semibold">
                        Access professional electronic shooting ranges, turf wickets, synthetic courts, and athletic tracking systems.
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-sm space-y-2">
                      <div className="h-10 w-10 rounded-xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center">
                        <Sparkles className="h-5 w-5" />
                      </div>
                      <h4 className="font-title text-sm font-black uppercase text-zinc-900 tracking-wider">AI Coach Guides</h4>
                      <p className="text-zinc-600 text-[11px] leading-relaxed font-semibold">
                        Get automated posture feedback, personalized diet plans, and tailored training drills on our digital app.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Statistics Counters banner */}
            <section className="bg-red-50 border-y border-red-100 py-14 sm:py-16">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat, idx) => (
                  <div key={idx} className="text-center space-y-1">
                    <span className="block font-display text-4xl sm:text-6xl font-black text-red-600 drop-shadow-sm">
                      {stat.value}
                    </span>
                    <span className="block font-title text-xs sm:text-sm font-black uppercase tracking-wider text-zinc-900">
                      {stat.label}
                    </span>
                    <span className="block text-[11px] text-zinc-500 font-bold uppercase">
                      {stat.desc}
                    </span>
                  </div>
                ))}
              </div>
            </section>



            {/* Featured Athletes & Achievements */}
            <section className="bg-zinc-50 py-16 border-y border-zinc-200">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
                
                {/* Left Side: Athlete Cards */}
                <div className="lg:col-span-7 space-y-8">
                  <div>
                    <span className="text-xs font-black text-red-600 uppercase tracking-widest block">PROSPECT SQUAD</span>
                    <h2 className="font-display text-3xl sm:text-4xl font-black uppercase tracking-wide text-zinc-900 mt-1">
                      FEATURED MSA <span className="text-red-600">ATHLETES</span>
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {FEATURED_ATHLETES.map((athlete) => (
                      <div key={athlete.id} className="bg-white border border-zinc-200 p-4 rounded-xl flex items-center space-x-3 sm:space-x-4 shadow-sm hover:shadow-md transition">
                        <img 
                          src={athlete.image} 
                          alt={athlete.name}
                          className="h-16 w-16 rounded-xl object-cover border border-zinc-200"
                        />
                        <div className="min-w-0">
                          <h4 className="font-title text-base font-black uppercase text-zinc-900 leading-tight">{athlete.name}</h4>
                          <span className="block text-[10px] text-red-600 font-bold uppercase tracking-wider">{athlete.sport} • {athlete.level}</span>
                          <p className="text-[11px] text-zinc-600 font-semibold leading-tight mt-1 truncate">{athlete.achievement}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Side: Historical Medal Achievements */}
                <div className="lg:col-span-5 bg-white border border-zinc-200 p-6 sm:p-8 rounded-2xl space-y-4 shadow-sm">
                  <h3 className="font-title text-lg font-black uppercase text-zinc-900 border-b border-zinc-200 pb-3 flex items-center justify-between">
                    <span>ACADEMY HALL OF FAME</span>
                    <Trophy className="h-5 w-5 text-yellow-500 fill-yellow-50" />
                  </h3>

                  <div className="space-y-4">
                    {ACHIEVEMENTS.map((ach) => (
                      <div key={ach.id} className="border-l-2 border-red-600 pl-3 space-y-1 text-xs">
                        <div className="flex items-center justify-between text-zinc-500">
                          <span className="uppercase font-bold tracking-widest">{ach.sport} • {ach.year}</span>
                          <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded text-[10px]">{ach.medal}</span>
                        </div>
                        <h4 className="font-bold text-zinc-900 uppercase">{ach.title}</h4>
                        <p className="text-zinc-600 text-[11px] leading-snug font-medium">{ach.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </section>

            {/* Upcoming Events Grid */}
            <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
                <span className="text-xs font-black text-red-600 uppercase tracking-widest block">GET ENGAGED</span>
                <h2 className="font-display text-3xl sm:text-5xl font-black uppercase text-zinc-900 tracking-wide">
                  UPCOMING <span className="text-red-600">CAMPUS EVENTS</span>
                </h2>
                <p className="text-zinc-600 text-xs sm:text-sm font-medium">
                  Register for trials, regional cups, and youth selections hosted locally at our Sanwer Road arena, Indore.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {UPCOMING_EVENTS.map((evt) => (
                  <div key={evt.id} className="bg-white border border-zinc-200 rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-[10px] font-bold text-zinc-500">
                        <span className="uppercase tracking-widest text-red-600 font-bold">{evt.sport}</span>
                        <span>{evt.date}</span>
                      </div>
                      <h4 className="font-title text-lg font-black uppercase text-zinc-900 tracking-wider">
                        {evt.title}
                      </h4>
                      <p className="text-zinc-600 text-xs leading-relaxed font-medium">
                        {evt.description}
                      </p>
                    </div>

                    <div className="border-t border-zinc-150 pt-3 flex items-center justify-between">
                      <span className="text-[10px] text-zinc-500 font-mono font-semibold">Time: {evt.time}</span>
                      
                      {evt.registrationOpen ? (
                        <button
                          onClick={() => setEventRegModal(evt.title)}
                          className="bg-red-600 hover:bg-red-700 text-white font-black text-[9px] uppercase tracking-widest px-3.5 py-2 rounded-lg transition shadow-sm"
                        >
                          Register Slot
                        </button>
                      ) : (
                        <span className="text-zinc-500 font-black text-[9px] uppercase tracking-widest bg-zinc-100 px-2.5 py-1.5 rounded">
                          Registration Closed
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Testimonials Carousel */}
            <section className="bg-zinc-50 py-16 border-y border-zinc-200">
              <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-8">
                <div className="space-y-2">
                  <span className="text-xs font-black text-red-600 uppercase tracking-widest block">TESTIMONIALS</span>
                  <h3 className="font-display text-3xl sm:text-4xl font-black uppercase text-zinc-900">
                    WHAT PARENTS & ATHLETES <span className="text-red-600">SAY</span>
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {TESTIMONIALS.map((t, idx) => (
                    <div key={idx} className="bg-white border border-zinc-200 p-6 rounded-2xl flex flex-col justify-between text-left space-y-4 shadow-sm hover:shadow-md transition">
                      <div className="flex items-center text-amber-500 space-x-0.5">
                        {[...Array(t.rating)].map((_, i) => (
                          <Star key={i} className="h-3.5 w-3.5 fill-current" />
                        ))}
                      </div>
                      <p className="text-zinc-600 text-xs sm:text-sm italic leading-relaxed font-medium">
                        "{t.quote}"
                      </p>
                      <div className="border-t border-zinc-150 pt-3">
                        <h5 className="font-bold text-zinc-900 text-xs uppercase">{t.author}</h5>
                        <span className="text-[10px] text-zinc-500 uppercase font-bold">{t.relation}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>



            {/* Quick Contact CTA */}
            <section id="contact-section" className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
              <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-8 sm:p-12 space-y-8 shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-red-600/5 blur-2xl pointer-events-none" />
                
                <div className="text-center max-w-xl mx-auto space-y-2">
                  <h3 className="font-display text-2xl sm:text-4xl font-black uppercase text-zinc-900 tracking-wider">
                    GOT QUESTIONS? <span className="text-red-600">GET IN TOUCH</span>
                  </h3>
                  <p className="text-zinc-600 text-xs sm:text-sm font-medium leading-relaxed">
                    Need details about fee structures, hostel accommodation, or custom transport routes on Sanwer Road, Indore? Send us a quick query.
                  </p>
                </div>

                {contactSubmitted ? (
                  <div className="p-6 bg-white border border-zinc-200 rounded-2xl text-center space-y-2 shadow-sm animate-fade-in">
                    <CheckCircle2 className="h-10 w-10 text-green-500 mx-auto animate-bounce" />
                    <h4 className="font-title text-lg font-black text-zinc-900 uppercase">Inquiry Dispatched Successfully</h4>
                    <p className="text-zinc-600 text-xs font-semibold">Our admissions desk will contact you over WhatsApp or phone within 4 hours.</p>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                    <input 
                      type="text" 
                      required 
                      placeholder="Your Name" 
                      className="w-full rounded-xl bg-white border border-zinc-250 hover:border-zinc-400 px-4 py-3 text-xs text-zinc-800 focus:outline-none focus:border-red-600 transition"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                    />
                    <input 
                      type="tel" 
                      required 
                      placeholder="Phone Number" 
                      className="w-full rounded-xl bg-white border border-zinc-250 hover:border-zinc-400 px-4 py-3 text-xs text-zinc-800 focus:outline-none focus:border-red-600 transition"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                    />
                    <textarea 
                      required 
                      placeholder="Your Query (e.g., cricket fee structure / hostel availability)" 
                      className="w-full rounded-xl bg-white border border-zinc-250 hover:border-zinc-400 px-4 py-3 text-xs text-zinc-800 focus:outline-none focus:border-red-600 sm:col-span-2 h-20 transition"
                      value={contactQuery}
                      onChange={(e) => setContactQuery(e.target.value)}
                    />
                    
                    {contactError && (
                      <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-bold rounded-xl sm:col-span-2">
                        ⚠️ {contactError}
                      </div>
                    )}

                    <button 
                      type="submit"
                      disabled={contactSubmitting}
                      className={`w-full font-black text-xs uppercase tracking-widest py-3 rounded-xl sm:col-span-2 transition shadow-md cursor-pointer ${
                        contactSubmitting ? "bg-red-400 text-white cursor-not-allowed" : "bg-red-600 hover:bg-red-700 text-white"
                      }`}
                    >
                      {contactSubmitting ? "SENDING INQUIRY..." : "SEND QUICK INQUIRY"}
                    </button>
                  </form>
                )}
              </div>
            </section>

          </div>
        )}

        {/* ==================== 2. ABOUT VIEW ==================== */}
        {currentView === "about" && (
          <About />
        )}

        {/* ==================== 3. SPORTS DETAIL VIEW ==================== */}
        {currentView === "sports-detail" && (
          <SportsDetail 
            sportId={selectedSportId}
            onBack={() => setView("home")}
            onRegisterClick={() => setView("admissions")}
          />
        )}

        {/* ==================== 4. FACILITIES VIEW ==================== */}
        {currentView === "facilities" && (
          <div className="py-16 sm:py-24 space-y-16 mx-auto max-w-7xl px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <h2 className="font-display text-4xl sm:text-6xl font-black uppercase text-zinc-900">
                MSA <span className="text-red-600">INFRASTRUCTURE</span>
              </h2>
              <p className="text-zinc-600 text-sm font-medium">
                Take an extensive tour of Malwa Sports Academy elite training setup on Sanwer Road, Indore.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {FACILITIES.map((fac, idx) => (
                <div key={idx} className="group rounded-3xl overflow-hidden border border-zinc-200 bg-white flex flex-col md:flex-row shadow-sm hover:shadow-lg transition">
                  <div className="md:w-1/2 h-56 md:h-auto overflow-hidden relative shrink-0">
                    <img 
                      src={fac.image} 
                      alt={fac.title}
                      className="w-full h-full object-cover opacity-95 group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 md:p-8 space-y-3 flex flex-col justify-center">
                    <h3 className="font-title text-xl font-black uppercase tracking-wider text-zinc-900">
                      {fac.title}
                    </h3>
                    <p className="text-zinc-650 text-xs sm:text-sm leading-relaxed">
                      {fac.description}
                    </p>
                    <div className="pt-2">
                      <span className="text-[10px] bg-red-50 border border-red-100 text-red-600 px-3 py-1 rounded-full font-black uppercase tracking-wider">
                        ✓ National Tournament Spec
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== 5. COACHES VIEW ==================== */}
        {currentView === "coaches" && (
          <div className="py-16 sm:py-24 space-y-16 mx-auto max-w-7xl px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <h2 className="font-display text-4xl sm:text-6xl font-black uppercase text-zinc-900">
                ELITE <span className="text-red-600">COACHES COUNCILS</span>
              </h2>
              <p className="text-zinc-600 text-sm font-medium">
                Professional pathways guided by accredited coaches with decades of domestic and global league experiences.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {COACHES.map((coach) => (
                <div key={coach.id} className="bg-white border border-zinc-200 p-6 sm:p-8 rounded-3xl flex flex-col sm:flex-row gap-6 items-center shadow-sm hover:shadow-md transition">
                  <img 
                    src={coach.image} 
                    alt={coach.name}
                    className="h-28 w-28 rounded-2xl object-cover shrink-0 border border-zinc-200"
                  />
                  <div className="space-y-3 text-center sm:text-left">
                    <div>
                      <h3 className="font-title text-xl font-black uppercase text-zinc-900 tracking-wider">{coach.name}</h3>
                      <span className="text-red-600 text-xs font-black uppercase tracking-wider block">{coach.role} • {coach.experience} Exp</span>
                    </div>
                    <p className="text-zinc-600 text-xs sm:text-sm leading-relaxed font-medium">{coach.bio}</p>
                    <div className="space-y-1 bg-zinc-50 p-3 rounded-xl border border-zinc-150 text-xs">
                      <span className="block text-[9px] text-zinc-500 font-bold uppercase">CHAMPIONSHIP SUCCESSES:</span>
                      <ul className="list-disc list-inside space-y-0.5 text-zinc-600 font-semibold">
                        {coach.achievements.map((ac, i) => (
                          <li key={i}>{ac}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== 6. ATHLETES VIEW ==================== */}
        {currentView === "athletes" && (
          <div className="py-16 sm:py-24 space-y-16 mx-auto max-w-7xl px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <h2 className="font-display text-4xl sm:text-6xl font-black uppercase text-zinc-900">
                MSA REPRESENTATIVE <span className="text-red-600">ATHLETES</span>
              </h2>
              <p className="text-zinc-600 text-sm font-medium">
                Celebrating outstanding national and regional record-holders trained directly on our Sanwer Road setups.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {FEATURED_ATHLETES.map((ath) => (
                <div key={ath.id} className="bg-white border border-zinc-200 p-6 rounded-3xl space-y-4 text-center hover:border-red-500/30 transition shadow-sm hover:shadow-md">
                  <div className="relative inline-block">
                    <img 
                      src={ath.image} 
                      alt={ath.name}
                      className="h-28 w-28 rounded-full object-cover mx-auto border-2 border-red-600/30"
                    />
                    <span className="absolute bottom-1 right-1 bg-red-600 text-white font-black text-[9px] px-2 py-0.5 rounded-full uppercase">
                      {ath.sport}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-title text-lg font-black uppercase text-zinc-900 tracking-wider">{ath.name}</h3>
                    <span className="text-zinc-500 text-xs font-bold uppercase block">{ath.level}</span>
                  </div>
                  <p className="text-zinc-600 text-xs leading-relaxed font-medium bg-zinc-50 p-3 rounded-xl border border-zinc-150">
                    "{ath.achievement}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== 7. EVENTS VIEW ==================== */}
        {currentView === "events" && (
          <div className="py-16 sm:py-24 space-y-16 mx-auto max-w-7xl px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <h2 className="font-display text-4xl sm:text-6xl font-black uppercase text-zinc-900">
                MSA SELECTIONS & <span className="text-red-600">TOURNAMENTS</span>
              </h2>
              <p className="text-zinc-600 text-sm font-medium">
                Review and register for current open scouting events. Fully sponsored scholarship positions are open to talent across Madhya Pradesh.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {UPCOMING_EVENTS.map((evt) => (
                <div key={evt.id} className="bg-white border border-zinc-200 rounded-3xl p-6 flex flex-col justify-between space-y-6 shadow-sm hover:shadow-md transition">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-black text-red-600 uppercase tracking-widest">{evt.sport}</span>
                      <span className="text-zinc-500 font-medium">{evt.date}</span>
                    </div>
                    <h3 className="font-title text-xl font-black uppercase text-zinc-900 tracking-wider">
                      {evt.title}
                    </h3>
                    <p className="text-zinc-650 text-xs sm:text-sm leading-relaxed font-medium">
                      {evt.description}
                    </p>
                  </div>

                  <div className="space-y-4 pt-3 border-t border-zinc-150">
                    <div className="space-y-1 text-xs text-zinc-500 font-mono font-semibold">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-red-600" />
                        <span>Timing: {evt.time}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-red-600" />
                        <span className="truncate">Venue: {evt.location}</span>
                      </div>
                    </div>

                    {evt.registrationOpen ? (
                      <button
                        onClick={() => setEventRegModal(evt.title)}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-widest py-3 rounded-xl transition shadow cursor-pointer"
                      >
                        Register Slot Online
                      </button>
                    ) : (
                      <button
                        disabled
                        className="w-full bg-zinc-100 text-zinc-400 font-black text-xs uppercase tracking-widest py-3 rounded-xl cursor-not-allowed"
                      >
                        Registration Closed
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== 8. AI COACH VIEW ==================== */}
        {currentView === "ai-coach" && (
          <AICoach />
        )}

        {/* ==================== 9. ADMISSIONS VIEW ==================== */}
        {currentView === "admissions" && (
          <Admissions />
        )}

        {/* ==================== 10. PORTAL DASHBOARD VIEW ==================== */}
        {currentView === "dashboard" && currentUser && (
          <Dashboard 
            initialRole={currentUser.role} 
            currentUser={currentUser} 
            onProfileUpdate={(updated) => {
              setCurrentUser(updated);
              localStorage.setItem("msa_user", JSON.stringify(updated));
            }} 
          />
        )}

        {/* ==================== 11. RESET PASSWORD VIEW ==================== */}
        {currentView === "reset-password" && (
          <ResetPassword token={resetToken} setView={setView} />
        )}

        {/* ==================== 12. MEMBERSHIP PLANS VIEW ==================== */}
        {currentView === "membership-plans" && (
          <MembershipPlans onAdmissionsClick={() => setView("admissions")} />
        )}

        {/* ==================== 13. CORPORATE PLANS VIEW ==================== */}
        {currentView === "corporate-plans" && (
          <CorporatePlans />
        )}

      </main>

      {/* Global Footer component */}
      <Footer setView={setView} />

      {/* Right-side enquiry popup */}
      <EnquiryPopup />

      {/* ==================== LOGIN / SIGNUP MODAL DIALOG ==================== */}
      {loginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md animate-fade-in">
          <div 
            className="w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-5 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            id="login-modal-box"
          >
            <div className="text-center space-y-2">
              <div className="h-12 w-12 rounded-xl bg-red-600 text-white font-black text-lg flex items-center justify-center mx-auto shadow-lg shadow-red-200">
                MSA
              </div>
              <h3 className="font-title text-2xl font-black uppercase tracking-wider text-zinc-900">
                {authMode === "login" && "MSA MEMBER PORTAL"}
                {authMode === "register" && "CREATE PORTAL ACCOUNT"}
                {authMode === "forgot" && "RECOVER PASSWORD"}
              </h3>
              <p className="text-zinc-500 text-xs uppercase font-bold">
                {authMode === "login" && "Access custom metrics and performance tracking"}
                {authMode === "register" && "Join Malwa Sports Academy Digital Registry"}
                {authMode === "forgot" && "Transmit passcode reset link"}
              </p>
            </div>

            {/* Error & Success indicators */}
            {authError && (
              <div className="p-3 bg-red-50 text-red-600 border border-red-200 text-xs font-bold rounded-xl text-center">
                ⚠️ {authError}
              </div>
            )}
            {authFeedback && (
              <div className="p-3 bg-green-50 text-green-700 border border-green-200 text-xs font-bold rounded-xl text-center">
                {authFeedback}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {/* Portal Role switcher (only on register) */}
              {authMode === "register" && (
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest text-center">
                    Select Portal Profile Role
                  </label>
                  
                  <div className="grid grid-cols-2 gap-1 bg-zinc-100 p-1 rounded-xl border border-zinc-200">
                    {(["student", "parent"] as const).map((role) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => {
                          setLoginRole(role);
                        }}
                        className={`py-2 text-center rounded-lg text-[9px] font-black uppercase tracking-widest transition ${
                          loginRole === role
                            ? "bg-red-600 text-white"
                            : "text-zinc-500 hover:text-zinc-900 cursor-pointer"
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input details */}
              <div className="space-y-3">
                {authMode === "register" && (
                  <>
                    <div>
                      <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-wider mb-1">
                        Full Name
                      </label>
                      <input 
                        type="text" 
                        required
                        placeholder="Arjun Malviya"
                        className="w-full rounded-xl bg-zinc-50 border border-zinc-250 px-4 py-2.5 text-xs text-zinc-800 focus:outline-none focus:border-red-600"
                        value={authName}
                        onChange={(e) => setAuthName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-wider mb-1">
                        Active Mobile Number
                      </label>
                      <input 
                        type="tel" 
                        required
                        placeholder="+91 XXXXX XXXXX"
                        className="w-full rounded-xl bg-zinc-50 border border-zinc-250 px-4 py-2.5 text-xs text-zinc-800 focus:outline-none focus:border-red-600"
                        value={authPhone}
                        onChange={(e) => setAuthPhone(e.target.value)}
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-wider mb-1">
                    Registered Email Address
                  </label>
                  <input 
                    type="email" 
                    required
                    placeholder="name@domain.com"
                    className="w-full rounded-xl bg-zinc-50 border border-zinc-250 px-4 py-2.5 text-xs text-zinc-800 focus:outline-none focus:border-red-600"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                  />
                </div>

                {authMode !== "forgot" && (
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-wider">
                        Security Passcode
                      </label>
                      {authMode === "login" && (
                        <button
                          type="button"
                          onClick={() => setAuthMode("forgot")}
                          className="text-[10px] text-red-600 font-bold hover:underline"
                        >
                          Forgot?
                        </button>
                      )}
                    </div>
                    <input 
                      type="password" 
                      required
                      placeholder="••••••••"
                      className="w-full rounded-xl bg-zinc-50 border border-zinc-250 px-4 py-2.5 text-xs text-zinc-800 focus:outline-none focus:border-red-600"
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                    />
                  </div>
                )}
              </div>

              {/* Action trigger buttons */}
              <div className="space-y-2 pt-2">
                <button
                  type="submit"
                  disabled={authSubmitting}
                  className="w-full rounded-xl bg-red-600 hover:bg-red-700 py-3 text-xs font-black uppercase tracking-widest text-white transition-colors flex items-center justify-center gap-1.5 shadow cursor-pointer"
                  id="modal-login-submit"
                >
                  {authSubmitting ? (
                    "PROCESSSING..."
                  ) : (
                    <>
                      <LogIn className="h-4 w-4" /> 
                      {authMode === "login" && "AUTHENTICATE & ACCESS PORTAL"}
                      {authMode === "register" && "REGISTER NEW WORKSPACE"}
                      {authMode === "forgot" && "TRANSMIT RESET INSTRUCTIONS"}
                    </>
                  )}
                </button>

                {/* Switch modal view toggle */}
                <div className="text-center">
                  {authMode === "login" ? (
                    <p className="text-[10px] text-zinc-500 font-bold">
                      Need a personal profile?{" "}
                      <button 
                        type="button" 
                        onClick={() => { setAuthMode("register"); setAuthError(""); }}
                        className="text-red-600 font-black hover:underline"
                      >
                        Register Here
                      </button>
                    </p>
                  ) : (
                    <p className="text-[10px] text-zinc-500 font-bold">
                      Already have an account?{" "}
                      <button 
                        type="button" 
                        onClick={() => { setAuthMode("login"); setAuthError(""); }}
                        className="text-red-600 font-black hover:underline"
                      >
                        Login Here
                      </button>
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setLoginModalOpen(false)}
                  className="w-full rounded-xl border border-zinc-200 hover:bg-zinc-50 py-2.5 text-xs font-bold uppercase tracking-widest text-zinc-500 transition cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== EVENT REGISTRATION MODAL ==================== */}
      {eventRegModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-5 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="text-center space-y-2">
              <div className="h-10 w-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
                <Trophy className="h-5 w-5" />
              </div>
              <h3 className="font-title text-xl font-black uppercase text-zinc-900">Event Registration</h3>
              <p className="text-zinc-500 text-xs uppercase font-bold">{eventRegModal}</p>
            </div>

            {eventRegSuccess ? (
              <div className="p-5 bg-zinc-50 border border-zinc-200 rounded-xl text-center space-y-3 text-xs">
                <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto" />
                <span className="font-black text-zinc-900 block uppercase">Registration Verified</span>
                <p className="text-zinc-650 font-medium">Your reporting token has been cataloged. Please write this tracking token down:</p>
                <div className="bg-white border border-dashed border-zinc-300 py-2.5 px-4 rounded font-mono text-sm font-black text-red-600 inline-block tracking-wider">
                  {eventRegToken}
                </div>
                <p className="text-zinc-500 font-bold text-[10px]">Please present this token at the Sanwer Road trial entrance.</p>
                <button
                  onClick={() => {
                    setEventRegModal(null);
                    setEventRegSuccess(false);
                    setEventRegName("");
                    setEventRegMobile("");
                    setEventRegToken("");
                  }}
                  className="w-full mt-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-600 font-bold uppercase py-2 text-[10px] tracking-wider cursor-pointer"
                >
                  Close Panel
                </button>
              </div>
            ) : (
              <form onSubmit={handleEventRegister} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                    Athlete's Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rishi Kumar"
                    className="w-full rounded-xl bg-zinc-50 border border-zinc-250 px-4 py-3 text-xs text-zinc-800 focus:outline-none focus:border-red-600"
                    value={eventRegName}
                    onChange={(e) => setEventRegName(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                    Mobile Number for SMS Alerts
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91 91000-xxxxx"
                    className="w-full rounded-xl bg-zinc-50 border border-zinc-250 px-4 py-3 text-xs text-zinc-800 focus:outline-none focus:border-red-600"
                    value={eventRegMobile}
                    onChange={(e) => setEventRegMobile(e.target.value)}
                  />
                </div>

                {eventRegError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-[11px] font-bold rounded-xl">
                    ⚠️ {eventRegError}
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEventRegModal(null);
                      setEventRegError("");
                    }}
                    className="w-1/2 rounded-xl border border-zinc-200 py-3 text-xs font-bold text-zinc-500 uppercase hover:bg-zinc-50 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={eventRegSubmitting}
                    className={`w-1/2 rounded-xl text-white font-black text-xs uppercase tracking-widest py-3 transition cursor-pointer shadow-md ${
                      eventRegSubmitting ? "bg-red-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
                    }`}
                  >
                    {eventRegSubmitting ? "Reserving..." : "Confirm Seat"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
