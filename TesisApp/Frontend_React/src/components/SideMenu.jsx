import { useEffect } from 'react';

function SideMenu({ isOpen, onClose, items, currentPageId, onNavigate }) {
  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const handleSelect = (pageId) => {
    onNavigate(pageId);
    onClose();
  };

  return (
    <>
      <div
        className={`side-menu-overlay ${isOpen ? 'open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={`side-menu ${isOpen ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
      >
        <div className="side-menu-header">
          <div className="side-menu-title">
            <span className="side-menu-logo" aria-hidden="true">
              🎯
            </span>
            <div>
              <h2>Menú</h2>
              <p>Navega por la aplicación</p>
            </div>
          </div>
          <button
            type="button"
            className="side-menu-close"
            onClick={onClose}
            aria-label="Cerrar menú"
          >
            ✕
          </button>
        </div>

        <nav className="side-menu-nav">
          <ul>
            {items.map((item) => {
              const isActive = item.id === currentPageId;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    className={`side-menu-item ${isActive ? 'active' : ''}`}
                    onClick={() => handleSelect(item.id)}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <span className="side-menu-item-icon" aria-hidden="true">
                      {item.icon}
                    </span>
                    <span className="side-menu-item-text">
                      <span className="side-menu-item-label">{item.label}</span>
                      {item.description && (
                        <span className="side-menu-item-desc">
                          {item.description}
                        </span>
                      )}
                    </span>
                    <span className="side-menu-item-chevron" aria-hidden="true">
                      →
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="side-menu-footer">
          <p>Tesis · {new Date().getFullYear()}</p>
          <p>Modelo Random Forest</p>
        </div>
      </aside>
    </>
  );
}

export default SideMenu;
