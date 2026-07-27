/**
 * Returns the average of an array.
 */
export function average(values: number[]): number {
  if (values.length === 0) {
    throw new Error('Array cannot be empty.');
  }

  const total = values.reduce((acc, value) => acc + value, 0);

  return total / values.length;
}
