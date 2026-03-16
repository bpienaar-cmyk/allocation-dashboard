import React from 'react';

interface ErrorDisplayProps {
  message: string;
  onRetry?: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onRetry }) => {
  return (
    <div className="rounded-xl bg-red-500 bg-opacity-10 border border-red-500 p-6">
      <div className="flex items-start gap-4">
        <div className="text-red-500 text-2xl font-bold mt-1">⚠</div>
        <div className="flex-1">
          <h3 className="text-red-500 font-semibold text-lg mb-2">Error</h3>
          <p className="text-red-200 mb-4">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors"
            >
              Retry
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorDisplay;
