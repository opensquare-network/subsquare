import { isNil } from "lodash-es";
import { useMemo } from "react";
import { useRouterRankFilter } from "next-common/hooks/fellowship/useRankFilter";

export default function useRankFilter(evidences) {
  const ranks = [
    ...new Set(
      evidences
        .filter((evidence) => !isNil(evidence.rank))
        .map((evidence) => evidence.rank),
    ),
  ];
  const { rank, component: RankFilterComponent } = useRouterRankFilter(ranks);

  const filteredEvidences = useMemo(() => {
    if (isNil(evidences)) return;

    if (isNil(rank)) {
      return evidences;
    }

    return evidences.filter((evidence) => evidence.rank === rank);
  }, [evidences, rank]);

  const component = (
    <div className="flex flex-wrap max-sm:flex-col sm:items-center gap-[12px] max-sm:gap-[8px] ml-[24px]">
      {RankFilterComponent}
    </div>
  );

  return {
    filteredEvidences,
    component,
  };
}
