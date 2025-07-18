import React, { useState } from 'react';
import { FileText, Download, Copy, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { useFileUpload } from '../contexts/FileUploadContext';

export const Results: React.FC = () => {
  const { files } = useFileUpload();
  const [expandedSummaries, setExpandedSummaries] = useState<Set<string>>(new Set());
  
  const completedFiles = files.filter(file => file.status === 'completed' && file.summary);

  const toggleSummary = (fileId: string) => {
    const newExpanded = new Set(expandedSummaries);
    if (newExpanded.has(fileId)) {
      newExpanded.delete(fileId);
    } else {
      newExpanded.add(fileId);
    }
    setExpandedSummaries(newExpanded);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const downloadSummary = (filename: string, content: string) => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${filename}_summary.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (completedFiles.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 space-y-8 animate-slide-up">
      <div className="text-center animate-bounce-in">
        <div className="inline-flex items-center space-x-3 mb-4">
          <Sparkles className="w-8 h-8 text-white animate-spin" />
          <h2 className="text-4xl font-bold text-white drop-shadow-lg">
            🎉 AI Summaries Ready! 🎉
          </h2>
          <Sparkles className="w-8 h-8 text-white animate-spin" />
        </div>
        <p className="text-white text-lg font-medium drop-shadow-md">
          Your documents have been magically transformed into brilliant summaries! ✨
        </p>
      </div>

      <div className="space-y-8">
        {completedFiles.map((file, index) => {
          const isExpanded = expandedSummaries.has(file.id);
          return (
            <div 
              key={file.id} 
              className="bg-white bg-opacity-95 backdrop-blur-sm rounded-3xl shadow-2xl border border-purple-200 overflow-hidden transform hover:scale-105 transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl">
                      <FileText className="w-8 h-8 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">
                        📄 {file.file.name}
                      </h3>
                      <p className="text-purple-600 font-semibold flex items-center space-x-1">
                        <Sparkles className="w-4 h-4" />
                        <span>Summary generated successfully!</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => file.summary && copyToClipboard(file.summary)}
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-purple-600 hover:text-purple-800 border-2 border-purple-300 rounded-xl hover:bg-purple-50 transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                      <Copy className="w-4 h-4" />
                      <span className="font-semibold">📋 Copy</span>
                    </button>
                    <button
                      onClick={() => file.summary && downloadSummary(file.file.name, file.summary)}
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      <Download className="w-4 h-4" />
                      <span className="font-semibold">💾 Download</span>
                    </button>
                  </div>
                </div>
                
                {/* Collapsible Summary Toggle */}
                <button
                  onClick={() => toggleSummary(file.id)}
                  className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl hover:from-purple-200 hover:to-pink-200 transition-all duration-300 mb-4 shadow-md hover:shadow-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white rounded-xl shadow-sm">
                      <Sparkles className="w-5 h-5 text-purple-600" />
                    </div>
                    <span className="text-lg font-bold text-purple-800">
                      {isExpanded ? '🔽 Hide Summary' : '🔍 View Summary'}
                    </span>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-6 h-6 text-purple-600 transform transition-transform duration-300" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-purple-600 transform transition-transform duration-300" />
                  )}
                </button>

                {/* Collapsible Summary Content */}
                {isExpanded && (
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 shadow-inner animate-slide-up">
                    <div className="prose prose-lg max-w-none">
                      {file.summary?.split('\n').map((paragraph, index) => (
                        <p key={index} className="mb-4 text-gray-800 leading-relaxed font-medium">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};