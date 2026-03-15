// API helper utilities for timeouts, fallbacks, and error handling.

/**
 * Wrap a promise with a timeout.
 */
export function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number = 800,
  fallback?: T
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((resolve, reject) =>
      setTimeout(() => {
        if (fallback !== undefined) {
          resolve(fallback);
        } else {
          reject(new Error(`Request timeout after ${timeoutMs}ms`));
        }
      }, timeoutMs)
    ),
  ]).catch((error) => {
    if (fallback !== undefined) {
      console.warn('[API] Request failed, using fallback:', error);
      return Promise.resolve(fallback);
    }
    throw error;
  });
}

/**
 * Safe API call wrapper.
 * - Applies a timeout automatically (800ms by default)
 * - Returns fallback data on failure
 * - Logs errors for debugging
 */
export async function safeApiCall<T>(
  apiCall: () => Promise<T>,
  fallback: T,
  timeoutMs: number = 800
): Promise<T> {
  try {
    const result = await withTimeout(apiCall(), timeoutMs, fallback);
    return result;
  } catch (error) {
    console.error('[API] Safe call failed:', error);
    return fallback;
  }
}
