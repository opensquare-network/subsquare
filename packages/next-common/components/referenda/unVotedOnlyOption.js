import { cn } from "next-common/utils";
import Loading from "../loading";
import Toggle from "../toggle";
import Tooltip from "../tooltip";

export default function UnVotedOnlyOption({
  tooltip = "Only referenda I haven't voted",
  isLoading,
  isOn,
  setIsOn,
  className = "",
}) {
  const onToggle = () => {
    setIsOn(!isOn);
  };

  return (
    <div className={cn("flex items-center text12Medium gap-[8px]", className)}>
      <div className="flex items-center gap-[4px]">
        <span className="whitespace-nowrap">Un-voted Only</span>
        <Tooltip content={tooltip} />
      </div>
      {isLoading ? (
        <Loading size={20} />
      ) : (
        <Toggle size={"small"} isOn={isOn} onToggle={onToggle} />
      )}
    </div>
  );
}
