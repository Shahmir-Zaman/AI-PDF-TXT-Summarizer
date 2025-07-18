import React from 'react';
import { FileUploadProvider } from './contexts/FileUploadContext';
import { FileUploadInterface } from './components/FileUploadInterface';
import { Header } from './components/Header';
import { Results } from './components/Results';

function App() {
  return (
    <FileUploadProvider>
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 animate-gradient-x">
        <div className="min-h-screen bg-black bg-opacity-10 backdrop-blur-sm">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto">
              <FileUploadInterface />
              <Results />
            </div>
          </main>
        </div>
      </div>
    </FileUploadProvider>
  );
}

export default App;