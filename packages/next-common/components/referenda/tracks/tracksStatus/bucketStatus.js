import { cn } from "next-common/utils";
import Tooltip from "next-common/components/tooltip";
import useBucket from "./useBucket";
import { useState } from "react";

export default function BucketStatus({
  className,
  sections,
  capacity,
  name,
  tooltip,
  counts,
  idleItemsColor,
  paddingItemsColor,
}) {
  const [viewAll, setViewAll] = useState(false);
  const {
    component: bucket,
    maxItemsCountInALine,
    currentItemsCount,
  } = useBucket({
    sections,
    capacity,
    expanded: viewAll,
    idleItemsColor,
    paddingItemsColor,
  });

  return (
    <div className={cn("flex flex-col gap-[8px]", className)}>
      {bucket}
      <div className="flex items-center justify-between text12Medium">
        <div className="flex items-center">
          <span className="text-textTertiary mr-[4px]">{name}</span>
          <Tooltip content={tooltip} />
          {counts}
        </div>
        {currentItemsCount > maxItemsCountInALine && (
          <span
            className="cursor-pointer text12Medium text-theme500"
            onClick={() => setViewAll(!viewAll)}
          >
            {viewAll ? "Hide" : "View All"}
          </span>
        )}
      </div>
    </div>
  );
}
