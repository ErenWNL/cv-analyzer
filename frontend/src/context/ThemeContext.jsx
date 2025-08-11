import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [systemPreference, setSystemPreference] = useState('light');

  // Initialize theme on component mount
  useEffect(() => {
    initializeTheme();
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      setSystemPreference(e.matches ? 'dark' : 'light');
      
      // If user hasn't set a preference, follow system
      const savedTheme = localStorage.getItem('theme');
      if (!savedTheme || savedTheme === 'system') {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    setSystemPreference(mediaQuery.matches ? 'dark' : 'light');

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const initializeTheme = () => {
    try {
      // Check for saved theme preference
      const savedTheme = localStorage.getItem('theme');
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      let initialTheme = 'light';
      
      if (savedTheme) {
        if (savedTheme === 'system') {
          initialTheme = systemDark ? 'dark' : 'light';
        } else {
          initialTheme = savedTheme;
        }
      } else {
        // No saved preference, use system preference
        initialTheme = systemDark ? 'dark' : 'light';
        localStorage.setItem('theme', 'system');
      }

      setTheme(initialTheme);
      applyTheme(initialTheme);
    } catch (error) {
      console.error('Error initializing theme:', error);
      // Fallback to light theme
      setTheme('light');
      applyTheme('light');
    }
  };

  const applyTheme = (newTheme) => {
    const root = document.documentElement;
    
    // Remove existing theme classes
    root.classList.remove('light', 'dark');
    
    // Add new theme class
    root.classList.add(newTheme);
    
    // Set data attribute for CSS custom properties
    root.setAttribute('data-theme', newTheme);
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        'content', 
        newTheme === 'dark' ? '#1e293b' : '#ffffff'
      );
    }
  };

  const setThemePreference = (newTheme) => {
    try {
      setTheme(newTheme);
      applyTheme(newTheme);
      localStorage.setItem('theme', newTheme);
    } catch (error) {
      console.error('Error setting theme preference:', error);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setThemePreference(newTheme);
  };

  const setSystemTheme = () => {
    const systemTheme = systemPreference;
    setTheme(systemTheme);
    applyTheme(systemTheme);
    localStorage.setItem('theme', 'system');
  };

  // Get current theme preference setting
  const getThemePreference = () => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'system';
  };

  // Check if current theme is dark
  const isDark = theme === 'dark';

  // Check if current theme is light
  const isLight = theme === 'light';

  // Check if following system preference
  const isSystem = getThemePreference() === 'system';

  const value = {
    // Current theme state
    theme,
    isDark,
    isLight,
    isSystem,
    systemPreference,
    
    // Theme control methods
    toggleTheme,
    setThemePreference,
    setSystemTheme,
    getThemePreference,
    
    // Theme options for UI
    themeOptions: [
      { value: 'light', label: 'Light', icon: '☀️' },
      { value: 'dark', label: 'Dark', icon: '🌙' },
      { value: 'system', label: 'System', icon: '💻' }
    ]
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};