import React, { useState } from "react";
import { Building2, Calendar, ShieldCheck, Mail, Phone, MapPin, Users2, Award, ArrowUpRight, Send, CheckCircle } from "lucide-react";

export default function CorporatePlans() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Form State
  const [compName, setCompName] = useState("");
  const [repName, setRepName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [interestType, setInterestType] = useState("passes");
  const [notes, setNotes] = useState("");
  const [feedback, setFeedback] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback("");

    try {
      // Send corporate lead to api proxy
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${repName} (${compName})`,
          phone,
          email,
          query: `[CORPORATE INQUIRY - Type: ${interestType}] Notes: ${notes}`
        })
      });
      
      if (!response.ok) throw new Error("Failed to dispatch corporate query.");
      
      setSubmitted(true);
    } catch (err: any) {
      setFeedback(err.message || "An error occurred while submitting.");
    } finally {
      setSubmitting(false);
    }
  };

  const corporateOfferings = [
    {
      title: "Corporate Wellness Passes",
      icon: <Users2 className="h-6 w-6 text-red-600" />,
      description: "Custom bulk fitness and coaching memberships for your corporate workforce. Incorporate regular swimming, physical conditioning, and racket sports into your employees' routines.",
      features: ["Discounted tier pricing for teams over 15+", "Assigned wellness coaches for fitness logging", "Customized corporate health newsletters", "Monthly team-building sports mixers"]
    },
    {
      title: "Championship Venue Rentals",
      icon: <Calendar className="h-6 w-6 text-red-600" />,
      description: "Book our national-standard facilities on Sanwer Road, Indore for your annual corporate tournaments, cricket cups, or badminton leagues. Full refereeing, catering, and digital scoreboard crew available.",
      features: ["BWF-standard Badminton & Squash complexes", "Floodlit FIFA AstroTurf & Cricket grounds", "Integrated catering & high-spec audio setups", "Professional refereeing & officiating panels"]
    },
    {
      title: "CSR Athletic Sponsorship",
      icon: <Award className="h-6 w-6 text-red-600" />,
      description: "Direct your Corporate Social Responsibility (CSR) funds to sponsor elite, underprivileged state athletes training at MSA. Back high-potential future Olympians with boarding and training stipends.",
      features: ["100% Tax Exemptions under applicable rules", "Regular athlete performance metrics tracking", "Brand exposure on player kits & tournaments", "Annual impact report & certificate presentation"]
    }
  ];

  return (
    <div className="py-12 sm:py-20 bg-white">
      {/* Hero section */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="text-xs font-black text-red-600 uppercase tracking-widest bg-red-50 border border-red-100 px-3 py-1 rounded-full inline-flex items-center gap-1">
          <Building2 className="h-3.5 w-3.5" />
          <span>MSA B2B COLLABORATION</span>
        </span>
        <h1 className="font-display text-4xl sm:text-6xl font-black uppercase text-zinc-900 tracking-tight">
          CORPORATE ATHLETIC <span className="text-red-600">PARTNERSHIPS</span>
        </h1>
        <p className="text-zinc-650 text-sm sm:text-base max-w-2xl mx-auto font-medium leading-relaxed">
          Unlock employee productivity, secure premium tournament infrastructure rentals, or fulfill tax-exempt CSR requirements by partnering with Indore's preeminent sports facility.
        </p>
      </div>

      {/* Grid of options */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {corporateOfferings.map((offering, i) => (
            <div key={i} className="bg-zinc-50 border border-zinc-200 p-8 rounded-3xl flex flex-col justify-between space-y-6 shadow-sm hover:shadow-md transition">
              <div className="space-y-4">
                <div className="p-3 bg-white rounded-2xl border border-zinc-150 inline-block shadow-sm">
                  {offering.icon}
                </div>
                <h3 className="font-title text-xl font-black uppercase tracking-wider text-zinc-950">
                  {offering.title}
                </h3>
                <p className="text-zinc-600 text-xs sm:text-sm font-medium leading-relaxed">
                  {offering.description}
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t border-zinc-200">
                <span className="text-[9px] text-zinc-400 font-black uppercase tracking-widest block">KEY BENEFITS & FEATURES:</span>
                <ul className="space-y-2">
                  {offering.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs font-semibold text-zinc-700">
                      <ShieldCheck className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Form and contact panel side-by-side */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24">
        <div className="bg-zinc-950 text-white rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl flex flex-col lg:flex-row">
          
          {/* Left Panel: Information & Contacts */}
          <div className="p-8 sm:p-12 lg:w-2/5 bg-zinc-900 flex flex-col justify-between relative">
            <div className="absolute top-0 left-0 h-48 w-48 rounded-full bg-red-600/5 blur-3xl pointer-events-none" />
            
            <div className="space-y-6">
              <span className="text-[10px] text-red-500 font-black uppercase tracking-widest block">ACADEMY REVENUE BOARD</span>
              <h2 className="font-display text-2xl sm:text-3.5xl font-black uppercase leading-tight">
                LAUNCH A <br />
                <span className="text-red-500">PARTNERSHIP</span> WITH MSA
              </h2>
              <p className="text-zinc-400 text-xs sm:text-sm font-semibold leading-relaxed">
                Connect directly with our corporate relations department. We assist in custom branding placements, tax certifications for CSR allocations, and custom tournament calendars.
              </p>
            </div>

            <div className="space-y-4 pt-8 border-t border-zinc-800 text-xs text-zinc-300 font-mono font-semibold">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 bg-zinc-800 text-red-500 rounded-lg flex items-center justify-center border border-zinc-700">
                  <Mail className="h-4.5 w-4.5" />
                </div>
                <div>
                  <span className="block text-[8px] text-zinc-500 font-bold uppercase font-sans">B2B INQUIRIES</span>
                  <span>partnerships@malwasports.com</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-9 w-9 bg-zinc-800 text-red-500 rounded-lg flex items-center justify-center border border-zinc-700">
                  <Phone className="h-4.5 w-4.5" />
                </div>
                <div>
                  <span className="block text-[8px] text-zinc-500 font-bold uppercase font-sans">CORPORATE CALLDESK</span>
                  <span>+91 98930-12000</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-9 w-9 bg-zinc-800 text-red-500 rounded-lg flex items-center justify-center border border-zinc-700">
                  <MapPin className="h-4.5 w-4.5" />
                </div>
                <div>
                  <span className="block text-[8px] text-zinc-500 font-bold uppercase font-sans">ACADEMY CAMPUS</span>
                  <span>Sanwer Road Industrial Area, Indore</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Interactive Form */}
          <div className="p-8 sm:p-12 lg:w-3/5">
            {submitted ? (
              <div className="h-full flex flex-col justify-center items-center text-center space-y-4 animate-fade-in py-12">
                <div className="h-16 w-16 bg-green-500 text-zinc-950 rounded-full flex items-center justify-center shadow-lg shadow-green-500/20">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-title text-2xl font-black uppercase text-white">Proposal Dispatched Successfully</h3>
                <p className="text-zinc-400 text-xs sm:text-sm font-semibold max-w-sm">
                  Thank you for your interest. Our Corporate Accounts Director will reach out to schedule an onsite meeting at Sanwer Road with full pitch catalogs.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setNotes("");
                  }}
                  className="mt-4 border border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition"
                >
                  SEND ANOTHER PROPOSAL
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="text-left">
                  <h3 className="font-title text-lg font-black uppercase text-white tracking-wider">REQUEST COLLABORATION QUOTE</h3>
                  <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Estimated callback within 4 operating hours</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] text-zinc-400 font-black uppercase tracking-widest">Company / Org Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Malwa Tech Solutions"
                      value={compName}
                      onChange={(e) => setCompName(e.target.value)}
                      className="w-full rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 px-4 py-3 text-xs text-white focus:outline-none focus:border-red-600 transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] text-zinc-400 font-black uppercase tracking-widest">Representative Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rohit Sharma"
                      value={repName}
                      onChange={(e) => setRepName(e.target.value)}
                      className="w-full rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 px-4 py-3 text-xs text-white focus:outline-none focus:border-red-600 transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] text-zinc-400 font-black uppercase tracking-widest">Corporate Email</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. rohit@malwatech.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 px-4 py-3 text-xs text-white focus:outline-none focus:border-red-600 transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] text-zinc-400 font-black uppercase tracking-widest">Direct Contact Phone</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 99260-XXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 px-4 py-3 text-xs text-white focus:outline-none focus:border-red-600 transition"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="block text-[10px] text-zinc-400 font-black uppercase tracking-widest">Program of Interest</label>
                    <select
                      value={interestType}
                      onChange={(e) => setInterestType(e.target.value)}
                      className="w-full rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 px-4 py-3 text-xs text-white focus:outline-none focus:border-red-600 transition cursor-pointer"
                    >
                      <option value="passes">Corporate Gym & Coaching Passes (Wellness)</option>
                      <option value="rental">Facility Venue Bookings (Leagues & Tournaments)</option>
                      <option value="csr">Corporate Social Responsibility (CSR Sponsorship)</option>
                      <option value="other">Custom Brand Marketing Placements</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="block text-[10px] text-zinc-400 font-black uppercase tracking-widest">Collaboration Details & Staff Count</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Describe estimates, expected booking dates, or athlete profile sponsorship focus..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 px-4 py-3 text-xs text-white focus:outline-none focus:border-red-600 transition"
                    />
                  </div>
                </div>

                {feedback && (
                  <div className="p-3 bg-red-900/40 border border-red-700 text-red-200 text-xs font-bold rounded-xl text-center">
                    ⚠️ {feedback}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className={`w-full font-black text-xs uppercase tracking-widest py-3.5 rounded-xl transition shadow-lg flex items-center justify-center gap-2 cursor-pointer ${
                    submitting ? "bg-red-500 text-white cursor-not-allowed animate-pulse" : "bg-red-600 hover:bg-red-700 text-white"
                  }`}
                >
                  <span>{submitting ? "TRANSMITTING SPECIFICATIONS..." : "DISPATCH COLLABORATION REQUEST"}</span>
                  <Send className="h-4 w-4" />
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
