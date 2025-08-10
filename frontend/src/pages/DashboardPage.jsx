import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FileText, TrendingUp, Clock, BarChart3, Upload, Eye, Trash2 } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { getUserCVs, getUserStats, deleteCV } from '../services/cv.service'
import { formatDate, getScoreColor, getScoreLabel, formatFileSize } from '../utils/helpers.js'
import { toast } from 'react-hot-toast'

function DashboardPage() {
  const [cvs, setCvs] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cvsData, statsData] = await Promise.all([
          getUserCVs(),
          getUserStats()
        ])
        setCvs(cvsData)
        setStats(statsData)
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleDeleteCV = async (cvId) => {
    if (!window.confirm('Are you sure you want to delete this CV analysis?')) {
      return
    }

    try {
      await deleteCV(cvId)
      setCvs(prevCvs => prevCvs.filter(cv => cv.id !== cvId))
      toast.success('CV deleted successfully')
    } catch (error) {
      // Error toast is already shown by the service
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner w-12 h-12 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  const statsCards = [
    {
      title: 'Total CVs',
      value: stats?.totalCVs || 0,
      icon: FileText,
      color: 'blue',
      description: 'CVs analyzed'
    },
    {
      title: 'Average Score',
      value: stats?.averageScore ? `${stats.averageScore}%` : 'N/A',
      icon: BarChart3,
      color: 'green',
      description: 'Across all CVs'
    },
    {
      title: 'Best Score',
      value: stats?.bestScore ? `${stats.bestScore}%` : 'N/A',
      icon: TrendingUp,
      color: 'purple',
      description: 'Highest achieved'
    },
    {
      title: 'Last Upload',
      value: stats?.lastUpload ? formatDate(stats.lastUpload) : 'Never',
      icon: Clock,
      color: 'yellow',
      description: 'Most recent'
    }
  ]

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Welcome back, {user?.firstName || 'User'}!
            </h1>
            <p className="text-gray-600 mt-1">
              Track your CV optimization progress and insights
            </p>
          </div>
          <Link 
            to="/upload"
            className="btn-primary mt-4 sm:mt-0 inline-flex items-center gap-2"
          >
            <Upload size={20} />
            Upload New CV
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="card hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                  </div>
                  <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                    <Icon className={`text-${stat.color}-600`} size={24} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* CV List */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Your CV Analyses</h2>
            {cvs.length > 0 && (
              <span className="text-sm text-gray-500">{cvs.length} total</span>
            )}
          </div>

          {cvs.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No CVs uploaded yet</h3>
              <p className="text-gray-600 mb-6">
                Upload your first CV to get started with AI-powered analysis
              </p>
              <Link 
                to="/upload"
                className="btn-primary inline-flex items-center gap-2"
              >
                <Upload size={16} />
                Upload Your First CV
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {cvs.map((cv) => (
                <div 
                  key={cv.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors duration-200"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="text-blue-600" size={20} />
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-900">{cv.fileName}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                        <span>Uploaded {formatDate(cv.uploadDate)}</span>
                        <span>•</span>
                        <span>{formatFileSize(cv.fileSize)}</span>
                        {cv.jobTitle && (
                          <>
                            <span>•</span>
                            <span>{cv.jobTitle}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    {/* Score Display */}
                    <div className="text-right">
                      <div className={`text-lg font-semibold text-${getScoreColor(cv.atsScore)}-600`}>
                        {cv.atsScore}%
                      </div>
                      <div className="text-xs text-gray-500">
                        {getScoreLabel(cv.atsScore)}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/results/${cv.id}`}
                        className="btn-secondary py-2 px-3 text-sm"
                        title="View Analysis"
                      >
                        <Eye size={16} />
                      </Link>
                      <button
                        onClick={() => handleDeleteCV(cv.id)}
                        className="btn-danger py-2 px-3 text-sm"
                        title="Delete CV"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        {cvs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {cvs.slice(0, 3).map((cv) => (
                  <div key={cv.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 truncate max-w-48">
                        {cv.fileName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDate(cv.uploadDate)}
                      </p>
                    </div>
                    <div className={`text-${getScoreColor(cv.atsScore)}-600 font-semibold`}>
                      {cv.atsScore}%
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  to="/upload"
                  className="block w-full btn-primary py-3 text-center"
                >
                  <Upload size={16} className="inline mr-2" />
                  Upload New CV
                </Link>
                <Link
                  to="/profile"
                  className="block w-full btn-secondary py-3 text-center"
                >
                  Edit Profile
                </Link>
                <a
                  href="/help"
                  className="block w-full btn-secondary py-3 text-center"
                >
                  Get Help
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DashboardPage