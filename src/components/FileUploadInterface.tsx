import React, { useRef } from 'react';
import { Upload, FileText, AlertCircle, Send } from 'lucide-react';
import { useFileUpload } from '../contexts/FileUploadContext';
import { FileUploadCard } from './FileUploadCard';

export const FileUploadInterface: React.FC = () => {
  const { files, addFile, error, clearError, uploadAllFiles, retryAllFiles } = useFileUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (selectedFiles: FileList) => {
    clearError();
    
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      
      if (files.length >= 3) {
        break;
      }
      
      if (!file.type.includes('pdf') && !file.type.includes('text')) {
        continue;
      }
      
      addFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFiles = e.dataTransfer.files;
    handleFileSelect(droppedFiles);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const canAddMoreFiles = files.length < 3;
  const hasFilesToUpload = files.length > 0 && files.every(file => file.status === 'pending');
  const hasFailedFiles = files.some(file => file.status === 'error');
  const isUploading = files.some(file => ['uploading', 'uploaded', 'processing'].includes(file.status));

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      {canAddMoreFiles && (
        <div
          className="border-3 border-dashed border-purple-300 dark:border-violet-500 rounded-2xl p-9 text-center hover:border-pink-400 dark:hover:border-pink-400 hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 dark:hover:from-slate-800 dark:hover:to-violet-800 transition-all duration-300 cursor-pointer bg-white dark:bg-slate-800 bg-opacity-90 dark:bg-opacity-90 backdrop-blur-sm shadow-lg hover:shadow-2xl transform hover:scale-105 animate-slide-up"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={handleClick}
        >
          <Upload className="w-15 h-15 text-purple-500 dark:text-purple-400 mx-auto mb-5 animate-bounce" />
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">
            🎯 Drop your files here or click to browse
          </h3>
          <p className="text-purple-600 dark:text-purple-400 mb-5 text-base font-medium">
            Select up to 3 files (PDF or TXT) • Max {3 - files.length} more files ✨
          </p>
          <div className="flex items-center justify-center space-x-5 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-2 bg-purple-100 dark:bg-purple-800 px-3 py-2 rounded-full">
              <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="font-semibold">PDF</span>
            </div>
            <div className="flex items-center space-x-2 bg-pink-100 dark:bg-pink-800 px-3 py-2 rounded-full">
              <FileText className="w-4 h-4 text-pink-600 dark:text-pink-400" />
              <span className="font-semibold">TXT</span>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-4 flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 flex-shrink-0" />
          <p className="text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      {/* File Cards */}
      {files.length > 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {files.map((file) => (
              <FileUploadCard key={file.id} file={file} />
            ))}
          </div>

          {/* Upload All Button */}
          {hasFilesToUpload && (
            <div className="flex justify-center animate-bounce-in">
              <button
                onClick={uploadAllFiles}
                disabled={isUploading}
                className="flex items-center space-x-3 px-9 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 animate-pulse-glow"
              >
                <Send className="w-5 h-5" />
                <span className="text-base">🚀 Upload & Process All Files</span>
              </button>
            </div>
          )}

          {/* Retry All Button */}
          {hasFailedFiles && !isUploading && (
            <div className="flex justify-center animate-bounce-in">
              <button
                onClick={retryAllFiles}
                className="flex items-center space-x-3 px-9 py-3 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
              >
                <Send className="w-5 h-5" />
                <span className="text-base">🔄 Retry All Failed Files</span>
              </button>
            </div>
          )}

          {isUploading && (
            <div className="text-center animate-pulse">
              <div className="inline-flex items-center space-x-2 bg-white dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
                <div className="w-4 h-4 bg-purple-500 dark:bg-purple-400 rounded-full animate-bounce"></div>
                <div className="w-4 h-4 bg-pink-500 dark:bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-4 h-4 bg-red-500 dark:bg-red-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                <p className="text-gray-700 dark:text-gray-300 font-semibold ml-3">
                  ✨ AI is working its magic... This may take a few minutes! 🎭
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.txt"
        className="hidden"
        onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
      />
    </div>
  );
};