import { useEffect, useState } from "react";
import { isNil } from "lodash-es";
import { getAssetHubPapi } from "next-common/utils/assetHub";
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
export async function fetchPsmData(api) {
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

  if (!psmEntries.length) {
    return null;
  }

  // Metadata is needed for the internal asset and for every approved external one.
  const indices = new Set(
    [
      assetIndexFromLocation(psmEntries[0].keyArgs?.[0]),
      ...externalEntries.map((entry) =>
        assetIndexFromLocation(entry.keyArgs?.[1]),
      ),
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
  });
}

export default function usePsmData() {
  const [state, setState] = useState({ isLoading: true });

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const api = await getAssetHubPapi();
        const data = await fetchPsmData(api);

        if (isMounted) {
          setState({ data, isLoading: false });
        }
      } catch (error) {
        console.error("Failed to fetch dotUSD PSM data", error);

        if (isMounted) {
          setState({ isLoading: false });
        }
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  return state;
}
