import { DateRange } from '../types/index';

/**
 * Format a Date object to YYYY-MM-DD string
 */
export function formatDateParam(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get the default date range (last 90 days)
 */
export function getDefaultDateRange(): DateRange {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 90);

  return {
    startDate: formatDateParam(startDate),
    endDate: formatDateParam(endDate),
  };
}

/**
 * Get a preset date range
 */
export function getPresetRange(preset: '7d' | '30d' | '90d' | 'ytd' | '12m'): DateRange {
  const endDate = new Date();
  const startDate = new Date();

  switch (preset) {
    case '7d':
      startDate.setDate(startDate.getDate() - 7);
      break;
    case '30d':
      startDate.setDate(startDate.getDate() - 30);
      break;
    case '90d':
      startDate.setDate(startDate.getDate() - 90);
      break;
    case 'ytd':
      startDate.setFullYear(startDate.getFullYear());
      startDate.setMonth(0, 1);
      break;
    case '12m':
      startDate.setFullYear(startDate.getFullYear() - 1);
      break;
    default:
      const _exhaustive: never = preset;
      return _exhaustive;
  }

  return {
    startDate: formatDateParam(startDate),
    endDate: formatDateParam(endDate),
  };
}
