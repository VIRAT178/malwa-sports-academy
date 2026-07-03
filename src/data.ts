import { SportProgram, Coach, Athlete, Event, Achievement } from "./types";

// Import custom uploaded images
import logoImg from "./assets/images/logo.png";
import academyBuildingImg from "./assets/images/academy_building.jpg";
import athleticsImg from "./assets/images/athletics.jpg";
import badmintonImg from "./assets/images/badminton.jpg";
import basketballImg from "./assets/images/basketball.jpg";
import carromImg from "./assets/images/carrom.jpg";
import cricketImg from "./assets/images/cricket.jpg";
import footballImg from "./assets/images/football.jpg";
import gymImg from "./assets/images/gym.jpg";
import kabaddiImg from "./assets/images/kabaddi.jpg";
import shootingImg from "./assets/images/shooting.jpg";
import swimmingImg from "./assets/images/swimming.jpg";
import tableTennisImg from "./assets/images/table_tennis.jpg";
import volleyballImg from "./assets/images/volleyball.jpg";
import squashImg from "./assets/images/squash.jpg";

import coach1Img from "./assets/images/coach1.jpg";
import coach2Img from "./assets/images/coach2.jpg";
import coach3Img from "./assets/images/coach3.jpg";
import coach4Img from "./assets/images/coach4.jpg";

import athlete1Img from "./assets/images/athlete1.jpg";
import athlete2Img from "./assets/images/athlete2.jpg";
import athlete3Img from "./assets/images/athlete3.jpg";
import athlete4Img from "./assets/images/athlete4.jpg";

import galleryBadminton2Img from "./assets/images/gallery_badminton2.jpg";
import galleryBadminton3Img from "./assets/images/gallery_badminton3.jpg";
import galleryBadminton4Img from "./assets/images/gallery_badminton4.jpg";

import galleryGym2Img from "./assets/images/gallery_gym2.jpg";
import galleryGym3Img from "./assets/images/gallery_gym3.jpg";
import galleryGym4Img from "./assets/images/gallery_gym4.jpg";

import gallerySwimming2Img from "./assets/images/gallery_swimming2.jpg";
import gallerySwimming3Img from "./assets/images/gallery_swimming3.jpg";
import gallerySwimming4Img from "./assets/images/gallery_swimming4.jpg";

import gallerySquash1Img from "./assets/images/gallery_squash1.jpg";
import gallerySquash2Img from "./assets/images/gallery_squash2.jpg";
import gallerySquash3Img from "./assets/images/gallery_squash3.jpg";
import gallerySquash4Img from "./assets/images/gallery_squash4.jpg";

import cafe1Img from "./assets/images/cafe1.jpg";
import cafe2Img from "./assets/images/cafe2.jpg";
import cafe3Img from "./assets/images/cafe3.jpg";

export { logoImg, academyBuildingImg };

