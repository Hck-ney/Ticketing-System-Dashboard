import React, { createContext, useContext, useState, useEffect } from 'react';

// 1. Define the shape of your context value
interface ThemeContextType {
  darkToggle: boolean;
  toggleTheme: () => void;
}

// 2. Create the context with the type and an initial value (undefined)
// This tells TypeScript: "This context will hold ThemeContextType, but might be undefined initially"
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [darkToggle, setDarkThemeToggle] = useState(false);

  useEffect(() => {
    if (darkToggle) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkToggle]);

  const toggleTheme = () => setDarkThemeToggle(prev => !prev);

  return (
    <ThemeContext.Provider value={{ darkToggle, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// 3. The custom hook
export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  // This check satisfies TypeScript that 'context' is not undefined here
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};