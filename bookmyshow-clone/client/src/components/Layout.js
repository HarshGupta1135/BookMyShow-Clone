import React from "react";

const styles = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

@media (max-width: 768px) {
  .layout-nav { padding: 0 20px; }
  .layout-nav-search { display: none; }
}
`;

function Layout({ children }) {
  return (
    <>
      <style>{styles}</style>

      <div className="layout-wrapper">
        <main className="layout-content">
          {children}
        </main>
      </div>
    </>
  );
}

export default Layout;