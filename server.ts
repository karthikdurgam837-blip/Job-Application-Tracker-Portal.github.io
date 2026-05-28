/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import fs from "fs";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;
const DB_FILE = path.join(process.cwd(), "data", "db.json");

app.use(express.json({ limit: "15mb" }));

// Ensure data folder exists
if (!fs.existsSync(path.dirname(DB_FILE))) {
  fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
}

// Ensure database file exists
if (!fs.existsSync(DB_FILE)) {
  const initialDb = {
    users: [
      {
        id: "default-student-123",
        email: "karthikdurgam837@gmail.com",
        name: "Karthik Durgam",
        password: "password123"
      }
    ],
    applications: [
      {
        id: "app-1",
        userId: "default-student-123",
        companyName: "Google",
        roleTitle: "Software Engineer Intern",
        location: "Mountain View, CA",
        source: "Careers Portal",
        url: "https://careers.google.com",
        salaryNote: "$45 - $65 / hr",
        stage: "TECH",
        statusNote: "Prepared for coding assessment. HR round scheduled.",
        jdText: "Minimum qualifications: Currently pursuing a Bachelor's, Master's, or PhD in Computer Science or a related technical field. Experience in Java, C++, Python, or Go. Knowledge of data structures, algorithms, and software engineering principles.",
        skills: ["Java", "Python", "Data Structures", "Algorithms", "Software Engineering"],
        matchScore: 85,
        matchFeedback: "Excellent resume match! Key requirements including C++, Python, algorithms and data structures are highlighted. Suggest adding a Google Cloud platform project or Git version control tools.",
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        tasks: [
          {
            id: "task-1-1",
            title: "Solve 5 LeetCode Medium questions on Graphs",
            dueAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
            done: true,
            createdAt: new Date().toISOString()
          },
          {
            id: "task-1-2",
            title: "Review system design concepts on caching and databases",
            dueAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
            done: false,
            createdAt: new Date().toISOString()
          }
        ],
        contacts: [
          {
            id: "contact-1-1",
            name: "Emily Watson",
            title: "University Recruiter",
            email: "emily.watson@google.com",
            phone: "+1 (555) 019-2834",
            notes: "Sent introductory email. Very responsive and polite."
          }
        ],
        notes: [
          {
            id: "note-1-1",
            content: "Technical round is 45 minutes long, focus is on array manipulation, algorithms, and clean code optimization style.",
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
          }
        ],
        docs: [
          {
            id: "doc-1-1",
            kind: "resume",
            filename: "Karthik_Durgam_Google_Resume.pdf",
            uploadedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
            contentSize: "142 KB"
          }
        ]
      },
      {
        id: "app-2",
        userId: "default-student-123",
        companyName: "Meta",
        roleTitle: "Frontend Engineer (MERN)",
        location: "Seattle, WA",
        source: "LinkedIn",
        url: "https://meta.com/careers",
        salaryNote: "$120,000 - $150,000 / yr",
        stage: "OA",
        statusNote: "Received Online Assessment link. Deadline in 4 days.",
        jdText: "We are seeking frontend experts skilled in React, Tailwind CSS, TypeScript, and state management. Familiarity with Node.js and RESTful architecture is a plus. Passionate about building highly responsive user interfaces.",
        skills: ["React", "TypeScript", "Tailwind CSS", "RESTful APIs", "State Management"],
        matchScore: 78,
        matchFeedback: "Strong match for frontend developer skills. Missing Node.js backend highlights in the provided resume. Recommend adding a web platform project demonstrating database integration.",
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        tasks: [
          {
            id: "task-2-1",
            title: "Complete Meta React/JS Online Assessment",
            dueAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            done: false,
            createdAt: new Date().toISOString()
          }
        ],
        contacts: [],
        notes: [],
        docs: []
      },
      {
        id: "app-3",
        userId: "default-student-123",
        companyName: "Stripe",
        roleTitle: "Full Stack Engineer",
        location: "Remote (US)",
        source: "Referral",
        url: "https://stripe.com/careers",
        salaryNote: "$135,000 - $160,000",
        stage: "OFFER",
        statusNote: "Received official selection offer email! Reviewing benefits packages.",
        jdText: "Build reliable financial APIs and responsive client dashboards. Stack: React, GraphQL, Postgres, Node, Ruby. Focus on security, clean architectures, and automated testing frameworks.",
        skills: ["React", "Node", "PostgreSQL", "APIs", "GraphQL", "Testing"],
        matchScore: 92,
        matchFeedback: "Excellent! Recommender and resume both display high-quality API development proficiency. Suggest discussing compensation and team fit in the final call.",
        createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        tasks: [
          {
            id: "task-3-1",
            title: "Respond to Stripe recruiter regarding benefits",
            dueAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
            done: false,
            createdAt: new Date().toISOString()
          }
        ],
        contacts: [
          {
            id: "contact-3-1",
            name: "Rajesh Kumar",
            title: "Senior Eng Manager (Referrer)",
            email: "rk@stripe.com",
            phone: "+1 (555) 123-4567",
            notes: "Gave great recommendations and interior advice on team structure."
          }
        ],
        notes: [],
        docs: []
      },
      {
        id: "app-4",
        userId: "default-student-123",
        companyName: "Netflix",
        roleTitle: "Backend Software Engineer",
        location: "Los Gatos, CA",
        source: "LinkedIn",
        url: "https://careers.netflix.com",
        salaryNote: "$160 - $210 / hr",
        stage: "APPLIED",
        statusNote: "Successfully submitted resume. Review pending.",
        jdText: "Develop scalable microservices, manage distributed message queues (Kafka, Redis), and optimize high-throughput databases. Expertise with Spring Boot, Node.js or Scala, and Cloud platforms.",
        skills: ["Microservices", "Kafka", "Data Optimization", "Node.js", "Redis"],
        matchScore: 65,
        matchFeedback: "Partial match. Your profile highlights general REST APIs but lacks mentioning distributed queues like Kafka or Redis which are central requirements.",
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        tasks: [],
        contacts: [],
        notes: [],
        docs: []
      }
    ]
  };
  fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), "utf-8");
}

