import BigNumber from "bignumber.js";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useEffect, useMemo, useState } from "react";
import { useAllAssetMetadata } from "next-common/components/assets/context/assetMetadata.js";
import { useAssetHubApi } from "next-common/context/assetHub";

function useSubscribeMultiAssetAccounts(multiAccountKey) {
  const api = useAssetHubApi();
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

export default function useAssetHubOnPolkadot() {
  const address = useRealAddress();
  const allMetadata = useAllAssetMetadata();
  const multiAccountKey = useMemo(
    () => allMetadata?.map((item) => [item.assetId, address]),
    [allMetadata, address],
  );
  const multiAccounts = useSubscribeMultiAssetAccounts(multiAccountKey);

  return useMemo(() => {
    if (!allMetadata || !multiAccounts) {
      return null;
    }

    const assets = (allMetadata || []).reduce((result, item, index) => {
      const account = multiAccounts[index];
      if (account.isNone) {
        return result;
      }

      const unwrapped = account.unwrap();
      const balance = unwrapped.balance.toString();
      const transferrable = unwrapped.status.isFrozen ? 0 : balance;
      return [...result, { ...item, balance, transferrable }];
    }, []);

    const knownAssets = knownAssetDefs.reduce((result, def) => {
      const find = assets.find((asset) => asset.assetId === def.assetId);
      if (find) {
        return [...result, find];
      } else {
        return result;
      }
    }, []);

    return knownAssets.filter(
      (item) => !new BigNumber(item.balance || 0).isZero(),
    );
  }, [allMetadata, multiAccounts]);
}
