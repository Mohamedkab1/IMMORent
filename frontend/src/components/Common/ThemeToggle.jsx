import React from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2.5 rounded-xl border border-transparent transition-all duration-300
        bg-[var(--bg-muted)] 
        text-[var(--text-muted)] hover:text-primary dark:hover:text-secondary
        hover:border-[var(--border-color)]
        hover:shadow-sm"
      aria-label="Toggle Theme"
    >
      <div className="relative w-6 h-6 flex items-center justify-center">
        {/* Sun Icon */}
        <div 
          className={`absolute transition-all duration-500 transform ${
            theme === 'dark' ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
          }`}
        >
          <SunIcon className="w-6 h-6 text-orange-500" />
        </div>
        
        {/* Moon Icon */}
        <div 
          className={`absolute transition-all duration-500 transform ${
            theme === 'dark' ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
          }`}
        >
          <MoonIcon className="w-6 h-6 text-blue-400" />
        </div>
      </div>
    </button>
  );
};

export default ThemeToggle;
