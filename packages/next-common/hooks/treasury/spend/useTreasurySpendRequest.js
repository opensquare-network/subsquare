import {
  getParachainId,
  isUsdtByMeta,
  isUsdcByMeta,
} from "next-common/utils/treasury/spend/usdCheck";
import getSpendBeneficiaryFromMeta from "next-common/utils/treasury/spend/beneficiary";
import { useChain } from "next-common/context/chain";

export default function useTreasurySpendRequest(meta) {
  const chain = useChain();
  const { location } = meta?.assetKind?.v3 || {};
  const parachain = getParachainId(location);
  const isAssetHubUsdt = isUsdtByMeta(meta);
  const isAssetHubUsdc = isUsdcByMeta(meta);
  const beneficiary = getSpendBeneficiaryFromMeta(meta, chain);

  return {
    parachain,
    isAssetHubUsdt,
    isAssetHubUsdc,
    amount: meta?.amount,
    symbol: isAssetHubUsdt ? "USDT" : isAssetHubUsdc ? "USDC" : null,
    decimals: isAssetHubUsdt || isAssetHubUsdc ? 6 : null,
    beneficiary,
  };
}
