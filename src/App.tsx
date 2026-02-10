import { useState, useEffect, useRef, useCallback } from "react";
import { passages } from "./data/passages";
import type { Passage } from "./data/passages";
import { ThemeSelector } from "./components/ThemeSelector";
import { PassageSelector } from "./components/PassageSelector";
import "./App.css";

function App() {
  const [activePassage, setActivePassage] = useState<Passage>(passages[0]);
  const [typed, setTyped] = useState<string>("");
  const [strict, setStrict] = useState<boolean>(true);
  const [showStats, setShowStats] = useState<boolean>(true);
  const [showWordGloss, setShowWordGloss] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [errors, setErrors] = useState<number>(0);
  const [totalTyped, setTotalTyped] = useState<number>(0);
  const [finished, setFinished] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const targetText = activePassage.de;

  const reset = useCallback(() => {
    setTyped("");
    setStartTime(null);
    setErrors(0);
    setTotalTyped(0);
    setFinished(false);
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    reset();
  }, [activePassage, reset]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleContainerClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (
      target.closest('.sidebar') ||
      target.closest('.sidebar-toggle') ||
      target.closest('button, select, input, label, option')
    ) {
      return;
    }
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (finished) return;

    if (e.ctrlKey || e.altKey || e.metaKey) return;

    if (e.key === "Backspace") {
      setTyped((prev) => prev.slice(0, -1));
      e.preventDefault();
      return;
    }

    if (e.key.length !== 1) return;

    e.preventDefault();

    const currentIndex = typed.length;
    const expectedChar = targetText[currentIndex];
    const typedChar = e.key;

    if (startTime === null) {
      setStartTime(Date.now());
    }

    setTotalTyped((prev) => prev + 1);

    if (typedChar === expectedChar) {
      const newTyped = typed + typedChar;
      setTyped(newTyped);

      if (newTyped.length === targetText.length) {
        setFinished(true);
      }
    } else {
      setErrors((prev) => prev + 1);
      if (!strict) {
        const newTyped = typed + typedChar;
        setTyped(newTyped);

        if (newTyped.length === targetText.length) {
          setFinished(true);
        }
      }
    }
  };

  const correctChars = typed.split("").filter((char, i) => char === targetText[i]).length;
  const elapsedMinutes = startTime ? (Date.now() - startTime) / 1000 / 60 : 0;
  const wpm = elapsedMinutes > 0 ? Math.round((correctChars / 5) / elapsedMinutes) : 0;
  const accuracy = totalTyped > 0 ? Math.round((correctChars / totalTyped) * 100) : 100;

  const [, setTick] = useState(0);
  useEffect(() => {
    if (startTime && !finished) {
      const interval = setInterval(() => setTick((t) => t + 1), 500);
      return () => clearInterval(interval);
    }
  }, [startTime, finished]);

  const renderText = () => {
    const tokens: Array<
      | {
          type: "word";
          text: string;
          startIndex: number;
          wordIndex: number;
        }
      | {
          type: "sep";
          text: string;
          startIndex: number;
        }
    > = [];

    const wordRegex = /[A-Za-zÄÖÜäöüß]+/g;
    let match: RegExpExecArray | null;
    let cursor = 0;
    let wordIndex = 0;

    while ((match = wordRegex.exec(targetText)) !== null) {
      if (match.index > cursor) {
        tokens.push({
          type: "sep",
          text: targetText.slice(cursor, match.index),
          startIndex: cursor,
        });
      }

      tokens.push({
        type: "word",
        text: match[0],
        startIndex: match.index,
        wordIndex,
      });

      cursor = match.index + match[0].length;
      wordIndex += 1;
    }

    if (cursor < targetText.length) {
      tokens.push({
        type: "sep",
        text: targetText.slice(cursor),
        startIndex: cursor,
      });
    }

    const renderChars = (text: string, startIndex: number) => {
      return text.split("").map((char, offset) => {
        const index = startIndex + offset;
        let className = "char pending";

        if (index < typed.length) {
          if (typed[index] === char) {
            className = "char correct";
          } else {
            className = "char incorrect";
          }
        } else if (index === typed.length) {
          className = "char current";
        }

        return (
          <span key={index} className={className}>
            {char}
            {index === typed.length && <span className="cursor" />}
          </span>
        );
      });
    };

    return tokens.map((token, index) => {
      if (token.type === "sep") {
        return (
          <span key={`sep-${index}`} className="word-separator">
            {renderChars(token.text, token.startIndex)}
          </span>
        );
      }

      const gloss = activePassage.gloss[token.wordIndex] ?? "";

      return (
        <span key={`word-${index}`} className="word-token">
          <span className="word-text">{renderChars(token.text, token.startIndex)}</span>
          {showWordGloss && <span className="word-gloss">{gloss}</span>}
        </span>
      );
    });
  };

  return (
    <div className="app-container">
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h2>Settings</h2>
          <button
            className="sidebar-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
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
                ? "You must type the correct character to proceed."
                : "Mistakes are recorded but you can continue."}
            </p>
          </div>

          <div className="setting-group">
            <h3>Display</h3>
            <label className="setting-toggle">
              <input
                type="checkbox"
                checked={showStats}
                onChange={(e) => setShowStats(e.target.checked)}
              />
              <span className="toggle-switch"></span>
              <span className="setting-label">Show Statistics</span>
            </label>
            <p className="setting-description">
              {showStats
                ? "WPM, accuracy, and errors are visible."
                : "Statistics are hidden for distraction-free typing."}
            </p>
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
                ? "Single-word translations are visible under each word."
                : "Single-word translations are hidden."}
            </p>
          </div>

          <div className="setting-group">
            <h3>Theme</h3>
            <ThemeSelector />
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="app" onClick={handleContainerClick}>
        <button
          className="sidebar-toggle"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open settings"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </button>

        <header className="header">
          <h1>German Typing Practice</h1>
          <div className="controls">
            <PassageSelector
              passages={passages}
              activePassage={activePassage}
              onSelect={setActivePassage}
            />

            <button onClick={reset} className="restart-btn">
              Restart
            </button>
          </div>
        </header>

        {showStats && (
          <div className="stats">
            <div className="stat">
              <span className="stat-value">{wpm}</span>
              <span className="stat-label">WPM</span>
            </div>
            <div className="stat">
              <span className="stat-value">{accuracy}%</span>
              <span className="stat-label">Accuracy</span>
            </div>
            <div className="stat">
              <span className="stat-value">{errors}</span>
              <span className="stat-label">Errors</span>
            </div>
          </div>
        )}

        {finished && (
          <div className="finished-banner">
            Finished! Press Restart to try again.
          </div>
        )}

        <main className="main">
          <div className="column german-column">
            <h2>Deutsch</h2>
            <div className="text-display">{renderText()}</div>
          </div>
          <div className="column english-column">
            <h2>English</h2>
            <div className="text-display translation">{activePassage.en}</div>
          </div>
        </main>

        <input
          ref={inputRef}
          type="text"
          className="hidden-input"
          onKeyDown={handleKeyDown}
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
        />

        <footer className="footer">
          <p>Click anywhere to focus. Type the German text on the left.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
