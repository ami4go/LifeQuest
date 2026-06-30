# LifeQuest AI — Project Description

**Team / Author:** ami4go
**Hackathon:** Vibe2Ship 2026

| Submission Item | Link |
|---|---|
| **Deployed Application** | https://lifequest-ai-1045306899439.asia-southeast1.run.app |
| **GitHub Repository** | https://github.com/ami4go/LifeQuest |
| **User Study Survey** | https://docs.google.com/forms/d/e/1FAIpQLSeBqRJQCVbBWFNhE5ZKi5eyNYj8RxQGI_RvApxpjswvTRWIQA/viewform |

---

## 1. Problem Statement Selected

**The Last-Minute Life Saver.**

Students, professionals, and entrepreneurs frequently miss deadlines, assignments, meetings, and important commitments. Existing productivity tools rely on passive reminders that are easy to ignore and do little to help users actually *complete* their tasks. The real bottleneck isn't forgetting — it's the psychological barrier of **hesitation**: that moment when a person opens a task, feels overwhelmed by its scope, and closes it without taking any action. Over time, this pattern compounds into full procrastination, missed deadlines, and a cycle of guilt that makes the next task even harder to start.

The challenge is to build an AI-powered productivity companion that proactively assists users in planning, prioritizing, and completing tasks before deadlines are missed — moving beyond reminders toward meaningful action.

---

## 2. Solution Overview

**LifeQuest AI** reframes productivity as a role-playing game. Instead of nagging the user with notifications, it converts real-life goals into a structured game world — **missions, quests, XP, ranks, coins, and PvP duels** — and places **Google Gemini at the center as an autonomous agent** that does the work a passive reminder never could.

When a user enters a goal and deadline, Gemini **decomposes** it into a personalized mission tree of small, achievable quests, calibrated to the user's diagnosed *procrastination archetype*. From there, the AI continuously assists:

- It **plans the user's day** to hit the nearest deadlines.
- It **verifies submitted work** with multimodal evaluation and rewards quality.
- It **intervenes when hesitation is detected**, diagnosing *why* the user is avoiding the task and proposing the **Smallest Next Action** to restore momentum.
- It **decides fair penalties** for dropped tasks based on difficulty and the user's personal history.
- It **recognizes off-platform achievements** (certificates, contests) and rewards them — sometimes secretly.

