import { useState } from 'react'
import { 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Target, 
  FileText,
  Award,
  Eye,
  Copy
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import { getScoreColor, getScoreLabel, getScoreClass, copyToClipboard } from '../../utils/helpers'

function CVResults({ analysis }) {
  const [activeTab, setActiveTab] = useState('overview')

  if (!analysis) {
    return (
      <div className="card text-center py-12">
        <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-gray-600">No analysis data available</p>
      </div>
    )
  }

  const { atsScore, analysis: analysisData } = analysis
  const { overall, breakdown, recommendations } = analysisData

  const handleCopyScore = () => {
    const text = `My CV scored ${atsScore}% on ATS compatibility! 🎉`
    copyToClipboard(text)
    toast.success('Score copied to clipboard!')
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: Eye },
    { id: 'breakdown', name: 'Detailed Analysis', icon: Target },
    { id: 'recommendations', name: 'Recommendations', icon: TrendingUp }
  ]

  return (
    <div className="space-y-8">
      {/* Score Overview */}
      <div className="card">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="text-center">
              <div className={`text-6xl font-bold text-${getScoreColor(atsScore)}-600 mb-2`}>
                {atsScore}%
              </div>
              <div className={`text-lg font-semibold text-${getScoreColor(atsScore)}-600`}>
                {getScoreLabel(atsScore)}
              </div>
              <div className="text-gray-500 text-sm mt-1">ATS Compatibility Score</div>
            </div>
            
            <div className="w-32 h-32">
              <div className="relative w-32 h-32">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-gray-200"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={`${atsScore * 2.51} ${251 - atsScore * 2.51}`}
                    className={`text-${getScoreColor(atsScore)}-500`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Award className={`text-${getScoreColor(atsScore)}-500`} size={32} />
                </div>
              </div>
            </div>
          </div>

          <p className="text-gray-600 mb-4">{overall.message}</p>
          
          <button
            onClick={handleCopyScore}
            className="btn-secondary inline-flex items-center gap-2"
          >
            <Copy size={16} />
            Share Score
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon size={16} />
                <span>{tab.name}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card text-center">
            <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-${getScoreColor(breakdown.keywordMatch.score)}-100 flex items-center justify-center`}>
              <Target className={`text-${getScoreColor(breakdown.keywordMatch.score)}-600`} size={32} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Keyword Match</h3>
            <div className={`text-3xl font-bold text-${getScoreColor(breakdown.keywordMatch.score)}-600 mb-2`}>
              {breakdown.keywordMatch.score}%
            </div>
            <p className="text-gray-600 text-sm">
              {breakdown.keywordMatch.matched} of {breakdown.keywordMatch.total} keywords found
            </p>
          </div>

          <div className="card text-center">
            <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-${getScoreColor(breakdown.formatScore.score)}-100 flex items-center justify-center`}>
              <FileText className={`text-${getScoreColor(breakdown.formatScore.score)}-600`} size={32} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Format Score</h3>
            <div className={`text-3xl font-bold text-${getScoreColor(breakdown.formatScore.score)}-600 mb-2`}>
              {breakdown.formatScore.score}%
            </div>
            <p className="text-gray-600 text-sm">
              {breakdown.formatScore.issues.length} formatting issues found
            </p>
          </div>

          <div className="card text-center">
            <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-${getScoreColor(breakdown.contentQuality.score)}-100 flex items-center justify-center`}>
              <Award className={`text-${getScoreColor(breakdown.contentQuality.score)}-600`} size={32} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Content Quality</h3>
            <div className={`text-3xl font-bold text-${getScoreColor(breakdown.contentQuality.score)}-600 mb-2`}>
              {breakdown.contentQuality.score}%
            </div>
            <p className="text-gray-600 text-sm">
              {breakdown.contentQuality.strengths.length} strengths identified
            </p>
          </div>
        </div>
      )}

      {activeTab === 'breakdown' && (
        <div className="space-y-8">
          {/* Keyword Analysis */}
          <div className="card">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <Target className="mr-2 text-blue-600" size={24} />
              Keyword Analysis
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h4 className="font-medium text-gray-800 mb-4">Missing Keywords</h4>
                <div className="flex flex-wrap gap-2">
                  {breakdown.keywordMatch.missing.map((keyword, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Adding these keywords could improve your score by up to 15%
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-800 mb-4">Score Breakdown</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Keywords Found</span>
                    <span className="font-semibold">{breakdown.keywordMatch.matched}/{breakdown.keywordMatch.total}</span>
                  </div>
                  <div className="score-bar">
                    <div 
                      className={getScoreClass(breakdown.keywordMatch.score)}
                      style={{ width: `${breakdown.keywordMatch.score}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Format Analysis */}
          <div className="card">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <FileText className="mr-2 text-green-600" size={24} />
              Format Analysis
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h4 className="font-medium text-gray-800 mb-4">Strengths</h4>
                <div className="space-y-2">
                  {breakdown.formatScore.strengths.map((strength, index) => (
                    <div key={index} className="flex items-center text-green-700">
                      <CheckCircle size={16} className="mr-2 flex-shrink-0" />
                      <span className="text-sm">{strength}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-800 mb-4">Issues to Fix</h4>
                <div className="space-y-2">
                  {breakdown.formatScore.issues.map((issue, index) => (
                    <div key={index} className="flex items-center text-red-700">
                      <AlertTriangle size={16} className="mr-2 flex-shrink-0" />
                      <span className="text-sm">{issue}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Content Quality */}
          <div className="card">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <Award className="mr-2 text-purple-600" size={24} />
              Content Quality
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h4 className="font-medium text-gray-800 mb-4">Strengths</h4>
                <div className="space-y-2">
                  {breakdown.contentQuality.strengths.map((strength, index) => (
                    <div key={index} className="flex items-center text-green-700">
                      <CheckCircle size={16} className="mr-2 flex-shrink-0" />
                      <span className="text-sm">{strength}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-800 mb-4">Areas for Improvement</h4>
                <div className="space-y-2">
                  {breakdown.contentQuality.improvements.map((improvement, index) => (
                    <div key={index} className="flex items-center text-orange-700">
                      <AlertTriangle size={16} className="mr-2 flex-shrink-0" />
                      <span className="text-sm">{improvement}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'recommendations' && (
        <div className="space-y-6">
          {recommendations.map((rec, index) => (
            <div
              key={index}
              className={`card border-l-4 ${
                rec.priority === 'high' ? 'border-red-500' :
                rec.priority === 'medium' ? 'border-yellow-500' : 'border-green-500'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      rec.priority === 'high' ? 'bg-red-100 text-red-800' :
                      rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {rec.priority.toUpperCase()} PRIORITY
                    </span>
                    <span className="text-sm text-gray-500 capitalize">{rec.category}</span>
                  </div>
                  
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">{rec.title}</h4>
                  <p className="text-gray-600 mb-4">{rec.description}</p>
                  
                  {rec.keywords && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Suggested keywords:</p>
                      <div className="flex flex-wrap gap-2">
                        {rec.keywords.map((keyword, keyIndex) => (
                          <span
                            key={keyIndex}
                            className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className={`text-2xl ${
                  rec.priority === 'high' ? 'text-red-500' :
                  rec.priority === 'medium' ? 'text-yellow-500' : 'text-green-500'
                }`}>
                  {rec.priority === 'high' ? '🔥' : rec.priority === 'medium' ? '⚠️' : '💡'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CVResults