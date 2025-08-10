import { useState, useCallback } from 'react';
import useApi from './useApi';
import { ErrorCodes, getErrorMessage } from '../../shared/constants/errors';

const useUpload = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('idle'); // idle, uploading, success, error
  const { upload: apiUpload, loading, error, clearError } = useApi();

  const uploadFile = useCallback(async (file, options = {}) => {
    if (!file) {
      throw new Error('No file provided');
    }

    // Validate file size (default 10MB)
    const maxSize = options.maxSize || 10 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new Error(getErrorMessage(ErrorCodes.CV_TOO_LARGE));
    }

    // Validate file type
    const allowedTypes = options.allowedTypes || ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error(getErrorMessage(ErrorCodes.CV_INVALID_FORMAT));
    }

    try {
      setUploadStatus('uploading');
      setUploadProgress(0);
      clearError();

      // Simulate upload progress (in real implementation, you'd use XMLHttpRequest or fetch with progress)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 10;
        });
      }, 200);

      const response = await apiUpload('/api/upload', file, {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(progress);
          }
        },
        ...options
      });

      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadStatus('success');

      return response;

    } catch (err) {
      setUploadStatus('error');
      setUploadProgress(0);
      throw err;
    }
  }, [apiUpload, clearError]);

  const uploadMultipleFiles = useCallback(async (files, options = {}) => {
    if (!Array.isArray(files) || files.length === 0) {
      throw new Error('No files provided');
    }

    const results = [];
    const errors = [];

    for (let i = 0; i < files.length; i++) {
      try {
        const result = await uploadFile(files[i], options);
        results.push(result);
      } catch (error) {
        errors.push({
          file: files[i].name,
          error: error.message
        });
      }
    }

    return { results, errors };
  }, [uploadFile]);

  const resetUpload = useCallback(() => {
    setUploadProgress(0);
    setUploadStatus('idle');
    clearError();
  }, [clearError]);

  const cancelUpload = useCallback(() => {
    // In a real implementation, you'd cancel the actual upload request
    setUploadStatus('idle');
    setUploadProgress(0);
  }, []);

  return {
    uploadFile,
    uploadMultipleFiles,
    uploadProgress,
    uploadStatus,
    loading,
    error,
    resetUpload,
    cancelUpload,
    clearError
  };
};

export default useUpload;
