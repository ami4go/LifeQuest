import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useQuests } from '../contexts/QuestContext';
import { generateBossPrep } from '../services/aiService';
import { doc, updateDoc, Timestamp, addDoc, collection } from 'firebase/firestore';
import { db } from '../config/firebase';
import { calculateQuestXP } from '../utils/xpCalculator';
import './BossBattlePage.css';

export default function BossBattlePage() {
  const { missionId } = useParams();
  const navigate = useNavigate();
  const { user, userData, updateUserData } = useAuth();
  const { missions, quests } = useQuests();

  const mission = missions.find(m => m.id === missionId);
  const missionQuests = quests.filter(q => q.missionId === missionId);
  const completedQuests = missionQuests.filter(q => q.status === 'completed');
  const pendingQuests = missionQuests.filter(q => q.status !== 'completed' && q.status !== 'failed');
  const progress = missionQuests.length > 0 ? Math.round((completedQuests.length / missionQuests.length) * 100) : 0;

  const [bossData, setBossData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [xpAwarded, setXpAwarded] = useState(null);

  const generatePrep = async () => {
    if (!mission) return;
    setGenerating(true);
    try {
      const deadline = mission.deadline?.toDate ? mission.deadline.toDate().toISOString() : mission.deadline;
      const result = await generateBossPrep(
        mission.title || mission.goalText,
        deadline,
        missionQuests
      );
      setBossData(result);

      // Save prep quests to Firestore
      if (result.prepQuests) {
        for (const pq of result.prepQuests) {
          await addDoc(collection(db, 'quests'), {
            userId: user.uid,
            missionId,
            title: `🐉 ${pq.title}`,
            description: pq.description,
            difficulty: pq.difficulty,
            estimatedMinutes: pq.estimatedMinutes,
            xpReward: pq.difficulty * 100 * 3, // 3x for boss prep
            order: pq.order,
            status: 'pending',
            focusLocked: false,
            proofSubmitted: false,
            isBossPrep: true,
            createdAt: Timestamp.now(),
          });
        }
      }
    } catch (err) {
      console.error('Boss prep failed:', err);
    }
    setGenerating(false);
  };

  const handleCompleteBoss = async () => {
    if (!mission) return;
    setLoading(true);

    // Award 3x XP for boss completion
    const bossXP = missionQuests.reduce((sum, q) => sum + (q.xpReward || 0), 0);
    const bonusXP = Math.round(bossXP * 0.5); // 50% bonus for boss
    const totalXP = bonusXP;

    const newXP = (userData?.xp || 0) + totalXP;
    await updateUserData({
      xp: newXP,
      level: Math.floor(newXP / 1000),
    });

    // Mark mission as completed
    await updateDoc(doc(db, 'missions', missionId), {
      status: 'completed',
      completedAt: Timestamp.now(),
    });

    setXpAwarded(totalXP);
    setLoading(false);
  };

  if (!mission) {
    return (
      <div className="loading-screen">
        <div className="spinner spinner--lg" />
        <p className="text-muted">Loading boss battle...</p>
      </div>
    );
  }

  // Victory screen
  if (xpAwarded) {
    return (
      <div className="boss__victory" id="boss-victory">
        <div className="boss__victory-content">
          <div className="boss__victory-icon animate-bounce-in">🏆</div>
          <h2 className="h2 animate-fade-in-up delay-1">Boss Defeated!</h2>
          <div className="boss__victory-xp animate-scale-in delay-2">+{xpAwarded} XP</div>
          <p className="text-muted animate-fade-in-up delay-3">
            You conquered "{mission.title || mission.goalText}"!
          </p>
          <button
            className="btn btn--primary btn--lg btn--full animate-fade-in-up delay-4"
            onClick={() => navigate('/dashboard')}
          >
            Return to Base ⚔️
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="boss" id="boss-battle-page">
      {/* Boss Header */}
      <div className="boss__header animate-fade-in-up">
        <button className="btn btn--ghost btn--sm" onClick={() => navigate(-1)}>← Back</button>
        <span className="badge badge--danger">🐉 Boss Battle</span>
      </div>

      {/* Boss Card */}
      <div className="boss__card glass-card glass-card--glow-purple animate-fade-in-up delay-1">
        <div className="boss__emoji">🐉</div>
        <h2 className="h3 text-center">{bossData?.bossName || mission.title || mission.goalText}</h2>
        {bossData?.battleCry && (
          <p className="boss__battlecry text-center">"{bossData.battleCry}"</p>
        )}

        {/* HP Bar (Progress) */}
        <div className="boss__hp-section">
          <div className="boss__hp-labels">
            <span className="text-xs text-danger font-bold">BOSS HP</span>
            <span className="text-xs text-muted">{100 - progress}% remaining</span>
          </div>
          <div className="boss__hp-bar">
            <div className="boss__hp-fill" style={{ width: `${100 - progress}%` }} />
          </div>
          <div className="boss__hp-labels">
            <span className="text-xs text-success">{completedQuests.length} quests done</span>
            <span className="text-xs text-muted">{pendingQuests.length} remaining</span>
          </div>
        </div>
      </div>

      {/* Pending Quests */}
      {pendingQuests.length > 0 && (
        <div className="boss__section animate-fade-in-up delay-2">
          <h3 className="boss__section-title">⚔️ Remaining Quests</h3>
          <div className="boss__quest-list">
            {pendingQuests.map((quest, idx) => (
              <div
                key={quest.id}
                className={`boss__quest glass-card glass-card--no-hover ${quest.isBossPrep ? 'boss__quest--prep' : ''}`}
                onClick={() => navigate(`/quest/${quest.id}`)}
              >
                <div className="boss__quest-info">
                  <span className="boss__quest-title">{quest.title}</span>
                  <div className="boss__quest-meta">
                    <span className="difficulty-stars difficulty-stars--sm">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`star ${i < quest.difficulty ? 'star--filled' : ''}`}>★</span>
                      ))}
                    </span>
                    <span className="text-xs text-cyan">+{quest.xpReward} XP</span>
                  </div>
                </div>
                <span className="boss__quest-arrow">→</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Prep */}
      {!bossData && (
        <div className="boss__section animate-fade-in-up delay-3">
          <button
            className="btn btn--secondary btn--full"
            onClick={generatePrep}
            disabled={generating}
          >
            {generating ? (
              <><span className="spinner" /> AI Generating Prep Quests...</>
            ) : (
              '🧠 Generate AI Prep Quests'
            )}
          </button>
        </div>
      )}

      {/* Complete Boss */}
      {progress === 100 && (
        <div className="boss__section animate-fade-in-up delay-4">
          <button
            className="btn btn--success btn--lg btn--full"
            onClick={handleCompleteBoss}
            disabled={loading}
          >
            {loading ? <span className="spinner" /> : '🏆 Defeat the Boss!'}
          </button>
        </div>
      )}
    </div>
  );
}
