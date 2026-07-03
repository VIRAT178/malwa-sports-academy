import React, { useState } from "react";
import { Check, Shield, Trophy, Sparkles, ArrowRight, HelpCircle, Flame, Star, Percent } from "lucide-react";

interface MembershipPlansProps {
  onSelectPlan?: (planName: string) => void;
  onAdmissionsClick?: () => void;
}

export default function MembershipPlans({ onSelectPlan, onAdmissionsClick }: MembershipPlansProps) {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "quarterly">("monthly");

  const plans = [
    {
      name: "Aspirant Pathway",
      id: "aspirant",
      description: "Designed for youth athletes and beginners taking their first steps towards competitive sports.",
      monthlyPrice: 2500,
      quarterlyPrice: 6375, // 15% discount of 7500
      features: [
        "Coaching in 1 Primary Sport",
        "3 Structured Sessions per Week",
        "Bi-annual Physical Fitness Assessment",
        "Full Locker Room & Shower Access",
        "District Tournament Entry Facilitation",
        "Access to Academy Common Lounge"
      ],
      badge: "Grassroots",
      color: "border-zinc-200 hover:border-zinc-400",
      icon: <Flame className="h-5 w-5 text-zinc-500" />
    },
    {
      name: "Elite Professional",
      id: "elite",
      description: "Comprehensive training and biomechanics monitoring for competitive state/national level representation.",
      monthlyPrice: 5500,
      quarterlyPrice: 14025, // 15% discount of 16500
      features: [
        "Dual Sport Coaching Access",
        "6 Intensive Sessions per Week",
        "Monthly Biomechanical Video Analysis",
        "Steam & Physiotherapy Recovery Access",
        "Customized Nutrition & Diet Charting",
        "Access to AI-Powered Virtual Coach",
        "One-on-one session with Head Coach weekly",
        "Guaranteed State League Scouting Entries"
      ],
      badge: "Most Popular",
      popular: true,
      color: "border-red-500 ring-2 ring-red-500/20 shadow-xl shadow-red-50",
      icon: <Trophy className="h-5 w-5 text-red-600" />
    },
    {
      name: "Academy Family Bundle",
      id: "family",
      description: "Complete holistic wellness, swimming pool, and racket sports privileges for up to 4 family members.",
      monthlyPrice: 8000,
      quarterlyPrice: 20400, // 15% discount of 24000
      features: [
        "All-Access Passes for up to 4 Members",
        "Unlimited Swimming Pool & Gym Privileges",
        "Weekend Friendly Leagues & Mixers",
        "10% Discount on In-house Sports Cafe",
        "4 Guest Passes per Month Included",
        "Free Access to Weekend General Health Checks",
        "Assigned Family General Fitness Advisor"
      ],
      badge: "Premium Wellness",
      color: "border-zinc-200 hover:border-zinc-400",
      icon: <Sparkles className="h-5 w-5 text-amber-500" />
    }
  ];

  const faqs = [
    {
      q: "Can I switch my primary sport after enrolling?",
      a: "Yes. Under our flexible athletic pathways, athletes can request a sports switch program after a consultation with our Head Coaches. This helps students find the sport best suited to their bio-mechanical strength."
    },
    {
      q: "Is hostel or lodging included in the fees?",
      a: "No, hostel facilities on Sanwer Road, Indore are charged separately. We offer separate premium air-cooled boarding facilities for boys and girls with full nutritious sports diets starting from ₹7,000 per month."
    },
    {
      q: "Are tournament travel and equipment costs covered?",
      a: "For Elite Professional athletes selected in our championship team pools, major travel allowances and registration fees are 100% sponsored by the Malwa Sports Academy board. Equipment is available at subsidized rates."
    },
    {
      q: "Do you offer any sibling or academic scholarship discounts?",
      a: "Absolutely. We offer a 10% sibling discount. Furthermore, under our MP State Talent Scholarship initiative, athletes with proven national/state-level rankings receive up to 100% waivers on coaching fees following trials."
    }
  ];

  return (
    <div className="py-12 sm:py-20 bg-white">
      {/* Header Banner */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="text-xs font-black text-red-600 uppercase tracking-widest bg-red-50 border border-red-100 px-3 py-1 rounded-full">
          MSA MEMBERSHIPS
        </span>
        <h1 className="font-display text-4xl sm:text-6xl font-black uppercase text-zinc-900 tracking-tight">
          ATHLETIC ENROLLMENT <span className="text-red-600">SCHEMES</span>
        </h1>
        <p className="text-zinc-600 text-sm sm:text-base max-w-2xl mx-auto font-medium leading-relaxed">
          Elite coaching structures, world-class equipment, and holistic physical conditioning tailored for the youth, competitive stars, and health enthusiasts of Madhya Pradesh.
        </p>

        {/* Billing period switcher */}
        <div className="pt-4 flex items-center justify-center">
          <div className="bg-zinc-100 p-1.5 rounded-xl border border-zinc-250 flex items-center gap-1">
            <button
              onClick={() => setBillingPeriod("monthly")}
              className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition ${
                billingPeriod === "monthly" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-800"
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingPeriod("quarterly")}
              className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition flex items-center gap-1.5 ${
                billingPeriod === "quarterly" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-800"
              }`}
            >
              <span>Quarterly</span>
              <span className="text-[10px] bg-red-600 text-white font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                <Percent className="h-2.5 w-2.5" />
                <span>SAVE 15%</span>
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Plans Section */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((p) => {
            const currentPrice = billingPeriod === "monthly" ? p.monthlyPrice : p.quarterlyPrice;
            const periodLabel = billingPeriod === "monthly" ? "/ Month" : "/ Quarter";
            
            return (
              <div
                key={p.id}
                className={`flex flex-col justify-between rounded-3xl border p-8 bg-white relative transition-all duration-300 ${p.color}`}
              >
                {p.popular && (
                  <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-red-600 text-white font-black text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg border border-red-500">
                    {p.badge}
                  </div>
                )}

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-200">
                      {p.icon}
                    </div>
                    {!p.popular && p.badge && (
                      <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500 bg-zinc-100 px-2.5 py-1 rounded-full">
                        {p.badge}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-title text-2xl font-black uppercase text-zinc-900 tracking-wider">
                      {p.name}
                    </h3>
                    <p className="text-zinc-500 text-xs font-semibold leading-relaxed">
                      {p.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-zinc-150">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-4xl font-extrabold text-zinc-950 font-sans">
                        ₹{currentPrice.toLocaleString("en-IN")}
                      </span>
                      <span className="text-zinc-500 text-xs font-bold uppercase tracking-wider">
                        {periodLabel}
                      </span>
                    </div>
                    {billingPeriod === "quarterly" && (
                      <span className="text-[10px] text-green-600 font-bold block mt-1 uppercase">
                        ✓ Effective rate: ₹{Math.round(currentPrice / 3).toLocaleString("en-IN")} / month
                      </span>
                    )}
                  </div>

                  <div className="space-y-3 pt-2">
                    <span className="text-[9px] text-zinc-400 font-black uppercase tracking-widest block">
                      WHAT'S INCLUDED:
                    </span>
                    <ul className="space-y-2.5 text-xs">
                      {p.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-zinc-700 font-medium">
                          <Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-8">
                  <button
                    onClick={() => {
                      if (onSelectPlan) onSelectPlan(p.name);
                      if (onAdmissionsClick) onAdmissionsClick();
                    }}
                    className={`w-full p-4 rounded-2xl text-xs font-black uppercase tracking-widest transition flex items-center justify-center gap-2 cursor-pointer ${
                      p.popular
                        ? "bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-200"
                        : "bg-zinc-950 hover:bg-zinc-800 text-white"
                    }`}
                  >
                    <span>SECURE YOUR SPOT</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scholarship Callout Banner */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24">
        <div className="bg-zinc-950 text-white rounded-3xl p-8 sm:p-12 border border-zinc-800 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-red-600/10 blur-3xl pointer-events-none" />
          
          <div className="space-y-4 max-w-xl">
            <span className="text-[10px] bg-red-600 text-white font-black uppercase px-3 py-1 rounded-full tracking-widest inline-block">
              MADHYA PRADESH TALENT PIPELINE
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-black uppercase tracking-wide leading-tight">
              PROVEN TRACK RECORD? <br />
              <span className="text-red-500">GET 100% SCHOLARSHIP</span>
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm font-semibold leading-relaxed">
              We scout and fund prospective athletes with proven district/state-level tournament track records. Attend our physical selection trials at Sanwer Road to wave off academy charges.
            </p>
          </div>

          <button
            onClick={onAdmissionsClick}
            className="bg-white hover:bg-zinc-100 text-zinc-950 font-black text-xs uppercase tracking-widest px-6 py-4 rounded-xl transition shrink-0 shadow-lg flex items-center gap-2 cursor-pointer"
          >
            <span>APPLY FOR SCHOLARSHIP TRIALS</span>
            <Trophy className="h-4 w-4 text-red-600" />
          </button>
        </div>
      </div>

      {/* FAQs section */}
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="font-display text-2xl sm:text-4xl font-black uppercase tracking-wide text-zinc-950">
            MEMBERSHIP <span className="text-red-600">FREQUENT QUESTIONS</span>
          </h2>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">
            Answers regarding billing, amenities, and hostel accommodation guidelines.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6 space-y-2">
              <div className="flex gap-2 items-center">
                <HelpCircle className="h-4.5 w-4.5 text-red-600 shrink-0" />
                <h4 className="font-title text-sm sm:text-base font-black uppercase tracking-wider text-zinc-900 leading-snug">
                  {faq.q}
                </h4>
              </div>
              <p className="text-zinc-650 text-xs sm:text-sm leading-relaxed font-semibold pl-6">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
