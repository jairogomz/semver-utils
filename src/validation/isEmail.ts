/**
 * Validates an email address.
 */
export function isEmail(value: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return regex.test(value);
}

// fake fix
