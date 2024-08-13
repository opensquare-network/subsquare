import FellowshipRank from "next-common/components/fellowship/rank";

export function useStatisticsClaimantsRankColumn() {
  return {
    name: "Rank",
    width: 80,
    cellRender(data, idx) {
      return <FellowshipRank key={idx} rank={data.rank} />;
    },
  };
}
