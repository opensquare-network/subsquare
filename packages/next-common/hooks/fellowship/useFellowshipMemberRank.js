import { useContextApi } from "next-common/context/api";
import { useEffect, useState } from "react";

export function useFellowshipMemberRank(
  address,
  pallet = "fellowshipCollective",
) {
  const [rank, setRank] = useState(null);
  const api = useContextApi();

  useEffect(() => {
    if (!api || !pallet) {
      return;
    }

    api.query[pallet].members(address).then((resp) => {
      if (!resp.isNone) {
        const json = resp.value.toJSON();
        setRank(json.rank);
      }
    });
  }, [api, address, pallet]);

  return rank;
}
