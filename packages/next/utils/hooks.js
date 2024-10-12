import { useEffect, useState } from "react";
import { useMountedState } from "react-use";
import { getAddressVotingBalance } from "next-common/utils/referendumUtil";

export function useAddressVotingBalance(api, address) {
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const isMounted = useMountedState();
  useEffect(() => {
    if (!api || !address) {
      return;
    }

    setIsLoading(true);
    getAddressVotingBalance(api, address)
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
  }, [api, address, isMounted]);
  return [balance, isLoading];
}
