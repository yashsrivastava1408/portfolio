
import { Github, Linkedin, Mail, Phone, ExternalLink } from "lucide-react";

export const portfolioData = {
  personal: {
    name: "Yash Srivastava",
    title: "Full Stack Developer | DevSecOps Enthusiast",
    description:
      "Third-year B.Tech Computer Science student who builds systems end-to-end — from backend code to production deployments. Currently a DevOps Intern working on CI/CD pipelines, containerization, and cloud-native workflows using GitHub Actions, Jenkins, Docker, Kubernetes, and Linux. My core strengths include Java, Python, backend development, and DevOps fundamentals. Actively expanding skills in cloud computing, automation, and scalable system design. Seeking internship or early-career opportunities in Software Engineering, Platform, Cloud, or DevOps roles.",
    email: "yashsrivastava1408@gmail.com",
    phone: "+91-6394026578",
    resume: "/legacy_backup/photos/yash resume final copy.pdf",
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
  skills: [
    "Java",
    "Python",
    "C/C++",
    "Data Structures & Algorithms",
    "React",
    "Node.js",
    "Next.js",
    "Docker & Kubernetes",
    "CI/CD (Jenkins, GitLab)",
    "AWS",
    "IoT & MQTT",
  ],
  experience: [
    {
      company: "XenKrypt Technologies",
      role: "DevOps Intern",
      period: "Dec 2025 – Present",
      logo: "/logos/xenkrypt.png",
      description:
        "Improved CI performance by 82% through matrix-driven optimizations and redesigned GitHub Actions. Eliminated silent deployment failures by refactoring Makefile workflows and stabilized Jenkins CI in a self-hosted GitLab environment, ensuring reliable pipeline execution.",
    },
    {
      company: "SheSafe",
      role: "Research & Development Intern",
      period: "June 2025 – July 2025",
      logo: "/logos/shesafe.png",
      description:
        "Engineered a wearable safety pendant prototype under jewelry-sized constraints. Explored device miniaturization and investigated real-time SOS transmission challenges, balancing energy efficiency with accurate location detection.",
    },
    {
      company: "Code Tech IT Solution",
      role: "Software Development Intern",
      period: "Jan 2025 – Mar 2025",
      logo: "/logos/codetech.png",
      description:
        "Built a Chrome extension to monitor user website activity for productivity analysis. Developed a scalable real-time chat system with instant messaging and read receipts using Socket.IO, MongoDB, and Express.js.",
    },
  ],
  projects: [
    {
      title: "Aether Clinic",
      description:
        "Full-stack AI healthcare platform with real-time medical chat and image-based insights using React, Node.js, and MongoDB. Features hybrid AI architecture (Ollama + Cloud LLMs) reducing latency by 35%.",
      tags: ["React", "Node.js", "AI", "Cloud-Native"],
      link: "https://github.com/yashsrivastava1408/Aether-Clinic",
      category: "Software",
      image: "/projects/aether-clinic-1.png",
    },
    {
      title: "Urban Plus",
      description:
        "Accident detection system using YOLOv5 and OpenCV with 92% accuracy. Integrated IoT-powered traffic light automation to prioritize emergency vehicles and reduced system latency using multithreading.",
      tags: ["Python", "YOLOv5", "IoT", "OpenCV"],
      link: "https://github.com/yashsrivastava1408/UrbanPluss",
      category: "Software",
    },
    {
      title: "LinguaLive",
      description: "Real-time language learning and communication platform.",
      tags: ["Web App", "Communication"],
      link: "https://github.com/yashsrivastava1408/LinguaLive",
      category: "Software",
      image: "/projects/lingualive.png",
    },
    {
      title: "Grovia",
      description:
        "Voice-Assisted Eco-Friendly E-Commerce platform built for Sparkathon 2025. Features an AI-powered voice assistant ('Apply Grovia25') to make sustainable shopping smarter and faster.",
      tags: ["React", "Web Speech API", "AI", "Sustainable Tech"],
      link: "https://github.com/yashsrivastava1408/Groviaa",
      category: "Software",
    },
    {
      title: "Smart Shop",
      description:
        "E-commerce platform with user authentication, product listings, and cart functionality.",
      tags: ["E-commerce", "Auth"],
      link: "https://github.com/yashsrivastava1408/SMART-SHOP",
      category: "Software",
    },
    {
      title: "Fish Catch System",
      description:
        "IoT-powered data logging and analytics system for fish catch prediction using geolocation and historical data.",
      tags: ["IoT", "Analytics"],
      link: "https://github.com/yashsrivastava1408/FISH-CATCH-SYSTEM",
      category: "Software",
    },
    {
      title: "ChatBot",
      description:
        "Full-stack chatbot application demonstrating RESTful API integration and CRUD operations.",
      tags: ["Full Stack", "API"],
      link: "https://github.com/yashsrivastava1408/CHATBOT",
      category: "Software",
    },
    {
      title: "Atmos",
      description:
        "Responsive single-page application focused on modern UI/UX principles and client-side scripting.",
      tags: ["SPA", "UI/UX"],
      link: "https://github.com/yashsrivastava1408/ATMOS",
      category: "Software",
    },
    {
      title: "Volt Vision",
      description:
        "Real-time voltage monitoring system using C# for data processing and Flask web interface.",
      tags: ["C#", "Flask", "IoT"],
      link: "https://github.com/yashsrivastava1408/VOLT-VISION",
      category: "Software",
    },
    {
      title: "Smart Car Parking System",
      description:
        "IoT-enabled parking system with real-time slot detection and automatic license plate recognition.",
      tags: ["IoT", "Automation"],
      link: "https://github.com/yashsrivastava1408/SMART-CAR-PARKING-SYSTEM",
      category: "IoT",
    },
    {
      title: "Dual-Axis Sun Tracking Solar Panel",
      description:
        "Dual-axis tracking system to optimize solar panel energy capture using servo motors and sensors.",
      tags: ["IoT", "Solar", "Energy"],
      link: "https://github.com/yashsrivastava1408/home-automation",
      category: "IoT",
    },
  ],
  gallery: [
    {
      id: 1,
      title: "Opening the Server Rack",
      imageUrl: "/gallery/rack-server.png",
      description: "Explored the backbone of our infrastructure by opening up a rack server, checking hardware, and configuring static IPs. Witnessing Kubernetes pods spin up on actual hardware was a game-changer.",
    },
    {
      id: 2,
      title: "Top 5 at CodeMavens 2025",
      imageUrl: "/gallery/codemavens-punya.png",
      description: "Team Syntax Slayer secured a Top 5 spot with 'Punya', a MERN-stack platform fighting food wastage. Built with React, Node.js, and MongoDB to connect donors, NGOs, and volunteers.",
    },
    {
      id: 3,
      title: "Smart India Hackathon Journey",
      imageUrl: "/gallery/sih-urbanpulse.png",
      description: "Built 'UrbanPulse', an AI-powered Traffic Management System using YOLOv8 and Flask. Although we didn't win, the hands-on learning in computer vision and real-time alerts was invaluable.",
    },
    {
      id: 4,
      title: "Building XenKrypt",
      imageUrl: "/gallery/xenkrypt-team.jpg",
      description: "The XenKrypt team – a group of driven individuals building a next-gen cybersecurity startup from scratch. Learning by doing and pushing the limits of production-grade systems.",
    },
  ],
};
