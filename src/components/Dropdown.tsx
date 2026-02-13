import { faCheck, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { type ReactNode, useEffect, useMemo, useRef, useState } from 'react';

export interface DropdownOption {
  id: string;
  label: string;
  icon?: ReactNode;
}

export interface DropdownGroup {
  label: string;
  options: DropdownOption[];
}

interface DropdownProps {
  value: string;
  onChange: (value: string) => void;
  options?: DropdownOption[];
  groups?: DropdownGroup[];
  placeholder?: string;
  className?: string;
}

export function Dropdown({
  value,
  onChange,
  options,
  groups,
  placeholder = 'Select...',
  className = '',
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Flatten all options for lookup
  const allOptions = useMemo(
    () => (groups ? groups.flatMap((g) => g.options) : (options ?? [])),
    [groups, options],
  );

  const currentOption = useMemo(() => allOptions.find((o) => o.id === value), [allOptions, value]);

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

  const handleSelect = (option: DropdownOption) => {
    onChange(option.id);
    setIsOpen(false);
  };

  const renderOption = (option: DropdownOption) => (
    <button
      key={option.id}
      className={`dropdown-item ${option.id === value ? 'selected' : ''}`}
      onClick={() => handleSelect(option)}
      role="option"
      aria-selected={option.id === value}
      type="button"
    >
      {option.icon ? <span className="dropdown-item-icon">{option.icon}</span> : null}
      <span className="dropdown-item-label">{option.label}</span>
      {option.id === value ? <FontAwesomeIcon icon={faCheck} className="dropdown-check" /> : null}
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
          {currentOption?.icon ? (
            <span className="dropdown-value-icon">{currentOption.icon}</span>
          ) : null}
          {currentOption?.label ?? placeholder}
        </span>
        <FontAwesomeIcon
          icon={faChevronDown}
          className={`dropdown-chevron ${isOpen ? 'open' : ''}`}
        />
      </button>

      {isOpen ? (
        <div className="dropdown-menu" role="listbox">
          {groups ? (
            groups.map((group, index) => (
              <div key={group.label}>
                {index > 0 ? <div className="dropdown-divider" /> : null}
                <div className="dropdown-group">
                  <div className="dropdown-group-label">{group.label}</div>
                  {group.options.map(renderOption)}
                </div>
              </div>
            ))
          ) : (
            <div className="dropdown-group">{allOptions.map(renderOption)}</div>
          )}
        </div>
      ) : null}
    </div>
  );
}
