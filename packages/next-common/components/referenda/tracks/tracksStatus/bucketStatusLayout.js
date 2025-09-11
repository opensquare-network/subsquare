import { cn } from "next-common/utils";
import Tooltip from "next-common/components/tooltip";

export default function BucketStatusLayout({
  bucket,
  name,
  tooltip,
  counts,
  action,
  className,
}) {
  return (
    <div className={cn("flex flex-col gap-[8px]", className)}>
      {bucket}
      <div className="flex items-center justify-between text12Medium">
        <div className="flex items-center">
          <span className="text-textTertiary mr-[4px]">{name}</span>
          <Tooltip content={tooltip} />
          {counts}
        </div>
        {action}
      </div>
    </div>
  );
}
