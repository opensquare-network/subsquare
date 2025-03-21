import { isNil } from "lodash-es";
import { getRankColor } from "next-common/utils/fellowship/getRankColor";
import { useFellowshipMemberRank } from "next-common/hooks/fellowship/useFellowshipMemberRank";
import { useRankedCollectivePallet } from "next-common/context/collectives/collectives";

export default function FellowshipRank({ rank }) {
  if (isNil(rank)) {
    return null;
  }

  return (
    <span
      className="inline-flex w-5 h-5 rounded text12Bold items-center justify-center"
      style={{
        color: getRankColor(rank),
        backgroundColor: getRankColor(rank, 0.1),
      }}
    >
      {rank}
    </span>
  );
}

export function FellowshipRankInfo({ address }) {
  const collectivePallet = useRankedCollectivePallet();
  const rank = useFellowshipMemberRank(address, collectivePallet);

  return <FellowshipRank rank={rank} />;
}
