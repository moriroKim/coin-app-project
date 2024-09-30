import { createContext, useContext } from 'react';

interface ThemeContextProps {
  isDark: boolean;
  toggleDark: () => void;
}

export const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme 훅은 ThemeProvider와 함께 사용되어야합니다!');
  }

  return context;
};
