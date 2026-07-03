import React, { useState, useEffect } from "react";
import { 
  Users, Award, Trophy, ShieldAlert, Plus, Send, CheckCircle2, Clock, 
  TrendingUp, Calendar, AlertTriangle, Bell, UserCheck, Flame, Zap, Heart, Sparkles,
  CheckCircle, XCircle, RefreshCw, Mail, Phone, Edit3, Save, Shield, Trash2
} from "lucide-react";
import { SPORTS_PROGRAMS, COACHES, FEATURED_ATHLETES } from "../data";
import { API_BASE } from "../config";

interface DashboardProps {
  initialRole: "admin" | "coach" | "student" | "parent";
  currentUser: any;
  onProfileUpdate: (updatedUser: any) => void;
}

export default function Dashboard({ initialRole, currentUser, onProfileUpdate }: DashboardProps) {
  const normalizeRole = (role: any): "admin" | "coach" | "student" | "parent" => {
    if (role === "admin" || role === "coach" || role === "student" || role === "parent") {
      return role;
    }
    return "student";
  };

  const [activeRole, setActiveRole] = useState<"admin" | "coach" | "student" | "parent">(
    normalizeRole(currentUser?.role ?? initialRole)
  );

  // Sync role state with authenticated role whenever auth data changes
  useEffect(() => {
    setActiveRole(normalizeRole(currentUser?.role ?? initialRole));
  }, [initialRole, currentUser?.role]);

  // Admin Data states
  const [admissions, setAdmissions] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [loadingAdminData, setLoadingAdminData] = useState(false);
  const [adminError, setAdminError] = useState("");
  const [adminTab, setAdminTab] = useState<"broadcast" | "admissions" | "events" | "contacts">("admissions");

  // Local static states for simulation
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Monsoon Trial Schedule Released", sender: "Admin Office", time: "2 Hours ago", type: "urgent" },
    { id: 2, title: "Dr. Dish Basketball shooting machine calibrated", sender: "Basketball Dept", time: "1 Day ago", type: "info" },
    { id: 3, title: "Diet charts updated by Sports Nutritionist Kavita Roy", sender: "Gym & Fitness", time: "3 Days ago", type: "success" }
  ]);

  const [drills, setDrills] = useState([
    { id: 1, athlete: "Arjun Malviya", drill: "SCATT laser standing alignment (Rifle-shoot)", coach: "Coach Rajendra", status: "In Progress" },
    { id: 2, athlete: "Simran Gill", drill: "45-Minute plyometric explosive lunges", coach: "Coach Satnam", status: "Completed" },
    { id: 3, athlete: "Rishi Rathore", drill: "GPS tracking sprint interval analysis", coach: "Coach Rohan", status: "In Progress" }
  ]);

  // Forms
  const [newNotifTitle, setNewNotifTitle] = useState("");
  const [newDrillAthlete, setNewDrillAthlete] = useState("Arjun Malviya");
  const [newDrillDesc, setNewDrillDesc] = useState("");

  // Profile Edit fields
  const [profileName, setProfileName] = useState(currentUser?.name || "");
  const [profilePhone, setProfilePhone] = useState(currentUser?.phone || "");
  const [profileSport, setProfileSport] = useState(currentUser?.sportsProfile?.sport || "cricket");
  const [profileStreak, setProfileStreak] = useState(currentUser?.sportsProfile?.streak || 12);
  const [profileVelocity, setProfileVelocity] = useState(currentUser?.sportsProfile?.maxVelocity || "32.8 km/h");
  const [profileLeap, setProfileLeap] = useState(currentUser?.sportsProfile?.verticalLeap || "68 cm");
  const [profileCoachingNote, setProfileCoachingNote] = useState(currentUser?.sportsProfile?.coachingNote || "");
  const [profileMode, setProfileMode] = useState(false);
  const [profileFeedback, setProfileFeedback] = useState("");
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // Load and sync edit fields when currentUser shifts
  useEffect(() => {
    if (currentUser) {
      setProfileName(currentUser.name || "");
      setProfilePhone(currentUser.phone || "");
      setProfileSport(currentUser.sportsProfile?.sport || "cricket");
      setProfileStreak(currentUser.sportsProfile?.streak || 12);
      setProfileVelocity(currentUser.sportsProfile?.maxVelocity || "32.8 km/h");
      setProfileLeap(currentUser.sportsProfile?.verticalLeap || "68 cm");
      setProfileCoachingNote(currentUser.sportsProfile?.coachingNote || "");
    }
  }, [currentUser]);

  // Load Admin Data on demand or role shift
  const fetchAdminData = async () => {
    setLoadingAdminData(true);
    setAdminError("");
    try {
      const [admRes, evtRes, conRes] = await Promise.all([
        fetch(`${API_BASE}/api/admissions`),
        fetch(`${API_BASE}/api/event-registrations`),
        fetch(`${API_BASE}/api/contacts`)
      ]);

      if (admRes.ok) {
        const d = await admRes.json();
        setAdmissions(d.data || []);
      }
      if (evtRes.ok) {
        const d = await evtRes.json();
        setEvents(d.data || []);
      }
      if (conRes.ok) {
        const d = await conRes.json();
        setContacts(d.data || []);
      }
    } catch (err: any) {
      setAdminError("Failed to fetch administrative registries: " + err.message);
    } finally {
      setLoadingAdminData(false);
    }
  };

  useEffect(() => {
    if (activeRole === "admin") {
      fetchAdminData();
    }
  }, [activeRole]);

  // Handle Admission (Accept / Deny) Action
  const handleAdmissionAction = async (ticketId: string, status: "Accepted" | "Denied") => {
    try {
      const res = await fetch(`${API_BASE}/api/admissions/action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketId, status })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update Trial Application");

      // Update local state smoothly
      setAdmissions(prev => prev.map(a => a.ticketId === ticketId ? { ...a, status } : a));
    } catch (error: any) {
      alert("Error processing action: " + error.message);
    }
  };

  // Handle Event Seat Booking Action
  const handleEventAction = async (token: string, status: "Accepted" | "Denied") => {
    try {
      const res = await fetch(`${API_BASE}/api/event-register/action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, status })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to clear seat booking status");

      // Update local state smoothly
      setEvents(prev => prev.map(e => e.token === token ? { ...e, status } : e));
    } catch (error: any) {
      alert("Error processing event approval: " + error.message);
    }
  };

  const handleEventDelete = async (token: string) => {
    const confirmed = window.confirm("Delete this event booking permanently?");
    if (!confirmed) return;

    try {
      const res = await fetch(`${API_BASE}/api/event-registrations/${encodeURIComponent(token)}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete booking");

      setEvents(prev => prev.filter(e => e.token !== token));
    } catch (error: any) {
      alert("Unable to delete booking: " + (error.message || "Unknown error"));
    }
  };

  // Handle Contact Inquiry Deletion
  const handleContactDelete = async (contact: any) => {
    const confirmed = window.confirm("Delete this inquiry from admin inbox?");
    if (!confirmed) return;

    try {
      const res = await fetch(`${API_BASE}/api/contacts`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: contact?._id,
          name: contact?.name,
          phone: contact?.phone,
          query: contact?.query,
          createdAt: contact?.createdAt
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete inquiry");

      setContacts((prev) => prev.filter((c) => {
        if (contact?._id) return c._id !== contact._id;
        return !(
          c.name === contact?.name &&
          c.phone === contact?.phone &&
          c.query === contact?.query &&
          String(c.createdAt) === String(contact?.createdAt)
        );
      }));
    } catch (error: any) {
      alert("Unable to delete inquiry: " + (error.message || "Unknown error"));
    }
  };

  // Add Announcement
  const handleAddNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNotifTitle.trim()) return;
    setNotifications([
      {
        id: Date.now(),
        title: newNotifTitle,
        sender: "Academy Director",
        time: "Just now",
        type: "urgent"
      },
      ...notifications
    ]);
    setNewNotifTitle("");
  };

  // Add Drill
  const handleAddDrill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDrillDesc.trim()) return;
    setDrills([
      {
        id: Date.now(),
        athlete: newDrillAthlete,
        drill: newDrillDesc,
        coach: currentUser?.name || "Coach Satnam Gill",
        status: "In Progress"
      },
      ...drills
    ]);
    setNewDrillDesc("");
  };

  // Update Profile on Backend
  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setProfileFeedback("⚠️ Log in first to update profile metrics.");
      return;
    }
    setUpdatingProfile(true);
    setProfileFeedback("");

    try {
      const payload = {
        userId: currentUser._id || currentUser.id,
        name: profileName,
        phone: profilePhone,
        sportsProfile: {
          sport: profileSport,
          streak: Number(profileStreak),
          maxVelocity: profileVelocity,
          verticalLeap: profileLeap,
          coachingNote: profileCoachingNote
        }
      };

      const res = await fetch(`${API_BASE}/api/auth/profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update profile registry");

      onProfileUpdate(data.user);
      setProfileFeedback("✓ Profile successfully synchronized with MSA registers!");
      setProfileMode(false);
      setTimeout(() => setProfileFeedback(""), 5000);
    } catch (error: any) {
      setProfileFeedback("⚠️ Sync error: " + error.message);
    } finally {
      setUpdatingProfile(false);
    }
  };

  return (
    <section className="bg-white min-h-screen py-10 relative">
      <div className="absolute inset-0 sports-grid-pattern opacity-5 pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Role Selector Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-200 pb-6">
          <div>
            <div className="flex items-center space-x-2 text-red-600 font-title text-sm font-black tracking-widest uppercase mb-1">
              <Sparkles className="h-4 w-4" />
              <span>MSA ATHLETE RETRIEVAL SYSTEM</span>
            </div>
            <h2 className="font-display text-4xl font-black uppercase text-zinc-900 tracking-wide">
              MSA INTEGRATED <span className="text-red-600">PORTAL</span>
            </h2>
            {currentUser && (
              <p className="text-xs font-semibold text-zinc-500 uppercase mt-1">
                Authenticated Account: <strong className="text-red-600 font-black">{currentUser.name}</strong> ({currentUser.email}) — Role: <span className="bg-zinc-100 text-zinc-800 px-2 py-0.5 rounded font-black text-[10px]">{currentUser.role.toUpperCase()}</span>
              </p>
            )}
          </div>

          {/* Role lock indicator */}
          <div className="self-start rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Dashboard Access</p>
            <p className="text-xs font-black uppercase tracking-widest text-red-600">
              {activeRole} role only
            </p>
          </div>
        </div>

        {/* PROFILE WORKSPACE FOR USER INDIVIDUAL VIEW */}
        {profileFeedback && (
          <div className={`p-4 rounded-xl font-bold text-xs ${profileFeedback.startsWith("✓") ? "bg-green-50 border border-green-200 text-green-700" : "bg-red-50 border border-red-200 text-red-600"}`}>
            {profileFeedback}
          </div>
        )}

        {/* 1. ADMIN DASHBOARD VIEW */}
        {activeRole === "admin" && (
          <div className="space-y-8 animate-fade-in">
            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              
              <div className="rounded-2xl border border-zinc-200 bg-white p-6 space-y-3 shadow-sm">
                <div className="flex items-center justify-between text-zinc-500 text-xs font-black uppercase">
                  <span>Enrolled Athletes</span>
                  <Users className="h-5 w-5 text-red-600" />
                </div>
                <div className="text-3xl font-black font-title text-zinc-900">528 <span className="text-xs text-green-600 font-bold ml-1">+12%</span></div>
                <p className="text-[11px] text-zinc-400 font-bold uppercase">Across 11 sport programs</p>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-white p-6 space-y-3 shadow-sm">
                <div className="flex items-center justify-between text-zinc-500 text-xs font-black uppercase">
                  <span>Admissions Pool</span>
                  <Award className="h-5 w-5 text-yellow-600" />
                </div>
                <div className="text-3xl font-black font-title text-zinc-900">
                  {admissions.length || 18} <span className="text-xs text-zinc-500 font-black ml-1">TRIALS</span>
                </div>
                <p className="text-[11px] text-zinc-400 font-bold uppercase">Candidate applications logged</p>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-white p-6 space-y-3 shadow-sm">
                <div className="flex items-center justify-between text-zinc-500 text-xs font-black uppercase">
                  <span>Event Reservations</span>
                  <Trophy className="h-5 w-5 text-teal-600" />
                </div>
                <div className="text-3xl font-black font-title text-zinc-900">
                  {events.length || 9} <span className="text-xs text-red-600 font-bold ml-1">SLOTS</span>
                </div>
                <p className="text-[11px] text-zinc-400 font-bold uppercase">Registered spectators</p>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-white p-6 space-y-3 shadow-sm">
                <div className="flex items-center justify-between text-zinc-500 text-xs font-black uppercase">
                  <span>Admissions Rate</span>
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div className="text-3xl font-black font-title text-zinc-900">96.4% <span className="text-xs text-green-600 font-bold ml-1">Stable</span></div>
                <p className="text-[11px] text-zinc-400 font-bold uppercase">High conversion of trials</p>
              </div>

            </div>

            {/* Split layout: Admin Action Boards & Alert Management */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Management Boards - Tabs for Admissions, Events, Contacts */}
              <div className="lg:col-span-8 rounded-2xl border border-zinc-200 bg-white p-6 space-y-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-200 pb-4 gap-4">
                  <h3 className="font-title text-lg font-black uppercase text-zinc-900 flex items-center gap-1.5">
                    <Shield className="h-5 w-5 text-red-600" />
                    <span>Real-time Registry Workspace</span>
                  </h3>

                  {/* Tab switches */}
                  <div className="flex gap-1 bg-zinc-100 p-1 rounded-xl text-xs font-bold border border-zinc-200">
                    <button
                      onClick={() => setAdminTab("admissions")}
                      className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${adminTab === "admissions" ? "bg-white text-red-600 shadow-sm font-black" : "text-zinc-600 hover:text-zinc-900"}`}
                    >
                      Trials ({admissions.length})
                    </button>
                    <button
                      onClick={() => setAdminTab("events")}
                      className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${adminTab === "events" ? "bg-white text-red-600 shadow-sm font-black" : "text-zinc-600 hover:text-zinc-900"}`}
                    >
                      Events ({events.length})
                    </button>
                    <button
                      onClick={() => setAdminTab("contacts")}
                      className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${adminTab === "contacts" ? "bg-white text-red-600 shadow-sm font-black" : "text-zinc-600 hover:text-zinc-900"}`}
                    >
                      Inquiries ({contacts.length})
                    </button>
                  </div>
                </div>

                {loadingAdminData ? (
                  <div className="py-12 text-center text-zinc-500 font-black flex items-center justify-center gap-2 animate-pulse text-xs uppercase">
                    <RefreshCw className="h-4 w-4 animate-spin text-red-600" />
                    Loading Academy Registry Workspace...
                  </div>
                ) : adminError ? (
                  <div className="p-4 bg-red-50 text-red-600 border border-red-100 rounded-xl text-xs font-bold">
                    {adminError}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* ADMISSIONS TAB */}
                    {adminTab === "admissions" && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                          <span>Evaluation Trial Bookings</span>
                          <button onClick={fetchAdminData} className="flex items-center gap-1 text-red-600 hover:underline">
                            <RefreshCw className="h-3 w-3" /> Refresh
                          </button>
                        </div>

                        {admissions.length === 0 ? (
                          <p className="text-xs text-zinc-500 font-bold py-6 text-center">No admissions trials registered yet.</p>
                        ) : (
                          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                            {admissions.map((adm) => (
                              <div key={adm.ticketId} className="p-4 rounded-xl border border-zinc-200 bg-zinc-50 space-y-3 text-xs font-bold text-zinc-700 shadow-sm hover:border-zinc-350 transition-colors">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-200 pb-2">
                                  <div>
                                    <span className="text-zinc-400 text-[10px] uppercase font-black block">TRIAL TICKET</span>
                                    <span className="font-black text-zinc-900 text-sm">{adm.athleteName} ({adm.age} Yrs, {adm.gender})</span>
                                  </div>
                                  <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider self-start sm:self-center ${
                                    adm.status === "Accepted" ? "bg-green-100 text-green-700" :
                                    adm.status === "Denied" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700 animate-pulse"
                                  }`}>
                                    {adm.status}
                                  </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                                  <p><span className="text-zinc-400 uppercase font-bold">Sport Wing:</span> <span className="font-black text-zinc-850 uppercase">{adm.selectedSport}</span></p>
                                  <p><span className="text-zinc-400 uppercase font-bold">Ticket ID:</span> <span className="font-mono text-red-600 font-black">{adm.ticketId}</span></p>
                                  <p><span className="text-zinc-400 uppercase font-bold">Parent Name:</span> <span className="font-black text-zinc-800">{adm.parentName}</span></p>
                                  <p><span className="text-zinc-400 uppercase font-bold">Contact:</span> <span className="font-black text-zinc-800">{adm.contactNumber}</span></p>
                                  <p><span className="text-zinc-400 uppercase font-bold">Email:</span> <span className="font-black text-zinc-800">{adm.emailAddress}</span></p>
                                  <p><span className="text-zinc-400 uppercase font-bold">Scheduled Trial:</span> <span className="font-black text-zinc-800">{adm.trialDate} ({adm.time})</span></p>
                                </div>

                                {adm.medicalNotes && (
                                  <div className="bg-white p-2 rounded border border-zinc-200 text-[10px] text-zinc-500 font-semibold italic">
                                    <strong>Medical Cautions:</strong> "{adm.medicalNotes}"
                                  </div>
                                )}

                                {/* Accept / Deny Action buttons */}
                                <div className="flex gap-2 pt-2 border-t border-zinc-200">
                                  <button
                                    onClick={() => handleAdmissionAction(adm.ticketId, "Accepted")}
                                    disabled={adm.status === "Accepted"}
                                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1 transition ${
                                      adm.status === "Accepted" 
                                        ? "bg-zinc-100 text-zinc-400 cursor-not-allowed" 
                                        : "bg-green-600 hover:bg-green-700 text-white shadow-sm cursor-pointer"
                                    }`}
                                  >
                                    <CheckCircle className="h-3.5 w-3.5" /> Approve Trial
                                  </button>
                                  <button
                                    onClick={() => handleAdmissionAction(adm.ticketId, "Denied")}
                                    disabled={adm.status === "Denied"}
                                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1 transition ${
                                      adm.status === "Denied" 
                                        ? "bg-zinc-100 text-zinc-400 cursor-not-allowed" 
                                        : "bg-red-600 hover:bg-red-700 text-white shadow-sm cursor-pointer"
                                    }`}
                                  >
                                    <XCircle className="h-3.5 w-3.5" /> Deny Request
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* EVENTS TAB */}
                    {adminTab === "events" && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                          <span>Spectator Seat Bookings</span>
                          <button onClick={fetchAdminData} className="flex items-center gap-1 text-red-600 hover:underline">
                            <RefreshCw className="h-3 w-3" /> Refresh
                          </button>
                        </div>

                        {events.length === 0 ? (
                          <p className="text-xs text-zinc-500 font-bold py-6 text-center">No event registrations recorded yet.</p>
                        ) : (
                          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                            {events.map((evt) => (
                              <div key={evt.token} className="p-4 rounded-xl border border-zinc-200 bg-zinc-50 space-y-3 text-xs font-bold text-zinc-700 shadow-sm hover:border-zinc-350 transition-colors">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-200 pb-2">
                                  <div>
                                    <span className="text-zinc-400 text-[10px] uppercase font-black block">SPECTATOR RESERVATION</span>
                                    <span className="font-black text-zinc-900 text-sm">{evt.athleteName}</span>
                                  </div>
                                  <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider self-start sm:self-center ${
                                    evt.status === "Accepted" ? "bg-green-100 text-green-700" :
                                    evt.status === "Denied" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700 animate-pulse"
                                  }`}>
                                    {evt.status || "Pending"}
                                  </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                                  <p><span className="text-zinc-400 uppercase font-bold">Event Name:</span> <span className="font-black text-red-600 uppercase">{evt.eventTitle}</span></p>
                                  <p><span className="text-zinc-400 uppercase font-bold">Tracking Token:</span> <span className="font-mono text-zinc-800 font-black">{evt.token}</span></p>
                                  <p><span className="text-zinc-400 uppercase font-bold">Mobile Number:</span> <span className="font-black text-zinc-800">{evt.mobileNumber}</span></p>
                                  <p><span className="text-zinc-400 uppercase font-bold">Email Address:</span> <span className="font-black text-zinc-800">{evt.email || "Not Provided"}</span></p>
                                </div>

                                {/* Accept / Deny Action buttons */}
                                <div className="flex gap-2 pt-2 border-t border-zinc-200">
                                  <button
                                    onClick={() => handleEventAction(evt.token, "Accepted")}
                                    disabled={evt.status === "Accepted"}
                                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1 transition ${
                                      evt.status === "Accepted" 
                                        ? "bg-zinc-100 text-zinc-400 cursor-not-allowed" 
                                        : "bg-green-600 hover:bg-green-700 text-white shadow-sm cursor-pointer"
                                    }`}
                                  >
                                    <CheckCircle className="h-3.5 w-3.5" /> Approve Slot
                                  </button>
                                  <button
                                    onClick={() => handleEventAction(evt.token, "Denied")}
                                    disabled={evt.status === "Denied"}
                                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1 transition ${
                                      evt.status === "Denied" 
                                        ? "bg-zinc-100 text-zinc-400 cursor-not-allowed" 
                                        : "bg-red-600 hover:bg-red-700 text-white shadow-sm cursor-pointer"
                                    }`}
                                  >
                                    <XCircle className="h-3.5 w-3.5" /> Deny Spectator
                                  </button>
                                  <button
                                    onClick={() => handleEventDelete(evt.token)}
                                    className="px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1 transition bg-zinc-900 hover:bg-zinc-800 text-white shadow-sm cursor-pointer"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" /> Delete
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* CONTACT INQUIRIES TAB */}
                    {adminTab === "contacts" && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                          <span>Visitor Query Inbox</span>
                          <button onClick={fetchAdminData} className="flex items-center gap-1 text-red-600 hover:underline">
                            <RefreshCw className="h-3 w-3" /> Refresh
                          </button>
                        </div>

                        {contacts.length === 0 ? (
                          <p className="text-xs text-zinc-500 font-bold py-6 text-center">No inquiry messages logged.</p>
                        ) : (
                          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                            {contacts.map((c, idx) => (
                              <div key={idx} className="p-4 rounded-xl border border-zinc-200 bg-zinc-50 space-y-2 text-xs font-bold text-zinc-700 shadow-sm">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-200 pb-2">
                                  <div>
                                    <span className="text-zinc-400 text-[10px] uppercase font-black block">VISITOR INQUIRY</span>
                                    <span className="font-black text-zinc-900 text-sm">{c.name}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] text-zinc-500 font-medium">Logged: {new Date(c.createdAt).toLocaleString()}</span>
                                    <button
                                      onClick={() => handleContactDelete(c)}
                                      className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-red-600 hover:bg-red-100 transition"
                                      title="Delete inquiry"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                      Delete
                                    </button>
                                  </div>
                                </div>

                                <p className="bg-white p-3 rounded-xl border border-zinc-200 text-zinc-850 font-medium text-xs leading-relaxed italic">
                                  "{c.query}"
                                </p>

                                <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-zinc-500 pt-1">
                                  <p className="flex items-center gap-1"><Phone className="h-3.5 w-3.5 text-zinc-400" /> {c.phone}</p>
                                  {c.email && (
                                    <p className="flex items-center gap-1"><Mail className="h-3.5 w-3.5 text-zinc-400" /> {c.email}</p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Live Admin Announcement Form */}
              <div className="lg:col-span-4 rounded-2xl border border-zinc-200 bg-white p-6 space-y-4 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="font-title text-lg font-black uppercase text-zinc-900 border-b border-zinc-150 pb-3">
                    Broadcast Alerts
                  </h3>
                  
                  <form onSubmit={handleAddNotification} className="space-y-4 mt-4">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                        Alert Heading / Announcement
                      </label>
                      <textarea
                        required
                        placeholder="e.g. Dynamic laser alignment target calibrated on indoor shooting lanes"
                        className="w-full rounded-xl bg-zinc-50 border border-zinc-250 hover:border-zinc-400 px-3 py-2 text-xs text-zinc-800 focus:outline-none h-24 transition focus:border-red-600"
                        value={newNotifTitle}
                        onChange={(e) => setNewNotifTitle(e.target.value)}
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full rounded-xl bg-red-600 hover:bg-red-700 py-3 text-xs font-black uppercase tracking-widest text-white flex items-center justify-center gap-1.5 shadow cursor-pointer transition-colors"
                    >
                      <Plus className="h-4 w-4" /> BROADCAST TO PORTALS
                    </button>
                  </form>
                </div>

                {/* Local alert list feed */}
                <div className="space-y-2 pt-4 border-t border-zinc-200 mt-4">
                  <span className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                    Current Live Feed
                  </span>
                  
                  <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                    {notifications.map((n) => (
                      <div key={n.id} className="bg-zinc-50 p-2.5 rounded-lg border border-zinc-200 text-xs shadow-sm">
                        <div className="flex justify-between font-black text-red-600 mb-1">
                          <span className="uppercase">{n.sender}</span>
                          <span className="text-[10px] text-zinc-500 font-bold">{n.time}</span>
                        </div>
                        <p className="text-zinc-700 font-bold">{n.title}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* 2. COACH DASHBOARD VIEW */}
        {activeRole === "coach" && (
          <div className="space-y-8 animate-fade-in">
            {/* Profile view switcher button */}
            <div className="flex justify-between items-center">
              <span className="text-xs text-zinc-500 font-bold">Elite Coaching Workspace</span>
              <button
                onClick={() => setProfileMode(!profileMode)}
                className="flex items-center gap-1.5 px-4 py-2 bg-red-50 border border-red-100 hover:bg-red-100/70 rounded-xl text-xs font-black uppercase tracking-widest text-red-600 transition-colors"
              >
                {profileMode ? <Trophy className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
                <span>{profileMode ? "View Coaching Metrics" : "Update My Profile"}</span>
              </button>
            </div>

            {profileMode ? (
              /* PROFILE EDIT COMPONENT */
              <div className="max-w-2xl mx-auto rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 space-y-6 shadow-sm">
                <div className="text-center space-y-1.5 border-b border-zinc-150 pb-4">
                  <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">MSA REGISTRIES</span>
                  <h3 className="font-title text-xl font-black text-zinc-900 uppercase">SYNCHRONIZE COACH PROFILE</h3>
                </div>

                <form onSubmit={handleProfileSave} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-wider">Coach Name</label>
                      <input 
                        type="text" 
                        required
                        className="w-full rounded-xl bg-zinc-50 border border-zinc-250 px-4 py-3 text-xs font-bold text-zinc-800 focus:outline-none focus:border-red-600"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-wider">Contact Number</label>
                      <input 
                        type="tel" 
                        className="w-full rounded-xl bg-zinc-50 border border-zinc-250 px-4 py-3 text-xs font-bold text-zinc-800 focus:outline-none focus:border-red-600"
                        value={profilePhone}
                        onChange={(e) => setProfilePhone(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-wider">Assigned Coaching Note</label>
                    <textarea 
                      className="w-full rounded-xl bg-zinc-50 border border-zinc-250 px-4 py-3 text-xs text-zinc-800 focus:outline-none focus:border-red-600 h-24"
                      value={profileCoachingNote}
                      onChange={(e) => setProfileCoachingNote(e.target.value)}
                      placeholder="Special direct message sent from you to assigned student portfolios."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={updatingProfile}
                    className="w-full rounded-xl bg-red-600 hover:bg-red-700 py-3.5 text-xs font-black uppercase tracking-widest text-white transition-colors flex items-center justify-center gap-1.5"
                  >
                    {updatingProfile ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    <span>{updatingProfile ? "SAVING..." : "COMMIT CHANGES TO DB"}</span>
                  </button>
                </form>
              </div>
            ) : (
              <>
                {/* Quick coaching stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="rounded-2xl border border-zinc-200 bg-white p-6 flex items-center space-x-4 shadow-sm">
                    <div className="p-3.5 bg-red-50 rounded-xl text-red-600">
                      <Flame className="h-6 w-6" />
                    </div>
                    <div>
                      <span className="block text-[10px] text-zinc-400 font-black uppercase tracking-wider">Active Cohort</span>
                      <h4 className="text-lg font-black text-zinc-900 font-title uppercase">Elite U-16 Squad (Indore)</h4>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-zinc-200 bg-white p-6 flex items-center space-x-4 shadow-sm">
                    <div className="p-3.5 bg-yellow-50 rounded-xl text-yellow-600">
                      <Zap className="h-6 w-6" />
                    </div>
                    <div>
                      <span className="block text-[10px] text-zinc-400 font-black uppercase tracking-wider">Stamina Benchmark</span>
                      <h4 className="text-lg font-black text-zinc-900 font-title uppercase">92% Target Completed</h4>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-zinc-200 bg-white p-6 flex items-center space-x-4 shadow-sm">
                    <div className="p-3.5 bg-green-50 rounded-xl text-green-600">
                      <UserCheck className="h-6 w-6" />
                    </div>
                    <div>
                      <span className="block text-[10px] text-zinc-400 font-black uppercase tracking-wider">Today's Attendance</span>
                      <h4 className="text-lg font-black text-zinc-900 font-title uppercase">100% Present</h4>
                    </div>
                  </div>
                </div>

                {/* Split Coach Forms */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  
                  {/* Assign custom target drill */}
                  <div className="lg:col-span-5 rounded-2xl border border-zinc-200 bg-white p-6 space-y-4 shadow-sm">
                    <h3 className="font-title text-lg font-black uppercase text-zinc-900 border-b border-zinc-150 pb-3 flex items-center gap-1.5">
                      <Plus className="h-5 w-5 text-red-600" />
                      <span>Assign Custom Sports Drill</span>
                    </h3>

                    <form onSubmit={handleAddDrill} className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-black text-zinc-450 uppercase tracking-widest">
                          Select Target Athlete
                        </label>
                        <select
                          className="w-full rounded-xl bg-white border border-zinc-250 px-3 py-2.5 text-xs font-bold text-zinc-800 focus:outline-none cursor-pointer"
                          value={newDrillAthlete}
                          onChange={(e) => setNewDrillAthlete(e.target.value)}
                        >
                          {FEATURED_ATHLETES.map((ath) => (
                            <option key={ath.id} value={ath.name}>
                              {ath.name} ({ath.sport})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-black text-zinc-450 uppercase tracking-widest">
                          Drill Specifications / Set Targets
                        </label>
                        <textarea
                          required
                          placeholder="e.g. 50x Wrist rotation releases under bowling speed-tracker guidance"
                          className="w-full rounded-xl bg-white border border-zinc-250 px-3 py-2.5 text-xs text-zinc-850 focus:outline-none h-20 focus:border-red-600"
                          value={newDrillDesc}
                          onChange={(e) => setNewDrillDesc(e.target.value)}
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full rounded-xl bg-red-600 hover:bg-red-700 py-3 text-xs font-black uppercase tracking-widest text-white flex items-center justify-center gap-1.5 shadow cursor-pointer transition-colors"
                      >
                        <Send className="h-4 w-4" /> ASSIGN TECHNICAL DRILL
                      </button>
                    </form>
                  </div>

                  {/* Drill Status tracking list */}
                  <div className="lg:col-span-7 rounded-2xl border border-zinc-200 bg-white p-6 space-y-4 shadow-sm flex flex-col justify-between">
                    <div>
                      <h3 className="font-title text-lg font-black uppercase text-zinc-900 border-b border-zinc-150 pb-3">
                        Today's Athlete Drills Tracking
                      </h3>

                      <div className="space-y-3 max-h-96 overflow-y-auto mt-4 pr-1">
                        {drills.map((d) => (
                          <div key={d.id} className="bg-zinc-50 p-3.5 rounded-xl border border-zinc-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 text-xs shadow-sm hover:border-zinc-300 transition-colors">
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="font-black text-zinc-900 uppercase">{d.athlete}</span>
                                <span className="text-[10px] bg-red-50 border border-red-100 text-red-600 px-2 py-0.5 rounded-full font-black">
                                  Target Set
                                </span>
                              </div>
                              <p className="text-zinc-600 font-semibold mt-1">{d.drill}</p>
                              <span className="block text-[10px] text-zinc-400 font-bold uppercase mt-0.5">Assigned by: {d.coach}</span>
                            </div>

                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider self-start sm:self-center ${
                              d.status === "Completed"
                                ? "bg-green-50 border border-green-100 text-green-600"
                                : "bg-yellow-50 border border-yellow-100 text-yellow-600 animate-pulse"
                            }`}>
                              {d.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {profileCoachingNote && (
                      <div className="mt-4 p-4 border border-zinc-200 rounded-2xl bg-zinc-50 text-xs">
                        <span className="text-[9px] font-black text-red-600 uppercase tracking-widest block mb-1">Your Live Coaching Note Broadcast</span>
                        <p className="font-semibold italic text-zinc-650">"{profileCoachingNote}"</p>
                      </div>
                    )}
                  </div>

                </div>
              </>
            )}
          </div>
        )}

        {/* 3. STUDENT DASHBOARD VIEW */}
        {activeRole === "student" && (
          <div className="space-y-8 animate-fade-in">
            {/* Header control with Profile Trigger */}
            <div className="flex justify-between items-center">
              <span className="text-xs text-zinc-500 font-bold">Personal Evaluation Workspace</span>
              <button
                onClick={() => setProfileMode(!profileMode)}
                className="flex items-center gap-1.5 px-4 py-2 bg-red-50 border border-red-100 hover:bg-red-100/70 rounded-xl text-xs font-black uppercase tracking-widest text-red-600 transition-colors"
              >
                {profileMode ? <Trophy className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
                <span>{profileMode ? "View Athletic Dossier" : "Update My Profile"}</span>
              </button>
            </div>

            {profileMode ? (
              /* STUDENT PROFILE EDIT FORM */
              <div className="max-w-2xl mx-auto rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 space-y-6 shadow-sm">
                <div className="text-center space-y-1.5 border-b border-zinc-150 pb-4">
                  <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">ATHLETE WORKSPACE</span>
                  <h3 className="font-title text-xl font-black text-zinc-900 uppercase">UPDATE MY ATHLETE DOSSIER</h3>
                </div>

                <form onSubmit={handleProfileSave} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-wider">Athlete Full Name</label>
                      <input 
                        type="text" 
                        required
                        className="w-full rounded-xl bg-zinc-50 border border-zinc-250 px-4 py-3 text-xs font-bold text-zinc-800 focus:outline-none focus:border-red-600"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-wider">Contact Phone</label>
                      <input 
                        type="tel" 
                        className="w-full rounded-xl bg-zinc-50 border border-zinc-250 px-4 py-3 text-xs font-bold text-zinc-800 focus:outline-none focus:border-red-600"
                        value={profilePhone}
                        onChange={(e) => setProfilePhone(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-wider">Active Sport Wing</label>
                      <select 
                        className="w-full rounded-xl bg-zinc-50 border border-zinc-250 px-4 py-3 text-xs font-bold text-zinc-800 focus:outline-none focus:border-red-600 cursor-pointer"
                        value={profileSport}
                        onChange={(e) => setProfileSport(e.target.value)}
                      >
                        <option value="cricket">CRICKET</option>
                        <option value="basketball">BASKETBALL</option>
                        <option value="football">FOOTBALL</option>
                        <option value="rifle-shooting">RIFLE SHOOTING</option>
                        <option value="swimming">SWIMMING</option>
                        <option value="athletics">ATHLETICS</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-wider">Max Run Velocity</label>
                      <input 
                        type="text" 
                        className="w-full rounded-xl bg-zinc-50 border border-zinc-250 px-4 py-3 text-xs font-bold text-zinc-800 focus:outline-none focus:border-red-600"
                        value={profileVelocity}
                        onChange={(e) => setProfileVelocity(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-wider">Vertical Leap</label>
                      <input 
                        type="text" 
                        className="w-full rounded-xl bg-zinc-50 border border-zinc-250 px-4 py-3 text-xs font-bold text-zinc-800 focus:outline-none focus:border-red-600"
                        value={profileLeap}
                        onChange={(e) => setProfileLeap(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-wider">Streak Count (Days)</label>
                    <input 
                      type="number" 
                      className="w-full rounded-xl bg-zinc-50 border border-zinc-250 px-4 py-3 text-xs font-bold text-zinc-800 focus:outline-none focus:border-red-600"
                      value={profileStreak}
                      onChange={(e) => setProfileStreak(Number(e.target.value))}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={updatingProfile}
                    className="w-full rounded-xl bg-red-600 hover:bg-red-700 py-3.5 text-xs font-black uppercase tracking-widest text-white transition-colors flex items-center justify-center gap-1.5 shadow"
                  >
                    {updatingProfile ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    <span>{updatingProfile ? "SAVING..." : "COMMIT CHANGES TO REGISTRIES"}</span>
                  </button>
                </form>
              </div>
            ) : (
              <>
                <div className="bg-zinc-50 border border-zinc-200 p-6 sm:p-8 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-black text-red-600 uppercase tracking-widest">ATHLETE DOSSIER</span>
                    <h3 className="font-title text-2xl font-black text-zinc-900 uppercase tracking-wider">
                      {profileName || "Arjun Malviya"} ({profileSport.toUpperCase()} Wing)
                    </h3>
                    <p className="text-zinc-600 text-xs sm:text-sm mt-0.5 font-semibold">
                      Currently prepped for MP Ranji state-level team trials under guidance of Coach Vikram Dev.
                    </p>
                  </div>
                  <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-zinc-200 self-start shadow-sm">
                    <Flame className="h-5 w-5 text-red-600 animate-pulse" />
                    <div>
                      <span className="block text-[9px] text-zinc-400 font-black uppercase tracking-wider">Streak Count</span>
                      <span className="text-xs font-black text-zinc-800">{profileStreak} Days Active Practice</span>
                    </div>
                  </div>
                </div>

                {/* Performance Indicators Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  
                  <div className="bg-white border border-zinc-200 rounded-2xl p-6 text-center space-y-2 shadow-sm">
                    <span className="block text-[10px] text-zinc-400 font-black uppercase">Max Run Velocity</span>
                    <div className="text-3xl font-black font-title text-zinc-900">{profileVelocity}</div>
                    <div className="text-[10px] text-green-600 font-black">Top 3% of Cricket Wing</div>
                  </div>

                  <div className="bg-white border border-zinc-200 rounded-2xl p-6 text-center space-y-2 shadow-sm">
                    <span className="block text-[10px] text-zinc-400 font-black uppercase">Vertical Leap</span>
                    <div className="text-3xl font-black font-title text-zinc-900">{profileLeap}</div>
                    <div className="text-[10px] text-zinc-500 font-black">Slam-dunk prep baseline</div>
                  </div>

                  <div className="bg-white border border-zinc-200 rounded-2xl p-6 text-center space-y-2 shadow-sm">
                    <span className="block text-[10px] text-zinc-400 font-black uppercase">Accurate Delivery %</span>
                    <div className="text-3xl font-black font-title text-zinc-900">88.5%</div>
                    <div className="text-[10px] text-green-600 font-black">Turf nets bowler tracking</div>
                  </div>

                  <div className="bg-white border border-zinc-200 rounded-2xl p-6 text-center space-y-2 shadow-sm">
                    <span className="block text-[10px] text-zinc-400 font-black uppercase">Lung Recovery rate</span>
                    <div className="text-3xl font-black font-title text-zinc-900">45 bpm/min</div>
                    <div className="text-[10px] text-zinc-500 font-black">Excellent sports conditioning</div>
                  </div>

                </div>

                {/* Workout plan & nutrition info side-by-side */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  
                  <div className="lg:col-span-8 rounded-2xl border border-zinc-200 bg-white p-6 space-y-4 shadow-sm">
                    <h3 className="font-title text-lg font-black uppercase text-zinc-900 border-b border-zinc-150 pb-3">
                      Your Assigned Workout Syllabus
                    </h3>

                    <div className="space-y-3">
                      {[
                        { title: "Dynamic Hip Flexor & Groin Drills", duration: "10 mins", stat: "Improves slide saves" },
                        { title: "Bolas Machine Bowler Net Drills", duration: "45 mins", stat: "Practicing facing 135 km/h outswing" },
                        { title: "Slam Ball Exploding Tosses", duration: "15 reps x 3 sets", stat: "Develops shoulder delivery force" },
                        { title: "Post-workout Foam Rolling & Ice-tub Bath", duration: "15 mins", stat: "For rapid muscle fibers recovery" }
                      ].map((item, idx) => (
                        <div key={idx} className="bg-zinc-50 p-3.5 rounded-xl border border-zinc-200 flex items-center justify-between text-xs font-bold text-zinc-700 shadow-sm hover:border-zinc-300 transition-colors">
                          <div className="space-y-0.5">
                            <span className="text-zinc-900 block font-black">{item.title}</span>
                            <span className="text-zinc-400 text-[10px] block uppercase font-bold">{item.stat}</span>
                          </div>
                          <span className="bg-white text-red-600 border border-zinc-200 px-3 py-1.5 rounded-lg text-[10px] font-black">
                            {item.duration}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Nutrition Tracker */}
                  <div className="lg:col-span-4 rounded-2xl border border-zinc-200 bg-white p-6 space-y-4 shadow-sm">
                    <h3 className="font-title text-lg font-black uppercase text-zinc-900 border-b border-zinc-150 pb-3 flex items-center space-x-1.5">
                      <Heart className="h-5 w-5 text-red-600" />
                      <span>Diet & Macros</span>
                    </h3>

                    <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 space-y-3.5 text-xs text-zinc-750 font-bold shadow-sm">
                      <div className="flex justify-between">
                        <span>Target Calories:</span>
                        <span className="font-black text-zinc-900">{currentUser?.sportsProfile?.caloriesTarget || 2800} kcal</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Protein Target:</span>
                        <span className="font-black text-zinc-900">{currentUser?.sportsProfile?.proteinTarget || "140g"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Carbs (Complex):</span>
                        <span className="font-black text-zinc-900">{currentUser?.sportsProfile?.carbsTarget || "320g"}</span>
                      </div>
                      
                      <div className="pt-2 border-t border-zinc-200 space-y-1">
                        <span className="block text-[10px] text-zinc-400 uppercase font-black">Coaches Note</span>
                        <p className="text-[11px] text-zinc-650 italic font-semibold leading-relaxed">
                          "{profileCoachingNote || currentUser?.sportsProfile?.coachingNote || "Ensure taking adequate creatine-monohydrate post Bowling net drill to minimize soreness."}"
                        </p>
                      </div>
                    </div>
                  </div>

                </div>
              </>
            )}
          </div>
        )}

        {/* EVENT BOOKINGS MANAGEMENT - STUDENT & PARENT VIEW */}
        {(activeRole === "student" || activeRole === "parent") && (
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
              <h3 className="font-title text-lg font-black uppercase text-zinc-900 flex items-center gap-1.5">
                <Trophy className="h-5 w-5 text-red-600" />
                <span>My Event Bookings</span>
              </h3>
              <button onClick={fetchAdminData} className="flex items-center gap-1 text-red-600 hover:underline text-xs font-black">
                <RefreshCw className="h-3 w-3" /> Refresh
              </button>
            </div>

            {loadingAdminData ? (
              <div className="py-6 text-center text-zinc-500 font-black flex items-center justify-center gap-2 animate-pulse text-xs uppercase">
                <RefreshCw className="h-4 w-4 animate-spin text-red-600" />
                Loading bookings...
              </div>
            ) : (
              <div className="space-y-3">
                {events.length === 0 ? (
                  <p className="text-xs text-zinc-500 font-bold py-6 text-center">No event bookings found. Visit the Events page to register.</p>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {events
                      .filter((evt) => {
                        const isOwner = (currentUser?.email && evt.email?.toLowerCase() === currentUser.email.toLowerCase())
                          || (currentUser?._id && evt.userId === currentUser._id);
                        return isOwner;
                      })
                      .map((evt) => (
                        <div key={evt.token} className="p-4 rounded-xl border border-zinc-200 bg-zinc-50 space-y-3 text-xs font-bold text-zinc-700 shadow-sm hover:border-zinc-300 transition-colors">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-200 pb-2">
                            <div>
                              <span className="text-zinc-400 text-[10px] uppercase font-black block">EVENT BOOKING</span>
                              <span className="font-black text-zinc-900 text-sm">{evt.eventTitle}</span>
                            </div>
                            <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider self-start sm:self-center ${
                              evt.status === "Accepted" ? "bg-green-100 text-green-700" :
                              evt.status === "Denied" ? "bg-red-100 text-red-700" :
                              evt.status === "Cancelled" ? "bg-zinc-100 text-zinc-700" : "bg-yellow-100 text-yellow-700 animate-pulse"
                            }`}>
                              {evt.status || "Pending"}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                            <p><span className="text-zinc-400 uppercase font-bold">Booking Token:</span> <span className="font-mono text-zinc-800 font-black">{evt.token}</span></p>
                            <p><span className="text-zinc-400 uppercase font-bold">Mobile Registered:</span> <span className="font-black text-zinc-800">{evt.mobileNumber}</span></p>
                          </div>

                          {evt.status !== "Denied" && evt.status !== "Cancelled" && (
                            <div className="flex gap-2 pt-2 border-t border-zinc-200">
                              <button
                                onClick={async () => {
                                  if (window.confirm("Cancel this event booking?")) {
                                    try {
                                      const res = await fetch(`${API_BASE}/api/event-register/cancel`, {
                                        method: "POST",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({
                                          token: evt.token,
                                          email: currentUser?.email,
                                          userId: currentUser?._id
                                        })
                                      });
                                      if (!res.ok) throw new Error("Failed to cancel");
                                      fetchAdminData();
                                    } catch (error: any) {
                                      alert("Unable to cancel: " + error.message);
                                    }
                                  }
                                }}
                                className="px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1 transition bg-red-100 hover:bg-red-200 text-red-600 shadow-sm cursor-pointer"
                              >
                                <XCircle className="h-3.5 w-3.5" /> Cancel Booking
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    {events.filter((evt) => {
                      const isOwner = (currentUser?.email && evt.email?.toLowerCase() === currentUser.email.toLowerCase())
                        || (currentUser?._id && evt.userId === currentUser._id);
                      return isOwner;
                    }).length === 0 && (
                      <p className="text-xs text-zinc-500 font-bold py-4 text-center">No bookings under your account.</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 4. PARENT DASHBOARD VIEW */}
        {activeRole === "parent" && (
          <div className="space-y-8 animate-fade-in">
            <div className="bg-zinc-50 border border-zinc-200 p-6 sm:p-8 rounded-2xl shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <span className="text-xs font-black text-red-600 uppercase tracking-widest">PARENT PORTAL</span>
                <h3 className="font-title text-2xl font-black text-zinc-900 uppercase tracking-wider">
                  {currentUser?.name || "Sanjay Malviya"} (Parent of {profileName || "Arjun Malviya"})
                </h3>
                <p className="text-zinc-600 text-xs sm:text-sm mt-0.5 font-semibold">
                  Monitor and verify your ward's athletic development logs, attendance logs, and fee balances directly.
                </p>
              </div>

              <button
                onClick={() => setProfileMode(!profileMode)}
                className="flex items-center gap-1.5 px-4 py-2 bg-red-50 border border-red-100 hover:bg-red-100/70 rounded-xl text-xs font-black uppercase tracking-widest text-red-600 transition-colors self-start sm:self-center"
              >
                {profileMode ? <Trophy className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
                <span>{profileMode ? "View Ward Attendance" : "Update Contact Profile"}</span>
              </button>
            </div>

            {profileMode ? (
              /* PARENT PROFILE EDIT FORM */
              <div className="max-w-2xl mx-auto rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 space-y-6 shadow-sm">
                <div className="text-center space-y-1.5 border-b border-zinc-150 pb-4">
                  <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">PARENT PROFILE</span>
                  <h3 className="font-title text-xl font-black text-zinc-900 uppercase">UPDATE PARENT INFORMATION</h3>
                </div>

                <form onSubmit={handleProfileSave} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-wider">Parent Full Name</label>
                      <input 
                        type="text" 
                        required
                        className="w-full rounded-xl bg-zinc-50 border border-zinc-250 px-4 py-3 text-xs font-bold text-zinc-800 focus:outline-none focus:border-red-600"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-wider">Contact Phone</label>
                      <input 
                        type="tel" 
                        className="w-full rounded-xl bg-zinc-50 border border-zinc-250 px-4 py-3 text-xs font-bold text-zinc-800 focus:outline-none focus:border-red-600"
                        value={profilePhone}
                        onChange={(e) => setProfilePhone(e.target.value)}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={updatingProfile}
                    className="w-full rounded-xl bg-red-600 hover:bg-red-700 py-3.5 text-xs font-black uppercase tracking-widest text-white transition-colors flex items-center justify-center gap-1.5 shadow"
                  >
                    {updatingProfile ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    <span>{updatingProfile ? "SAVING..." : "COMMIT CHANGES"}</span>
                  </button>
                </form>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                
                {/* Ward Attendance progress circle visual */}
                <div className="lg:col-span-4 rounded-2xl border border-zinc-200 bg-white p-6 text-center flex flex-col justify-between space-y-4 shadow-sm">
                  <div className="space-y-1">
                    <h4 className="font-title text-base font-black uppercase text-zinc-900">
                      Ward Class Attendance
                    </h4>
                    <p className="text-zinc-400 text-[10px] uppercase font-bold">Calculated for current summer term</p>
                  </div>

                  {/* Animated progress circle using beautiful pure SVG */}
                  <div className="relative flex items-center justify-center py-4">
                    <svg className="w-36 h-36 transform -rotate-90">
                      <circle
                        cx="72"
                        cy="72"
                        r="60"
                        className="text-zinc-100"
                        strokeWidth="10"
                        stroke="currentColor"
                        fill="transparent"
                      />
                      <circle
                        cx="72"
                        cy="72"
                        r="60"
                        className="text-red-600"
                        strokeWidth="10"
                        strokeDasharray="377"
                        strokeDashoffset="18" // 95% progress
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-black font-title text-zinc-900">95.2%</span>
                      <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-black">Present Rate</span>
                    </div>
                  </div>

                  <div className="bg-zinc-50 p-3.5 rounded-xl border border-zinc-200 text-xs text-zinc-650 font-semibold space-y-1 text-left shadow-sm">
                    <div className="flex justify-between">
                      <span>Total sessions scheduled:</span>
                      <span className="font-black text-zinc-950">42 Practice nets</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sessions Attended:</span>
                      <span className="font-black text-zinc-950">40 nets</span>
                    </div>
                  </div>
                </div>

                {/* Fee clearance and coach communication feedback block */}
                <div className="lg:col-span-8 rounded-2xl border border-zinc-200 bg-white p-6 space-y-6 flex flex-col justify-between shadow-sm">
                  <div className="space-y-4">
                    <h4 className="font-title text-lg font-black uppercase text-zinc-900 border-b border-zinc-200 pb-3">
                      Administrative & Academic Overview
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold">
                      <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 space-y-1 shadow-sm">
                        <span className="block text-zinc-400 uppercase tracking-wider text-[10px]">MSA Subscription Tier</span>
                        <span className="text-sm font-black text-zinc-900 uppercase block">High-Performance Residency Track</span>
                        <span className="text-[10px] text-green-600 font-black block">✓ Fully Cleared (Till Sept 2026)</span>
                      </div>

                      <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 space-y-1 shadow-sm">
                        <span className="block text-zinc-400 uppercase tracking-wider text-[10px]">Medical Status Report</span>
                        <span className="text-sm font-black text-zinc-800 block">No Active Injury Warnings</span>
                        <span className="text-[10px] text-zinc-500 font-bold block">Cleared by Academy Physio</span>
                      </div>
                    </div>
                  </div>

                  {/* Direct feedback from Coaches */}
                  <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 text-xs text-zinc-700 text-left space-y-2 shadow-sm">
                    <span className="block text-[10px] font-black text-red-600 uppercase tracking-widest">
                      Direct Message from Coach Vikram Dev
                    </span>
                    <p className="italic text-zinc-600 font-bold leading-relaxed">
                      "{profileCoachingNote || currentUser?.sportsProfile?.coachingNote || "Arjun's bat-speed has registered a significant increase to 42mph, but we are working on maintaining a stable head stance when facing rapid outswings. He shows excellent work ethic. Highly pleased."}"
                    </p>
                  </div>
                </div>

              </div>
            )}
          </div>
        )}

      </div>
    </section>
  );
}
