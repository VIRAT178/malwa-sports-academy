import React, { useState } from "react";
import { SPORTS_PROGRAMS } from "../data";
import { Calendar, Trophy, MapPin, UserCheck, AlertCircle } from "lucide-react";
import { API_BASE } from "../config";

export default function Admissions() {
  const [formData, setFormData] = useState({
    athleteName: "",
    age: "",
    gender: "Male",
    parentName: "",
    contactNumber: "",
    emailAddress: "",
    selectedSport: "badminton",
    skillLevel: "Beginner",
    medicalNotes: "",
    acceptedTerms: false
  });

  const [submittedTicket, setSubmittedTicket] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.acceptedTerms) {
      alert("Please accept the terms of the Malwa Sports Academy trial evaluation.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch(`${API_BASE}/api/admissions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.error || "Failed to submit evaluation request");
      }

      const ticket = resData.ticket;
      const selectedSportName = SPORTS_PROGRAMS.find(s => s.id === formData.selectedSport)?.name || "Badminton";

      setSubmittedTicket({
        ticketId: ticket.ticketId,
        athleteName: ticket.athleteName,
        age: ticket.age,
        parentName: ticket.parentName,
        sport: selectedSportName,
        trialDate: ticket.trialDate,
        time: ticket.time,
        location: ticket.location,
        skillLevel: ticket.skillLevel,
        coachingGuide: "Please arrive in full athletic wear, bringing basic personal training equipment."
      });
    } catch (error: any) {
      console.error("Admissions submission error:", error);
      setErrorMessage(error.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-white py-16 sm:py-24 relative overflow-hidden">
      <div className="absolute inset-0 sports-grid-pattern opacity-5 pointer-events-none" />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center space-x-2 bg-red-50 border border-red-100 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-widest text-red-600 animate-pulse">
            <Trophy className="h-3.5 w-3.5" />
            <span>CAMPUS TRIALS OPEN • 2026</span>
          </div>
          <h2 className="font-display text-4xl sm:text-6xl font-black uppercase text-zinc-900 tracking-wide">
            ATHLETE <span className="text-red-600">ADMISSIONS</span>
          </h2>
          <p className="text-zinc-650 text-sm sm:text-base leading-relaxed font-semibold">
            Register for a complimentary performance evaluation session. Our world-class certified advisors will assess your fitness, endurance, and technical attributes.
          </p>
        </div>

        {submittedTicket ? (
          /* Render Generated Elite PDF/Digital Admission Ticket */
          <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-10 shadow-xl space-y-8 animate-fade-in">
            <div className="text-center space-y-2">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-green-600 border border-green-100 mb-2">
                <UserCheck className="h-8 w-8" />
              </div>
              <h3 className="font-title text-2xl font-black uppercase tracking-wider text-green-600">
                TRIAL EVALUATION BOOKED
              </h3>
              <p className="text-zinc-600 text-sm max-w-md mx-auto font-medium">
                Your credentials have been authenticated. Present this digital ticket at the main gate security counter.
              </p>
            </div>

            {/* Simulated Printed Ticket Layout */}
            <div className="relative border-2 border-dashed border-zinc-300 bg-zinc-50 rounded-2xl p-6 sm:p-8 space-y-6 overflow-hidden">
              <div className="absolute -top-3 -left-3 h-6 w-6 rounded-full bg-white border border-zinc-200" />
              <div className="absolute -top-3 -right-3 h-6 w-6 rounded-full bg-white border border-zinc-200" />
              <div className="absolute -bottom-3 -left-3 h-6 w-6 rounded-full bg-white border border-zinc-200" />
              <div className="absolute -bottom-3 -right-3 h-6 w-6 rounded-full bg-white border border-zinc-200" />

              {/* Ticket Top */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-zinc-200 pb-4">
                <div>
                  <span className="text-xs font-black text-red-600 uppercase tracking-widest">MALWA SPORTS ACADEMY (MSA)</span>
                  <h4 className="font-title text-lg font-black text-zinc-900 tracking-wider">OFFICIAL ATHLETE TRIAL PASS</h4>
                </div>
                <div className="text-left sm:text-right mt-2 sm:mt-0">
                  <span className="block text-[10px] text-zinc-400 font-mono font-black uppercase">TICKET CODE</span>
                  <span className="text-sm font-mono font-black text-zinc-900 bg-white px-3 py-1 rounded border border-zinc-200 shadow-sm">{submittedTicket.ticketId}</span>
                </div>
              </div>

              {/* Ticket Body Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="block text-zinc-400 uppercase tracking-wider mb-1 font-black">ATHLETE NAME</span>
                  <span className="text-sm font-black text-zinc-800 uppercase">{submittedTicket.athleteName} ({submittedTicket.age} Yrs)</span>
                </div>

                <div>
                  <span className="block text-zinc-400 uppercase tracking-wider mb-1 font-black">SELECTED SPORT</span>
                  <span className="text-sm font-black text-red-600 uppercase">{submittedTicket.sport}</span>
                </div>

                <div>
                  <span className="block text-zinc-400 uppercase tracking-wider mb-1 font-black">EVALUATION DATE</span>
                  <span className="text-sm font-black text-zinc-800 flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-red-600" />
                    {submittedTicket.trialDate}
                  </span>
                </div>

                <div>
                  <span className="block text-zinc-400 uppercase tracking-wider mb-1 font-black">TRIAL LEVEL</span>
                  <span className="text-sm font-black text-zinc-700 uppercase">{submittedTicket.skillLevel} Entry</span>
                </div>

                <div className="sm:col-span-2">
                  <span className="block text-zinc-400 uppercase tracking-wider mb-1 font-black">LOCATION VENUE</span>
                  <span className="text-sm font-bold text-zinc-700 flex items-center gap-1.5">
                    <MapPin className="h-4.5 w-4.5 text-red-600 shrink-0" />
                    {submittedTicket.location}
                  </span>
                </div>
              </div>

              {/* Instructions footer of ticket */}
              <div className="border-t border-zinc-200 pt-4 bg-white p-4 rounded-xl text-left space-y-1 shadow-sm">
                <span className="block text-[10px] font-black text-yellow-600 uppercase tracking-widest flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" /> IMPORTANT ATHLETIC DIRECTIONS
                </span>
                <p className="text-[11px] text-zinc-600 font-bold leading-relaxed">
                  {submittedTicket.coachingGuide} Athletes are advised to report 30 minutes early to facilitate biometric screening & warming up. Contact the helpdesk at 910 910 4777 for details.
                </p>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => setSubmittedTicket(null)}
                className="text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-900 underline transition cursor-pointer"
              >
                Register Another Athlete
              </button>
            </div>
          </div>
        ) : (
          /* Main Application Form */
          <form 
            onSubmit={handleSubmit} 
            className="bg-zinc-50 border border-zinc-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm"
            id="admissions-trial-form"
          >
            <div className="border-b border-zinc-200 pb-4">
              <h3 className="font-title text-xl font-black uppercase tracking-wider text-zinc-900">
                Malwa Sports Academy Evaluation Application
              </h3>
              <p className="text-zinc-500 text-xs uppercase tracking-widest mt-0.5 font-bold">
                Ensure all fields match regional identity files
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Athlete Name */}
              <div>
                <label className="block text-xs font-black text-zinc-700 uppercase tracking-wider mb-1.5">
                  Athlete Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Arjun Sharma"
                  className="w-full rounded-xl bg-white border border-zinc-200 hover:border-zinc-400 focus:border-red-600 px-4 py-3 text-sm text-zinc-800 focus:outline-none transition"
                  value={formData.athleteName}
                  onChange={(e) => setFormData({ ...formData, athleteName: e.target.value })}
                />
              </div>

              {/* Age */}
              <div>
                <label className="block text-xs font-black text-zinc-700 uppercase tracking-wider mb-1.5">
                  Age <span className="text-red-600">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="6"
                  max="40"
                  placeholder="e.g. 15"
                  className="w-full rounded-xl bg-white border border-zinc-200 hover:border-zinc-400 focus:border-red-600 px-4 py-3 text-sm text-zinc-800 focus:outline-none transition"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-xs font-black text-zinc-700 uppercase tracking-wider mb-1.5">
                  Gender
                </label>
                <select
                  className="w-full rounded-xl bg-white border border-zinc-200 hover:border-zinc-400 focus:border-red-600 px-4 py-3 text-sm text-zinc-800 focus:outline-none transition cursor-pointer"
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Preferred Sport */}
              <div>
                <label className="block text-xs font-black text-zinc-700 uppercase tracking-wider mb-1.5">
                  Preferred Sport <span className="text-red-600">*</span>
                </label>
                <select
                  className="w-full rounded-xl bg-white border border-zinc-200 hover:border-zinc-400 focus:border-red-600 px-4 py-3 text-sm text-zinc-800 focus:outline-none transition cursor-pointer"
                  value={formData.selectedSport}
                  onChange={(e) => setFormData({ ...formData, selectedSport: e.target.value })}
                >
                  {SPORTS_PROGRAMS.map((sport) => (
                    <option key={sport.id} value={sport.id}>
                      {sport.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Parent/Guardian Name */}
              <div>
                <label className="block text-xs font-black text-zinc-700 uppercase tracking-wider mb-1.5">
                  Parent/Guardian Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rajesh Sharma"
                  className="w-full rounded-xl bg-white border border-zinc-200 hover:border-zinc-400 focus:border-red-600 px-4 py-3 text-sm text-zinc-800 focus:outline-none transition"
                  value={formData.parentName}
                  onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                />
              </div>

              {/* Contact Number */}
              <div>
                <label className="block text-xs font-black text-zinc-700 uppercase tracking-wider mb-1.5">
                  Contact Number <span className="text-red-600">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +91 98765-43210"
                  className="w-full rounded-xl bg-white border border-zinc-200 hover:border-zinc-400 focus:border-red-600 px-4 py-3 text-sm text-zinc-800 focus:outline-none transition"
                  value={formData.contactNumber}
                  onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                />
              </div>

              {/* Email Address */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-black text-zinc-700 uppercase tracking-wider mb-1.5">
                  Email Address <span className="text-red-600">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. athlete@domain.com"
                  className="w-full rounded-xl bg-white border border-zinc-200 hover:border-zinc-400 focus:border-red-600 px-4 py-3 text-sm text-zinc-800 focus:outline-none transition"
                  value={formData.emailAddress}
                  onChange={(e) => setFormData({ ...formData, emailAddress: e.target.value })}
                />
              </div>

              {/* Current Skill Experience */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-black text-zinc-700 uppercase tracking-wider mb-2">
                  Athlete's Experience / Skill Level
                </label>
                <div className="grid grid-cols-3 gap-2 sm:gap-4">
                  {["Beginner", "Intermediate / State Player", "Advanced / National Pool"].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setFormData({ ...formData, skillLevel: level })}
                      className={`py-3.5 px-2 text-center rounded-xl text-xs font-black uppercase transition border cursor-pointer ${
                        formData.skillLevel === level
                          ? "bg-red-600 text-white border-red-500 shadow-sm"
                          : "bg-white text-zinc-650 border-zinc-200 hover:border-zinc-400"
                      }`}
                    >
                      {level.split(" / ")[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Medical notes */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-black text-zinc-700 uppercase tracking-wider mb-1.5">
                  Dietary or Medical Declarations (Optional)
                </label>
                <textarea
                  placeholder="e.g. Asthma, gluten allergies, shoulder rehabilitation records"
                  className="w-full rounded-xl bg-white border border-zinc-200 hover:border-zinc-400 focus:border-red-600 px-4 py-3 text-sm text-zinc-800 focus:outline-none h-20 transition"
                  value={formData.medicalNotes}
                  onChange={(e) => setFormData({ ...formData, medicalNotes: e.target.value })}
                />
              </div>

              {/* Terms and conditions */}
              <div className="sm:col-span-2 flex items-start space-x-2.5 pt-2">
                <input
                  type="checkbox"
                  id="accepted-terms"
                  required
                  className="mt-1 h-4 w-4 rounded border-zinc-300 text-red-600 bg-white focus:ring-red-600 cursor-pointer"
                  checked={formData.acceptedTerms}
                  onChange={(e) => setFormData({ ...formData, acceptedTerms: e.target.checked })}
                />
                <label htmlFor="accepted-terms" className="text-xs text-zinc-500 font-bold leading-relaxed cursor-pointer">
                  I hereby declare that my ward is physically fit to undergo high-intensity cardiovascular training and matches. I authorize Malwa Sports Academy's medical staff to provide emergency first aid if required.
                </label>
              </div>

            </div>

            {errorMessage && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-600 text-xs font-bold rounded-xl animate-shake">
                ⚠️ {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full rounded-xl text-xs font-black uppercase tracking-widest text-white py-4 shadow-md transition-all cursor-pointer ${
                isSubmitting ? "bg-red-400 cursor-not-allowed scale-[0.98]" : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {isSubmitting ? "PROCESSING TRIAL APPLICATION..." : "SUBMIT EVALUATION REQUEST"}
            </button>
          </form>
        )}

      </div>
    </section>
  );
}
