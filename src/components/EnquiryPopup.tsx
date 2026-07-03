import React, { useState, useEffect } from "react";
import { API_BASE } from "../config";
import { SPORTS_PROGRAMS } from "../data";
import "./EnquiryPopup.css";

export default function EnquiryPopup() {
  const [open, setOpen] = useState(false);
  const [course, setCourse] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setCourse("");
    setMessage("");
  };

  useEffect(() => {
    try {
      const seen = window.localStorage.getItem("msa_enquiry_seen");
      if (!seen) {
        setOpen(true);
        window.localStorage.setItem("msa_enquiry_seen", "1");
      }
    } catch (err) {
      setOpen(true);
    }
  }, []);

  // close on Escape
  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim() || !phone.trim() || !email.trim()) {
      setError("Please complete your name, email, and phone.");
      return;
    }

    setSubmitting(true);
    try {
      const normalizedQuery = message.trim() || `General enquiry for ${course || "admissions"}`;
      const res = await fetch(`${API_BASE}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          query: normalizedQuery,
          email: email.trim(),
          course: course.trim()
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Failed to send enquiry");

      setSuccess(true);
      resetForm();
      setTimeout(() => {
        setSuccess(false);
        setOpen(false);
      }, 2400);
    } catch (err: any) {
      setError(err.message || "Unable to send enquiry at this time. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`msa-enquiry-wrapper ${open ? "open" : ""}`} onClick={() => open && setOpen(false)}>
      {open && <div className="msa-enquiry-backdrop" />}

      <button
        className="msa-enquiry-tab"
        aria-label={open ? "Close enquiry form" : "Open enquiry form"}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((s) => !s);
        }}
      >
        <span className="msa-enquiry-tab-text">ENQUIRE NOW</span>
      </button>

      <aside className={`msa-enquiry-panel ${open ? "open" : ""}`} aria-hidden={!open} onClick={(e) => e.stopPropagation()}>
        <div className="msa-enquiry-header">
          <div>
            <h3>Admissions Open 2026-27</h3>
            <p className="msa-enquiry-subtitle">Get a quick response from our admissions desk</p>
          </div>
          <button
            type="button"
            className="msa-enquiry-close"
            aria-label="Close enquiry form"
            onClick={() => setOpen(false)}
          >
            ×
          </button>
        </div>

        {success ? (
          <div className="msa-enquiry-success">
            ✓ Sent — our admissions desk will contact you shortly.
          </div>
        ) : (
          <form className="msa-enquiry-form" onSubmit={handleSubmit}>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name *"
              className="msa-input"
              required
            />

            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your Email Address *"
              className="msa-input"
              type="email"
              required
            />

            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Your Mobile Number *"
              className="msa-input"
              required
            />

            <select className="msa-input" value={course} onChange={(e) => setCourse(e.target.value)}>
              <option value="">-- Select Course --</option>
              {SPORTS_PROGRAMS.map((s) => (
                <option key={s.id} value={s.name}>{s.name}</option>
              ))}
            </select>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Your Message (If any)"
              className="msa-textarea"
            />

            <div className="msa-consent">By clicking on Submit Enquiry, I allow all communication from Malwa Sports Academy.</div>

            {error && <div className="msa-enquiry-error">{error}</div>}

            <button type="submit" className="msa-enquiry-submit" disabled={submitting}>
              {submitting ? "Sending..." : "SEND ENQUIRY"}
            </button>
          </form>
        )}
      </aside>
    </div>
  );
}
