import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { FileText, Briefcase, Target, TrendingUp } from 'lucide-react'
import CVUploader from '../components/cv/CVUploader'
import { uploadCV } from '../services/cv.service'
import { COMMON_JOB_TITLES } from '../utils/constants'

function UploadPage() {
  const [isUploading, setIsUploading] = useState(false)
  const [jobTitle, setJobTitle] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const navigate = useNavigate()

  const handleFileSelect = (file) => {
    setSelectedFile(file)
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a CV file first')
      return
    }

    setIsUploading(true)
    try {
      const result = await uploadCV(selectedFile, jobTitle)
      toast.success('CV uploaded and analysis started!')
      navigate(`/results/${result.id}`)
    } catch (error) {
      console.error('Upload error:', error)
      // Error toast is already shown by the service
    } finally {
      setIsUploading(false)
    }
  }

  const features = [
    {
      icon: TrendingUp,
      title: 'ATS Score Analysis',
      description: 'Get your applicant tracking system compatibility score'
    },
    {
      icon: Target,
      title: 'Keyword Optimization',
      description: 'Identify missing keywords for your target role'
    },
    {
      icon: FileText,
      title: 'Format Review',
      description: 'Ensure your CV format is recruiter-friendly'
    },
    {
      icon: Briefcase,
      title: 'Industry Insights',
      description: 'Get tailored advice for your specific industry'
    }
  ]

  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Upload Your CV for
            <span className="text-blue-600"> AI Analysis</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get instant feedback on your resume's ATS compatibility, keyword optimization, 
            and overall effectiveness in landing interviews.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Upload Section */}
          <div className="space-y-8">
            <div className="card">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Upload Your CV
              </h2>

              {/* Job Title Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Job Title (Optional)
                </label>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g., Software Engineer, Marketing Manager"
                    className="input-field"
                    list="job-titles"
                  />
                  <datalist id="job-titles">
                    {COMMON_JOB_TITLES.map((title, index) => (
                      <option key={index} value={title} />
                    ))}
                  </datalist>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Helps us provide more targeted analysis and keyword suggestions
                </p>
              </div>

              {/* File Upload Component */}
              <CVUploader 
                onFileSelect={handleFileSelect}
                isUploading={isUploading}
                selectedFile={selectedFile}
              />

              {/* Upload Button */}
              {selectedFile && (
                <div className="mt-6">
                  <button
                    onClick={handleUpload}
                    disabled={isUploading}
                    className="w-full btn-primary py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUploading ? (
                      <div className="flex items-center justify-center">
                        <div className="spinner w-5 h-5 mr-2"></div>
                        Analyzing CV...
                      </div>
                    ) : (
                      <>
                        <FileText size={20} />
                        Analyze My CV
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Upload Guidelines */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-800 mb-2">
                  📋 Upload Guidelines
                </h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Supported formats: PDF, DOC, DOCX</li>
                  <li>• Maximum file size: 10MB</li>
                  <li>• Ensure your CV is clearly readable</li>
                  <li>• Include contact information and work experience</li>
                  <li>• Analysis typically takes 15-30 seconds</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                What You'll Get
              </h2>
              
              <div className="space-y-4">
                {features.map((feature, index) => {
                  const Icon = feature.icon
                  return (
                    <div 
                      key={index}
                      className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="text-blue-600" size={24} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-1">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Sample Report Preview */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Sample Analysis Report
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Overall ATS Score</span>
                  <span className="text-2xl font-bold text-green-600">87%</span>
                </div>
                <div className="score-bar">
                  <div className="score-progress score-excellent" style={{ width: '87%' }}></div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-lg font-semibold text-blue-600">92%</div>
                    <div className="text-xs text-blue-800">Keyword Match</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-lg font-semibold text-green-600">85%</div>
                    <div className="text-xs text-green-800">Format Score</div>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-sm text-yellow-800">
                    <strong>💡 Top Recommendation:</strong> Add 5 missing keywords to improve your score by 12%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UploadPage