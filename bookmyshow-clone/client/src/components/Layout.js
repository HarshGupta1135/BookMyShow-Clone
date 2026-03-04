import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

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