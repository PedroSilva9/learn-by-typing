import { faRotateRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useCallback, useEffect, useRef, useState } from 'react'
import { PassageSelector } from './components/PassageSelector'
import { ThemeSelector } from './components/ThemeSelector'
import type { Passage } from './data/passages'
import { passages } from './data/passages'
import './App.css'

function App() {
  const [activePassage, setActivePassage] = useState<Passage>(passages[0])
  const [typed, setTyped] = useState<string>('')
  const [strict, setStrict] = useState<boolean>(true)
  const [showWordGloss, setShowWordGloss] = useState<boolean>(false)
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false)
  const [finished, setFinished] = useState<boolean>(false)

  const inputRef = useRef<HTMLInputElement>(null)

  const targetText = activePassage.de

  const reset = useCallback(() => {
    setTyped('')
    setFinished(false)
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (activePassage) {
      reset()
    }
  }, [activePassage, reset])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null
      if (!target) return
      if (
        target.closest('.sidebar') ||
        target.closest('.sidebar-toggle') ||
        target.closest('button, select, input, label, option')
      ) {
        return
      }
      inputRef.current?.focus()
    }

    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (finished) return

    if (e.ctrlKey || e.altKey || e.metaKey) return

    if (e.key === 'Backspace') {
      setTyped((prev) => prev.slice(0, -1))
      e.preventDefault()
      return
    }

    if (e.key.length !== 1) return

    e.preventDefault()

    const currentIndex = typed.length
    const expectedChar = targetText[currentIndex]
    const typedChar = e.key

    if (typedChar === expectedChar) {
      const newTyped = typed + typedChar
      setTyped(newTyped)

      if (newTyped.length === targetText.length) {
        setFinished(true)
      }
    } else {
      if (!strict) {
        const newTyped = typed + typedChar
        setTyped(newTyped)

        if (newTyped.length === targetText.length) {
          setFinished(true)
        }
      }
    }
  }

  const renderText = () => {
    const tokens: Array<
      | {
          type: 'word'
          text: string
          startIndex: number
          wordIndex: number
        }
      | {
          type: 'sep'
          text: string
          startIndex: number
        }
    > = []

    const wordRegex = /[A-Za-zÄÖÜäöüß]+/g
    let match: RegExpExecArray | null
    let cursor = 0
    let wordIndex = 0

    match = wordRegex.exec(targetText)
    while (match !== null) {
      if (match.index > cursor) {
        tokens.push({
          type: 'sep',
          text: targetText.slice(cursor, match.index),
          startIndex: cursor,
        })
      }

      tokens.push({
        type: 'word',
        text: match[0],
        startIndex: match.index,
        wordIndex,
      })

      cursor = match.index + match[0].length
      wordIndex += 1
      match = wordRegex.exec(targetText)
    }

    if (cursor < targetText.length) {
      tokens.push({
        type: 'sep',
        text: targetText.slice(cursor),
        startIndex: cursor,
      })
    }

    const renderChars = (text: string, startIndex: number) => {
      return text.split('').map((char, offset) => {
        const index = startIndex + offset
        let className = 'char pending'

        if (index < typed.length) {
          if (typed[index] === char) {
            className = 'char correct'
          } else {
            className = 'char incorrect'
          }
        } else if (index === typed.length) {
          className = 'char current'
        }

        return (
          <span key={index} className={className}>
            {char}
            {index === typed.length && <span className="cursor" />}
          </span>
        )
      })
    }

    return tokens.map((token) => {
      if (token.type === 'sep') {
        return (
          <span key={`sep-${token.startIndex}`} className="word-separator">
            {renderChars(token.text, token.startIndex)}
          </span>
        )
      }

      const gloss = activePassage.gloss[token.wordIndex] ?? ''

      return (
        <span key={`word-${token.startIndex}`} className="word-token">
          <span className="word-text">{renderChars(token.text, token.startIndex)}</span>
          {showWordGloss && <span className="word-gloss">{gloss}</span>}
        </span>
      )
    })
  }

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
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
              focusable="false"
            >
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
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </button>

        <header className="header">
          <h1>Learn by Typing</h1>
          <div className="controls">
            <PassageSelector
              passages={passages}
              activePassage={activePassage}
              onSelect={setActivePassage}
            />

            <button type="button" onClick={reset} className="restart-btn" aria-label="Restart">
              <FontAwesomeIcon icon={faRotateRight} />
            </button>
          </div>
        </header>

        {finished && <div className="finished-banner">Finished! Press Restart to try again.</div>}

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
  )
}

export default App
