import { useEffect, useState } from "react";
import { useContextPapiApi } from "next-common/context/papi";
import { getDemocracyBeenDelegatedListByAddressWithPapi } from "next-common/utils/democracy/getDemocracyBeenDelegatedListByAddressWithPapi";

export default function useBeenDelegatedWithPapi(address) {
  const papi = useContextPapiApi();
  const [delegations, setDelegations] = useState();
  const [beenDelegatedList, setBeenDelegatedList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setDelegations();
    setBeenDelegatedList([]);

    if (!papi || !address) {
      return;
    }

    setIsLoading(true);
    Promise.all([
      papi.query.Democracy.VotingOf.getValue(address).then((voting) => {
        if (["Delegating", "Direct"].includes(voting.type)) {
          setDelegations(voting?.value?.delegations);
        } else {
          setDelegations(null);
        }
      }),
      getDemocracyBeenDelegatedListByAddressWithPapi(papi, address).then(
        (result) => {
          setBeenDelegatedList(result);
        },
      ),
    ]).finally(() => {
      setIsLoading(false);
    });
  }, [address, papi]);

  return { delegations, beenDelegatedList, isLoading };
}
