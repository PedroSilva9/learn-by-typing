import { faBars, faRotateRight, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { PassageSelector } from './components/PassageSelector';
import { PassageWriter } from './components/PassageWriter';
import { ThemeSelector } from './components/ThemeSelector';
import type { Passage } from './data/passages';
import { passages } from './data/passages';
import './App.css';

const STRICT_MODE_STORAGE_KEY = 'learn-by-typing-strict-mode';

function getInitialStrictMode(): boolean {
  const stored = localStorage.getItem(STRICT_MODE_STORAGE_KEY);
  if (stored === 'false') {
    return false;
  }
  return true;
}

function App() {
  const [activePassage, setActivePassage] = useState<Passage>(passages[0]);
  const [strict, setStrict] = useState<boolean>(getInitialStrictMode);
  const [showWordGloss, setShowWordGloss] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem(STRICT_MODE_STORAGE_KEY, String(strict));
  }, [strict]);

  const handleReset = () => {
    setActivePassage({ ...activePassage });
  };

  const handlePassageSelect = (passage: Passage) => {
    setActivePassage(passage);
  };

  return (
    <div className="app-container">
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Settings</h2>
          <button
            type="button"
            className="sidebar-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
        <div className="sidebar-content">
          <div className="setting-group">
            <h3>Typing Mode</h3>
            <label className="setting-toggle">
              <input
                type="checkbox"
                checked={strict}
                onChange={(e) => setStrict(e.target.checked)}
              />
              <span className="toggle-switch"></span>
              <span className="setting-label">Strict Mode</span>
            </label>
            <p className="setting-description">
              {strict
                ? 'You must type the correct character to proceed.'
                : 'Mistakes are recorded but you can continue.'}
            </p>
          </div>

          <div className="setting-group">
            <h3>Display</h3>
            <label className="setting-toggle">
              <input
                type="checkbox"
                checked={showWordGloss}
                onChange={(e) => setShowWordGloss(e.target.checked)}
              />
              <span className="toggle-switch"></span>
              <span className="setting-label">Show Word Gloss</span>
            </label>
            <p className="setting-description">
              {showWordGloss
                ? 'Single-word translations are visible under each word.'
                : 'Single-word translations are hidden.'}
            </p>
          </div>

          <div className="setting-group">
            <h3>Theme</h3>
            <ThemeSelector />
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <button
          type="button"
          className="sidebar-overlay"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => setSidebarOpen(false)}
          aria-label="Close settings"
        />
      )}

      <div className="app">
        <button
          type="button"
          className="sidebar-toggle"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open settings"
        >
          <FontAwesomeIcon icon={faBars} />
        </button>

        <header className="header">
          <h1>Learn by Typing</h1>
          <div className="controls">
            <PassageSelector
              passages={passages}
              activePassage={activePassage}
              onSelect={handlePassageSelect}
            />
            <button
              type="button"
              onClick={handleReset}
              className="restart-btn"
              aria-label="Restart"
            >
              <FontAwesomeIcon icon={faRotateRight} />
            </button>
          </div>
        </header>
        <PassageWriter
          key={activePassage.id}
          passage={activePassage}
          strict={strict}
          showWordGloss={showWordGloss}
          sidebarOpen={sidebarOpen}
        />
        <footer className="footer">
          <p>Click anywhere to focus. Type the German text on the left.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
