import React from 'react';
import { Link } from 'react-router-dom';

const RecentUploads = ({ uploads, limit = 5 }) => {
  if (!uploads || uploads.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Uploads</h3>
        <p className="text-gray-500 text-center py-4">No uploads yet. Start by uploading your first CV!</p>
      </div>
    );
  }

  const recentUploads = uploads.slice(0, limit);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Uploads</h3>
        <Link
          to="/upload"
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          View All
        </Link>
      </div>
      
      <div className="space-y-3">
        {recentUploads.map((upload) => (
          <div key={upload.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {upload.filename || 'Untitled CV'}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(upload.uploadDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {upload.status === 'completed' && upload.score && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {upload.score}/100
                </span>
              )}
              {upload.status === 'processing' && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Processing
                </span>
              )}
              {upload.status === 'pending' && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  Pending
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentUploads;
