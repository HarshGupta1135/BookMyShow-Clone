import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "../config";


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

  .md-page { min-height: 100vh; background: var(--bg); display: flex; flex-direction: column; }

  /* NAVBAR */
  .md-nav {
    background: var(--bg-card); border-bottom: 1px solid var(--border);
    box-shadow: var(--shadow-sm); position: sticky; top: 0; z-index: 100;
  }
  .md-nav-inner {
    max-width: 1200px; margin: 0 auto; padding: 0 40px; height: 68px;
    display: flex; align-items: center; gap: 20px;
  }
  .md-back-btn {
    display: flex; align-items: center; gap: 6px;
    background: none; border: 1.5px solid var(--border);
    border-radius: 8px; padding: 7px 14px;
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500;
    color: var(--text-mut); cursor: pointer; transition: all 0.18s;
  }
  .md-back-btn:hover { border-color: var(--red); color: var(--red); background: var(--red-light); }
  .md-logo {
    font-family: 'Playfair Display', serif;
    font-size: 22px; font-weight: 700; color: var(--text-h); cursor: pointer;
  }
  .md-logo em { color: var(--red); font-style: normal; }

  /* HERO STRIP */
  .md-hero {
    background: linear-gradient(135deg, #1E1510 0%, #2C1A1A 60%, #1A1612 100%);
    position: relative; overflow: hidden;
    height:380px;
  }
  .md-hero::before {
    content: '';
    position: absolute; inset: 0;
    background: radial-gradient(ellipse 60% 100% at 30% 50%, rgba(232,41,74,0.15) 0%, transparent 60%);
  }
  .md-hero-inner {
    max-width: 1200px; margin: 0 auto;
    padding: 48px 40px 0;
    display: flex; gap: 40px; align-items: flex-end;
    position: relative; z-index: 1;
  }

  /* POSTER */
  .md-poster-wrap {
    flex-shrink: 0; width: 190px;
    border-radius: 14px; overflow: hidden;
    border: 3px solid rgba(255,255,255,0.12);
    box-shadow: 0 24px 60px rgba(0,0,0,0.5);
    margin-bottom: -48px;
  }
  .md-poster-wrap img { width: 100%; display: block; aspect-ratio: 2/3; object-fit: cover; background: #2A2018; }

  /* HERO INFO */
  .md-hero-info { padding-bottom: 36px; flex: 1; min-width: 0; }
  .md-hero-chips { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 16px; }
  .md-chip {
    font-size: 11px; font-weight: 600; padding: 4px 12px;
    border-radius: 6px; letter-spacing: 0.3px;
  }
  .md-chip.genre { background: rgba(232,41,74,0.15); color: #FF8098; border: 1px solid rgba(232,41,74,0.3); }
  .md-chip.lang  { background: rgba(123,142,255,0.15); color: #A0AFFF; border: 1px solid rgba(123,142,255,0.3); }
  .md-chip.dur   { background: rgba(76,217,138,0.15); color: #6DEBAA; border: 1px solid rgba(76,217,138,0.3); }

  .md-hero-title {
    font-family: 'Playfair Display', serif;
    font-size: 48px; font-weight: 700; color: #FDFAF7;
    line-height: 1.1; margin-bottom: 12px;
  }
  .md-hero-desc { font-size: 14px; color: #babcbf; line-height: 1.7; max-width: 560px; }

  /* BODY */
  .md-body { max-width: 1200px; margin: 0 auto; padding: 80px 40px 64px; flex: 1; }

  /* CITY SECTION */
  .md-city-section {
    background: var(--bg-card); border: 1px solid var(--border);
    border-radius: 16px; padding: 28px 32px;
    box-shadow: var(--shadow-md); margin-bottom: 32px;
    display: flex; align-items: center; gap: 24px; flex-wrap: wrap;
  }
  .md-city-label {
    display: flex; align-items: center; gap: 8px;
    font-size: 13px; font-weight: 600;
    letter-spacing: 0.5px; text-transform: uppercase; color: var(--text-mut);
    white-space: nowrap;
  }
  .md-select-wrap { position: relative; flex: 1; min-width: 220px; max-width: 320px; }
  .md-select-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--text-dim); pointer-events: none; }
  .md-select-caret { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); color: var(--text-dim); pointer-events: none; }
  .md-select {
    width: 100%; appearance: none;
    padding: 12px 38px 12px 42px;
    background: var(--bg-input); border: 1.5px solid var(--border);
    border-radius: 10px; color: var(--text-h);
    font-family: 'DM Sans', sans-serif; font-size: 14px;
    cursor: pointer; outline: none;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  }
  .md-select:focus { border-color: var(--red); box-shadow: 0 0 0 3px var(--red-glow); background: #fff; }
  .md-select option { background: #fff; color: var(--text-h); }

  /* SECTION DIVIDER */
  .md-sec-hd {
    display: flex; align-items: center; gap: 14px; margin-bottom: 24px;
  }
  .md-sec-title {
    font-family: 'Playfair Display', serif;
    font-size: 24px; font-weight: 700; color: var(--text-h);
    white-space: nowrap;
  }
  .md-sec-line { flex: 1; height: 1px; background: var(--border); }

  /* THEATER CARD */
  .md-theater {
    background: var(--bg-card); border: 1px solid var(--border);
    border-radius: 14px; padding: 24px 28px; margin-bottom: 16px;
    box-shadow: var(--shadow-sm);
    transition: box-shadow 0.2s, border-color 0.2s;
  }
  .md-theater:hover { box-shadow: var(--shadow-md); border-color: var(--border-dk); }

  .md-theater-hd {
    display: flex; align-items: center; gap: 14px; margin-bottom: 18px;
    padding-bottom: 16px; border-bottom: 1px solid var(--border);
  }
  .md-theater-icon {
    width: 40px; height: 40px; border-radius: 10px;
    background: var(--red-light); border: 1px solid rgba(232,41,74,0.2);
    display: flex; align-items: center; justify-content: center;
    color: var(--red); flex-shrink: 0;
  }
  .md-theater-name { font-size: 16px; font-weight: 600; color: var(--text-h); }
  .md-theater-sub { font-size: 12px; color: var(--text-dim); margin-top: 2px; }
  .md-theater-badge {
    margin-left: auto;
    font-size: 11px; font-weight: 600; padding: 3px 10px;
    border-radius: 999px; background: #EDFBF4;
    color: #2F8F5E; border: 1px solid #B5EDD3;
  }

  .md-timings { display: flex; flex-wrap: wrap; gap: 10px; }
  .md-time-btn {
    padding: 9px 22px;
    background: var(--bg); border: 1.5px solid var(--border);
    border-radius: 8px; color: var(--text-body);
    font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500;
    cursor: pointer; transition: all 0.18s;
  }
  .md-time-btn:hover {
    background: var(--red); border-color: var(--red); color: #fff;
    transform: translateY(-2px); box-shadow: 0 4px 14px var(--red-glow);
  }

  /* PLACEHOLDER */
  .md-placeholder {
    background: var(--bg-card); border: 1px solid var(--border);
    border-radius: 14px; text-align: center; padding: 64px 20px;
    box-shadow: var(--shadow-sm);
  }
  .md-placeholder-icon { font-size: 48px; display: block; margin-bottom: 16px; }
  .md-placeholder-text { font-size: 18px; font-weight: 600; color: var(--text-mut); margin-bottom: 6px; }
  .md-placeholder-sub { font-size: 14px; color: var(--text-dim); }

  /* LOADING */
  .md-loading {
    min-height: 100vh; background: var(--bg);
    display: flex; align-items: center; justify-content: center;
    flex-direction: column; gap: 16px;
    font-family: 'Playfair Display', serif;
    font-size: 22px; color: var(--text-mut);
  }
  .md-loading-dot {
    width: 40px; height: 4px; border-radius: 2px;
    background: var(--red); animation: loadpulse 1.2s ease-in-out infinite;
  }
  @keyframes loadpulse { 0%,100%{opacity:0.3;transform:scaleX(0.6)} 50%{opacity:1;transform:scaleX(1)} }

  /* FOOTER */
  .md-footer {
    background: var(--bg-card); border-top: 1px solid var(--border);
    text-align: center; padding: 22px;
    font-size: 12px; color: var(--text-dim); letter-spacing: 0.8px;
  }

  @media (max-width: 768px) {
    .md-nav-inner { padding: 0 16px; }
    .md-hero-inner { flex-direction: column; align-items: flex-start; padding: 28px 20px 0; gap: 20px; }
    .md-poster-wrap { width: 120px; margin-bottom: -36px; }
    .md-hero-title { font-size: 32px; }
    .md-body { padding: 56px 20px 48px; }
    .md-theater { padding: 18px 16px; }
    .md-city-section { padding: 20px; }
  }
`;

function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [shows, setShows] = useState([]);
  const navigate = useNavigate();

  // Fetch movie details
  useEffect(() => {
    const fetchMovie = async () => {
      const { data } = await axios.get(`${API_URL}/api/movies/${id}`);
setMovie(data);
    };
    fetchMovie();
  }, [id]);

  // Fetch cities
  useEffect(() => {
    const fetchCities = async () => {
      const { data } = await axios.get(`${API_URL}/api/cities`);
      setCities(data);
    };
    fetchCities();
  }, []);

  // Fetch shows when city changes
  useEffect(() => {
    if (!selectedCity) return;
    const fetchShows = async () => {
      const { data } = await axios.get(
  `${API_URL}/api/shows?movieId=${id}&cityId=${selectedCity}`
);
      setShows(data);
    };
    fetchShows();
  }, [selectedCity, id]);

  if (!movie) return (
    <div className="md-loading">
      <style>{styles}</style>
      <span>Loading movie details…</span>
      <div className="md-loading-dot" />
    </div>
  );

  // Group shows by theater
  const groupedShows = shows.reduce((acc, show) => {
    const theaterName = show.theater.name;
    if (!acc[theaterName]) acc[theaterName] = [];
    acc[theaterName].push(show);
    return acc;
  }, {});

  return (
    <>
      <style>{styles}</style>
      <div className="md-page">

        {/* NAVBAR */}
        <nav className="md-nav">
          <div className="md-nav-inner">
            <button className="md-back-btn" onClick={() => navigate("/")}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="m15 18-6-6 6-6"/>
              </svg>
              Back
            </button>
            <div className="md-logo" onClick={() => navigate("/")}>Book<em>My</em>Show</div>
          </div>
        </nav>

        {/* HERO */}
        <div className="md-hero">
          <div className="md-hero-inner">
            <div className="md-poster-wrap">
              <img src={movie.poster} alt={movie.title} />
            </div>
            <div className="md-hero-info">
              <div className="md-hero-chips">
                {movie.genre    && <span className="md-chip genre">{movie.genre}</span>}
                {movie.language && <span className="md-chip lang">{movie.language}</span>}
                {movie.duration && <span className="md-chip dur">{movie.duration} mins</span>}
              </div>
              <div className="md-hero-title">{movie.title}</div>
              {movie.description && <div className="md-hero-desc">{movie.description}</div>}
            </div>
          </div>
        </div>

        {/* BODY */}
        <main className="md-body">

          {/* CITY SELECTOR */}
          <div className="md-city-section">
            <div className="md-city-label">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/>
              </svg>
              Select City
            </div>
            <div className="md-select-wrap">
              <svg className="md-select-icon" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
              </svg>
              <select
                className="md-select"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                <option value="">— Choose a city —</option>
                {cities.map((city) => (
                  <option key={city._id} value={city._id}>{city.name}</option>
                ))}
              </select>
              <svg className="md-select-caret" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </div>
          </div>

          {/* SHOWS */}
          {!selectedCity ? (
            <div className="md-placeholder">
              <span className="md-placeholder-icon">🏙️</span>
              <p className="md-placeholder-text">Choose your city</p>
              <p className="md-placeholder-sub">Select a city above to see available shows</p>
            </div>
          ) : (
            <>
              <div className="md-sec-hd">
                <h2 className="md-sec-title">Available Shows</h2>
                <div className="md-sec-line" />
              </div>

              {Object.keys(groupedShows).length === 0 ? (
                <div className="md-placeholder">
                  <span className="md-placeholder-icon">🎭</span>
                  <p className="md-placeholder-text">No shows available</p>
                  <p className="md-placeholder-sub">Try selecting a different city</p>
                </div>
              ) : (
                Object.entries(groupedShows).map(([theaterName, theaterShows]) => (
                  <div key={theaterName} className="md-theater">
                    <div className="md-theater-hd">
                      <div className="md-theater-icon">
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M2 9V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4"/><rect x="2" y="9" width="20" height="13" rx="2"/>
                        </svg>
                      </div>
                      <div>
                        <div className="md-theater-name">{theaterName}</div>
                        <div className="md-theater-sub">{theaterShows.length} show{theaterShows.length > 1 ? "s" : ""} available today</div>
                      </div>
                      <span className="md-theater-badge">Open</span>
                    </div>
                    <div className="md-timings">
                      {theaterShows.map((show) => (
                        <button
                          key={show._id}
                          className="md-time-btn"
                          onClick={() => navigate(`/show/${show._id}`)}
                        >
                          {new Date(show.showTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </button>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </>
          )}
        </main>

        <footer className="md-footer">© 2026 BookMyShow Clone · All rights reserved</footer>
      </div>
    </>
  );
}

export default MovieDetails;