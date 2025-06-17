import Toggle from "next-common/components/toggle";

export default function NayAyeSwitch({ isOn, setIsOn }) {
  return (
    <div className="flex items-center justify-between gap-[8px]">
      <span className="text-textSecondary text12Medium whitespace-nowrap">
        Aye/Nay Value
      </span>
      <Toggle size="small" isOn={isOn} onToggle={() => setIsOn(!isOn)} />
    </div>
  );
}
