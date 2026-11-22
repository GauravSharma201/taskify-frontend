import { cn } from "@/lib/utils";
import { getPasswordStrength, type PasswordStrength } from "@/lib/validation/password-strength";

const LEVELS: Record<PasswordStrength, { label: string; fill: string }> = {
  0: { label: "", fill: "" },
  1: { label: "weak", fill: "bg-danger" },
  2: { label: "fair", fill: "bg-warning-text" },
  3: { label: "good", fill: "bg-success" },
  4: { label: "strong", fill: "bg-success" },
};

type PasswordStrengthMeterProps = {
  /** The password being typed */
  value: string;
  className?: string;
};

/** Four segments that fill as the password meets more of the `newPasswordRule` checks. */
export function PasswordStrengthMeter({ value, className }: PasswordStrengthMeterProps) {
  const score = getPasswordStrength(value);
  const { label, fill } = LEVELS[score];

  return (
    <div className={cn("flex flex-col", className)}>
      <div aria-hidden="true" className="grid grid-cols-4 gap-1">
        {[1, 2, 3, 4].map((segment) => (
          <span
            key={segment}
            className={cn("h-1 rounded-full transition-colors", segment <= score ? fill : "bg-border")}
          />
        ))}
      </div>
      <span aria-live="polite" className="sr-only">
        {label && `Password strength: ${label}`}
      </span>
    </div>
  );
}
