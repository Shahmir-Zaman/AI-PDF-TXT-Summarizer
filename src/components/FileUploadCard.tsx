import React from 'react';
import { 
  FileText, 
  X, 
  Upload, 
  CheckCircle, 
  XCircle, 
  RotateCcw, 
  Brain,
  Loader2
} from 'lucide-react';
import { useFileUpload } from '../contexts/FileUploadContext';
import { FileUploadItem } from '../types/FileUpload';

interface FileUploadCardProps {
  file: FileUploadItem;
}

export const FileUploadCard: React.FC<FileUploadCardProps> = ({ file }) => {
  const { removeFile, retryUpload, uploadSingleFile } = useFileUpload();

  const getStatusIcon = () => {
    switch (file.status) {
      case 'pending':
        return <Upload className="w-5 h-5 text-gray-500" />;
      case 'uploading':
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'uploaded':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'processing':
        return <Brain className="w-5 h-5 text-purple-500 animate-pulse" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = () => {
    switch (file.status) {
      case 'pending':
        return 'Ready to upload';
      case 'uploading':
        return 'Uploading...';
      case 'uploaded':
        return 'File uploaded';
      case 'processing':
        return 'Waiting for AI to summarize';
      case 'completed':
        return 'Summary ready';
      case 'error':
        return file.error || 'Upload failed';
      default:
        return 'Unknown status';
    }
  };

  const getProgressPercentage = () => {
    switch (file.status) {
      case 'pending':
        return 0;
      case 'uploading':
        return 25;
      case 'uploaded':
        return 50;
      case 'processing':
        return 75;
      case 'completed':
        return 100;
      case 'error':
        return 0;
      default:
        return 0;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-white dark:bg-slate-800 bg-opacity-95 dark:bg-opacity-95 backdrop-blur-sm rounded-2xl shadow-lg border border-purple-200 dark:border-violet-600 p-4 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 animate-slide-up">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-800 dark:to-pink-800 rounded-xl">
            <FileText className="w-7 h-7 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h4 className="font-bold text-gray-800 dark:text-gray-200 truncate max-w-[190px]">
              {file.file.name}
            </h4>
            <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">
              📄 {formatFileSize(file.file.size)}
            </p>
          </div>
        </div>
        <button
          onClick={() => removeFile(file.id)}
          className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors p-1 hover:bg-red-50 dark:hover:bg-red-900 rounded-full"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-purple-600 dark:text-purple-400 font-semibold">✨ Progress</span>
          <span className="text-sm font-bold text-gray-800 dark:text-gray-200 bg-purple-100 dark:bg-purple-800 px-2 py-1 rounded-full">
            {getProgressPercentage()}%
          </span>
        </div>
        <div className="w-full bg-purple-100 dark:bg-purple-800 rounded-full h-3 shadow-inner">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${
              file.status === 'error' 
                ? 'bg-gradient-to-r from-red-400 to-red-600' 
                : file.status === 'completed'
                ? 'bg-gradient-to-r from-green-400 to-green-600'
                : 'bg-gradient-to-r from-purple-400 to-pink-500'
            }`}
            style={{ width: `${getProgressPercentage()}%` }}
          />
        </div>
      </div>

      {/* Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <span className={`text-sm font-medium ${file.status === 'error' ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'}`}>
            {file.status === 'error' ? 'Upload Failed' : getStatusText()}
          </span>
        </div>
        
        {/* Individual Upload Button */}
        {file.status === 'pending' && (
          <button
            onClick={() => uploadSingleFile(file.id)}
            className="flex items-center space-x-2 px-4 py-2 text-sm text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 animate-pulse-glow"
          >
            <Upload className="w-4 h-4" />
            <span className="font-semibold">🚀 Upload</span>
          </button>
        )}
        
        {/* Retry Button */}
        {file.status === 'error' && (
          <button
            onClick={() => retryUpload(file.id)}
            className="flex items-center space-x-2 px-4 py-2 text-sm text-white bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="font-semibold">🔄 Retry</span>
          </button>
        )}
      </div>

      {/* Error Message Display */}
      {file.status === 'error' && file.error && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-xl animate-slide-up">
          <div className="flex items-start space-x-2">
            <XCircle className="w-5 h-5 text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800 dark:text-red-300 leading-relaxed">
                {file.error}
              </p>
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                Click retry to try uploading again, or remove this file and try a different one.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};