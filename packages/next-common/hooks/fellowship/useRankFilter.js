import { useState } from "react";
import Select from "next-common/components/select";
import { useRouter } from "next/router";
import {
  addRouterQuery,
  getRouterQuery,
  removeRouterQuery,
} from "next-common/utils/router";
import { isNil } from "lodash-es";
import {
  useCommittedFilterState,
  useStagedFilterState,
} from "next-common/components/dropdownFilter/context";

function RankSelect({ ranks, rank, setRank, noneLabel }) {
  const options = (ranks || []).map((rank) => ({
    label: String(rank),
    value: rank,
  }));

  options.unshift({
    label: noneLabel,
    value: null,
  });

  return (
    <Select
      className="w-20 text12Medium"
      small
      value={rank}
      options={options}
      onChange={(option) => {
        setRank(option.value);
      }}
    />
  );
}

function RankField({ ranks, rank, setRank, noneLabel }) {
  return (
    <div className="flex items-center justify-between text12Medium text-textPrimary gap-x-2">
      <span className="text12Medium text-textPrimary my-[12px]">Rank</span>
      <RankSelect
        ranks={ranks}
        rank={rank}
        setRank={setRank}
        noneLabel={noneLabel}
      />
    </div>
  );
}

export default function useRankFilter(ranks = [], noneLabel = "All") {
  const [rank, setRank] = useState(null);

  return {
    rank,
    component: (
      <RankField
        ranks={ranks}
        noneLabel={noneLabel}
        rank={rank}
        setRank={setRank}
      />
    ),
  };
}

export function useRouterRankFilter(ranks = [], noneLabel = "All") {
  const router = useRouter();
  const queryRank = getRouterQuery(router, "rank") || null;
  const rank = queryRank ? parseInt(queryRank) : null;

  return {
    rank,
    component: (
      <RankField
        ranks={ranks}
        noneLabel={noneLabel}
        rank={rank}
        setRank={(rank) => {
          isNil(rank)
            ? removeRouterQuery(router, "rank")
            : addRouterQuery(router, "rank", rank);
        }}
      />
    ),
  };
}

export function useRankFilterInDropdown(ranks = [], noneLabel = "All") {
  const [stagedFilter, setStagedFilter] = useStagedFilterState();
  const [committedFilter] = useCommittedFilterState();

  return {
    rank: committedFilter?.rank ? parseInt(committedFilter.rank) : null,
    component: (
      <RankField
        ranks={ranks}
        noneLabel={noneLabel}
        rank={stagedFilter?.rank ? parseInt(stagedFilter.rank) : null}
        setRank={(rank) => {
          setStagedFilter({ ...stagedFilter, rank });
        }}
      />
    ),
  };
}
