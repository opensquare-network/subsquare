import SignalIndicator from "next-common/components/icons/signalIndicator";

export default function ActivationItem({ member }) {
  const { isActive } = member.status;

  return (
    <div className="flex items-center">
      <SignalIndicator
        showTooltip={false}
        active={!isActive}
        className="w-6 h-6 mr-2"
      />
      {isActive ? "Inactive" : "Active"}
    </div>
  );
}