We further integrated principles from the **Human Momentum Theory**, adding behavioral nudges such as **Project Temperature Indicators** (visualizing whether a project's momentum is hot, stable, or cooling), **Hesitation Window Detection** (catching users before they fully procrastinate), and a **Reality Feed** (reframing the notification panel as an active record of real-world progress). These psychological layers work alongside the existing coin/XP economy to create a system that doesn't just track tasks, but actively makes **starting and finishing** feel rewarding — directly targeting the root cause of missed deadlines.

The result is a companion that doesn't just remind users of deadlines, but catches them at the moment of hesitation and gives them the smallest possible push to keep moving.

---

## 3. Key Features

### AI / Agentic Capabilities (Gemini-Powered)

- **AI Goal Decomposition** — The user types or speaks a goal along with a deadline. The AI engine breaks it down into a structured mission tree of bite-sized quests, each calibrated with a difficulty rating and time estimate tailored to the user's psychology.

- **Archetype Engine** — An 8-question onboarding diagnostic identifies the user's specific failure mode (e.g., Procrastinator, Perfectionist, Time Optimist, Overloaded, Low Motivation). Every quest, tip, and AI response is then uniquely tailored to combat that specific behavior pattern.

- **AI Daily Planner** — An autonomous agent that helps users decide what tasks they should approach first. It prioritizes the day to beat the closest deadlines, offering personalized energy advice and tips tailored to the user's specific procrastination archetype.

- **AI Proof Verification (Dual-Feature Rewards)** — To keep users engaged, we built a dual-feature rewards section. When a user uploads proof of their work (image, PDF, or text), the multimodal AI evaluates it as an unbiased judge to ensure absolute fairness. It scores the work from 1 to 5, provides constructive feedback with specific strengths and areas for improvement, and then awards the user with XP and coins based on their performance.

- **Anti-Avoidance / Hesitation Detection System** — If a user repeatedly opens a quest without completing it, the AI recognizes this as a "Hesitation Window." It diagnoses the root cause of avoidance and proposes the **Smallest Next Action** — restructuring the quest into an easier first step to break through the psychological barrier and restore momentum.

- **AI-Decided Penalties** — Dropping a task doesn't just result in a flat fee. The AI weighs the task's complexity and the user's track record (tasks dropped before, current perfect streak, on-time streak, level, completion rate) to assign a fair HP or coin loss. Repeat droppers face harsher penalties, while users with strong streaks receive more grace.

- **Certificate AI Scoring** — Users can upload certificates or achievement documents. The AI verifies the document, identifies the issuing organization, rates the significance (1–5), and awards 1–500 coins scaled by the achievement's importance.

- **Secret Achievement Agent** — The AI silently monitors user progress (like hackathon submissions, consistent daily grinding, or specific completion patterns) and awards hidden badges and coin boosts when certain thresholds are met without the user expecting it.

### Human Momentum Theory Integration

Beyond standard gamification, we studied and adapted behavioral science principles from the Human Momentum Theory to address the root psychology of procrastination:

- **Value Before Setup** — The onboarding immediately asks *"What goal worries you the most right now?"* instead of requiring lengthy configuration. This captures the user's emotional hesitation upfront, making the first interaction feel like relief rather than effort.

- **Project Temperature Indicators** — Each quest group on the dashboard displays a live "temperature" tag (🔥 Hot, 🌊 Stable, 🧊 Cooling) calculated from the ratio of progress made vs. time elapsed since creation. A "cooling" project tells the brain "you need to touch this to warm it up," which is a softer and more effective psychological nudge than a harsh "OVERDUE" label.

- **Hesitation Window Detection** — When the system detects a user repeatedly opening a challenge without completing it, it triggers the "Hesitation Detected" modal. Instead of nagging, it prescribes the Smallest Next Action — shrinking the cognitive load from "Finish this project" to "Just write the first sentence."

- **Reality Feed** — The notification panel is reframed as a "Reality Feed," shifting the language from passive "activity logs" to an active record of the user's real-world momentum, making progress feel tangible and reinforcing behavioral commitment.

### Gamification & Engagement

- **Clean Quest Hierarchy (Quest Name → Mission → Challenge)** — The dashboard displays only high-level Quest Names. Clicking a Quest expands to reveal its internal Missions. Clicking a Mission navigates to the individual Challenges. This keeps the main view clean, uncluttered, and manageable.

- **Auto-Completion** — When a user checks off the final challenge in a mission, the system automatically marks the mission as complete. When all missions in a quest are done, the quest itself is auto-completed. No extra "Complete Quest" button needed — designed for the lazy user.

- **Quest History** — Completed and dropped quests are moved off the main dashboard to a dedicated Quest History page (accessible from the side menu), categorized into Ongoing, Completed, and Dropped/Skipped sections with accordion-style mission breakdowns.

- **Focus Lock** — A high-stakes feature where users can bet on themselves. Delivering a task on time grants a 50% XP bonus, while missing it results in a 25% penalty. Real stakes create real motivation.

- **Duels Arena** — Users can challenge friends to custom or AI-generated challenges. The AI evaluates each submission and populates a full scorecard table (Player × Task × Submission × Score), instantly declaring a winner once all parties have finished.

- **Coin Economy & Badges** — Users earn coins from their evaluated work which can be redeemed for real-life merch and rewards. To keep accountability high, users who aren't performing well receive "penalty" badges. However, we give them an opportunity to swap out these bad badges by earning "antidote" badges (the "Redemption Arc") — recovering their profile score and earning bonus coins in the process.

- **Global Leaderboard & Notifications** — A real-time activity feed tracks duel challenges, badges, and level-ups, alongside a global XP leaderboard.

- **Personalized Experience** — Users have the option of changing accent themes to match their unique style, ensuring their dashboard feels entirely their own.

---

## 4. Technologies Used

- **Frontend:** React 19, Vite 8, React Router 7
- **UI Design:** Stitch (UI design & logo generation), Custom CSS design system, `lucide-react` icon set
- **AI SDK:** `@google/genai` (Google Gemini `gemini-2.5-flash`)
- **Backend / Platform:** Firebase Authentication, Cloud Firestore (real-time), Google Cloud Run
- **Web APIs:** Web Speech API (voice goal entry)

---

## 5. Google Technologies Utilized

- **Google Gemini API (`gemini-2.5-flash`)** — Acts as the central "agentic brain" orchestrating the product. Every intelligent action is a structured Gemini call using both **text and vision** (multimodal) capabilities:
  - Goal decomposition into mission trees
  - Multimodal task evaluation (scoring uploaded images, PDFs, and text submissions)
  - Daily schedule generation with archetype-aware prioritization
  - Penalty decisions weighing task complexity and user history
  - Anti-avoidance / hesitation diagnosis and quest restructuring
  - Certificate verification and significance scoring
  - Duel challenge suggestion and mission tree generation

- **Firebase (Google Cloud):**
  - **Firebase Authentication** with **Google Sign-In (OAuth 2.0)** for seamless, one-tap account creation and login.
  - **Cloud Firestore** for real-time data streaming (so XP, coins, badges, quest status, and duel progress update instantly across the app via live `onSnapshot` listeners).

- **Google Cloud Run** — Powers the deployed, publicly accessible production build.

- **Google AI Studio** — Utilized heavily to design, test, and refine the intricate prompts that power the various AI agents. Also served as the primary development and deployment environment for the application.

- **Stitch** — Leveraged extensively for UI design and logo generation, giving the app its cohesive, console-grade cyber aesthetic.

---

*LifeQuest AI — turning the dread of a deadline into the dopamine of a quest.*
