import LoadableContent from "next-common/components/common/loadableContent";
import SummaryLabelLinkItem from "../common/summaryLabelLinkItem";
import { usePolkadotTreasurySummary } from "../context";
import FiatPriceLabel from "../common/fiatPriceLabel";
import SummaryItem from "next-common/components/summary/layout/item";
import { StatemintFellowShipTreasuryAccount } from "next-common/hooks/treasury/useAssetHubTreasuryBalance";
import { toPrecision } from "next-common/utils";
import { SYMBOL_DECIMALS } from "next-common/utils/consts/asset";
import { StatemintFellowShipSalaryAccount } from "../hook/useSubscribeFellowshipSalaryBalance";
import { useChainSettings } from "next-common/context/chain";
import ValueDisplay from "next-common/components/valueDisplay";

function FellowshipTreasuryItemList({
  fellowshipFree,
  fellowshipSalaryUsdtBalance,
}) {
  const { decimals, symbol } = useChainSettings();
  const fellowshipFreeBalance = toPrecision(fellowshipFree || 0, decimals);

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
          symbol="USDt"
          className={"text12Medium text-textPrimary"}
          tooltipClassName={"inline-flex items-center"}
        />
      </SummaryLabelLinkItem>
    </div>
  );
}

export default function FellowshipTreasuryOnAssetHub() {
  const {
    fellowshipFree,
    isFellowshipLoading,
    fellowshipSalaryUsdtBalance,
    isFellowshipSalaryUsdtBalanceLoading,
  } = usePolkadotTreasurySummary();

  return (
    <SummaryItem title="Fellowship">
      <LoadableContent
        isLoading={isFellowshipLoading || isFellowshipSalaryUsdtBalanceLoading}
      >
        <div className="flex flex-col gap-[16px]">
          <FiatPriceLabel
            free={fellowshipFree}
            USDtBalance={fellowshipSalaryUsdtBalance}
          />
          <FellowshipTreasuryItemList
            fellowshipFree={fellowshipFree}
            fellowshipSalaryUsdtBalance={fellowshipSalaryUsdtBalance}
          />
        </div>
      </LoadableContent>
    </SummaryItem>
  );
}
