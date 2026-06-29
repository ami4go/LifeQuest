import { useAuth } from '../contexts/AuthContext';
import { useQuests } from '../contexts/QuestContext';
import { getLevelInfo, getNextRank } from '../utils/levelSystem';
import { ARCHETYPES, BADGES, SEASON_BADGES, MASTERY_BADGES } from '../utils/constants';
import './ProfilePage.css';

export default function ProfilePage() {
  const { userData, logout } = useAuth();
  const { completedQuests, quests } = useQuests();
  const levelInfo = getLevelInfo(userData?.xp || 0);
  const nextRank = getNextRank(levelInfo.level);
  const archetype = userData?.archetype?.primary ? ARCHETYPES[userData.archetype.primary] : null;
  const secondaryArchetype = userData?.archetype?.secondary ? ARCHETYPES[userData.archetype.secondary] : null;

  const totalQuests = quests.length;
  const completionRate = totalQuests > 0 ? Math.round((completedQuests.length / totalQuests) * 100) : 0;
  const focusLockedCompleted = completedQuests.filter(q => q.focusLocked).length;
  const proofsSubmitted = completedQuests.filter(q => q.proofSubmitted).length;

  // Determine earned badges
  const earnedBadges = [];
  if (completedQuests.length >= 1) earnedBadges.push(BADGES.first_quest);
  if (userData?.streaks?.focus >= 7) earnedBadges.push(BADGES.streak_7);
  if (userData?.streaks?.focus >= 30) earnedBadges.push(BADGES.streak_30);
  if (focusLockedCompleted >= 5) earnedBadges.push(BADGES.focus_lock_master);
  if (proofsSubmitted >= 5) earnedBadges.push(BADGES.proof_master);
  if (levelInfo.level >= 10) earnedBadges.push(BADGES.level_10);
  if (completedQuests.some(q => q.difficulty >= 5)) earnedBadges.push(BADGES.five_star_quest);

  // Check season badges
  const earnedSeasonBadges = [];
  const now = new Date();
  const userCreated = userData?.createdAt?.toDate ? userData.createdAt.toDate() : new Date();
  Object.values(SEASON_BADGES).forEach(sb => {
    const start = new Date(sb.startDate);
    const end = new Date(sb.endDate);
    end.setHours(23, 59, 59);
    if (sb.id === 'early_adopter' || sb.id === 'hackathon_hero') {
      if (userCreated >= start && userCreated <= end) earnedSeasonBadges.push(sb);
    } else if (sb.id === 'summer_grinder_2026') {
      if (now >= start && now <= end && completedQuests.length >= sb.requirement) earnedSeasonBadges.push(sb);
    }
  });

  return (
    <div className="profile" id="profile-page">
      {/* Hero Card */}
      <div className="profile__hero glass-card glass-card--glow-purple glass-card--no-hover animate-fade-in-up">
        <div className="profile__avatar">
          {userData?.photoURL ? (
            <img src={userData.photoURL} alt="avatar" className="profile__avatar-img" />
          ) : (
            <span className="profile__avatar-fallback">{levelInfo.rank.emoji}</span>
          )}
        </div>
        <h2 className="h3">{userData?.displayName || 'Adventurer'}</h2>
        <div className="profile__rank-row">
          <span className="profile__rank-badge" style={{ borderColor: levelInfo.rank.color }}>
            {levelInfo.rank.emoji} {levelInfo.rank.title}
          </span>
          <span className="text-sm text-muted">Level {levelInfo.level}</span>
        </div>

        {/* XP Bar */}
        <div className="profile__xp-section">
          <div className="flex justify-between items-center mb-xs">
            <span className="text-xs text-muted">XP to Level {levelInfo.level + 1}</span>
            <span className="text-xs text-cyan font-bold">{levelInfo.xpInLevel} / 1000</span>
          </div>
          <div className="progress-bar progress-bar--lg">
            <div className="progress-bar__fill" style={{ width: `${levelInfo.progress}%` }} />
          </div>
        </div>

        <div className="profile__total-xp">
          <span className="text-gradient font-extrabold" style={{ fontSize: 'var(--font-size-2xl)' }}>
            {userData?.xp || 0}
          </span>
          <span className="text-xs text-muted">Total XP</span>
        </div>

        {/* Coins */}
        <div className="profile__coins-row">
          <div className="profile__coin-stat">
            <span>🪙</span>
            <span className="font-bold" style={{ color: '#fbbf24' }}>{userData?.coins || 0}</span>
            <span className="text-xs text-muted">Coins</span>
          </div>
          <div className="profile__coin-stat">
            <span>📜</span>
            <span className="font-bold">{userData?.certificatesUploaded || 0}</span>
            <span className="text-xs text-muted">Certificates</span>
          </div>
        </div>
      </div>

      {/* Archetype */}
      {archetype && (
        <div className="profile__archetype glass-card glass-card--no-hover animate-fade-in-up delay-1">
          <h4 className="text-sm font-semibold text-muted mb-sm">YOUR ARCHETYPE</h4>
          <div className="profile__archetype-main">
            <span className="profile__archetype-emoji">{archetype.emoji}</span>
            <div>
              <h3 className="h5" style={{ color: archetype.color }}>{archetype.name}</h3>
              <p className="text-xs text-muted">{archetype.description}</p>
            </div>
          </div>
          {secondaryArchetype && (
            <div className="profile__archetype-secondary mt-md">
              <span>{secondaryArchetype.emoji}</span>
              <span className="text-xs text-muted">Secondary: {secondaryArchetype.name}</span>
            </div>
          )}
        </div>
      )}

      {/* Stats Grid */}
      <div className="profile__stats grid grid-cols-2 animate-fade-in-up delay-2">
        <div className="profile__stat-card glass-card glass-card--no-hover">
          <span className="profile__stat-value">{completedQuests.length}</span>
          <span className="profile__stat-label">Quests Done</span>
        </div>
        <div className="profile__stat-card glass-card glass-card--no-hover">
          <span className="profile__stat-value">{completionRate}%</span>
          <span className="profile__stat-label">Completion Rate</span>
        </div>
        <div className="profile__stat-card glass-card glass-card--no-hover">
          <span className="profile__stat-value">{focusLockedCompleted}</span>
          <span className="profile__stat-label">Focus Locks Won</span>
        </div>
        <div className="profile__stat-card glass-card glass-card--no-hover">
          <span className="profile__stat-value">{proofsSubmitted}</span>
          <span className="profile__stat-label">Proofs Verified</span>
        </div>
      </div>

      {/* Streaks */}
      <div className="profile__streaks glass-card glass-card--no-hover animate-fade-in-up delay-3">
        <h4 className="text-sm font-semibold text-muted mb-base">ACTIVE STREAKS</h4>
        <div className="profile__streak-row">
          <span>🔥 Focus Streak</span>
          <span className="font-bold">{userData?.streaks?.focus || 0} days</span>
        </div>
        <div className="profile__streak-row">
          <span>📈 Growth Streak</span>
          <span className="font-bold">{userData?.streaks?.growth || 0} days</span>
        </div>
        <div className="profile__streak-row">
          <span>✅ Commitment Streak</span>
          <span className="font-bold">{userData?.streaks?.commitment || 0} days</span>
        </div>
        <div className="profile__streak-row">
          <span>🦅 Recovery Streak</span>
          <span className="font-bold">{userData?.streaks?.recovery || 0} days</span>
        </div>
      </div>

      {/* Badges */}
      <div className="profile__badges animate-fade-in-up delay-4">
        <h4 className="text-sm font-semibold text-muted mb-base">ACHIEVEMENTS</h4>
        <div className="profile__badge-grid">
          {Object.values(BADGES).map((badge) => {
            const earned = earnedBadges.some(b => b.id === badge.id);
            return (
              <div
                key={badge.id}
                className={`profile__badge ${earned ? 'profile__badge--earned' : ''}`}
                title={badge.description}
              >
                <span className="profile__badge-icon">{badge.icon}</span>
                <span className="profile__badge-name">{badge.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mastery Badges */}
      <div className="profile__badges animate-fade-in-up delay-4">
        <h4 className="text-sm font-semibold text-muted mb-base">🏅 MASTERY BADGES</h4>
        <div className="profile__badge-grid">
          {Object.values(MASTERY_BADGES).map((badge) => {
            const earned = (userData?.badges || []).includes(badge.id);
            return (
              <div
                key={badge.id}
                className={`profile__badge ${earned ? 'profile__badge--earned' : ''}`}
                title={badge.description}
              >
                <span className="profile__badge-icon">{badge.icon}</span>
                <span className="profile__badge-name">{badge.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Season Badges */}
      <div className="profile__badges animate-fade-in-up delay-5">
        <h4 className="text-sm font-semibold text-muted mb-base">🏅 SEASON BADGES</h4>
        <div className="profile__badge-grid">
          {Object.values(SEASON_BADGES).map((badge) => {
            const earned = earnedSeasonBadges.some(b => b.id === badge.id);
            return (
              <div
                key={badge.id}
                className={`profile__badge ${earned ? 'profile__badge--earned' : ''}`}
                title={badge.description}
              >
                <span className="profile__badge-icon">{badge.icon}</span>
                <span className="profile__badge-name">{badge.name}</span>
                <span className="text-xs text-tertiary">{badge.season}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Next Rank */}
      {nextRank && (
        <div className="profile__next-rank glass-card glass-card--no-hover animate-fade-in-up delay-6">
          <span className="text-xs text-muted">NEXT RANK</span>
          <div className="profile__next-rank-info">
            <span style={{ fontSize: '1.5rem' }}>{nextRank.emoji}</span>
            <div>
              <span className="font-bold" style={{ color: nextRank.color }}>{nextRank.title}</span>
              <span className="text-xs text-muted"> at Level {nextRank.level}</span>
            </div>
          </div>
        </div>
      )}

      {/* Logout */}
      <button className="btn btn--ghost btn--full mt-lg animate-fade-in delay-6" onClick={logout}>
        Sign Out
      </button>
    </div>
  );
}
