import { Dropdown } from './Dropdown';
import type { Passage } from '../data/passages';

interface PassageSelectorProps {
  passages: Passage[];
  activePassage: Passage;
  onSelect: (passage: Passage) => void;
}

export function PassageSelector({ passages, activePassage, onSelect }: PassageSelectorProps) {
  const options = passages.map((p) => ({
    id: p.id,
    label: p.title,
  }));

  const handleChange = (id: string) => {
    const passage = passages.find((p) => p.id === id);
    if (passage) {
      onSelect(passage);
    }
  };

  return (
    <Dropdown
      value={activePassage.id}
      onChange={handleChange}
      options={options}
      className="passage-dropdown"
      placeholder="Select passage..."
    />
  );
}
