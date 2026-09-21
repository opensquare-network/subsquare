import { SystemEye } from "@osn/icons/subsquare";
import { cn } from "next-common/utils";
import { WATCH_ONLY_TOOLTIP_TEXT } from "next-common/utils/watchOnly";

export default function WatchOnlyHint({ className }) {
  return (
    <div
      className={cn(
        "flex items-center gap-2",
        "text12Medium text-textSecondary",
        className,
      )}
    >
      <SystemEye className="w-4 h-4 shrink-0 text-textTertiary" />
      <span className="truncate">{WATCH_ONLY_TOOLTIP_TEXT}</span>
    </div>
  );
}
