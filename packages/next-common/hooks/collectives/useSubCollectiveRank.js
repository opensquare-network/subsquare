import { useContextApi } from "next-common/context/api";
import { useEffect, useState } from "react";

export default function useSubCollectiveRank(address, pallet = "fellowshipCollective") {
  const api = useContextApi();
  const [rank, setRank] = useState(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!api) {
      return;
    }

    if (!address || !api?.query[pallet]?.members) {
      setLoading(false);
      return;
    }

    let unsub;
    api.query[pallet].members(address, (rawOptional) => {
      console.log("rawOptional", rawOptional);
      if (rawOptional.isSome) {
        const unwrapped = rawOptional.unwrap();
        setRank(unwrapped.rank.toNumber());
      } else {
        setRank(null);
      }
    })
      .then((result) => (unsub = result))
      .finally(() => setLoading(false));

    return () => {
      if (unsub) {
        unsub();
      }
    };
  }, [address, api]);

  return {rank, loading};
}
