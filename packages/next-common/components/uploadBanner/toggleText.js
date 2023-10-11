import { cn } from "next-common/utils";

function ToggleText({
  disabled = false,
  isSetBanner,
  setIsSetBanner = () => {},
}) {
  const handleSwitch = () => {
    if (disabled) {
      return;
    }

    setIsSetBanner(!isSetBanner);
  };

  return (
    <button
      className={cn(
        "text14Medium select-none text-theme500",
        disabled && "cursor-not-allowed !text-textDisabled",
      )}
      disabled={disabled}
      onClick={handleSwitch}
    >
      {isSetBanner ? "Cancel" : "Set Banner"}
    </button>
  );
}

export default ToggleText;
