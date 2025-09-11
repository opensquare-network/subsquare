import ToggleOption from "../toggleOption";

export default function UnVotedOnlyOption({
  tooltip = "Only referenda I haven't voted",
  isLoading,
  isOn,
  setIsOn,
}) {
  return (
    <ToggleOption
      label="Un-voted Only"
      tooltip={tooltip}
      isOn={isOn}
      setIsOn={setIsOn}
      isLoading={isLoading}
    />
  );
}
