import { cn } from "next-common/utils";
import Loading from "./loading";
import Tooltip from "./tooltip";
import Toggle from "./toggle";

export default function ToggleOption({
  className = "",
  label,
  tooltip,
  isOn,
  setIsOn,
  isLoading = false,
  loadingSize = 20,
}) {
  return (
    <div className={cn("flex items-center text12Medium gap-[8px]", className)}>
      <div className="flex items-center gap-[4px]">
        <span className="whitespace-nowrap">{label}</span>
        <Tooltip content={tooltip} />
      </div>
      {isLoading ? (
        <Loading size={loadingSize} />
      ) : (
        <Toggle size={"small"} isOn={isOn} onToggle={setIsOn} />
      )}
    </div>
  );
}
