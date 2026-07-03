import React, { useState, useRef, useEffect } from "react";
import { Send, Sparkles, RefreshCw, Dumbbell, Flame } from "lucide-react";
import { SPORTS_PROGRAMS } from "../data";
import { API_BASE } from "../config";

interface Message {
  role: "user" | "model";
  content: string;
}

export default function AICoach() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      content: "Hello! I am Coach MSA, your AI Sports Advisor. Whether you want to optimize your badminton drop shots, master squash court positioning, prepare a high-protein champion diet, or train your mind for clutch performance—I am here to coach you. What are we working on today?"
    }
  ]);
  
  const [input, setInput] = useState("");
  const [selectedSport, setSelectedSport] = useState("badminton");
  const [trainingLevel, setTrainingLevel] = useState("Intermediate");
  const [focusArea, setFocusArea] = useState("Overall Performance");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages, loading]);

  const handleSend = async (customText?: string) => {
    const textToSend = customText || input;
    if (!textToSend.trim() || loading) return;

    const newMessages = [...messages, { role: "user", content: textToSend } as Message];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/ai-coach`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          sport: selectedSport,
          level: trainingLevel,
          focusArea
        })
      });

      if (!res.ok) {
        throw new Error("Failed to consult Coach MSA");
      }

      const data = await res.json();
      setMessages((prev) => [...prev, data]);
    } catch (error: any) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          content: "I apologize, but I am currently facing a tactical issue connecting with the cloud telemetry system. Please try again in a moment, athlete!"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    {
      label: "Badminton Warm-Up",
      text: "Can you design a 15-minute quick warm-up drill to practice court speed and footwork?"
    },
    {
      label: "Squash Court T-Command",
      text: "What are the best court drills to master the T-area control during standard rallies?"
    },
    {
      label: "Swimming Lung Stamina",
      text: "How do competitive butterfly stroke swimmers improve lung capacity and breath timing?"
    },
    {
      label: "Gym Lifting Form",
      text: "Suggest a correct progression list to master overhead presses without shoulder strain."
    }
  ];

  return (
    <section className="bg-white py-12 relative min-h-[85vh]">
      <div className="absolute inset-0 sports-grid-pattern opacity-5 pointer-events-none" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        
        {/* Headline */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
          <div className="inline-flex items-center space-x-2 bg-red-50 border border-red-100 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest text-red-600">
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI SPORTS STRATEGY ENGINE</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-black uppercase text-zinc-900 tracking-wide">
            CONSULT <span className="text-red-600">COACH MSA</span>
          </h2>
          <p className="text-zinc-650 text-xs sm:text-sm font-semibold">
            Powered by Gemini with Malwa Sports Academy elite training curriculum. Select your parameters below to refine your consultation!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Strategy Configurator */}
          <div className="lg:col-span-4 bg-zinc-50 border border-zinc-200 p-5 rounded-2xl flex flex-col justify-between space-y-6 shadow-sm">
            <div className="space-y-4">
              <div className="border-b border-zinc-200 pb-2.5">
                <h4 className="font-title text-base font-black uppercase tracking-wider text-zinc-900 flex items-center gap-1.5">
                  <Dumbbell className="h-4.5 w-4.5 text-red-600" />
                  <span>ATHLETE PROFILE</span>
                </h4>
              </div>

              {/* Sport Selector */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                  Target Discipline
                </label>
                <select
                  className="w-full rounded-xl bg-white border border-zinc-250 hover:border-zinc-400 px-3 py-2.5 text-xs font-bold text-zinc-800 focus:outline-none transition cursor-pointer"
                  value={selectedSport}
                  onChange={(e) => setSelectedSport(e.target.value)}
                >
                  {SPORTS_PROGRAMS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Training Level */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                  Performance Level
                </label>
                <div className="grid grid-cols-3 gap-1">
                  {["Beginner", "Intermediate", "Elite"].map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setTrainingLevel(lvl)}
                      className={`py-2 px-1 text-center rounded-lg text-[10px] font-black uppercase border transition cursor-pointer ${
                        trainingLevel === lvl
                          ? "bg-red-600 border-red-500 text-white"
                          : "bg-white border-zinc-250 text-zinc-600 hover:border-zinc-400"
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Focus Area */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                  Focus Area
                </label>
                <div className="space-y-1">
                  {[
                    "Overall Performance",
                    "Biomechanics & Form",
                    "Diet & Sports Nutrition",
                    "Stamina & Recovery Rate",
                    "Mental Game under Pressure"
                  ].map((f) => (
                    <button
                      key={f}
                      onClick={() => setFocusArea(f)}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
                        focusArea === f
                          ? "bg-red-50 border-red-100 text-red-600 shadow-sm"
                          : "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Config metadata footer */}
            <div className="bg-white p-3.5 rounded-xl border border-zinc-200 flex items-center space-x-2 text-[10px] text-zinc-500 font-mono font-bold shadow-sm">
              <Flame className="h-4 w-4 text-red-600 shrink-0 animate-pulse" />
              <span>MSA COACH ENGAGED</span>
            </div>
          </div>

          {/* Right Column: Dynamic Messaging Chat Area */}
          <div className="lg:col-span-8 bg-zinc-50 border border-zinc-200 rounded-2xl flex flex-col h-[520px] overflow-hidden shadow-sm">
            
            {/* Chat header */}
            <div className="bg-white px-4 py-3 border-b border-zinc-200 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="relative">
                  <div className="h-9 w-9 bg-red-600 rounded-full flex items-center justify-center font-display text-base font-black text-white">
                    CO
                  </div>
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-500 border border-white rounded-full" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-zinc-900 uppercase tracking-wider">Coach MSA AI</h4>
                  <span className="block text-[9px] text-zinc-500 uppercase tracking-widest font-bold">Training Science Core</span>
                </div>
              </div>
              
              <button
                onClick={() => setMessages([
                  {
                    role: "model",
                    content: "Hello! I am Coach MSA, your AI Sports Advisor. Whether you want to optimize your badminton drop shots, master squash court positioning, prepare a high-protein champion diet, or train your mind for clutch performance—I am here to coach you. What are we working on today?"
                  }
                ])}
                className="p-1.5 text-zinc-400 hover:text-zinc-600 transition cursor-pointer"
                title="Reset Chat"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} items-start`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                      m.role === "user"
                        ? "bg-red-600 text-white font-black shadow-sm"
                        : "bg-white border border-zinc-200 text-zinc-850 font-semibold whitespace-pre-wrap shadow-sm"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-zinc-200 rounded-2xl px-4 py-3 text-xs text-zinc-500 flex items-center space-x-2 animate-pulse shadow-sm">
                    <span className="h-1.5 w-1.5 bg-red-600 rounded-full animate-bounce" />
                    <span className="h-1.5 w-1.5 bg-red-600 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="h-1.5 w-1.5 bg-red-600 rounded-full animate-bounce [animation-delay:0.4s]" />
                    <span className="font-bold">Coach MSA is analyzing performance metrics...</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Prompts Container */}
            {messages.length === 1 && (
              <div className="px-4 py-2 bg-white border-t border-zinc-200">
                <span className="block text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1.5">
                  Suggested Coaching Requests
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {quickPrompts.map((qp, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(qp.text)}
                      className="text-[10px] font-bold text-zinc-700 bg-white border border-zinc-200 hover:border-zinc-400 hover:text-zinc-900 px-2.5 py-1 rounded-lg transition text-left truncate max-w-full cursor-pointer shadow-sm"
                    >
                      {qp.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Bar */}
            <div className="p-3 bg-white border-t border-zinc-200 flex items-center gap-2">
              <input
                type="text"
                placeholder="Ask about drop shots, heated pool breathing, cardio schedules, stamina mechanics..."
                className="flex-1 rounded-xl bg-zinc-50 border border-zinc-250 hover:border-zinc-400 focus:border-red-600 px-4 py-3 text-xs text-zinc-800 focus:outline-none transition"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSend();
                }}
              />
              <button
                onClick={() => handleSend()}
                disabled={loading || !input.trim()}
                className="h-10 w-10 shrink-0 bg-red-600 text-white hover:bg-red-700 disabled:bg-zinc-100 disabled:text-zinc-400 rounded-xl flex items-center justify-center transition cursor-pointer shadow-md"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
