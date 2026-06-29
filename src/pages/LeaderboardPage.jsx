import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { getLevelInfo } from '../utils/levelSystem';
import './LeaderboardPage.css';

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      // Simple approach: fetch all users and sort client-side (no index needed)
      const usersSnap = await getDocs(collection(db, 'users'));
      const allUsers = usersSnap.docs.map(d => ({
        id: d.id,
        ...d.data(),
      })).sort((a, b) => (b.xp || 0) - (a.xp || 0)).slice(0, 50);

      setPlayers(allUsers);
    } catch (err) {
      console.error('Leaderboard load failed:', err);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner spinner--lg" />
        <p className="text-muted">Loading leaderboard...</p>
      </div>
    );
  }

  return (
    <div className="leaderboard" id="leaderboard-page">
      <div className="leaderboard__header animate-fade-in-up">
        <h2 className="h3">🏆 <span className="text-gradient">Leaderboard</span></h2>
        <p className="text-sm text-muted">Top adventurers ranked by XP</p>
      </div>

      {/* Top 3 Podium */}
      {players.length >= 3 && (
        <div className="leaderboard__podium animate-fade-in-up delay-1">
          {/* 2nd Place */}
          <PodiumCard player={players[1]} rank={2} isMe={players[1]?.id === user?.uid} />
          {/* 1st Place */}
          <PodiumCard player={players[0]} rank={1} isMe={players[0]?.id === user?.uid} />
          {/* 3rd Place */}
          <PodiumCard player={players[2]} rank={3} isMe={players[2]?.id === user?.uid} />
        </div>
      )}

      {/* Rest of the list */}
      <div className="leaderboard__list animate-fade-in-up delay-2">
        {players.slice(3).map((player, idx) => {
          const rank = idx + 4;
          const levelInfo = getLevelInfo(player.xp || 0);
          const isMe = player.id === user?.uid;

          return (
            <div
              key={player.id}
              className={`leaderboard__row glass-card glass-card--no-hover ${isMe ? 'leaderboard__row--me' : ''}`}
            >
              <span className="leaderboard__rank">#{rank}</span>
              <div className="leaderboard__player">
                {player.photoURL ? (
                  <img 
                    src={player.photoURL} 
                    alt="" 
                    className="leaderboard__avatar"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <span 
                  className="leaderboard__avatar-fallback"
                  style={{ display: player.photoURL ? 'none' : 'flex' }}
                >
                  {levelInfo.rank.emoji}
                </span>
                <div className="leaderboard__player-info">
                  <span className="leaderboard__name">
                    {player.displayName || 'Adventurer'}
                    {isMe && <span className="leaderboard__me-tag"> (You)</span>}
                  </span>
                  <span className="text-xs text-muted">
                    {levelInfo.rank.emoji} {levelInfo.rank.title} • Lv.{levelInfo.level}
                  </span>
                </div>
              </div>
              <span className="leaderboard__xp">{player.xp || 0} XP</span>
            </div>
          );
        })}
      </div>

      {players.length === 0 && (
        <div className="leaderboard__empty">
          <span style={{ fontSize: '3rem' }}>🏆</span>
          <p className="text-muted">No players yet. Be the first!</p>
        </div>
      )}
    </div>
  );
}

function PodiumCard({ player, rank, isMe }) {
  if (!player) return null;
  const levelInfo = getLevelInfo(player.xp || 0);
  const medals = { 1: '🥇', 2: '🥈', 3: '🥉' };
  const heights = { 1: '120px', 2: '90px', 3: '70px' };

  return (
    <div className={`podium ${rank === 1 ? 'podium--first' : ''} ${isMe ? 'podium--me' : ''}`}>
      <div className="podium__avatar-wrap">
        {player.photoURL ? (
          <img 
            src={player.photoURL} 
            alt="" 
            className="podium__avatar"
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <span 
          className="podium__avatar-fallback"
          style={{ display: player.photoURL ? 'none' : 'flex' }}
        >
          {levelInfo.rank.emoji}
        </span>
        <span className="podium__medal">{medals[rank]}</span>
      </div>
      <span className="podium__name">
        {player.displayName?.split(' ')[0] || 'Anon'}
        {isMe && <span className="leaderboard__me-tag"> (You)</span>}
      </span>
      <span className="podium__xp">{player.xp || 0} XP</span>
      <div className="podium__bar" style={{ height: heights[rank] }} />
    </div>
  );
}
