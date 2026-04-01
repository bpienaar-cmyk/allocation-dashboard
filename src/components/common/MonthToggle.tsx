import React from 'react';
import { AVAILABLE_MONTHS, MONTH_LABELS, MonthKey } from '../../data/monthSelector';

interface MonthToggleProps {
  selectedMonth: MonthKey;
  onMonthChange: (month: MonthKey) => void;
}

const MonthToggle: React.FC<MonthToggleProps> = ({ selectedMonth, onMonthChange }) => {
  return (
    <div className="flex items-center gap-1 bg-slate-800 rounded-lg p-1">
      {AVAILABLE_MONTHS.map((month) => (
        <button
          key={month}
          onClick={() => onMonthChange(month)}
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
            selectedMonth === month
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'
          }`}
        >
          {MONTH_LABELS[month]}
        </button>
      ))}
    </div>
  );
};

export default MonthToggle;
