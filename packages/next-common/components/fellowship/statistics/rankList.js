import { isNil } from "lodash-es";
import { usePageProps } from "next-common/context/page";
import { getRankColor } from "next-common/utils/fellowship/getRankColor";

function RankListItem({ rank, count, total }) {
  const color = getRankColor(rank);
  const percentage = ((count / total) * 100).toFixed(2);
  return (
    <div
      key={`rank-${rank}`}
      className="flex items-center justify-between text12Medium"
    >
      <div className="flex item-center gap-[8px] grow">
        <div
          className="inline-block m-[2px] w-[10px] h-[10px] rounded-[2px]"
          style={{ backgroundColor: color }}
        />
        <span className="text-textSecondary">Rank {rank}</span>
        <span className="text-textTertiary">{count}</span>
      </div>
      <span className="text-textTertiary">{percentage}%</span>
    </div>
  );
}

export default function RankList() {
  const { membersSummary: { totalMembersCount, rankDistribution } = {} } =
    usePageProps();
  if (isNil(totalMembersCount) && totalMembersCount === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-[8px] min-w-[260px] max-sm:grow">
      {Object.keys(rankDistribution).map((rank) => (
        <RankListItem
          key={`rank-${rank}`}
          rank={parseInt(rank)}
          count={rankDistribution[rank]}
          total={totalMembersCount}
        />
      ))}
    </div>
  );
}
