import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Passage } from '../data/passages';
import './PassageWriter.css';

const WORD_REGEX = /[A-Za-zÄÖÜäöüß]+/g;

interface PassageWriterProps {
  passage: Passage;
  strict: boolean;
  showWordGloss: boolean;
  sidebarOpen: boolean;
}

export function PassageWriter({ passage, strict, showWordGloss, sidebarOpen }: PassageWriterProps) {
  const [typed, setTyped] = useState('');
  const [finished, setFinished] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const isComposingRef = useRef(false);
  const skipNextInputRef = useRef(false);

  const targetText = passage.de;

  const reset = useCallback(() => {
    setTyped('');
    setFinished(false);
    inputRef.current?.focus();
  }, []);

  // Reset when passage object reference changes (including restart button which spreads passage)
  // biome-ignore lint/correctness/useExhaustiveDependencies: passage reference changes trigger reset for restart functionality
  useEffect(() => {
    reset();
  }, [passage, reset]);

  // Focus management: mount, window focus, and sidebar close
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!sidebarOpen) {
      inputRef.current?.focus();
    }
  }, [sidebarOpen]);

  useEffect(() => {
    const handleWindowFocus = () => {
      if (!sidebarOpen && !finished) {
        inputRef.current?.focus();
      }
    };
    window.addEventListener('focus', handleWindowFocus);
    return () => window.removeEventListener('focus', handleWindowFocus);
  }, [sidebarOpen, finished]);

  // Focus when clicking on text area
  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      if (target.closest('.sidebar, .sidebar-toggle, button, select, input, label')) return;
      inputRef.current?.focus();
    };
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, []);

  // Set finished when typing is complete
  useEffect(() => {
    if (typed.length > 0 && typed.length === targetText.length) {
      setFinished(true);
    }
  }, [typed, targetText]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (finished) return;
    if (isComposingRef.current) return;

    if (e.ctrlKey || e.altKey || e.metaKey) return;

    if (e.key === 'Backspace') {
      setTyped((prev) => prev.slice(0, -1));
      e.preventDefault();
      return;
    }
  };

  const handleCompositionStart = () => {
    isComposingRef.current = true;
    skipNextInputRef.current = false;
  };

  const handleCompositionEnd = (e: React.CompositionEvent<HTMLInputElement>) => {
    isComposingRef.current = false;
    const data = e.data;
    if (data && !finished) {
      processInput(data);
    }
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    skipNextInputRef.current = true;
  };

  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    if (finished) return;
    if (isComposingRef.current) return;
    if (skipNextInputRef.current) {
      skipNextInputRef.current = false;
      return;
    }

    const input = e.currentTarget;
    const value = input.value;

    if (value) {
      processInput(value);
      input.value = '';
    }
  };

  const processInput = useCallback(
    (data: string) => {
      if (finished) return;

      setTyped((prev) => {
        let newTyped = prev;

        for (const char of data) {
          const currentIndex = newTyped.length;
          if (currentIndex >= targetText.length) {
            break;
          }

          const expectedChar = targetText[currentIndex];

          if (char === expectedChar) {
            newTyped = newTyped + char;
          } else if (!strict) {
            newTyped = newTyped + char;
          }
          // In strict mode with wrong char, do nothing (char is rejected)
        }

        return newTyped;
      });
    },
    [finished, targetText, strict],
  );

  const textContent = useMemo(() => {
    const tokens: Array<
      | {
          type: 'word';
          text: string;
          startIndex: number;
          wordIndex: number;
        }
      | {
          type: 'sep';
          text: string;
          startIndex: number;
        }
    > = [];

    // Reset regex lastIndex
    WORD_REGEX.lastIndex = 0;
    let match: RegExpExecArray | null;
    let cursor = 0;
    let wordIndex = 0;

    match = WORD_REGEX.exec(targetText);
    while (match !== null) {
      if (match.index > cursor) {
        tokens.push({
          type: 'sep',
          text: targetText.slice(cursor, match.index),
          startIndex: cursor,
        });
      }

      tokens.push({
        type: 'word',
        text: match[0],
        startIndex: match.index,
        wordIndex,
      });

      cursor = match.index + match[0].length;
      wordIndex += 1;
      match = WORD_REGEX.exec(targetText);
    }

    if (cursor < targetText.length) {
      tokens.push({
        type: 'sep',
        text: targetText.slice(cursor),
        startIndex: cursor,
      });
    }

    return tokens.map((token) => {
      const renderChars = (text: string, startIndex: number) => {
        return text.split('').map((char, offset) => {
          const index = startIndex + offset;
          let className = 'char pending';

          if (index < typed.length) {
            if (typed[index] === char) {
              className = 'char correct';
            } else {
              className = 'char incorrect';
            }
          } else if (index === typed.length) {
            className = 'char current';
          }

          return (
            <span key={index} className={className}>
              {char}
              {index === typed.length ? <span className="cursor" /> : null}
            </span>
          );
        });
      };

      if (token.type === 'sep') {
        return (
          <span key={`sep-${token.startIndex}`} className="word-separator">
            {renderChars(token.text, token.startIndex)}
          </span>
        );
      }

      const gloss = passage.gloss[token.wordIndex] ?? '';

      return (
        <span key={`word-${token.startIndex}`} className="word-token">
          <span className="word-text">{renderChars(token.text, token.startIndex)}</span>
          {showWordGloss ? <span className="word-gloss">{gloss}</span> : null}
        </span>
      );
    });
  }, [targetText, typed, showWordGloss, passage.gloss]);

  return (
    <>
      {finished ? (
        <div className="finished-banner">Finished! Press Restart to try again.</div>
      ) : null}

      <main className="main">
        <div className="column german-column">
          <h2>Deutsch</h2>
          <div className="text-display">{textContent}</div>
        </div>
        <div className="column english-column">
          <h2>English</h2>
          <div className="text-display translation">{passage.en}</div>
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
    </>
  );
}
