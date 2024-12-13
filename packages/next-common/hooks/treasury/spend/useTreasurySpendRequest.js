import {
  getAssetByMeta,
  getParachainIdByMeta,
} from "next-common/utils/treasury/spend/usdCheck";
import getSpendBeneficiaryFromMeta from "next-common/utils/treasury/spend/beneficiary";
import { useChain, useChainSettings } from "next-common/context/chain";

export default function useTreasurySpendRequest(meta) {
  const chain = useChain();
  const chainSettings = useChainSettings();
  const parachain = getParachainIdByMeta(meta);
  const asset = getAssetByMeta(meta, chainSettings);
  const beneficiary = getSpendBeneficiaryFromMeta(meta, chain);

  return {
    parachain,
    amount: meta?.amount,
    symbol: asset?.symbol,
    decimals: asset?.decimals,
    beneficiary,
  };
}
