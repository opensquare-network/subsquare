import { useEffect, useState } from "react";
import { useMountedState } from "react-use";
import { getAddressVotingBalance } from "next-common/utils/democracy/getAddressVotingBalance";
import { useChain } from "next-common/context/chain";

export function useAddressVotingBalance(api, address) {
  const [balance, setBalance] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const isMounted = useMountedState();
  const chain = useChain();

  useEffect(() => {
    if (!api || !address) {
      return;
    }

    setIsLoading(true);
    getAddressVotingBalance(chain, api, address)
      .then((value) => {
        if (isMounted()) {
          setBalance(value);
        }
      })
      .finally(() => {
        if (isMounted()) {
          setIsLoading(false);
        }
      });
  }, [api, chain, address, isMounted]);

  return { balance, isLoading };
}