// Read database
function readDb() {
  try {
    const raw = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (e) {
    console.error("Error reading db.json", e);
    return { users: [], applications: [] };
  }
}

// Write database
function writeDb(data: any) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
}

// Initialize Gemini Client
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
  console.log("Initialized Gemini AI Client and registered user agent.");
} else {
  console.log("No GEMINI_API_KEY found in process.env. Will fall back to custom heuristic tailored resume engine.");
}

// Helper to get authorization user
function getAuthUserId(req: express.Request): string {
  const header = req.headers.authorization;
  if (!header) return "default-student-123"; // Fallback to simplify sandbox testing
  const parts = header.split(" ");
  if (parts.length === 2 && parts[0] === "Bearer") {
    return parts[1];
  }
  return "default-student-123";
}

// API Routes

// Registration Check
app.post("/api/auth/register", (req, res) => {
  const { name, email, password, role } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ error: "Missing registration details" });
  }

  const db = readDb();
  const existing = db.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ error: "User already registered" });
  }

  const newUser = {
    id: "user-" + Math.random().toString(36).substring(2, 9),
    name,
    email: email.toLowerCase(),
    password,
    role: role || "candidate"
  };

  db.users.push(newUser);
  writeDb(db);

  res.status(201).json({
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role
  });
});

// Login Check
app.post("/api/auth/login", (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  const db = readDb();
  const user = db.users.find(
    (u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  if (!user) {
    return res.status(401).json({ error: "Invalid email or password credentials" });
  }

  const userRole = role || user.role || (email.toLowerCase().includes("admin") ? "admin" : "candidate");

  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: userRole,
    token: user.id // Return ID as token to maintain stateless stateless bearer session simply
  });
});

