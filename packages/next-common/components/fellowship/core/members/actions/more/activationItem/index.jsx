import SignalIndicator from "next-common/components/icons/signalIndicator";
import { noop } from "lodash-es";
import { OptionItem } from "next-common/components/internalDropdown/styled";

export default function ActivationItem({ member, onClick = noop }) {
  const { isActive } = member.status;

  const targetActiveValue = !isActive;

  return (
    <OptionItem
      className="flex items-center grow"
      role="button"
      onClick={onClick}
    >
      <SignalIndicator
        showTooltip={false}
        active={targetActiveValue}
        className="w-6 h-6 mr-2"
      />
      {isActive ? "Inactive" : "Active"}
    </OptionItem>
  );
}
