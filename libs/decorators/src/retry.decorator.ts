import { sleep } from '@lib/common';
import { Logger } from '@nestjs/common';

interface PropertyMethodDecorator {
  (_target: Record<string, any>, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor;
}

/**
 * Retryable decorator
 * Usage:
 * @Retryable({
    maxAttempts: 5,
    callback: () => ({ code: ServerErrorCode.NetworkError, success: false, message: 'Network Error' }),
  })
 */
export function Retryable(options: RetryOptions): PropertyMethodDecorator {
  const logger = new Logger('RetryableDecorator');

  function canRetry(e: Error): boolean {
    if (options.doRetry && !options.doRetry(e)) {
      return false;
    }
    return !(options.value?.length && !options.value.some((errorType) => e instanceof errorType));
  }

  async function retryAsync(fn: () => any, args: any[], maxAttempts: number, backOff?: number): Promise<any> {
    try {
      return await fn.apply(this, args);
    } catch (e) {
      if (--maxAttempts < 0 || !canRetry(e as Error)) {
        // Last exception, or exception that allows retries
        throw e;
      }

      logger.error(`Execution method：'${fn.name}' exception，Remaining attempts：${maxAttempts} times。`, (e as Error)?.stack);

      backOff && (await sleep(backOff));

      // calculate next time backoff retry time
      const newBackOff: number = backOff * options.exponentialOption.multiplier;
      backOff = newBackOff > options.exponentialOption.maxInterval ? options.exponentialOption.maxInterval : newBackOff;
      return retryAsync.apply(this, [fn, args, maxAttempts, backOff]);
    }
  }

  return function (_target: Record<string, any>, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalFn = descriptor.value;

    // set default parameters
    options.backOff ??= 1000;

    options.exponentialOption = {
      ...{ maxInterval: 6000, multiplier: 2 },
      ...options.exponentialOption,
    };

    descriptor.value = async function (...args: any[]) {
      try {
        return await retryAsync.apply(this, [originalFn, args, options.maxAttempts, options.backOff]);
      } catch (e) {
        const error = e as Error;
        const msgPrefix = `、Retry execution method：'${propertyKey}'，Failed：${options.maxAttempts} times。`;
        error.message = error.message ? `${msgPrefix} OriginalError: ${error.message}` : msgPrefix;
        logger.error(error.message, error?.stack);
        if (!options.hasOwnProperty('callback')) {
          throw e;
        }
        return options.callback();
      }
    };
    return descriptor;
  };
}

export interface RetryOptions {
  /**
   * Maximum number of attempts
   */
  maxAttempts: number;

  /**
   * Initial retreat time (retry time)
   */
  backOff?: number;

  exponentialOption?: {
    /**
     * Maximum interval
     */
    maxInterval?: number;
    /**
     * Incremental multiplier per retry
     */
    multiplier?: number;
  };

  /**
   * Custom function judgment, whether to execute re
   */
  doRetry?: (e: any) => boolean;

  /**
   * Specify the exception to be retried
   */
  value?: ErrorConstructor[];

  /**
   * Customize the final failure return parameter.
   * Note ⚠️: if specified this parameter will not eventually throw an exception and will return the result of the function
   */
  callback?: () => any;
}
