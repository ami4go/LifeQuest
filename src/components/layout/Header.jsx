import { useAuth } from '../../contexts/AuthContext';
import { getLevelInfo } from '../../utils/levelSystem';
import './Header.css';

export default function Header() {
  const { userData } = useAuth();
  const levelInfo = getLevelInfo(userData?.xp || 0);

  return (
    <header className="header" id="app-header">
      <div className="header__left">
        <span className="header__logo-icon">⚔️</span>
        <span className="header__logo-text text-gradient">LifeQuest</span>
      </div>
      <div className="header__right">
        <div className="header__level-badge">
          <span className="header__rank-emoji">{levelInfo.rank.emoji}</span>
          <span className="header__level-text">Lv.{levelInfo.level}</span>
        </div>
        <div className="header__xp-mini">
          <div className="header__xp-bar">
            <div
              className="header__xp-fill"
              style={{ width: `${levelInfo.progress}%` }}
            />
          </div>
          <span className="header__xp-text">{userData?.xp || 0} XP</span>
        </div>
      </div>
    </header>
  );
}