// GET applications list
app.get("/api/applications", (req, res) => {
  const userId = getAuthUserId(req);
  const db = readDb();
  let list = db.applications.filter((a: any) => a.userId === userId);

  if (list.length === 0) {
    const seedApps = [
      {
        id: "app-" + Math.random().toString(36).substring(2, 9),
        userId: userId,
        companyName: "Google",
        roleTitle: "Software Engineer Intern",
        location: "Mountain View, CA",
        source: "Careers Portal",
        url: "https://careers.google.com",
        salaryNote: "$45 - $65 / hr",
        stage: "TECH",
        statusNote: "Prepared for coding assessment. HR round scheduled.",
        jdText: "Minimum qualifications: Currently pursuing a Bachelor's, Master's, or PhD in Computer Science or a related technical field. Experience in Java, C++, Python, or Go. Knowledge of data structures, algorithms, and software engineering principles.",
        skills: ["Java", "Python", "Data Structures", "Algorithms", "Software Engineering"],
        matchScore: 85,
        matchFeedback: "Excellent resume match! Key requirements including C++, Python, algorithms and data structures are highlighted. Suggest adding a Google Cloud platform project or Git version control tools.",
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        tasks: [
          {
            id: "task-" + Math.random().toString(36).substring(2, 9),
            title: "Solve LeetCode Medium questions on Graphs",
            dueAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
            done: true,
            createdAt: new Date().toISOString()
          },
          {
            id: "task-" + Math.random().toString(36).substring(2, 9),
            title: "Review system design concepts on caching and databases",
            dueAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
            done: false,
            createdAt: new Date().toISOString()
          }
        ],
        contacts: [
          {
            id: "contact-" + Math.random().toString(36).substring(2, 9),
            name: "Emily Watson",
            title: "University Recruiter",
            email: "emily.watson@google.com",
            phone: "+1 (555) 019-2834",
            notes: "Sent introductory email. Very responsive and polite."
          }
        ],
        notes: [
          {
            id: "note-" + Math.random().toString(36).substring(2, 9),
            content: "Technical round is 45 minutes long, focus is on array manipulation, algorithms, and clean code optimization style.",
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
          }
        ],
        docs: [
          {
            id: "doc-" + Math.random().toString(36).substring(2, 9),
            kind: "resume",
            filename: "Karthik_Durgam_Google_Resume.pdf",
            uploadedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
            contentSize: "142 KB"
          }
        ]
      },
      {
        id: "app-" + Math.random().toString(36).substring(2, 9),
        userId: userId,
        companyName: "Meta",
        roleTitle: "Frontend Engineer (MERN)",
        location: "Seattle, WA",
        source: "LinkedIn",
        url: "https://meta.com/careers",
        salaryNote: "$120,000 - $150,000 / yr",
        stage: "OA",
        statusNote: "Received Online Assessment link. Deadline in 4 days.",
        jdText: "We are seeking frontend experts skilled in React, Tailwind CSS, TypeScript, and state management. Familiarity with Node.js and RESTful architecture is a plus. Passionate about building highly responsive user interfaces.",
        skills: ["React", "TypeScript", "Tailwind CSS", "RESTful APIs", "State Management"],
        matchScore: 78,
        matchFeedback: "Strong match for frontend developer skills. Missing Node.js backend highlights in the provided resume. Recommend adding a web platform project demonstrating database integration.",
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        tasks: [
          {
            id: "task-" + Math.random().toString(36).substring(2, 9),
            title: "Complete Meta React/JS Online Assessment",
            dueAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            done: false,
            createdAt: new Date().toISOString()
          }
        ],
        contacts: [],
        notes: [],
        docs: []
      },
      {
        id: "app-" + Math.random().toString(36).substring(2, 9),
        userId: userId,
        companyName: "Stripe",
        roleTitle: "Full Stack Engineer",
        location: "Remote (US)",
        source: "Referral",
        url: "https://stripe.com/careers",
        salaryNote: "$135,000 - $160,000",
        stage: "OFFER",
        statusNote: "Received official selection offer email! Reviewing benefits packages.",
        jdText: "Build reliable financial APIs and responsive client dashboards. Stack: React, GraphQL, Postgres, Node, Ruby. Focus on security, clean architectures, and automated testing frameworks.",
        skills: ["React", "Node", "PostgreSQL", "APIs", "GraphQL", "Testing"],
        matchScore: 92,
        matchFeedback: "Excellent! Recommender and resume both display high-quality API development proficiency. Suggest discussing compensation and team fit in the final call.",
        createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        tasks: [
          {
            id: "task-" + Math.random().toString(36).substring(2, 9),
            title: "Respond to Stripe recruiter regarding benefits",
            dueAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
            done: false,
            createdAt: new Date().toISOString()
          }
        ],
        contacts: [
          {
            id: "contact-" + Math.random().toString(36).substring(2, 9),
            name: "Rajesh Kumar",
            title: "Senior Eng Manager (Referrer)",
            email: "rk@stripe.com",
            phone: "+1 (555) 123-4567",
            notes: "Gave great recommendations and interior advice on team structure."
          }
        ],
        notes: [],
        docs: []
      },
      {
        id: "app-" + Math.random().toString(36).substring(2, 9),
        userId: userId,
        companyName: "Netflix",
        roleTitle: "Backend Software Engineer",
        location: "Los Gatos, CA",
        source: "LinkedIn",
        url: "https://careers.netflix.com",
        salaryNote: "$160 - $210 / hr",
        stage: "APPLIED",
        statusNote: "Successfully submitted resume. Review pending.",
        jdText: "Develop scalable microservices, manage distributed message queues (Kafka, Redis), and optimize high-throughput databases. Expertise with Spring Boot, Node.js or Scala, and Cloud platforms.",
        skills: ["Microservices", "Kafka", "Data Optimization", "Node.js", "Redis"],
        matchScore: 65,
        matchFeedback: "Partial match. Your profile highlights general REST APIs but lacks mentioning distributed queues like Kafka or Redis which are central requirements.",
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        tasks: [],
        contacts: [],
        notes: [],
        docs: []
      }
    ];

    db.applications.push(...seedApps);
    writeDb(db);
    list = seedApps;
  }

  res.json(list);
});

// POST create application
app.post("/api/applications", (req, res) => {
  const userId = getAuthUserId(req);
  const { companyName, roleTitle, location, source, url, salaryNote, stage, jdText, statusNote } = req.body;

  if (!companyName || !roleTitle) {
    return res.status(400).json({ error: "Company Name and Role Title are required" });
  }

  const db = readDb();

  // Simple key extraction from text heuristically as fallback
  const skillsList: string[] = [];
  const keywordHeuristics = [
    "react", "node", "express", "mongodb", "java", "python", "c\\+\\+", "typescript", "javascript",
    "sql", "postgres", "aws", "gcp", "docker", "kubernetes", "git", "rest", "graphql", "machine learning"
  ];
  if (jdText) {
    keywordHeuristics.forEach(kw => {
      const regex = new RegExp("\\b" + kw + "\\b", "gi");
      if (regex.test(jdText)) {
        // format nicely
        let formatted = kw;
        if (kw === "react") formatted = "React";
        if (kw === "node") formatted = "Node.js";
        if (kw === "express") formatted = "Express";
        if (kw === "mongodb") formatted = "MongoDB";
        if (kw === "java") formatted = "Java";
        if (kw === "python") formatted = "Python";
        if (kw === "c\\+\\+") formatted = "C++";
        if (kw === "typescript") formatted = "TypeScript";
        if (kw === "javascript") formatted = "JavaScript";
        if (kw === "sql") formatted = "SQL";
        if (kw === "postgres") formatted = "PostgreSQL";
        if (kw === "aws") formatted = "AWS";
        if (kw === "gcp") formatted = "Google Cloud";
        if (kw === "docker") formatted = "Docker";
        if (kw === "kubernetes") formatted = "Kubernetes";
        if (kw === "git") formatted = "Git";
        if (kw === "rest") formatted = "REST APIs";
        if (kw === "graphql") formatted = "GraphQL";
        if (kw === "machine learning") formatted = "Machine Learning";
        skillsList.push(formatted);
      }
    });
  }

  const newApp = {
    id: "app-" + Math.random().toString(36).substring(2, 9),
    userId,
    companyName,
    roleTitle,
    location: location || "",
    source: source || "Direct",
    url: url || "",
    salaryNote: salaryNote || "",
    stage: stage || "SAVED",
    statusNote: statusNote || "Application added on tracking grid.",
    jdText: jdText || "",
    skills: skillsList.length > 0 ? skillsList : ["Software Engineering"],
    matchScore: 0,
    matchFeedback: "Customize and tailor your resume on the details panel to compute a match score.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tasks: [],
    contacts: [],
    notes: [],
    docs: []
  };

  db.applications.push(newApp);
  writeDb(db);

  res.status(201).json(newApp);
});

