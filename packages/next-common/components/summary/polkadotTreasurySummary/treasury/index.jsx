import LoadableContent from "next-common/components/common/loadableContent";
import { usePolkadotTreasury } from "next-common/context/treasury/polkadotTreasury";
import TokenSymbolAsset from "../common/tokenSymbolAsset";
import NativeTokenSymbolAsset from "../common/nativeTokenSymbolAsset";
import FiatPriceLabel from "../common/fiatPriceLabel";
import SummaryItem from "next-common/components/summary/layout/item";
import { StatemintTreasuryAccount } from "next-common/hooks/treasury/useAssetHubTreasuryBalance";
import { toPrecision } from "next-common/utils";
import { SYMBOL_DECIMALS } from "next-common/utils/consts/asset";
import { useChain } from "next-common/context/chain";
import AddressLinks from "next-common/components/styled/addressLinks";

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
        <TreasuryAddressLinks />
      </div>
    </div>
  );
}

export default function Treasury() {
  const {
    isNativeLoading,
    totalNativeFree,
    totalUsdtBalance,
    isUsdtLoading,
    totalUsdcBalance,
    isUsdcLoading,
  } = usePolkadotTreasury();

  const isLoading = isNativeLoading || isUsdtLoading || isUsdcLoading;

  return (
    <SummaryItem title="Treasury">
      <LoadableContent isLoading={isLoading}>
        <div className="flex flex-col gap-[4px]">
          <FiatPriceLabel
            free={totalNativeFree}
            usdtBalance={totalUsdtBalance}
            usdcBalance={totalUsdcBalance}
          />
          <TreasurySummary
            nativeTreasuryBalance={totalNativeFree}
            usdtTreasuryBalance={totalUsdtBalance}
            usdcTreasuryBalance={totalUsdcBalance}
          />
        </div>
      </LoadableContent>
    </SummaryItem>
  );
}

function TreasuryAddressLinks() {
  const chain = useChain();
  const { treasuryAccount } = usePolkadotTreasury();
  return (
    <AddressLinks
      items={[
        {
          href: `https://assethub-${chain}.statescan.io/#/accounts/${treasuryAccount}`,
          tooltip: "Treasury account #1",
        },
        {
          href: `https://assethub-${chain}.statescan.io/#/accounts/${StatemintTreasuryAccount}`,
          tooltip: "Treasury account #2",
        },
      ]}
    />
  );
}
