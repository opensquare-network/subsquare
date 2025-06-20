import Loading from "./loading";
import Tooltip from "./tooltip";
import Toggle from "./toggle";

export default function ToggleOption({
  label,
  tooltip,
  isOn,
  setIsOn,
  isLoading = false,
  loadingSize = 20,
}) {
  return (
    <div className="flex items-center justify-between text12Medium gap-[8px]">
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
