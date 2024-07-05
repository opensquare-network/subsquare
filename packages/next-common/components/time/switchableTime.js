import { useState } from "react";
import useDuration from "../../utils/hooks/useDuration";
import formatTime from "../../utils/viewfuncs/formatDate";
import { cn } from "next-common/utils";

function SwitchableTime({
  timestamp = new Date().getTime(),
  showDuration = false,
  isEstimated = false,
}) {
  const [isDuration, setIsDuration] = useState(showDuration);

  const timeStr = formatTime(timestamp);
  const duration = useDuration(timestamp);

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
      {isDuration ? duration : timeStr}
    </span>
  );
}

export default SwitchableTime;
