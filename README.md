# ⚡ LifeQuest AI — A Game Engine for Real-Life Goals

> Stop escaping into games to feel achievement. **Start achieving in reality.**

LifeQuest AI is an AI-powered productivity companion that turns your real-life goals into a role-playing game — complete with **missions, quests, XP, ranks, coins, duels, and boss-grade deadlines**. At its core is **Google Gemini**, acting as an autonomous engine that *decomposes* your goals, *evaluates* your work, *decides* fair penalties, *plans* your day, and even *awards hidden achievements* for the grind it quietly notices.

Built for the **Vibe2Ship Hackathon** — Problem Statement: *The Last-Minute Life Saver*.

🔗 **Live App:** https://lifequest-ai-adfe7.web.app
📦 **Repository:** https://github.com/ami4go/LifeQuest

---

## 🎯 The Problem

Students, professionals, and entrepreneurs constantly miss deadlines, assignments, and commitments. Traditional productivity tools rely on **passive reminders that are easy to ignore** and do nothing to help people actually *start* and *finish* the work.

LifeQuest AI moves beyond reminders. It uses AI to **proactively plan, prioritize, motivate, and verify** — converting the dread of a deadline into the dopamine of a quest.

---

## ✨ Key Features

### 🧠 Agentic AI (powered by Gemini)
- **AI Goal Decomposition** — Type or *speak* a goal + deadline; Gemini breaks it into a structured **mission tree** of bite-sized quests, each with a difficulty rating and time estimate, calibrated to your psychology.
- **Archetype Engine** — An 8-question onboarding diagnoses your procrastination archetype (Procrastinator, Perfectionist, Time Optimist, Overloaded, Low Motivation). The AI then tailors every quest and tip to *your* failure mode.
- **AI Daily Planner** — A one-tap agent that prioritizes your day to beat the closest deadlines, with archetype-aware tips and energy advice.
- **AI Proof Verification** — Upload your work (image/PDF/text); Gemini's **multimodal** evaluator scores it **1–5** with specific strengths and improvements, then awards XP + coins.
- **Anti-Avoidance System** — Open a quest too many times without finishing? The AI diagnoses *why* you're avoiding it and **restructures it** into an easier first step.
- **AI-Decided Penalties** — Drop a task and Gemini weighs the task's complexity *and your personal track record* to set a **fair** HP/coin loss — not a blunt flat fee.
- **Certificate AI Scoring** — Upload a certificate/achievement; the AI verifies it and awards **1–500 coins** scaled by significance.
- **Secret Achievement Agent** — Upload contest/hackathon proofs and the AI **silently tracks your grind**, unlocking hidden badges + HP/coin boosts when you hit thresholds.

### 🎮 Gamification & Engagement
- **Quests Dashboard** — Three smart sections: **Priority** (top 5 by deadline + points), **All Quests** (with a show-N selector), and **Completed** — all auto-sorted. A live HUD shows XP, level, rank, and coins.
- **Focus Lock** — Bet on yourself: **+50% XP** if you deliver on time, **−25%** if you miss. Real stakes, real motivation.
- **Duels Arena** — Challenge friends to custom or **AI-generated** challenges. Gemini evaluates each submission; a full **scorecard table** (Player × Task × Submission × Score) shows everyone's results, and the winner is decided instantly the moment everyone finishes.
- **Coins Economy & Rewards** — Earn coins from AI-evaluated work; track **Total Earned · Spent · Remaining**; redeem merch; browse full transaction history.
- **Badges System** — **Unlocked**, **Locked** (good *and* penalty badges), plus the **"Redemption Arc"**: earn *antidote* badges (e.g. **Sloth Basher**) to cancel out penalty badges (e.g. **The Sloth**).
- **Global Leaderboard** — Podium + ladder, ranked by XP across all operators.
- **Live Notifications** — A real-time activity feed for duel challenges, badges earned, coins, and level-ups.

### 🎨 Experience
- **Mobile-first, console-grade UI** — A cohesive cyber/HUD design system with a bottom tab bar + center action button.
- **Accent themes** — Pick your signature accent color; edit your profile in Settings.
- **Voice input** — Dictate goals with the Web Speech API.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **AI** | **Google Gemini** (`gemini-2.5-flash`) via the `@google/genai` SDK — multimodal text + image |
| **Auth** | **Firebase Authentication** (Google Sign-In) |
| **Database** | **Cloud Firestore** (real-time listeners) |
| **Hosting** | **Firebase Hosting** |
| **Frontend** | React 19, Vite 8, React Router 7 |
| **UI** | Custom CSS design system, `lucide-react` icons |

### 🟦 Google Technologies Used
- **Google Gemini API** — the agentic brain behind decomposition, evaluation, planning, penalties, and certificate scoring (text **and** vision).
- **Firebase (Google Cloud)** — Authentication, Firestore, and Hosting.
- **Google Sign-In (OAuth 2.0)** — one-tap account creation.
- **Google AI Studio** — used to design, test, and refine the Gemini prompts that power each agent.

---

## 🧩 Architecture

```
src/
├── config/          # Firebase + Gemini client setup
├── contexts/        # AuthContext, QuestContext, NotificationContext, ThemeContext
├── services/        # aiService (Gemini), duelService, coinService, badgeService, notificationService
├── utils/           # levelSystem, xpCalculator, archetypeEngine, constants
├── components/      # MobileShell (top HUD + tab bar + side menu + notifications)
└── pages/           # Landing, Onboarding, GoalIntake, Dashboard, QuestDetail,
                     # Duels, Leaderboard, Rewards, Badges, Profile, Settings, Schedule
```

- **`aiService.js`** centralizes every Gemini call: `decomposeGoal`, `evaluateTaskSubmission`, `diagnoseAvoidance`, `generateSchedule`, `decidePenalty`, `verifyCertificate`, `suggestDuelChallenges`, and more — each returning structured JSON with graceful fallbacks.
- **Real-time everywhere** — the user profile and quest/duel data stream from Firestore via `onSnapshot`, so XP, coins, and badges update instantly across the app.

---

## 🚀 Run It Locally

### Prerequisites
- Node.js 18+
- A Firebase project (Auth + Firestore enabled)
- A Google Gemini API key ([Google AI Studio](https://aistudio.google.com/))

### 1. Install
```bash
npm install
```

### 2. Configure environment
Create a `.env` file in the project root:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Develop
```bash
npm run dev
```

### 4. Build & Deploy
```bash
npm run build
firebase deploy --only hosting
```

---

## 🏆 How It Maps to the Evaluation Criteria

| Criterion | How LifeQuest AI delivers |
|---|---|
| **Agentic Depth** | Gemini autonomously decomposes goals, evaluates work, decides penalties, plans days, and awards hidden badges — each a real decision, not a static response. |
| **Problem Solving & Impact** | Directly attacks deadline-missing by making *starting* and *finishing* rewarding; the AI planner + anti-avoidance push users to action. |
| **Innovation & Creativity** | Archetype-driven personalization, Focus-Lock stakes, AI-judged duels, and the badge "Redemption Arc" are novel takes on productivity. |
| **Use of Google Technologies** | Built end-to-end on Gemini + Firebase + Google Sign-In, designed in Google AI Studio. |
| **Product Experience & Design** | A polished, mobile-first, console-grade UI with a live HUD and instant feedback. |
| **Technical Implementation** | Clean context/service architecture, real-time Firestore, structured-JSON AI calls with graceful fallbacks. |

---

*Built with ⚡ for Vibe2Ship 2026.*