export const SPORTS_PROGRAMS: SportProgram[] = [
  {
    id: "cricket",
    name: "Cricket",
    tagline: "Elite Cricket Academy",
    bgImage: cricketImg,
    bgPosition: "center center",
    athleteImage: "🏏",
    color: "from-blue-600 to-indigo-950",
    description: "Train with certified coaches on world-class turf wickets and concrete practice nets under advanced bowling machines.",
    ageGroups: ["Under 12 (Foundational Stars)", "Under 17 (Elite Prospects)", "Adult Leagues & Corporate Clubs"],
    methodology: [
      "Continuous bowler telemetry and ball speed tracking.",
      "Real-time video analysis of batting postures and wrist alignment.",
      "Precision spin-bowling machine drills."
    ],
    schedule: "Mon to Sat: 6:00 AM - 10:00 AM & 4:00 PM - 8:30 PM",
    coaches: ["Coach R. P. Singh (NIS Certified)", "Coach Anil Shah (Ranji Trophy Veteran)"],
    facilities: ["3 Turf Wickets & 4 Cement Nets", "Merlyn Spin Bowling Machine", "High-Definition Speed Cameras"]
  },
  {
    id: "football",
    name: "Football",
    tagline: "Dynamic Football Development",
    bgImage: footballImg,
    bgPosition: "center center",
    athleteImage: "⚽",
    color: "from-emerald-600 to-teal-950",
    description: "Master your ball control, tactical positioning, and agility on our FIFA-standard synthetic grass turf.",
    ageGroups: ["Grassroots (Age 6-11)", "Junior League Squad (Age 12-16)", "Elite Senior Academy"],
    methodology: [
      "GPS tracking vest analysis for speed & high-intensity sprints.",
      "Small-sided situational tactical drills.",
      "Precision shooting and defensive zonal positioning maps."
    ],
    schedule: "Mon to Sat: 6:00 AM - 9:00 AM & 5:00 PM - 8:30 PM",
    coaches: ["Coach Satyam Roy (A-License Coach)", "Coach David Fernandes (Former I-League Player)"],
    facilities: ["FIFA-Spec AstroTurf pitch", "Speed Gun Analytics Equipment", "Target Sacks & Training Wall"]
  },
  {
    id: "basketball",
    name: "Basketball",
    tagline: "Championship Hoops Training",
    bgImage: basketballImg,
    bgPosition: "center center",
    athleteImage: "🏀",
    color: "from-amber-600 to-orange-950",
    description: "Unleash your vertical jump and master ball handling on our indoor maple-wood basketball courts.",
    ageGroups: ["Minis Academy (Age 8-12)", "Under-18 Performance", "Adult Pro-Leagues"],
    methodology: [
      "Precision dribble patterns and stepback shooting arcs.",
      "Plyometric vertical jump training scripts.",
      "Full-court transition and defensive rotation simulations."
    ],
    schedule: "Mon to Sat: 6:30 AM - 9:30 AM & 4:30 PM - 9:00 PM",
    coaches: ["Coach Vikram Yadav (FIBA certified)", "Coach Pooja Sharma (Former National Captain)"],
    facilities: ["Maple Wood Shock-Absorb Court", "Shot-Arc Training Shootaway Machine", "Digital Playback Screen Systems"]
  },
  {
    id: "volleyball",
    name: "Volleyball",
    tagline: "High-Flying Volleyball Action",
    bgImage: volleyballImg,
    bgPosition: "center center",
    athleteImage: "🏐",
    color: "from-sky-500 to-indigo-950",
    description: "Spike, block, and set your way to dominance in our custom indoor volleyball arena with anti-injury flooring.",
    ageGroups: ["Under 14 (Rising Stars)", "Under 19 (Elite Spikers)", "Adult Corporate Recs"],
    methodology: [
      "Serve-receive accuracy drills and reaction timers.",
      "Spike-jump takeoff mechanics and block-reach elevation.",
      "Defensive dig and recovery positioning patterns."
    ],
    schedule: "Mon to Sat: 7:00 AM - 10:00 AM & 4:00 PM - 8:00 PM",
    coaches: ["Coach Gurdial Singh (NIS Diploma)", "Coach Neha Patel (Inter-State Champion)"],
    facilities: ["Gerflor Shock-Absorb Volleyball Court", "Height-Adjustable Pro Net Rigs", "Agility Reaction Lights"]
  },
  {
    id: "badminton",
    name: "Badminton",
    tagline: "BWF-Standard Court Action",
    bgImage: badmintonImg,
    bgPosition: "center 40%",
    athleteImage: "🏸",
    color: "from-blue-600 to-indigo-950",
    description: "Enjoy 7 world-class BWF standard badminton courts for an unparalleled playing experience.",
    ageGroups: ["Under 10 (Foundational)", "Under 15 (Pro-Junior)", "Adult Academy / Open Matchplay"],
    methodology: [
      "Multi-shuttle speed drills for accelerated court reflex correction.",
      "Footwork biomechanics matching international BWF standards.",
      "Continuous matchplay pressure simulations and tactical positioning."
    ],
    schedule: "Mon to Sat: 6:00 AM - 10:00 PM | Sun: 8:00 AM - 12:00 PM",
    coaches: ["Coach Satnam Singh (BWF Certified)", "Coach Amitesh Sharma (Former State Champion)"],
    facilities: ["7 BWF-Standard Synthetic Courts", "Automatic Shuttle Feeders", "High-Intensity LED Court Lighting"]
  },
  {
    id: "table-tennis",
    name: "Table Tennis",
    tagline: "Pro Spin Table Tennis",
    bgImage: tableTennisImg,
    bgPosition: "center center",
    athleteImage: "🏓",
    color: "from-blue-500 to-sky-950",
    description: "Train on ITTF approved table tennis setups with professional high-speed camera feedback and spin coaching.",
    ageGroups: ["Under 12 (Junior Spinners)", "Under 18 (Performance Squad)", "Adult Elite Leagues"],
    methodology: [
      "Speed response drills matching international ITTF reaction metrics.",
      "Paddle grip and dynamic wrist spin articulation tracking.",
      "Continuous rapid-fire table tennis ball machine training."
    ],
    schedule: "Mon to Sat: 7:00 AM - 9:00 PM | Sun: 9:00 AM - 1:00 PM",
    coaches: ["Coach Harmeet Desai (ITTF Certified)", "Coach Pooja Roy (National Medalist)"],
    facilities: ["6 ITTF-Approved Professional Tables", "Robotic Ball-Feeder Machines", "Frictionless Synthetic Flooring"]
  },
  {
    id: "athletics",
    name: "Athletics",
    tagline: "Track & Field Speed",
    bgImage: athleticsImg,
    bgPosition: "center center",
    athleteImage: "🏃",
    color: "from-red-500 to-stone-900",
    description: "Develop elite level sprinting, starting block reactions, middle distance pacing, and high jump physics on our professional track lanes.",
    ageGroups: ["Junior Sprinters (Age 10-15)", "Elite Varsity Athletics", "Marathon & Endurance Cadre"],
    methodology: [
      "Starting block biomechanics and sprint acceleration curve analysis.",
      "Stride rate optimization and stride length calculations.",
      "Cardiovascular VO2 max stamina assessment routines."
    ],
    schedule: "Mon to Sat: 5:00 AM - 8:30 AM & 5:00 PM - 8:00 PM",
    coaches: ["Coach Shiv Pratap (National Track Expert)", "Coach Kavita Rawat (NIS Athletics coach)"],
    facilities: ["Professional 400m Synthetic Running Track Lanes", "Strobotape Gait Trackers", "Laser Timing Gates"]
  },
  {
    id: "kabaddi",
    name: "Kabaddi",
    tagline: "Raider & Defender Power",
    bgImage: kabaddiImg,
    bgPosition: "center center",
    athleteImage: "🤼",
    color: "from-orange-600 to-amber-950",
    description: "Master the art of raiding, blocking, catching, and ankle-holding on safe high-density kabaddi mats.",
    ageGroups: ["Youth Kabaddi League (Age 12-16)", "Elite Performance Squad", "Adult Tournament Cadre"],
    methodology: [
      "Foot touch speed drills and escaping hand touches.",
      "Defensive chains coordination and ankle grab lock triggers.",
      "Breath suspension holding (Kabaddi chant) aerobic lung expansion."
    ],
    schedule: "Mon to Sat: 6:00 AM - 9:00 AM & 4:30 PM - 8:00 PM",
    coaches: ["Coach Satnam Singh (Senior Pro Kabaddi Advisor)", "Coach Balwan Singh (Medalist)"],
    facilities: ["Pro-Kabaddi Level EVA Foam Mats", "Impact Resistance Protective Rigs", "Continuous High-Def Match Capture"]
  },
  {
    id: "swimming",
    name: "Swimming",
    tagline: "All-Weather Heated Pool",
    bgImage: swimmingImg,
    bgPosition: "center center",
    athleteImage: "🏊",
    color: "from-cyan-600 to-blue-950",
    description: "Dive into our semi-Olympic-sized, all-weather (heated) indoor swimming pool for a refreshing swim.",
    ageGroups: ["Stroke Correction (All Ages)", "Competitive Swimming Squad", "Recreational & Family Sessions"],
    methodology: [
      "Underwater high-speed stroke mechanics tracking.",
      "Resistance parachute drag and hydrodynamics tuning.",
      "Aerobic and anaerobic stamina building modules."
    ],
    schedule: "Mon to Sat: 6:00 AM - 10:00 PM | Sun: 8:00 AM - 12:00 PM",
    coaches: ["Coach Sophia Ray (ASCA Level 4)", "Coach Jagtar Singh (NIS Diploma)"],
    facilities: ["Semi-Olympic Indoor Heated Pool", "Anti-Wave Lane Boundaries", "Underwater Video Feedback Rigs"]
  },
  {
    id: "rifle-shooting",
    name: "Rifle Shooting",
    tagline: "Precision Target Focus",
    bgImage: shootingImg,
    bgPosition: "center center",
    athleteImage: "🎯",
    color: "from-zinc-700 to-zinc-950",
    description: "Develop high-focus calm, pulse synchronization, and target precision on our ISSF-standard indoor shooting range.",
    ageGroups: ["Foundational Focus (Age 12+)", "Competitive Rifle Academy", "Elite ISSF Candidates"],
    methodology: [
      "Pulse synchronization and trigger pull biomechanics.",
      "Posture stabilization and target hold alignment.",
      "Laser-guided aiming analytics tracking systems."
    ],
    schedule: "Mon to Sat: 9:00 AM - 1:00 PM & 3:00 PM - 7:00 PM",
    coaches: ["Coach Prakash Nair (Former National Coach)", "Coach Anshul Sen (ISSF Rifle Medalist)"],
    facilities: ["10m Air Rifle Electronic Target Range", "Digital Scatt Training Systems", "High-Focus Ergo Stands"]
  },
  {
    id: "gym-fitness",
    name: "Gym & Fitness",
    tagline: "Cutting-Edge Matrix Fitness",
    bgImage: gymImg,
    bgPosition: "center center",
    athleteImage: "🏋️",
    color: "from-zinc-750 to-zinc-950",
    description: "Experience Central India's finest GYM equipped with top-of-the-line MATRIX equipment for a premium workout.",
    ageGroups: ["Youth Strength (Age 14+)", "High-Performance Athletic Conditioning", "Adult Personal Training"],
    methodology: [
      "Personalized muscle symmetry & structural strength planning.",
      "CSCS-certified sport-specific injury prevention.",
      "Computerized body mass tracking and meal guides."
    ],
    schedule: "Mon to Sat: 5:00 AM - 10:00 PM | Sun: 8:00 AM - 12:00 PM",
    coaches: ["Coach Hardik Patel (CSCS)", "Coach Kavita Roy (Nutritionist)"],
    facilities: ["Matrix Cardiovascular Station", "Elite Lifting Platform", "Bio-Impedance Trackers"]
  },
  {
    id: "indoor-games-carrom",
    name: "Indoor Games (Carrom)",
    tagline: "Precision Rebound Angles",
    bgImage: carromImg,
    bgPosition: "center center",
    athleteImage: "🎲",
    color: "from-amber-700 to-stone-900",
    description: "Perfect your pocketing, stroke control, and rebound angles on professional champion-grade carrom setups.",
    ageGroups: ["Juniors Carrom Cadre", "Open Singles/Doubles Clubs", "Senior Recreation Matches"],
    methodology: [
      "Friction calculations and slider speed calibration.",
      "Double pocket stroke angles and defense wall layouts.",
      "Extreme focus and finger flick response drills."
    ],
    schedule: "Mon to Sat: 10:00 AM - 9:00 PM",
    coaches: ["Coach Ritesh Soni (AICF Certified)", "Coach Pooja Roy (National Champion)"],
    facilities: ["6 Champion-Grade Siscaa Carrom Boards", "Frictionless French Talc Setups", "Professional LED Table Spotlights"]
  }
];

