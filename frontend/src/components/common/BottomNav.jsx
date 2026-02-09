import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';

/**
 * BottomNav - Mobile bottom navigation bar with center FAB and bottom sheet menu.
 *
 * Props:
 *  - tabs: Array of { path, label, icon: (active) => JSX }
 *  - fabAction: { icon: JSX, onClick?: fn } for center FAB
 *  - menuItems: Array of { path, label, icon: JSX, onClick?: fn } for bottom sheet
 *  - accentGradient: CSS gradient string for active/FAB color
 *  - accentColor: CSS color string for active icon/label
 *  - badgeLabel: optional string shown as a small top-right badge on the FAB
 */
const BottomNav = ({
  tabs = [],
  fabAction = null,
  menuItems = [],
  accentGradient = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  accentColor = '#667eea',
  badgeLabel = null,
}) => {
  const location = useLocation();
  const [sheetOpen, setSheetOpen] = useState(false);
  const sheetRef = useRef(null);

  const toggleSheet = useCallback(() => {
    setSheetOpen((prev) => !prev);
  }, []);

  const closeSheet = useCallback(() => {
    setSheetOpen(false);
  }, []);

  // Close sheet on route change
  useEffect(() => {
    setSheetOpen(false);
  }, [location.pathname]);

  // Close sheet on click outside
  useEffect(() => {
    if (!sheetOpen) return;
    const handleClick = (e) => {
      if (sheetRef.current && !sheetRef.current.contains(e.target)) {
        setSheetOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [sheetOpen]);

  const isActive = (path) => {
    if (path === '/demo' || path === '/home') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  // Split tabs into left/right of FAB
  const leftTabs = tabs.slice(0, 2);
  const rightTabs = tabs.slice(2, 4);

  return (
    <>
      {/* Bottom Sheet Overlay */}
      {sheetOpen && (
        <div className="btmnav-overlay animate-fade-overlay" onClick={closeSheet}>
          <div
            ref={sheetRef}
            className="btmnav-sheet animate-slide-up-sheet"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="btmnav-sheet-handle" />
            <nav className="btmnav-sheet-items">
              {menuItems.map((item, i) => (
                <React.Fragment key={item.label}>
                  {item.onClick ? (
                    <button
                      className="btmnav-sheet-item"
                      onClick={() => {
                        item.onClick();
                        closeSheet();
                      }}
                    >
                      <span className="btmnav-sheet-icon">{item.icon}</span>
                      <span className="btmnav-sheet-label">{item.label}</span>
                    </button>
                  ) : (
                    <Link
                      to={item.path}
                      className="btmnav-sheet-item"
                      onClick={closeSheet}
                    >
                      <span className="btmnav-sheet-icon">{item.icon}</span>
                      <span className="btmnav-sheet-label">{item.label}</span>
                    </Link>
                  )}
                </React.Fragment>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Bottom Nav Bar */}
      <nav className="btmnav animate-slide-up-nav">
        <div className="btmnav-inner">
          {/* Left tabs */}
          {leftTabs.map((tab) => {
            const active = isActive(tab.path);
            return (
              <Link
                key={tab.path}
                to={tab.path}
                className={`btmnav-tab ${active ? 'btmnav-tab-active' : ''}`}
              >
                <span className="btmnav-tab-icon">
                  {tab.icon(active)}
                </span>
                <span
                  className="btmnav-tab-label"
                  style={active ? { color: accentColor } : {}}
                >
                  {tab.label}
                </span>
              </Link>
            );
          })}

          {/* Center FAB */}
          {fabAction && (
            <div className="btmnav-fab-wrapper">
              <button
                className="btmnav-fab"
                style={{ background: accentGradient }}
                onClick={fabAction.onClick || toggleSheet}
                aria-label="Menu"
              >
                {sheetOpen ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                ) : (
                  fabAction.icon
                )}
                {badgeLabel && !sheetOpen && (
                  <span className="btmnav-fab-badge">{badgeLabel}</span>
                )}
              </button>
            </div>
          )}

          {/* Right tabs */}
          {rightTabs.map((tab) => {
            const active = isActive(tab.path);
            return (
              <Link
                key={tab.path}
                to={tab.path}
                className={`btmnav-tab ${active ? 'btmnav-tab-active' : ''}`}
              >
                <span className="btmnav-tab-icon">
                  {tab.icon(active)}
                </span>
                <span
                  className="btmnav-tab-label"
                  style={active ? { color: accentColor } : {}}
                >
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      <style>{`
        /* ===== Bottom Nav Bar ===== */
        .btmnav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          background: white;
          border-top: 1px solid #e5e7eb;
          padding-bottom: env(safe-area-inset-bottom, 0px);
        }

        .dark .btmnav {
          background: #1e293b;
          border-top-color: #334155;
        }

        .btmnav-inner {
          display: flex;
          align-items: flex-end;
          justify-content: space-around;
          max-width: 480px;
          margin: 0 auto;
          height: 3.5rem;
          position: relative;
        }

        /* Tab */
        .btmnav-tab {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          flex: 1;
          height: 100%;
          text-decoration: none;
          color: #94a3b8;
          transition: color 0.2s ease;
          -webkit-tap-highlight-color: transparent;
          min-width: 0;
          padding: 0.25rem 0;
        }

        .btmnav-tab-active {
          color: ${accentColor};
        }

        .btmnav-tab-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 1.5rem;
          height: 1.5rem;
          margin-bottom: 0.125rem;
        }

        .btmnav-tab-icon svg {
          width: 1.25rem;
          height: 1.25rem;
        }

        .btmnav-tab-label {
          font-size: 0.625rem;
          font-weight: 500;
          line-height: 1;
          white-space: nowrap;
          color: inherit;
        }

        /* FAB */
        .btmnav-fab-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 1;
          position: relative;
        }

        .btmnav-fab {
          position: absolute;
          bottom: 0.375rem;
          width: 3.25rem;
          height: 3.25rem;
          border-radius: 50%;
          border: none;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(102, 126, 234, 0.4);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          -webkit-tap-highlight-color: transparent;
        }

        .btmnav-fab:active {
          transform: scale(0.92);
        }

        .btmnav-fab svg {
          width: 1.375rem;
          height: 1.375rem;
        }

        .btmnav-fab-badge {
          position: absolute;
          top: -0.125rem;
          right: -0.125rem;
          background: #ef4444;
          color: white;
          font-size: 0.5rem;
          font-weight: 700;
          padding: 0.125rem 0.3rem;
          border-radius: 9999px;
          line-height: 1;
          min-width: 0.875rem;
          text-align: center;
        }

        /* ===== Bottom Sheet ===== */
        .btmnav-overlay {
          position: fixed;
          inset: 0;
          z-index: 999;
          background: rgba(0, 0, 0, 0.4);
          display: flex;
          align-items: flex-end;
          justify-content: center;
        }

        .btmnav-sheet {
          background: white;
          border-radius: 1.25rem 1.25rem 0 0;
          width: 100%;
          max-width: 480px;
          padding: 0.5rem 1rem 1rem;
          padding-bottom: calc(5rem + env(safe-area-inset-bottom, 0px));
        }

        .dark .btmnav-sheet {
          background: #1e293b;
        }

        .btmnav-sheet-handle {
          width: 2.5rem;
          height: 0.25rem;
          background: #cbd5e1;
          border-radius: 9999px;
          margin: 0 auto 0.75rem;
        }

        .dark .btmnav-sheet-handle {
          background: #475569;
        }

        .btmnav-sheet-items {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .btmnav-sheet-item {
          display: flex;
          align-items: center;
          gap: 0.875rem;
          padding: 0.875rem 1rem;
          border-radius: 0.75rem;
          text-decoration: none;
          color: #334155;
          font-size: 0.9375rem;
          font-weight: 500;
          cursor: pointer;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
          transition: background 0.15s ease;
          -webkit-tap-highlight-color: transparent;
        }

        .btmnav-sheet-item:hover,
        .btmnav-sheet-item:active {
          background: #f1f5f9;
        }

        .dark .btmnav-sheet-item {
          color: #e2e8f0;
        }

        .dark .btmnav-sheet-item:hover,
        .dark .btmnav-sheet-item:active {
          background: #334155;
        }

        .btmnav-sheet-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2.25rem;
          height: 2.25rem;
          border-radius: 0.625rem;
          background: #f1f5f9;
          color: #64748b;
          flex-shrink: 0;
        }

        .dark .btmnav-sheet-icon {
          background: #334155;
          color: #94a3b8;
        }

        .btmnav-sheet-icon svg {
          width: 1.125rem;
          height: 1.125rem;
        }

        .btmnav-sheet-label {
          flex: 1;
        }

        /* Hide on desktop */
        @media (min-width: 768px) {
          .btmnav {
            display: none;
          }
          .btmnav-overlay {
            display: none;
          }
        }
      `}</style>
    </>
  );
};

export default BottomNav;
