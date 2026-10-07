
import { Github, Linkedin } from "lucide-react";

export const SITE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://portfolio-theta-lyart-35.vercel.app";

export type ProjectCategory = "AI" | "DevOps" | "Full-stack" | "IoT";

export type Achievement = {
  /** The big number or rank, e.g. "3rd". */
  value: string;
  title: string;
  detail: string;
};

export type Testimonial = {
  quote: string;
  name: string;
  /** e.g. "Engineering Manager, XenKrypt Technologies" */
  role: string;
  /** Optional link to the person's LinkedIn, so the quote can be checked. */
  url?: string;
};

export type Project = {
  title: string;
  /** One short line shown on the coloured card. */
  tagline: string;
  description: string;
  /** Bullet points shown next to featured projects. */
  highlights?: string[];
  tags: string[];
  link: string;
  liveUrl?: string;
  image?: string;
  featured?: boolean;
  /** Used by the filter chips above the "More builds" grid. */
  categories: ProjectCategory[];
};

const projects: Project[] = [
  {
    title: "OpsAcademy",
    categories: ["DevOps", "AI"],
    tagline: "Learn DevOps by running real Linux commands in the browser.",
    description:
      "Interactive browser-based DevOps learning platform featuring 14 production-grade courses, live Linux terminal (<50ms latency via xterm.js & node-pty), multi-agent LangGraph RAG mentor with Qdrant Vector DB, and an automated Docker sandbox auto-reaper reducing idle costs by ~90%.",
    highlights: [
      "14 courses with a live sandboxed Linux terminal",
      "Multi-agent AI mentor that gives hints without spoiling the answer",
      "Auto-reaper for idle Docker sandboxes (~90% lower idle cost)",
    ],
    tags: ["React 19", "Node.js", "LangGraph RAG", "Docker", "WebSockets", "Qdrant"],
    link: "https://github.com/yashsrivastava1408/OpsAcademy",
    liveUrl: "https://ops-academy-chi.vercel.app",
    image: "/projects/opsacademy.png",
    featured: true,
  },
  {
    title: "Question Forge",
    categories: ["AI", "Full-stack"],
    tagline: "LLM-written interview questions, checked before a human sees them.",
    description:
      "Open-source platform that drafts DSA, SQL, OOP and system-design interview questions with an LLM, then verifies each one with something other than that LLM. Coding and SQL questions are checked by running code; the rest go through an independent LLM review. Whatever passes lands in a human review queue and is assembled into exportable papers.",
    highlights: [
      "Coding and SQL questions are validated by executing code",
      "Independent LLM review for the question types that cannot be run",
      "Human review queue, paper assembly and export",
    ],
    tags: ["TypeScript", "React", "PostgreSQL", "Redis / BullMQ", "LLM"],
    link: "https://github.com/yashsrivastava1408/QuestionForge",
    image: "/projects/question-forge.png",
    featured: true,
  },
  {
    title: "Trailhead",
    categories: ["AI", "Full-stack"],
    tagline: "Try the career path before you pick it.",
    description:
      "Evidence-based placement guide for final-year students. It reads your public GitHub repositories and resume text, builds a profile where every skill carries the evidence that proves it, scores 9 career paths in plain reproducible code, and uses a fact-checker to reject any LLM claim the profile cannot back up.",
    highlights: [
      "9 career paths scored in code, not by the model",
      "A checker rejects LLM claims the evidence cannot prove",
      "Short taste tests and a 30-day plan that adapts",
    ],
    tags: ["React", "Express", "LangGraph.js", "SQLite", "Zod", "Groq"],
    link: "https://github.com/yashsrivastava1408/TrailHead",
    image: "/projects/trailhead.jpg",
    featured: true,
  },
  {
    title: "Lock Focus",
    categories: ["AI", "Full-stack"],
    tagline: "An adaptive reading system for neurodiverse users.",
    description:
      "Adaptive digital reading ecosystem for neurodiverse users, featuring ADHD-friendly interfaces, dyslexia-aware layouts, and behavior-driven design. Secured 3rd Place at HackElite'26 national hackathon.",
    highlights: [
      "3rd place among 900+ teams at HackElite'26",
      "ADHD-friendly and dyslexia-aware reading modes",
      "Interface adapts to reading behaviour",
    ],
    tags: ["React", "AI", "Accessibility", "Neurodiversity"],
    link: "https://github.com/yashsrivastava1408/lock-focus-hackathon",
    liveUrl: "https://lock-focus-hackathon.vercel.app",
    image: "/projects/lock-focus.png",
    featured: true,
  },
  {
    title: "Aether Clinic",
    categories: ["AI", "Full-stack"],
    tagline: "A privacy-first AI healthcare platform.",
    description:
      "Full-stack AI healthcare platform enabling real-time medical chat, automated report analysis, and image-based insights using React, Node.js, and MongoDB. Designed a hybrid AI inference architecture reducing response latency by 35%. Built a secure, modular REST API backend with AES-256 encryption.",
    highlights: [
      "Real-time medical chat, report analysis and image insights",
      "Hybrid AI inference design (35% lower response latency)",
      "Modular REST API with AES-256 encryption",
    ],
    tags: ["React", "Node.js", "MongoDB", "Python ML", "React Native"],
    link: "https://github.com/yashsrivastava1408/Aether-Clinic",
    liveUrl: "https://aether-clinic-umber.vercel.app",
    image: "/projects/aether-clinic-1.png",
    featured: true,
  },
  {
    title: "Distributed Job Scheduler",
    categories: ["Full-stack", "DevOps"],
    tagline: "A job scheduler that never runs a job twice.",
    description:
      "Distributed job scheduler with atomic queue claiming (SELECT ... FOR UPDATE SKIP LOCKED), queue concurrency limits, multi-tenant isolation, a heartbeat watchdog that requeues work from crashed workers, a dead letter queue and a live WebSocket dashboard.",
    tags: ["TypeScript", "Node.js", "Prisma", "PostgreSQL", "Socket.IO"],
    link: "https://github.com/yashsrivastava1408/distributed-job-scheduler",
  },
  {
    title: "DevSick",
    categories: ["AI", "DevOps"],
    tagline: "AI incident reasoning on top of your monitoring.",
    description:
      "Incident reasoning platform that ingests logs and alerts, correlates events across a service graph, and uses an LLM to produce a structured root-cause analysis with human-in-the-loop remediation.",
    tags: ["Python", "FastAPI", "Groq / Llama", "Prometheus", "Grafana"],
    link: "https://github.com/yashsrivastava1408/DevSick",
  },
  {
    title: "GigShield",
    categories: ["Full-stack"],
    tagline: "Parametric micro-insurance for gig workers.",
    description:
      "Weekly income cover for India's gig workers. When a verified trigger such as extreme weather or severe AQI hits a worker's zone, the payout path is computed automatically. Built for Guidewire DEVTrails 2026.",
    tags: ["Python", "FastAPI", "React", "TypeScript", "PostgreSQL"],
    link: "https://github.com/yashsrivastava1408/GigSheild",
    liveUrl: "https://gig-sheild-neon.vercel.app",
  },
  {
    title: "Code Battleground",
    categories: ["Full-stack"],
    tagline: "Real-time multiplayer competitive programming.",
    description:
      "Real-time coding arena built as a Turborepo monorepo: Next.js client, NestJS API, Socket.IO for live rooms, BullMQ workers for code evaluation and an Elo-based rating system.",
    tags: ["Next.js", "NestJS", "Socket.IO", "BullMQ", "PostgreSQL", "Redis"],
    link: "https://github.com/yashsrivastava1408/Code-Battleground",
  },
  {
    title: "Urban Pluss",
    categories: ["AI", "IoT"],
    tagline: "Accident detection from CCTV feeds.",
    description:
      "YOLOv5-based accident detection system achieving 92% accuracy on road collisions from CCTV feeds, with IoT-powered traffic signal automation and multithreading that cut end-to-end latency by 35%.",
    tags: ["Python", "YOLOv5", "OpenCV", "MQTT", "IoT"],
    link: "https://github.com/yashsrivastava1408/UrbanPluss",
    liveUrl: "https://urban-pluss.vercel.app",
    image: "/projects/urban-pulse-dashboard.png",
  },
  {
    title: "FlowForge",
    categories: ["Full-stack"],
    tagline: "A visual designer for HR workflows.",
    description:
      "Drag-and-drop workflow designer for onboarding, leave approval and document verification, with schema-driven node forms, an MSW-powered mock API and a step-by-step simulation sandbox.",
    tags: ["React", "React Flow", "TypeScript", "MSW"],
    link: "https://github.com/yashsrivastava1408/FlowForge-",
    liveUrl: "https://flow-forge-blond.vercel.app",
  },
  {
    title: "TrueSignal",
    categories: ["AI"],
    tagline: "Cleaner signals for kitchen prep time prediction.",
    description:
      "Signal-integrity layer that improves Kitchen Prep Time prediction without retraining existing models, by triangulating multiple real-world signals. Built for a Zomato hackathon.",
    tags: ["JavaScript", "Data", "Hackathon"],
    link: "https://github.com/yashsrivastava1408/TrueSignal",
    liveUrl: "https://true-signal-five.vercel.app",
  },
  {
    title: "ExamOracle",
    categories: ["AI", "Full-stack"],
    tagline: "Lecture notes in, exam predictions out.",
    description:
      "Turns unstructured lecture notes into probability-ranked exam predictions, flashcards and quizzes.",
    tags: ["Next.js", "TypeScript", "Prisma", "Gemini"],
    link: "https://github.com/yashsrivastava1408/ExamOracle",
  },
  {
    title: "LinguaLive",
    categories: ["Full-stack"],
    tagline: "Real-time language learning.",
    description: "Real-time language learning and communication platform.",
    tags: ["Web App", "Communication"],
    link: "https://github.com/yashsrivastava1408/LinguaLive",
    image: "/projects/lingualive.png",
  },
  {
    title: "Grovia",
    categories: ["AI", "Full-stack"],
    tagline: "Voice-assisted eco-friendly shopping.",
    description:
      "Voice-assisted eco-friendly e-commerce platform built for Sparkathon 2025, with an AI-powered voice assistant that makes sustainable shopping faster.",
    tags: ["Python", "Web Speech API", "AI"],
    link: "https://github.com/yashsrivastava1408/Groviaa",
    image: "/projects/grovia.png",
  },
  {
    title: "Smart Car Parking System",
    categories: ["IoT"],
    tagline: "IoT parking with plate recognition.",
    description:
      "IoT-enabled parking system with real-time slot detection and automatic license plate recognition.",
    tags: ["IoT", "Automation"],
    link: "https://github.com/yashsrivastava1408/SMART-CAR-PARKING-SYSTEM",
  },
  {
    title: "Fish Catch System",
    categories: ["IoT"],
    tagline: "IoT analytics for fish catch prediction.",
    description:
      "IoT-powered data logging and analytics system for fish catch prediction using geolocation and historical data.",
    tags: ["IoT", "Analytics"],
    link: "https://github.com/yashsrivastava1408/FISH-CATCH-SYSTEM",
  },
  {
    title: "Volt Vision",
    categories: ["IoT"],
    tagline: "Real-time voltage monitoring.",
    description:
      "Real-time voltage monitoring system using C# for data processing and a Flask web interface.",
    tags: ["C#", "Flask", "IoT"],
    link: "https://github.com/yashsrivastava1408/VOLT-VISION",
  },
];