export const ALL_CLUB_SPORTS = [
  { id: "cricket", name: "Cricket", icon: "🏏" },
  { id: "football", name: "Football", icon: "⚽" },
  { id: "basketball", name: "Basketball", icon: "🏀" },
  { id: "volleyball", name: "Volleyball", icon: "🏐" },
  { id: "badminton", name: "Badminton", icon: "🏸" },
  { id: "table-tennis", name: "Table Tennis", icon: "🏓" },
  { id: "athletics", name: "Athletics", icon: "🏃" },
  { id: "kabaddi", name: "Kabaddi", icon: "🤼" },
  { id: "swimming", name: "Swimming", icon: "🏊" },
  { id: "rifle-shooting", name: "Rifle Shooting", icon: "🎯" },
  { id: "gym-fitness", name: "Gym & Fitness", icon: "💪" },
  { id: "indoor-games-carrom", name: "Indoor Games (Carrom)", icon: "🎲" }
];

export const EXCLUSIVE_PACKAGES = [
  {
    id: "cricket-pkg",
    title: "CRICKET",
    image: cricketImg,
    year: "2026",
    link: "cricket"
  },
  {
    id: "football-pkg",
    title: "FOOTBALL",
    image: footballImg,
    year: "2026",
    link: "football"
  },
  {
    id: "swimming-pkg",
    title: "SWIMMING",
    image: swimmingImg,
    year: "2026",
    link: "swimming"
  },
  {
    id: "gym-pkg",
    title: "GYM & FITNESS",
    image: gymImg,
    year: "2026",
    link: "gym-fitness"
  },
  {
    id: "badminton-pkg",
    title: "BADMINTON",
    image: badmintonImg,
    year: "2026",
    link: "badminton"
  },
  {
    id: "tabletennis-pkg",
    title: "TABLE TENNIS",
    image: tableTennisImg,
    year: "2026",
    link: "table-tennis"
  }
];

