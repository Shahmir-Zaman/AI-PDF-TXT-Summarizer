import React from 'react';
import { Heart, Github, Linkedin, Mail, Globe, Sparkles, Brain } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-slate-800 bg-opacity-95 dark:bg-opacity-95 backdrop-blur-md border-t border-purple-200 dark:border-violet-700 mt-12">
      <div className="container mx-auto px-4 py-6">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          
          {/* Brand Section */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <div className="relative">
                <Brain className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                <Sparkles className="w-3 h-3 text-pink-500 dark:text-pink-400 absolute -top-1 -right-1" />
              </div>
              <h3 className="text-lg font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 dark:from-purple-400 dark:via-pink-400 dark:to-red-400 bg-clip-text text-transparent">
                AI Summarizer
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              Transform your documents into brilliant summaries with the power of AI.
            </p>
            <div className="flex items-center space-x-2 text-xs text-purple-600 dark:text-purple-400 mt-2">
              <Sparkles className="w-3 h-3" />
              <span className="font-medium">Powered by Advanced AI Technology</span>
            </div>
          </div>

          {/* Features & Support Combined */}
          <div>
            <h4 className="text-base font-bold text-gray-800 dark:text-gray-200 mb-3">
              ✨ Features & Support
            </h4>
            <ul className="space-y-1 text-gray-600 dark:text-gray-300 text-sm">
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                <span>PDF & TXT Processing</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 bg-pink-500 rounded-full"></span>
                <span>Batch Upload (3 files max)</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                <span>File Size: Up to 5MB</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                <span>Instant AI Results</span>
              </li>
            </ul>
          </div>

          {/* Creator & Social Links */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-gray-600 dark:text-gray-300 text-sm">Made with</span>
              <Heart className="w-4 h-4 text-red-500 animate-pulse" />
              <span className="text-gray-600 dark:text-gray-300 text-sm">by</span>
              <span className="font-bold text-purple-600 dark:text-purple-400">
                Shahmir Zaman
              </span>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-2">
              <a
                href="https://www.linkedin.com/in/shahmir-zaman-b90a61217"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 text-sm"
              >
                <Linkedin className="w-4 h-4" />
                <span className="font-medium">LinkedIn</span>
              </a>
              
              <a
                href="https://github.com/Shahmir-Zaman"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 px-3 py-1.5 bg-gray-800 hover:bg-gray-900 text-white rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 text-sm"
              >
                <Github className="w-4 h-4" />
                <span className="font-medium">GitHub</span>
              </a>

              <a
                href="mailto:zshahmir5@gmail.com"
                className="flex items-center space-x-1 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 text-sm"
              >
                <Mail className="w-4 h-4" />
                <span className="font-medium">Contact</span>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-4 border-t border-purple-100 dark:border-violet-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-3">
              <span>© {currentYear} AI Summarizer. All rights reserved.</span>
              <span className="hidden md:inline">•</span>
              <span className="flex items-center space-x-1">
                <Globe className="w-3 h-3" />
                <span>Built with React & TypeScript</span>
              </span>
            </div>
            
            <div className="flex items-center space-x-1">
              <Sparkles className="w-3 h-3" />
              <span>v1.0.0</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};