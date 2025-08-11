import React from 'react';
import { Trophy, Target, Clock, Star, TrendingUp, Award, CheckCircle, X } from 'lucide-react';

const ResultsView = ({ 
  assessment, 
  results, 
  onRetake, 
  onViewDetails, 
  onContinue 
}) => {
  const {
    score,
    totalQuestions,
    correctAnswers,
    timeSpent,
    rank,
    percentile,
    categoryScores = {},
    strengths = [],
    improvements = [],
    detailedResults = []
  } = results;

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score) => {
    if (score >= 90) return 'from-green-500 to-green-600';
    if (score >= 80) return 'from-blue-500 to-blue-600';
    if (score >= 70) return 'from-yellow-500 to-yellow-600';
    return 'from-red-500 to-red-600';
  };

  const getPerformanceLabel = (score) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Good';
    if (score >= 70) return 'Fair';
    return 'Needs Improvement';
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className={`w-24 h-24 bg-gradient-to-r ${getScoreBgColor(score)} rounded-full flex items-center justify-center mx-auto mb-4`}>
          <Trophy className="h-12 w-12 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Assessment Complete!
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {assessment.title}
        </p>
      </div>

      {/* Main Score */}
      <div className="card-elevated p-8 text-center">
        <div className={`text-6xl font-bold ${getScoreColor(score)} mb-2`}>
          {score}%
        </div>
        <div className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          {getPerformanceLabel(score)}
        </div>
        <div className="grid grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {correctAnswers}/{totalQuestions}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Correct Answers</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatTime(timeSpent)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Time Spent</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {rank || `Top ${percentile}%`}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Ranking</div>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      {Object.keys(categoryScores).length > 0 && (
        <div className="card-elevated p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Category Breakdown
          </h3>
          <div className="space-y-4">
            {Object.entries(categoryScores).map(([category, categoryScore]) => (
              <div key={category} className="flex items-center justify-between">
                <span className="font-medium text-gray-900 dark:text-white capitalize">
                  {category.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        categoryScore >= 90 ? 'bg-green-500' :
                        categoryScore >= 80 ? 'bg-blue-500' :
                        categoryScore >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${categoryScore}%` }}
                    />
                  </div>
                  <span className={`font-semibold min-w-[3rem] text-right ${getScoreColor(categoryScore)}`}>
                    {categoryScore}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Strengths and Improvements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Strengths */}
        {strengths.length > 0 && (
          <div className="card-elevated p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Star className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Strengths
              </h3>
            </div>
            <ul className="space-y-3">
              {strengths.map((strength, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {strength}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Areas for Improvement */}
        {improvements.length > 0 && (
          <div className="card-elevated p-6">
            <div className="flex items-center space-x-2 mb-4">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Areas for Improvement
              </h3>
            </div>
            <ul className="space-y-3">
              {improvements.map((improvement, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <Target className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {improvement}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Detailed Question Results */}
      {detailedResults.length > 0 && (
        <div className="card-elevated p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Question-by-Question Results
          </h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {detailedResults.map((result, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    result.correct ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'
                  }`}>
                    {result.correct ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <X className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Question {index + 1}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {result.category || 'General'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-medium ${
                    result.correct ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {result.correct ? 'Correct' : 'Incorrect'}
                  </div>
                  {result.timeSpent && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {result.timeSpent}s
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        {onViewDetails && (
          <button
            onClick={onViewDetails}
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
          >
            <Target className="mr-2 h-5 w-5" />
            View Detailed Analysis
          </button>
        )}
        
        {onRetake && (
          <button
            onClick={onRetake}
            className="inline-flex items-center justify-center px-6 py-3 border border-blue-300 text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
          >
            <Clock className="mr-2 h-5 w-5" />
            Retake Assessment
          </button>
        )}
        
        {onContinue && (
          <button
            onClick={onContinue}
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors btn-hover-lift"
          >
            <Award className="mr-2 h-5 w-5" />
            Continue Learning
          </button>
        )}
      </div>

      {/* Motivational Message */}
      <div className={`card-elevated p-6 text-center ${
        score >= 90 ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' :
        score >= 80 ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800' :
        score >= 70 ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800' :
        'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
      }`}>
        <p className={`font-medium ${
          score >= 90 ? 'text-green-800 dark:text-green-200' :
          score >= 80 ? 'text-blue-800 dark:text-blue-200' :
          score >= 70 ? 'text-yellow-800 dark:text-yellow-200' :
          'text-red-800 dark:text-red-200'
        }`}>
          {score >= 90 
            ? '🎉 Outstanding performance! You demonstrate excellent mastery of this skill area.'
            : score >= 80
            ? '👏 Great job! You have a solid understanding with room for minor improvements.'
            : score >= 70
            ? '💪 Good effort! Consider reviewing key concepts to strengthen your skills.'
            : '📚 Keep learning! Focus on fundamental concepts and practice regularly.'
          }
        </p>
      </div>
    </div>
  );
};

export { ResultsView };