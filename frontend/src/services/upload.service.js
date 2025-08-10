import api from './api';

class UploadService {
  async uploadCV(file, onProgress) {
    try {
      const formData = new FormData();
      formData.append('cv', file);

      const response = await api.post('/cv/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(percentCompleted);
          }
        },
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async uploadMultipleCVs(files, onProgress) {
    try {
      const formData = new FormData();
      files.forEach((file, index) => {
        formData.append('cvs', file);
      });

      const response = await api.post('/cv/upload-multiple', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(percentCompleted);
          }
        },
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getUploadStatus(uploadId) {
    try {
      const response = await api.get(`/cv/upload-status/${uploadId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async cancelUpload(uploadId) {
    try {
      const response = await api.delete(`/cv/upload/${uploadId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getUploadHistory(limit = 10, offset = 0) {
    try {
      const response = await api.get('/cv/upload-history', {
        params: { limit, offset }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async deleteUpload(uploadId) {
    try {
      const response = await api.delete(`/cv/upload/${uploadId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async retryUpload(uploadId) {
    try {
      const response = await api.post(`/cv/upload/${uploadId}/retry`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  validateFile(file) {
    const errors = [];
    
    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      errors.push('File size must be less than 10MB');
    }

    // Check file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'text/rtf'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      errors.push('File type not supported. Please upload PDF, DOC, DOCX, TXT, or RTF files.');
    }

    // Check filename length
    if (file.name.length > 255) {
      errors.push('Filename is too long. Please use a shorter name.');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  validateMultipleFiles(files) {
    const errors = [];
    const validFiles = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const validation = this.validateFile(file);
      
      if (!validation.isValid) {
        errors.push(`File ${i + 1} (${file.name}): ${validation.errors.join(', ')}`);
      } else {
        validFiles.push(file);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      validFiles
    };
  }

  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  getFileIcon(fileType) {
    const iconMap = {
      'application/pdf': '📄',
      'application/msword': '📝',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '📝',
      'text/plain': '📄',
      'text/rtf': '📝'
    };
    
    return iconMap[fileType] || '📄';
  }
}

export default new UploadService();
