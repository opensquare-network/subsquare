import FellowshipRank, {
  OffboardedFellowshipRank,
} from "next-common/components/fellowship/rank";
import { isNil } from "lodash-es";

export function useStatisticsClaimantsRankColumn() {
  return {
    name: "Rank",
    width: 80,
    cellRender(data, idx) {
      if (isNil(data?.rank)) {
        return <OffboardedFellowshipRank />;
      }
      return <FellowshipRank key={idx} rank={data.rank} />;
    },
  };
}
