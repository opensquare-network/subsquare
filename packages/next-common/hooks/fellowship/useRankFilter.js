import { useState } from "react";
import Select from "next-common/components/select";
import { useRouter } from "next/router";
import {
  addRouterQuery,
  getRouterQuery,
  removeRouterQuery,
} from "next-common/utils/router";
import { isNil } from "lodash-es";

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
    <div className="text12Medium text-textPrimary flex items-center gap-x-2">
      <div>Rank</div>
      <Select
        className="w-20 text12Medium"
        small
        value={rank}
        options={options}
        onChange={(option) => {
          setRank(option.value);
        }}
      />
    </div>
  );
}

export default function useRankFilter(ranks = [], noneLabel = "All") {
  const [rank, setRank] = useState(null);

  return {
    rank,
    component: (
      <RankSelect
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
      <RankSelect
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
