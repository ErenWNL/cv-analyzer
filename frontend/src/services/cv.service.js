import api from './api'
import { toast } from 'react-hot-toast'
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../utils/constants'

// Upload CV file
export const uploadCV = async (file, jobTitle = '', additionalData = {}) => {
  try {
    const formData = new FormData()
    formData.append('cv', file)
    
    if (jobTitle) {
      formData.append('jobTitle', jobTitle)
    }
    
    // Add any additional data
    Object.keys(additionalData).forEach(key => {
      formData.append(key, additionalData[key])
    })

    const response = await api.post('/cv/upload', formData)
    
    if (response.success) {
      toast.success(SUCCESS_MESSAGES.UPLOAD_SUCCESS)
      return response.data
    } else {
      throw new Error(response.message || ERROR_MESSAGES.UPLOAD_FAILED)
    }
    
  } catch (error) {
    console.error('CV upload error:', error)
    const errorMessage = error.message || ERROR_MESSAGES.UPLOAD_FAILED
    toast.error(errorMessage)
    throw error
  }
}

// Get user's CVs
export const getUserCVs = async () => {
  try {
    const response = await api.get('/cv/list')
    return response.data || response
    
  } catch (error) {
    console.error('Failed to fetch user CVs:', error)
    
    // Return mock data for development
    return mockCVs
  }
}

// Get specific CV analysis
export const getCVAnalysis = async (cvId) => {
  try {
    const response = await api.get(`/cv/${cvId}/analysis`)
    return response.data || response
    
  } catch (error) {
    console.error('Failed to fetch CV analysis:', error)
    
    // Return mock analysis for development
    return mockAnalysis
  }
}

// Delete CV
export const deleteCV = async (cvId) => {
  try {
    const response = await api.delete(`/cv/${cvId}`)
    toast.success('CV deleted successfully')
    return response.data || response
    
  } catch (error) {
    console.error('Failed to delete CV:', error)
    toast.error('Failed to delete CV')
    throw error
  }
}

// Get user stats
export const getUserStats = async () => {
  try {
    const response = await api.get('/cv/stats')
    return response.data || response
    
  } catch (error) {
    console.error('Failed to fetch user stats:', error)
    
    // Return mock stats for development
    return mockStats
  }
}

// Reanalyze CV with different job title
export const reanalyzeCV = async (cvId, jobTitle) => {
  try {
    const response = await api.post(`/cv/${cvId}/reanalyze`, { jobTitle })
    toast.success('CV reanalyzed successfully')
    return response.data || response
    
  } catch (error) {
    console.error('Failed to reanalyze CV:', error)
    toast.error('Failed to reanalyze CV')
    throw error
  }
}

// Get CV download URL
export const downloadCV = async (cvId) => {
  try {
    const response = await api.get(`/cv/${cvId}/download`)
    return response.downloadUrl || response.url
    
  } catch (error) {
    console.error('Failed to get download URL:', error)
    toast.error('Failed to download CV')
    throw error
  }
}

// Mock data for development
export const mockCVs = [
  {
    id: 1,
    fileName: 'john_doe_resume.pdf',
    originalName: 'John_Doe_Resume_2024.pdf',
    uploadDate: '2024-08-10T10:30:00Z',
    atsScore: 85,
    status: 'analyzed',
    jobTitle: 'Software Engineer',
    fileSize: 245000,
    analysis: {
      keywordMatch: 78,
      formatScore: 92,
      contentQuality: 85
    }
  },
  {
    id: 2,
    fileName: 'updated_resume.docx',
    originalName: 'Updated_Resume_Final.docx',
    uploadDate: '2024-08-09T15:45:00Z',
    atsScore: 72,
    status: 'analyzed',
    jobTitle: 'Frontend Developer',
    fileSize: 189000,
    analysis: {
      keywordMatch: 65,
      formatScore: 80,
      contentQuality: 72
    }
  },
  {
    id: 3,
    fileName: 'marketing_cv.pdf',
    originalName: 'Marketing_Professional_CV.pdf',
    uploadDate: '2024-08-08T09:20:00Z',
    atsScore: 91,
    status: 'analyzed',
    jobTitle: 'Marketing Manager',
    fileSize: 312000,
    analysis: {
      keywordMatch: 88,
      formatScore: 95,
      contentQuality: 90
    }
  }
]

export const mockStats = {
  totalCVs: 5,
  averageScore: 78,
  lastUpload: '2024-08-10T10:30:00Z',
  improvements: 15,
  bestScore: 91,
  totalAnalyses: 12,
  monthlyUploads: 3
}

export const mockAnalysis = {
  id: 1,
  cvId: 1,
  atsScore: 85,
  analysis: {
    overall: {
      score: 85,
      grade: 'B+',
      message: 'Your CV is well-structured and ATS-friendly with room for improvement.'
    },
    breakdown: {
      keywordMatch: {
        score: 78,
        total: 25,
        matched: 19,
        missing: ['React Native', 'GraphQL', 'Docker', 'AWS', 'Microservices', 'Agile']
      },
      formatScore: {
        score: 92,
        issues: ['Consider using bullet points in experience section'],
        strengths: ['Clean formatting', 'Standard sections', 'Good font choice']
      },
      contentQuality: {
        score: 85,
        strengths: ['Quantified achievements', 'Relevant experience', 'Clear job progression'],
        improvements: ['Add more technical skills', 'Include project outcomes', 'Expand education section']
      }
    },
    recommendations: [
      {
        priority: 'high',
        category: 'keywords',
        title: 'Add Missing Keywords',
        description: 'Include these 6 missing keywords to improve your match rate by 15%',
        keywords: ['React Native', 'GraphQL', 'Docker', 'AWS', 'Microservices', 'Agile']
      },
      {
        priority: 'medium',
        category: 'format',
        title: 'Improve Formatting',
        description: 'Use bullet points in your experience section for better readability'
      },
      {
        priority: 'low',
        category: 'content',
        title: 'Expand Technical Skills',
        description: 'Add more technical skills relevant to your target role'
      }
    ]
  },
  createdAt: '2024-08-10T10:30:00Z',
  jobTitle: 'Software Engineer'
}