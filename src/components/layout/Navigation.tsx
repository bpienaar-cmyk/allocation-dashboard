import React from 'react';
import { TabId } from '../../types';

interface NavigationProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const TABS: { id: TabId; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'trends', label: 'Trends' },
  { id: 'category', label: 'Bookings' },
  { id: 'reservations', label: 'Reservations' },
  { id: 'spend', label: 'Spend' },
  { id: 'other-spend', label: 'Other Spend' },
  { id: 'cancellations', label: 'Cancellations' },
  { id: 'admin-allocation', label: 'Admin Allocation' },
];

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className="bg-slate-900 px-6">
      <div className="flex gap-1 overflow-x-auto border-b border-slate-700">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-4 py-3 text-sm font-medium transition-all border-b-2 whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-blue-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
