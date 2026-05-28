/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum ApplicationStage {
  SAVED = "SAVED",
  APPLIED = "APPLIED",
  OA = "OA", // Online Assessment
  SCREEN = "SCREEN",
  TECH = "TECH", // Technical Interview
  HM = "HM", // Hiring Manager Interview
  OFFER = "OFFER",
  REJECTED = "REJECTED"
}

export interface Task {
  id: string;
  title: string;
  dueAt: string;
  done: boolean;
  createdAt: string;
}

export interface Contact {
  id: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  notes: string;
}

export interface Note {
  id: string;
  content: string;
  createdAt: string;
}

export interface Document {
  id: string;
  kind: "resume" | "cover" | "portfolio" | "other";
  filename: string;
  uploadedAt: string;
  contentSize?: string;
}

export interface JobApplication {
  id: string;
  userId: string;
  companyName: string;
  roleTitle: string;
  location: string;
  source: string; // LinkedIn, referral, careers, etc.
  url: string;
  salaryNote: string;
  stage: ApplicationStage;
  statusNote: string;
  jdText: string;
  skills: string[];
  matchScore?: number;
  matchFeedback?: string;
  createdAt: string;
  updatedAt: string;
  tasks: Task[];
  contacts: Contact[];
  notes: Note[];
  docs: Document[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  role?: "candidate" | "admin";
}

// Interactive metadata of the portal for Student Course evaluation
export interface InterviewQuestion {
  number: number;
  question: string;
  hrAnswer: string;
  techAnswer: string;
  category: "Technical" | "Behavioral" | "System Design" | "General";
}

export interface TutorialPhase {
  phase: string;
  title: string;
  objective: string;
  steps: string[];
  mistakes: string[];
}
