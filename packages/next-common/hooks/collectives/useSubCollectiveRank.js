import { useCallback, useState } from "react";
import useSubStorage from "next-common/hooks/common/useSubStorage";
import { useConditionalContextApi } from "next-common/context/migration/conditionalApi";

export default function useSubCollectiveRank(
  address,
  pallet = "fellowshipCollective",
) {
  const [rank, setRank] = useState(undefined);
  const api = useConditionalContextApi();

  const { loading } = useSubStorage(pallet, "members", [address], {
    api,
    callback: useCallback((rawOptional) => {
      if (rawOptional.isSome) {
        const unwrapped = rawOptional.unwrap();
        setRank(unwrapped.rank.toNumber());
      } else {
        setRank(null);
      }
    }, []),
  });

  return { rank, loading };
}
