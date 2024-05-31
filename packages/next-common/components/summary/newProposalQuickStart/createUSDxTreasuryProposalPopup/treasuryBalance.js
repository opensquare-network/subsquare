import BigNumber from "bignumber.js";
import Loading from "next-common/components/loading";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChain, useChainSettings } from "next-common/context/chain";
import useFetch from "next-common/hooks/useFetch";
import { toPrecisionNumber } from "next-common/utils";

export default function TreasuryBalance({ symbol, isLoading, value }) {
  const chain = useChain();
  const { decimals } = useChainSettings();
  const amount = toPrecisionNumber(value, decimals);

  const { loading: isPriceLoading, value: priceData } = useFetch(
    `https://${chain}-api.dotreasury.com/overview`,
  );
  const latestSymbolPrice = priceData?.latestSymbolPrice;
  const usdxAmount = new BigNumber(amount).times(latestSymbolPrice).toFixed();

  return (
    <div className="flex items-center gap-[8px] text12Bold text-textPrimary [&_.value-display-symbol]:text-textPrimary">
      <span className="text12Medium text-textTertiary">Treasury Balance</span>
      {isLoading || isPriceLoading ? (
        <Loading size={16} />
      ) : (
        <ValueDisplay value={usdxAmount} symbol={symbol} />
      )}
    </div>
  );
}
