import { useChain } from "next-common/context/chain";
import Chains from "next-common/utils/consts/chains";
import { getAssetBySymbol } from "next-common/hooks/treasury/useAssetHubTreasuryBalance";
import useQueryAssetHubAssets from "next-common/hooks/assetHub/useQueryAssetHubAssets";

export const StatemintFellowShipSalaryAccount =
  "13w7NdvSR1Af8xsQTArDtZmVvjE8XhWNdL4yed3iFHrUNCnS";

export default function useQueryFellowshipSalaryBalance(symbol) {
  const chain = useChain();
  if (![Chains.polkadot, Chains.collectives].includes(chain)) {
    throw new Error("Not in correct chain to query fellowship salary balance");
  }

  const asset = getAssetBySymbol(symbol);
  return useQueryAssetHubAssets(asset.id, StatemintFellowShipSalaryAccount);
}
