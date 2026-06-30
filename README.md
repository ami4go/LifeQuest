# ⚡ LifeQuest AI — A Game Engine for Real-Life Goals

> Stop escaping into games to feel achievement. **Start achieving in reality.**

LifeQuest AI is an AI-powered productivity companion that turns your real-life goals into a role-playing game — complete with **missions, quests, XP, ranks, coins, duels, and boss-grade deadlines**. At its core is **Google Gemini**, acting as an autonomous engine that *decomposes* your goals, *evaluates* your work, *decides* fair penalties, *plans* your day, and even *awards hidden achievements* for the grind it quietly notices.

Built for the **Vibe2Ship Hackathon** — Problem Statement: *The Last-Minute Life Saver*.

🔗 **Live App:** https://lifequest-ai-1045306899439.asia-southeast1.run.app
📦 **Repository:** https://github.com/ami4go/LifeQuest
📝 **User Study Survey:** https://docs.google.com/forms/d/e/1FAIpQLSeBqRJQCVbBWFNhE5ZKi5eyNYj8RxQGI_RvApxpjswvTRWIQA/viewform

**Note:** For the best UI experience, please use the application on a mobile phone!

---

## 🎯 The Problem

Students, professionals, and entrepreneurs constantly miss deadlines, assignments, and commitments. Traditional productivity tools rely on **passive reminders that are easy to ignore** and do nothing to help people actually *start* and *finish* the work. The psychological barrier isn't forgetting — it's **hesitation**, the moment a person opens a task, feels overwhelmed, and closes it without acting.

LifeQuest AI moves beyond reminders. It uses AI to **proactively plan, prioritize, motivate, and verify** — converting the dread of a deadline into the dopamine of a quest. More importantly, it incorporates principles from **Human Momentum Theory** to detect and break through hesitation before it turns into full procrastination.

---

## ✨ Key Features

### 🧠 Agentic AI (Powered by Gemini)

- **AI Goal Decomposition** — Type or *speak* a goal + deadline; Gemini breaks it into a structured **mission tree** of bite-sized quests, each with a difficulty rating and time estimate, calibrated to your psychology.
- **Archetype Engine** — An 8-question onboarding diagnoses your procrastination archetype (Procrastinator, Perfectionist, Time Optimist, Overloaded, Low Motivation). The AI then tailors every quest and tip to *your* failure mode.
- **AI Daily Planner** — A one-tap agent that prioritizes your day to beat the closest deadlines, with archetype-aware tips and energy advice.
- **AI Proof Verification** — Upload your work (image/PDF/text); Gemini's **multimodal** evaluator scores it **1–5** with specific strengths and improvements, then awards XP + coins. This acts as an **impartial AI evaluator** to ensure absolute fairness in the reward system.
- **Anti-Avoidance / Hesitation Detection System** — Open a quest too many times without finishing? The AI detects this as a "Hesitation Window," diagnoses *why* you're avoiding it, and proposes the **Smallest Next Action** — restructuring the quest into an easier first step to restore momentum.
- **AI-Decided Penalties** — Drop a task and Gemini weighs the task's complexity *and your personal track record* to set a **fair** HP/coin loss — not a blunt flat fee. Repeat offenders get harsher penalties; users with strong streaks get more grace.
- **Certificate AI Scoring** — Upload a certificate/achievement; the AI verifies it and awards **1–500 coins** scaled by significance.
- **Secret Achievement Agent** — Upload contest/hackathon proofs and the AI **silently tracks your grind**, unlocking hidden badges + HP/coin boosts when you hit thresholds.

### 🌡️ Human Momentum Theory Integration

We studied and adapted behavioral science principles from the Human Momentum Theory to go beyond traditional gamification:

