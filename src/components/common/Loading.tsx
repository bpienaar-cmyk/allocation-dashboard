import React from 'react';

const Loading: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900">
      <div className="text-center">
        <div className="mb-6">
          <div className="inline-block">
            <div className="w-12 h-12 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        </div>
        <p className="text-slate-300 text-lg font-medium">Loading dashboard data...</p>
      </div>
    </div>
  );
};

export default Loading;
