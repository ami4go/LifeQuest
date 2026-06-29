import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuests } from '../contexts/QuestContext';
import { useAuth } from '../contexts/AuthContext';
import { doc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { calculateQuestXP } from '../utils/xpCalculator';
import { getLevelInfo, getNextRank } from '../utils/levelSystem';
import { getUserDuels } from '../services/duelService';
import { generateSchedule } from '../services/aiService';
import {
  Flame, Swords, CheckCircle2, Zap, Sparkles, ChevronRight, Lock, Trash2,
  CalendarClock, ListChecks, Bot, X,
} from 'lucide-react';
import './DashboardPage.css';

function rarityForXP(totalXP) {
  if (totalXP >= 1500) return 'legendary';
  if (totalXP >= 1000) return 'epic';
  if (totalXP >= 500) return 'rare';
  return 'common';
}

export default function DashboardPage() {
  const { user, userData, updateUserData } = useAuth();
  const { activeQuests, completedQuests, quests, missions, loading, deleteMission, getDeletePenaltyInfo, droppedQuests } = useQuests();
  const navigate = useNavigate();
  const [expandedMission, setExpandedMission] = useState(null);
  const [xpAnimation, setXpAnimation] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [showDropped, setShowDropped] = useState(false);
  const [incomingDuel, setIncomingDuel] = useState(null);
  const [showCount, setShowCount] = useState(5);
  const [planner, setPlanner] = useState(null);
  const [plannerLoading, setPlannerLoading] = useState(false);
  const [showPlanner, setShowPlanner] = useState(false);

  const levelInfo = getLevelInfo(userData?.xp || 0);
  const nextRank = getNextRank(levelInfo.level);

  // Lightweight read: surface the first incoming duel challenge as a CTA
  useEffect(() => {
    let alive = true;
    (async () => {
      if (!user) return;
      try {
        const duels = await getUserDuels(user.uid, user.email);
        const incoming = duels.find(d =>
          d.status === 'pending' &&
          (d.invitedEmails?.includes(user?.email?.toLowerCase()) || d.opponentEmail === user?.email?.toLowerCase()) &&
          d.creatorId !== user?.uid && d.challengerId !== user?.uid
        );
        if (alive) setIncomingDuel(incoming || null);
      } catch { /* non-blocking */ }
    })();
    return () => { alive = false; };
  }, [user]);

  const missionSummaries = missions.map((mission) => {
    const missionQuests = quests.filter((q) => q.missionId === mission.id);
    const done = missionQuests.filter((q) => q.status === 'completed').length;
    const total = missionQuests.length;
    const totalXP = missionQuests.reduce((sum, q) => sum + (q.xpReward || 0), 0);
    const earnedXP = missionQuests
      .filter((q) => q.status === 'completed')
      .reduce((sum, q) => sum + (q.xpReward || 0), 0);
    const progress = total > 0 ? Math.round((done / total) * 100) : 0;
    const isComplete = total > 0 && done === total;
    const rarity = rarityForXP(totalXP);
    return { ...mission, missionQuests, done, total, totalXP, earnedXP, progress, isComplete, rarity };
  });

  const deadlineMs = (m) => (m.deadline?.toDate ? m.deadline.toDate().getTime() : (m.deadline ? new Date(m.deadline).getTime() : Infinity));
  // Priority = soonest deadline first, then highest points
  const sortByPriority = (a, b) => {
    const da = deadlineMs(a), db = deadlineMs(b);
    if (da !== db) return da - db;
    return b.totalXP - a.totalXP;
  };
  const activeMissions = missionSummaries.filter((m) => !m.isComplete).sort(sortByPriority);
  const completedMissions = missionSummaries.filter((m) => m.isComplete).sort((a, b) => b.totalXP - a.totalXP);
  const priorityMissions = activeMissions.slice(0, 5);
  const visibleAll = showCount >= 999 ? activeMissions : activeMissions.slice(0, showCount);

  const handleGeneratePlan = async () => {
    setShowPlanner(true);
    if (planner || plannerLoading) return;
    setPlannerLoading(true);
    try {
      const result = await generateSchedule(
        activeQuests.map((q) => ({
          title: q.title, difficulty: q.difficulty, deadline: q.deadline?.toDate?.()?.toISOString?.() || null,
          estimatedMinutes: q.estimatedMinutes, status: q.status, focusLocked: q.focusLocked,
        })),
        userData?.archetype,
        new Date().toLocaleString(),
      );
      setPlanner(result);
    } catch {
      setPlanner({ greeting: 'Could not reach the AI planner right now.', schedule: [] });
    }
    setPlannerLoading(false);
  };

  const handleCompleteQuest = async (quest, e) => {
    e.stopPropagation();
    const now = new Date();
    const deadline = quest.deadline?.toDate ? quest.deadline.toDate() : new Date(quest.deadline || now);
    const onTime = now <= deadline;

    const xpBreakdown = calculateQuestXP({
      difficulty: quest.difficulty,
      onTime,
      early: onTime && (deadline - now) > 3600000,
      focusLocked: quest.focusLocked,
      isBossBattle: false,
      streakDays: userData?.streaks?.focus || 0,
      proofSubmitted: quest.proofSubmitted,
      proofQuality: quest.proofData?.aiVerification?.qualityScore || 0,
    });

    await updateDoc(doc(db, 'quests', quest.id), {
      status: 'completed',
      completedAt: Timestamp.now(),
    });

    const newXP = (userData?.xp || 0) + xpBreakdown.total;
    const newLevel = Math.floor(newXP / 1000);
    await updateUserData({
      xp: newXP,
      level: newLevel,
      perfectStreak: (userData?.perfectStreak || 0) + 1,
      onTimeStreak: onTime ? (userData?.onTimeStreak || 0) + 1 : 0,
    });

    setXpAnimation({ xp: xpBreakdown.total, questId: quest.id });
    setTimeout(() => setXpAnimation(null), 2000);
  };

  const toggleMission = (missionId) => {
    setExpandedMission((prev) => (prev === missionId ? null : missionId));
  };

  const handleDeleteClick = (mission) => {
    const penaltyInfo = getDeletePenaltyInfo(mission.id);
    setDeleteModal({
      missionId: mission.id,
      title: mission.title || mission.goalText || 'Untitled Quest',
      penaltyInfo,
    });
  };

  const confirmDelete = async () => {
    if (!deleteModal) return;
    await deleteMission(deleteModal.missionId);
    setDeleteModal(null);
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner spinner--lg" />
        <p className="text-muted">Loading your quests...</p>
      </div>
    );
  }

  return (
    <div className="quests" id="dashboard-page">
      {/* Greeting */}
      <section className="quests__greet">
        <p className="hud-eyebrow">Operator // Online</p>
        <h1 className="quests__title">
          {getGreeting()}, <span className="text-gradient-xp">{userData?.displayName?.split(' ')[0] || 'Adventurer'}</span>
        </h1>
        <p className="quests__subtitle">
          {activeMissions.length} active quest{activeMissions.length !== 1 ? 's' : ''} · {completedQuests.length} challenge{completedQuests.length !== 1 ? 's' : ''} cleared
        </p>
      </section>

      {/* Stat chips */}
      <section className="quests__chips no-scrollbar">
        <StatChip icon={Flame} tint="text-accent" value={activeMissions.length} label="Active" />
        <StatChip icon={Swords} tint="text-magenta" value={activeQuests.length} label="Challenges" />
        <StatChip icon={CheckCircle2} tint="text-success" value={completedQuests.length} label="Done" />
        <StatChip icon={Zap} tint="text-gold" value={userData?.streaks?.focus || 0} label="Streak" />
      </section>

      {/* Incoming duel CTA */}
      {incomingDuel && (
        <section className="quests__pad">
          <div className="duel-cta" onClick={() => navigate('/duels')}>
            <div className="duel-cta__glow" />
            <div className="duel-cta__icon">
              <Swords size={24} className="text-danger" />
            </div>
            <div className="duel-cta__body">
              <p className="duel-cta__label">Incoming Duel</p>
              <p className="duel-cta__name">{(incomingDuel.creatorName || incomingDuel.challengerName || 'A rival')} challenged you</p>
              <p className="duel-cta__stake">+{incomingDuel.totalHP || incomingDuel.xpReward || 0} HP on the line</p>
            </div>
            <button className="duel-cta__accept" onClick={(e) => { e.stopPropagation(); navigate('/duels'); }}>
              Accept
            </button>
          </div>
        </section>
      )}

      {/* AI Daily Planner */}
      {activeMissions.length > 0 && (
        <section className="quests__pad">
          <button className="ai-planner" onClick={handleGeneratePlan}>
            <div className="ai-planner__icon"><Bot size={22} /></div>
            <div className="ai-planner__body">
              <p className="ai-planner__title">AI Daily Planner</p>
              <p className="ai-planner__sub">Let AI prioritize your day & beat the deadline</p>
            </div>
            <ChevronRight size={18} className="text-muted" />
          </button>
        </section>
      )}

      {/* Priority 5 */}
      {priorityMissions.length > 0 && (
        <section className="quests__pad">
          <div className="section-head">
            <h2 className="section-head__title">
              <CalendarClock size={16} className="text-danger" /> Priority
              <span className="section-head__count">Top {priorityMissions.length}</span>
            </h2>
          </div>
          <ul className="quest-list">
            {priorityMissions.map((mission) => (
              <QuestCard
                key={mission.id}
                mission={mission}
                isExpanded={expandedMission === mission.id}
                onToggle={() => toggleMission(mission.id)}
                onCompleteQuest={handleCompleteQuest}
                onQuestClick={(qId) => navigate(`/quest/${qId}`)}
                onDeleteMission={() => handleDeleteClick(mission)}
                xpAnimation={xpAnimation}
              />
            ))}
          </ul>
        </section>
      )}

      {/* All active quests + count selector */}
      {activeMissions.length > 0 && (
        <section className="quests__pad">
          <div className="section-head">
            <h2 className="section-head__title">
              <ListChecks size={16} className="text-accent" /> All Quests
              <span className="section-head__count">{activeMissions.length}</span>
            </h2>
            <div className="count-selector">
              {[3, 5, 10].map((n) => (
                <button
                  key={n}
                  className={`count-selector__btn ${showCount === n ? 'count-selector__btn--active' : ''}`}
                  onClick={() => setShowCount(n)}
                >{n}</button>
              ))}
              <button
                className={`count-selector__btn ${showCount >= 999 ? 'count-selector__btn--active' : ''}`}
                onClick={() => setShowCount(999)}
              >All</button>
            </div>
          </div>
          <ul className="quest-list">
            {visibleAll.map((mission) => (
              <QuestCard
                key={mission.id}
                mission={mission}
                isExpanded={expandedMission === mission.id}
                onToggle={() => toggleMission(mission.id)}
                onCompleteQuest={handleCompleteQuest}
                onQuestClick={(qId) => navigate(`/quest/${qId}`)}
                onDeleteMission={() => handleDeleteClick(mission)}
                xpAnimation={xpAnimation}
              />
            ))}
          </ul>
        </section>
      )}

      {/* Completed quests */}
      {completedMissions.length > 0 && (
        <section className="quests__pad">
          <div className="section-head">
            <h2 className="section-head__title">
              <CheckCircle2 size={16} className="text-success" /> Completed
              <span className="section-head__count">{completedMissions.length}</span>
            </h2>
          </div>
          <ul className="quest-list">
            {completedMissions.map((mission) => (
              <QuestCard
                key={mission.id}
                mission={mission}
                isExpanded={expandedMission === mission.id}
                onToggle={() => toggleMission(mission.id)}
                onCompleteQuest={handleCompleteQuest}
                onQuestClick={(qId) => navigate(`/quest/${qId}`)}
                onDeleteMission={() => handleDeleteClick(mission)}
                xpAnimation={xpAnimation}
              />
            ))}
          </ul>
        </section>
      )}

      {/* Dropped / deleted */}
      {droppedQuests.length > 0 && (
        <section className="quests__pad">
          <div className="section-head" onClick={() => setShowDropped(!showDropped)} style={{ cursor: 'pointer' }}>
            <h2 className="section-head__title">
              <Trash2 size={16} className="text-danger" /> Dropped / Deleted
              <span className="section-head__count">{droppedQuests.length}</span>
            </h2>
            <span className={`quest-card__chevron ${showDropped ? 'quest-card__chevron--open' : ''}`}>▼</span>
          </div>
          {showDropped && (
            <ul className="quest-list">
              {droppedQuests.map((quest) => (
                <li key={quest.id} className="hud-panel dropped-item">
                  <span className="dropped-item__title">{quest.title}</span>
                  <span className="text-danger dropped-item__xp">-{quest.xpReward || 50} XP</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {/* Locked boss teaser */}
      {nextRank && (
        <section className="quests__pad">
          <div className="hud-panel boss-teaser">
            <div className="boss-teaser__icon">
              <Lock size={16} className="text-muted" />
            </div>
            <div className="boss-teaser__body">
              <p className="boss-teaser__title">Boss Battle — {nextRank.title}</p>
              <p className="boss-teaser__sub">Unlock at Level {nextRank.level} to access raid quests</p>
            </div>
          </div>
        </section>
      )}

      {/* Empty state */}
      {missions.length === 0 && (
        <div className="quests__empty">
          <span className="quests__empty-icon">🚀</span>
          <h3 className="h4">No quests yet!</h3>
          <p className="text-muted text-sm">Create your first quest and let AI break it into challenges.</p>
          <button className="btn btn--primary" onClick={() => navigate('/goals/new')}>+ Create First Quest</button>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteModal && (
        <>
          <div className="modal-backdrop" onClick={() => setDeleteModal(null)} />
          <div className="modal">
            <div className="modal__handle" />
            <h3 className="h4 mb-sm" style={{ color: 'var(--color-danger)' }}>⚠️ Delete Quest?</h3>
            <p className="text-sm text-muted mb-base">
              You are about to delete <strong>"{deleteModal.title}"</strong>. This cannot be undone.
            </p>
            <div className="glass-card glass-card--no-hover mb-base" style={{ padding: '1rem' }}>
              <p className="text-xs font-semibold text-muted mb-sm">PENALTIES FOR DELETION:</p>
              <div className="flex" style={{ gap: '1rem', flexWrap: 'wrap' }}>
                <div className="flex items-center" style={{ gap: '0.35rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>💀</span>
                  <div>
                    <span className="text-danger font-bold">-{deleteModal.penaltyInfo.xpLoss} XP</span>
                    <div className="text-xs text-muted">{deleteModal.penaltyInfo.totalTasks} incomplete tasks × 50 XP</div>
                  </div>
                </div>
                <div className="flex items-center" style={{ gap: '0.35rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>🪙</span>
                  <div>
                    <span className="text-warning font-bold">-{deleteModal.penaltyInfo.coinLoss} Coins</span>
                    <div className="text-xs text-muted">
                      {deleteModal.penaltyInfo.totalTasks} tasks × 10
                      {deleteModal.penaltyInfo.aiTaskCount > 0 && ` + ${deleteModal.penaltyInfo.aiTaskCount} AI tasks × 5`}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-base">
              <button className="btn btn--secondary flex-1" onClick={() => setDeleteModal(null)}>Cancel</button>
              <button className="btn btn--danger flex-1" onClick={confirmDelete}>🗑️ Delete Anyway</button>
            </div>
          </div>
        </>
      )}

      {/* AI Planner modal */}
      {showPlanner && (
        <>
          <div className="modal-backdrop" onClick={() => setShowPlanner(false)} />
          <div className="modal">
            <div className="modal__handle" />
            <div className="flex items-center justify-between mb-sm">
              <h3 className="h4"><Bot size={18} style={{ verticalAlign: '-3px' }} /> AI Daily Plan</h3>
              <button className="quest-card__del" onClick={() => setShowPlanner(false)}><X size={16} /></button>
            </div>
            {plannerLoading ? (
              <div className="loading-screen" style={{ minHeight: '160px' }}>
                <div className="spinner spinner--lg" />
                <p className="text-muted text-sm">AI is planning your day...</p>
              </div>
            ) : planner ? (
              <div className="planner-result">
                {planner.greeting && <p className="text-sm text-muted mb-base">{planner.greeting}</p>}
                {planner.topPriority && (
                  <div className="glass-card glass-card--no-hover mb-base" style={{ padding: '0.75rem' }}>
                    <span className="text-xs text-accent font-bold">🎯 TOP PRIORITY</span>
                    <p className="text-sm">{planner.topPriority}</p>
                  </div>
                )}
                {planner.schedule?.map((s, i) => (
                  <div key={i} className="planner-slot">
                    <span className="planner-slot__time">{s.time}</span>
                    <div className="planner-slot__body">
                      <p className="planner-slot__title">{s.title} <span className="text-xs text-muted">· {s.duration}</span></p>
                      {s.tip && <p className="text-xs text-muted">{s.tip}</p>}
                    </div>
                  </div>
                ))}
                {planner.archetypeTip && <p className="text-xs text-accent mt-base">💡 {planner.archetypeTip}</p>}
                {planner.energyAdvice && <p className="text-xs text-muted mt-xs">⚡ {planner.energyAdvice}</p>}
              </div>
            ) : null}
            <button className="btn btn--primary btn--full mt-base" onClick={() => setShowPlanner(false)}>Got it</button>
          </div>
        </>
      )}
    </div>
  );
}

function StatChip({ icon: Icon, tint, value, label }) {
  return (
    <div className="hud-panel stat-chip">
      <Icon size={16} className={tint} />
      <div className="stat-chip__value">{value}</div>
      <div className="stat-chip__label">{label}</div>
    </div>
  );
}

function QuestCard({ mission, isExpanded, onToggle, onCompleteQuest, onQuestClick, onDeleteMission, xpAnimation }) {
  const title = mission.title || mission.goalText || 'Untitled Quest';
  const tag = mission.category || mission.tag || 'Mission';
  return (
    <li className={`quest-card hud-panel ring-rarity-${mission.rarity} ${mission.isComplete ? 'quest-card--done' : ''}`}>
      <div className="quest-card__head" onClick={onToggle}>
        <div className="quest-card__main">
          <div className="quest-card__tags">
            <span className={`rarity-chip rarity-chip--${mission.rarity}`}>{mission.rarity}</span>
            <span className="quest-card__cat">{tag}</span>
          </div>
          <h3 className="quest-card__title">
            {mission.isComplete && '✅ '}{title}
          </h3>
          <p className="quest-card__meta">
            {mission.done}/{mission.total} challenges · +{mission.totalXP.toLocaleString()} XP
          </p>
        </div>
        <div className="quest-card__actions">
          <button
            className="quest-card__del"
            onClick={(e) => { e.stopPropagation(); onDeleteMission(); }}
            title="Delete quest"
          >
            <Trash2 size={15} />
          </button>
          <ChevronRight size={16} className={`quest-card__chev ${isExpanded ? 'quest-card__chev--open' : ''}`} />
        </div>
      </div>

      <div className="quest-card__bar-row">
        <div className="quest-card__bar">
          <div className={`quest-card__bar-fill rarity-fill--${mission.rarity}`} style={{ width: `${mission.progress}%` }} />
        </div>
        <span className="quest-card__pct">{mission.progress}%</span>
      </div>

      {isExpanded && (
        <div className="quest-card__body">
          {mission.missionQuests.map((quest) => (
            <div
              key={quest.id}
              className={`challenge-row ${quest.status === 'completed' ? 'challenge-row--done' : ''}`}
              onClick={(e) => { e.stopPropagation(); onQuestClick(quest.id); }}
            >
              {xpAnimation?.questId === quest.id && (
                <div className="challenge-row__xp-pop">+{xpAnimation.xp} XP ✨</div>
              )}
              {quest.status === 'completed' ? (
                <span className="challenge-row__check challenge-row__check--done">✓</span>
              ) : (
                <button className="challenge-row__check" onClick={(e) => onCompleteQuest(quest, e)} title="Mark complete">○</button>
              )}
              <div className="challenge-row__info">
                <span className={`challenge-row__title ${quest.status === 'completed' ? 'challenge-row__title--done' : ''}`}>
                  {quest.focusLocked && '🔒 '}{quest.title}
                </span>
                <div className="challenge-row__sub">
                  <span className="difficulty-stars">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`star ${i < quest.difficulty ? 'star--filled' : ''}`}>★</span>
                    ))}
                  </span>
                  <span className="text-accent text-xs">+{quest.xpReward} XP</span>
                  {quest.enableAIEvaluation && <span className="text-xs text-warning">🤖</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </li>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}