export const COACHES: Coach[] = [
  {
    id: "1",
    name: "Coach Satnam Singh",
    role: "Head Badminton Coach",
    specialty: "Court Speed & Smash Biomechanics",
    experience: "5+ Years",
    bio: "BWF certified elite badminton director who coached multiple national-level badminton competitors.",
    image: coach1Img,
    achievements: ["Guided 6 athletes to Junior National Gold.", "Former Inter-State MVP Singles winner."]
  },
  {
    id: "2",
    name: "Coach Suman Rawat",
    role: "Head Squash Coach",
    specialty: "T-Command Tactics & Reflex Timing",
    experience: "2+ Years",
    bio: "WSF certified professional squash consultant, expert in high-elevation conditioning modules.",
    image: coach2Img,
    achievements: ["Led local Academy players to 5 regional trophies.", "Telemetry speed analytics coordinator."]
  },
  {
    id: "3",
    name: "Coach Sophia Ray",
    role: "Swimming Director",
    specialty: "ASCA Stroke Calibration & Hydrodynamics",
    experience: "3+ Years",
    bio: "ASCA certified elite swimming head coach with high-repetition stroke feedback expertise.",
    image: coach4Img,
    achievements: ["Trained 3 Olympiad trials squad entrants.", "Specialist in anti-drag training rigs."]
  },
  {
    id: "4",
    name: "Coach Devendra Bundela",
    role: "Head Cricket Coach",
    specialty: "Batting Technique & Spin Tactics",
    experience: "4+ Years",
    bio: "BCCI Level-2 certified master tactician and former First-Class batting stalwart with extensive player development records.",
    image: coach3Img,
    achievements: ["Guided MP state junior squad to major national finals.", "Technique analysis consultant for multiple IPL players."]
  }
];

