import BigNumber from "bignumber.js";
import { useContextApi } from "next-common/context/api";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useKnownAssetHubAssets } from "next-common/components/assets/known";
import useSubStorage from "next-common/hooks/common/useSubStorage";
import useSubscribeMultiAssetAccounts from "next-common/utils/hooks/useSubscribeMultiAssetAccounts";
import calcTransferable from "next-common/utils/account/transferable";
import useQueryExistentialDeposit from "next-common/utils/hooks/chain/useQueryExistentialDeposit";
import useAllAssetMetadata from "next-common/components/assets/context/assetMetadata";

export function useSubscribeAssetHubAssets(api, assetId, address) {
  const [free, setFree] = useState(0);

  const { loading } = useSubStorage("assets", "account", [assetId, address], {
    api,
    callback: useCallback((data) => {
      const free = data?.toJSON();
      setFree(free);
    }, []),
  });

  return { free, isLoading: loading };
}

const PolkadotAssetHubNativeToken = {
  symbol: "DOT",
  name: "Polkadot",
  decimals: 10,
  type: "native",
};

function useSubscribeNativeBalance(address) {
  const [accountInfo, setAccountInfo] = useState();
  const existentialDeposit = useQueryExistentialDeposit();

  useSubStorage("system", "account", [address], {
    callback: useCallback(({ data }) => setAccountInfo(data.toJSON()), []),
  });

  return useMemo(() => {
    if (!accountInfo) {
      return null;
    }

    const { free, reserved } = accountInfo;
    const balance = (free + reserved).toString();
    const transferrable = calcTransferable(accountInfo, existentialDeposit);

    return { balance, transferrable };
  }, [accountInfo, existentialDeposit]);
}

export function useMyNativeAsset() {
  const address = useRealAddress();
  const nativeBalanceObj = useSubscribeNativeBalance(address);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (nativeBalanceObj) {
      setLoading(false);
    }
  }, [nativeBalanceObj]);

  return {
    loading,
    value: {
      ...PolkadotAssetHubNativeToken,
      ...nativeBalanceObj,
    },
  };
}

export default function useSubscribe1AssetHubAssets(api) {
  const address = useRealAddress();
  const [allMetadata] = useAllAssetMetadata();
  const multiAccountKey = useMemo(
    () => allMetadata?.map((item) => [item.assetId, address]),
    [allMetadata, address],
  );
  const multiAccounts = useSubscribeMultiAssetAccounts(multiAccountKey, api);
  const knownAssetDefs = useKnownAssetHubAssets();

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
    console.log(":::::knownAssets, assets", knownAssets, assets);
    return knownAssets;
  }, [allMetadata, multiAccounts, knownAssetDefs]);
}