// PUT update application full
app.put("/api/applications/:id", (req, res) => {
  const userId = getAuthUserId(req);
  const { id } = req.params;
  const db = readDb();
  const index = db.applications.findIndex((a: any) => a.id === id && a.userId === userId);

  if (index === -1) {
    return res.status(404).json({ error: "Application not found" });
  }

  const existing = db.applications[index];
  const updated = {
    ...existing,
    ...req.body,
    id: existing.id, // Cannot change key parameters
    userId: existing.userId,
    updatedAt: new Date().toISOString()
  };

  db.applications[index] = updated;
  writeDb(db);
  res.json(updated);
});

// PATCH partial update application stage only
app.patch("/api/applications/:id/stage", (req, res) => {
  const userId = getAuthUserId(req);
  const { id } = req.params;
  const { stage, note } = req.body;

  if (!stage) {
    return res.status(400).json({ error: "Stage parameter required" });
  }

  const db = readDb();
  const index = db.applications.findIndex((a: any) => a.id === id && a.userId === userId);

  if (index === -1) {
    return res.status(404).json({ error: "Application not found" });
  }

  db.applications[index].stage = stage;
  db.applications[index].updatedAt = new Date().toISOString();
  if (note) {
    db.applications[index].statusNote = note;
  } else {
    db.applications[index].statusNote = `Moved application status stage to ${stage}.`;
  }

  writeDb(db);
  res.json(db.applications[index]);
});

// DELETE application
app.delete("/api/applications/:id", (req, res) => {
  const userId = getAuthUserId(req);
  const { id } = req.params;

  const db = readDb();
  const initialLen = db.applications.length;
  db.applications = db.applications.filter((a: any) => !(a.id === id && a.userId === userId));

  if (db.applications.length === initialLen) {
    return res.status(404).json({ error: "Application not found" });
  }

  writeDb(db);
  res.json({ success: true, message: "Successfully deleted application." });
});

// POST upload static document to local DB
app.post("/api/applications/:id/docs", (req, res) => {
  const userId = getAuthUserId(req);
  const { id } = req.params;
  const { kind, filename, contentSize } = req.body;

  if (!kind || !filename) {
    return res.status(400).json({ error: "Document details missing" });
  }

  const db = readDb();
  const index = db.applications.findIndex((a: any) => a.id === id && a.userId === userId);

  if (index === -1) {
    return res.status(404).json({ error: "Application not found" });
  }

  const newDoc = {
    id: "doc-" + Math.random().toString(36).substring(2, 9),
    kind,
    filename,
    uploadedAt: new Date().toISOString(),
    contentSize: contentSize || "200 KB"
  };

  db.applications[index].docs.push(newDoc);
  db.applications[index].updatedAt = new Date().toISOString();
  writeDb(db);

  res.status(201).json(newDoc);
});

// POST add task to application
app.post("/api/applications/:id/tasks", (req, res) => {
  const userId = getAuthUserId(req);
  const { id } = req.params;
  const { title, dueAt } = req.body;

  if (!title || !dueAt) {
    return res.status(400).json({ error: "Task title and date are required" });
  }

  const db = readDb();
  const index = db.applications.findIndex((a: any) => a.id === id && a.userId === userId);

  if (index === -1) {
    return res.status(404).json({ error: "Application not found" });
  }

  const t = {
    id: "task-" + Math.random().toString(36).substring(2, 9),
    title,
    dueAt,
    done: false,
    createdAt: new Date().toISOString()
  };

  db.applications[index].tasks.push(t);
  db.applications[index].updatedAt = new Date().toISOString();

  writeDb(db);
  res.status(201).json(t);
});

// PATCH complete or toggle task
app.patch("/api/applications/:id/tasks/:taskId", (req, res) => {
  const userId = getAuthUserId(req);
  const { id, taskId } = req.params;
  const { done } = req.body;

  const db = readDb();
  const index = db.applications.findIndex((a: any) => a.id === id && a.userId === userId);

  if (index === -1) {
    return res.status(404).json({ error: "Application not found" });
  }

  const taskIndex = db.applications[index].tasks.findIndex((t: any) => t.id === taskId);
  if (taskIndex === -1) {
    return res.status(404).json({ error: "Task not found" });
  }

  db.applications[index].tasks[taskIndex].done = done;
  db.applications[index].updatedAt = new Date().toISOString();

  writeDb(db);
  res.json(db.applications[index].tasks[taskIndex]);
});

// DELETE task
app.delete("/api/applications/:id/tasks/:taskId", (req, res) => {
  const userId = getAuthUserId(req);
  const { id, taskId } = req.params;

  const db = readDb();
  const index = db.applications.findIndex((a: any) => a.id === id && a.userId === userId);

  if (index === -1) {
    return res.status(404).json({ error: "Application not found" });
  }

  db.applications[index].tasks = db.applications[index].tasks.filter((t: any) => t.id !== taskId);
  db.applications[index].updatedAt = new Date().toISOString();

  writeDb(db);
  res.json({ success: true });
});

