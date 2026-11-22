import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const COLORS = ["bg-avatar-1", "bg-avatar-2", "bg-avatar-3", "bg-avatar-4", "bg-avatar-5"] as const;

const TEXT = {
  sm: "text-overline",
  default: "text-label",
  lg: "text-body-strong",
} as const;

type UserAvatarProps = {
  name: string;
  src?: string;
  size?: keyof typeof TEXT;
  /** 1–5 to pin a colour; by default it is picked from the name, so a person keeps one colour everywhere. */
  color?: 1 | 2 | 3 | 4 | 5;
  className?: string;
};

export function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts.length > 1 ? parts.at(-1)![0] : "")).toUpperCase();
}

function colorFor(name: string) {
  let hash = 0;
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) | 0;
  return COLORS[Math.abs(hash) % COLORS.length];
}

/** Round avatar: photo if `src` loads, otherwise white initials on an avatar colour. */
export function UserAvatar({ name, src, size = "default", color, className }: UserAvatarProps) {
  return (
    <Avatar size={size} className={className} title={name}>
      {src && <AvatarImage src={src} alt={name} />}
      <AvatarFallback
        className={cn("text-on-brand", TEXT[size], color ? COLORS[color - 1] : colorFor(name))}
      >
        <span aria-hidden="true">{initials(name)}</span>
        <span className="sr-only">{name}</span>
      </AvatarFallback>
    </Avatar>
  );
}
