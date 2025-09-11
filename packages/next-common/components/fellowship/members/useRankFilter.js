import { isNil } from "lodash-es";
import { useMemo } from "react";
import { useRouterRankFilter } from "next-common/hooks/fellowship/useRankFilter";

export default function useRankFilter(members) {
  const ranks = [...new Set(members.map((m) => m.rank))];
  const { rank, component: RankFilterComponent } = useRouterRankFilter(ranks);

  const filteredMembers = useMemo(() => {
    if (isNil(members)) return;

    if (isNil(rank)) {
      return members;
    }

    return members.filter((m) => m.rank === rank);
  }, [members, rank]);

  const component = (
    <div className="flex flex-wrap max-sm:flex-col sm:items-center gap-[12px] max-sm:gap-[8px] ml-[24px]">
      {RankFilterComponent}
    </div>
  );

  return {
    filteredMembers,
    component,
  };
}
