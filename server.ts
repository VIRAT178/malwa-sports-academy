import express from "express";
import path from "path";
import dotenv from "dotenv";
import fs from "fs";
import crypto from "crypto";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";
import mongoose from "mongoose";
import { connectToDatabase, Admission, Contact, EventRegistration, User, inMemoryDb, seedDatabase } from "./server/db";
import { 
  sendAdmissionConfirmationEmail, 
  sendContactInquiryEmail, 
  sendEventRegistrationNotificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendEmail
} from "./server/mailer";

// Helper for password hashing
function hashPassword(pwd: string) {
  return crypto.createHash("sha256").update(pwd).digest("hex");
}

dotenv.config();

const app = express();
const PORT = 3000;

// Enable CORS for frontend requests (such as from Vercel deployment)
app.use(cors());

// Set up physical uploads directory
const UPLOADS_DIR = path.join(process.cwd(), "uploads");
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Support large payloads for base64 images
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Static route for custom uploaded files
app.use("/uploads", express.static(UPLOADS_DIR));

// Retrieve list of custom uploaded images
app.get("/api/uploads", (req, res) => {
  try {
    const files = fs.readdirSync(UPLOADS_DIR);
    const imageExtensions = [".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"];
    const images = files
      .filter(file => imageExtensions.includes(path.extname(file).toLowerCase()))
      .map(file => `/uploads/${file}`);
    res.json({ success: true, images });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to list uploads: " + error.message });
  }
});

// Upload a new image (base64)
app.post("/api/upload", (req, res) => {
  try {
    const { name, data } = req.body;
    if (!name || !data) {
      return res.status(400).json({ error: "Missing name or data payload" });
    }

    const safeName = path.basename(name).replace(/[^a-zA-Z0-9_.-]/g, "_");
    
    const matches = data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ error: "Invalid base64 image data format" });
    }

    const buffer = Buffer.from(matches[2], "base64");
    const filePath = path.join(UPLOADS_DIR, safeName);
    fs.writeFileSync(filePath, buffer);

    res.json({ success: true, url: `/uploads/${safeName}` });
  } catch (error: any) {
    res.status(500).json({ error: "Upload failed: " + error.message });
  }
});

// Delete an uploaded image
app.delete("/api/upload", (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: "Missing image URL" });
    }
    const filename = path.basename(url);
    const filePath = path.join(UPLOADS_DIR, filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return res.json({ success: true });
    }
    res.status(404).json({ error: "File not found" });
  } catch (error: any) {
    res.status(500).json({ error: "Deletion failed: " + error.message });
  }
});

// Initialize Gemini Client
let ai: GoogleGenAI | null = null;
function getGeminiClient() {
  if (!ai) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not defined. AI features will fall back to simulation mode.");
      return null;
    }
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return ai;
}

// AI Coach endpoint
app.post("/api/ai-coach", async (req, res) => {
  const { messages, sport, level, focusArea } = req.body;
  
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Invalid messages array" });
  }

  const client = getGeminiClient();
  if (!client) {
    // Elegant fallback simulation if API key is not present in the preview sandbox yet
    const lastUserMessage = messages[messages.length - 1]?.content || "Hello";
    return res.json({
      role: "model",
      content: `[Demo Mode] MSA Coach: Thank you for your question about ${sport || "sports training"} at ${level || "intermediate"} level. Since the Gemini API key is currently configuring, here is a professional coaching tip: Focus on core stability, agility drills, and maintaining a high-performance routine. For your target focus of "${focusArea || "overall fitness"}", keep consistent. How can I help you adjust your daily plan?`
    });
  }

  try {
    // Build context-rich prompt for Gemini Sports Coach
    const systemInstruction = `You are Coach Malwa, the head AI Sports Advisor at Malwa Sports Academy (MSA) in Sanwer Road, Indore. 
MSA's tagline is "Train. Perform. Achieve." You are elite, professional, encouraging, and highly technical.
You specialize in training methodologies, dietary guidelines, mental coaching, and strategic performance for:
Cricket, Football, Basketball, Volleyball, Badminton, Table Tennis, Athletics, Kabaddi, Swimming, Rifle Shooting, and Gym & Fitness.

Current Athlete Profile:
- Sport: ${sport || "General Athletics"}
- Training Level: ${level || "Intermediate"}
- Focus Area: ${focusArea || "Overall Performance"}

Provide actionable, elite, professional advice. Keep answers structured, highly motivating, and concise. Format with markdown (bold, lists). Do not refer to yourself as a general language model. You are Coach Malwa.`;

    // Map conversation messages to Gemini's contents format
    const contents = messages.map(m => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }]
    }));

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    res.json({
      role: "model",
      content: response.text || "I apologize, I couldn't generate a response. Please try again."
    });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: "Failed to connect with Coach Malwa: " + (error.message || "Unknown error") });
  }
});

