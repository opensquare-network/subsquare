import { useCollectivesSection } from "next-common/context/collectives/collectives";
import useChainOrScanHeight from "next-common/hooks/height";
import { getSalaryAsset } from "next-common/utils/consts/getSalaryAsset";

/**
 * React hook that returns the salary asset info.
 * Automatically reads the current section from CollectivesContext.
 * If blockHeight is not provided, uses the current chain/scan height.
 *
 * @param {number} [blockHeight] - Optional block height to determine asset switching
 * @returns {{ symbol: string, decimals: number }}
 *
 * Usage:
 *   // With explicit blockHeight (from API data)
 *   const { symbol, decimals } = useSalaryAsset(data.paidIndexer?.blockHeight);
 *
 *   // Without blockHeight (uses current chain height for live data)
 *   const { symbol, decimals } = useSalaryAsset();
 */
export function useSalaryAsset(blockHeight) {
  const section = useCollectivesSection();
  const height = useChainOrScanHeight();
  return getSalaryAsset(section, blockHeight ?? height);
}
