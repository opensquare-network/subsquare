import { useEffect, useState } from "react";
import { useMountedState } from "react-use";

export async function getAddressVotingBalance(api, address) {
  const account = await api.query.system.account(address);
  const jsonAccount = account?.toJSON();
  return jsonAccount?.data?.free;
}

export function useAddressVotingBalance(api, address) {
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const isMounted = useMountedState();
  useEffect(() => {
    if (api && address) {
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
    }
  }, [api, address, isMounted]);
  return [balance, isLoading];
}
