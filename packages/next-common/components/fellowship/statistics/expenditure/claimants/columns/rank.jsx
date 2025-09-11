import FellowshipRank from "next-common/components/fellowship/rank";
import { isNil } from "lodash-es";

export function useStatisticsClaimantsRankColumn() {
  return {
    name: "Rank",
    width: 80,
    cellRender(data, idx) {
      if (isNil(data?.rank)) {
        return "-";
      }
      return <FellowshipRank key={idx} rank={data.rank} />;
    },
  };
}
