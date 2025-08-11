import React from 'react';
import { Eye, Download, FileText, ExternalLink } from 'lucide-react';

const CVPreview = ({ file, analysisData }) => {
  if (!file) return null;

  const handlePreview = () => {
    // Create a URL for the file and open in new tab
    const fileURL = URL.createObjectURL(file);
    window.open(fileURL, '_blank');
  };

  const handleDownload = () => {
    // Create download link
    const fileURL = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = fileURL;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(fileURL);
  };

  const formatFileSize = (bytes) => {
    return (bytes / 1024 / 1024).toFixed(2) + ' MB';
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    switch (extension) {
      case 'pdf':
        return '📄';
      case 'doc':
      case 'docx':
        return '📝';
      case 'txt':
        return '📃';
      default:
        return '📄';
    }
  };

  return (
    <div className="card-elevated p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        CV Preview
      </h3>
      
      <div className="flex items-center space-x-4 mb-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
            <span className="text-2xl">{getFileIcon(file.name)}</span>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900 dark:text-white truncate">
            {file.name}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {formatFileSize(file.size)} • Uploaded {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* File Actions */}
      <div className="flex space-x-3">
        <button
          onClick={handlePreview}
          className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
        >
          <Eye className="mr-2 h-4 w-4" />
          Preview
        </button>
        <button
          onClick={handleDownload}
          className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
        >
          <Download className="mr-2 h-4 w-4" />
          Download
        </button>
      </div>

      {/* Analysis Summary */}
      {analysisData && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">
            Quick Summary
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600 dark:text-gray-400">Overall Score:</span>
              <span className="ml-2 font-semibold text-gray-900 dark:text-white">
                {analysisData.overallScore}/100
              </span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">ATS Score:</span>
              <span className="ml-2 font-semibold text-gray-900 dark:text-white">
                {analysisData.atsCompatibility}%
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { CVPreview };