import { useState, useEffect } from "react";

export default function useSubscribeMultiAssetAccounts(multiAccountKey, api) {
  const [multiAccounts, setMultiAccounts] = useState();

  useEffect(() => {
    if (!api || !multiAccountKey) {
      return;
    }

    let unsubFunc;
    api.query.assets.account
      .multi(multiAccountKey, (data) => {
        setMultiAccounts(data);
      })
      .then((result) => (unsubFunc = result));

    return () => {
      if (unsubFunc) {
        unsubFunc();
      }
    };
  }, [api, multiAccountKey]);

  return multiAccounts;
}
