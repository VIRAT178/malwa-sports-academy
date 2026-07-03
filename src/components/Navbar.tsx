import React, { useState } from "react";
import { Menu, X, ChevronDown, LogIn, Trophy, Instagram, Facebook, Youtube } from "lucide-react";
import { ALL_CLUB_SPORTS, logoImg } from "../data";

interface NavbarProps {
  currentView: string;
  setView: (view: string) => void;
  onLoginClick: () => void;
  selectedSportId: string;
  setSelectedSportId: (id: string) => void;
  currentUser: any;
  onLogout: () => void;
}

export default function Navbar({
  currentView,
  setView,
  onLoginClick,
  setSelectedSportId,
  currentUser,
  onLogout
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdowns, setDropdowns] = useState<{ [key: string]: boolean }>({
    club: false,
    academy: false,
    plans: false,
    events: false,
    facilities: false
  });

  const toggleDropdown = (key: string, value: boolean) => {
    setDropdowns((prev) => ({ ...prev, [key]: value }));
  };

  const handleSportSelect = (sportId: string) => {
    setSelectedSportId(sportId);
    setView("sports-detail");
    setMobileMenuOpen(false);
    setDropdowns({ club: false, academy: false, plans: false, events: false, facilities: false });
  };

  const handleNavClick = (viewId: string) => {
    setView(viewId);
    setMobileMenuOpen(false);
    setDropdowns({ club: false, academy: false, plans: false, events: false, facilities: false });
  };

  return (
    <header className="w-full z-50 flex flex-col bg-white">
      {/* 1. TOP SUB-HEADER BAR - MATCHING VIDEO EXACTLY */}
      <div className="w-full bg-zinc-900 text-white py-2 px-3 sm:px-6 lg:px-8 border-b border-zinc-800">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-[9px] sm:text-[10.5px] uppercase font-black tracking-[0.18em] sm:tracking-widest">
          {/* Left info */}
          <div className="flex items-center flex-wrap gap-x-2 gap-y-1 text-zinc-400">
            <span className="leading-none">MALWA SPORTS ACADEMY (MSA)</span>
            <span className="hidden sm:inline text-zinc-600">|</span>
            <span className="hidden sm:inline">INDORE</span>
          </div>

          {/* Right action links & social icons */}
          <div className="flex items-center flex-wrap gap-3 sm:gap-5">
            <button
              onClick={() => handleNavClick("admissions")}
              className="text-white hover:text-red-500 transition-colors font-black text-[9px] sm:text-[10.5px]"
            >
              MEMBERSHIP ENQUIRY
            </button>

            <span className="text-zinc-700 hidden sm:inline">|</span>

            {/* Social Icons matching video */}
            <div className="hidden md:flex items-center space-x-2.5">
              <a href="https://www.instagram.com/malwasportsacademy?igsh=dGZlY3ozaHp4OXM2" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-zinc-400 hover:text-red-500 transition-colors">
                <Instagram className="h-3.5 w-3.5" />
              </a>
              <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-zinc-400 hover:text-red-500 transition-colors">
                <Facebook className="h-3.5 w-3.5" />
              </a>
              <a href="https://www.youtube.com/@mist_indore" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-zinc-400 hover:text-red-500 transition-colors">
                <Youtube className="h-3.5 w-3.5" />
              </a>
            </div>

            <span className="text-zinc-700 hidden sm:inline">|</span>

            {/* User portal trigger */}
            {currentUser ? (
              <div className="hidden sm:flex items-center space-x-2 min-w-0">
                <button
                  onClick={() => handleNavClick("dashboard")}
                  className="text-red-500 hover:underline font-black truncate max-w-45"
                  title={`Dashboard (${currentUser.name})`}
                >
                  DASHBOARD ({currentUser.name.toUpperCase()})
                </button>
                <button
                  onClick={onLogout}
                  className="text-zinc-400 hover:text-white transition"
                >
                  (LOGOUT)
                </button>
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="hidden sm:flex items-center space-x-1 text-zinc-400 hover:text-white transition-colors"
              >
                <LogIn className="h-3 w-3" />
                <span>MEMBER PORTAL</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. MAIN LOGO & NAVIGATION HEADER */}
      <div className="w-full border-b border-zinc-150 bg-white sticky top-0 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* BRAND LOGO - MALWA SPORTS ACADEMY (MSA) Logo */}
          <button
            onClick={() => handleNavClick("home")}
            className="flex items-center focus:outline-none group text-left py-1 select-none shrink-0"
            id="nav-logo"
          >
            <img 
              src={logoImg} 
              alt="MSA Logo" 
              className="h-14 sm:h-16 w-auto object-contain group-hover:scale-110 transition-transform duration-300"
              referrerPolicy="no-referrer"
            />
          </button>

          {/* DESKTOP NAVIGATION MENU */}
          <nav className="hidden lg:flex items-center space-x-1">
            
            {/* HOME */}
            <button
              onClick={() => handleNavClick("home")}
              className={`px-3 py-2 text-xs font-black uppercase tracking-widest rounded transition ${
                currentView === "home" ? "text-red-600 font-extrabold" : "text-zinc-700 hover:text-red-600"
              }`}
            >
              HOME
            </button>

            {/* CLUB DROPDOWN */}
            <div 
              className="relative"
              onMouseEnter={() => toggleDropdown("club", true)}
              onMouseLeave={() => toggleDropdown("club", false)}
            >
              <button className="flex items-center gap-1 px-3 py-2 text-xs font-black uppercase tracking-widest text-zinc-700 hover:text-red-600 rounded">
                THE CLUB <ChevronDown className="h-3 w-3" />
              </button>
              {dropdowns.club && (
                <div className="absolute left-0 mt-0 w-52 rounded-xl border border-zinc-150 bg-white p-2 shadow-xl z-50 animate-fade-in">
                  <div className="grid grid-cols-1 gap-0.5">
                    {ALL_CLUB_SPORTS.map((sport) => (
                      <button
                        key={sport.id}
                        onClick={() => handleSportSelect(sport.id)}
                        className="flex items-center space-x-2 w-full text-left px-3 py-1.5 rounded-lg text-xs font-bold text-zinc-650 hover:text-white hover:bg-red-600 transition"
                      >
                        <span>{sport.icon}</span>
                        <span>{sport.name.toUpperCase()}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ACADEMY DROPDOWN */}
            <div 
              className="relative"
              onMouseEnter={() => toggleDropdown("academy", true)}
              onMouseLeave={() => toggleDropdown("academy", false)}
            >
              <button className="flex items-center gap-1 px-3 py-2 text-xs font-black uppercase tracking-widest text-zinc-700 hover:text-red-600 rounded">
                ACADEMY <ChevronDown className="h-3 w-3" />
              </button>
              {dropdowns.academy && (
                <div className="absolute left-0 mt-0 w-56 rounded-xl border border-zinc-150 bg-white p-2 shadow-xl z-50 animate-fade-in">
                  <div className="grid grid-cols-1 gap-0.5">
                    {[
                      { id: "cricket", name: "Cricket Academy" },
                      { id: "football", name: "Football Academy" },
                      { id: "basketball", name: "Basketball Academy" },
                      { id: "badminton", name: "Badminton Academy" },
                      { id: "swimming", name: "Swimming Academy" }
                    ].map((acad) => (
                      <button
                        key={acad.id}
                        onClick={() => handleSportSelect(acad.id)}
                        className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-zinc-650 hover:text-white hover:bg-red-600 transition"
                      >
                        {acad.name.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* PLANS DROPDOWN */}
            <div 
              className="relative"
              onMouseEnter={() => toggleDropdown("plans", true)}
              onMouseLeave={() => toggleDropdown("plans", false)}
            >
              <button className="flex items-center gap-1 px-3 py-2 text-xs font-black uppercase tracking-widest text-zinc-700 hover:text-red-600 rounded">
                PLANS <ChevronDown className="h-3 w-3" />
              </button>
              {dropdowns.plans && (
                <div className="absolute left-0 mt-0 w-48 rounded-xl border border-zinc-150 bg-white p-2 shadow-xl z-50 animate-fade-in">
                  <div className="grid grid-cols-1 gap-0.5">
                    <button
                      onClick={() => handleNavClick("membership-plans")}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-zinc-650 hover:text-white hover:bg-red-600 transition"
                    >
                      MEMBERSHIP PLAN
                    </button>
                    <button
                      onClick={() => handleNavClick("corporate-plans")}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-zinc-650 hover:text-white hover:bg-red-600 transition"
                    >
                      CORPORATE PLAN
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* EVENTS DROPDOWN */}
            <div 
              className="relative"
              onMouseEnter={() => toggleDropdown("events", true)}
              onMouseLeave={() => toggleDropdown("events", false)}
            >
              <button className="flex items-center gap-1 px-3 py-2 text-xs font-black uppercase tracking-widest text-zinc-700 hover:text-red-600 rounded">
                EVENTS <ChevronDown className="h-3 w-3" />
              </button>
              {dropdowns.events && (
                <div className="absolute left-0 mt-0 w-44 rounded-xl border border-zinc-150 bg-white p-2 shadow-xl z-50 animate-fade-in">
                  <div className="grid grid-cols-1 gap-0.5">
                    <button
                      onClick={() => handleNavClick("events")}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-zinc-650 hover:text-white hover:bg-red-600 transition"
                    >
                      PAST EVENTS
                    </button>
                    <button
                      onClick={() => handleNavClick("events")}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-zinc-650 hover:text-white hover:bg-red-600 transition"
                    >
                      UPCOMING EVENTS
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* FACILITIES DROPDOWN */}
            <div 
              className="relative"
              onMouseEnter={() => toggleDropdown("facilities", true)}
              onMouseLeave={() => toggleDropdown("facilities", false)}
            >
              <button className="flex items-center gap-1 px-3 py-2 text-xs font-black uppercase tracking-widest text-zinc-700 hover:text-red-600 rounded">
                FACILITIES <ChevronDown className="h-3 w-3" />
              </button>
              {dropdowns.facilities && (
                <div className="absolute left-0 mt-0 w-52 rounded-xl border border-zinc-150 bg-white p-2 shadow-xl z-50 animate-fade-in">
                  <div className="grid grid-cols-1 gap-0.5">
                    <button
                      onClick={() => handleNavClick("facilities")}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-zinc-650 hover:text-white hover:bg-red-600 transition"
                    >
                      STEAM BATH
                    </button>
                    <button
                      onClick={() => handleNavClick("facilities")}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-zinc-650 hover:text-white hover:bg-red-600 transition"
                    >
                      PHYSIOTHERAPY & REHAB
                    </button>
                    <button
                      onClick={() => handleNavClick("facilities")}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-zinc-650 hover:text-white hover:bg-red-600 transition"
                    >
                      CAFE & GOURMET
                    </button>
                    <button
                      onClick={() => handleNavClick("facilities")}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-zinc-650 hover:text-white hover:bg-red-600 transition"
                    >
                      SPORTS SHOP
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* GALLERY */}
            <button
              onClick={() => {
                const galleryElem = document.getElementById("gallery-section");
                if (galleryElem) {
                  galleryElem.scrollIntoView({ behavior: "auto" });
                } else {
                  handleNavClick("home");
                  setTimeout(() => {
                    document.getElementById("gallery-section")?.scrollIntoView({ behavior: "auto" });
                  }, 200);
                }
              }}
              className="px-3 py-2 text-xs font-black uppercase tracking-widest text-zinc-700 hover:text-red-600 rounded"
            >
              GALLERY
            </button>

            {/* CONTACT */}
            <button
              onClick={() => {
                const contactElem = document.getElementById("contact-section");
                if (contactElem) {
                  contactElem.scrollIntoView({ behavior: "auto" });
                } else {
                  handleNavClick("home");
                  setTimeout(() => {
                    document.getElementById("contact-section")?.scrollIntoView({ behavior: "auto" });
                  }, 200);
                }
              }}
              className="px-3 py-2 text-xs font-black uppercase tracking-widest text-zinc-700 hover:text-red-600 rounded"
            >
              CONTACT
            </button>

          </nav>

          {/* MOBILE BURGER TRIGGER */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-zinc-50 hover:bg-zinc-100 text-zinc-700 transition"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

        </div>
      </div>

      {/* MOBILE SLIDE-OUT MENU */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-zinc-200 p-3 sm:p-4 space-y-4 animate-fade-in shadow-inner max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              onClick={() => handleNavClick("home")}
              className="p-3 text-xs font-black uppercase tracking-widest bg-zinc-50 hover:bg-red-50 text-zinc-700 text-center rounded-xl"
            >
              HOME
            </button>
            <button
              onClick={() => handleNavClick("events")}
              className="p-3 text-xs font-black uppercase tracking-widest bg-zinc-50 hover:bg-red-50 text-zinc-700 text-center rounded-xl"
            >
              SUMMER CAMP
            </button>
            <button
              onClick={() => handleNavClick("membership-plans")}
              className="p-3 text-xs font-black uppercase tracking-widest bg-zinc-50 hover:bg-red-50 text-zinc-700 text-center rounded-xl"
            >
              MEMBERSHIPS
            </button>
            <button
              onClick={() => handleNavClick("corporate-plans")}
              className="p-3 text-xs font-black uppercase tracking-widest bg-zinc-50 hover:bg-red-50 text-zinc-700 text-center rounded-xl"
            >
              CORPORATE
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                const galleryElem = document.getElementById("gallery-section");
                if (galleryElem) {
                  galleryElem.scrollIntoView({ behavior: "auto" });
                } else {
                  handleNavClick("home");
                  setTimeout(() => {
                    document.getElementById("gallery-section")?.scrollIntoView({ behavior: "auto" });
                  }, 250);
                }
              }}
              className="p-3 text-xs font-black uppercase tracking-widest bg-zinc-50 hover:bg-red-50 text-zinc-700 text-center rounded-xl"
            >
              GALLERY
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                const contactElem = document.getElementById("contact-section");
                if (contactElem) {
                  contactElem.scrollIntoView({ behavior: "auto" });
                } else {
                  handleNavClick("home");
                  setTimeout(() => {
                    document.getElementById("contact-section")?.scrollIntoView({ behavior: "auto" });
                  }, 250);
                }
              }}
              className="p-3 text-xs font-black uppercase tracking-widest bg-zinc-50 hover:bg-red-50 text-zinc-700 text-center rounded-xl"
            >
              CONTACT
            </button>
          </div>

          <div className="border-t border-zinc-100 pt-3 space-y-2">
            <span className="block text-zinc-400 text-[10px] font-black uppercase tracking-widest">
              EXPLORE SPORTS
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {ALL_CLUB_SPORTS.map((sport) => (
                <button
                  key={sport.id}
                  onClick={() => handleSportSelect(sport.id)}
                  className="flex items-center space-x-1.5 p-2 rounded-lg bg-zinc-50 text-[10px] font-bold text-zinc-700"
                >
                  <span>{sport.icon}</span>
                  <span className="truncate uppercase">{sport.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-zinc-100 pt-3 space-y-2">
            <span className="block text-zinc-400 text-[10px] font-black uppercase tracking-widest">
              MEMBER ACCESS
            </span>
            {currentUser ? (
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleNavClick("dashboard")}
                  className="flex items-center justify-center space-x-2 w-full p-3 text-xs font-black uppercase tracking-widest bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-sm transition"
                  title={`Dashboard (${currentUser.name})`}
                >
                  <span className="truncate max-w-full">DASHBOARD ({currentUser.name.toUpperCase()})</span>
                </button>
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full p-2 text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-red-600 transition text-center"
                >
                  LOGOUT
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  onLoginClick();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-center space-x-2 w-full p-3 text-xs font-black uppercase tracking-widest bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl shadow-sm transition"
              >
                <LogIn className="h-4 w-4 text-red-500" />
                <span>MEMBER PORTAL</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
