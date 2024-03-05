import { getDemocracyBeenDelegatedByAddress } from "next-common/utils/democracy/getDemocracyBeenDelegatedByAddress";
import { getDemocracyBeenDelegatedListByAddress } from "next-common/utils/democracy/getDemocracyBeenDelegatedListByAddress";
import { useEffect, useState } from "react";
import { useContextApi } from "next-common/context/api";

export default function useBeenDelegated(address) {
  const api = useContextApi();
  const [delegations, setDelegations] = useState();
  const [beenDelegatedList, setBeenDelegatedList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setDelegations();
    setBeenDelegatedList([]);

    if (!api || !address) {
      return;
    }

    setIsLoading(true);
    Promise.all([
      getDemocracyBeenDelegatedByAddress(api, address).then((result) => {
        setDelegations(result);
      }),
      getDemocracyBeenDelegatedListByAddress(api, address).then((result) => {
        setBeenDelegatedList(result);
      }),
    ]).finally(() => {
      setIsLoading(false);
    });
  }, [api, address]);

  return { delegations, beenDelegatedList, isLoading };
}
