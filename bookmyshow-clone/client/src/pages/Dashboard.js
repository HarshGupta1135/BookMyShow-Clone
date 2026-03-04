import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --red:       #E8294A;
    --red-light: #FFF0F3;
    --red-glow:  rgba(232,41,74,0.18);
    --bg:        #F7F5F2;
    --bg-card:   #FFFFFF;
    --bg-input:  #FAFAF8;
    --border:    #E8E4DF;
    --border-dk: #D0CBC4;
    --text-h:    #1A1612;
    --text-body: #3D3830;
    --text-mut:  #8A8278;
    --text-dim:  #B8B2AA;
    --shadow-sm: 0 1px 4px rgba(0,0,0,0.06);
    --shadow-md: 0 4px 20px rgba(0,0,0,0.08);
    --shadow-lg: 0 12px 40px rgba(0,0,0,0.10);
  }

  html, body { background: var(--bg); font-family: 'DM Sans', sans-serif; }

  .db-page { min-height: 100vh; background: var(--bg); display: flex; flex-direction: column; }

  /* ── NAVBAR ── */
  .db-nav {
    background: var(--bg-card);
    border-bottom: 1px solid var(--border);
    box-shadow: var(--shadow-sm);
    position: sticky; top: 0; z-index: 100;
  }
  .db-nav-inner {
    max-width: 1200px; margin: 0 auto;
    padding: 0 40px; height: 68px;
    display: flex; align-items: center; justify-content: space-between; gap: 24px;
  }
  .db-logo {
    font-family: 'Playfair Display', serif;
    font-size: 24px; font-weight: 700;
    color: var(--text-h); cursor: pointer;
  }
  .db-logo em { color: var(--red); font-style: normal; }
  .db-nav-right { display: flex; align-items: center; gap: 12px; }
  .db-btn-ghost {
    padding: 8px 18px; border: 1.5px solid var(--border-dk);
    border-radius: 8px; background: transparent;
    color: var(--text-body); font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.18s;
  }
  .db-btn-ghost:hover { border-color: var(--red); color: var(--red); background: var(--red-light); }
  .db-btn-logout {
    padding: 8px 16px; border: 1.5px solid var(--border-dk);
    border-radius: 8px; background: transparent;
    color: var(--text-mut); font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 500; cursor: pointer;
    display: flex; align-items: center; gap: 6px; transition: all 0.18s;
  }
  .db-btn-logout:hover { border-color: var(--red); color: var(--red); background: var(--red-light); }

  /* ── PAGE HEADER ── */
  .db-header {
    background: linear-gradient(135deg, #1E1510 0%, #2C1A1A 60%, #1A1612 100%);
    padding: 48px 40px; position: relative; overflow: hidden;
  }
  .db-header::before {
    content: '';
    position: absolute; inset: 0;
    background: radial-gradient(ellipse 60% 100% at 20% 50%, rgba(232,41,74,0.15) 0%, transparent 60%);
    pointer-events: none;
  }
  .db-header-inner {
    max-width: 1200px; margin: 0 auto;
    display: flex; align-items: center; gap: 24px;
    position: relative; z-index: 1;
  }
  .db-header-avatar {
    width: 72px; height: 72px; border-radius: 50%;
    background: var(--red); color: #fff;
    font-family: 'Playfair Display', serif;
    font-size: 28px; font-weight: 700;
    display: flex; align-items: center; justify-content: center;
    text-transform: uppercase; flex-shrink: 0;
    border: 3px solid rgba(255,255,255,0.15);
    box-shadow: 0 8px 28px rgba(232,41,74,0.35);
  }
  .db-header-text {}
  .db-header-eyebrow {
    font-size: 11px; font-weight: 600; letter-spacing: 2px;
    text-transform: uppercase; color: #FF8098; margin-bottom: 6px;
  }
  .db-header-name {
    font-family: 'Playfair Display', serif;
    font-size: 32px; font-weight: 700; color: #FDFAF7; line-height: 1.1;
  }
  .db-header-email { font-size: 14px; color: #8A8078; margin-top: 4px; }

  /* ── BODY ── */
  .db-body {
    max-width: 1200px; margin: 0 auto;
    padding: 48px 40px 64px; flex: 1;
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: 28px;
    align-items: start;
  }

  /* ── SIDEBAR CARD ── */
  .db-sidebar {}
  .db-card {
    background: var(--bg-card); border: 1px solid var(--border);
    border-radius: 16px; overflow: hidden;
    box-shadow: var(--shadow-md);
  }
  .db-card-header {
    padding: 20px 24px 16px;
    border-bottom: 1px solid var(--border);
    display: flex; align-items: center; gap: 10px;
  }
  .db-card-header-icon {
    width: 34px; height: 34px; border-radius: 8px;
    background: var(--red-light); border: 1px solid rgba(232,41,74,0.2);
    display: flex; align-items: center; justify-content: center; color: var(--red);
    flex-shrink: 0;
  }
  .db-card-title {
    font-family: 'Playfair Display', serif;
    font-size: 16px; font-weight: 700; color: var(--text-h);
  }
  .db-card-body { padding: 20px 24px; display: flex; flex-direction: column; gap: 16px; }

  .db-info-row { display: flex; flex-direction: column; gap: 4px; }
  .db-info-label {
    font-size: 11px; font-weight: 600; letter-spacing: 1px;
    text-transform: uppercase; color: var(--text-dim);
  }
  .db-info-value {
    font-size: 15px; font-weight: 500; color: var(--text-h);
    padding: 10px 14px;
    background: var(--bg); border: 1px solid var(--border);
    border-radius: 8px;
  }

  .db-divider { height: 1px; background: var(--border); }

  .db-badge-row { display: flex; gap: 8px; flex-wrap: wrap; }
  .db-badge {
    font-size: 12px; font-weight: 500; padding: 4px 12px;
    border-radius: 999px; border: 1px solid;
  }
  .db-badge.green { color: #2F8F5E; background: #EDFBF4; border-color: #B5EDD3; }
  .db-badge.blue  { color: #3B5BDB; background: #EEF2FF; border-color: #C5D0FA; }

  /* ── MAIN CONTENT ── */
  .db-main { display: flex; flex-direction: column; gap: 24px; }

  .db-stat-grid {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;
  }
  .db-stat {
    background: var(--bg-card); border: 1px solid var(--border);
    border-radius: 14px; padding: 22px 24px;
    box-shadow: var(--shadow-sm);
    display: flex; flex-direction: column; gap: 8px;
    transition: box-shadow 0.2s, border-color 0.2s;
  }
  .db-stat:hover { box-shadow: var(--shadow-md); border-color: var(--border-dk); }
  .db-stat-icon {
    width: 40px; height: 40px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 20px; margin-bottom: 4px;
  }
  .db-stat-icon.red   { background: var(--red-light); }
  .db-stat-icon.blue  { background: #EEF2FF; }
  .db-stat-icon.green { background: #EDFBF4; }
  .db-stat-value {
    font-family: 'Playfair Display', serif;
    font-size: 28px; font-weight: 700; color: var(--text-h);
  }
  .db-stat-label { font-size: 13px; color: var(--text-mut); }

  /* Quick actions card */
  .db-actions-card {
    background: var(--bg-card); border: 1px solid var(--border);
    border-radius: 16px; overflow: hidden; box-shadow: var(--shadow-sm);
  }
  .db-actions-header {
    padding: 20px 24px 16px; border-bottom: 1px solid var(--border);
    font-family: 'Playfair Display', serif;
    font-size: 18px; font-weight: 700; color: var(--text-h);
  }
  .db-actions-body { padding: 20px 24px; display: flex; flex-direction: column; gap: 12px; }
  .db-action-btn {
    display: flex; align-items: center; gap: 14px;
    padding: 14px 18px;
    background: var(--bg); border: 1.5px solid var(--border);
    border-radius: 10px; cursor: pointer;
    transition: all 0.18s; text-align: left;
    font-family: 'DM Sans', sans-serif;
  }
  .db-action-btn:hover { border-color: var(--red); background: var(--red-light); }
  .db-action-btn:hover .db-action-icon { background: var(--red); color: #fff; }
  .db-action-icon {
    width: 38px; height: 38px; border-radius: 9px;
    background: var(--border); color: var(--text-mut);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; transition: all 0.18s;
  }
  .db-action-text {}
  .db-action-title { font-size: 14px; font-weight: 600; color: var(--text-h); }
  .db-action-sub { font-size: 12px; color: var(--text-dim); margin-top: 2px; }
  .db-action-arrow { margin-left: auto; color: var(--text-dim); }

  /* ── LOADING ── */
  .db-loading {
    min-height: 100vh; background: var(--bg);
    display: flex; align-items: center; justify-content: center;
    flex-direction: column; gap: 14px;
    font-family: 'Playfair Display', serif; font-size: 20px; color: var(--text-mut);
  }
  .db-loading-bar {
    width: 48px; height: 4px; border-radius: 2px; background: var(--red);
    animation: loadpulse 1.2s ease-in-out infinite;
  }
  @keyframes loadpulse { 0%,100%{opacity:0.3;transform:scaleX(0.5)} 50%{opacity:1;transform:scaleX(1)} }

  /* ── FOOTER ── */
  .db-footer {
    background: var(--bg-card); border-top: 1px solid var(--border);
    text-align: center; padding: 22px;
    font-size: 12px; color: var(--text-dim); letter-spacing: 0.8px;
  }

  @media (max-width: 900px) {
    .db-body { grid-template-columns: 1fr; padding: 32px 20px 48px; }
    .db-stat-grid { grid-template-columns: repeat(2, 1fr); }
    .db-nav-inner { padding: 0 20px; }
    .db-header { padding: 36px 20px; }
  }
  @media (max-width: 500px) {
    .db-stat-grid { grid-template-columns: 1fr; }
  }
`;

function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    const fetchProfile = async () => {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      if (!userInfo) {
        navigate("/");
        return;
      }

      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };

        const { data } = await axios.get(
          "http://localhost:5000/api/users/profile",
          config
        );

        setUser(data);
      } catch (error) {
        localStorage.removeItem("userInfo");
        navigate("/");
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!user) return (
    <div className="db-loading">
      <style>{styles}</style>
      <span>Loading profile…</span>
      <div className="db-loading-bar" />
    </div>
  );

  return (
    <>
      <style>{styles}</style>
      <div className="db-page">

        {/* ── NAVBAR ── */}
        <nav className="db-nav">
          <div className="db-nav-inner">
            <div className="db-logo" onClick={() => navigate("/")}>Book<em>My</em>Show</div>
            <div className="db-nav-right">
              <button className="db-btn-ghost" onClick={() => navigate("/")}>
                Browse Movies
              </button>
              <button className="db-btn-logout" onClick={handleLogout}>
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Logout
              </button>
            </div>
          </div>
        </nav>

        {/* ── PAGE HEADER ── */}
        <div className="db-header">
          <div className="db-header-inner">
            <div className="db-header-avatar">{user.name?.charAt(0) || "U"}</div>
            <div className="db-header-text">
              <div className="db-header-eyebrow">My Account</div>
              <div className="db-header-name">{user.name}</div>
              <div className="db-header-email">{user.email}</div>
            </div>
          </div>
        </div>

        {/* ── BODY ── */}
        <main className="db-body">

          {/* SIDEBAR */}
          <aside className="db-sidebar">
            <div className="db-card">
              <div className="db-card-header">
                <div className="db-card-header-icon">
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                  </svg>
                </div>
                <div className="db-card-title">Profile Details</div>
              </div>
              <div className="db-card-body">
                <div className="db-info-row">
                  <span className="db-info-label">Full Name</span>
                  <div className="db-info-value">{user.name}</div>
                </div>
                <div className="db-info-row">
                  <span className="db-info-label">Email Address</span>
                  <div className="db-info-value">{user.email}</div>
                </div>
                <div className="db-divider" />
                <div className="db-info-row">
                  <span className="db-info-label">Account Status</span>
                  <div className="db-badge-row">
                    <span className="db-badge green">✓ Verified</span>
                    <span className="db-badge blue">Member</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* MAIN */}
          <div className="db-main">

            {/* STATS */}
            <div className="db-stat-grid">
              <div className="db-stat">
                <div className="db-stat-icon red">🎬</div>
                <div className="db-stat-value">0</div>
                <div className="db-stat-label">Movies Booked</div>
              </div>
              <div className="db-stat">
                <div className="db-stat-icon blue">🎟️</div>
                <div className="db-stat-value">0</div>
                <div className="db-stat-label">Total Tickets</div>
              </div>
              <div className="db-stat">
                <div className="db-stat-icon green">⭐</div>
                <div className="db-stat-value">—</div>
                <div className="db-stat-label">Loyalty Points</div>
              </div>
            </div>

            {/* QUICK ACTIONS */}
            <div className="db-actions-card">
              <div className="db-actions-header">Quick Actions</div>
              <div className="db-actions-body">

                <button className="db-action-btn" onClick={() => navigate("/")}>
                  <div className="db-action-icon">
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
                    </svg>
                  </div>
                  <div className="db-action-text">
                    <div className="db-action-title">Browse Movies</div>
                    <div className="db-action-sub">See what's showing near you</div>
                  </div>
                  <svg className="db-action-arrow" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="m9 18 6-6-6-6"/>
                  </svg>
                </button>

                <button className="db-action-btn" onClick={handleLogout}>
                  <div className="db-action-icon">
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                  </div>
                  <div className="db-action-text">
                    <div className="db-action-title">Sign Out</div>
                    <div className="db-action-sub">Log out of your account</div>
                  </div>
                  <svg className="db-action-arrow" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="m9 18 6-6-6-6"/>
                  </svg>
                </button>

              </div>
            </div>

          </div>
        </main>

        <footer className="db-footer">© 2026 BookMyShow Clone · All rights reserved</footer>
      </div>
    </>
  );
}

export default Dashboard;