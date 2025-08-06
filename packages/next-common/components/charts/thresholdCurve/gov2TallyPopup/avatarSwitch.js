import Toggle from "next-common/components/toggle";

export default function AvatarSwitch({ value, onChange }) {
  return (
    <div className="flex items-center justify-between gap-[8px]">
      <span className="text-textSecondary text12Medium whitespace-nowrap">
        Show Avatar
      </span>
      <Toggle size="small" isOn={value} onToggle={() => onChange(!value)} />
    </div>
  );
}
