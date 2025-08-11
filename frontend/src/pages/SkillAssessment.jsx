import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Brain, 
  Code, 
  Award, 
  Clock, 
  Target, 
  Play, 
  CheckCircle, 
  AlertCircle,
  BarChart3,
  Star,
  RefreshCw,
  ArrowRight,
  Trophy,
  Zap,
  BookOpen,
  Users,
  TrendingUp
} from 'lucide-react';
import toast from 'react-hot-toast';

const SkillAssessment = () => {
  const { setPageTitle, loading, setLoading } = useApp();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [isAssessmentActive, setIsAssessmentActive] = useState(false);
  const [completedAssessments, setCompletedAssessments] = useState([]);

  useEffect(() => {
    setPageTitle('Skill Assessment');
  }, [setPageTitle]);

  // Mock assessment data
  const availableAssessments = [
    {
      id: 'javascript',
      title: 'JavaScript Fundamentals',
      category: 'Programming',
      difficulty: 'Intermediate',
      duration: 30,
      questions: 25,
      description: 'Test your knowledge of JavaScript ES6+, async/await, DOM manipulation, and modern frameworks.',
      skills: ['Variables & Functions', 'Async Programming', 'DOM Manipulation', 'ES6+ Features'],
      icon: '🟨',
      color: 'yellow',
      popularity: 95
    },
    {
      id: 'react',
      title: 'React Development',
      category: 'Frontend',
      difficulty: 'Advanced',
      duration: 45,
      questions: 30,
      description: 'Comprehensive assessment covering React hooks, state management, component lifecycle, and best practices.',
      skills: ['Hooks & State', 'Component Design', 'Performance', 'Testing'],
      icon: '⚛️',
      color: 'blue',
      popularity: 88
    },
    {
      id: 'python',
      title: 'Python Programming',
      category: 'Programming',
      difficulty: 'Intermediate',
      duration: 40,
      questions: 35,
      description: 'Evaluate your Python skills including data structures, OOP, libraries, and problem-solving.',
      skills: ['Data Structures', 'OOP', 'Libraries', 'Algorithms'],
      icon: '🐍',
      color: 'green',
      popularity: 92
    },
    {
      id: 'sql',
      title: 'SQL & Database Design',
      category: 'Database',
      difficulty: 'Intermediate',
      duration: 35,
      questions: 20,
      description: 'Test your SQL querying skills, database design principles, and optimization techniques.',
      skills: ['Query Writing', 'Joins & Relations', 'Optimization', 'Design Patterns'],
      icon: '🗄️',
      color: 'purple',
      popularity: 85
    },
    {
      id: 'nodejs',
      title: 'Node.js Backend',
      category: 'Backend',
      difficulty: 'Advanced',
      duration: 50,
      questions: 28,
      description: 'Advanced Node.js assessment covering APIs, middleware, authentication, and performance.',
      skills: ['REST APIs', 'Middleware', 'Authentication', 'Performance'],
      icon: '🟢',
      color: 'green',
      popularity: 78
    },
    {
      id: 'css',
      title: 'CSS & Responsive Design',
      category: 'Frontend',
      difficulty: 'Beginner',
      duration: 25,
      questions: 20,
      description: 'Assess your CSS skills including Flexbox, Grid, animations, and responsive design.',
      skills: ['Layout Systems', 'Responsive Design', 'Animations', 'Preprocessors'],
      icon: '🎨',
      color: 'pink',
      popularity: 82
    }
  ];

  // Mock completed assessments
  const mockCompletedAssessments = [
    {
      id: 'javascript',
      title: 'JavaScript Fundamentals',
      score: 87,
      completedAt: '2024-01-15',
      timeSpent: 28,
      rank: 'Top 15%'
    },
    {
      id: 'css',
      title: 'CSS & Responsive Design',
      score: 94,
      completedAt: '2024-01-10',
      timeSpent: 22,
      rank: 'Top 5%'
    }
  ];

  // Mock questions for assessment
  const mockQuestions = [
    {
      id: 1,
      type: 'multiple_choice',
      question: 'What is the correct way to declare a constant in JavaScript?',
      options: [
        'var constant = 5;',
        'let constant = 5;',
        'const constant = 5;',
        'constant = 5;'
      ],
      correct: 2,
      explanation: 'The const keyword is used to declare constants in JavaScript that cannot be reassigned.'
    },
    {
      id: 2,
      type: 'multiple_choice',
      question: 'Which method is used to add an element to the end of an array?',
      options: [
        'array.add()',
        'array.append()',
        'array.push()',
        'array.insert()'
      ],
      correct: 2,
      explanation: 'The push() method adds one or more elements to the end of an array and returns the new length.'
    },
    {
      id: 3,
      type: 'code',
      question: 'Complete the function to return the sum of all numbers in an array:',
      code: `function sumArray(numbers) {
  // Your code here
  
}`,
      solution: `function sumArray(numbers) {
  return numbers.reduce((sum, num) => sum + num, 0);
}`,
      explanation: 'Using reduce() is an efficient way to sum all elements in an array.'
    }
  ];

  // Timer effect
  useEffect(() => {
    let interval;
    if (isAssessmentActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            finishAssessment();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isAssessmentActive, timeRemaining]);

  const startAssessment = (assessment) => {
    setSelectedAssessment(assessment);
    setCurrentQuestion(0);
    setAnswers({});
    setTimeRemaining(assessment.duration * 60); // Convert to seconds
    setIsAssessmentActive(true);
    setActiveTab('taking');
    toast.success(`Started ${assessment.title} assessment!`);
  };

  const answerQuestion = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < mockQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      finishAssessment();
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const finishAssessment = async () => {
    setIsAssessmentActive(false);
    setLoading(true);

    try {
      // Simulate assessment grading
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Calculate mock score
      const correctAnswers = Object.values(answers).filter((answer, index) => {
        return mockQuestions[index] && answer === mockQuestions[index].correct;
      }).length;
      
      const score = Math.round((correctAnswers / mockQuestions.length) * 100);
      
      const result = {
        id: selectedAssessment.id,
        title: selectedAssessment.title,
        score,
        completedAt: new Date().toISOString().split('T')[0],
        timeSpent: selectedAssessment.duration - Math.floor(timeRemaining / 60),
        rank: score >= 90 ? 'Top 5%' : score >= 80 ? 'Top 15%' : score >= 70 ? 'Top 25%' : 'Top 50%'
      };

      setCompletedAssessments(prev => [...prev, result]);
      setActiveTab('results');
      toast.success(`Assessment completed! Score: ${score}%`);
    } catch (error) {
      toast.error('Error processing assessment results');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200';
      case 'Advanced': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'assessments', label: 'Available Tests', icon: Brain },
    { id: 'history', label: 'My Results', icon: Award },
    { id: 'taking', label: 'Assessment', icon: Clock, disabled: !isAssessmentActive },
    { id: 'results', label: 'Results', icon: Trophy, disabled: true }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Skill Assessment Center
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Test your skills and showcase your expertise to potential employers
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
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="card-elevated p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Brain className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {availableAssessments.length}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Available Tests
                  </p>
                </div>

                <div className="card-elevated p-6 text-center">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {mockCompletedAssessments.length}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Completed
                  </p>
                </div>

                <div className="card-elevated p-6 text-center">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Star className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {mockCompletedAssessments.length > 0 
                      ? Math.round(mockCompletedAssessments.reduce((sum, a) => sum + a.score, 0) / mockCompletedAssessments.length)
                      : 0
                    }%
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Avg. Score
                  </p>
                </div>

                <div className="card-elevated p-6 text-center">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Trophy className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {mockCompletedAssessments.filter(a => a.score >= 90).length}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Top Scores
                  </p>
                </div>
              </div>

              {/* Popular Assessments */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  🔥 Popular Assessments
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {availableAssessments
                    .sort((a, b) => b.popularity - a.popularity)
                    .slice(0, 3)
                    .map((assessment) => (
                      <div key={assessment.id} className="card-elevated p-6 hover:shadow-lg transition-all duration-200 group">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-2xl">{assessment.icon}</span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(assessment.difficulty)}`}>
                            {assessment.difficulty}
                          </span>
                        </div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                          {assessment.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                          {assessment.description.substring(0, 100)}...
                        </p>
                        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                          <span>⏱️ {assessment.duration} min</span>
                          <span>📝 {assessment.questions} questions</span>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedAssessment(assessment);
                            setActiveTab('assessments');
                          }}
                          className="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors group-hover:bg-blue-700"
                        >
                          <Play className="mr-2 h-4 w-4" />
                          Start Test
                        </button>
                      </div>
                    ))}
                </div>
              </div>

              {/* Recent Activity */}
              {mockCompletedAssessments.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    📈 Recent Activity
                  </h3>
                  <div className="space-y-3">
                    {mockCompletedAssessments.slice(0, 3).map((assessment, index) => (
                      <div key={index} className="card-elevated p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            assessment.score >= 90 ? 'bg-green-100 dark:bg-green-900/20' :
                            assessment.score >= 80 ? 'bg-blue-100 dark:bg-blue-900/20' :
                            assessment.score >= 70 ? 'bg-yellow-100 dark:bg-yellow-900/20' :
                            'bg-red-100 dark:bg-red-900/20'
                          }`}>
                            <Award className={`h-5 w-5 ${getScoreColor(assessment.score)}`} />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {assessment.title}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Completed on {new Date(assessment.completedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-lg font-bold ${getScoreColor(assessment.score)}`}>
                            {assessment.score}%
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {assessment.rank}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Assessments Tab */}
          {activeTab === 'assessments' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Available Skill Assessments
                </h3>
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <Users className="h-4 w-4" />
                  <span>{availableAssessments.length} assessments available</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {availableAssessments.map((assessment) => (
                  <div key={assessment.id} className="card-elevated p-6 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-3xl">{assessment.icon}</span>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {assessment.title}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {assessment.category}
                          </p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(assessment.difficulty)}`}>
                        {assessment.difficulty}
                      </span>
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                      {assessment.description}
                    </p>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{assessment.duration} minutes</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Questions:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{assessment.questions}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Popularity:</span>
                        <div className="flex items-center space-x-1">
                          <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                            <div 
                              className="bg-blue-500 h-1.5 rounded-full" 
                              style={{ width: `${assessment.popularity}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500">{assessment.popularity}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Skills covered:</p>
                      <div className="flex flex-wrap gap-2">
                        {assessment.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs rounded"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => startAssessment(assessment)}
                      className="w-full inline-flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors btn-hover-lift"
                    >
                      <Play className="mr-2 h-5 w-5" />
                      Start Assessment
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Assessment Taking Tab */}
          {activeTab === 'taking' && selectedAssessment && (
            <div className="space-y-6">
              {/* Header with timer */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {selectedAssessment.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Question {currentQuestion + 1} of {mockQuestions.length}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
                    timeRemaining < 300 ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300' :
                    timeRemaining < 600 ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300' :
                    'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                  }`}>
                    <Clock className="h-4 w-4" />
                    <span className="font-mono font-medium">
                      {formatTime(timeRemaining)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / mockQuestions.length) * 100}%` }}
                />
              </div>

              {/* Question */}
              {mockQuestions[currentQuestion] && (
                <div className="card-elevated p-6">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    {mockQuestions[currentQuestion].question}
                  </h4>

                  {mockQuestions[currentQuestion].type === 'multiple_choice' && (
                    <div className="space-y-3">
                      {mockQuestions[currentQuestion].options.map((option, index) => (
                        <label
                          key={index}
                          className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                            answers[mockQuestions[currentQuestion].id] === index
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-slate-700'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`question-${mockQuestions[currentQuestion].id}`}
                            value={index}
                            checked={answers[mockQuestions[currentQuestion].id] === index}
                            onChange={() => answerQuestion(mockQuestions[currentQuestion].id, index)}
                            className="sr-only"
                          />
                          <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                            answers[mockQuestions[currentQuestion].id] === index
                              ? 'border-blue-500 bg-blue-500'
                              : 'border-gray-300 dark:border-gray-600'
                          }`}>
                            {answers[mockQuestions[currentQuestion].id] === index && (
                              <div className="w-2 h-2 rounded-full bg-white" />
                            )}
                          </div>
                          <span className="text-gray-900 dark:text-white">{option}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {mockQuestions[currentQuestion].type === 'code' && (
                    <div className="space-y-4">
                      <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm">
                        <pre className="text-gray-300">{mockQuestions[currentQuestion].code}</pre>
                      </div>
                      <textarea
                        className="w-full h-32 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Write your solution here..."
                        value={answers[mockQuestions[currentQuestion].id] || ''}
                        onChange={(e) => answerQuestion(mockQuestions[currentQuestion].id, e.target.value)}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <button
                  onClick={previousQuestion}
                  disabled={currentQuestion === 0}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>

                <div className="flex space-x-3">
                  <button
                    onClick={finishAssessment}
                    className="inline-flex items-center px-4 py-2 border border-red-300 text-red-700 dark:text-red-300 bg-white dark:bg-slate-700 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    Finish Early
                  </button>
                  
                  {currentQuestion === mockQuestions.length - 1 ? (
                    <button
                      onClick={finishAssessment}
                      className="inline-flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors btn-hover-lift"
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Submit Assessment
                    </button>
                  ) : (
                    <button
                      onClick={nextQuestion}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Next
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Assessment History
                </h3>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {mockCompletedAssessments.length} assessments completed
                </div>
              </div>

              {mockCompletedAssessments.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No assessments completed yet
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Start your first skill assessment to track your progress
                  </p>
                  <button
                    onClick={() => setActiveTab('assessments')}
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors btn-hover-lift"
                  >
                    <Brain className="mr-2 h-5 w-5" />
                    Browse Assessments
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {mockCompletedAssessments.map((assessment, index) => (
                    <div key={index} className="card-elevated p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            assessment.score >= 90 ? 'bg-green-100 dark:bg-green-900/20' :
                            assessment.score >= 80 ? 'bg-blue-100 dark:bg-blue-900/20' :
                            assessment.score >= 70 ? 'bg-yellow-100 dark:bg-yellow-900/20' :
                            'bg-red-100 dark:bg-red-900/20'
                          }`}>
                            <Trophy className={`h-6 w-6 ${getScoreColor(assessment.score)}`} />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {assessment.title}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Completed on {new Date(assessment.completedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-2xl font-bold ${getScoreColor(assessment.score)}`}>
                            {assessment.score}%
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {assessment.rank}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="text-center p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {assessment.timeSpent} min
                          </div>
                          <div className="text-gray-600 dark:text-gray-400">Time Spent</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {assessment.rank}
                          </div>
                          <div className="text-gray-600 dark:text-gray-400">Ranking</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
                          <div className={`font-semibold ${getScoreColor(assessment.score)}`}>
                            {assessment.score >= 90 ? 'Excellent' :
                             assessment.score >= 80 ? 'Good' :
                             assessment.score >= 70 ? 'Fair' : 'Needs Work'}
                          </div>
                          <div className="text-gray-600 dark:text-gray-400">Performance</div>
                        </div>
                      </div>

                      <div className="mt-4 flex space-x-3">
                        <button
                          onClick={() => toast.info('Detailed results coming soon!')}
                          className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
                        >
                          <BarChart3 className="mr-2 h-4 w-4" />
                          View Details
                        </button>
                        <button
                          onClick={() => {
                            const originalAssessment = availableAssessments.find(a => a.id === assessment.id);
                            if (originalAssessment) {
                              startAssessment(originalAssessment);
                            }
                          }}
                          className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Retake
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Results Tab */}
          {activeTab === 'results' && completedAssessments.length > 0 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Assessment Complete!
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Great job! Here are your results
                </p>
              </div>

              {/* Latest Result */}
              {completedAssessments.length > 0 && (
                <div className="card-elevated p-8 text-center">
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {completedAssessments[completedAssessments.length - 1].title}
                  </h4>
                  
                  <div className="flex items-center justify-center space-x-8 my-6">
                    <div className="text-center">
                      <div className={`text-4xl font-bold ${getScoreColor(completedAssessments[completedAssessments.length - 1].score)}`}>
                        {completedAssessments[completedAssessments.length - 1].score}%
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Your Score</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {completedAssessments[completedAssessments.length - 1].rank}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Ranking</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {completedAssessments[completedAssessments.length - 1].timeSpent} min
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Time Taken</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className={`p-4 rounded-lg ${
                      completedAssessments[completedAssessments.length - 1].score >= 90 
                        ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                        : completedAssessments[completedAssessments.length - 1].score >= 80
                        ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                        : completedAssessments[completedAssessments.length - 1].score >= 70
                        ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800'
                        : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                    }`}>
                      <p className={`font-medium ${
                        completedAssessments[completedAssessments.length - 1].score >= 90 ? 'text-green-800 dark:text-green-200' :
                        completedAssessments[completedAssessments.length - 1].score >= 80 ? 'text-blue-800 dark:text-blue-200' :
                        completedAssessments[completedAssessments.length - 1].score >= 70 ? 'text-yellow-800 dark:text-yellow-200' :
                        'text-red-800 dark:text-red-200'
                      }`}>
                        {completedAssessments[completedAssessments.length - 1].score >= 90 
                          ? '🎉 Outstanding performance! You demonstrate excellent mastery of this skill.'
                          : completedAssessments[completedAssessments.length - 1].score >= 80
                          ? '👏 Great job! You have a solid understanding with room for minor improvements.'
                          : completedAssessments[completedAssessments.length - 1].score >= 70
                          ? '💪 Good effort! Consider reviewing key concepts to strengthen your skills.'
                          : '📚 Keep learning! Focus on fundamental concepts and practice regularly.'
                        }
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex space-x-4 justify-center">
                    <button
                      onClick={() => setActiveTab('history')}
                      className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
                    >
                      <BarChart3 className="mr-2 h-5 w-5" />
                      View History
                    </button>
                    <button
                      onClick={() => setActiveTab('assessments')}
                      className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors btn-hover-lift"
                    >
                      <Brain className="mr-2 h-5 w-5" />
                      Take Another
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SkillAssessment;