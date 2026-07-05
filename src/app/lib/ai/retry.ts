interface RetryOptions {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  shouldRetry?: (error: any) => boolean;
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const maxRetries = options.maxRetries ?? 3;
  let initialDelay = options.initialDelay ?? 1000;
  const maxDelay = options.maxDelay ?? 5000;
  const shouldRetry = options.shouldRetry ?? (() => true);

  let attempt = 0;

  while (true) {
    try {
      return await fn();
    } catch (error: any) {
      attempt++;
      if (attempt > maxRetries || !shouldRetry(error)) {
        throw error;
      }

      console.warn(`AI request attempt ${attempt} failed. Retrying in ${initialDelay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, initialDelay));
      initialDelay = Math.min(initialDelay * 2, maxDelay);
    }
  }
}
