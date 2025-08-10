import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Download, Share2, RefreshCw, Eye, FileText } from 'lucide-react'
import { toast } from 'react-hot-toast'
import CVResults from '../components/cv/CVResults'
import { getCVAnalysis, reanalyzeCV } from '../services/cv.service'
import { formatDate } from '../utils/helpers'

function ResultsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(true)
  const [reanalyzing, setReanalyzing] = useState(false)

  useEffect(() => {
    const fetchAnalysis = async () => {
      if (!id) {
        navigate('/dashboard')
        return
      }

      try {
        const analysisData = await getCVAnalysis(id)
        setAnalysis(analysisData)
      } catch (error) {
        console.error('Failed to fetch analysis:', error)
        toast.error('Failed to load CV analysis')
        navigate('/dashboard')
      } finally {
        setLoading(false)
      }
    }

    fetchAnalysis()
  }, [id, navigate])

  const handleReanalyze = async () => {
    if (!analysis) return

    const jobTitle = prompt('Enter job title for reanalysis (optional):')
    
    setReanalyzing(true)
    try {
      const newAnalysis = await reanalyzeCV(id, jobTitle)
      setAnalysis(newAnalysis)
    } catch (error) {
      // Error toast is already shown by the service
    } finally {
      setReanalyzing(false)
    }
  }

  const handleDownload = () => {
    toast.success('Download feature coming soon!')
  }

  const handleShare = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url)
    toast.success('Link copied to clipboard!')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner w-12 h-12 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your CV analysis...</p>
        </div>
      </div>
    )
  }

  if (!analysis) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Analysis Not Found</h2>
          <p className="text-gray-600 mb-6">The requested CV analysis could not be found.</p>
          <Link to="/dashboard" className="btn-primary">
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div className="flex items-center space-x-4 mb-4 sm:mb-0">
            <Link 
              to="/dashboard"
              className="btn-secondary p-2"
              title="Back to Dashboard"
            >
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">CV Analysis Results</h1>
              <p className="text-gray-600">
                Analyzed on {formatDate(analysis.createdAt)}
                {analysis.jobTitle && ` for ${analysis.jobTitle}`}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={handleReanalyze}
              disabled={reanalyzing}
              className="btn-secondary"
              title="Reanalyze CV"
            >
              {reanalyzing ? (
                <div className="spinner w-4 h-4"></div>
              ) : (
                <RefreshCw size={16} />
              )}
              {reanalyzing ? 'Analyzing...' : 'Reanalyze'}
            </button>
            
            <button
              onClick={handleShare}
              className="btn-secondary"
              title="Share Results"
            >
              <Share2 size={16} />
              Share
            </button>
            
            <button
              onClick={handleDownload}
              className="btn-primary"
              title="Download Report"
            >
              <Download size={16} />
              Download
            </button>
          </div>
        </div>

        {/* Results Component */}
        <CVResults analysis={analysis} />

        {/* Additional Actions */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center space-x-4">
            <Link to="/upload" className="btn-primary">
              Analyze Another CV
            </Link>
            <Link to="/dashboard" className="btn-secondary">
              View All Analyses
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResultsPage