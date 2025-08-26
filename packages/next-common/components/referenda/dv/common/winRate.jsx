import Tooltip from "next-common/components/tooltip";

function getWinRateColorClass(percent) {
  if (percent < 50) {
    return "text-red500";
  }
  if (percent < 80) {
    return "text-orange500";
  }
  return "text-green500";
}

export default function WinRate({ winCount, voteCount }) {
  const percent = voteCount ? (winCount / voteCount) * 100 : 0;
  const winRate = percent.toFixed(2);

  return (
    <Tooltip content={`Won/Participated: ${winCount}/${voteCount}`}>
      <span className={getWinRateColorClass(percent)}>{winRate}%</span>
    </Tooltip>
  );
}
