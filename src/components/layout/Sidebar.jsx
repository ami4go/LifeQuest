import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { NAV_ITEMS } from '../../utils/constants';
import { getLevelInfo } from '../../utils/levelSystem';
import './Sidebar.css';

export default function Sidebar() {
  const { userData, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('sidebar-collapsed', isCollapsed);
    return () => {
      document.body.classList.remove('sidebar-collapsed');
    };
  }, [isCollapsed]);
  
  if (!userData) return null;
  const levelInfo = getLevelInfo(userData.xp || 0);

  return (
    <nav className={`sidebar ${isCollapsed ? 'sidebar--collapsed' : ''}`} id="main-sidebar">
      <div className="sidebar__brand">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
          <span className="sidebar__brand-icon">⚔️</span>
          <span className="sidebar__brand-text text-gradient">LifeQuest</span>
        </div>
        <button 
          className="sidebar__toggle"
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          ☰
        </button>
      </div>

      <div className="sidebar__links">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar__item ${isActive ? 'sidebar__item--active' : ''}`
            }
          >
            <span className="sidebar__icon">{item.icon}</span>
            <span className="sidebar__label">{item.label}</span>
          </NavLink>
        ))}
      </div>

      <div className="sidebar__profile">
        <div className="sidebar__profile-info">
          {userData.photoURL ? (
            <img src={userData.photoURL} alt="Profile" className="sidebar__avatar" />
          ) : (
             <span className="sidebar__avatar-fallback">{levelInfo.rank.emoji}</span>
          )}
          <div className="sidebar__user-details">
            <span className="sidebar__user-name">{userData.displayName?.split(' ')[0] || 'Adventurer'}</span>
            <span className="sidebar__user-level">Lv.{levelInfo.level} • {userData.coins || 0} 🪙</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
