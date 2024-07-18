import BigNumber from "bignumber.js";
import { useContextApi } from "next-common/context/api";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useEffect, useMemo, useState } from "react";
import { useKnownAssetHubAssets } from "next-common/components/assets/known";
import { useAllAssetMetadata } from "./context/assetMetadata";

const PolkadotAssetHubNativeToken = {
  symbol: "DOT",
  name: "Polkadot",
  decimals: 10,
  type: "native",
};

function useSubscribeMultiAssetAccounts(multiAccountKey) {
  const api = useContextApi();
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

function useSubscribeNativeBalance(address) {
  const api = useContextApi();
  const [balanceObj, setBalanceObj] = useState();

  useEffect(() => {
    if (!api || !address) {
      return;
    }

    let unsubNativeBalance;
    api.query.system
      .account(address, ({ data }) => {
        const { free, reserved, frozen } = data;
        const balance = (free.toBigInt() + reserved.toBigInt()).toString();
        const transferrable = (free.toBigInt() - frozen.toBigInt()).toString();
        setBalanceObj({ balance, transferrable });
      })
      .then((result) => (unsubNativeBalance = result));

    return () => {
      if (unsubNativeBalance) {
        unsubNativeBalance();
      }
    };
  }, [api, address]);

  return balanceObj;
}

export default function useMyAssets() {
  const address = useRealAddress();
  const allMetadata = useAllAssetMetadata();
  const multiAccountKey = useMemo(
    () => allMetadata?.map((item) => [item.assetId, address]),
    [allMetadata, address],
  );
  const multiAccounts = useSubscribeMultiAssetAccounts(multiAccountKey);
  const nativeBalanceObj = useSubscribeNativeBalance(address);
  const knownAssetDefs = useKnownAssetHubAssets();

  return useMemo(() => {
    if (!allMetadata || !multiAccounts || !nativeBalanceObj) {
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
    const knownAssetIds = knownAssetDefs.map((def) => def.assetId);
    const otherAssets = assets.filter(
      (asset) => !knownAssetIds.includes(asset.assetId),
    );

    const tokens = [
      { ...PolkadotAssetHubNativeToken, ...nativeBalanceObj },
      ...knownAssets,
      ...otherAssets,
    ];

    return tokens.filter((item) => !new BigNumber(item.balance || 0).isZero());
  }, [allMetadata, multiAccounts, nativeBalanceObj, knownAssetDefs]);
}
