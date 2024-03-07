import FellowshipRank from "next-common/components/fellowship/rank";

export function useFellowshipSalaryCycleRankColumn() {
  return {
    name: "Rank",
    width: 80,
    cellRender(data) {
      return <FellowshipRank rank={data.memberInfo.rank} />;
    },
  };
}
