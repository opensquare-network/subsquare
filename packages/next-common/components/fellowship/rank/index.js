import { isNil } from "lodash-es";
import { getRankColor } from "next-common/utils/fellowship/getRankColor";

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
