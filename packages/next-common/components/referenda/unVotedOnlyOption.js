import Loading from "../loading";
import Toggle from "../toggle";
import Tooltip from "../tooltip";

export default function UnVotedOnlyOption({
  tooltip,
  isLoading,
  isOn,
  setIsOn,
}) {
  const onToggle = () => {
    setIsOn(!isOn);
  };

  return (
    <div className="flex items-center text12Medium gap-[8px]">
      <div className="flex items-center gap-[4px]">
        <span className="text-textSecondary whitespace-nowrap">
          Un-voted Only
        </span>
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
