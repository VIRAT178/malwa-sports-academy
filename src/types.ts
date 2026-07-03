import React from "react";
import { 
  Trophy, Activity, Dribbble, Compass, Flame, Zap, Gauge, Swords, Waves, Crosshair, Dumbbell, Target
} from "lucide-react";

export interface SportProgram {
  id: string;
  name: string;
  tagline: string;
  bgImage: string;
  bgPosition?: string; // custom focal point for background cover
  athleteImage: string; // fallback illustration style gradient/svg representation
  color: string; // hex or tailwind classes
  description: string;
  ageGroups: string[];
  methodology: string[];
  schedule: string;
  coaches: string[];
  facilities: string[];
}

export function getSportIcon(sportId: string, className = "h-5 w-5 text-red-600") {
  const normId = sportId.toLowerCase();
  if (normId.includes("cricket")) {
    return React.createElement(Trophy, { className });
  } else if (normId.includes("football")) {
    return React.createElement(Activity, { className });
  } else if (normId.includes("basketball")) {
    return React.createElement(Dribbble, { className });
  } else if (normId.includes("volleyball")) {
    return React.createElement(Compass, { className });
  } else if (normId.includes("badminton")) {
    return React.createElement(Flame, { className });
  } else if (normId.includes("tabletennis") || normId.includes("table-tennis") || normId.includes("table tennis")) {
    return React.createElement(Zap, { className });
  } else if (normId.includes("athletics") || normId.includes("track")) {
    return React.createElement(Gauge, { className });
  } else if (normId.includes("kabaddi")) {
    return React.createElement(Swords, { className });
  } else if (normId.includes("swimming") || normId.includes("pool") || normId.includes("aqua")) {
    return React.createElement(Waves, { className });
  } else if (normId.includes("shooting")) {
    return React.createElement(Crosshair, { className });
  } else if (normId.includes("gym") || normId.includes("fitness") || normId.includes("crossfit") || normId.includes("pilates")) {
    return React.createElement(Dumbbell, { className });
  } else if (normId.includes("squash") || normId.includes("tennis") || normId.includes("padel") || normId.includes("carrom") || normId.includes("indoor")) {
    return React.createElement(Target, { className });
  }
  return React.createElement(Trophy, { className });
}

export interface Coach {
  id: string;
  name: string;
  role: string;
  specialty: string;
  experience: string;
  bio: string;
  image: string;
  achievements: string[];
}

export interface Athlete {
  id: string;
  name: string;
  sport: string;
  achievement: string;
  image: string;
  level: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  sport: string;
  description: string;
  registrationOpen: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  sport: string;
  year: string;
  athleteName: string;
  medal: "Gold" | "Silver" | "Bronze" | "Championship";
  description: string;
}

export type DashboardRole = "student" | "parent" | "coach" | "admin";
