import React from 'react';
import { FileUploadProvider } from './contexts/FileUploadContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { FileUploadInterface } from './components/FileUploadInterface';
import { Header } from './components/Header';
import { Results } from './components/Results';
import { Footer } from './components/Footer';

function App() {
  return (
    <ThemeProvider>
      <FileUploadProvider>
        <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 dark:from-slate-900 dark:via-purple-900 dark:to-violet-900 animate-gradient-x">
          <div className="min-h-screen bg-black bg-opacity-10 dark:bg-black dark:bg-opacity-20 backdrop-blur-sm flex flex-col">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-8">
              <div className="max-w-6xl mx-auto">
                <FileUploadInterface />
                <Results />
              </div>
            </main>
            <Footer />
          </div>
        </div>
      </FileUploadProvider>
    </ThemeProvider>
  );
}

export default App;