// POST add note to application
app.post("/api/applications/:id/notes", (req, res) => {
  const userId = getAuthUserId(req);
  const { id } = req.params;
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ error: "Content is required" });
  }

  const db = readDb();
  const index = db.applications.findIndex((a: any) => a.id === id && a.userId === userId);

  if (index === -1) {
    return res.status(404).json({ error: "Application not found" });
  }

  const n = {
    id: "note-" + Math.random().toString(36).substring(2, 9),
    content,
    createdAt: new Date().toISOString()
  };

  db.applications[index].notes.push(n);
  db.applications[index].updatedAt = new Date().toISOString();

  writeDb(db);
  res.status(201).json(n);
});

// POST add contact to application
app.post("/api/applications/:id/contacts", (req, res) => {
  const userId = getAuthUserId(req);
  const { id } = req.params;
  const { name, title, email, phone, notes } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Contact name is required" });
  }

  const db = readDb();
  const index = db.applications.findIndex((a: any) => a.id === id && a.userId === userId);

  if (index === -1) {
    return res.status(404).json({ error: "Application not found" });
  }

  const c = {
    id: "contact-" + Math.random().toString(36).substring(2, 9),
    name,
    title: title || "Recruiter",
    email: email || "",
    phone: phone || "",
    notes: notes || ""
  };

  db.applications[index].contacts.push(c);
  db.applications[index].updatedAt = new Date().toISOString();

  writeDb(db);
  res.status(201).json(c);
});

// GET ICS calendar representation for application task deadlines
app.get("/api/applications/ics-export/:appId/:taskId", (req, res) => {
  const { appId, taskId } = req.params;
  const db = readDb();
  const appItem = db.applications.find((a: any) => a.id === appId);
  if (!appItem) return res.status(404).send("Application not found.");

  const taskItem = appItem.tasks.find((t: any) => t.id === taskId);
  if (!taskItem) return res.status(404).send("Task not found.");

  const due = new Date(taskItem.dueAt);
  const year = due.getUTCFullYear();
  const month = String(due.getUTCMonth() + 1).padStart(2, "0");
  const day = String(due.getUTCDate()).padStart(2, "0");
  const hours = String(due.getUTCHours()).padStart(2, "0");
  const minutes = String(due.getUTCMinutes()).padStart(2, "0");
  const icsTimeStr = `${year}${month}${day}T${hours}${minutes}00Z`;

  const icsStr = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//JobApplicationTrackerPortal//CalendarDeadlines//EN",
    "BEGIN:VEVENT",
    `UID:${taskId}@jobtracker.portal`,
    `DTSTAMP:${icsTimeStr}`,
    `DTSTART:${icsTimeStr}`,
    `SUMMARY:Job Deadline: ${taskItem.title} (${appItem.companyName})`,
    `DESCRIPTION:Reminder of application checklist detail: ${taskItem.title} - ${appItem.roleTitle} at ${appItem.companyName}. Application Portal Link: ${appItem.url || "N/A"}`,
    "STATUS:CONFIRMED",
    "SEQUENCE:0",
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");

  res.setHeader("Content-Type", "text/calendar; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="reminder-${taskId}.ics"`);
  res.send(icsStr);
});

// CSV Export Endpoint
app.get("/api/applications-csv", (req, res) => {
  const userId = getAuthUserId(req);
  const db = readDb();
  const userApps = db.applications.filter((a: any) => a.userId === userId);

  const headers = ["ID", "Company Name", "Job Title", "Location", "Source", "URL", "Salary Note", "Stage", "Status Note", "Date Added"];
  const rows = userApps.map((a: any) => [
    `"${a.id}"`,
    `"${a.companyName.replace(/"/g, '""')}"`,
    `"${a.roleTitle.replace(/"/g, '""')}"`,
    `"${(a.location || "").replace(/"/g, '""')}"`,
    `"${(a.source || "Careers").replace(/"/g, '""')}"`,
    `"${(a.url || "").replace(/"/g, '""')}"`,
    `"${(a.salaryNote || "").replace(/"/g, '""')}"`,
    `"${a.stage}"`,
    `"${(a.statusNote || "").replace(/"/g, '""')}"`,
    `"${a.createdAt}"`
  ]);

  const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\r\n");

  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", "attachment; filename=\"job_applications_export.csv\"");
  res.send(csvContent);
});

