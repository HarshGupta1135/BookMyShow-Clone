import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
  }

  html, body { background: var(--bg); font-family: 'DM Sans', sans-serif; }

  .r-page { min-height: 100vh; background: var(--bg); display: flex; flex-direction: column; }

  /* TOPBAR */
  .r-topbar {
    background: var(--bg-card); border-bottom: 1px solid var(--border);
    box-shadow: var(--shadow-sm);
    padding: 0 40px; height: 68px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .r-logo {
    font-family: 'Playfair Display', serif;
    font-size: 24px; font-weight: 700; color: var(--text-h); cursor: pointer;
  }
  .r-logo em { color: var(--red); font-style: normal; }
  .r-topbar-link {
    font-size: 13px; color: var(--text-mut);
    background: none; border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif;
  }
  .r-topbar-link strong { color: var(--red); font-weight: 600; }
  .r-topbar-link:hover strong { text-decoration: underline; }

  /* SPLIT */
  .r-body { flex: 1; display: flex; }

  .r-left {
    flex: 1; display: none;
    background: linear-gradient(145deg, #0F1A14 0%, #162210 100%);
    position: relative; overflow: hidden;
    align-items: center; justify-content: center; padding: 60px;
  }
  @media (min-width: 900px) { .r-left { display: flex; } }
  .r-left::before {
    content: '';
    position: absolute; inset: 0;
    background: radial-gradient(ellipse 80% 70% at 40% 50%, rgba(41,180,100,0.18) 0%, rgba(232,41,74,0.10) 60%, transparent 80%);
  }
  .r-left-inner { position: relative; text-align: center; }
  .r-left-icon { font-size: 72px; display: block; margin-bottom: 28px; }
  .r-left-title {
    font-family: 'Playfair Display', serif;
    font-size: 36px; font-weight: 700; color: #FDFAF7;
    line-height: 1.2; margin-bottom: 14px;
  }
  .r-left-title em { color: #4CD98A; font-style: normal; }
  .r-left-sub { font-size: 15px; color: #8A9E88; line-height: 1.7; }
  .r-perks { margin-top: 40px; display: flex; flex-direction: column; gap: 12px; text-align: left; }
  .r-perk {
    display: flex; align-items: center; gap: 12px;
    font-size: 14px; color: #C8D8C4;
  }
  .r-perk-dot {
    width: 28px; height: 28px; border-radius: 8px;
    background: rgba(76,217,138,0.15); border: 1px solid rgba(76,217,138,0.25);
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; flex-shrink: 0;
  }

  /* RIGHT FORM */
  .r-right {
    width: 100%; max-width: 520px;
    display: flex; flex-direction: column;
    justify-content: center; padding: 60px 56px;
    background: var(--bg-card);
  }
  @media (max-width: 899px) { .r-right { max-width: 100%; padding: 40px 24px; } }

  .r-form-eyebrow {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 11px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase;
    color: var(--red); margin-bottom: 16px;
  }
  .r-form-eyebrow::before {
    content: ''; width: 20px; height: 2px; background: var(--red); border-radius: 2px;
  }
  .r-form-title {
    font-family: 'Playfair Display', serif;
    font-size: 36px; font-weight: 700; color: var(--text-h);
    line-height: 1.1; margin-bottom: 8px;
  }
  .r-form-sub { font-size: 14px; color: var(--text-mut); margin-bottom: 36px; }

  /* ERROR */
  .r-error {
    display: flex; align-items: flex-start; gap: 10px;
    background: var(--red-light); border: 1px solid rgba(232,41,74,0.2);
    border-left: 3px solid var(--red);
    border-radius: 8px; padding: 12px 14px;
    margin-bottom: 22px; font-size: 13px; color: #B0172E;
  }

  /* FORM */
  .r-form { display: flex; flex-direction: column; gap: 16px; }
  .r-field { display: flex; flex-direction: column; gap: 6px; }
  .r-label {
    font-size: 12px; font-weight: 600;
    letter-spacing: 0.8px; text-transform: uppercase; color: var(--text-mut);
  }
  .r-input-wrap { position: relative; display: flex; align-items: center; }
  .r-input-icon { position: absolute; left: 13px; color: var(--text-dim); pointer-events: none; }
  .r-input {
    width: 100%; padding: 13px 14px 13px 42px;
    background: var(--bg-input); border: 1.5px solid var(--border);
    border-radius: 10px; color: var(--text-h);
    font-family: 'DM Sans', sans-serif; font-size: 14px;
    outline: none; transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  }
  .r-input:focus { border-color: var(--red); box-shadow: 0 0 0 3px var(--red-glow); background: #fff; }
  .r-input::placeholder { color: var(--text-dim); }

  /* SUBMIT */
  .r-submit {
    margin-top: 6px; width: 100%; padding: 14px;
    background: var(--red); border: none; border-radius: 10px;
    color: #fff; font-family: 'DM Sans', sans-serif;
    font-size: 15px; font-weight: 600; letter-spacing: 0.3px;
    cursor: pointer; transition: all 0.18s;
    box-shadow: 0 2px 8px rgba(232,41,74,0.2);
  }
  .r-submit:hover { background: #c91f3a; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(232,41,74,0.3); }
  .r-submit:active { transform: translateY(0); }
  .r-submit:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

  /* DIVIDER */
  .r-divider { display: flex; align-items: center; gap: 14px; margin: 24px 0 20px; }
  .r-divider-line { flex: 1; height: 1px; background: var(--border); }
  .r-divider-text { font-size: 12px; color: var(--text-dim); letter-spacing: 1px; text-transform: uppercase; }

  /* SWITCH */
  .r-switch { text-align: center; font-size: 14px; color: var(--text-mut); }
  .r-switch button {
    background: none; border: none; padding: 0;
    color: var(--red); font-family: 'DM Sans', sans-serif;
    font-size: 14px; font-weight: 600; cursor: pointer;
  }
  .r-switch button:hover { text-decoration: underline; }

  /* FOOTER */
  .r-footer {
    background: var(--bg); border-top: 1px solid var(--border);
    text-align: center; padding: 18px;
    font-size: 12px; color: var(--text-dim); letter-spacing: 0.8px;
  }
`;

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);
    try {
      await axios.post(
        "http://localhost:5000/api/auth/register",
        { name, email, password }
      );
      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (error) {
      if (error.response && error.response.data.message) {
        setErrorMsg(error.response.data.message);
      } else {
        setErrorMsg("Registration failed ❌");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="r-page">

        {/* TOPBAR */}
        <header className="r-topbar">
          <div className="r-logo" onClick={() => navigate("/")}>Book<em>My</em>Show</div>
          <button className="r-topbar-link" onClick={() => navigate("/login")}>
            Already a member? <strong>Sign in</strong>
          </button>
        </header>

        {/* BODY */}
        <div className="r-body">

          {/* LEFT PANEL */}
          <div className="r-left">
            <div className="r-left-inner">
              <span className="r-left-icon">🎟️</span>
              <div className="r-left-title">Join millions of<br /><em>happy fans</em></div>
              <div className="r-left-sub">Get instant access to the best shows in your city</div>
              <div className="r-perks">
                <div className="r-perk"><div className="r-perk-dot">🎬</div> Movies, concerts &amp; live events</div>
                <div className="r-perk"><div className="r-perk-dot">⚡</div> Instant booking confirmation</div>
                <div className="r-perk"><div className="r-perk-dot">🎁</div> Exclusive member offers</div>
              </div>
            </div>
          </div>

          {/* RIGHT FORM */}
          <div className="r-right">
            <div className="r-form-eyebrow">Get started</div>
            <div className="r-form-title">Create your<br />account</div>
            <div className="r-form-sub">Free forever · No credit card required</div>

            {errorMsg && (
              <div className="r-error">
                <span>⚠️</span>
                <span>{errorMsg}</span>
              </div>
            )}

            <form className="r-form" onSubmit={submitHandler}>
              <div className="r-field">
                <label className="r-label">Full Name</label>
                <div className="r-input-wrap">
                  <svg className="r-input-icon" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                  </svg>
                  <input className="r-input" type="text" placeholder="John Doe"
                    value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
              </div>

              <div className="r-field">
                <label className="r-label">Email address</label>
                <div className="r-input-wrap">
                  <svg className="r-input-icon" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                  <input className="r-input" type="email" placeholder="you@example.com"
                    value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
              </div>

              <div className="r-field">
                <label className="r-label">Password</label>
                <div className="r-input-wrap">
                  <svg className="r-input-icon" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <input className="r-input" type="password" placeholder="••••••••"
                    value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
              </div>

              <button className="r-submit" type="submit" disabled={loading}>
                {loading ? "Creating Account…" : "Create Account →"}
              </button>
            </form>

            <div className="r-divider">
              <div className="r-divider-line" />
              <span className="r-divider-text">or</span>
              <div className="r-divider-line" />
            </div>

            <div className="r-switch">
              Already have an account?{" "}
              <button onClick={() => navigate("/login")}>Sign in</button>
            </div>
          </div>
        </div>

        <footer className="r-footer">© 2026 BookMyShow Clone · All rights reserved</footer>
      </div>
    </>
  );
}

export default Register;