import { type ThemeName, useTheme } from '../contexts/ThemeContext';
import { Dropdown } from './Dropdown';

function ThemeColorDot({ themeId }: { themeId: string }) {
  return <span className="theme-color-dot" data-theme-preview={themeId} />;
}

export function ThemeSelector() {
  const { theme, setTheme, themes } = useTheme();

  const darkThemes = themes.filter((t) => t.category === 'dark');
  const lightThemes = themes.filter((t) => t.category === 'light');

  const groups = [
    {
      label: 'Dark Themes',
      options: darkThemes.map((t) => ({
        id: t.id,
        label: t.name,
        icon: <ThemeColorDot themeId={t.id} />,
      })),
    },
    {
      label: 'Light Themes',
      options: lightThemes.map((t) => ({
        id: t.id,
        label: t.name,
        icon: <ThemeColorDot themeId={t.id} />,
      })),
    },
  ];

  return (
    <Dropdown
      value={theme}
      onChange={(value) => setTheme(value as ThemeName)}
      groups={groups}
      className="theme-dropdown"
    />
  );
}
