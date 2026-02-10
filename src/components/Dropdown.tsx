import { useState, useRef, useEffect, type ReactNode } from 'react';

export interface DropdownOption<T extends string = string> {
  id: T;
  label: string;
  icon?: ReactNode;
}

export interface DropdownGroup<T extends string = string> {
  label: string;
  options: DropdownOption<T>[];
}

interface DropdownProps<T extends string = string> {
  value: T;
  onChange: (value: T) => void;
  options?: DropdownOption<T>[];
  groups?: DropdownGroup<T>[];
  placeholder?: string;
  className?: string;
}

export function Dropdown<T extends string = string>({
  value,
  onChange,
  options,
  groups,
  placeholder = 'Select...',
  className = '',
}: DropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Flatten all options for lookup
  const allOptions = groups
    ? groups.flatMap((g) => g.options)
    : options ?? [];

  const currentOption = allOptions.find((o) => o.id === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleSelect = (option: DropdownOption<T>) => {
    onChange(option.id);
    setIsOpen(false);
  };

  const renderOption = (option: DropdownOption<T>) => (
    <button
      key={option.id}
      className={`dropdown-item ${option.id === value ? 'selected' : ''}`}
      onClick={() => handleSelect(option)}
      role="option"
      aria-selected={option.id === value}
      type="button"
    >
      {option.icon && <span className="dropdown-item-icon">{option.icon}</span>}
      <span className="dropdown-item-label">{option.label}</span>
      {option.id === value && (
        <svg
          className="dropdown-check"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path d="M5 12l5 5L20 7" />
        </svg>
      )}
    </button>
  );

  return (
    <div className={`dropdown ${className}`} ref={containerRef}>
      <button
        className="dropdown-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        type="button"
      >
        <span className="dropdown-value">
          {currentOption?.icon && (
            <span className="dropdown-value-icon">{currentOption.icon}</span>
          )}
          {currentOption?.label ?? placeholder}
        </span>
        <svg
          className={`dropdown-chevron ${isOpen ? 'open' : ''}`}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {isOpen && (
        <div className="dropdown-menu" role="listbox">
          {groups ? (
            groups.map((group, index) => (
              <div key={group.label}>
                {index > 0 && <div className="dropdown-divider" />}
                <div className="dropdown-group">
                  <div className="dropdown-group-label">{group.label}</div>
                  {group.options.map(renderOption)}
                </div>
              </div>
            ))
          ) : (
            <div className="dropdown-group">
              {allOptions.map(renderOption)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
