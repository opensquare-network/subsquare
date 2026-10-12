import { useEffect, useState } from "react";
import { isNil } from "lodash-es";
import { getAssetHubPapi } from "next-common/utils/assetHub";
import {
  assetIndexFromLocation,
  parsePalletsOrigin,
  permillRange,
  sumValues,
  symbolOf,
  toJsonSafe,
} from "./psmUtils";

/**
 * Reads the state of the dotUSD PSM instance from Asset Hub.
 * Exported separately from the hook so it can be exercised without React.
 */
export async function fetchPsmData(api) {
  const psmEntries = await api.query.Psm.Psm.getEntries();

  if (!psmEntries.length) {
    return null;
  }

  // Polkadot Asset Hub runs a single PSM instance, the internal asset is dotUSD.
  const [{ keyArgs, value: instance }] = psmEntries;
  // BigInt junction values would break the JSON serialisation in the location popup.
  const internalLocation = toJsonSafe(keyArgs?.[0] ?? null);
  const internalIndex = assetIndexFromLocation(internalLocation);
  const internalMetadata = isNil(internalIndex)
    ? null
    : await api.query.Assets.Metadata.getValue(internalIndex).catch(() => null);

  const adminEntry = (await api.query.Psm.PsmAdmin.getEntries()).find(
    (entry) => assetIndexFromLocation(entry.keyArgs?.[0]) === internalIndex,
  );

  return {
    fullAdmin: parsePalletsOrigin(adminEntry?.value?.full_admin),
    emergencyAdmin: parsePalletsOrigin(adminEntry?.value?.emergency_admin),
    internalAsset: {
      index: internalIndex,
      location: internalLocation,
      symbol: symbolOf(internalMetadata) ?? "dotUSD",
      decimals: internalMetadata?.decimals ?? instance?.internal_decimals ?? 0,
    },
    maxDebt: instance?.max_debt?.toString(),
    minSwapAmount: instance?.min_swap_amount?.toString(),
    feeDestination: isNil(instance?.fee_destination)
      ? null
      : String(instance.fee_destination),
    externalCount: Number(instance?.external_count ?? 0),
    totalDebt: sumValues(
      await api.query.Psm.PsmDebt.getEntries(),
    ).toString(),
    mintingFee: permillRange(await api.query.Psm.MintingFee.getEntries()),
    redemptionFee: permillRange(await api.query.Psm.RedemptionFee.getEntries()),
  };
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
