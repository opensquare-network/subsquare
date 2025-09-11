import { useEffect, useState } from "react";

export default function useSubSystemAccount(api, address) {
  const [account, setAccount] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (!api || !address) {
      return;
    }

    let unsub;
    api.query.system
      .account(address, (account) => {
        setAccount(account);
        setIsLoading(false);
      })
      .then((result) => (unsub = result));

    return () => {
      if (unsub) {
        unsub();
      }
    };
  }, [api, address]);

  return {
    account,
    isLoading,
  };
}
