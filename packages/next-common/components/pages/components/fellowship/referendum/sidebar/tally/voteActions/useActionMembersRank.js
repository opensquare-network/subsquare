import { useEffect } from "react";
import { createGlobalState } from "react-use";
import { useConditionalContextApi } from "next-common/context/migration/conditionalApi";

export const useFellowshipMembersRankState = createGlobalState({});
export function useFetchActionMembersRank() {
  const api = useConditionalContextApi();
  const [ranks, setRanks] = useFellowshipMembersRankState();

  useEffect(() => {
    if (!api?.query?.fellowshipCollective) {
      return;
    }
    api.query.fellowshipCollective?.members
      .entries()
      .then((res) => {
        const map = {};
        res.map(([key, value]) => {
          const address = key.args[0].toString();
          const rank = value.unwrap()?.rank?.toNumber?.();
          map[address] = rank;
        });
        setRanks(map);
      })
      .catch(() => {
        setRanks({});
      });
  }, [api?.query?.fellowshipCollective, setRanks]);

  return ranks;
}
