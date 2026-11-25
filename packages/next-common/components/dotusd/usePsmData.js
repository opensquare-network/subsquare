import { useCallback, useEffect, useRef, useState } from "react";
import { isNil } from "lodash-es";
import { getAssetHubPapi } from "next-common/utils/assetHub";
import { DOT_USD_ASSET_ID } from "./assetMetas";
import { assetIndexFromLocation, buildPsmData } from "./psmUtils";

async function fetchAssetMetadata(api, index) {
  if (isNil(index)) {
    return null;
  }

  return api.query.Assets.Metadata.getValue(index).catch(() => null);
}

/**
 * Reads the state of the dotUSD PSM instance from Asset Hub. The assembly itself lives in
 * buildPsmData, which is pure and covered by tests.
 */
export async function fetchPsmData(api, internalAssetIndex) {
  if (isNil(internalAssetIndex)) {
    return null;
  }

  const [
    psmEntries,
    externalEntries,
    weightEntries,
    debtEntries,
    feeEntries,
    redemptionEntries,
    adminEntries,
  ] = await Promise.all([
    api.query.Psm.Psm.getEntries(),
    api.query.Psm.ExternalAssets.getEntries(),
    api.query.Psm.AssetCeilingWeight.getEntries(),
    api.query.Psm.PsmDebt.getEntries(),
    api.query.Psm.MintingFee.getEntries(),
    api.query.Psm.RedemptionFee.getEntries(),
    api.query.Psm.PsmAdmin.getEntries(),
  ]);

  const belongsToInstance = (location) =>
    assetIndexFromLocation(location) === internalAssetIndex;
  const hasInstance = psmEntries.some((entry) =>
    belongsToInstance(entry.keyArgs?.[0]),
  );

  if (!hasInstance) {
    return null;
  }

  // Assets.Metadata only describes local assets, even when a foreign asset shares the index.
  const indices = new Set(
    [
      internalAssetIndex,
      ...externalEntries
        .filter((entry) => belongsToInstance(entry.keyArgs?.[0]))
        .map((entry) => assetIndexFromLocation(entry.keyArgs?.[1])),
    ].filter((index) => !isNil(index)),
  );
  const assetMetadata = new Map(
    await Promise.all(
      [...indices].map(async (index) => [
        index,
        await fetchAssetMetadata(api, index),
      ]),
    ),
  );

  return buildPsmData({
    psmEntries,
    externalEntries,
    weightEntries,
    debtEntries,
    feeEntries,
    redemptionEntries,
    adminEntries,
    assetMetadata,
    internalAssetIndex,
  });
}

export default function usePsmData() {
  const [state, setState] = useState({ isLoading: true });
  const isMountedRef = useRef(true);

  const load = useCallback(async () => {
    try {
      const api = await getAssetHubPapi();
      const data = await fetchPsmData(api, DOT_USD_ASSET_ID);

      if (isMountedRef.current) {
        setState({ data, isLoading: false });
      }
    } catch (error) {
      console.error("Failed to fetch dotUSD PSM data", error);

      if (isMountedRef.current) {
        setState({ isLoading: false });
      }
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    load();

    return () => {
      isMountedRef.current = false;
    };
  }, [load]);

  // The balances are subscriptions, but this snapshot is read once, so a mint leaves the debt,
  // utilisation and cap panels behind until the page is reloaded. `refresh` re-reads it; it
  // deliberately leaves `isLoading` alone so the tables do not flash.
  return { ...state, refresh: load };
}