// JSON Import Endpoint/Quick-add heuristic parser
app.post("/api/applications/pasted-import", (req, res) => {
  const userId = getAuthUserId(req);
  const { jdText } = req.body;

  if (!jdText || jdText.trim().length === 0) {
    return res.status(400).json({ error: "Pasted text is empty" });
  }

  // Extract company & title heuristics
  let extractedCompany = "Extracted Corp";
  let extractedRole = "Software Dev";

  const lines = jdText.split("\n");
  for (let i = 0; i < Math.min(15, lines.length); i++) {
    const line = lines[i].trim();
    if (/about\s+([A-Za-z0-9\s,&]+)/i.test(line)) {
      const match = line.match(/about\s+([A-Za-z0-9\s,&]+)/i);
      if (match && match[1]) {
        extractedCompany = match[1].split(" ")[0].trim();
        break;
      }
    }
    if (/(google|meta|netflix|amazon|apple|stripe|microsoft|uber|salesforce|nvidia|adobe)/i.test(line)) {
      const match = line.match(/(google|meta|netflix|amazon|apple|stripe|microsoft|uber|salesforce|nvidia|adobe)/i);
      if (match) {
        extractedCompany = match[0].charAt(0).toUpperCase() + match[0].slice(1).toLowerCase();
        break;
      }
    }
  }

  // Check role headings
  for (let i = 0; i < Math.min(10, lines.length); i++) {
    const line = lines[i].trim();
    if (/(engineer|developer|intern|analyst|manager|specialist|designer|scientist)/i.test(line)) {
      if (line.length < 50) {
        extractedRole = line;
        break;
      }
    }
  }

  const db = readDb();
  const newApp = {
    id: "app-" + Math.random().toString(36).substring(2, 9),
    userId,
    companyName: extractedCompany,
    roleTitle: extractedRole,
    location: "Remote / Dynamic",
    source: "Pasted Description Helper",
    url: "",
    salaryNote: "Not specified",
    stage: "SAVED",
    statusNote: "Application auto-created via paste. Customize and update on the grid.",
    jdText,
    skills: ["Extracted Skill"],
    matchScore: 0,
    matchFeedback: "Resume analysis pending. Click 'Tailor with Gemini' on details panel.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tasks: [],
    contacts: [],
    notes: [],
    docs: []
  };

  db.applications.push(newApp);
  writeDb(db);
  res.status(201).json(newApp);
});

// GET analytics summary report of application funnel
app.get("/api/reports/summary", (req, res) => {
  const userId = getAuthUserId(req);
  const db = readDb();
  const userApps = db.applications.filter((a: any) => a.userId === userId);

  const stages = ["SAVED", "APPLIED", "OA", "SCREEN", "TECH", "HM", "OFFER", "REJECTED"];
  const funnelCount: Record<string, number> = {};
  stages.forEach(s => funnelCount[s] = 0);
  userApps.forEach((a: any) => {
    if (funnelCount[a.stage] !== undefined) {
      funnelCount[a.stage]++;
    }
  });

  // Calculate responses rate (anything moved past APPLIED)
  const total = userApps.length;
  const withResponse = userApps.filter((a: any) =>
    a.stage !== "SAVED" && a.stage !== "APPLIED"
  ).length;
  const responseRate = total > 0 ? Math.round((withResponse / total) * 100) : 0;

  const offerCount = userApps.filter((a: any) => a.stage === "OFFER").length;
  const rejectCount = userApps.filter((a: any) => a.stage === "REJECTED").length;

  // Calculate dynamic average resume matching score
  const appsWithMatchScore = userApps.filter((a: any) => typeof a.matchScore === "number" && a.matchScore > 0);
  const averageMatchScore = appsWithMatchScore.length > 0 
    ? Math.round(appsWithMatchScore.reduce((sum: number, a: any) => sum + a.matchScore, 0) / appsWithMatchScore.length) 
    : 78;

  // Timeline representation (group by week of application creation)
  // Group by date or day simply for a nice line chart representation of submissions activity
  const datesMap: Record<string, number> = {};
  userApps.forEach((a: any) => {
    const dateStr = a.createdAt.split("T")[0]; // YYYY-MM-DD
    datesMap[dateStr] = (datesMap[dateStr] || 0) + 1;
  });

  // Sort daily records and return as chart points
  const submissionTimeline = Object.entries(datesMap)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-10); // Last 10 days of active submissions

  res.json({
    funnel: funnelCount,
    totals: {
      total,
      responseRate,
      offers: offerCount,
      rejects: rejectCount,
      averageMatchScore
    },
    timeline: submissionTimeline.length > 0 ? submissionTimeline : [
      { date: "Day-5", count: 1 },
      { date: "Day-4", count: 2 },
      { date: "Day-3", count: 0 },
      { date: "Day-2", count: 1 },
      { date: "Day-1", count: 3 }
    ]
  });
});

