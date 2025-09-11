import SwitchableTime from "../../time/switchableTime";
import { cn } from "next-common/utils";

export default function BlockValue({ height, time, isEstimated = false }) {
  let content;
  if (!time) {
    content = height;
  } else {
    content = (
      <>
        {height}
        <SwitchableTime timestamp={time} isEstimated={isEstimated} />
      </>
    );
  }

  return (
    <div
      className={cn(
        "text14Medium",
        "flex items-center gap-x-4",
        "max-sm:flex-col max-sm:items-start",
      )}
    >
      {content}
    </div>
  );
}
