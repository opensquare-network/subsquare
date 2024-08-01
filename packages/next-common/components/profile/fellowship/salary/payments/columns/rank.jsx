import FellowshipRank from "next-common/components/fellowship/rank";

export function useProfileFellowshipSalaryPaymentRankColumn() {
  return {
    name: "Rank",
    width: 80,
    cellRender(data, idx) {
      return <FellowshipRank key={idx} rank={data.memberInfo?.rank} />;
    },
  };
}
