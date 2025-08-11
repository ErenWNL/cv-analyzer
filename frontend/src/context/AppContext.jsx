import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [cvData, setCvData] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [jobMatches, setJobMatches] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [skillAssessments, setSkillAssessments] = useState([]);

  // CV Analysis state
  const [cvAnalysis, setCvAnalysis] = useState({
    score: null,
    atsCompatibility: null,
    suggestions: [],
    skillsFound: [],
    experienceAnalysis: null,
    educationAnalysis: null
  });

  // Job matching state
  const [jobMatchingState, setJobMatchingState] = useState({
    isSearching: false,
    lastSearchQuery: '',
    filters: {
      location: '',
      salary: { min: '', max: '' },
      experience: '',
      jobType: '',
      industry: ''
    },
    savedJobs: []
  });

  // Assessment state
  const [assessmentState, setAssessmentState] = useState({
    currentAssessment: null,
    completedAssessments: [],
    skillProgress: {},
    recommendations: []
  });

  // UI state
  const [uiState, setUiState] = useState({
    sidebarCollapsed: false,
    activeModal: null,
    breadcrumbs: [],
    pageTitle: 'Dashboard'
  });

  // Initialize app data when user authenticates
  useEffect(() => {
    if (isAuthenticated && user) {
      initializeAppData();
    } else {
      resetAppState();
    }
  }, [isAuthenticated, user]);

  const initializeAppData = async () => {
    try {
      setLoading(true);
      // Load user's CV data, assessments, etc.
      await Promise.all([
        loadUserCvData(),
        loadUserAssessments(),
        loadNotifications(),
        loadJobMatches()
      ]);
    } catch (error) {
      console.error('Error initializing app data:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetAppState = () => {
    setCvData(null);
    setAnalysisResults(null);
    setJobMatches([]);
    setNotifications([]);
    setSkillAssessments([]);
    setCvAnalysis({
      score: null,
      atsCompatibility: null,
      suggestions: [],
      skillsFound: [],
      experienceAnalysis: null,
      educationAnalysis: null
    });
  };

  const loadUserCvData = async () => {
    // TODO: Implement API call
  };

  const loadUserAssessments = async () => {
    // TODO: Implement API call
  };

  const loadNotifications = async () => {
    // TODO: Implement API call
  };

  const loadJobMatches = async () => {
    // TODO: Implement API call
  };

  // CV Management methods
  const updateCvData = (newCvData) => {
    setCvData(newCvData);
  };

  const updateAnalysisResults = (results) => {
    setAnalysisResults(results);
    setCvAnalysis(prev => ({ ...prev, ...results }));
  };

  // Job matching methods
  const updateJobMatches = (matches) => {
    setJobMatches(matches);
  };

  const saveJob = (jobId) => {
    setJobMatchingState(prev => ({
      ...prev,
      savedJobs: [...prev.savedJobs, jobId]
    }));
  };

  const unsaveJob = (jobId) => {
    setJobMatchingState(prev => ({
      ...prev,
      savedJobs: prev.savedJobs.filter(id => id !== jobId)
    }));
  };

  // Notification methods
  const addNotification = (notification) => {
    setNotifications(prev => [notification, ...prev]);
  };

  const markNotificationAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Assessment methods
  const startAssessment = (assessmentData) => {
    setAssessmentState(prev => ({
      ...prev,
      currentAssessment: assessmentData
    }));
  };

  const completeAssessment = (assessmentResult) => {
    setAssessmentState(prev => ({
      ...prev,
      currentAssessment: null,
      completedAssessments: [...prev.completedAssessments, assessmentResult]
    }));
  };

  // UI state methods
  const setPageTitle = (title) => {
    setUiState(prev => ({ ...prev, pageTitle: title }));
    document.title = `${title} - CV Analyzer`;
  };

  const setBreadcrumbs = (breadcrumbs) => {
    setUiState(prev => ({ ...prev, breadcrumbs }));
  };

  const toggleSidebar = () => {
    setUiState(prev => ({ ...prev, sidebarCollapsed: !prev.sidebarCollapsed }));
  };

  const showModal = (modalType, modalData = null) => {
    setUiState(prev => ({ ...prev, activeModal: { type: modalType, data: modalData } }));
  };

  const hideModal = () => {
    setUiState(prev => ({ ...prev, activeModal: null }));
  };

  const value = {
    // Loading state
    loading,
    setLoading,

    // CV data
    cvData,
    analysisResults,
    cvAnalysis,
    updateCvData,
    updateAnalysisResults,

    // Job matching
    jobMatches,
    jobMatchingState,
    updateJobMatches,
    saveJob,
    unsaveJob,

    // Notifications
    notifications,
    addNotification,
    markNotificationAsRead,
    clearAllNotifications,

    // Skill assessments
    skillAssessments,
    assessmentState,
    startAssessment,
    completeAssessment,

    // UI state
    uiState,
    setPageTitle,
    setBreadcrumbs,
    toggleSidebar,
    showModal,
    hideModal,

    // Data refresh
    initializeAppData,
    resetAppState
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;