// ==================== AUTHENTICATION ENDPOINTS ====================

// 1. Register User
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: "Missing required fields for user registration." });
    }

    const hashed = hashPassword(password);
    const dbConnected = mongoose.connection.readyState === 1;

    // Default rich performance profile based on sports selection
    const defaultSportsProfile = {
      sport: "cricket",
      streak: 0,
      maxVelocity: "28 km/h",
      verticalLeap: "55 cm",
      accuracy: "80%",
      lungRecovery: "50 bpm",
      caloriesTarget: 2500,
      proteinTarget: "120g",
      carbsTarget: "280g",
      coachingNote: "Welcome to the academy! Complete your setup profile to get custom coaching sheets.",
      attendanceSessions: 35,
      attendanceAttended: 32
    };

    const newUserRecord = {
      _id: dbConnected ? undefined : "usr_" + Math.floor(100000 + Math.random() * 900000),
      name,
      email: email.toLowerCase(),
      password: hashed,
      role,
      phone: phone || "",
      sportsProfile: defaultSportsProfile,
      createdAt: new Date()
    };

    let savedUser: any;

    if (dbConnected) {
      const existing = await User.findOne({ email: email.toLowerCase() });
      if (existing) {
        return res.status(400).json({ error: "Email address is already registered." });
      }

      const user = new User(newUserRecord);
      await user.save();
      savedUser = user.toObject();
    } else {
      const existing = inMemoryDb.users.find(u => u.email === email.toLowerCase());
      if (existing) {
        return res.status(400).json({ error: "Email address is already registered." });
      }
      inMemoryDb.users.push(newUserRecord);
      savedUser = newUserRecord;
    }

    // Dispatch welcome email
    try {
      await sendWelcomeEmail(savedUser);
    } catch (mailError: any) {
      console.error("Failed to dispatch welcome email:", mailError.message);
    }

    // Remove password before sending back
    delete savedUser.password;
    res.status(201).json({ success: true, user: savedUser, dbPersisted: dbConnected });
  } catch (error: any) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Failed to register new account: " + error.message });
  }
});

// 2. Login User
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Please enter both email and password." });
    }

    const hashed = hashPassword(password);
    const dbConnected = mongoose.connection.readyState === 1;
    let foundUser: any = null;

    if (dbConnected) {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (user) {
        foundUser = user.toObject();
      }
    } else {
      foundUser = inMemoryDb.users.find(u => u.email === email.toLowerCase());
    }

    if (!foundUser || foundUser.password !== hashed) {
      return res.status(401).json({ error: "Invalid email or security passcode. Please check credentials." });
    }

    // Delete sensitive password hash
    delete foundUser.password;
    res.json({ success: true, user: foundUser, dbPersisted: dbConnected });
  } catch (error: any) {
    console.error("Login endpoint error:", error);
    res.status(500).json({ error: "Failed to authenticate account: " + error.message });
  }
});

// 3. Forgot Password Path
app.post("/api/auth/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email address is required." });
    }

    const token = crypto.randomBytes(24).toString("hex");
    const expires = new Date(Date.now() + 3600000); // 1 hour validity
    const dbConnected = mongoose.connection.readyState === 1;
    let userExists = false;

    if (dbConnected) {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (user) {
        user.resetPasswordToken = token;
        user.resetPasswordExpires = expires;
        await user.save();
        userExists = true;
      }
    } else {
      const idx = inMemoryDb.users.findIndex(u => u.email === email.toLowerCase());
      if (idx !== -1) {
        inMemoryDb.users[idx].resetPasswordToken = token;
        inMemoryDb.users[idx].resetPasswordExpires = expires;
        userExists = true;
      }
    }

    if (!userExists) {
      // For security, do not explicitly reveal if email is unregistered
      return res.json({ success: true, message: "If registered, a passcode recovery token has been emailed." });
    }

    // Build reset path link
    const host = req.get("host");
    const protocol = req.headers["x-forwarded-proto"] || req.protocol;
    const resetLink = `${protocol}://${host}/?view=reset-password&token=${token}`;

    try {
      await sendPasswordResetEmail(email, resetLink);
    } catch (mailError: any) {
      console.error("SMTP Forgot Password email fail:", mailError.message);
    }

    res.json({ success: true, message: "Recovery credentials dispatched successfully." });
  } catch (error: any) {
    console.error("Forgot Password error:", error);
    res.status(500).json({ error: "Failed to create reset token: " + error.message });
  }
});