// POST tailor application (Smart keyword extractor and Resume tailoring assistant)
app.post("/api/applications/:id/tailor", async (req, res) => {
  const userId = getAuthUserId(req);
  const { id } = req.params;
  const { resumeText } = req.body;

  if (!resumeText || resumeText.trim().length === 0) {
    return res.status(400).json({ error: "Resume text is required to evaluate match." });
  }

  const db = readDb();
  const index = db.applications.findIndex((a: any) => a.id === id && a.userId === userId);

  if (index === -1) {
    return res.status(404).json({ error: "Application details not found" });
  }

  const appItem = db.applications[index];

  // If Gemini client exists, use actual LLM call
  if (ai) {
    try {
      console.log(`Executing server-side Gemini calling for Application ${id} parsing with gemini-3.5-flash`);
      const promptStr = `
You are an expert recruiter and Technical ATS system optimizer.
Analyze the following Job Description and the candidate's Resume.
Compute a fit score (0 to 100).
Identify:
1. Matched modern keywords or skills (found in both the job description and the resume).
2. Missing critical list keywords or skills (found in the job description but omitted or weak in the resume).
3. Practical actionable suggestions to tailor the resume for this position.

--- JOB DESCRIPTION ---
Company: ${appItem.companyName}
Role: ${appItem.roleTitle}
Details & Job Text: ${appItem.jdText || "Software developer and systems engineer."}

--- CANDIDATE RESUME ---
${resumeText}

Format your final reply strictly as valid JSON matching this schema:
{
  "score": number,
  "matchedSkills": string[],
  "missingSkills": string[],
  "tailorSuggestions": string
}
Do not write any markdown codeblock characters outside the JSON. Return raw JSON string only.
`;
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: promptStr,
        config: {
          systemInstruction: "You are a professional ATS system analyzer. Respond strictly in valid JSON.",
          responseMimeType: "application/json",
          temperature: 0.2
        }
      });

      const responseText = response.text || "";
      console.log("Raw response from Gemini:", responseText);

      let parsed;
      try {
        parsed = JSON.parse(responseText.trim());
      } catch (parseErr) {
        // Fallback sanitize
        const match = responseText.match(/\{[\s\S]*\}/);
        if (match) {
          parsed = JSON.parse(match[0]);
        } else {
          throw parseErr;
        }
      }

      // Update db
      db.applications[index].skills = [
        ...new Set([...(parsed.matchedSkills || []), ...(parsed.missingSkills || [])])
      ];
      db.applications[index].matchScore = Math.min(100, Math.max(0, parsed.score || 50));
      db.applications[index].matchFeedback = parsed.tailorSuggestions || "Review details carefully.";
      db.applications[index].updatedAt = new Date().toISOString();

      writeDb(db);
      return res.json({
        matchScore: db.applications[index].matchScore,
        skills: db.applications[index].skills,
        matchFeedback: db.applications[index].matchFeedback,
        matchedSkills: parsed.matchedSkills || [],
        missingSkills: parsed.missingSkills || []
      });

    } catch (err: any) {
      console.error("Gemini tailer request failed, using high-fidelity fallback:", err);
    }
  }

  // Fallback high-fidelity parser
  console.log("Using fall-back heuristic ATS evaluation.");
  const jdLower = (appItem.jdText || "").toLowerCase();
  const resumeLower = resumeText.toLowerCase();

  const standardSkills = ["react", "node", "express", "mongodb", "typescript", "javascript", "python", "java", "sql", "git", "aws", "docker"];
  const matched: string[] = [];
  const missing: string[] = [];

  standardSkills.forEach(s => {
    const regex = new RegExp("\\b" + s + "\\b", "i");
    if (regex.test(jdLower)) {
      if (regex.test(resumeLower)) {
        matched.push(s.toUpperCase());
      } else {
        missing.push(s.toUpperCase());
      }
    }
  });

  const totalKeywords = matched.length + missing.length;
  const calculatedScore = totalKeywords > 0 ? Math.round((matched.length / totalKeywords) * 100) : 60;

  const suggestions = [
    `Add explicit achievements showing you worked with: ${missing.join(", ") || "the specific technology stacks mentioned"}.`,
    `Quantify your experience. For example: "Designed highly interactive frontend pages increasing user engagement by 25%."`,
    `Ensure your technical skills section uses accurate keywords so ATS compilers index your resume successfully.`
  ].join("\n");

  db.applications[index].matchScore = calculatedScore;
  db.applications[index].matchFeedback = suggestions;
  db.applications[index].skills = [...new Set([...matched, ...missing])];
  db.applications[index].updatedAt = new Date().toISOString();

  writeDb(db);

  res.json({
    matchScore: calculatedScore,
    skills: db.applications[index].skills,
    matchFeedback: suggestions,
    matchedSkills: matched,
    missingSkills: missing
  });
});

