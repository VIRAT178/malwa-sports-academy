import mongoose from "mongoose";

let isConnected = false;

// Mock database for when MONGODB_URI is not set
export interface InMemoryDb {
  admissions: any[];
  contacts: any[];
  events: any[];
  users: any[];
}

export const inMemoryDb: InMemoryDb = {
  admissions: [],
  contacts: [],
  events: [],
  users: []
};

export async function connectToDatabase() {
  if (isConnected) return true;

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error("❌ MONGODB_URI is not defined. This server requires a MongoDB connection. Please set MONGODB_URI in your .env and restart.");
    // Exit early to avoid accidentally running with in-memory fallback
    process.exit(1);
    return false;
  }

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log("✅ Successfully connected to MongoDB via Mongoose.");
    return true;
  } catch (error: any) {
    console.error("❌ Failed to connect to MongoDB:", error.message);
    return false;
  }
}

// ---------------- MODEL SCHEMAS ----------------

// 1. User Schema (supporting Roles: admin, coach, student, parent)
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "coach", "student", "parent"], default: "student" },
  phone: { type: String, default: "" },
  resetPasswordToken: { type: String, default: "" },
  resetPasswordExpires: { type: Date },
  createdAt: { type: Date, default: Date.now },
  
  // Custom profiles for users
  sportsProfile: {
    sport: { type: String, default: "cricket" },
    streak: { type: Number, default: 0 },
    maxVelocity: { type: String, default: "28 km/h" },
    verticalLeap: { type: String, default: "55 cm" },
    accuracy: { type: String, default: "80%" },
    lungRecovery: { type: String, default: "50 bpm" },
    caloriesTarget: { type: Number, default: 2500 },
    proteinTarget: { type: String, default: "120g" },
    carbsTarget: { type: String, default: "280g" },
    coachingNote: { type: String, default: "Stay hydrated and complete post-practice drills." },
    attendanceSessions: { type: Number, default: 35 },
    attendanceAttended: { type: Number, default: 32 },
  }
});

// 2. Admission Schema
const AdmissionSchema = new mongoose.Schema({
  ticketId: { type: String, required: true, unique: true },
  athleteName: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  parentName: { type: String, required: true },
  contactNumber: { type: String, required: true },
  emailAddress: { type: String, required: true },
  selectedSport: { type: String, required: true },
  skillLevel: { type: String, required: true },
  medicalNotes: { type: String, default: "" },
  trialDate: { type: String, required: true },
  time: { type: String, default: "4:30 PM" },
  location: { type: String, default: "Malwa Sports Academy Arena, Sanwer Road, Indore" },
  status: { type: String, enum: ["Pending", "Accepted", "Denied"], default: "Pending" },
  createdAt: { type: Date, default: Date.now }
});

// 3. Contact Inquiry Schema
const ContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, default: "" },
  course: { type: String, default: "" },
  query: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// 4. Event Registration Schema
const EventRegistrationSchema = new mongoose.Schema({
  athleteName: { type: String, required: true },
  eventTitle: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  email: { type: String, default: "", lowercase: true },
  userId: { type: String, default: "" },
  token: { type: String, required: true },
  status: { type: String, enum: ["Pending", "Accepted", "Denied", "Cancelled"], default: "Pending" },
  createdAt: { type: Date, default: Date.now }
});

export const User = (mongoose.models.User || mongoose.model("User", UserSchema)) as any;
export const Admission = (mongoose.models.Admission || mongoose.model("Admission", AdmissionSchema)) as any;
export const Contact = (mongoose.models.Contact || mongoose.model("Contact", ContactSchema)) as any;
export const EventRegistration = (mongoose.models.EventRegistration || mongoose.model("EventRegistration", EventRegistrationSchema)) as any;

export async function seedDatabase() {
  const crypto = await import("crypto");
  function hash(pwd: string) {
    return crypto.createHash("sha256").update(pwd).digest("hex");
  }
  const defaultSportsProfile = {
    sport: "cricket",
    streak: 12,
    maxVelocity: "28 km/h",
    verticalLeap: "55 cm",
    accuracy: "85%",
    lungRecovery: "48 bpm",
    caloriesTarget: 2500,
    proteinTarget: "120g",
    carbsTarget: "280g",
    coachingNote: "Focus on stamina builds and post-practice hydration routines.",
    attendanceSessions: 35,
    attendanceAttended: 32
  };

  // Seed users: admin and coach credentials can be provided via environment variables
  const adminEmail = (process.env.MSA_SEED_ADMIN_EMAIL || "director@malwasportsacademy.org").toLowerCase();
  const adminName = process.env.MSA_SEED_ADMIN_NAME || "Director Satnam Singh";
  const adminPasswordPlain = process.env.MSA_SEED_ADMIN_PASSWORD || "msa123";
  const adminPhone = process.env.MSA_SEED_ADMIN_PHONE || "+91 98930 12000";

  const coachEmail = (process.env.MSA_SEED_COACH_EMAIL || "coach.satnam@malwasportsacademy.org").toLowerCase();
  const coachName = process.env.MSA_SEED_COACH_NAME || "Coach Satnam Singh";
  const coachPasswordPlain = process.env.MSA_SEED_COACH_PASSWORD || "msa123";
  const coachPhone = process.env.MSA_SEED_COACH_PHONE || "+91 91000 55000";

  const seedUsers = [
    {
      name: adminName,
      email: adminEmail,
      password: hash(adminPasswordPlain),
      role: "admin",
      phone: adminPhone,
      sportsProfile: defaultSportsProfile
    },
    {
      name: coachName,
      email: coachEmail,
      password: hash(coachPasswordPlain),
      role: "coach",
      phone: coachPhone,
      sportsProfile: {
        ...defaultSportsProfile,
        sport: "badminton"
      }
    }
  ];

  const dbConnected = mongoose.connection.readyState === 1;

  if (dbConnected) {
    try {
      for (const u of seedUsers) {
        const existing = await User.findOne({ email: u.email.toLowerCase() });
        if (!existing) {
          const userToSave: any = { ...u };
          delete userToSave._id; // Let Mongo generate _id
          const user = new User(userToSave);
          await user.save();
          console.log(`Seeded Mongo user: ${u.email}`);
        }
      }
    } catch (err: any) {
      console.error("Failed to seed MongoDB:", err.message);
    }
  }
}