// 4. Reset Password Verification
app.post("/api/auth/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ error: "Missing recovery token or new passcode value." });
    }

    const hashed = hashPassword(newPassword);
    const dbConnected = mongoose.connection.readyState === 1;
    let resetSuccess = false;

    if (dbConnected) {
      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
      });

      if (user) {
        user.password = hashed;
        user.resetPasswordToken = "";
        user.resetPasswordExpires = undefined;
        await user.save();
        resetSuccess = true;
      }
    } else {
      const idx = inMemoryDb.users.findIndex(u => 
        u.resetPasswordToken === token && 
        new Date(u.resetPasswordExpires) > new Date()
      );

      if (idx !== -1) {
        inMemoryDb.users[idx].password = hashed;
        inMemoryDb.users[idx].resetPasswordToken = "";
        inMemoryDb.users[idx].resetPasswordExpires = undefined;
        resetSuccess = true;
      }
    }

    if (!resetSuccess) {
      return res.status(400).json({ error: "Password recovery token has expired or is invalid." });
    }

    res.json({ success: true, message: "Security passcode reset successfully completed." });
  } catch (error: any) {
    console.error("Reset Password error:", error);
    res.status(500).json({ error: "Failed to reset password: " + error.message });
  }
});

// 5. Update Profile
app.post("/api/auth/profile", async (req, res) => {
  try {
    const { userId, name, phone, sportsProfile } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID parameter is missing." });
    }

    const dbConnected = mongoose.connection.readyState === 1;
    let updatedUser: any = null;

    if (dbConnected) {
      const user = await User.findById(userId);
      if (user) {
        if (name) user.name = name;
        if (phone) user.phone = phone;
        if (sportsProfile) {
          user.sportsProfile = { ...user.sportsProfile, ...sportsProfile };
        }
        await user.save();
        updatedUser = user.toObject();
      }
    } else {
      const idx = inMemoryDb.users.findIndex(u => u._id === userId);
      if (idx !== -1) {
        if (name) inMemoryDb.users[idx].name = name;
        if (phone) inMemoryDb.users[idx].phone = phone;
        if (sportsProfile) {
          inMemoryDb.users[idx].sportsProfile = { 
            ...inMemoryDb.users[idx].sportsProfile, 
            ...sportsProfile 
          };
        }
        updatedUser = inMemoryDb.users[idx];
      }
    }

    if (!updatedUser) {
      return res.status(404).json({ error: "User registry profile not found." });
    }

    delete updatedUser.password;
    res.json({ success: true, user: updatedUser, dbPersisted: dbConnected });
  } catch (error: any) {
    console.error("Profile update error:", error);
    res.status(500).json({ error: "Failed to update member profile: " + error.message });
  }
});


// ==================== ATHLETE ADMISSIONS ENDPOINTS ====================
app.post("/api/admissions", async (req, res) => {
  try {
    const { 
      athleteName, age, gender, parentName, contactNumber, emailAddress, 
      selectedSport, skillLevel, medicalNotes 
    } = req.body;

    if (!athleteName || !age || !parentName || !contactNumber || !emailAddress || !selectedSport) {
      return res.status(400).json({ error: "Required fields are missing" });
    }

    // Generate ticket properties
    const ticketId = "MSA-TRIAL-" + Math.floor(100000 + Math.random() * 900000);
    const trialDateObj = new Date();
    trialDateObj.setDate(trialDateObj.getDate() + 3);
    const trialDate = trialDateObj.toLocaleDateString("en-US", {
      weekday: "long", year: "numeric", month: "long", day: "numeric"
    });
    const time = "4:30 PM";
    const location = "Malwa Sports Academy Arena, Sanwer Road, Indore";

    const admissionRecord = {
      ticketId,
      athleteName,
      age: parseInt(age),
      gender,
      parentName,
      contactNumber,
      emailAddress,
      selectedSport,
      skillLevel: skillLevel || "Beginner",
      medicalNotes: medicalNotes || "",
      trialDate,
      time,
      location,
      status: "Pending",
      createdAt: new Date()
    };

    let savedTicket = admissionRecord;

    // Check if MongoDB is connected and operational
    const dbConnected = mongoose.connection.readyState === 1;
    if (dbConnected) {
      const admission = new Admission(admissionRecord);
      await admission.save();
      savedTicket = admission.toObject();
    } else {
      inMemoryDb.admissions.push(admissionRecord);
    }

    // Dispatch SMTP notification emails
    try {
      await sendAdmissionConfirmationEmail(savedTicket);
    } catch (mailError: any) {
      console.error("Failed to dispatch admission emails:", mailError.message);
    }

    res.status(201).json({ success: true, ticket: savedTicket, dbPersisted: dbConnected });
  } catch (error: any) {
    console.error("Admissions endpoint error:", error);
    res.status(500).json({ error: "Failed to process trial application: " + error.message });
  }
});

