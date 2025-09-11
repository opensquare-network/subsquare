import { useChainSettings } from "next-common/context/chain";
import { SYMBOL_DECIMALS } from "next-common/utils/consts/asset";

export default function useTreasurySpendRequest(extractedTreasuryInfo) {
  let { decimals } = useChainSettings();
  const {
    amount,
    assetKind: { chain: parachain, type, symbol } = {},
    beneficiary: { address: beneficiary } = {},
  } = extractedTreasuryInfo || {};
  if (type !== "native") {
    decimals = SYMBOL_DECIMALS[symbol];
  }

  return {
    parachain,
    amount,
    symbol,
    decimals,
    beneficiary,
  };
}
