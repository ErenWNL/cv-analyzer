import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, CheckCircle, X, AlertTriangle, Zap, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const CVUpload = ({ 
  onFileUpload, 
  uploadedFile, 
  onRemoveFile, 
  isAnalyzing = false,
  onAnalyze,
  className = "" 
}) => {
  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      const error = rejectedFiles[0].errors[0];
      if (error.code === 'file-too-large') {
        toast.error('File size must be less than 5MB');
      } else if (error.code === 'file-invalid-type') {
        toast.error('Please upload a PDF, DOC, DOCX, or TXT file');
      } else {
        toast.error('File upload failed');
      }
      return;
    }

    const file = acceptedFiles[0];
    if (file) {
      onFileUpload(file);
      toast.success('File uploaded successfully!');
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    multiple: false,
    maxSize: 5 * 1024 * 1024 // 5MB
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
        isDragActive
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
          : uploadedFile
          ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
          : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-slate-700'
      } ${className}`}
    >
      <input {...getInputProps()} />
      
      {uploadedFile ? (
        <div className="space-y-4">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              File uploaded successfully!
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {uploadedFile.name} ({(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          </div>
          <div className="flex justify-center space-x-4">
            {onAnalyze && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAnalyze();
                }}
                disabled={isAnalyzing}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 btn-hover-lift"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="animate-spin -ml-1 mr-3 h-5 w-5" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-5 w-5" />
                    Analyze CV
                  </>
                )}
              </button>
            )}
            {onRemoveFile && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveFile();
                }}
                className="inline-flex items-center px-4 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <X className="mr-2 h-5 w-5" />
                Remove
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <Upload className="h-16 w-16 text-gray-400 mx-auto" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {isDragActive ? 'Drop your CV here' : 'Upload your CV'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {isDragActive
                ? 'Release to upload your file'
                : 'Drag and drop your CV file here, or click to browse'
              }
            </p>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Supported formats: PDF, DOC, DOCX, TXT (Max 5MB)
          </div>
        </div>
      )}
    </div>
  );
};

export default CVUpload;