app.get("/api/admissions", async (req, res) => {
  try {
    const dbConnected = mongoose.connection.readyState === 1;
    if (dbConnected) {
      const list = await Admission.find().sort({ createdAt: -1 });
      return res.json({ success: true, source: "mongodb", data: list });
    } else {
      return res.json({ success: true, source: "memory", data: [...inMemoryDb.admissions].reverse() });
    }
  } catch (error: any) {
    res.status(500).json({ error: "Failed to fetch admissions: " + error.message });
  }
});

// Action to Accept, Deny or Update Admission Status
app.post("/api/admissions/action", async (req, res) => {
  try {
    const { ticketId, status } = req.body;
    if (!ticketId || !status) {
      return res.status(400).json({ error: "Missing ticketId or status parameter." });
    }

    const dbConnected = mongoose.connection.readyState === 1;
    let targetRecord: any = null;

    if (dbConnected) {
      const record = await Admission.findOne({ ticketId });
      if (record) {
        record.status = status;
        await record.save();
        targetRecord = record.toObject();
      }
    } else {
      const idx = inMemoryDb.admissions.findIndex(a => a.ticketId === ticketId);
      if (idx !== -1) {
        inMemoryDb.admissions[idx].status = status;
        targetRecord = inMemoryDb.admissions[idx];
      }
    }

    if (!targetRecord) {
      return res.status(404).json({ error: "Admission trial record not found." });
    }

    // Send confirmation email of update to parent
    try {
      const mailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e4e4e7; border-radius: 12px; padding: 25px;">
          <h2 style="color: #dc2626; uppercase;">Evaluation Ticket Status Updated</h2>
          <p>Hello <strong>${targetRecord.parentName}</strong>,</p>
          <p>The status of the high-performance sports trial for <strong>${targetRecord.athleteName}</strong> has been updated:</p>
          <div style="background-color: #f9fafb; border: 1px solid #e4e4e7; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>Ticket ID:</strong> ${targetRecord.ticketId}</p>
            <p><strong>Selected Discipline:</strong> ${targetRecord.selectedSport.toUpperCase()}</p>
            <p><strong>Trial Date:</strong> ${targetRecord.trialDate}</p>
            <p><strong>New Status:</strong> <span style="color: #dc2626; font-weight: bold; text-transform: uppercase;">${targetRecord.status}</span></p>
          </div>
          <p>If you have any queries, please direct them to admissions@malwasports.com.</p>
        </div>
      `;
      await sendEmail({
        to: targetRecord.emailAddress,
        subject: `Trial Request Status: ${targetRecord.status} [Malwa Sports Academy]`,
        html: mailHtml
      });
    } catch (e: any) {
      console.error("Admissions status email error:", e.message);
    }

    res.json({ success: true, data: targetRecord });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to update admission status: " + error.message });
  }
});


// ==================== CONTACT INQUIRY ENDPOINTS ====================
app.post("/api/contact", async (req, res) => {
  try {
    const { name, phone, query, email, course } = req.body;

    if (!name || !phone || !query) {
      return res.status(400).json({ error: "Missing name, phone, or query text" });
    }

    const contactRecord = { name, phone, query, email: email || "", course: course || "", createdAt: new Date() };
    const dbConnected = mongoose.connection.readyState === 1;

    if (dbConnected) {
      const contact = new Contact(contactRecord);
      await contact.save();
    } else {
      inMemoryDb.contacts.push(contactRecord);
    }

    // Dispatch SMTP notification to both admin and inquirer
    try {
      await sendContactInquiryEmail(contactRecord);
    } catch (mailError: any) {
      console.error("Failed to dispatch contact inquiry email:", mailError.message);
    }

    res.json({ success: true, dbPersisted: dbConnected });
  } catch (error: any) {
    console.error("Contact endpoint error:", error);
    res.status(500).json({ error: "Failed to record inquiry: " + error.message });
  }
});

app.get("/api/contacts", async (req, res) => {
  try {
    const dbConnected = mongoose.connection.readyState === 1;
    if (dbConnected) {
      const list = await Contact.find().sort({ createdAt: -1 });
      return res.json({ success: true, source: "mongodb", data: list });
    } else {
      return res.json({ success: true, source: "memory", data: [...inMemoryDb.contacts].reverse() });
    }
  } catch (error: any) {
    res.status(500).json({ error: "Failed to fetch contact inquiries: " + error.message });
  }
});


// ==================== EVENT REGISTRATION ENDPOINTS ====================
app.post("/api/event-register", async (req, res) => {
  try {
    const { athleteName, eventTitle, mobileNumber, email } = req.body;

    if (!athleteName || !eventTitle || !mobileNumber) {
      return res.status(400).json({ error: "Missing required registration parameters" });
    }

    // Generate reporting token
    const token = "MSA-EVT-" + Math.floor(100000 + Math.random() * 900000);
    const eventRecord = { 
      athleteName, 
      eventTitle, 
      mobileNumber, 
      email: email || "", 
      token, 
      status: "Pending", 
      createdAt: new Date() 
    };

    const dbConnected = mongoose.connection.readyState === 1;
    if (dbConnected) {
      const eventReg = new EventRegistration(eventRecord);
      await eventReg.save();
    } else {
      inMemoryDb.events.push(eventRecord);
    }

    // Dispatch SMTP email notification (to admin, and athlete if email is provided)
    try {
      await sendEventRegistrationNotificationEmail(eventRecord);
    } catch (mailError: any) {
      console.error("Failed to dispatch event registration email:", mailError.message);
    }

    res.json({ success: true, token, dbPersisted: dbConnected });
  } catch (error: any) {
    console.error("Event registration error:", error);
    res.status(500).json({ error: "Failed to reserve event slot: " + error.message });
  }
});

app.get("/api/event-registrations", async (req, res) => {
  try {
    const dbConnected = mongoose.connection.readyState === 1;
    if (dbConnected) {
      const list = await EventRegistration.find().sort({ createdAt: -1 });
      return res.json({ success: true, source: "mongodb", data: list });
    } else {
      return res.json({ success: true, source: "memory", data: [...inMemoryDb.events].reverse() });
    }
  } catch (error: any) {
    res.status(500).json({ error: "Failed to fetch event bookings: " + error.message });
  }
});

// Action to Accept, Deny or Update Event Seat
app.post("/api/event-register/action", async (req, res) => {
  try {
    const { token, status } = req.body;
    if (!token || !status) {
      return res.status(400).json({ error: "Missing tracking token or status parameters." });
    }

    const dbConnected = mongoose.connection.readyState === 1;
    let targetRecord: any = null;

    if (dbConnected) {
      const record = await EventRegistration.findOne({ token });
      if (record) {
        record.status = status;
        await record.save();
        targetRecord = record.toObject();
      }
    } else {
      const idx = inMemoryDb.events.findIndex(e => e.token === token);
      if (idx !== -1) {
        inMemoryDb.events[idx].status = status;
        targetRecord = inMemoryDb.events[idx];
      }
    }

    if (!targetRecord) {
      return res.status(404).json({ error: "Event registration record not found." });
    }

    // Dispatch SMTP notification if athlete email is available
    if (targetRecord.email) {
      try {
        const mailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e4e4e7; border-radius: 12px; padding: 25px;">
            <h2 style="color: #dc2626; text-transform: uppercase;">Event Seat Clearance Update</h2>
            <p>Hello <strong>${targetRecord.athleteName}</strong>,</p>
            <p>Your seat booking status for the event <strong>${targetRecord.eventTitle}</strong> has been updated:</p>
            <div style="background-color: #f9fafb; border: 1px solid #e4e4e7; padding: 15px; border-radius: 8px; margin: 15px 0;">
              <p><strong>Tracking Code:</strong> ${targetRecord.token}</p>
              <p><strong>Event:</strong> ${targetRecord.eventTitle}</p>
              <p><strong>New Status:</strong> <span style="color: #dc2626; font-weight: bold; text-transform: uppercase;">${targetRecord.status}</span></p>
            </div>
            <p>Please present your updated token dashboard profile at the active sports wing gates.</p>
          </div>
        `;
        await sendEmail({
          to: targetRecord.email,
          subject: `Event Reservation Status: ${targetRecord.status} [Malwa Sports Academy]`,
          html: mailHtml
        });
      } catch (e: any) {
        console.error("Event update email notification fail:", e.message);
      }
    }

    res.json({ success: true, data: targetRecord });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to update event status: " + error.message });
  }
});

// Configure Vite or static assets depending on environment
async function setupServer() {
  // Initialize Database Connection (Attempt connection without blocking boot)
  await connectToDatabase();
  await seedDatabase();

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Malwa Sports Academy Server running on http://localhost:${PORT}`);
  });
}

setupServer();

