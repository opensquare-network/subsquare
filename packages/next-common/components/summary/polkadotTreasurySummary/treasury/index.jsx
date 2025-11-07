import LoadableContent from "next-common/components/common/loadableContent";
import Link from "next/link";
import { usePolkadotTreasury } from "next-common/context/treasury/polkadotTreasury";
import TokenSymbolAsset from "../common/tokenSymbolAsset";
import NativeTokenSymbolAsset from "../common/nativeTokenSymbolAsset";
import FiatPriceLabel from "../common/fiatPriceLabel";
import SummaryItem from "next-common/components/summary/layout/item";
import { StatemintTreasuryAccount } from "next-common/hooks/treasury/useAssetHubTreasuryBalance";
import { toPrecision } from "next-common/utils";
import { SYMBOL_DECIMALS } from "next-common/utils/consts/asset";
import Tooltip from "next-common/components/tooltip";
import { useChain } from "next-common/context/chain";

function TreasurySummary({
  nativeTreasuryBalance,
  usdtTreasuryBalance,
  usdcTreasuryBalance,
}) {
  return (
    <div className="flex flex-col gap-[4px]">
      <div className="!ml-0 flex flex-col gap-y-1">
        <NativeTokenSymbolAsset free={nativeTreasuryBalance} />
        <TokenSymbolAsset
          amount={toPrecision(usdcTreasuryBalance, SYMBOL_DECIMALS.USDC)}
          symbol="USDC"
        />
        <TokenSymbolAsset
          amount={toPrecision(usdtTreasuryBalance, SYMBOL_DECIMALS.USDT)}
          symbol="USDT"
        />
        <AddressLinks />
      </div>
    </div>
  );
}

export default function Treasury() {
  const {
    nativeTreasuryBalance,
    isNativeTreasuryBalanceLoading,
    usdtTreasuryBalance,
    isUsdtTreasuryBalanceLoading,
    usdcTreasuryBalance,
    isUsdcTreasuryBalanceLoading,
  } = usePolkadotTreasury();

  const isLoading =
    isNativeTreasuryBalanceLoading ||
    isUsdtTreasuryBalanceLoading ||
    isUsdcTreasuryBalanceLoading;

  return (
    <SummaryItem title="Treasury">
      <LoadableContent isLoading={isLoading}>
        <div className="flex flex-col gap-[4px]">
          <FiatPriceLabel
            free={nativeTreasuryBalance}
            usdtBalance={usdtTreasuryBalance}
            usdcBalance={usdcTreasuryBalance}
          />
          <TreasurySummary
            nativeTreasuryBalance={nativeTreasuryBalance}
            usdtTreasuryBalance={usdtTreasuryBalance}
            usdcTreasuryBalance={usdcTreasuryBalance}
          />
        </div>
      </LoadableContent>
    </SummaryItem>
  );
}

function AddressLink({ account, index }) {
  const chain = useChain();
  return (
    <Link
      className="text12Medium"
      href={`https://assethub-${chain}.statescan.io/#/accounts/${account}`}
      target="_blank"
      rel="noreferrer"
    >
      <Tooltip
        content={`Treasury account #${index}`}
        className="flex flex-nowrap whitespace-nowrap"
      >
        <span className="text-textTertiary hover:underline">Addr #{index}</span>
        <i className="text-textTertiary">&nbsp;↗</i>
      </Tooltip>
    </Link>
  );
}

function AddressLinks() {
  const { treasuryAccount } = usePolkadotTreasury();
  return (
    <div className="gap-x-1 grid grid-cols-3 max-sm:grid-cols-2">
      <AddressLink account={treasuryAccount} index={1} />
      <AddressLink account={StatemintTreasuryAccount} index={2} />
    </div>
  );
}
