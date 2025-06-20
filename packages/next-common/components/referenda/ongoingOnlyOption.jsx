import { cn } from "next-common/utils";
import Tooltip from "../tooltip";
import Toggle from "../toggle";

export default function OngoingOnlyOption({
  className = "",
  tooltip = "Only show the ongoing referenda",
  isOn,
  setIsOn,
}) {
  return (
    <div className={cn("flex items-center text12Medium gap-[8px]", className)}>
      <div className="flex items-center gap-[4px]">
        <span className="whitespace-nowrap">Ongoing</span>
        <Tooltip content={tooltip} />
      </div>
      <Toggle size={"small"} isOn={isOn} onToggle={setIsOn} />
    </div>
  );
}
