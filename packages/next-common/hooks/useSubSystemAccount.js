import { useEffect, useState } from "react";

export default function useSubSystemAccount(api, address) {
  const [account, setAccount] = useState();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (!api || !address) {
      return;
    }

    api.query.system.account(address, (account) => {
      setAccount(account);
      setIsLoading(false);
    });
  }, [api, address]);

  if (!api) {
    return {
      account: null,
      isLoading: true,
    };
  }

  return {
    account,
    isLoading,
  };
}
