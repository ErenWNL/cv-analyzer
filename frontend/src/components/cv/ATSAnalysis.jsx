import React from 'react';
import { Target, CheckCircle, AlertTriangle, X, Info } from 'lucide-react';

const ATSAnalysis = ({ atsData }) => {
  if (!atsData) return null;

  const {
    overallCompatibility = 0,
    formatScore = 0,
    keywordScore = 0,
    structureScore = 0,
    recommendations = [],
    passedChecks = [],
    failedChecks = []
  } = atsData;

  const getCompatibilityLevel = (score) => {
    if (score >= 90) return { level: 'Excellent', color: 'green', message: 'Your CV is highly ATS-friendly' };
    if (score >= 80) return { level: 'Good', color: 'blue', message: 'Your CV should pass most ATS systems' };
    if (score >= 70) return { level: 'Fair', color: 'yellow', message: 'Some improvements needed for better ATS compatibility' };
    return { level: 'Poor', color: 'red', message: 'Significant improvements needed for ATS compatibility' };
  };

  const compatibility = getCompatibilityLevel(overallCompatibility);

  return (
    <div className="space-y-6">
      {/* Overall ATS Score */}
      <div className="card-elevated p-6 text-center">
        <Target className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          ATS Compatibility: {overallCompatibility}%
        </h3>
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-${compatibility.color}-100 text-${compatibility.color}-800 dark:bg-${compatibility.color}-900/20 dark:text-${compatibility.color}-200`}>
          {compatibility.level}
        </div>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          {compatibility.message}
        </p>
      </div>

      {/* Detailed Scores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-elevated p-6">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Format Score</h4>
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{formatScore}%</span>
            <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${formatScore}%` }}
              />
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Font, spacing, and layout compatibility
          </p>
        </div>

        <div className="card-elevated p-6">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Keyword Score</h4>
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{keywordScore}%</span>
            <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${keywordScore}%` }}
              />
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Relevant keywords and phrases
          </p>
        </div>

        <div className="card-elevated p-6">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Structure Score</h4>
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{structureScore}%</span>
            <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${structureScore}%` }}
              />
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Section organization and headers
          </p>
        </div>
      </div>

      {/* Checks and Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Passed Checks */}
        {passedChecks.length > 0 && (
          <div className="card-elevated p-6">
            <h4 className="flex items-center text-lg font-semibold text-gray-900 dark:text-white mb-4">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              Passed Checks
            </h4>
            <ul className="space-y-2">
              {passedChecks.map((check, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">{check}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Failed Checks */}
        {failedChecks.length > 0 && (
          <div className="card-elevated p-6">
            <h4 className="flex items-center text-lg font-semibold text-gray-900 dark:text-white mb-4">
              <X className="h-5 w-5 text-red-600 mr-2" />
              Issues Found
            </h4>
            <ul className="space-y-2">
              {failedChecks.map((check, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <X className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">{check}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="card-elevated p-6">
          <h4 className="flex items-center text-lg font-semibold text-gray-900 dark:text-white mb-4">
            <Info className="h-5 w-5 text-blue-600 mr-2" />
            ATS Optimization Recommendations
          </h4>
          <ul className="space-y-3">
            {recommendations.map((recommendation, index) => (
              <li key={index} className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                    <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                      {index + 1}
                    </span>
                  </div>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">{recommendation}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export { ATSAnalysis };