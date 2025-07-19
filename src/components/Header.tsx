import React from 'react';
import { Brain, Sparkles, Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export const Header: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  const handleToggle = () => {
    console.log('Dark mode toggle clicked. Current state:', isDarkMode);
    toggleDarkMode();
    console.log('After toggle, isDarkMode should be:', !isDarkMode);
  };

  return (
    <header className="bg-white bg-opacity-95 dark:bg-slate-800 dark:bg-opacity-95 backdrop-blur-md shadow-xl border-b border-purple-200 dark:border-violet-700">
      <div className="container mx-auto px-4 py-7">
        <div className="flex items-center justify-between">
          {/* Left spacer for centering */}
          <div className="w-12"></div>
          
          {/* Center content */}
          <div className="flex items-center justify-center space-x-4 animate-bounce-in">
            <div className="relative animate-pulse-glow rounded-full p-2">
              <Brain className="w-9 h-9 text-purple-600 dark:text-purple-400" />
              <Sparkles className="w-5 h-5 text-pink-500 dark:text-pink-400 absolute -top-1 -right-1 animate-spin" />
            </div>
            <div className="text-center">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 dark:from-purple-400 dark:via-pink-400 dark:to-red-400 bg-clip-text text-transparent">
                ✨ AI Summarizer ✨
              </h1>
              <p className="text-gray-700 dark:text-gray-300 mt-2 text-base font-medium">
                Transform your documents into brilliant summaries with AI magic! 🚀
              </p>
            </div>
          </div>

          {/* Dark mode toggle */}
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
              {isDarkMode ? 'Dark' : 'Light'}
            </span>
            <button
              onClick={handleToggle}
              className="p-3 rounded-full bg-purple-100 dark:bg-violet-800 hover:bg-purple-200 dark:hover:bg-violet-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <Sun className="w-6 h-6 text-yellow-400" />
              ) : (
                <Moon className="w-6 h-6 text-purple-600" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};