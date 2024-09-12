import {
  getAssetByMeta,
  getParachainIdByMeta,
} from "next-common/utils/treasury/spend/usdCheck";
import getSpendBeneficiaryFromMeta from "next-common/utils/treasury/spend/beneficiary";
import { useChain } from "next-common/context/chain";

export default function useTreasurySpendRequest(meta) {
  const chain = useChain();
  const parachain = getParachainIdByMeta(meta);
  const asset = getAssetByMeta(meta);
  const beneficiary = getSpendBeneficiaryFromMeta(meta, chain);

  return {
    parachain,
    amount: meta?.amount,
    symbol: asset?.symbol,
    decimals: asset?.decimals,
    beneficiary,
  };
}
