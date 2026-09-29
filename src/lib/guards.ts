/**
 * Creates a runtime guard that narrows a string to one of the allowed literal values.
 * @param values - Allowed values (use an `as const` array)
 * @param label - Name used in the error message
 * @returns Function that returns the narrowed value or throws if it is not allowed
 */
export function oneOf<T extends string>(values: readonly T[], label: string) {
  return (value: string): T => {
    if ((values as readonly string[]).includes(value)) return value as T
    throw new Error(`${label} non valido: ${value}`)
  }
}
