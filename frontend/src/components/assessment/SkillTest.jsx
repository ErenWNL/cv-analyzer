import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, AlertTriangle, Code, BookOpen } from 'lucide-react';

const SkillTest = ({ 
  test, 
  onComplete, 
  onAnswer, 
  currentQuestion = 0, 
  answers = {},
  timeRemaining 
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState(answers[test.questions[currentQuestion]?.id] || null);

  useEffect(() => {
    setSelectedAnswer(answers[test.questions[currentQuestion]?.id] || null);
  }, [currentQuestion, answers, test.questions]);

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
    onAnswer(test.questions[currentQuestion].id, answer);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const question = test.questions[currentQuestion];

  if (!question) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {test.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Question {currentQuestion + 1} of {test.questions.length}
          </p>
        </div>
        {timeRemaining !== null && (
          <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
            timeRemaining < 300 ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300' :
            timeRemaining < 600 ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300' :
            'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300'
          }`}>
            <Clock className="h-4 w-4" />
            <span className="font-mono font-medium">{formatTime(timeRemaining)}</span>
          </div>
        )}
      </div>

      {/* Progress */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div 
          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentQuestion + 1) / test.questions.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className="card-elevated p-6">
        <div className="flex items-start space-x-3 mb-4">
          {question.type === 'code' ? (
            <Code className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
          ) : (
            <BookOpen className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
          )}
          <div className="flex-1">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {question.question}
            </h4>
            {question.description && (
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                {question.description}
              </p>
            )}
          </div>
        </div>

        {/* Multiple Choice */}
        {question.type === 'multiple_choice' && (
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <label
                key={index}
                className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedAnswer === index
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={index}
                  checked={selectedAnswer === index}
                  onChange={() => handleAnswerSelect(index)}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                  selectedAnswer === index
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300 dark:border-gray-600'
                }`}>
                  {selectedAnswer === index && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
                <span className="text-gray-900 dark:text-white">{option}</span>
              </label>
            ))}
          </div>
        )}

        {/* True/False */}
        {question.type === 'true_false' && (
          <div className="grid grid-cols-2 gap-4">
            {[true, false].map((value) => (
              <label
                key={value.toString()}
                className={`flex items-center justify-center p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedAnswer === value
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={value.toString()}
                  checked={selectedAnswer === value}
                  onChange={() => handleAnswerSelect(value)}
                  className="sr-only"
                />
                <div className="text-center">
                  <div className={`w-8 h-8 rounded-full border-2 mx-auto mb-2 flex items-center justify-center ${
                    selectedAnswer === value
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}>
                    {selectedAnswer === value && (
                      value ? (
                        <CheckCircle className="w-5 h-5 text-white" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-white" />
                      )
                    )}
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {value ? 'True' : 'False'}
                  </span>
                </div>
              </label>
            ))}
          </div>
        )}

        {/* Code Question */}
        {question.type === 'code' && (
          <div className="space-y-4">
            {question.code && (
              <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                <pre className="text-gray-300">{question.code}</pre>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Your Solution:
              </label>
              <textarea
                className="w-full h-40 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Write your code here..."
                value={selectedAnswer || ''}
                onChange={(e) => handleAnswerSelect(e.target.value)}
              />
            </div>
            {question.hints && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <h5 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">💡 Hints:</h5>
                <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                  {question.hints.map((hint, index) => (
                    <li key={index}>• {hint}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Multiple Select */}
        {question.type === 'multiple_select' && (
          <div className="space-y-3">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Select all that apply:
            </p>
            {question.options.map((option, index) => (
              <label
                key={index}
                className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedAnswer?.includes(index)
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-slate-700'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedAnswer?.includes(index) || false}
                  onChange={(e) => {
                    const currentAnswers = selectedAnswer || [];
                    if (e.target.checked) {
                      handleAnswerSelect([...currentAnswers, index]);
                    } else {
                      handleAnswerSelect(currentAnswers.filter(i => i !== index));
                    }
                  }}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-3"
                />
                <span className="text-gray-900 dark:text-white">{option}</span>
              </label>
            ))}
          </div>
        )}

        {/* Question Difficulty Indicator */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <span className="text-gray-600 dark:text-gray-400">Difficulty:</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                question.difficulty === 'easy' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200' :
                question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200' :
                'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200'
              }`}>
                {question.difficulty?.charAt(0).toUpperCase() + question.difficulty?.slice(1) || 'Medium'}
              </span>
            </div>
            {question.points && (
              <div className="text-gray-600 dark:text-gray-400">
                {question.points} points
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillTest;
