import { Dropdown } from './Dropdown';

export type GermanLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

interface GermanLevelSelectorProps {
  value: GermanLevel;
  onChange: (level: GermanLevel) => void;
}

const germanLevels: GermanLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export function GermanLevelSelector({ value, onChange }: GermanLevelSelectorProps) {
  const options = germanLevels.map((level) => ({
    id: level,
    label: level,
  }));

  return (
    <Dropdown
      value={value}
      onChange={(id) => onChange(id as GermanLevel)}
      options={options}
      className="german-level-dropdown"
      placeholder="Select German level..."
      aria-label="German proficiency level"
    />
  );
}
