import React from 'react';
import { Brain, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white bg-opacity-95 backdrop-blur-md shadow-xl border-b border-purple-200">
      <div className="container mx-auto px-4 py-7">
        <div className="flex items-center justify-center space-x-4 animate-bounce-in">
          <div className="relative animate-pulse-glow rounded-full p-2">
            <Brain className="w-9 h-9 text-purple-600" />
            <Sparkles className="w-5 h-5 text-pink-500 absolute -top-1 -right-1 animate-spin" />
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
              ✨ AI Summarizer ✨
            </h1>
            <p className="text-gray-700 mt-2 text-base font-medium">
              Transform your documents into brilliant summaries with AI magic! 🚀
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};