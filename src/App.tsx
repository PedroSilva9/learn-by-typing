import { faRotateRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useCallback, useEffect, useRef, useState } from 'react'
import { PassageSelector } from './components/PassageSelector'
import { ThemeSelector } from './components/ThemeSelector'
import type { Passage } from './data/passages'
import { passages } from './data/passages'
import './App.css'

const STRICT_MODE_STORAGE_KEY = 'learn-by-typing-strict-mode'

function getInitialStrictMode(): boolean {
  if (typeof window === 'undefined') return true

  const stored = localStorage.getItem(STRICT_MODE_STORAGE_KEY)
  if (stored === 'true') return true
  if (stored === 'false') return false

  return true
}

function App() {
  const [activePassage, setActivePassage] = useState<Passage>(passages[0])
  const [typed, setTyped] = useState<string>('')
  const [strict, setStrict] = useState<boolean>(getInitialStrictMode)
  const [showWordGloss, setShowWordGloss] = useState<boolean>(false)
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false)
  const [finished, setFinished] = useState<boolean>(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const isComposingRef = useRef<boolean>(false)
  const skipNextInputRef = useRef<boolean>(false)
  const strictRef = useRef<boolean>(strict)

  // Keep strictRef in sync with strict state
  useEffect(() => {
    strictRef.current = strict
  }, [strict])

  useEffect(() => {
    localStorage.setItem(STRICT_MODE_STORAGE_KEY, String(strict))
  }, [strict])

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
      // Don't focus if clicking inside the sidebar or on the toggle button
      // But DO focus when clicking the overlay (it closes the sidebar)
      if (target.closest('.sidebar') || target.closest('.sidebar-toggle')) {
        return
      }
      // Don't focus if clicking on interactive elements, except the overlay
      if (
        target.closest('button, select, input, label, option') &&
        !target.closest('.sidebar-overlay')
      ) {
        return
      }
      inputRef.current?.focus()
    }

    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [])

  // Focus input when sidebar closes
  useEffect(() => {
    if (!sidebarOpen) {
      inputRef.current?.focus()
    }
  }, [sidebarOpen])

  // Set finished when typing is complete
  useEffect(() => {
    if (typed.length > 0 && typed.length === targetText.length) {
      setFinished(true)
    }
  }, [typed, targetText])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (finished) return
    if (isComposingRef.current) return

    if (e.ctrlKey || e.altKey || e.metaKey) return

    if (e.key === 'Backspace') {
      setTyped((prev) => prev.slice(0, -1))
      e.preventDefault()
      return
    }
  }

  const handleCompositionStart = () => {
    isComposingRef.current = true
    skipNextInputRef.current = false
  }

  const handleCompositionEnd = (e: React.CompositionEvent<HTMLInputElement>) => {
    isComposingRef.current = false
    // Process the composed data
    const data = e.data
    if (data && !finished) {
      processInput(data)
    }
    // Clear the input value
    if (inputRef.current) {
      inputRef.current.value = ''
    }
    skipNextInputRef.current = true
  }

  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    if (finished) return
    if (isComposingRef.current) return
    if (skipNextInputRef.current) {
      skipNextInputRef.current = false
      return
    }

    const input = e.currentTarget
    const value = input.value

    if (value) {
      processInput(value)
      // Clear the input after processing
      input.value = ''
    }
  }

  const processInput = (data: string) => {
    if (finished) return

    setTyped((prev) => {
      let newTyped = prev

      // Process each character in the input data
      for (const char of data) {
        const currentIndex = newTyped.length
        if (currentIndex >= targetText.length) {
          break
        }

        const expectedChar = targetText[currentIndex]

        if (char === expectedChar) {
          newTyped = newTyped + char
        } else if (!strictRef.current) {
          newTyped = newTyped + char
        }
        // In strict mode with wrong char, do nothing (char is rejected)
      }

      return newTyped
    })
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
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
          onInput={handleInput}
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
