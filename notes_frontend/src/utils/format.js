//
// Utilities for formatting and helpers
//

// PUBLIC_INTERFACE
export function formatDateTime(isoStr) {
  /** Format an ISO datetime string into a readable date */
  if (!isoStr) return "";
  try {
    const d = new Date(isoStr);
    return d.toLocaleString();
  } catch {
    return isoStr;
  }
}

// PUBLIC_INTERFACE
export function debounce(fn, wait = 300) {
  /** Debounce a function call by wait ms */
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}