- **Value Before Setup** — The onboarding immediately asks *"What goal worries you the most right now?"* to capture the user's emotional hesitation upfront instead of burying them in configuration screens.
- **Project Temperature Indicators** — Each quest group on the dashboard displays a live "temperature" tag (🔥 Hot, 🌊 Stable, 🧊 Cooling) based on the ratio of progress made vs. time elapsed. This gives users a visceral, at-a-glance sense of which projects are losing momentum, which is a much softer and more effective nudge than a harsh "OVERDUE" label.
- **Hesitation Window Detection** — When the system detects a user repeatedly opening a challenge without completing it, it triggers the "Hesitation Detected" modal. Instead of nagging, it prescribes the **Smallest Next Action** — shrinking the cognitive load from "Finish this project" to "Just write the first sentence."
- **Reality Feed** — The notification panel has been reframed as a "Reality Feed," shifting the language from passive "activity logs" to an active record of the user's real-world momentum, making progress feel tangible.

### 🎮 Gamification & Engagement

- **Quest Name → Mission → Challenge Hierarchy** — The dashboard shows high-level Quest Names. Clicking a Quest reveals its internal Missions (milestones). Clicking a Mission navigates to the individual Challenges, keeping the main view clean and uncluttered.
- **Auto-Completion** — When a user checks off the final challenge in a mission, the system automatically marks the mission (and the parent quest, if all missions are done) as complete. No extra button needed — designed for the "lazy user."
- **Quest History** — Completed and dropped quests are moved off the main dashboard to a dedicated Quest History page (accessible from the side menu), categorized into **Ongoing**, **Completed**, and **Dropped/Skipped** sections.
- **Focus Lock** — Bet on yourself: **+50% XP** if you deliver on time, **−25%** if you miss. Real stakes, real motivation.
- **Duels Arena** — Challenge friends to custom or **AI-generated** challenges. Gemini evaluates each submission; a full **scorecard table** (Player × Task × Submission × Score) shows everyone's results, and the winner is decided instantly the moment everyone finishes.
- **Coins Economy & Rewards** — Earn coins from AI-evaluated work; track **Total Earned · Spent · Remaining**; redeem merch; browse full transaction history.
- **Badges System** — **Unlocked**, **Locked** (good *and* penalty badges), plus the **"Redemption Arc"**: earn *antidote* badges (e.g. **Sloth Basher**) to cancel out penalty badges (e.g. **The Sloth**). Users who aren't performing well receive penalty badges, but we give them an opportunity to swap these bad badges — recovering their profile score and earning bonus coins in the process!
- **Global Leaderboard & Notifications** — Podium + ladder, ranked by XP across all operators, plus a real-time activity feed.

### 🎨 Experience

- **Mobile-first, console-grade UI** — A cohesive cyber/HUD design system with a bottom tab bar + center action button. The entire UI and logo were designed using **Stitch** for a premium, console-grade cyber aesthetic.
- **Accent Themes** — Pick your signature accent color; edit your profile in Settings.
- **Voice Input** — Dictate goals with the Web Speech API.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **AI** | **Google Gemini** (`gemini-2.5-flash`) via the `@google/genai` SDK — multimodal text + image |
| **Auth** | **Firebase Authentication** (Google Sign-In) |
| **Database** | **Cloud Firestore** (real-time listeners) |
| **Hosting** | **Google Cloud Run** (via Google AI Studio) |
| **Frontend** | React 19, Vite 8, React Router 7 |
| **UI Design** | **Stitch** (UI design & logo generation), Custom CSS design system, `lucide-react` icons |

### 🟦 Google Technologies Utilized

- **Google Gemini API (`gemini-2.5-flash`)** — the agentic brain behind decomposition, evaluation, planning, penalties, anti-avoidance, certificate scoring, and duel-challenge generation (text **and** vision / multimodal).
- **Firebase (Google Cloud):**
  - **Firebase Authentication** with **Google Sign-In (OAuth 2.0)** for one-tap onboarding.
  - **Cloud Firestore** for real-time data (quests, duels, coins, badges, notifications) streamed via live listeners.
- **Google Cloud Run** — for hosting the deployed, publicly accessible production build.
- **Google AI Studio** — used to design, test, and iterate on the Gemini prompts that power each AI agent. Also used as the primary development and deployment environment.
- **Stitch** — Leveraged extensively for UI design and logo generation, giving the app its cohesive, console-grade cyber aesthetic.

