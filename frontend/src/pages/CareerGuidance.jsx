import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  TrendingUp, 
  Target, 
  MapPin, 
  DollarSign, 
  BookOpen, 
  Users, 
  Star,
  ArrowRight,
  Briefcase,
  Clock,
  Award,
  Lightbulb,
  BarChart3,
  Filter,
  Search,
  ExternalLink,
  ChevronRight,
  Zap,
  Globe,
  Building,
  Calendar
} from 'lucide-react';
import toast from 'react-hot-toast';

const CareerGuidance = () => {
  const { setPageTitle } = useApp();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCareerPath, setSelectedCareerPath] = useState(null);
  const [jobFilters, setJobFilters] = useState({
    location: '',
    salaryRange: '',
    experience: '',
    industry: '',
    jobType: ''
  });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setPageTitle('Career Guidance');
  }, [setPageTitle]);

  // Mock data for career recommendations
  const careerPaths = [
    {
      id: 'fullstack-dev',
      title: 'Full Stack Developer',
      match: 95,
      description: 'Build end-to-end web applications with modern technologies',
      currentSkills: ['JavaScript', 'React', 'Node.js', 'CSS'],
      requiredSkills: ['TypeScript', 'Docker', 'AWS', 'MongoDB'],
      avgSalary: { min: 70000, max: 120000 },
      growth: '+22%',
      demandLevel: 'Very High',
      timeToTransition: '3-6 months',
      icon: '💻',
      color: 'blue',
      steps: [
        'Complete TypeScript certification',
        'Build 2-3 full-stack projects',
        'Learn Docker containerization',
        'Get AWS Cloud Practitioner cert',
        'Apply to mid-level positions'
      ]
    },
    {
      id: 'data-scientist',
      title: 'Data Scientist',
      match: 78,
      description: 'Extract insights from data using machine learning and analytics',
      currentSkills: ['Python', 'SQL', 'Statistics'],
      requiredSkills: ['Machine Learning', 'TensorFlow', 'Pandas', 'Tableau'],
      avgSalary: { min: 80000, max: 150000 },
      growth: '+31%',
      demandLevel: 'Very High',
      timeToTransition: '6-12 months',
      icon: '📊',
      color: 'green',
      steps: [
        'Complete ML specialization course',
        'Build portfolio with real datasets',
        'Learn advanced Python libraries',
        'Get hands-on with Tableau/PowerBI',
        'Network with data professionals'
      ]
    },
    {
      id: 'product-manager',
      title: 'Product Manager',
      match: 85,
      description: 'Drive product strategy and work with cross-functional teams',
      currentSkills: ['Project Management', 'Communication', 'Analytics'],
      requiredSkills: ['Product Strategy', 'User Research', 'A/B Testing', 'Roadmapping'],
      avgSalary: { min: 90000, max: 140000 },
      growth: '+19%',
      demandLevel: 'High',
      timeToTransition: '4-8 months',
      icon: '🚀',
      color: 'purple',
      steps: [
        'Get PM certification (Google/Meta)',
        'Complete product case studies',
        'Learn user research methods',
        'Build product roadmaps',
        'Join PM communities and events'
      ]
    },
    {
      id: 'devops-engineer',
      title: 'DevOps Engineer',
      match: 72,
      description: 'Automate deployment pipelines and manage cloud infrastructure',
      currentSkills: ['Linux', 'Git', 'Basic AWS'],
      requiredSkills: ['Kubernetes', 'Terraform', 'Jenkins', 'Monitoring'],
      avgSalary: { min: 85000, max: 135000 },
      growth: '+25%',
      demandLevel: 'Very High',
      timeToTransition: '6-9 months',
      icon: '⚙️',
      color: 'orange',
      steps: [
        'Get AWS Solutions Architect cert',
        'Learn Kubernetes and Docker',
        'Master Infrastructure as Code',
        'Set up CI/CD pipelines',
        'Practice with monitoring tools'
      ]
    }
  ];

  // Mock job recommendations
  const jobRecommendations = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      salary: '$95k - $120k',
      type: 'Full-time',
      match: 92,
      posted: '2 days ago',
      skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS'],
      description: 'Join our growing team to build next-generation web applications...',
      logo: '🏢'
    },
    {
      id: 2,
      title: 'Full Stack Engineer',
      company: 'StartupXYZ',
      location: 'Remote',
      salary: '$80k - $110k',
      type: 'Full-time',
      match: 88,
      posted: '1 week ago',
      skills: ['Node.js', 'React', 'PostgreSQL', 'AWS'],
      description: 'Build scalable web applications in a fast-paced startup environment...',
      logo: '🚀'
    },
    {
      id: 3,
      title: 'JavaScript Developer',
      company: 'Digital Agency',
      location: 'New York, NY',
      salary: '$70k - $90k',
      type: 'Contract',
      match: 85,
      posted: '3 days ago',
      skills: ['JavaScript', 'Vue.js', 'Node.js', 'MongoDB'],
      description: 'Work on diverse client projects using modern JavaScript frameworks...',
      logo: '🎨'
    }
  ];

  // Mock learning resources
  const learningResources = [
    {
      id: 1,
      title: 'Complete React Developer Course',
      provider: 'Tech Academy',
      duration: '40 hours',
      rating: 4.8,
      students: 45000,
      price: '$89',
      type: 'Course',
      skills: ['React', 'Redux', 'JavaScript'],
      icon: '📚'
    },
    {
      id: 2,
      title: 'AWS Cloud Practitioner Certification',
      provider: 'Amazon Web Services',
      duration: '20 hours',
      rating: 4.9,
      students: 120000,
      price: 'Free',
      type: 'Certification',
      skills: ['AWS', 'Cloud Computing'],
      icon: '🏆'
    },
    {
      id: 3,
      title: 'JavaScript Algorithms and Data Structures',
      provider: 'CodeCamp',
      duration: '60 hours',
      rating: 4.7,
      students: 80000,
      price: 'Free',
      type: 'Interactive',
      skills: ['JavaScript', 'Algorithms', 'Problem Solving'],
      icon: '💡'
    }
  ];

  // Market insights data
  const marketInsights = {
    trendingSkills: [
      { skill: 'TypeScript', growth: '+45%', demand: 'Very High' },
      { skill: 'React', growth: '+38%', demand: 'Very High' },
      { skill: 'Python', growth: '+42%', demand: 'Very High' },
      { skill: 'AWS', growth: '+55%', demand: 'Extremely High' },
      { skill: 'Docker', growth: '+48%', demand: 'High' },
      { skill: 'Kubernetes', growth: '+52%', demand: 'High' }
    ],
    salaryTrends: {
      'Frontend Developer': { avg: 85000, growth: '+8%' },
      'Backend Developer': { avg: 95000, growth: '+12%' },
      'Full Stack Developer': { avg: 90000, growth: '+15%' },
      'DevOps Engineer': { avg: 110000, growth: '+18%' }
    },
    topLocations: [
      { city: 'San Francisco', avgSalary: 145000, jobs: 2400 },
      { city: 'New York', avgSalary: 125000, jobs: 1800 },
      { city: 'Seattle', avgSalary: 135000, jobs: 1200 },
      { city: 'Austin', avgSalary: 105000, jobs: 800 }
    ]
  };

  const getMatchColor = (match) => {
    if (match >= 90) return 'text-green-600';
    if (match >= 80) return 'text-blue-600';
    if (match >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getMatchBg = (match) => {
    if (match >= 90) return 'bg-green-100 dark:bg-green-900/20';
    if (match >= 80) return 'bg-blue-100 dark:bg-blue-900/20';
    if (match >= 70) return 'bg-yellow-100 dark:bg-yellow-900/20';
    return 'bg-red-100 dark:bg-red-900/20';
  };

  const handleJobApply = (job) => {
    toast.success(`Application started for ${job.title} at ${job.company}`);
  };

  const handleStartLearning = (resource) => {
    toast.info(`Redirecting to ${resource.title}...`);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'career-paths', label: 'Career Paths', icon: TrendingUp },
    { id: 'job-matches', label: 'Job Matches', icon: Briefcase },
    { id: 'learning', label: 'Learning', icon: BookOpen },
    { id: 'market-insights', label: 'Market Insights', icon: Globe }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          AI Career Guidance
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Discover your ideal career path with personalized AI recommendations
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
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
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
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="card-elevated p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Target className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {careerPaths.length}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Career Matches
                  </p>
                </div>

                <div className="card-elevated p-6 text-center">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Briefcase className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {jobRecommendations.length}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Job Matches
                  </p>
                </div>

                <div className="card-elevated p-6 text-center">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <BookOpen className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {learningResources.length}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Learning Paths
                  </p>
                </div>

                <div className="card-elevated p-6 text-center">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    +25%
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Avg. Growth
                  </p>
                </div>
              </div>

              {/* Top Recommendations */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  🎯 Top Career Recommendations
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {careerPaths.slice(0, 2).map((path) => (
                    <div key={path.id} className="card-elevated p-6 hover:shadow-lg transition-all duration-200">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{path.icon}</span>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {path.title}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {path.timeToTransition} transition time
                            </p>
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getMatchBg(path.match)}`}>
                          <span className={getMatchColor(path.match)}>{path.match}% match</span>
                        </div>
                      </div>

                      <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                        {path.description}
                      </p>

                      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Salary Range:</span>
                          <p className="font-medium text-gray-900 dark:text-white">
                            ${path.avgSalary.min.toLocaleString()} - ${path.avgSalary.max.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Growth:</span>
                          <p className="font-medium text-green-600">
                            {path.growth}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedCareerPath(path);
                          setActiveTab('career-paths');
                        }}
                        className="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Zap className="mr-2 h-4 w-4" />
                        View Career Path
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Market Trends */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  📈 Trending Skills in Tech
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {marketInsights.trendingSkills.map((skill, index) => (
                    <div key={index} className="card-elevated p-4 text-center hover:shadow-md transition-all duration-200">
                      <div className="font-medium text-gray-900 dark:text-white text-sm mb-1">
                        {skill.skill}
                      </div>
                      <div className="text-green-600 text-xs font-medium mb-1">
                        {skill.growth}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {skill.demand}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <button
                  onClick={() => setActiveTab('career-paths')}
                  className="card-elevated p-6 text-left hover:shadow-lg transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <TrendingUp className="h-8 w-8 text-blue-600" />
                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Explore Career Paths
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Discover personalized career recommendations based on your skills
                  </p>
                </button>

                <button
                  onClick={() => setActiveTab('job-matches')}
                  className="card-elevated p-6 text-left hover:shadow-lg transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <Briefcase className="h-8 w-8 text-green-600" />
                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Find Job Matches
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Browse jobs that match your skills and career goals
                  </p>
                </button>

                <button
                  onClick={() => setActiveTab('learning')}
                  className="card-elevated p-6 text-left hover:shadow-lg transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <BookOpen className="h-8 w-8 text-purple-600" />
                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Start Learning
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Access curated learning resources to advance your career
                  </p>
                </button>
              </div>
            </div>
          )}

          {/* Career Paths Tab */}
          {activeTab === 'career-paths' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Personalized Career Paths
                </h3>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Based on your skills and interests
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {careerPaths.map((path) => (
                  <div key={path.id} className="card-elevated p-6 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-3xl">{path.icon}</span>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {path.title}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {path.demandLevel} demand • {path.growth} growth
                          </p>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${getMatchBg(path.match)}`}>
                        <span className={getMatchColor(path.match)}>{path.match}% match</span>
                      </div>
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                      {path.description}
                    </p>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Salary:</span>
                        <p className="font-medium text-gray-900 dark:text-white">
                          ${path.avgSalary.min.toLocaleString()} - ${path.avgSalary.max.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Transition:</span>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {path.timeToTransition}
                        </p>
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="space-y-3 mb-4">
                      <div>
                        <h5 className="text-sm font-medium text-green-600 mb-2">✅ Your Skills</h5>
                        <div className="flex flex-wrap gap-2">
                          {path.currentSkills.map((skill, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 text-xs rounded"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-orange-600 mb-2">📚 Skills to Learn</h5>
                        <div className="flex flex-wrap gap-2">
                          {path.requiredSkills.map((skill, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-200 text-xs rounded"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Action Steps */}
                    {selectedCareerPath?.id === path.id && (
                      <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <h5 className="font-medium text-blue-800 dark:text-blue-200 mb-3">
                          🎯 Your Action Plan
                        </h5>
                        <ul className="space-y-2">
                          {path.steps.map((step, index) => (
                            <li key={index} className="flex items-start space-x-2 text-sm">
                              <span className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-medium mt-0.5">
                                {index + 1}
                              </span>
                              <span className="text-blue-700 dark:text-blue-300">{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="flex space-x-3">
                      <button
                        onClick={() => setSelectedCareerPath(selectedCareerPath?.id === path.id ? null : path)}
                        className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-blue-300 text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                      >
                        <Lightbulb className="mr-2 h-4 w-4" />
                        {selectedCareerPath?.id === path.id ? 'Hide Plan' : 'View Plan'}
                      </button>
                      <button
                        onClick={() => {
                          setActiveTab('learning');
                          toast.info('Finding learning resources for ' + path.title);
                        }}
                        className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <BookOpen className="mr-2 h-4 w-4" />
                        Start Learning
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Job Matches Tab */}
          {activeTab === 'job-matches' && (
            <div className="space-y-6">
              {/* Search and Filters */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search jobs by title, company, or keywords..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors">
                    <Filter className="mr-2 h-4 w-4" />
                    Filters
                  </button>
                </div>

                <div className="flex flex-wrap gap-4 text-sm">
                  <select 
                    value={jobFilters.location}
                    onChange={(e) => setJobFilters(prev => ({ ...prev, location: e.target.value }))}
                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
                  >
                    <option value="">All Locations</option>
                    <option value="remote">Remote</option>
                    <option value="san-francisco">San Francisco</option>
                    <option value="new-york">New York</option>
                    <option value="seattle">Seattle</option>
                  </select>

                  <select 
                    value={jobFilters.salaryRange}
                    onChange={(e) => setJobFilters(prev => ({ ...prev, salaryRange: e.target.value }))}
                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
                  >
                    <option value="">Any Salary</option>
                    <option value="60-80">$60k - $80k</option>
                    <option value="80-100">$80k - $100k</option>
                    <option value="100-120">$100k - $120k</option>
                    <option value="120+">$120k+</option>
                  </select>

                  <select 
                    value={jobFilters.experience}
                    onChange={(e) => setJobFilters(prev => ({ ...prev, experience: e.target.value }))}
                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
                  >
                    <option value="">Any Experience</option>
                    <option value="entry">Entry Level</option>
                    <option value="mid">Mid Level</option>
                    <option value="senior">Senior Level</option>
                  </select>

                  <select 
                    value={jobFilters.jobType}
                    onChange={(e) => setJobFilters(prev => ({ ...prev, jobType: e.target.value }))}
                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
                  >
                    <option value="">All Types</option>
                    <option value="full-time">Full Time</option>
                    <option value="contract">Contract</option>
                    <option value="part-time">Part Time</option>
                  </select>
                </div>
              </div>

              {/* Job Results */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Recommended Jobs ({jobRecommendations.length})
                  </h3>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Sorted by match score
                  </div>
                </div>

                {jobRecommendations.map((job) => (
                  <div key={job.id} className="card-elevated p-6 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-2xl">
                          {job.logo}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                            {job.title}
                          </h4>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                            {job.company}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-4 w-4" />
                              <span>{job.location}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <DollarSign className="h-4 w-4" />
                              <span>{job.salary}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>{job.type}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>{job.posted}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${getMatchBg(job.match)}`}>
                        <span className={getMatchColor(job.match)}>{job.match}% match</span>
                      </div>
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                      {job.description}
                    </p>

                    <div className="mb-4">
                      <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Required Skills:</h5>
                      <div className="flex flex-wrap gap-2">
                        {job.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 text-xs rounded"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleJobApply(job)}
                        className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors btn-hover-lift"
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Apply Now
                      </button>
                      <button
                        onClick={() => toast.info('Job saved to your favorites')}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
                      >
                        <Star className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Learning Tab */}
          {activeTab === 'learning' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Recommended Learning Resources
                </h3>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Curated for your career goals
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {learningResources.map((resource) => (
                  <div key={resource.id} className="card-elevated p-6 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-start space-x-3 mb-4">
                      <span className="text-2xl">{resource.icon}</span>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                          {resource.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {resource.provider}
                        </p>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs font-medium ${
                        resource.type === 'Free' || resource.price === 'Free'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200'
                      }`}>
                        {resource.type}
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{resource.duration}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Rating:</span>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="font-medium text-gray-900 dark:text-white">{resource.rating}</span>
                          <span className="text-gray-500 dark:text-gray-400">({resource.students.toLocaleString()})</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Price:</span>
                        <span className={`font-medium ${
                          resource.price === 'Free' ? 'text-green-600' : 'text-gray-900 dark:text-white'
                        }`}>
                          {resource.price}
                        </span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Skills:</h5>
                      <div className="flex flex-wrap gap-2">
                        {resource.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-200 text-xs rounded"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => handleStartLearning(resource)}
                      className="w-full inline-flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors btn-hover-lift"
                    >
                      <BookOpen className="mr-2 h-4 w-4" />
                      Start Learning
                    </button>
                  </div>
                ))}
              </div>

              {/* Learning Path Suggestion */}
              <div className="card-elevated p-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-800">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center">
                    <Lightbulb className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">
                      📚 Suggested Learning Path
                    </h4>
                    <p className="text-purple-700 dark:text-purple-300 mb-4">
                      Based on your career goals as a Full Stack Developer, we recommend starting with TypeScript fundamentals, 
                      then moving to advanced React patterns, followed by Node.js backend development.
                    </p>
                    <button
                      onClick={() => toast.info('Creating personalized learning path...')}
                      className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <ChevronRight className="mr-2 h-4 w-4" />
                      Create My Learning Path
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Market Insights Tab */}
          {activeTab === 'market-insights' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Tech Industry Market Insights
              </h3>

              {/* Salary Trends */}
              <div className="card-elevated p-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                  💰 Average Salary Trends
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Object.entries(marketInsights.salaryTrends).map(([role, data]) => (
                    <div key={role} className="p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                      <h5 className="font-medium text-gray-900 dark:text-white text-sm mb-2">
                        {role}
                      </h5>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                        ${data.avg.toLocaleString()}
                      </div>
                      <div className="text-green-600 text-sm font-medium">
                        {data.growth} this year
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Locations */}
              <div className="card-elevated p-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                  🌍 Top Tech Cities
                </h4>
                <div className="space-y-4">
                  {marketInsights.topLocations.map((location, index) => (
                    <div key={location.city} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                            {index + 1}
                          </span>
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900 dark:text-white">
                            {location.city}
                          </h5>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {location.jobs} open positions
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900 dark:text-white">
                          ${location.avgSalary.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Average Salary
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trending Skills */}
              <div className="card-elevated p-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                  🔥 Fastest Growing Skills
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {marketInsights.trendingSkills.map((skill, index) => (
                    <div key={skill.skill} className="p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-gray-900 dark:text-white">
                          {skill.skill}
                        </h5>
                        <div className="text-green-600 font-bold">
                          {skill.growth}
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Demand: {skill.demand}
                      </div>
                      <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ 
                            width: `${skill.demand === 'Extremely High' ? 100 : 
                                     skill.demand === 'Very High' ? 85 : 
                                     skill.demand === 'High' ? 70 : 50}%` 
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Industry Outlook */}
              <div className="card-elevated p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                      📊 Industry Outlook 2024-2025
                    </h4>
                    <ul className="text-blue-700 dark:text-blue-300 space-y-2 text-sm">
                      <li>• Tech employment expected to grow 25% faster than average</li>
                      <li>• Remote work opportunities continue to expand globally</li>
                      <li>• AI and machine learning skills in highest demand</li>
                      <li>• Cloud computing roles showing 40% salary increases</li>
                      <li>• Cybersecurity professionals critically needed across all industries</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CareerGuidance;