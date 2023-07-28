import Toggle from "next-common/components/toggle";

export default function MyDeposit({ isOn, setIsOn }) {
  return (
    <div className="flex gap-[8px] items-center">
      <span className="text-[12px] font-medium text-textSecondary">
        My Deposit
      </span>
      <Toggle isOn={isOn} onToggle={setIsOn} size="small" />
    </div>
  );
}
