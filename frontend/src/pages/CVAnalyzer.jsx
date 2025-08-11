import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useApp } from '../context/AppContext';
import { 
  Upload, 
  FileText, 
  X, 
  CheckCircle, 
  AlertTriangle,
  BarChart3,
  Target,
  Lightbulb,
  Download,
  Eye,
  RefreshCw,
  Star,
  TrendingUp,
  Award,
  Clock,
  Zap
} from 'lucide-react';
import toast from 'react-hot-toast';

const CVAnalyzer = () => {
  const { setPageTitle, loading, setLoading } = useApp();
  
  const [uploadedFile, setUploadedFile] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState('upload');

  useEffect(() => {
    setPageTitle('CV Analyzer');
  }, [setPageTitle]);

  // File upload handling
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please upload a PDF, DOC, DOCX, or TXT file');
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }

      setUploadedFile(file);
      toast.success('File uploaded successfully!');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    multiple: false
  });

  const removeFile = () => {
    setUploadedFile(null);
    setAnalysisResults(null);
    setActiveTab('upload');
    toast.info('File removed');
  };

  const analyzeCV = async () => {
    if (!uploadedFile) {
      toast.error('Please upload a file first');
      return;
    }

    setIsAnalyzing(true);
    setLoading(true);

    try {
      // Simulate AI analysis with realistic delay
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Mock analysis results
      const mockResults = {
        overallScore: 87,
        atsCompatibility: 92,
        sections: {
          contact: { score: 95, status: 'excellent' },
          summary: { score: 80, status: 'good' },
          experience: { score: 90, status: 'excellent' },
          education: { score: 85, status: 'good' },
          skills: { score: 75, status: 'fair' },
          formatting: { score: 95, status: 'excellent' }
        },
        strengths: [
          'Strong professional experience with clear progression',
          'Excellent ATS-friendly formatting',
          'Comprehensive contact information',
          'Quantified achievements in work experience',
          'Relevant technical skills for target role'
        ],
        improvements: [
          'Add more specific keywords for your target industry',
          'Include metrics and numbers in your achievements',
          'Expand your professional summary with impact statements',
          'Add relevant certifications or courses',
          'Consider adding a projects section'
        ],
        keywords: {
          found: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'Project Management'],
          missing: ['TypeScript', 'Docker', 'AWS', 'Agile', 'Leadership', 'Analytics'],
          density: 2.8
        },
        readabilityScore: 88,
        lengthAnalysis: {
          pages: 2,
          wordCount: 650,
          optimal: true
        }
      };

      setAnalysisResults(mockResults);
      setActiveTab('results');
      toast.success('CV analysis completed!');
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 80) return 'bg-blue-500';
    if (score >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'excellent':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'good':
        return <CheckCircle className="h-5 w-5 text-blue-600" />;
      case 'fair':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
    }
  };

  const downloadReport = () => {
    toast.info('Report download feature coming soon!');
  };

  const tabs = [
    { id: 'upload', label: 'Upload CV', icon: Upload },
    { id: 'results', label: 'Analysis Results', icon: BarChart3, disabled: !analysisResults },
    { id: 'optimize', label: 'Optimization', icon: Target, disabled: !analysisResults }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          AI-Powered CV Analyzer
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Get instant feedback and optimization suggestions for your CV
        </p>
      </div>

      {/* Tabs */}
      <div className="card-elevated">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => !tab.disabled && setActiveTab(tab.id)}
                  disabled={tab.disabled}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : tab.disabled
                      ? 'border-transparent text-gray-400 cursor-not-allowed'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Upload Tab */}
          {activeTab === 'upload' && (
            <div className="space-y-6">
              {/* File Upload Area */}
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
                  isDragActive
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : uploadedFile
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-slate-700'
                }`}
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
                      <button
                        onClick={analyzeCV}
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
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile();
                        }}
                        className="inline-flex items-center px-4 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                      >
                        <X className="mr-2 h-5 w-5" />
                        Remove
                      </button>
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

              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Comprehensive Analysis
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Get detailed insights on formatting, content, and ATS compatibility
                  </p>
                </div>

                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Target className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    ATS Optimization
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Ensure your CV passes Applicant Tracking Systems
                  </p>
                </div>

                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Lightbulb className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Smart Suggestions
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Receive AI-powered recommendations for improvement
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Results Tab */}
          {activeTab === 'results' && analysisResults && (
            <div className="space-y-6">
              {/* Overall Score */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white mb-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold">{analysisResults.overallScore}</div>
                    <div className="text-sm opacity-90">Overall Score</div>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Analysis Complete!
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Your CV shows strong potential with room for optimization
                </p>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card-elevated p-6 text-center">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Target className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {analysisResults.atsCompatibility}%
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    ATS Compatibility
                  </p>
                </div>

                <div className="card-elevated p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Eye className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {analysisResults.readabilityScore}%
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Readability Score
                  </p>
                </div>

                <div className="card-elevated p-6 text-center">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {analysisResults.lengthAnalysis.pages}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Pages ({analysisResults.lengthAnalysis.optimal ? 'Optimal' : 'Review'})
                  </p>
                </div>
              </div>

              {/* Section Scores */}
              <div className="card-elevated p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Section Analysis
                </h3>
                <div className="space-y-4">
                  {Object.entries(analysisResults.sections).map(([section, data]) => (
                    <div key={section} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(data.status)}
                        <span className="font-medium text-gray-900 dark:text-white capitalize">
                          {section.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${getScoreBgColor(data.score)}`}
                            style={{ width: `${data.score}%` }}
                          />
                        </div>
                        <span className={`font-semibold ${getScoreColor(data.score)}`}>
                          {data.score}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Strengths and Improvements */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card-elevated p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Star className="h-5 w-5 text-green-600" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Strengths
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {analysisResults.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {strength}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="card-elevated p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Improvements
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {analysisResults.improvements.map((improvement, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {improvement}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Keywords Analysis */}
              <div className="card-elevated p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Keywords Analysis
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-green-600 mb-3">Found Keywords</h4>
                    <div className="flex flex-wrap gap-2">
                      {analysisResults.keywords.found.map((keyword, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 text-xs rounded-full"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-orange-600 mb-3">Missing Keywords</h4>
                    <div className="flex flex-wrap gap-2">
                      {analysisResults.keywords.missing.map((keyword, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-200 text-xs rounded-full"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                  Keyword density: {analysisResults.keywords.density}% (Optimal: 2-4%)
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center space-x-4">
                <button
                  onClick={downloadReport}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 btn-hover-lift"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download Report
                </button>
                <button
                  onClick={() => setActiveTab('optimize')}
                  className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <Target className="mr-2 h-5 w-5" />
                  Optimize CV
                </button>
              </div>
            </div>
          )}

          {/* Optimization Tab */}
          {activeTab === 'optimize' && analysisResults && (
            <div className="space-y-6">
              <div className="text-center">
                <Award className="h-16 w-16 text-purple-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  CV Optimization
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Detailed recommendations to improve your CV score
                </p>
              </div>

              <div className="card-elevated p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Priority Improvements
                </h3>
                <div className="space-y-4">
                  {analysisResults.improvements.map((improvement, index) => (
                    <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                              {index + 1}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-900 dark:text-white font-medium">
                            {improvement}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Implementing this change could improve your score by 3-5 points
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Need help implementing these changes?
                </p>
                <button
                  onClick={() => toast.info('AI optimization assistant coming soon!')}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 btn-hover-lift"
                >
                  <Zap className="mr-2 h-5 w-5" />
                  Get AI Assistance
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CVAnalyzer;