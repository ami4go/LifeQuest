import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuests } from '../contexts/QuestContext';
import { useAuth } from '../contexts/AuthContext';
import { doc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { calculateQuestXP } from '../utils/xpCalculator';
import { getLevelInfo } from '../utils/levelSystem';
import './DashboardPage.css';

export default function DashboardPage() {
  const { userData, updateUserData } = useAuth();
  const { activeQuests, completedQuests, quests, missions, loading, deleteMission, getDeletePenaltyInfo, droppedQuests } = useQuests();
  const navigate = useNavigate();
  const [expandedMission, setExpandedMission] = useState(null);
  const [xpAnimation, setXpAnimation] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null); // { missionId, title, penaltyInfo }
  const [showDropped, setShowDropped] = useState(false);

  const levelInfo = getLevelInfo(userData?.xp || 0);

  // Build mission summary data
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
    return { ...mission, missionQuests, done, total, totalXP, earnedXP, progress, isComplete };
  });

  const activeMissions = missionSummaries.filter((m) => !m.isComplete);
  const completedMissions = missionSummaries.filter((m) => m.isComplete);

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
    await updateUserData({ xp: newXP, level: newLevel });

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
    <div className="dashboard" id="dashboard-page">
      {/* Welcome Section */}
      <div className="dashboard__welcome animate-fade-in-up">
        <div className="dashboard__greeting">
          <h2 className="h3">
            {getGreeting()}, <span className="text-gradient">{userData?.displayName?.split(' ')[0] || 'Adventurer'}</span>
          </h2>
          <p className="text-sm text-muted">
            {activeMissions.length} active quest{activeMissions.length !== 1 ? 's' : ''} •{' '}
            {completedQuests.length} challenge{completedQuests.length !== 1 ? 's' : ''} completed
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="dashboard__stats animate-fade-in-up delay-1">
        <div className="dashboard__stat-card glass-card glass-card--no-hover">
          <span className="dashboard__stat-icon">🎯</span>
          <span className="dashboard__stat-value">{activeMissions.length}</span>
          <span className="dashboard__stat-label">Quests</span>
        </div>
        <div className="dashboard__stat-card glass-card glass-card--no-hover">
          <span className="dashboard__stat-icon">⚔️</span>
          <span className="dashboard__stat-value">{activeQuests.length}</span>
          <span className="dashboard__stat-label">Challenges</span>
        </div>
        <div className="dashboard__stat-card glass-card glass-card--no-hover">
          <span className="dashboard__stat-icon">✅</span>
          <span className="dashboard__stat-value">{completedQuests.length}</span>
          <span className="dashboard__stat-label">Done</span>
        </div>
        <div className="dashboard__stat-card glass-card glass-card--no-hover">
          <span className="dashboard__stat-icon">{levelInfo.rank.emoji}</span>
          <span className="dashboard__stat-value">{levelInfo.level}</span>
          <span className="dashboard__stat-label">Level</span>
        </div>
        <div className="dashboard__stat-card glass-card glass-card--no-hover">
          <span className="dashboard__stat-icon">🪙</span>
          <span className="dashboard__stat-value">{userData?.coins || 0}</span>
          <span className="dashboard__stat-label">Coins</span>
        </div>
      </div>

      {/* XP Bar */}
      <div className="dashboard__xp-section animate-fade-in-up delay-2">
        <div className="flex justify-between items-center mb-xs">
          <span className="text-xs text-muted">Level {levelInfo.level} → {levelInfo.level + 1}</span>
          <span className="text-xs text-cyan font-semibold">{levelInfo.xpInLevel} / 1000 XP</span>
        </div>
        <div className="progress-bar progress-bar--lg">
          <div className="progress-bar__fill" style={{ width: `${levelInfo.progress}%` }} />
        </div>
      </div>

      {/* Active Quests */}
      {activeMissions.length > 0 && (
        <div className="dashboard__section animate-fade-in-up delay-2">
          <h3 className="dashboard__section-title">
            <span>🎯</span> Active Quests
            <span className="dashboard__section-count">{activeMissions.length}</span>
          </h3>
          <div className="dashboard__missions">
            {activeMissions.map((mission, idx) => (
              <MissionCard
                key={mission.id}
                mission={mission}
                isExpanded={expandedMission === mission.id}
                onToggle={() => toggleMission(mission.id)}
                onCompleteQuest={handleCompleteQuest}
                onQuestClick={(qId) => navigate(`/quest/${qId}`)}
                onDeleteMission={() => handleDeleteClick(mission)}
                xpAnimation={xpAnimation}
                idx={idx}
              />
            ))}
          </div>
        </div>
      )}

      {/* Completed Quests */}
      {completedMissions.length > 0 && (
        <div className="dashboard__section animate-fade-in-up delay-3">
          <h3 className="dashboard__section-title">
            <span>🏆</span> Completed Quests
            <span className="dashboard__section-count">{completedMissions.length}</span>
          </h3>
          <div className="dashboard__missions">
            {completedMissions.map((mission, idx) => (
              <MissionCard
                key={mission.id}
                mission={mission}
                isExpanded={expandedMission === mission.id}
                onToggle={() => toggleMission(mission.id)}
                onCompleteQuest={handleCompleteQuest}
                onQuestClick={(qId) => navigate(`/quest/${qId}`)}
                onDeleteMission={() => handleDeleteClick(mission)}
                xpAnimation={xpAnimation}
                idx={idx}
              />
            ))}
          </div>
        </div>
      )}

      {/* Dropped / Deleted Quests */}
      {droppedQuests.length > 0 && (
        <div className="dashboard__section animate-fade-in-up delay-3">
          <h3 className="dashboard__section-title" onClick={() => setShowDropped(!showDropped)} style={{ cursor: 'pointer' }}>
            <span>🗑️</span> Dropped / Deleted
            <span className="dashboard__section-count">{droppedQuests.length}</span>
            <span className={`mission-card__chevron ${showDropped ? 'mission-card__chevron--open' : ''}`} style={{ marginLeft: 'auto' }}>▼</span>
          </h3>
          {showDropped && (
            <div className="dashboard__dropped-list">
              {droppedQuests.map((quest) => (
                <div key={quest.id} className="dashboard__dropped-item glass-card glass-card--no-hover">
                  <div className="flex align-center" style={{ gap: '0.5rem' }}>
                    <span className="text-danger">🚫</span>
                    <div>
                      <span className="text-sm font-semibold" style={{ opacity: 0.6, textDecoration: 'line-through' }}>{quest.title}</span>
                      <div className="text-xs text-muted">
                        {quest.status === 'dropped' ? 'Dropped' : 'Deleted'}
                        {quest.droppedAt && ` • ${new Date(quest.droppedAt?.toDate ? quest.droppedAt.toDate() : quest.droppedAt).toLocaleDateString()}`}
                        {quest.deletedAt && ` • ${new Date(quest.deletedAt?.toDate ? quest.deletedAt.toDate() : quest.deletedAt).toLocaleDateString()}`}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-danger font-bold">-{quest.xpReward || 50} XP</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {missions.length === 0 && (
        <div className="dashboard__empty animate-fade-in-up">
          <span className="dashboard__empty-icon">🚀</span>
          <h3 className="h4">No quests yet!</h3>
          <p className="text-muted text-sm">
            Create your first quest and let AI break it down into challenges.
          </p>
          <button className="btn btn--primary" onClick={() => navigate('/goals/new')}>
            + Create First Quest
          </button>
        </div>
      )}

      {/* FAB */}
      <button
        className="dashboard__fab animate-bounce-in"
        onClick={() => navigate('/goals/new')}
        id="new-goal-fab"
      >
        +
      </button>

      {/* ── Delete Confirmation Modal ── */}
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
                <div className="flex align-center" style={{ gap: '0.35rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>💀</span>
                  <div>
                    <span className="text-danger font-bold">-{deleteModal.penaltyInfo.xpLoss} XP</span>
                    <div className="text-xs text-muted">{deleteModal.penaltyInfo.totalTasks} incomplete tasks × 50 XP</div>
                  </div>
                </div>
                <div className="flex align-center" style={{ gap: '0.35rem' }}>
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
              {deleteModal.penaltyInfo.aiTaskCount > 0 && (
                <p className="text-xs text-cyan mt-sm">🤖 {deleteModal.penaltyInfo.aiTaskCount} task(s) had AI evaluation — extra coin penalty applies.</p>
              )}
            </div>

            <div className="flex gap-base">
              <button className="btn btn--secondary flex-1" onClick={() => setDeleteModal(null)}>Cancel</button>
              <button className="btn btn--danger flex-1" onClick={confirmDelete}>🗑️ Delete Anyway</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ── Mission Card Component ── */
function MissionCard({ mission, isExpanded, onToggle, onCompleteQuest, onQuestClick, onDeleteMission, xpAnimation, idx }) {
  return (
    <div
      className={`mission-card glass-card glass-card--no-hover animate-fade-in-up ${
        mission.isComplete ? 'mission-card--completed' : ''
      }`}
      style={{ animationDelay: `${idx * 0.08}s` }}
      id={`mission-card-${mission.id}`}
    >
      {/* Header (always visible, clickable) */}
      <div className="mission-card__header" onClick={onToggle}>
        <div className="mission-card__info">
          <h4 className="mission-card__title">
            {mission.isComplete && <span className="mission-card__done-icon">✅</span>}
            {mission.title || mission.goalText || 'Untitled Quest'}
          </h4>
          <div className="mission-card__meta">
            <span className="text-xs text-cyan font-semibold">
              {mission.done}/{mission.total} challenges
            </span>
            <span className="text-xs text-muted">•</span>
            <span className="text-xs text-muted">
              {mission.earnedXP}/{mission.totalXP} XP
            </span>
          </div>
        </div>
        <div className="mission-card__right">
          <div className="mission-card__progress-ring">
            <svg viewBox="0 0 36 36" className="mission-card__ring-svg">
              <path
                className="mission-card__ring-bg"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="mission-card__ring-fill"
                strokeDasharray={`${mission.progress}, 100`}
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="mission-card__ring-text">{mission.progress}%</span>
          </div>
          <button 
            className="btn btn--icon text-danger" 
            onClick={(e) => { e.stopPropagation(); onDeleteMission(); }}
            title="Delete Quest"
            style={{ marginLeft: '0.5rem', background: 'transparent', fontSize: '1rem' }}
          >
            🗑️
          </button>
          <span className={`mission-card__chevron ${isExpanded ? 'mission-card__chevron--open' : ''}`}>
            ▼
          </span>
        </div>
      </div>

      {/* Expandable Body */}
      <div className={`mission-card__body ${isExpanded ? 'mission-card__body--open' : ''}`}>
        {/* Summary Bar */}
        <div className="mission-card__summary">
          <div className="mission-card__summary-item">
            <span className="text-xs text-muted">Total Challenges</span>
            <span className="font-bold">{mission.total}</span>
          </div>
          <div className="mission-card__summary-item">
            <span className="text-xs text-muted">Completed</span>
            <span className="font-bold text-success">{mission.done}</span>
          </div>
          <div className="mission-card__summary-item">
            <span className="text-xs text-muted">Remaining</span>
            <span className="font-bold text-warning">{mission.total - mission.done}</span>
          </div>
          <div className="mission-card__summary-item">
            <span className="text-xs text-muted">XP Earned</span>
            <span className="font-bold text-cyan">{mission.earnedXP}</span>
          </div>
        </div>

        {/* Challenge List */}
        <div className="mission-card__quests">
          {mission.missionQuests.map((quest) => (
            <div
              key={quest.id}
              className={`mission-quest ${quest.status === 'completed' ? 'mission-quest--done' : ''}`}
              onClick={(e) => { e.stopPropagation(); onQuestClick(quest.id); }}
            >
              {/* XP Animation */}
              {xpAnimation?.questId === quest.id && (
                <div className="mission-quest__xp-popup">+{xpAnimation.xp} XP ✨</div>
              )}

              <div className="mission-quest__left">
                {quest.status === 'completed' ? (
                  <span className="mission-quest__check mission-quest__check--done">✓</span>
                ) : (
                  <button
                    className="mission-quest__check"
                    onClick={(e) => onCompleteQuest(quest, e)}
                    title="Mark complete"
                  >
                    ○
                  </button>
                )}
                <div className="mission-quest__info">
                  <span className={`mission-quest__title ${quest.status === 'completed' ? 'mission-quest__title--done' : ''}`}>
                    {quest.focusLocked && <span className="mission-quest__lock">🔒</span>}
                    {quest.title}
                  </span>
                  <div className="mission-quest__meta">
                    <span className="difficulty-stars difficulty-stars--sm">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`star ${i < quest.difficulty ? 'star--filled' : ''}`}>★</span>
                      ))}
                    </span>
                    <span className="text-xs text-cyan">+{quest.xpReward} XP</span>
                    {quest.enableAIEvaluation && <span className="text-xs text-warning">🤖</span>}
                    {quest.requireProof && <span className="text-xs text-success">📸</span>}
                    {quest.deadline && quest.status !== 'completed' && (
                      <span className="text-xs text-muted">{getTimeRemaining(quest.deadline)}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="mission-quest__tags">
                {quest.focusLocked && <span className="badge badge--warning badge--sm">🔒</span>}
                {quest.proofSubmitted && <span className="badge badge--success badge--sm">📸</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function getTimeRemaining(deadline) {
  const dl = deadline?.toDate ? deadline.toDate() : new Date(deadline);
  const now = new Date();
  const diff = dl - now;

  if (diff < 0) return '⚠️ Overdue';
  if (diff < 3600000) return `${Math.ceil(diff / 60000)}m left`;
  if (diff < 86400000) return `${Math.ceil(diff / 3600000)}h left`;
  return `${Math.ceil(diff / 86400000)}d left`;
}
