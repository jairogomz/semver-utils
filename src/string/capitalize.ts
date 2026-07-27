/**
 * Capitalizes the first character.
 */
export function capitalize(value: string): string {
  if (!value) {
    return value;
  }
  //intentional bug to should be fixed
  return value.charAt(0).toUpperCase() + value.slice(2);
}
