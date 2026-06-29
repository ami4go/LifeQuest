# ⚔️ LifeQuest AI — A Game Engine for Real-Life Goals

> **Live Production Build:** [https://lifequest-ai-adfe7.web.app](https://lifequest-ai-adfe7.web.app)

LifeQuest AI is a gamified productivity application designed to solve a fundamental problem: traditional to-do lists are boring, unmotivating, and fail to address *why* we procrastinate. 

Instead of just listing tasks, LifeQuest AI acts as a **Game Engine for your life**. It uses Artificial Intelligence to decompose massive, overwhelming goals into structured "Missions", and breaks those down into actionable, bite-sized "Quests". It diagnoses your unique productivity archetype and tailors the experience to help you overcome your specific hurdles.

---

## 🎯 1. What We Built (Feature Set)

We built a comprehensive, mobile-first web application featuring a blend of AI generation, real-time gamification, and social accountability.

### Core Gamification Engine
*   **XP & Leveling System:** Earn XP for completing quests. Level up from "Initiate" to "Legend".
*   **Rank Titles & Badges:** Unlock achievements (e.g., "Boss Slayer", "Undefeated", "Summer Grinder 2026") based on specific behaviors.
*   **Dynamic XP Modifiers:** Earn bonuses for early completion (+75%), maintaining streaks (+10%), or successfully utilizing "Focus Lock" (+50%).

### AI-Powered Features (Powered by Google Gemini)
*   **Archetype Diagnosis:** An onboarding questionnaire analyzes the user's psychology to determine their productivity archetype (e.g., Procrastinator, Perfectionist, Overloaded) and tailors AI responses accordingly.
*   **Goal Decomposition:** Users speak or type a massive goal. The AI automatically breaks it down into major milestones (Missions) and actionable steps (Quests), complete with difficulty ratings and time estimates.
*   **Anti-Avoidance System:** If a user opens a quest 3 times without completing it, the AI intercepts. It diagnoses *why* they are avoiding it based on their archetype and offers to restructure the quest into something less intimidating.
*   **AI Proof Verification:** Users upload photos or documents as proof of completion. Gemini's multimodal capabilities analyze the proof, verify it matches the quest, scores the quality (1-5), and awards bonus XP.
*   **Boss Battles:** Final deadlines are treated as "Boss Battles." The AI generates specific "prep quests" to ensure the user is ready for the final push.

### Social & Competitive Mechanics
*   **Duel System:** Challenge a friend to a specific quest via email. Both players receive the quest; the first to finish (or the one with higher AI-verified quality) wins the duel and earns massive bonus XP.
*   **Global Leaderboard:** A real-time ranking of the top adventurers based on total XP.

---

## 🏗️ 2. How We Built It (Technical Architecture)

### Tech Stack
*   **Frontend Framework:** React 18 + Vite (Fast HMR, optimized builds).
*   **Styling:** Vanilla CSS with custom properties (CSS variables) for a robust, flexible design system (Dark mode, glassmorphism, dynamic gradients).
*   **Routing:** React Router v6 for protected routes and smooth SPA navigation.
*   **Backend & Database:** Firebase (Authentication, Firestore Database, Hosting).
*   **AI Integration:** `@google/genai` SDK using `gemini-2.5-flash` for fast, cost-effective multimodal generation.

### Architecture & Data Flow
1.  **State Management:** We utilized React Context (`AuthContext`, `QuestContext`) to manage global state. `QuestContext` handles real-time Firestore subscriptions, ensuring the UI updates instantly across all devices when a quest is modified.
2.  **Firestore Schema:**
    *   `users`: Stores profile data, XP, level, archetype, and streak info.
    *   `missions`: Groups of quests belonging to a specific goal.
    *   `quests`: Individual actionable items, linked to missions.
    *   `duels`: Tracks challenger vs. opponent state, deadlines, and winners.
3.  **AI Service Layer (`src/services/aiService.js`):** We abstracted all Gemini API calls into a dedicated service. This service utilizes structured prompts enforcing strict JSON responses, ensuring the AI outputs predictable data structures that the React UI can safely parse and render.
4.  **PWA Configuration:** We implemented a `manifest.json` and meta tags to allow the app to be installed as a Progressive Web App on mobile devices, providing a native-like full-screen experience.

---

## 🧠 3. Why We Built It This Way (In-Depth Analysis)

### The Problem with Traditional Productivity Tools
Most task managers assume humans operate like machines: input task, execute task. They ignore human psychology. When a user writes "Launch Startup" on a to-do list, they experience cognitive overload. The brain doesn't know where to start, leading to avoidance and procrastination.

### Our Solution: The Gamification & AI Synthesis
We designed LifeQuest AI to directly counter cognitive overload and lack of motivation.

1.  **Why AI Decomposition?** 
    By automatically breaking "Launch Startup" into "Mission 1: Market Research" → "Quest 1: Register domain name", we lower the activation energy required to start. 
2.  **Why Archetypes?** 
    Productivity isn't one-size-fits-all. A *Perfectionist* needs permission to write a messy first draft (which the AI will suggest). A *Procrastinator* needs a 5-minute micro-task to build momentum. The AI tailors its advice based on this psychological profile.
3.  **Why "Focus Lock"?** 
    Behavioral economics shows that humans are loss-averse. "Focus Lock" allows users to manufacture stakes. By locking a quest, they risk losing XP if they fail, which triggers loss aversion and forces action.
4.  **Why AI Proof Verification?** 
    Gamification often fails because users can simply click "Done" without doing the work. By requiring photographic/document proof and having an AI judge it, we introduce a "Proof of Work" mechanism that prevents cheating and encourages higher quality output.
5.  **Why Duels?** 
    Social accountability is one of the strongest human motivators. Competing against a friend turns a mundane chore into a race.

### Technical Decisions
*   **Why Firebase?** We needed real-time capabilities for the Gamification (XP updates, Leaderboard changes) and Duels. Firestore's websocket-based subscriptions made this seamless.
*   **Why Vanilla CSS instead of Tailwind?** We wanted absolute control over complex micro-animations, glassmorphism effects, and dynamic theming to achieve a highly specific "premium gaming" aesthetic that would wow users instantly.
*   **Why Gemini Flash?** The anti-avoidance and goal decomposition features require near-instant responses to maintain the illusion of a responsive "Game Engine." The Flash model provided the perfect balance of speed, multimodal capability (for proof verification), and cost-effectiveness.

---

## 📈 4. Task Tracking & Implementation History

We executed this project in intense phases, going from concept to production in under 48 hours.

### ✅ Phase 1: Foundation
*   Initialized Vite + React, configured Firebase & Gemini.
*   Built the Design System (`index.css`) establishing the glassmorphic aesthetic.
*   Implemented Google Auth and protected routing.

### ✅ Phase 2: Onboarding & Psychology
*   Built the 8-question psychological assessment.
*   Created the scoring engine to determine user Archetypes.

### ✅ Phase 3: AI Engine Integration
*   Built the Goal Intake page with voice recognition (Web Speech API).
*   Engineered the structured JSON prompts for `decomposeGoal`.
*   Mapped AI outputs to Firestore `missions` and `quests` collections.

### ✅ Phase 4: Core Gameplay Loop
*   Built the Dashboard and nested Mission-centric UI.
*   Implemented XP math, Level calculations, and Rank titles.
*   Created the "Focus Lock" high-stakes mechanism.
*   Engineered the Multimodal AI Proof Verification system.

### ✅ Phase 5: Advanced Features & Polish
*   Implemented the Anti-Avoidance detection and AI restructuring modal.
*   Built the Duel System (Firestore schema + UI for challenging friends).
*   Created the Boss Battle page and AI prep-quest generator.
*   Built the Global Leaderboard.
*   Configured PWA manifest for mobile installability.
*   Resolved Firebase caching issues for production deployment.

---

**Built with ❤️ and 🤖 for the Vibe2Ship Hackathon.**