---

## 🧩 Architecture

```
app/src/
├── config/          # Firebase + Gemini client setup
├── contexts/        # AuthContext, QuestContext, NotificationContext, ThemeContext
├── services/        # aiService (Gemini), duelService, coinService, badgeService, notificationService
├── utils/           # levelSystem, xpCalculator, archetypeEngine, constants
├── components/      # MobileShell (top HUD + tab bar + side menu + notifications)
└── pages/           # Landing, Onboarding, GoalIntake, Dashboard, MissionDetail, QuestDetail,
                     # QuestHistory, Duels, Leaderboard, Rewards, Badges, Profile, Settings, Schedule
```

- **`aiService.js`** centralizes every Gemini call: `decomposeGoal`, `evaluateTaskSubmission`, `diagnoseAvoidance`, `generateSchedule`, `decidePenalty`, `verifyCertificate`, `suggestDuelChallenges`, `generateDuelMissionTree`, and more — each returning structured JSON with graceful fallbacks.
- **Real-time everywhere** — the user profile and quest/duel data stream from Firestore via `onSnapshot`, so XP, coins, and badges update instantly across the app.
- **Quest Hierarchy** — Goals are decomposed into Quests (top-level names) → Missions (milestones) → Challenges (actionable tasks), with auto-completion logic that bubbles up from individual challenges to the mission and quest levels.

---

## 🚀 Run It Locally

### Prerequisites
- Node.js 18+ (we recommend using NVM: `nvm install 20`)
- A Firebase project (Auth + Firestore enabled)
- A Google Gemini API key ([Google AI Studio](https://aistudio.google.com/))

### 1. Clone & Install
```bash
git clone https://github.com/ami4go/LifeQuest.git
cd LifeQuest/app
npm install
```

### 2. Configure Environment
Create a `.env` file in the `app/` directory:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Run Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser (mobile view recommended).

### 4. Build & Deploy
```bash
npm run build
```

---

## 📊 User Study

We conducted a **Productivity & Deadline Management Research** survey to validate our assumptions about how people manage tasks, assignments, and deadlines. The survey covers:

- How users currently track deadlines and commitments
- Common reasons for missing deadlines (overwhelm, forgetfulness, underestimation)
- Attitudes toward AI assistance in productivity workflows
- Interest in gamified accountability systems

📝 **Survey Link:** https://docs.google.com/forms/d/e/1FAIpQLSeBqRJQCVbBWFNhE5ZKi5eyNYj8RxQGI_RvApxpjswvTRWIQA/viewform

---

## 🏆 How It Maps to the Evaluation Criteria

| Criterion | How LifeQuest AI Delivers |
|---|---|
| **Agentic Depth** | Gemini autonomously decomposes goals, evaluates work, decides penalties, plans days, detects hesitation, and awards hidden badges — each a real decision, not a static response. |
| **Problem Solving & Impact** | Directly attacks deadline-missing by making *starting* and *finishing* rewarding; the AI planner + Hesitation Detection + Smallest Next Action push users to action at the exact moment they freeze. |
| **Innovation & Creativity** | Archetype-driven personalization, Focus-Lock stakes, AI-judged duels, the badge "Redemption Arc," Temperature indicators, and Hesitation Window detection are novel takes on productivity. |
| **Use of Google Technologies** | Built end-to-end on Gemini + Firebase + Google Sign-In + Google Cloud Run, designed in Google AI Studio, UI crafted with Stitch. |
| **Product Experience & Design** | A polished, mobile-first, console-grade UI with a live HUD, clean Quest→Mission→Challenge hierarchy, and instant feedback. |
| **Technical Implementation** | Clean context/service architecture, real-time Firestore, structured-JSON AI calls with graceful fallbacks, and auto-completion logic. |

---

*Built with ⚡ for Vibe2Ship 2026.*
