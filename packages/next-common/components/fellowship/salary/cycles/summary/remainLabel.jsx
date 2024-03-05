import Remaining from "next-common/components/remaining";
import CountDown from "next-common/components/_CountDown";

export default function RemainLabel({ percentage, label, remain, time }) {
  return (
    <div className="flex items-center text12Medium">
      <CountDown
        numerator={percentage}
        denominator={100}
        tooltipContent={!!remain && <Remaining blocks={remain} />}
        backgroundColor="var(--theme100)"
        foregroundColor="var(--theme500)"
      />
      <span className="ml-2">
        <span className="text-textTertiary">{label}</span>{" "}
        <span>{time?.join?.(" ")}</span>
      </span>
    </div>
  );
}
