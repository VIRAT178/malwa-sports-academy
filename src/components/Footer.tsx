import React from "react";
import { Facebook, Twitter, Youtube, Instagram, MapPin, Phone, Mail } from "lucide-react";
import { logoImg } from "../data";

interface FooterProps {
  setView: (view: string) => void;
}

export default function Footer({ setView }: FooterProps) {
  const handleLinkClick = (viewId: string) => {
    setView(viewId);
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  return (
    <footer className="bg-zinc-950 text-zinc-400 text-xs sm:text-sm border-t border-zinc-800">
      
      {/* Upper Footer section */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        
        {/* Column 1: Brand & Socials */}
        <div className="space-y-4">
          <div className="flex items-center select-none">
            <img 
              src={logoImg} 
              alt="MSA Logo" 
              className="h-20 w-auto object-contain shadow-md"
              referrerPolicy="no-referrer"
            />
          </div>
          <p className="text-zinc-500 text-xs leading-relaxed">
            We believe that sports and fitness should be accessible to everyone. Experience elite coaching and international facilities under one single roof in Indore.
          </p>
          <div className="flex space-x-2 pt-2">
            <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="p-2 bg-zinc-900 hover:bg-red-600 hover:text-white rounded transition">
              <Facebook className="h-4 w-4" />
            </a>
            <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="p-2 bg-zinc-900 hover:bg-red-600 hover:text-white rounded transition">
              <Twitter className="h-4 w-4" />
            </a>
            <a href="https://www.instagram.com/malwasportsacademy?igsh=dGZlY3ozaHp4OXM2" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="p-2 bg-zinc-900 hover:bg-red-600 hover:text-white rounded transition">
              <Instagram className="h-4 w-4" />
            </a>
            <a href="https://www.youtube.com/@mist_indore" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="p-2 bg-zinc-900 hover:bg-red-600 hover:text-white rounded transition">
              <Youtube className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Column 2: Useful Links */}
        <div className="space-y-4">
          <h4 className="text-white text-xs font-black uppercase tracking-wider border-l-2 border-red-600 pl-2">
            USEFUL LINKS
          </h4>
          <ul className="space-y-2 text-xs font-bold">
            <li>
              <button onClick={() => handleLinkClick("home")} className="hover:text-red-500 transition-colors flex items-center gap-1">
                ✓ Home
              </button>
            </li>
            <li>
              <button onClick={() => handleLinkClick("membership-plans")} className="hover:text-red-500 transition-colors flex items-center gap-1">
                ✓ Membership Plan
              </button>
            </li>
            <li>
              <button onClick={() => handleLinkClick("corporate-plans")} className="hover:text-red-500 transition-colors flex items-center gap-1">
                ✓ Corporate Plan
              </button>
            </li>
            <li>
              <button onClick={() => handleLinkClick("admissions")} className="hover:text-red-500 transition-colors flex items-center gap-1">
                ✓ Membership Enquiry
              </button>
            </li>
            <li>
              <button 
                onClick={() => {
                  handleLinkClick("home");
                  setTimeout(() => {
                    document.getElementById("gallery-section")?.scrollIntoView({ behavior: "auto" });
                  }, 200);
                }} 
                className="hover:text-red-500 transition-colors flex items-center gap-1"
              >
                ✓ Gallery
              </button>
            </li>
            <li>
              <button 
                onClick={() => {
                  handleLinkClick("home");
                  setTimeout(() => {
                    document.getElementById("reviews-section")?.scrollIntoView({ behavior: "auto" });
                  }, 200);
                }} 
                className="hover:text-red-500 transition-colors flex items-center gap-1"
              >
                ✓ Reviews
              </button>
            </li>
            <li>
              <button onClick={() => handleLinkClick("contact")} className="hover:text-red-500 transition-colors flex items-center gap-1">
                ✓ Contact Us
              </button>
            </li>
          </ul>
        </div>

        {/* Column 3: Upcoming Events */}
        <div className="space-y-4">
          <h4 className="text-white text-xs font-black uppercase tracking-wider border-l-2 border-red-600 pl-2">
            UPCOMING EVENTS
          </h4>
          <div className="space-y-3">
            {[
              { title: "BADMINTON SUMMER CAMP 2026", date: "Starts July 15" },
              { title: "SQUASH SUMMER CAMP 2026", date: "Starts July 28" },
              { title: "SWIMMING SUMMER CAMP 2026", date: "Starts Aug 05" },
              { title: "PICKLEBALL SUMMER CAMP 2026", date: "Starts Aug 12" }
            ].map((ev, idx) => (
              <button
                key={idx}
                onClick={() => handleLinkClick("events")}
                className="text-left block group"
              >
                <span className="block font-black text-xs text-zinc-300 group-hover:text-red-500 transition-colors">
                  {ev.title}
                </span>
                <span className="text-[10px] text-zinc-500 font-bold">{ev.date}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Column 4: About Malwa Sports Academy Hours */}
        <div className="space-y-4">
          <h4 className="text-white text-xs font-black uppercase tracking-wider border-l-2 border-red-600 pl-2">
            ABOUT MALWA SPORTS ACADEMY
          </h4>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between border-b border-zinc-800 pb-1">
              <span className="text-zinc-500 font-bold">Monday</span>
              <span className="text-white font-semibold">6:00am - 10:00pm</span>
            </div>
            <div className="flex justify-between border-b border-zinc-800 pb-1">
              <span className="text-zinc-500 font-bold">Tuesday</span>
              <span className="text-white font-semibold">6:00am - 10:00pm</span>
            </div>
            <div className="flex justify-between border-b border-zinc-800 pb-1">
              <span className="text-zinc-500 font-bold">Wednesday</span>
              <span className="text-white font-semibold">6:00am - 10:00pm</span>
            </div>
            <div className="flex justify-between border-b border-zinc-800 pb-1">
              <span className="text-zinc-500 font-bold">Thursday</span>
              <span className="text-white font-semibold">6:00am - 10:00pm</span>
            </div>
            <div className="flex justify-between border-b border-zinc-800 pb-1">
              <span className="text-zinc-500 font-bold">Friday</span>
              <span className="text-white font-semibold">6:00am - 10:00pm</span>
            </div>
            <div className="flex justify-between border-b border-zinc-800 pb-1">
              <span className="text-zinc-500 font-bold">Saturday</span>
              <span className="text-white font-semibold">6:00am - 10:00pm</span>
            </div>
            <div className="flex justify-between pb-1">
              <span className="text-zinc-500 font-bold">Sunday</span>
              <span className="text-white font-semibold">8:00am - 12:00pm</span>
            </div>
          </div>
        </div>

      </div>

      {/* Contact info bar - Call, Email, Address matching video exactly */}
      <div className="border-t border-zinc-900 bg-zinc-950/80 py-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-center md:text-left">
          
          {/* CALL */}
          <div className="space-y-1">
            <span className="block font-black text-white text-[10px] tracking-widest uppercase">CALL</span>
            <div className="flex items-center justify-center md:justify-start space-x-2 text-zinc-400">
              <Phone className="h-3.5 w-3.5 text-red-600" />
              <span className="font-bold">- 910 910 4777</span>
            </div>
            <div className="flex items-center justify-center md:justify-start space-x-2 text-zinc-400">
              <Phone className="h-3.5 w-3.5 text-red-600" />
              <span className="font-bold">- 810 948 4777</span>
            </div>
          </div>

          {/* EMAIL */}
          <div className="space-y-1">
            <span className="block font-black text-white text-[10px] tracking-widest uppercase">EMAIL</span>
            <div className="flex items-center justify-center md:justify-start space-x-2 text-zinc-400">
              <Mail className="h-3.5 w-3.5 text-red-600" />
              <span className="font-bold">info@olyspo.com</span>
            </div>
          </div>

          {/* ADDRESS */}
          <div className="space-y-1">
            <span className="block font-black text-white text-[10px] tracking-widest uppercase">ADDRESS</span>
            <div className="flex items-start justify-center md:justify-start space-x-2 text-zinc-400">
              <MapPin className="h-3.5 w-3.5 text-red-600 mt-0.5" />
              <span className="font-bold leading-normal">
                Malwa Sports Academy (MSA), Near Mayank Blue Water Park, Indore - 452016
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Sub-footer copyright */}
      <div className="border-t border-zinc-900 bg-black py-4 text-center text-[10px] text-zinc-600 font-bold uppercase tracking-wider">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Copyright 2026, Malwa Sports Academy (MSA). All Rights Reserved.</span>
          <div className="flex space-x-3 font-semibold">
            <a href="#privacy" className="hover:text-red-500">Privacy Policy</a>
            <span>•</span>
            <a href="#terms" className="hover:text-red-500">Terms and conditions</a>
            <span>•</span>
            <a href="#refund" className="hover:text-red-500">Refund and cancellation</a>
          </div>
        </div>
      </div>

    </footer>
  );
}
