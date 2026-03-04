import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

  .layout-wrapper { min-height: 100vh; display: flex; flex-direction: column; font-family: 'DM Sans', sans-serif; }

  /* NAV */
  .layout-nav {
    background: #ffffff;
    border-bottom: 1px solid #ececec;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    padding: 0 48px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .layout-logo {
    font-size: 22px;
    font-weight: 700;
    color: #1a1a1a;
    cursor: pointer;
    letter-spacing: -0.5px;
    background: none;
    border: none;
    font-family: 'DM Sans', sans-serif;
  }
  .layout-logo span { color: #e51937; }

  .layout-nav-search {
    flex: 1;
    max-width: 420px;
    margin: 0 40px;
    position: relative;
  }
  .layout-search-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: #aaa;
    pointer-events: none;
  }
  .layout-search-input {
    width: 100%;
    padding: 9px 16px 9px 40px;
    border: 1.5px solid #ececec;
    border-radius: 24px;
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    color: #1a1a1a;
    background: #f7f7f7;
    outline: none;
    transition: border-color 0.2s, background 0.2s;
  }
  .layout-search-input:focus {
    border-color: #e51937;
    background: #fff;
  }
  .layout-search-input::placeholder { color: #bbb; }

  .layout-nav-right {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .layout-user-badge {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .layout-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: linear-gradient(135deg, #e51937, #c0122d);
    color: #fff;
    font-size: 14px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .layout-user-text { line-height: 1.2; }
  .layout-welcome { font-size: 11px; color: #aaa; }
  .layout-username { font-size: 14px; font-weight: 600; color: #1a1a1a; }

  .layout-logout-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    border: 1.5px solid #ececec;
    border-radius: 8px;
    background: #fff;
    color: #555;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.18s;
  }
  .layout-logout-btn:hover {
    border-color: #e51937;
    color: #e51937;
    background: #fff0f2;
  }

  .layout-login-btn {
    padding: 8px 20px;
    border: none;
    border-radius: 8px;
    background: #e51937;
    color: #fff;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.18s;
  }
  .layout-login-btn:hover { background: #c0122d; }

  /* CONTENT */
  .layout-content { flex: 1; }

  @media (max-width: 768px) {
    .layout-nav { padding: 0 20px; }
    .layout-nav-search { display: none; }
  }
`;

function Layout({ children }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <style>{styles}</style>
      <div className="layout-wrapper">

        {/* PAGE CONTENT */}
        <main className="layout-content">
          {children}
        </main>

      </div>
    </>
  );
}

export default Layout;