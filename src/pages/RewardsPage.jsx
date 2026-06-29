import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { spendCoins, getCoinHistory, getRedemptionHistory } from '../services/coinService';
import { STORE_ITEMS, MASTERY_BADGES, BADGES, SCORE_LABELS } from '../utils/constants';
import './RewardsPage.css';

export default function RewardsPage() {
  const { user, userData, updateUserData } = useAuth();
  const [activeTab, setActiveTab] = useState('store');
  const [coinHistory, setCoinHistory] = useState([]);
  const [redemptions, setRedemptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(null);
  const [showSuccess, setShowSuccess] = useState(null);
  const [processing, setProcessing] = useState(false);

  const coins = userData?.coins || 0;
  const totalEarned = userData?.totalCoinsEarned || 0;

  useEffect(() => {
    if (user && activeTab === 'history') {
      loadHistory();
    }
  }, [user, activeTab]);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const [history, orders] = await Promise.all([
        getCoinHistory(user.uid),
        getRedemptionHistory(user.uid),
      ]);
      setCoinHistory(history);
      setRedemptions(orders);
    } catch (err) {
      console.error('Failed to load history:', err);
    }
    setLoading(false);
  };

  const handleRedeem = async (item) => {
    setProcessing(true);
    try {
      const result = await spendCoins(user.uid, item.price, item.id, item.name);
      await updateUserData({ coins: result.newBalance });
      setShowConfirm(null);
      setShowSuccess(item);
      setTimeout(() => setShowSuccess(null), 3000);
    } catch (err) {
      console.error('Redemption failed:', err);
      alert(err.message);
    }
    setProcessing(false);
  };

  // Determine earned mastery badges
  const earnedMasteryBadges = [];
  const userBadges = userData?.badges || [];
  Object.values(MASTERY_BADGES).forEach(badge => {
    if (userBadges.includes(badge.id)) {
      earnedMasteryBadges.push(badge);
    }
  });

  // Check coin-based badges
  if (totalEarned >= 1000 && !earnedMasteryBadges.some(b => b.id === 'coin_collector')) {
    earnedMasteryBadges.push(MASTERY_BADGES.coin_collector);
  }
  if (redemptions.length > 0 && !earnedMasteryBadges.some(b => b.id === 'big_spender')) {
    earnedMasteryBadges.push(MASTERY_BADGES.big_spender);
  }
  if ((userData?.certificatesUploaded || 0) >= 3 && !earnedMasteryBadges.some(b => b.id === 'event_champion')) {
    earnedMasteryBadges.push(MASTERY_BADGES.event_champion);
  }

  return (
    <div className="rewards-page" id="rewards-page">
      {/* Hero Section */}
      <div className="rewards__hero glass-card glass-card--glow-purple glass-card--no-hover animate-fade-in-up">
        <div className="rewards__coin-display">
          <span className="rewards__coin-icon">🪙</span>
          <div className="rewards__coin-info">
            <span className="rewards__coin-balance">{coins.toLocaleString()}</span>
            <span className="text-xs text-muted">Available Coins</span>
          </div>
        </div>
        <div className="rewards__coin-total">
          <span className="text-xs text-muted">Total Earned</span>
          <span className="text-sm text-gradient font-bold">{totalEarned.toLocaleString()}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="rewards__tabs animate-fade-in-up delay-1">
        <button
          className={`rewards__tab ${activeTab === 'store' ? 'rewards__tab--active' : ''}`}
          onClick={() => setActiveTab('store')}
        >
          🏪 Store
        </button>
        <button
          className={`rewards__tab ${activeTab === 'badges' ? 'rewards__tab--active' : ''}`}
          onClick={() => setActiveTab('badges')}
        >
          🏅 Badges
        </button>
        <button
          className={`rewards__tab ${activeTab === 'history' ? 'rewards__tab--active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          📋 History
        </button>
      </div>

      {/* ── Store Tab ── */}
      {activeTab === 'store' && (
        <div className="rewards__store animate-fade-in-up delay-2">
          <h3 className="rewards__section-title">🏪 Merch Store</h3>
          <p className="text-sm text-muted mb-base">Redeem your hard-earned coins for exclusive LifeQuest merch!</p>

          <div className="rewards__store-grid">
            {STORE_ITEMS.map(item => {
              const canAfford = coins >= item.price;
              return (
                <div
                  key={item.id}
                  className={`rewards__item-card glass-card glass-card--no-hover ${!canAfford ? 'rewards__item-card--locked' : ''}`}
                >
                  <div className="rewards__item-emoji">{item.emoji}</div>
                  <h4 className="rewards__item-name">{item.name}</h4>
                  <p className="rewards__item-desc">{item.description}</p>
                  <div className="rewards__item-price">
                    <span>🪙</span>
                    <span className={canAfford ? 'text-gradient font-bold' : 'text-muted font-bold'}>
                      {item.price.toLocaleString()}
                    </span>
                  </div>
                  <button
                    className={`btn btn--sm btn--full ${canAfford ? 'btn--primary' : 'btn--secondary'}`}
                    disabled={!canAfford}
                    onClick={() => setShowConfirm(item)}
                  >
                    {canAfford ? 'Redeem' : `Need ${(item.price - coins).toLocaleString()} more`}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Badges Tab ── */}
      {activeTab === 'badges' && (
        <div className="rewards__badges animate-fade-in-up delay-2">
          <h3 className="rewards__section-title">🏅 Mastery Badges</h3>
          <p className="text-sm text-muted mb-base">Earn badges by scoring 5/5 on AI-evaluated challenges!</p>

          <div className="rewards__badge-grid">
            {Object.values(MASTERY_BADGES).map(badge => {
              const earned = earnedMasteryBadges.some(b => b.id === badge.id);
              return (
                <div
                  key={badge.id}
                  className={`rewards__badge-card ${earned ? 'rewards__badge-card--earned' : ''}`}
                  title={badge.description}
                >
                  <span className="rewards__badge-icon">{badge.icon}</span>
                  <span className="rewards__badge-name">{badge.name}</span>
                  <span className="rewards__badge-desc">{badge.description}</span>
                  {earned && <span className="rewards__badge-check">✅</span>}
                </div>
              );
            })}
          </div>

          <h3 className="rewards__section-title mt-lg">⚔️ Achievement Badges</h3>
          <div className="rewards__badge-grid">
            {Object.values(BADGES).map(badge => {
              const earned = userBadges.includes(badge.id);
              return (
                <div
                  key={badge.id}
                  className={`rewards__badge-card ${earned ? 'rewards__badge-card--earned' : ''}`}
                  title={badge.description}
                >
                  <span className="rewards__badge-icon">{badge.icon}</span>
                  <span className="rewards__badge-name">{badge.name}</span>
                  <span className="rewards__badge-desc">{badge.description}</span>
                  {earned && <span className="rewards__badge-check">✅</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── History Tab ── */}
      {activeTab === 'history' && (
        <div className="rewards__history animate-fade-in-up delay-2">
          <h3 className="rewards__section-title">📋 Coin History</h3>

          {loading ? (
            <div className="loading-screen" style={{ padding: '2rem' }}>
              <div className="spinner spinner--lg" />
            </div>
          ) : coinHistory.length === 0 ? (
            <div className="rewards__empty">
              <span>🪙</span>
              <p className="text-sm text-muted">No transactions yet. Complete AI-evaluated tasks to earn coins!</p>
            </div>
          ) : (
            <div className="rewards__history-list">
              {coinHistory.map(tx => (
                <div key={tx.id} className={`rewards__history-item ${tx.type === 'earn' ? 'rewards__history-item--earn' : 'rewards__history-item--spend'}`}>
                  <div className="rewards__history-info">
                    <span className="text-sm font-bold">{tx.reason}</span>
                    <span className="text-xs text-muted">
                      {tx.createdAt?.toDate ? tx.createdAt.toDate().toLocaleDateString() : ''}
                      {tx.score ? ` • Score: ${tx.score}/5` : ''}
                    </span>
                  </div>
                  <span className={`rewards__history-amount ${tx.amount > 0 ? 'text-success' : 'text-danger'}`}>
                    {tx.amount > 0 ? '+' : ''}{tx.amount} 🪙
                  </span>
                </div>
              ))}
            </div>
          )}

          {redemptions.length > 0 && (
            <>
              <h3 className="rewards__section-title mt-lg">📦 Redemption Orders</h3>
              <div className="rewards__history-list">
                {redemptions.map(order => (
                  <div key={order.id} className="rewards__history-item">
                    <div className="rewards__history-info">
                      <span className="text-sm font-bold">{order.itemName}</span>
                      <span className="text-xs text-muted">
                        {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : ''}
                      </span>
                    </div>
                    <span className={`badge ${order.status === 'shipped' ? 'badge--success' : 'badge--warning'}`}>
                      {order.status === 'shipped' ? '📦 Shipped' : '⏳ Pending'}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* ── Confirm Redemption Modal ── */}
      {showConfirm && (
        <>
          <div className="modal-backdrop" onClick={() => setShowConfirm(null)} />
          <div className="modal">
            <div className="modal__handle" />
            <div className="rewards__confirm">
              <span className="rewards__confirm-emoji">{showConfirm.emoji}</span>
              <h3 className="h4">Redeem {showConfirm.name}?</h3>
              <p className="text-sm text-muted mb-base">{showConfirm.description}</p>
              <div className="rewards__confirm-cost glass-card glass-card--no-hover">
                <span>🪙 Cost</span>
                <span className="text-gradient font-bold">{showConfirm.price.toLocaleString()}</span>
              </div>
              <div className="rewards__confirm-balance">
                <span className="text-xs text-muted">Remaining balance:</span>
                <span className="text-sm font-bold">{(coins - showConfirm.price).toLocaleString()} coins</span>
              </div>
              <div className="flex gap-base mt-lg">
                <button className="btn btn--secondary flex-1" onClick={() => setShowConfirm(null)}>Cancel</button>
                <button
                  className="btn btn--primary flex-1"
                  onClick={() => handleRedeem(showConfirm)}
                  disabled={processing}
                >
                  {processing ? <span className="spinner" /> : '🪙 Confirm'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── Success Toast ── */}
      {showSuccess && (
        <div className="rewards__success-toast animate-bounce-in">
          <span>{showSuccess.emoji}</span>
          <span>🎉 {showSuccess.name} redeemed!</span>
        </div>
      )}
    </div>
  );
}