export const FEATURED_ATHLETES: Athlete[] = [
  {
    id: "1",
    name: "Arjun Malviya",
    sport: "Badminton",
    achievement: "National Pro Junior Champion & Under-19 Singles Gold Medalist",
    image: athlete1Img,
    level: "Elite Athlete"
  },
  {
    id: "2",
    name: "Rishi Rathore",
    sport: "Squash",
    achievement: "State Under-17 Squash Champion & Central India Trophy Holder",
    image: athlete2Img,
    level: "State Representative"
  },
  {
    id: "3",
    name: "Simran Gill",
    sport: "Swimming",
    achievement: "National Silver Medalist (100m Butterfly) & State Record Holder",
    image: athlete3Img,
    level: "Youth International"
  },
  {
    id: "4",
    name: "Nikita Soni",
    sport: "Fitness",
    achievement: "Inter-Gym Powerlifting gold medalist and lead trainer nominee",
    image: athlete4Img,
    level: "National Fitness Competitor"
  }
];

export const UPCOMING_EVENTS: Event[] = [
  {
    id: "event_1",
    title: "Badminton Summer Selections 2026",
    date: "July 15, 2026",
    time: "8:00 AM - 4:00 PM",
    location: "MSA Badminton Arena, Indore",
    sport: "Badminton",
    description: "Open selection trials for fully sponsored badminton performance academy scholarships.",
    registrationOpen: true
  },
  {
    id: "event_2",
    title: "Indore Youth Squash Open Cup",
    date: "July 28, 2026",
    time: "3:00 PM - 9:00 PM",
    location: "MSA Squash Complex",
    sport: "Squash",
    description: "Inter-academy standard tournament for rising squash talents across Central India.",
    registrationOpen: true
  }
];

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "ach_1",
    title: "Central India Badminton Cup",
    sport: "Badminton",
    year: "2025",
    athleteName: "MSA Under-17 Squad",
    medal: "Championship",
    description: "Clean sweep over 12 tournaments to claim the prestigious regional championship shield."
  },
  {
    id: "ach_2",
    title: "Gold Medal - 100m butterfly",
    sport: "Swimming",
    year: "2025",
    athleteName: "Simran Gill",
    medal: "Gold",
    description: "Broke the state record with a stunning 58.4 seconds finish in girls junior finals."
  }
];