export const portfolioData = {
  personal: {
    name: "Yash Srivastava",
    title: "Full Stack Developer | DevSecOps Enthusiast",
    description:
      "Final-year B.Tech Computer Science student who builds systems end-to-end — from backend code to production deployments. I work across DevOps and software roles on CI/CD pipelines, containerization, and cloud-native workflows using GitHub Actions, Jenkins, Docker, Kubernetes, and Linux. Lately I have been building AI systems that check their own work: LangGraph agents, RAG mentors, and LLM pipelines where code, not the model, has the final say. Open to Software Engineering, Platform, Cloud, and DevOps roles.",
    email: "yashsrivastava1408@gmail.com",
    phone: "+91-6394026578",
    resume: "/resume.pdf",
    // One line about this month's work. Shown in the About section; delete it to hide the line.
    currentlyBuilding: {
      text: "Question Forge — making an LLM prove its interview questions are correct by running the code.",
      url: "https://github.com/yashsrivastava1408/QuestionForge",
    },
    github: "yashsrivastava1408",
    social: [
      {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/yash-srivastava-45779531a",
        icon: Linkedin,
      },
      {
        name: "GitHub",
        url: "https://github.com/yashsrivastava1408",
        icon: Github,
      },
    ],
  },
  education: [
    {
      institution: "SRM Institute of Science and Technology",
      degree: "Bachelor of Technology",
      location: "Chennai, Tamil Nadu",
      period: "Aug. 2023 – Present",
    },
  ],
  skills: [
    "Python",
    "TypeScript",
    "JavaScript",
    "C/C++",
    "SQL",
    "Node.js",
    "Express",
    "FastAPI",
    "Flask",
    "React",
    "Next.js",
    "LangGraph / RAG",
    "WebSockets",
    "Qdrant Vector DB",
    "xterm.js / PTY",
    "Data Structures & Algorithms",
    "OOP",
    "REST APIs",
    "Microservices",
    "DBMS",
    "PostgreSQL",
    "MySQL",
    "MongoDB",
    "Redis",
    "Docker",
    "Kubernetes",
    "CI/CD",
    "GitHub Actions",
    "Jenkins",
    "Argo CD",
    "Prometheus",
    "Grafana",
    "Linux",
    "AWS",
    "Git",
    "GitHub",
    "GitLab",
  ],
  // Fallback only: the live numbers are fetched in src/lib/stats.ts. These show if LeetCode cannot be reached.
  leetcode: {
    username: "Qce4QmSNDd",
    asOf: "7 Oct 2026",
    totalSolved: 418,
    easy: 191,
    medium: 207,
    hard: 20,
    contestRating: 1455 as number | null,
  },
  experience: [
    {
      company: "TalenciaGlobal",
      role: "Software Trainee",
      period: "July 2026 – Present",
      logo: "/logos/talenciaglobal.png",
      description:
        "Working on the Sentrix AI Security Platform. Built RADIX, a data-intensive enterprise platform on FastAPI, PostgreSQL, Redis, and AWS Bedrock, with REST APIs for company research, scoring, and analytics. Designed a hybrid relational/EAV PostgreSQL model for 164 research fields per company, so the schema can grow without repeated migrations. Added malware scanning and CVE checks to GitHub Actions CI/CD, and built a background-processing layer with ARQ, Redis, and PostgreSQL advisory locks.",
    },
    {
      company: "XenKrypt Technologies",
      role: "DevOps Intern",
      period: "Dec 2025 – Mar 2026",
      logo: "/logos/xenkrypt.png",
      description:
        "Provisioned and automated a Kubernetes environment on AWS EC2 with GitLab, Harbor, ArgoCD, and NGINX Ingress. Rebuilt GitHub Actions CI/CD with change detection and matrix-based execution, cutting build and test time from 22 minutes to 4. Troubleshot deployment failures across Kubernetes, Docker, networking, and service configuration, and deployed Odoo and n8n to automate internal workflows.",
    },
    {
      company: "SheSafe",
      role: "Research and Development Intern",
      period: "June 2025 – July 2025",
      logo: "/logos/shesafe.png",
      description:
        "Engineered a wearable safety pendant prototype, optimizing sensor, battery, microphone, and alert-button layout within jewelry-sized constraints. Evaluated low-power components for smartphone-independent tracking. Investigated real-time SOS transmission latency, optimizing GPS update intervals.",
    },
    {
      company: "Code Tech IT Solution",
      role: "Software Development Intern",
      period: "Jan 2025 – Mar 2025",
      logo: "/logos/codetech.png",
      description:
        "Built a Chrome extension tracking activity across 20+ websites, generating weekly automated reports to help users reduce unproductive screen time. Developed a real-time chat system supporting 100+ concurrent connections with instant messaging, read receipts, and online/offline presence using Socket.IO, MongoDB, and Express.js.",
    },
  ],
  projects,
  // The LeetCode tile is added automatically from the live numbers.
  achievements: [
    { value: "3rd", title: "HackElite'26", detail: "National hackathon, 900+ teams" },
    { value: "Top 5", title: "CodeMavens 2025", detail: "With Punya, a food-waste platform" },
    { value: "22 → 4 min", title: "CI build time", detail: "GitHub Actions rebuild at XenKrypt" },
  ] as Achievement[],
  // Real quotes only. The section stays hidden while this list is empty.
  testimonials: [] as Testimonial[],
  gallery: [
    {
      id: 1,
      title: "3rd Place at HackElite'26",
      imageUrl: "/gallery/hackelite-26.jpg",
      description: "Secured 3rd place among 900+ teams at HackElite'26. Developed 'Lock Focus', an accessibility-first reading platform, defending technical architecture and business viability through six intense rounds.",
    },
    {
      id: 2,
      title: "Opening the Server Rack",
      imageUrl: "/gallery/rack-server.png",
      description: "Explored the backbone of our infrastructure by opening up a rack server, checking hardware, and configuring static IPs. Witnessing Kubernetes pods spin up on actual hardware was a game-changer.",
    },
    {
      id: 3,
      title: "Top 5 at CodeMavens 2025",
      imageUrl: "/gallery/codemavens-punya.png",
      description: "Team Syntax Slayer secured a Top 5 spot with 'Punya', a MERN-stack platform fighting food wastage. Built with React, Node.js, and MongoDB to connect donors, NGOs, and volunteers.",
    },
    {
      id: 4,
      title: "Smart India Hackathon Journey",
      imageUrl: "/gallery/sih-urbanpulse.png",
      description: "Built 'UrbanPulse', an AI-powered Traffic Management System using YOLOv8 and Flask. Although we didn't win, the hands-on learning in computer vision and real-time alerts was invaluable.",
    },
    {
      id: 5,
      title: "Building XenKrypt",
      imageUrl: "/gallery/xenkrypt-team.jpg",
      description: "The XenKrypt team – a group of driven individuals building a next-gen cybersecurity startup from scratch. Learning by doing and pushing the limits of production-grade systems.",
    },
  ],
};
