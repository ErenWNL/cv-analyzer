import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, RotateCcw, Flag } from 'lucide-react';

const QuizInterface = ({ 
  quiz, 
  onComplete, 
  onAnswer, 
  autoAdvance = false,
  showExplanations = false 
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flaggedQuestions, setFlaggedQuestions] = useState(new Set());
  const [showExplanation, setShowExplanation] = useState(false);
  const [timePerQuestion, setTimePerQuestion] = useState(null);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  useEffect(() => {
    if (quiz.timePerQuestion) {
      setTimePerQuestion(quiz.timePerQuestion);
    }
  }, [quiz.timePerQuestion]);

  useEffect(() => {
    if (autoAdvance && answers[currentQuestion?.id] && !showExplanation) {
      const timer = setTimeout(() => {
        handleNext();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [answers, currentQuestion?.id, autoAdvance, showExplanation]);

  const handleAnswer = (questionId, answer) => {
    const newAnswers = { ...answers, [questionId]: answer };
    setAnswers(newAnswers);
    onAnswer(questionId, answer);

    if (showExplanations && currentQuestion.explanation) {
      setShowExplanation(true);
    }
  };

  const handleNext = () => {
    setShowExplanation(false);
    if (isLastQuestion) {
      onComplete(answers);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setShowExplanation(false);
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleFlag = () => {
    const newFlagged = new Set(flaggedQuestions);
    if (newFlagged.has(currentQuestionIndex)) {
      newFlagged.delete(currentQuestionIndex);
    } else {
      newFlagged.add(currentQuestionIndex);
    }
    setFlaggedQuestions(newFlagged);
  };

  const goToQuestion = (index) => {
    setCurrentQuestionIndex(index);
    setShowExplanation(false);
  };

  return (
    <div className="space-y-6">
      {/* Progress and Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-1">
            <span>Question {currentQuestionIndex + 1} of {quiz.questions.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
        </div>
      </div>

      {/* Question Navigation Grid */}
      <div className="grid grid-cols-10 gap-2 p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
        {quiz.questions.map((_, index) => (
          <button
            key={index}
            onClick={() => goToQuestion(index)}
            className={`w-8 h-8 rounded text-xs font-medium transition-all ${
              index === currentQuestionIndex
                ? 'bg-blue-600 text-white'
                : answers[quiz.questions[index].id]
                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200'
                : flaggedQuestions.has(index)
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200'
                : 'bg-white dark:bg-slate-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-600'
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* Question Content */}
      <SkillTest
        test={{ ...quiz, questions: [currentQuestion] }}
        onAnswer={handleAnswer}
        currentQuestion={0}
        answers={answers}
        timeRemaining={timePerQuestion}
      />

      {/* Explanation */}
      {showExplanation && currentQuestion.explanation && (
        <div className="card-elevated p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
            💡 Explanation
          </h4>
          <p className="text-blue-700 dark:text-blue-300">
            {currentQuestion.explanation}
          </p>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Previous
          </button>

          <button
            onClick={handleFlag}
            className={`inline-flex items-center px-4 py-2 border rounded-lg transition-colors ${
              flaggedQuestions.has(currentQuestionIndex)
                ? 'border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300'
                : 'border-gray-300 text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600'
            }`}
          >
            <Flag className="mr-2 h-4 w-4" />
            {flaggedQuestions.has(currentQuestionIndex) ? 'Unflag' : 'Flag'}
          </button>
        </div>

        <div className="flex items-center space-x-3">
          {showExplanation && (
            <button
              onClick={() => setShowExplanation(false)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
            >
              Continue
            </button>
          )}

          <button
            onClick={handleNext}
            disabled={!answers[currentQuestion?.id] && !showExplanation}
            className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors btn-hover-lift"
          >
            {isLastQuestion ? (
              <>
                <Play className="mr-2 h-4 w-4" />
                Finish Quiz
              </>
            ) : (
              <>
                Next
                <SkipForward className="ml-2 h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-600 rounded"></div>
          <span>Current</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-100 dark:bg-green-900/20 border border-green-300 dark:border-green-700 rounded"></div>
          <span>Answered</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded"></div>
          <span>Flagged</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-white dark:bg-slate-700 border border-gray-300 dark:border-gray-600 rounded"></div>
          <span>Unanswered</span>
        </div>
      </div>
    </div>
  );
};

export { QuizInterface };
