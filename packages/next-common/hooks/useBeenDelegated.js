import { getDemocracyBeenDelegatedByAddress } from "next-common/utils/democracy/getDemocracyBeenDelegatedByAddress";
import { getDemocracyBeenDelegatedListByAddress } from "next-common/utils/democracy/getDemocracyBeenDelegatedListByAddress";
import useApi from "next-common/utils/hooks/useApi";
import { useEffect, useState } from "react";

export default function useBeenDelegated(address) {
  const api = useApi();
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
