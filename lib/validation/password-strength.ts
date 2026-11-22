import { HAS_LETTER, HAS_NUMBER, HAS_SYMBOL, MIN_PASSWORD_LENGTH } from "@/lib/validation/rules";

export type PasswordStrength = 0 | 1 | 2 | 3 | 4;

/** One point each for: 8+ characters, a letter, a number, a symbol. Mirrors `newPasswordRule`. */
export function getPasswordStrength(password: string): PasswordStrength {
  if (!password) return 0;
  const checks = [
    password.length >= MIN_PASSWORD_LENGTH,
    HAS_LETTER.test(password),
    HAS_NUMBER.test(password),
    HAS_SYMBOL.test(password),
  ];
  return checks.filter(Boolean).length as PasswordStrength;
}
