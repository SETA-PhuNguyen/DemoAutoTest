/**
 * Generate random email address
 */
export function generateRandomEmail(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `test${timestamp}${random}@bookcart.com`;
}

/**
 * Generate random username
 */
export function generateRandomUsername(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `user${timestamp}${random}`;
}

/**
 * Wait for a specific time (in milliseconds)
 */
export async function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Format price string to number
 */
export function parsePriceToNumber(priceString: string | null): number {
  if (!priceString) return 0;
  const cleanedPrice = priceString.replace(/[^\d.]/g, "");
  return parseFloat(cleanedPrice);
}

/**
 * Get current date in format YYYY-MM-DD
 */
export function getCurrentDate(): string {
  return new Date().toISOString().split("T")[0];
}
