import { useContextApi } from "next-common/context/api";
import { useEffect, useState } from "react";

export function useAmbassadorMemberRank(address) {
  const [rank, setRank] = useState(null);
  const api = useContextApi();

  useEffect(() => {
    if (!api) {
      return;
    }

    api.query.ambassadorCollective.members(address).then((resp) => {
      if (!resp.isNone) {
        const json = resp.value.toJSON();
        setRank(json.rank);
      }
    });
  }, [api, address]);

  return rank;
}