// Simulated Supabase/PostgreSQL Relational DB SQL Query sandbox
app.post("/api/supabase/query", (req, res) => {
  const userId = getAuthUserId(req);
  const { sql } = req.body;
  if (!sql) return res.status(400).json({ error: "No SQL command specified" });

  const db = readDb();
  // We filter to current user data
  const userApplications = db.applications.filter((a: any) => a.userId === userId);

  const cleanSql = sql.trim().replace(/;$/, "");
  const upperSql = cleanSql.toUpperCase();

  try {
    if (upperSql.startsWith("SELECT")) {
      let fromTable = "applications";
      if (upperSql.includes("FROM USERS")) fromTable = "users";
      else if (upperSql.includes("FROM TASKS")) fromTable = "tasks";
      else if (upperSql.includes("FROM CONTACTS")) fromTable = "contacts";
      else if (upperSql.includes("FROM NOTES")) fromTable = "notes";

      let sourceData: any[] = [];
      if (fromTable === "applications") {
        sourceData = userApplications.map((a: any) => ({
          id: a.id,
          company_name: a.companyName,
          role_title: a.roleTitle,
          location: a.location,
          stage: a.stage,
          salary_note: a.salaryNote,
          match_score: a.matchScore,
          created_at: a.createdAt
        }));
      } else if (fromTable === "users") {
        sourceData = db.users.filter((u: any) => u.id === userId).map((u: any) => ({
          id: u.id,
          name: u.name,
          email: u.email
        }));
      } else if (fromTable === "tasks") {
        sourceData = userApplications.flatMap((a: any) => (a.tasks || []).map((t: any) => ({
          id: t.id,
          application_id: a.id,
          title: t.title,
          done: t.done ? 1 : 0,
          due_at: t.dueAt
        })));
      } else if (fromTable === "contacts") {
        sourceData = userApplications.flatMap((a: any) => (a.contacts || []).map((c: any) => ({
          id: c.id,
          application_id: a.id,
          name: c.name,
          title: c.title,
          email: c.email
        })));
      } else if (fromTable === "notes") {
        sourceData = userApplications.flatMap((a: any) => (a.notes || []).map((n: any) => ({
          id: n.id,
          application_id: a.id,
          content: n.content,
          created_at: n.createdAt
        })));
      }

      let filteredData = [...sourceData];
      const whereIdx = upperSql.indexOf("WHERE");
      if (whereIdx !== -1) {
        const whereClause = cleanSql.substring(whereIdx + 5).trim();
        const matchEq = whereClause.match(/([a-zA-Z_0-9]+)\s*=\s*(['"])([^'"]+)\2/i);
        const matchGt = whereClause.match(/([a-zA-Z_0-9]+)\s*>\s*([0-9]+)/i);
        const matchLt = whereClause.match(/([a-zA-Z_0-9]+)\s*<\s*([0-9]+)/i);

        if (matchEq) {
          const field = matchEq[1].toLowerCase();
          const val = matchEq[3].toLowerCase();
          filteredData = filteredData.filter((row: any) => {
            const rawVal = row[field] !== undefined ? row[field] : row[matchEq[1]];
            return String(rawVal || "").toLowerCase() === val;
          });
        } else if (matchGt) {
          const field = matchGt[1].toLowerCase();
          const val = parseInt(matchGt[2], 10);
          filteredData = filteredData.filter((row: any) => {
            const rawVal = row[field] !== undefined ? row[field] : row[matchGt[1]];
            return parseInt(rawVal || 0, 10) > val;
          });
        } else if (matchLt) {
          const field = matchLt[1].toLowerCase();
          const val = parseInt(matchLt[2], 10);
          filteredData = filteredData.filter((row: any) => {
            const rawVal = row[field] !== undefined ? row[field] : row[matchLt[1]];
            return parseInt(rawVal || 0, 10) < val;
          });
        }
      }

      const selectIdx = upperSql.indexOf("SELECT");
      const fromIdx = upperSql.indexOf("FROM");
      const colsPart = cleanSql.substring(selectIdx + 6, fromIdx).trim();
      if (colsPart !== "*") {
        const targetCols = colsPart.split(",").map((c: string) => c.trim().toLowerCase());
        filteredData = filteredData.map((row: any) => {
          const newRow: any = {};
          targetCols.forEach((col: string) => {
            const rowKeys = Object.keys(row);
            const keyMatch = rowKeys.find(k => k.toLowerCase() === col) || col;
            newRow[col] = row[keyMatch];
          });
          return newRow;
        });
      }

      return res.json({
        success: true,
        command: "SELECT",
        rowsAffected: filteredData.length,
        data: filteredData
      });
    }

    if (upperSql.startsWith("UPDATE")) {
      const setIdx = upperSql.indexOf("SET");
      const whereIdx = upperSql.indexOf("WHERE");

      if (setIdx === -1 || whereIdx === -1) {
        return res.status(400).json({ error: "Invalid UPDATE command syntax. Use syntax: UPDATE applications SET stage = 'OFFER' WHERE id = 'app-1';" });
      }

      const assignment = cleanSql.substring(setIdx + 3, whereIdx).trim();
      const whereClause = cleanSql.substring(whereIdx + 5).trim();

      const assignMatch = assignment.match(/([a-zA-Z_0-9]+)\s*=\s*(['"])([^'"]+)\2/);
      const whereMatch = whereClause.match(/id\s*=\s*(['"])([^'"]+)\1/i);

      if (!assignMatch || !whereMatch) {
        return res.status(400).json({ error: "Unsupported UPDATE query structure. Best syntax: UPDATE applications SET stage = 'OFFER' WHERE id = 'app-1';" });
      }

      const updateFieldRaw = assignMatch[1];
      const updateVal = assignMatch[3];
      const targetId = whereMatch[2];

      const appIndex = db.applications.findIndex((a: any) => a.id === targetId && a.userId === userId);
      if (appIndex === -1) {
        return res.status(404).json({ error: `Record matching key identifier ${targetId} not found.` });
      }

      let updateFieldMap = updateFieldRaw;
      if (updateFieldRaw.toLowerCase() === "company_name") updateFieldMap = "companyName";
      if (updateFieldRaw.toLowerCase() === "role_title") updateFieldMap = "roleTitle";
      if (updateFieldRaw.toLowerCase() === "salary_note") updateFieldMap = "salaryNote";

      db.applications[appIndex][updateFieldMap] = updateVal;
      db.applications[appIndex].updatedAt = new Date().toISOString();
      writeDb(db);

      return res.json({
        success: true,
        command: "UPDATE",
        rowsAffected: 1,
        data: [{
          id: db.applications[appIndex].id,
          company_name: db.applications[appIndex].companyName,
          role_title: db.applications[appIndex].roleTitle,
          stage: db.applications[appIndex].stage
        }]
      });
    }

    return res.status(400).json({
      error: "Relational constraints error: Simulated Supabase Row-Level Policy restricts user context actions to SELECT queries and simple metadata UPDATE protocols only."
    });

  } catch (err: any) {
    res.status(500).json({ error: "System query exception: " + err.message });
  }
});

// Handle serving the React client SPA or the Vite developer proxy
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
    console.log("Express coupled Vite developer middlewares initialized successfully.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Configured static folder to serve Client static files.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Job Application Tracker Portal backend server active at http://0.0.0.0:${PORT}`);
  });
}

startServer();
