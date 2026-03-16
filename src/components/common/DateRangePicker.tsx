import React, { useState } from 'react';
import { DateRange } from '../../types';
import { getPresetRange } from '../../utils/dateHelpers';

interface DateRangePickerProps {
  dateRange: DateRange;
  onChange: (range: DateRange) => void;
}

type PresetType = '7d' | '30d' | '90d' | 'ytd' | '12m';

const PRESETS: { id: PresetType; label: string }[] = [
  { id: '7d', label: '7d' },
  { id: '30d', label: '30d' },
  { id: '90d', label: '90d' },
  { id: 'ytd', label: 'YTD' },
  { id: '12m', label: '12m' },
];

const DateRangePicker: React.FC<DateRangePickerProps> = ({ dateRange, onChange }) => {
  const [activePreset, setActivePreset] = useState<PresetType | null>(null);
  const [showCustom, setShowCustom] = useState(false);

  const handlePresetClick = (preset: PresetType) => {
    const range = getPresetRange(preset);
    onChange(range);
    setActivePreset(preset);
  };

  const handleCustomStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRange = {
      ...dateRange,
      startDate: e.target.value,
    };
    onChange(newRange);
    setActivePreset(null);
  };

  const handleCustomEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRange = {
      ...dateRange,
      endDate: e.target.value,
    };
    onChange(newRange);
    setActivePreset(null);
  };

  const formatDateForInput = (dateStr: string): string => {
    return dateStr;
  };

  return (
    <div className="flex items-center gap-4 rounded-xl bg-slate-800 p-4 border border-slate-700">
      <div className="flex gap-2">
        {PRESETS.map((preset) => (
          <button
            key={preset.id}
            onClick={() => handlePresetClick(preset.id as PresetType)}
            className={`px-3 py-2 rounded-lg font-medium text-sm transition-colors ${
              activePreset === preset.id
                ? 'bg-blue-500 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      <div className="border-l border-slate-600 pl-4">
        <button
          onClick={() => setShowCustom(!showCustom)}
          className="px-3 py-2 rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600 font-medium text-sm transition-colors"
        >
          {showCustom ? 'Hide' : 'Custom'}
        </button>
      </div>

      {showCustom && (
        <div className="flex gap-2 border-l border-slate-600 pl-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-slate-400">Start</label>
            <input
              type="date"
              value={formatDateForInput(dateRange.startDate)}
              onChange={handleCustomStartChange}
              className="px-3 py-1 bg-slate-700 text-white border border-slate-600 rounded-lg text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-slate-400">End</label>
            <input
              type="date"
              value={formatDateForInput(dateRange.endDate)}
              onChange={handleCustomEndChange}
              className="px-3 py-1 bg-slate-700 text-white border border-slate-600 rounded-lg text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;
