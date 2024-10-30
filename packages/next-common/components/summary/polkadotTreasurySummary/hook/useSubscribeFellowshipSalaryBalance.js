import { useChain } from "next-common/context/chain";
import Chains from "next-common/utils/consts/chains";
import { getAssetBySymbol } from "next-common/hooks/treasury/useAssetHubTreasuryBalance";
import useSubscribeAssetHubAssets from "next-common/hooks/assetHub/useSubscribeAssetHubAssets";

export const StatemintFellowShipSalaryAccount =
  "13w7NdvSR1Af8xsQTArDtZmVvjE8XhWNdL4yed3iFHrUNCnS";

export default function useSubscribeFellowshipSalaryBalance(symbol) {
  const chain = useChain();

  let salaryAccount = null;

  if (chain === Chains.polkadot) {
    salaryAccount = StatemintFellowShipSalaryAccount;
  }

  const asset = getAssetBySymbol(symbol);
  return useSubscribeAssetHubAssets(asset.id, salaryAccount);
}
