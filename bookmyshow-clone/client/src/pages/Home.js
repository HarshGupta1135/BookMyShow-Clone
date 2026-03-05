import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { API_URL } from "../config";


const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --red:       #E8294A;
    --red-light: #FFF0F3;
    --red-mid:   rgba(232,41,74,0.10);
    --red-glow:  rgba(232,41,74,0.18);
    --bg:        #F7F5F2;
    --bg-card:   #FFFFFF;
    --border:    #E8E4DF;
    --border-dk: #D0CBC4;
    --text-h:    #1A1612;
    --text-body: #3D3830;
    --text-mut:  #8A8278;
    --text-dim:  #B8B2AA;
    --shadow-sm: 0 1px 4px rgba(0,0,0,0.06);
    --shadow-md: 0 4px 20px rgba(0,0,0,0.08);
    --shadow-lg: 0 12px 40px rgba(0,0,0,0.11);
  }

  html, body { background: var(--bg); font-family: 'DM Sans', sans-serif; }

  /* NAVBAR */
  .h-nav {
    background: #FFFFFF;
    border-bottom: 1px solid var(--border);
    box-shadow: var(--shadow-sm);
    position: sticky; top: 0; z-index: 100;
  }
  .h-nav-inner {
    max-width: 1280px; margin: 0 auto;
    padding: 0 40px; height: 68px;
    display: flex; align-items: center; justify-content: space-between; gap: 24px;
  }
  .h-logo {
    font-family: 'Playfair Display', serif;
    font-size: 24px; font-weight: 700;
    color: var(--text-h); cursor: pointer; white-space: nowrap;
  }
  .h-logo em { color: var(--red); font-style: normal; }

  .h-search {
    display: flex; align-items: center; gap: 10px;
    background: var(--bg); border: 1.5px solid var(--border);
    border-radius: 10px; padding: 9px 16px;
    flex: 1; max-width: 400px;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  }
  .h-search:focus-within {
    border-color: var(--red);
    box-shadow: 0 0 0 3px var(--red-glow);
    background: #fff;
  }
  .h-search svg { color: var(--text-dim); flex-shrink: 0; }
  .h-search input {
    background: transparent; border: none; outline: none;
    font-family: 'DM Sans', sans-serif; font-size: 14px;
    color: var(--text-h); width: 100%;
  }
  .h-search input::placeholder { color: var(--text-dim); }

  .h-nav-btns { display: flex; align-items: center; gap: 10px; }
  .h-btn-ghost {
    padding: 8px 18px; border: 1.5px solid var(--border-dk);
    border-radius: 8px; background: transparent;
    color: var(--text-body); font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 500; cursor: pointer;
    transition: all 0.18s;
  }
  .h-btn-ghost:hover { border-color: var(--red); color: var(--red); background: var(--red-light); }
  .h-btn-fill {
    padding: 8px 20px; background: var(--red); border: none;
    border-radius: 8px; color: #fff;
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600;
    cursor: pointer; transition: all 0.18s;
  }
  .h-btn-fill:hover { background: #c91f3a; box-shadow: 0 4px 14px var(--red-glow); transform: translateY(-1px); }

  /* USER SECTION */
  .h-user { display: flex; align-items: center; gap: 12px; }
  .h-user-avatar {
    width: 36px; height: 36px; border-radius: 50%;
    background: var(--red); color: #fff;
    font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 700;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; text-transform: uppercase;
    box-shadow: 0 2px 8px var(--red-glow);
  }
  .h-user-info { display: flex; flex-direction: column; line-height: 1.25; }
  .h-user-greeting { font-size: 11px; color: var(--text-dim); }
  .h-user-name { font-size: 14px; font-weight: 600; color: var(--text-h); }
  .h-btn-logout {
    padding: 8px 16px; border: 1.5px solid var(--border-dk);
    border-radius: 8px; background: transparent;
    color: var(--text-mut); font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 500; cursor: pointer;
    display: flex; align-items: center; gap: 6px;
    transition: all 0.18s;
  }
  .h-btn-logout:hover { border-color: var(--red); color: var(--red); background: var(--red-light); }

  /* HERO */
  .h-hero {
    background: linear-gradient(135deg, #1E1510 0%, #2C1A1A 50%, #1E1510 100%);
    padding: 64px 40px; text-align: center; position: relative; overflow: hidden;
  }
  .h-hero::before {
    content: '';
    position: absolute; inset: 0;
    background: radial-gradient(ellipse 70% 80% at 50% 50%, rgba(232,41,74,0.18) 0%, transparent 65%);
  }
  .h-hero-tag {
    display: inline-flex; align-items: center; gap: 6px;
    background: rgba(232,41,74,0.12); border: 1px solid rgba(232,41,74,0.3);
    border-radius: 999px; padding: 5px 16px;
    font-size: 11px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase;
    color: #FF8098; margin-bottom: 22px; position: relative;
  }
  .h-hero-title {
    font-family: 'Playfair Display', serif;
    font-size: 52px; font-weight: 700; color: #FDFAF7;
    line-height: 1.1; margin-bottom: 14px; position: relative;
  }
  .h-hero-title em { color: var(--red); font-style: normal; }
  .h-hero-sub { font-size: 16px; color: #9A8E84; position: relative; }

  /* MAIN */
  .h-main { max-width: 1280px; margin: 0 auto; padding: 48px 40px 64px; }

  .h-section-hd {
    display: flex; align-items: center;
    justify-content: space-between; margin-bottom: 28px;
  }
  .h-section-left { display: flex; align-items: baseline; gap: 12px; }
  .h-section-title {
    font-family: 'Playfair Display', serif;
    font-size: 26px; font-weight: 700; color: var(--text-h);
  }
  .h-count {
    font-size: 12px; color: var(--text-dim);
    background: var(--bg); border: 1px solid var(--border);
    border-radius: 999px; padding: 2px 10px;
  }

  /* GRID */
  .h-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(215px, 1fr)); gap: 24px;  }

  /* CARD */
  .h-card {
    background: var(--bg-card); border: 1px solid var(--border);
    border-radius: 14px; overflow: hidden; cursor: pointer; position: relative;
    transition: transform 0.22s cubic-bezier(.34,1.56,.64,1), box-shadow 0.22s, border-color 0.2s;
  }
  .h-card:hover { transform: translateY(-5px); box-shadow: var(--shadow-lg); border-color: var(--border-dk); }
  .h-card-poster { width: 100%; aspect-ratio: 2/3; object-fit: cover; display: block; background: #EDE9E4; }
  .h-card-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(26,22,18,0.85) 0%, transparent 50%);
    opacity: 0; transition: opacity 0.22s;
    display: flex; align-items: flex-end; padding: 16px;
  }
  .h-card:hover .h-card-overlay { opacity: 1; }
  .h-book-btn {
    width: 100%; padding: 10px; background: var(--red); border: none;
    border-radius: 8px; color: #fff; font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 600; cursor: pointer; transition: background 0.15s;
  }
  .h-book-btn:hover { background: #c91f3a; }
  .h-card-body { padding: 14px 16px 16px; }
  .h-card-title {
    font-size: 15px; font-weight: 600; color: var(--text-h);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 8px;
  }
  .h-card-meta { display: flex; gap: 6px; flex-wrap: wrap; }
  .h-chip {
    font-size: 11px; font-weight: 500; padding: 3px 9px;
    border-radius: 5px; border: 1px solid var(--border);
    color: var(--text-mut); background: var(--bg);
  }
  .h-chip.lang { color: #3B5BDB; background: #EEF2FF; border-color: #C5D0FA; }
  .h-chip.dur  { color: #2F8F5E; background: #EDFBF4; border-color: #B5EDD3; }

  /* SKELETON */
  .h-skel-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(215px, 1fr)); gap: 24px;}
  .h-skel-card {
    background: var(--bg-card); border: 1px solid var(--border);
    border-radius: 14px; overflow: hidden; animation: shimmer 1.6s ease-in-out infinite;
  }
  .h-skel-poster { width: 100%; aspect-ratio: 2/3; background: #EDE9E4;}
  .h-skel-body { padding: 14px 16px 16px; display: flex; flex-direction: column; gap: 8px;}
  .h-skel-line { height: 11px; border-radius: 6px; background: #EDE9E4; }
  @keyframes shimmer { 0%,100%{opacity:1} 50%{opacity:0.5} }

  /* EMPTY */
  .h-empty { text-align: center; padding: 80px 20px; }
  .h-empty-icon { font-size: 52px; display: block; margin-bottom: 16px; }
  .h-empty-text { font-size: 18px; font-weight: 600; color: var(--text-mut); margin-bottom: 6px; }
  .h-empty-sub { font-size: 14px; color: var(--text-dim); }

  /* FOOTER */
  .h-footer {
    background: var(--bg-card); border-top: 1px solid var(--border);
    text-align: center; padding: 24px;
    font-size: 12px; color: var(--text-dim); letter-spacing: 0.8px;
  }

  @media (max-width: 768px) {
    .h-nav-inner { padding: 0 20px; }
    .h-hero { padding: 40px 20px; }
    .h-hero-title { font-size: 34px; }
    .h-main { padding: 32px 20px 48px; }
    .h-grid, .h-skel-grid { grid-template-columns: repeat(2, 1fr); gap: 14px; }
    .h-nav-btns { display: none; }
  }
`;

function SkeletonCard() {
  return (
    <div className="h-skel-card">
      <div className="h-skel-poster" />
      <div className="h-skel-body">
        <div className="h-skel-line" style={{ width: "72%" }} />
        <div className="h-skel-line" style={{ width: "48%" }} />
      </div>
    </div>
  );
}

function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/movies`);
        setMovies(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  const filtered = movies.filter((m) =>
    m.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <style>{styles}</style>
      <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column" }}>

        {/* NAVBAR */}
        <nav className="h-nav">
          <div className="h-nav-inner">
            <div className="h-logo" onClick={() => navigate("/")}>Book<em>My</em>Show</div>
            <div className="h-search">
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                placeholder="Search movies, events…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="h-nav-btns">
              {user ? (
                <div className="h-user">
                  <div className="h-user-avatar">{user.name?.charAt(0) || "U"}</div>
                  <div className="h-user-info">
                    <span className="h-user-greeting">Welcome back,</span>
                    <span className="h-user-name">{user.name}</span>
                  </div>
                  <button className="h-btn-logout" onClick={() => { logout(); navigate("/"); }}>
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <button className="h-btn-ghost" onClick={() => navigate("/login")}>Sign In</button>
                  <button className="h-btn-fill" onClick={() => navigate("/register")}>Register</button>
                </>
              )}
            </div>
          </div>
        </nav>

        {/* HERO */}
        <div className="h-hero">
          <div className="h-hero-tag">🎬 Now Showing</div>
          <div className="h-hero-title">Your Next Great <em>Experience</em></div>
          <div className="h-hero-sub">Book tickets for movies, concerts, sports &amp; more</div>
        </div>

        {/* CONTENT */}
        <main className="h-main" style={{ flex: 1 }}>
          <div className="h-section-hd">
            <div className="h-section-left">
              <h2 className="h-section-title">Movies in Cinemas</h2>
              {!loading && <span className="h-count">{filtered.length} films</span>}
            </div>
          </div>

          {loading ? (
            <div className="h-skel-grid">
              {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="h-empty">
              <span className="h-empty-icon">🎬</span>
              <p className="h-empty-text">No movies found</p>
              <p className="h-empty-sub">Try a different search term</p>
            </div>
          ) : (
            <div className="h-grid">
              {filtered.map((movie) => (
                <div key={movie._id} className="h-card" onClick={() => navigate(`/movie/${movie._id}`)}>
                  <img
                    className="h-card-poster"
                    src={movie.poster}
                    alt={movie.title}
                    onError={(e) => { e.target.style.background = "#EDE9E4"; e.target.src = ""; }}
                  />
                  <div className="h-card-overlay">
                    <button className="h-book-btn"
                      onClick={(e) => { e.stopPropagation(); navigate(`/movie/${movie._id}`); }}>
                      Book Tickets
                    </button>
                  </div>
                  <div className="h-card-body">
                    <div className="h-card-title">{movie.title}</div>
                    <div className="h-card-meta">
                      {movie.language && <span className="h-chip lang">{movie.language}</span>}
                      {movie.duration && <span className="h-chip dur">{movie.duration}m</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        <footer className="h-footer">© 2026 BookMyShow Clone · All rights reserved</footer>
      </div>
    </>
  );
}

export default Home;