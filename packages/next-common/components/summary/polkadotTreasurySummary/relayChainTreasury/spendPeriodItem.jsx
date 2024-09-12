import CountDown from "next-common/components/_CountDown";

function Remaining({ percentage }) {
  return `${percentage}%`;
}

export default function SpendPeriodItem({ percentage, label, text }) {
  return (
    <div className="flex items-center text12Medium">
      <span>
        <span>{text}</span> / <span className="text-textTertiary">{label}</span>
      </span>
      <span className="ml-2">
        <CountDown
          numerator={percentage}
          denominator={100}
          tooltipContent={<Remaining percentage={percentage} />}
          backgroundColor="var(--theme100)"
          foregroundColor="var(--theme500)"
        />
      </span>
    </div>
  );
}
