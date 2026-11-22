import { IssueTypeIcon, type IssueType } from "@/components/common/issue-type-icon";
import { UserAvatar } from "@/components/common/user-avatar";
import { cn } from "@/lib/utils";

type TaskCardProps = {
  title: string;
  /** e.g. "TSK-142" */
  taskKey: string;
  type: IssueType;
  assignee?: { name: string; src?: string; color?: 1 | 2 | 3 | 4 | 5 };
  className?: string;
};

/** Board card: title, then type icon + key on the left and assignee on the right. */
export function TaskCard({ title, taskKey, type, assignee, className }: TaskCardProps) {
  return (
    <article className={cn("flex flex-col gap-3 rounded-lg bg-surface p-3 text-ink shadow-card", className)}>
      <h3 className="text-body">{title}</h3>
      <div className="flex items-center gap-1.5">
        <IssueTypeIcon type={type} />
        {/* min-w-0 + truncate: in a narrow column the key shortens instead of pushing the avatar out */}
        <span className="min-w-0 truncate text-caption text-ink-muted">{taskKey}</span>
        {assignee && <UserAvatar {...assignee} size="sm" className="ms-auto" />}
      </div>
    </article>
  );
}
