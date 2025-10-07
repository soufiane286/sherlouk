import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

import Button from './Button';

const ThemeToggle = ({ variant = 'ghost', size = 'sm' }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <Button
      variant={variant}
      size={size}
      onClick={toggleTheme}
      iconName={isDark ? 'Sun' : 'Moon'}
      iconSize={18}
      className="transition-smooth"
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <span className="sr-only">
        {isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      </span>
    </Button>
  );
};

export default ThemeToggle;