export const TESTIMONIALS = [
  {
    quote: "The badminton training at Malwa Sports Academy (MSA) transformed my reflex play completely. The 7 synthetic courts and professional coaches are on par with international standards.",
    author: "Arjun Malviya",
    relation: "Professional Junior Athlete",
    rating: 5
  },
  {
    quote: "Malwa Sports Academy (MSA) is Central India's finest sports complex. From Matrix machinery in the GYM to heated swimming pools, it's a paradise for health and fitness.",
    author: "Chakit Arora",
    relation: "Club Member, 2 Years",
    rating: 5
  },
  {
    quote: "MSA Gym is awesome! Special thanks to the trainers who make every single session count. The ambiance is energetic and extremely professional.",
    author: "Shweta Baheti",
    relation: "Aesthetic Conditioning Member",
    rating: 5
  }
];

export const GOOGLE_REVIEWS = [
  {
    name: "Khomraj Patel",
    rating: 5,
    text: "Amazing facilities. My kids go for swimming and badminton and they are learning under certified professional coaches. Highly recommended!",
    time: "3 months ago",
    avatar: "K"
  },
  {
    name: "Chakit Arora",
    rating: 5,
    text: "One of the best sports and fitness club in the city. I have been going there for a while now, and the trainers are super helpful.",
    time: "a year ago",
    avatar: "C"
  },
  {
    name: "Shweta Baheti",
    rating: 5,
    text: "MSA Gym is awesome, thanks to trainers like Zohaib Sir who make every session count! Clean and premium equipment.",
    time: "6 months ago",
    avatar: "S"
  },
  {
    name: "Jyoti Bhardwaj",
    rating: 5,
    text: "I found the ambiance and environment is wonderful to join. The club is giving all the facilities under one single roof in Indore.",
    time: "10 months ago",
    avatar: "J"
  }
];

