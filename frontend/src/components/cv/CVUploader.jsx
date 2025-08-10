import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, AlertCircle, CheckCircle, X } from 'lucide-react'
import { validateFileType, validateFileSize, formatFileSize } from '../../utils/helpers.js'
import { FILE_CONSTRAINTS } from '../../utils/constants'

function CVUploader({ onFileSelect, isUploading = false, selectedFile = null }) {
  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    // Handle rejected files
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0]
      const error = rejection.errors[0]
      
      if (error.code === 'file-too-large') {
        console.error('File too large')
        return
      }
      if (error.code === 'file-invalid-type') {
        console.error('Invalid file type')
        return
      }
      
      console.error('File rejected:', error.message)
      return
    }

    // Handle accepted files
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      
      // Additional validation
      if (!validateFileType(file)) {
        console.error('Invalid file type')
        return
      }
      
      if (!validateFileSize(file)) {
        console.error('File too large')
        return
      }
      
      onFileSelect(file)
    }
  }, [onFileSelect])

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject
  } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    multiple: false,
    maxSize: FILE_CONSTRAINTS.MAX_SIZE,
    disabled: isUploading
  })

  const removeFile = () => {
    onFileSelect(null)
  }

  const getFileIcon = (filename) => {
    const extension = filename.split('.').pop().toLowerCase()
    switch (extension) {
      case 'pdf':
        return '📄'
      case 'doc':
      case 'docx':
        return '📝'
      default:
        return '📄'
    }
  }

  // Show selected file
  if (selectedFile && !isUploading) {
    return (
      <div className="w-full">
        <div className="border-2 border-green-300 bg-green-50 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">{getFileIcon(selectedFile.name)}</span>
              </div>
              <div>
                <p className="font-medium text-green-800">{selectedFile.name}</p>
                <p className="text-sm text-green-600">
                  {formatFileSize(selectedFile.size)} • Ready for analysis
                </p>
              </div>
            </div>
            <button
              onClick={removeFile}
              className="text-green-600 hover:text-green-800 p-1"
              title="Remove file"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <button
            {...getRootProps()}
            className="btn-secondary inline-flex items-center gap-2"
          >
            <Upload size={16} />
            Choose Different File
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`
          dropzone
          ${isDragActive && !isDragReject ? 'active' : ''}
          ${isDragReject ? 'reject' : ''}
          ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center justify-center space-y-4">
          {isUploading ? (
            <>
              <div className="spinner w-12 h-12"></div>
              <div className="text-center">
                <p className="text-lg font-medium text-gray-600">
                  Processing your CV...
                </p>
                <p className="text-sm text-gray-500">
                  This usually takes 15-30 seconds
                </p>
              </div>
            </>
          ) : isDragReject ? (
            <>
              <AlertCircle size={48} className="text-red-500" />
              <div className="text-center text-red-600">
                <p className="text-lg font-medium">Invalid file type</p>
                <p className="text-sm">Please upload PDF, DOC, or DOCX files only</p>
              </div>
            </>
          ) : (
            <>
              <Upload 
                size={48} 
                className={`
                  ${isDragActive ? 'text-blue-600' : 'text-gray-400'}
                  transition-colors duration-200
                `} 
              />
              
              <div className="text-center">
                <p className="text-lg font-medium text-gray-700">
                  {isDragActive ? 'Drop your CV here' : 'Drag & drop your CV here'}
                </p>
                <p className="text-gray-500">or click to browse files</p>
              </div>
            </>
          )}

          {!isUploading && (
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <FileText size={16} />
                <span>PDF, DOC, DOCX</span>
              </div>
              <div className="flex items-center space-x-1">
                <AlertCircle size={16} />
                <span>Max {Math.round(FILE_CONSTRAINTS.MAX_SIZE / (1024 * 1024))}MB</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {!selectedFile && !isUploading && (
        <div className="mt-4 text-center">
          <button
            onClick={() => document.querySelector('input[type="file"]').click()}
            className="btn-secondary inline-flex items-center gap-2"
          >
            <Upload size={16} />
            Choose File
          </button>
        </div>
      )}
    </div>
  )
}

export default CVUploader