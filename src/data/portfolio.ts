
import { Github, Linkedin, Mail, Phone, ExternalLink } from "lucide-react";

export const portfolioData = {
  personal: {
    name: "Yash Srivastava",
    title: "Full Stack Developer | DevSecOps Enthusiast",
    description:
      "I am a second-year B.Tech student in Computer Science and Engineering with a strong foundation in software development, cloud-native technologies, and IoT. I consistently engage in internships and hackathons to apply my skills in real-world scenarios, ranging from secure DevOps pipelines to AI-driven healthcare solutions.",
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
      description:
        "Improved CI performance by 82% through matrix-driven optimizations and redesigned GitHub Actions. Eliminated silent deployment failures by refactoring Makefile workflows and stabilized Jenkins CI in a self-hosted GitLab environment, ensuring reliable pipeline execution.",
    },
    {
      company: "SheSafe",
      role: "Research & Development Intern",
      period: "June 2025 – July 2025",
      description:
        "Engineered a wearable safety pendant prototype under jewelry-sized constraints. Explored device miniaturization and investigated real-time SOS transmission challenges, balancing energy efficiency with accurate location detection.",
    },
    {
      company: "Code Tech IT Solution",
      role: "Software Development Intern",
      period: "Jan 2025 – Mar 2025",
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
};
