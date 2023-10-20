import { useEffect, useState } from "react";
import useIsMounted from "next-common/utils/hooks/useIsMounted";

export async function getAddressVotingBalance(api, address) {
  const account = await api.query.system.account(address);
  const jsonAccount = account?.toJSON();
  return jsonAccount?.data?.free;
}

export function useAddressVotingBalance(api, address) {
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const isMounted = useIsMounted();
  useEffect(() => {
    if (api && address) {
      setIsLoading(true);
      getAddressVotingBalance(api, address)
        .then((value) => {
          if (isMounted.current) {
            setBalance(value);
          }
        })
        .finally(() => {
          if (isMounted.current) {
            setIsLoading(false);
          }
        });
    }
  }, [api, address, isMounted]);
  return [balance, isLoading];
}
