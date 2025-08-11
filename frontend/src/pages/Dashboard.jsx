import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { 
  FileText, 
  Brain, 
  TrendingUp, 
  Users, 
  Upload,
  BarChart3,
  Target,
  Award,
  ArrowRight,
  Plus
} from 'lucide-react';

const Dashboard = () => {
  const { user, isAdmin, isHR, isCandidate } = useAuth();
  const { setPageTitle } = useApp();

  useEffect(() => {
    setPageTitle('Dashboard');
  }, [setPageTitle]);

  // Mock data for dashboard
  const stats = {
    cvScore: 87,
    jobMatches: 12,
    assessmentsCompleted: 3,
    profileViews: 45
  };

  const recentActivity = [
    {
      id: 1,
      type: 'cv_analysis',
      title: 'CV Analysis Complete',
      description: 'Your CV scored 87/100 with ATS compatibility',
      time: '2 hours ago',
      icon: FileText,
      color: 'text-blue-600'
    },
    {
      id: 2,
      type: 'job_match',
      title: 'New Job Matches',
      description: '5 new positions match your profile',
      time: '4 hours ago',
      icon: Target,
      color: 'text-green-600'
    },
    {
      id: 3,
      type: 'assessment',
      title: 'Skill Assessment',
      description: 'JavaScript assessment completed - 92%',
      time: '1 day ago',
      icon: Award,
      color: 'text-purple-600'
    }
  ];

  const quickActions = isCandidate ? [
    {
      title: 'Upload New CV',
      description: 'Get AI-powered analysis and feedback',
      icon: Upload,
      link: '/cv-analyzer',
      color: 'bg-blue-500'
    },
    {
      title: 'Take Assessment',
      description: 'Test your skills and improve your profile',
      icon: Brain,
      link: '/skill-assessment',
      color: 'bg-purple-500'
    },
    {
      title: 'Career Guidance',
      description: 'Get personalized career recommendations',
      icon: TrendingUp,
      link: '/career-guidance',
      color: 'bg-green-500'
    },
    {
      title: 'View Job Matches',
      description: 'See opportunities that match your profile',
      icon: Target,
      link: '/job-matches',
      color: 'bg-orange-500'
    }
  ] : isHR ? [
    {
      title: 'Post New Job',
      description: 'Create job posting and find candidates',
      icon: Plus,
      link: '/hr/job-postings',
      color: 'bg-blue-500'
    },
    {
      title: 'Search Candidates',
      description: 'Find qualified candidates for your roles',
      icon: Users,
      link: '/hr/candidate-search',
      color: 'bg-green-500'
    },
    {
      title: 'View Analytics',
      description: 'Track hiring metrics and performance',
      icon: BarChart3,
      link: '/hr/analytics',
      color: 'bg-purple-500'
    },
    {
      title: 'Matching Results',
      description: 'Review AI-powered candidate matches',
      icon: Target,
      link: '/hr/matching-results',
      color: 'bg-orange-500'
    }
  ] : [
    {
      title: 'User Management',
      description: 'Manage system users and permissions',
      icon: Users,
      link: '/admin/users',
      color: 'bg-blue-500'
    },
    {
      title: 'System Analytics',
      description: 'View platform usage and metrics',
      icon: BarChart3,
      link: '/admin/analytics',
      color: 'bg-green-500'
    },
    {
      title: 'System Config',
      description: 'Configure platform settings',
      icon: Target,
      link: '/admin/config',
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.name || 'User'}! 👋
        </h1>
        <p className="text-blue-100">
          {isCandidate && "Ready to take your career to the next level?"}
          {isHR && "Let's find the perfect candidates for your team."}
          {isAdmin && "Manage your platform efficiently."}
        </p>
      </div>

      {/* Stats Grid */}
      {isCandidate && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card-elevated p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">CV Score</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.cvScore}%</p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
                <FileText className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${stats.cvScore}%` }}
              />
            </div>
          </div>

          <div className="card-elevated p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Job Matches</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.jobMatches}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                <Target className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <p className="mt-2 text-sm text-green-600 dark:text-green-400">
              +3 new matches this week
            </p>
          </div>

          <div className="card-elevated p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Assessments</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.assessmentsCompleted}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center">
                <Brain className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Completed this month
            </p>
          </div>

          <div className="card-elevated p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Profile Views</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.profileViews}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
            <p className="mt-2 text-sm text-orange-600 dark:text-orange-400">
              +12% from last week
            </p>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.link}
              className="card-elevated p-6 hover:shadow-lg transition-all duration-200 group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                {action.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {action.description}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      {isCandidate && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Recent Activity
          </h2>
          <div className="card-elevated overflow-hidden">
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="p-6 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                  <div className="flex items-start space-x-4">
                    <div className={`w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center`}>
                      <activity.icon className={`h-5 w-5 ${activity.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {activity.title}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {activity.description}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                        {activity.time}
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Getting Started Tips */}
      {isCandidate && stats.cvScore === 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
            🚀 Get Started with CV Analyzer
          </h3>
          <div className="space-y-2 text-sm text-yellow-700 dark:text-yellow-300">
            <p>• Upload your CV to get an instant AI analysis</p>
            <p>• Take skill assessments to showcase your abilities</p>
            <p>• Get personalized job recommendations</p>
            <p>• Connect with HR professionals</p>
          </div>
          <div className="mt-4">
            <Link
              to="/cv-analyzer"
              className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              Upload Your CV
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;