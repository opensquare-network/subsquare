import CountDown from "../countDown";

export default function TreasurySummarySpendPeriodCountDown({ summary }) {
  return (
    <div className="flex max-sm:hidden">
      <CountDown percent={summary?.progress ?? 0} />
    </div>
  );
}
