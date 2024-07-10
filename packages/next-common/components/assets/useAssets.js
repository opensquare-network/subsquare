import {
  AssetIconDed,
  AssetIconDot,
  AssetIconPink,
  AssetIconPlaceholder,
  AssetIconUsdc,
  AssetIconUsdt,
} from "@osn/icons/subsquare";
import BigNumber from "bignumber.js";
import { useContextApi } from "next-common/context/api";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useEffect, useMemo, useState } from "react";

const PolkadotAssetHubAssets = [
  {
    // symbol: "USDC",
    assetId: 1337,
    icon: AssetIconUsdc,
  },
  {
    // symbol: "USDt",
    assetId: 1984,
    icon: AssetIconUsdt,
  },
  {
    // symbol: "DED",
    assetId: 30,
    icon: AssetIconDed,
  },
  {
    // symbol: "DOTA",
    assetId: 18,
    icon: AssetIconDed,
  },
  {
    // symbol: "PINK",
    assetId: 23,
    icon: AssetIconPink,
  },
];

const PolkadotAssetIconMap = new Map(
  PolkadotAssetHubAssets.map((item) => [item.assetId, item.icon]),
);

const PolkadotAssetHubNativeToken = {
  symbol: "DOT",
  name: "Polkadot",
  decimals: 10,
  type: "native",
  icon: AssetIconDot,
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

function useSubscribeMultiAssetAccounts(multiAccountKey) {
  const api = useContextApi();
  const [multiAccounts, setMultiAccounts] = useState();

  useEffect(() => {
    if (!api || !multiAccountKey) {
      return;
    }

    let unsubBalance;
    api.query.assets.account
      .multi(multiAccountKey, (data) => {
        setMultiAccounts(data);
      })
      .then((result) => (unsubBalance = result));

    return () => {
      unsubBalance();
    };
  }, [api, multiAccountKey]);

  return multiAccounts;
}

function useSubscribeNativeBalance(address) {
  const api = useContextApi();
  const [nativeBalance, setNativeBalance] = useState();

  useEffect(() => {
    if (!api || !address) {
      return;
    }

    let unsubNativeBalance;
    api.query.system
      .account(address, ({ data }) => {
        const { free, reserved } = data;
        setNativeBalance((free.toBigInt() + reserved.toBigInt()).toString());
      })
      .then((result) => (unsubNativeBalance = result));

    return () => {
      unsubNativeBalance();
    };
  }, [api, address]);

  return nativeBalance;
}

export default function useAssets() {
  const address = useRealAddress();
  const allMetadata = useAllAssetMetadata();
  const multiAccountKey = useMemo(
    () => allMetadata?.map((item) => [item.assetId, address]),
    [allMetadata, address],
  );
  const multiAccounts = useSubscribeMultiAssetAccounts(multiAccountKey);
  const nativeBalance = useSubscribeNativeBalance(address);

  return useMemo(() => {
    if (!allMetadata || !multiAccounts || !nativeBalance) {
      return null;
    }

    const tokens = [
      { ...PolkadotAssetHubNativeToken, balance: nativeBalance },
      ...(allMetadata || []).map((item, index) => {
        const account = multiAccounts[index];
        const accountValue = account?.toJSON();
        return {
          ...item,
          balance: accountValue?.balance,
          icon: PolkadotAssetIconMap.get(item.assetId) || AssetIconPlaceholder,
        };
      }),
    ];

    return tokens.filter((item) => !new BigNumber(item.balance || 0).isZero());
  }, [allMetadata, multiAccounts, nativeBalance]);
}
