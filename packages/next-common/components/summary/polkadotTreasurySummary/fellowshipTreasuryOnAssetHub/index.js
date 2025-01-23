import LoadableContent from "next-common/components/common/loadableContent";
import SummaryLabelLinkItem from "../common/summaryLabelLinkItem";
import { usePolkadotTreasury } from "next-common/context/treasury/polkadotTreasury";
import FiatPriceLabel from "../common/fiatPriceLabel";
import SummaryItem from "next-common/components/summary/layout/item";
import { StatemintFellowShipTreasuryAccount } from "next-common/hooks/treasury/useAssetHubTreasuryBalance";
import { toPrecision } from "next-common/utils";
import { SYMBOL_DECIMALS } from "next-common/utils/consts/asset";
import { StatemintFellowShipSalaryAccount } from "next-common/context/treasury/polkadotTreasury/hooks/useQueryFellowshipSalaryBalance";
import { useChainSettings } from "next-common/context/chain";
import ValueDisplay from "next-common/components/valueDisplay";

function FellowshipTreasuryItemList({
  fellowshipTreasuryDotBalance,
  fellowshipSalaryUsdtBalance,
}) {
  const { decimals, symbol } = useChainSettings();
  const fellowshipFreeBalance = toPrecision(
    fellowshipTreasuryDotBalance || 0,
    decimals,
  );

  return (
    <div className="flex flex-col gap-[4px]">
      <SummaryLabelLinkItem
        label="Treasury"
        href={`https://assethub-polkadot.subscan.io/account/${StatemintFellowShipTreasuryAccount}`}
      >
        <ValueDisplay
          value={fellowshipFreeBalance}
          symbol={symbol}
          className={"text12Medium text-textPrimary"}
          tooltipClassName={"inline-flex items-center"}
        />
      </SummaryLabelLinkItem>
      <SummaryLabelLinkItem
        label="Salary"
        href={`https://assethub-polkadot.subscan.io/account/${StatemintFellowShipSalaryAccount}`}
      >
        <ValueDisplay
          value={toPrecision(fellowshipSalaryUsdtBalance, SYMBOL_DECIMALS.USDT)}
          symbol="USDT"
          className={"text12Medium text-textPrimary"}
          tooltipClassName={"inline-flex items-center"}
        />
      </SummaryLabelLinkItem>
    </div>
  );
}

export default function FellowshipTreasuryOnAssetHub() {
  const {
    fellowshipTreasuryDotBalance,
    isFellowshipTreasuryDotBalanceLoading,
    fellowshipSalaryUsdtBalance,
    isFellowshipSalaryUsdtBalanceLoading,
  } = usePolkadotTreasury();

  return (
    <SummaryItem title="Fellowship">
      <LoadableContent
        isLoading={
          isFellowshipTreasuryDotBalanceLoading ||
          isFellowshipSalaryUsdtBalanceLoading
        }
      >
        <div className="flex flex-col gap-[4px]">
          <FiatPriceLabel
            free={fellowshipTreasuryDotBalance}
            usdtBalance={fellowshipSalaryUsdtBalance}
          />
          <FellowshipTreasuryItemList
            fellowshipTreasuryDotBalance={fellowshipTreasuryDotBalance}
            fellowshipSalaryUsdtBalance={fellowshipSalaryUsdtBalance}
          />
        </div>
      </LoadableContent>
    </SummaryItem>
  );
}
