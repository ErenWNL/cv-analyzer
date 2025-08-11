import React from 'react';
import { Star, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

const CVScore = ({ score, title = "CV Score", size = "large", showDetails = true }) => {
  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreGradient = (score) => {
    if (score >= 90) return 'from-green-500 to-green-600';
    if (score >= 80) return 'from-blue-500 to-blue-600';
    if (score >= 70) return 'from-yellow-500 to-yellow-600';
    return 'from-red-500 to-red-600';
  };

  const getScoreIcon = (score) => {
    if (score >= 90) return <CheckCircle className="h-6 w-6 text-green-600" />;
    if (score >= 80) return <Star className="h-6 w-6 text-blue-600" />;
    if (score >= 70) return <TrendingUp className="h-6 w-6 text-yellow-600" />;
    return <AlertTriangle className="h-6 w-6 text-red-600" />;
  };

  const getScoreLabel = (score) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Good';
    if (score >= 70) return 'Fair';
    return 'Needs Improvement';
  };

  const sizeClasses = {
    small: 'w-16 h-16 text-lg',
    medium: 'w-24 h-24 text-2xl',
    large: 'w-32 h-32 text-3xl'
  };

  return (
    <div className="text-center">
      <div className={`inline-flex items-center justify-center rounded-full bg-gradient-to-r ${getScoreGradient(score)} text-white mb-4 ${sizeClasses[size]}`}>
        <div className="text-center">
          <div className="font-bold">{score}</div>
          {size === 'large' && <div className="text-sm opacity-90">/ 100</div>}
        </div>
      </div>
      
      {showDetails && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          <div className="flex items-center justify-center space-x-2 mt-2">
            {getScoreIcon(score)}
            <span className={`font-medium ${getScoreColor(score)}`}>
              {getScoreLabel(score)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export { CVScore };