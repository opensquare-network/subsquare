import { createSdkContext, findNestedKey } from "@galacticcouncil/sdk";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { useCallback, useState, useEffect } from "react";
import { HUB_ID } from "../utils";

//  Hydration SDK in provider?
const ws = "wss://rpc.hydradx.cloud";
const wsProvider = new WsProvider(ws, 2_500, {}, 60_000, 102400, 10 * 60_000);

const api = await ApiPromise.create({
  provider: wsProvider,
});

const sdk = await createSdkContext(api);

const NATIVE_ASSET_ID = "0";
const bannedAssets = ["1000042"];

const ASSETHUB_ID_BLACKLIST = [
  "34",
  "41",
  "43",
  "47",
  "49",
  "52",
  "53",
  "54",
  "65",
  "73",
  "74",
  "75",
  "92",
  "92",
  "97",
  "22222000",
  "22222001",
  "22222002",
  "22222003",
  "22222004",
  "50000019",
  "50000030",
  "50000031",
  "50000032",
  "50000033",
  "50000034",
];

const getFullAsset = (asset) => {
  const isToken = asset.type === "Token";
  const isBond = asset.type === "Bond";
  const isStableSwap = asset.type === "StableSwap";
  const isExternal = asset.type === "External";
  const isErc20 = asset.type === "Erc20";
  const isShareToken = false;

  const parachainEntry = findNestedKey(asset.location, "parachain");

  return {
    ...asset,
    parachainId: parachainEntry?.parachain.toString() || undefined,
    existentialDeposit: asset.existentialDeposit,
    isToken,
    isBond,
    isStableSwap,
    isExternal,
    isErc20,
    isShareToken,
  };
};

export default function useAllAssets() {
  const { client } = sdk ?? {};
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAllAssets = useCallback(async () => {
    setLoading(true);
    try {
      const assets = await client.asset.getOnChainAssets();
      const allAssets = assets.reduce(
        (acc, assetRaw) => {
          if (bannedAssets.includes(assetRaw.id)) return acc;

          const asset = {
            ...getFullAsset(assetRaw),
          };

          if (
            asset?.externalId &&
            ASSETHUB_ID_BLACKLIST.includes(asset.externalId)
          ) {
            return acc;
          }

          acc.all.set(asset.id, asset);

          if (asset.id === NATIVE_ASSET_ID) {
            acc.native = asset;
          }

          if (asset.id === HUB_ID) {
            acc.hub = asset;
          }

          return acc;
        },
        {
          all: new Map([]),
          native: {},
          hub: {},
        },
      );

      setData(allAssets);
    } catch (error) {
      console.error("Error fetching assets:", error);
    } finally {
      setLoading(false);
    }
  }, [client.asset]);

  useEffect(() => {
    if (!client) {
      return;
    }
    fetchAllAssets();
  }, [fetchAllAssets, client]);

  return { data, loading };
}
