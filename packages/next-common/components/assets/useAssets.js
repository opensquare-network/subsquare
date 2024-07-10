import BigNumber from "bignumber.js";
import { useContextApi } from "next-common/context/api";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useEffect, useMemo, useState } from "react";

const PolkadotAssetHubNativeToken = {
  symbol: "DOT",
  name: "Polkadot",
  decimals: 10,
  type: "native",
};

function useAllAssetMetadata() {
  const api = useContextApi();
  const [allMetadata, setAllMetadata] = useState();

  useEffect(() => {
    if (!api) {
      return;
    }

    api.query.assets.metadata.entries().then((data) => {
      const result = data.map((item) => {
        const [
          {
            args: [id],
          },
          metadata,
        ] = item;
        const assetId = id.toNumber();
        return {
          assetId,
          symbol: metadata.symbol.toHuman(),
          name: metadata.name.toHuman(),
          decimals: metadata.decimals.toNumber(),
          isFrozen: metadata.isFrozen.toJSON(),
        };
      });
      setAllMetadata(result);
    });
  }, [api]);

  return allMetadata;
}

export default function useAssets() {
  const api = useContextApi();
  const address = useRealAddress();
  const allMetadata = useAllAssetMetadata();
  const [multiBalances, setMultiBalances] = useState();
  const [nativeBalance, setNativeBalance] = useState();

  useEffect(() => {
    if (!api || !allMetadata || !address) {
      return;
    }

    let unsubBalance;
    api.query.assets.account
      .multi(
        allMetadata.map((item) => [item.assetId, address]),
        (data) => {
          setMultiBalances(data);
        },
      )
      .then((result) => (unsubBalance = result));

    let unsubNativeBalance;
    api.query.system
      .account(address, ({ data }) => {
        const { free, reserved } = data;
        setNativeBalance((free.toBigInt() + reserved.toBigInt()).toString());
      })
      .then((result) => (unsubNativeBalance = result));

    return () => {
      unsubBalance();
      unsubNativeBalance();
    };
  }, [api, allMetadata, address]);

  return useMemo(() => {
    if (!allMetadata || !multiBalances || !nativeBalance) {
      return null;
    }

    const tokens = [
      { ...PolkadotAssetHubNativeToken, balance: nativeBalance },
      ...(allMetadata || []).map((item, index) => {
        const balance = multiBalances[index];
        const balanceValue = balance?.toJSON();

        return {
          ...item,
          balance: balanceValue?.balance,
        };
      }),
    ];

    return tokens.filter((item) => !new BigNumber(item.balance || 0).isZero());
  }, [allMetadata, multiBalances, nativeBalance]);
}
