import React from 'react';
import { DATA_LAST_UPDATED } from '../../data/dashboardData';

interface HeaderProps {
  lastUpdated?: Date;
}

const Header: React.FC<HeaderProps> = ({ lastUpdated }) => {
  const formatTimestamp = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <header className="border-b border-slate-700 bg-slate-900 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-white">
            <span className="text-blue-500">AnyVan</span>
          </h1>
          <span className="text-lg text-slate-300">Allocation Dashboard</span>
        </div>
        <div className="text-sm text-slate-400">
          Last updated: {formatTimestamp(DATA_LAST_UPDATED)}
        </div>
      </div>
    </header>
  );
};

export default Header;
