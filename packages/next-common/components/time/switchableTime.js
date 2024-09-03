import { useState } from "react";
import formatTime from "../../utils/viewfuncs/formatDate";
import { cn } from "next-common/utils";
import { formatTimeAgo } from "next-common/utils/viewfuncs/formatTimeAgo";

function SwitchableTime({
  timestamp = new Date().getTime(),
  showDuration = false,
  isEstimated = false,
}) {
  const [isDuration, setIsDuration] = useState(showDuration);

  const timeStr = formatTime(timestamp);
  const timeAgo = formatTimeAgo(timestamp);

  return (
    <span
      role="button"
      className={cn(
        "text12Medium",
        "text-textTertiary",
        "hover:text-textSecondary",
      )}
      onClick={() => {
        setIsDuration(!isDuration);
      }}
    >
      {isEstimated ? <span className="mr-1">≈</span> : null}
      {isDuration ? timeAgo : timeStr}
    </span>
  );
}

export default SwitchableTime;
