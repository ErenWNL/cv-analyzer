import React from 'react';
import { Link } from 'react-router-dom';

const CVList = ({ cvs, onDelete, onView }) => {
  if (!cvs || cvs.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No CVs found. Upload your first CV to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {cvs.map((cv) => (
        <div key={cv.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {cv.filename || 'Untitled CV'}
              </h3>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>Uploaded: {new Date(cv.uploadDate).toLocaleDateString()}</span>
                {cv.analysisDate && (
                  <span>Analyzed: {new Date(cv.analysisDate).toLocaleDateString()}</span>
                )}
                <span>Status: {cv.status || 'Pending'}</span>
              </div>
              {cv.score && (
                <div className="mt-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Score: {cv.score}/100
                  </span>
                </div>
              )}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => onView(cv)}
                className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                View
              </button>
              <button
                onClick={() => onDelete(cv.id)}
                className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CVList;
