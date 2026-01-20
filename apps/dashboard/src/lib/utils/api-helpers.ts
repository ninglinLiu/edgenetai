// API 调用工具函数：超时、fallback、错误处理

/**
 * 带超时的 Promise 包装器
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
 * 安全的 API 调用包装器
 * - 自动超时（默认 800ms）
 * - 失败时返回 fallback 数据
 * - 记录错误日志
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
