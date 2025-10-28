import CountDown from "../countDown";

export default function TreasurySummarySpendPeriodCountDown({
  summary,
  size,
  width,
}) {
  return (
    <div className="flex max-sm:hidden">
      <CountDown percent={summary?.progress ?? 0} size={size} width={width} />
    </div>
  );
}
