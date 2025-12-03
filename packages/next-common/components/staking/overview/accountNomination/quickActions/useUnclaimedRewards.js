import { useState, useEffect } from "react";
import { useContextApi } from "next-common/context/api";
import { BN } from "@polkadot/util";

// TODO: fix query
export default function useUnclaimedRewards(address) {
  const api = useContextApi();
  const [data, setData] = useState({
    amount: new BN(0),
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    if (!api || !address) return;

    setData({ amount: new BN(0), isLoading: true, error: null });

    api.derive.staking
      .account(address)
      .then((account) => {
        const unclaimed = account.unclaimedRewards || new BN(0);
        setData({
          amount: unclaimed,
          isLoading: false,
          error: null,
        });
      })
      .catch((e) => {
        setData({
          amount: new BN(0),
          isLoading: false,
          error: e.message,
        });
      });
  }, [api, address]);

  return data;
}
