
/**
 * Formats a date object to MM/dd/yyyy format
 */
export function formatDate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  
  return `${month}/${day}/${year}`;
}

/**
 * Creates a default video title with the current date
 */
export function createDefaultTitle(): string {
  const today = new Date();
  return `English speaking training with Sesame Voice AI - ${formatDate(today)}`;
}
