function Navbar({ onMenuClick, currentPageLabel }) {
  return (
    <nav className="navbar" aria-label="Barra de navegación principal">
      <div className="navbar-inner">
        <div className="navbar-brand">
          <div className="navbar-logo" aria-hidden="true">
            🎯
          </div>
          <div className="navbar-brand-text">
            <span className="navbar-title">SaberPro Predictor</span>
            {currentPageLabel && (
              <span className="navbar-subtitle">{currentPageLabel}</span>
            )}
          </div>
        </div>

        <button
          type="button"
          className="navbar-menu-btn"
          onClick={onMenuClick}
          aria-label="Abrir menú"
        >
          <span className="navbar-menu-icon" aria-hidden="true">
            <span></span>
            <span></span>
            <span></span>
          </span>
          <span className="navbar-menu-label">Menú</span>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