export const VIDEO_MEMBERS = [
  {
    name: "DHRUV JAIN",
    role: "MSA GYM MEMBER",
    image: athlete1Img,
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
  },
  {
    name: "NIKITA SONI",
    role: "MSA GYM MEMBER",
    image: athlete2Img,
    videoUrl: "https://www.w3schools.com/html/movie.mp4"
  },
  {
    name: "ANEESHA SONI",
    role: "MSA GYM MEMBER",
    image: athlete3Img,
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
  },
  {
    name: "ANUSHKA PODDAR",
    role: "MSA GYM MEMBER",
    image: athlete4Img,
    videoUrl: "https://www.w3schools.com/html/movie.mp4"
  }
];

export const GALLERY_TABS = {
  badminton: [
    badmintonImg,
    galleryBadminton2Img,
    galleryBadminton3Img,
    galleryBadminton4Img
  ],
  gym: [
    gymImg,
    galleryGym2Img,
    galleryGym3Img,
    galleryGym4Img
  ],
  swimming: [
    swimmingImg,
    gallerySwimming2Img,
    gallerySwimming3Img,
    gallerySwimming4Img
  ],
  squash: [
    gallerySquash1Img,
    gallerySquash2Img,
    gallerySquash3Img,
    gallerySquash4Img
  ]
};

export const CAFE_GALLERY = [
  {
    title: "MSA Cafe & Lounge",
    desc: "Sip nutrient-dense sports juices and healthy smoothies post-training in our fully air-conditioned cafe.",
    image: cafe1Img
  },
  {
    title: "Healthy Protein Station",
    desc: "Custom high-protein egg combos, wraps, and athlete diets customized by our sports nutritionists.",
    image: cafe2Img
  },
  {
    title: "Gourmet Health Store",
    desc: "Stock up on premium whey supplements, protein bars, amino drinks, and top fitness accessories.",
    image: cafe3Img
  }
];

export const FACILITIES = [
  {
    title: "7 BWF-Standard Synthetic Courts",
    description: "Anti-slip green synthetic court surfaces matching world-class BWF standards with high-intensity LED illumination.",
    image: badmintonImg
  },
  {
    title: "Semi-Olympic Swimming Pool",
    description: "Indoor heated swimming pool featuring multi-lane boundaries, perfect hydrodynamics, and digital timers.",
    image: swimmingImg
  },
  {
    title: "Cutting-Edge Matrix Fitness Gym",
    description: "Equipped with specialized heavy-weight lifting platforms, Matrix treadmills, cable cross setups, and injury-rehab lounges.",
    image: gymImg
  },
  {
    title: "WSF Glass Squash Complex",
    description: "A set of high-spec glass squash courts designed for maximum structural visibility, with ball-feeding machines.",
    image: squashImg
  },
  {
    title: "FIFA-Standard AstroTurf Pitch",
    description: "Premium synthetic turf field complete with night-play floodlighting, digital speed capture rigs, and professional training barriers.",
    image: footballImg
  },
  {
    title: "ISSF Electronic Air Rifle Shooting Range",
    description: "Climate-controlled 10m indoor shooting range utilizing digital Scatt posture analyzers and automated electronic target scoring terminals.",
    image: shootingImg
  }
];
