export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * randomly get a number in an interval
 *
 * @param minNum
 * @param maxNum
 */
export const randomNum = (minNum: number, maxNum: number): number => {
  return Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
};

/**
 * Creates an array of array values not included in the other given arrays
 * @param {Array} array1
 * @param {String|Array} array2
 */
export function difference(array: string[], values: string | string[]): string[] {
  return array.filter((x) => !values.includes(x));
}

/**
 * Asynchronously filter an array.
 *
 * @param arr The array to filter.
 * @param predicate The predicate to filter the array with.
 * @returns The filtered array.
 */
export async function asyncFilter<T>(arr: ReadonlyArray<T>, predicate: () => unknown): Promise<T[]> {
  const results = await Promise.all(arr.map(predicate));
  return arr.filter((_v: any, index: string | number) => results[index]);
}

/**
 * Create an array which only the first occurrence of each element is kept
 * @param {Array} array
 */
export function unique(array: string[]): string[] {
  return [...new Set(array)];
}

/**
 * Returns the value if it is truthy, otherwise returns the default value.
 * @param value - The value to check.
 * @param defaultValue - The default value to return if the value is falsy.
 * @returns The value if it is truthy, otherwise the default value.
 * @template T - The type of the value and default value.
 */
export function getValueOrDefault<T>(value: T, defaultValue: T | null = null): T {
  return value ? value : (defaultValue as T);
}

/* converts from JSON to Prisma Json type
 * @param data of type JSON
 */
export function convertToInputJsonValue(data: JSON) {
  if (typeof data === 'string' || typeof data === 'number' || typeof data === 'boolean') {
    return data;
  } else if (data === null) {
    return data;
  } else if (Array.isArray(data)) {
    return data.map((item) => this.convertToInputJsonValue(item));
  } else if (typeof data === 'object') {
    const result = {};
    for (const key in data) {
      result[key] = this.convertToInputJsonValue(data[key]);
    }
    return result;
  }
  return null;
}

export function timeout<T = any>(promise: Promise<T>, ms = 1000): Promise<T> {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error('Promise timed out'));
    }, ms);
    promise.then(
      (result) => {
        clearTimeout(timeoutId);
        resolve(result);
      },
      (error) => {
        clearTimeout(timeoutId);
        reject(error);
      },
    );
  });
}
