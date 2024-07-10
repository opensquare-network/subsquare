import {
  AssetIconDed,
  AssetIconDot,
  AssetIconPink,
  AssetIconUsdc,
  AssetIconUsdt,
} from "@osn/icons/subsquare";
import BigNumber from "bignumber.js";
import { useContextApi } from "next-common/context/api";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useEffect, useMemo, useState } from "react";

const PolkadotAssetHubAssets = [
  {
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6,
    type: "asset",
    assetId: 1337,
    icon: AssetIconUsdc,
  },
  {
    symbol: "USDt",
    name: "Tether USD",
    decimals: 6,
    type: "asset",
    assetId: 1984,
    icon: AssetIconUsdt,
  },
  {
    symbol: "DED",
    name: "DED",
    decimals: 10,
    type: "asset",
    assetId: 30,
    icon: AssetIconDed,
  },
  {
    symbol: "DOTA",
    name: "DOTA",
    decimals: 4,
    type: "asset",
    assetId: 18,
    icon: AssetIconDed,
  },
  {
    symbol: "PINK",
    name: "PINK",
    decimals: 10,
    type: "asset",
    assetId: 23,
    icon: AssetIconPink,
  },
];

const PolkadotAssetHubNativeToken = {
  symbol: "DOT",
  name: "Polkadot",
  decimals: 10,
  type: "native",
  icon: AssetIconDot,
};

export default function useAssets() {
  const api = useContextApi();
  const address = useRealAddress();
  const [multiBalances, setMultiBalances] = useState([]);
  const [multiMetadata, setMultiMetadata] = useState([]);
  const [nativeBalance, setNativeBalance] = useState();

  useEffect(() => {
    if (!api || !address) {
      return;
    }

    const unsubBalance = api.query.assets.account.multi(
      PolkadotAssetHubAssets.map((item) => [item.assetId, address]),
      (data) => {
        setMultiBalances(data);
      },
    );

    const unsubMetadata = api.query.assets.metadata.multi(
      PolkadotAssetHubAssets.map((item) => item.assetId),
      (data) => {
        setMultiMetadata(data);
      },
    );

    const unsubNativeBalance = api.query.system.account(address, (data) => {
      const { free, reserved } = data.data.toJSON();
      setNativeBalance(new BigNumber(free).plus(reserved).toFixed());
    });

    () => {
      unsubBalance();
      unsubMetadata();
      unsubNativeBalance();
    };
  }, [api, address]);

  return useMemo(() => {
    if (!multiBalances.length || !multiMetadata.length || !nativeBalance) {
      return null;
    }

    const tokens = [
      { ...PolkadotAssetHubNativeToken, balance: nativeBalance },
      ...PolkadotAssetHubAssets.map((item, index) => {
        const balance = multiBalances[index];
        const metadata = multiMetadata[index];
        const balanceValue = balance.toJSON();

        return {
          ...item,
          symbol: metadata.symbol.toHuman(),
          name: metadata.name.toHuman(),
          decimals: metadata.decimals.toNumber(),
          isFrozen: metadata.isFrozen.toJSON(),
          balance: balanceValue?.balance,
        };
      }),
    ];

    return tokens.filter((item) => !new BigNumber(item.balance || 0).isZero());
  }, [multiMetadata, multiBalances, nativeBalance]);
}
