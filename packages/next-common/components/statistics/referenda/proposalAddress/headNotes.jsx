import React, { memo } from "react";
import { cn } from "next-common/utils";

function Tips({ label, bgColor }) {
  return (
    <div className="flex items-center gap-2">
      <span className={cn("w-2.5 h-2.5 rounded-[2px]", `bg-${bgColor}`)}></span>
      <span className="text12Medium text-textSecondary">{label}</span>
    </div>
  );
}

const listMap = [
  {
    label: "Aye",
    bgColor: "green300",
  },
  {
    label: "Nay",
    bgColor: "red300",
  },
  {
    label: "Abstain",
    bgColor: "neutral400",
  },
];

function HeadNotes() {
  return (
    <div className="flex items-center justify-between">
      <span className="text-textPrimary text14Bold">Statistics</span>
      <div className="flex items-center gap-4">
        {listMap.map((i) => (
          <Tips key={i.label} {...i} />
        ))}
      </div>
    </div>
  );
}

export default memo(HeadNotes);
