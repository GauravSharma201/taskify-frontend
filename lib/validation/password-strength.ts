import { HAS_LOWER, HAS_NUMBER, HAS_SYMBOL, HAS_UPPER, MIN_PASSWORD_LENGTH } from "@/lib/validation/rules";

export type PasswordStrength = 0 | 1 | 2 | 3 | 4;

/**
 * One point each for: 8+ characters, upper + lower case, a number, a symbol.
 * Mirrors `newPasswordRule` (upper and lower count as one point, so the meter keeps four segments).
 */
export function getPasswordStrength(password: string): PasswordStrength {
  if (!password) return 0;
  const checks = [
    password.length >= MIN_PASSWORD_LENGTH,
    HAS_UPPER.test(password) && HAS_LOWER.test(password),
    HAS_NUMBER.test(password),
    HAS_SYMBOL.test(password),
  ];
  return checks.filter(Boolean).length as PasswordStrength;
}
