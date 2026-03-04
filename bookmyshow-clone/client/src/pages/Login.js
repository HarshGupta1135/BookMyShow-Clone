import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
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
    --shadow-lg: 0 16px 48px rgba(0,0,0,0.10);
  }

  html, body { background: var(--bg); font-family: 'DM Sans', sans-serif; }

  .l-page {
    min-height: 100vh; background: var(--bg);
    display: flex; flex-direction: column;
  }

  /* TOPBAR */
  .l-topbar {
    background: var(--bg-card); border-bottom: 1px solid var(--border);
    box-shadow: var(--shadow-sm);
    padding: 0 40px; height: 68px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .l-logo {
    font-family: 'Playfair Display', serif;
    font-size: 24px; font-weight: 700; color: var(--text-h); cursor: pointer;
  }
  .l-logo em { color: var(--red); font-style: normal; }
  .l-topbar-link {
    font-size: 13px; color: var(--text-mut);
    background: none; border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif;
  }
  .l-topbar-link strong { color: var(--red); font-weight: 600; }
  .l-topbar-link:hover strong { text-decoration: underline; }

  /* SPLIT LAYOUT */
  .l-body { flex: 1; display: flex; }

  .l-left {
    flex: 1; display: none;
    background: linear-gradient(145deg, #1E1510 0%, #2C1A1A 100%);
    position: relative; overflow: hidden;
    align-items: center; justify-content: center;
    padding: 60px;
  }
  @media (min-width: 900px) { .l-left { display: flex; } }
  .l-left::before {
    content: '';
    position: absolute; inset: 0;
    background: radial-gradient(ellipse 80% 70% at 50% 40%, rgba(232,41,74,0.22) 0%, transparent 65%);
  }
  .l-left-inner { position: relative; text-align: center; }
  .l-left-icon { font-size: 72px; display: block; margin-bottom: 28px; }
  .l-left-title {
    font-family: 'Playfair Display', serif;
    font-size: 36px; font-weight: 700; color: #FDFAF7;
    line-height: 1.2; margin-bottom: 14px;
  }
  .l-left-title em { color: var(--red); font-style: normal; }
  .l-left-sub { font-size: 15px; color: #9A8E84; line-height: 1.7; }
  .l-left-dots {
    display: flex; gap: 8px; justify-content: center; margin-top: 40px;
  }
  .l-dot { width: 8px; height: 8px; border-radius: 50%; background: rgba(255,255,255,0.2); }
  .l-dot.active { background: var(--red); width: 24px; border-radius: 4px; }

  /* RIGHT FORM PANEL */
  .l-right {
    width: 100%; max-width: 520px;
    display: flex; flex-direction: column;
    justify-content: center; padding: 60px 56px;
    background: var(--bg-card);
  }
  @media (max-width: 899px) { .l-right { max-width: 100%; padding: 40px 24px; } }

  .l-form-eyebrow {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 11px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase;
    color: var(--red); margin-bottom: 16px;
  }
  .l-form-eyebrow::before {
    content: ''; width: 20px; height: 2px; background: var(--red); border-radius: 2px;
  }
  .l-form-title {
    font-family: 'Playfair Display', serif;
    font-size: 36px; font-weight: 700; color: var(--text-h);
    line-height: 1.1; margin-bottom: 8px;
  }
  .l-form-sub { font-size: 14px; color: var(--text-mut); margin-bottom: 36px; }

  /* ERROR */
  .l-error {
    display: flex; align-items: flex-start; gap: 10px;
    background: var(--red-light); border: 1px solid rgba(232,41,74,0.2);
    border-left: 3px solid var(--red);
    border-radius: 8px; padding: 12px 14px;
    margin-bottom: 22px; font-size: 13px; color: #B0172E;
  }

  /* FORM */
  .l-form { display: flex; flex-direction: column; gap: 18px; }

  .l-field { display: flex; flex-direction: column; gap: 6px; }
  .l-label {
    font-size: 12px; font-weight: 600;
    letter-spacing: 0.8px; text-transform: uppercase; color: var(--text-mut);
  }
  .l-input-wrap { position: relative; display: flex; align-items: center; }
  .l-input-icon {
    position: absolute; left: 13px; color: var(--text-dim); pointer-events: none;
  }
  .l-input {
    width: 100%; padding: 13px 14px 13px 42px;
    background: var(--bg-input); border: 1.5px solid var(--border);
    border-radius: 10px; color: var(--text-h);
    font-family: 'DM Sans', sans-serif; font-size: 14px;
    outline: none; transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  }
  .l-input:focus { border-color: var(--red); box-shadow: 0 0 0 3px var(--red-glow); background: #fff; }
  .l-input::placeholder { color: var(--text-dim); }

  /* SUBMIT */
  .l-submit {
    margin-top: 6px; width: 100%; padding: 14px;
    background: var(--red); border: none; border-radius: 10px;
    color: #fff; font-family: 'DM Sans', sans-serif;
    font-size: 15px; font-weight: 600; letter-spacing: 0.3px;
    cursor: pointer; transition: all 0.18s;
    box-shadow: 0 2px 8px rgba(232,41,74,0.2);
  }
  .l-submit:hover { background: #c91f3a; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(232,41,74,0.3); }
  .l-submit:active { transform: translateY(0); }
  .l-submit:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

  /* DIVIDER */
  .l-divider { display: flex; align-items: center; gap: 14px; margin: 24px 0 20px; }
  .l-divider-line { flex: 1; height: 1px; background: var(--border); }
  .l-divider-text { font-size: 12px; color: var(--text-dim); letter-spacing: 1px; text-transform: uppercase; }

  /* SWITCH */
  .l-switch { text-align: center; font-size: 14px; color: var(--text-mut); }
  .l-switch button {
    background: none; border: none; padding: 0;
    color: var(--red); font-family: 'DM Sans', sans-serif;
    font-size: 14px; font-weight: 600; cursor: pointer;
  }
  .l-switch button:hover { text-decoration: underline; }

  /* FOOTER */
  .l-footer {
    background: var(--bg); border-top: 1px solid var(--border);
    text-align: center; padding: 18px;
    font-size: 12px; color: var(--text-dim); letter-spacing: 0.8px;
  }
`;

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const submitHandler = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );
      login(data);
      navigate("/");
    } catch (error) {
      setErrorMsg("bsdk kaha ja raha hai ❓");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="l-page">

        {/* TOPBAR */}
        <header className="l-topbar">
          <div className="l-logo" onClick={() => navigate("/")}>Book<em>My</em>Show</div>
          <button className="l-topbar-link" onClick={() => navigate("/register")}>
            New here? <strong>Create account</strong>
          </button>
        </header>

        {/* BODY */}
        <div className="l-body">

          {/* LEFT PANEL */}
          <div className="l-left">
            <div className="l-left-inner">
              <span className="l-left-icon">🎭</span>
              <div className="l-left-title">Entertainment<br />at your <em>fingertips</em></div>
              <div className="l-left-sub">
                Thousands of shows.<br />
                One seamless booking experience.
              </div>
              <div className="l-left-dots">
                <div className="l-dot active" />
                <div className="l-dot" />
                <div className="l-dot" />
              </div>
            </div>
          </div>

          {/* RIGHT FORM */}
          <div className="l-right">
            <div className="l-form-eyebrow">Welcome back</div>
            <div className="l-form-title">Sign in to<br />your account</div>
            <div className="l-form-sub">Don't miss what's showing near you</div>

            {errorMsg && (
              <div className="l-error">
                <span>⚠️</span>
                <span>{errorMsg}</span>
              </div>
            )}

            <form className="l-form" onSubmit={submitHandler}>
              <div className="l-field">
                <label className="l-label">Email address</label>
                <div className="l-input-wrap">
                  <svg className="l-input-icon" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                  <input className="l-input" type="email" placeholder="you@example.com"
                    value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
              </div>

              <div className="l-field">
                <label className="l-label">Password</label>
                <div className="l-input-wrap">
                  <svg className="l-input-icon" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <input className="l-input" type="password" placeholder="••••••••"
                    value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
              </div>

              <button className="l-submit" type="submit" disabled={loading}>
                {loading ? "Signing in…" : "Sign In →"}
              </button>
            </form>

            <div className="l-divider">
              <div className="l-divider-line" />
              <span className="l-divider-text">or</span>
              <div className="l-divider-line" />
            </div>

            <div className="l-switch">
              Don't have an account?{" "}
              <button onClick={() => navigate("/register")}>Sign up free</button>
            </div>
          </div>
        </div>

        <footer className="l-footer">© 2026 BookMyShow Clone · All rights reserved</footer>
      </div>
    </>
  );
}

export default Login;