/**
 * Format a number as GBP currency
 * Examples: £1.23M, £45.6k, £123.45
 */
export function fmtGBP(n: number | null): string {
  if (n === null || n === undefined || !isFinite(n)) {
    return '£0';
  }

  const absValue = Math.abs(n);

  if (absValue >= 1_000_000) {
    const millions = n / 1_000_000;
    return `£${millions.toFixed(2)}M`;
  }

  if (absValue >= 1_000) {
    const thousands = n / 1_000;
    return `£${thousands.toFixed(1)}k`;
  }

  return `£${n.toFixed(2)}`;
}

/**
 * Format a number with comma separators
 * Examples: 1,234, 1,234,567
 */
export function fmtN(n: number | null): string {
  if (n === null || n === undefined || !isFinite(n)) {
    return '0';
  }

  return Math.round(n).toLocaleString('en-GB');
}

/**
 * Format a percentage value
 * Examples: 12.34%, 0.5%, 100%
 */
export function fmtP(n: number | null): string {
  if (n === null || n === undefined || !isFinite(n)) {
    return '0%';
  }

  // If the percentage is very small but non-zero, show at least 0.01%
  if (n !== 0 && Math.abs(n) < 0.01) {
    return `${n > 0 ? '<' : '>'}${Math.abs(n).toFixed(2)}%`;
  }

  return `${n.toFixed(2)}%`;
}

/**
 * Format a date string to month label
 * Examples: "2025-01" -> "Jan 25", "2026-02" -> "Feb 26"
 */
export function fmtMonth(dateStr: string): string {
  try {
    // Handle both "YYYY-MM" and full date formats
    const [year, month] = dateStr.split('-');
    if (!year || !month) {
      return dateStr;
    }

    const monthNum = parseInt(month, 10);
    if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
      return dateStr;
    }

    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const yearShort = year.slice(2); // "2025" -> "25"
    return `${monthNames[monthNum - 1]} ${yearShort}`;
  } catch {
    return dateStr;
  }
}
