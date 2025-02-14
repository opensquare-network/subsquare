import SummaryLabelLinkItem from "next-common/components/summary/polkadotTreasurySummary/common/summaryLabelLinkItem";
import SummaryItem from "next-common/components/summary/layout/item";
import FiatPriceLabel from "../common/fiatPriceLabel";
import { toPrecision } from "next-common/utils";
import { useChainSettings } from "next-common/context/chain";
import ValueDisplay from "next-common/components/valueDisplay";
import BigNumber from "bignumber.js";
import { useKusamaTreasuryContext } from "next-common/context/treasury/kusamaTreasury";

function LoansItem() {
  const { loansHydrationNativeBalance } = useKusamaTreasuryContext();
  const { decimals, symbol } = useChainSettings();
  const hydrationKsmAmount = toPrecision(loansHydrationNativeBalance, decimals);

  return (
    <div className="flex flex-col gap-[4px]">
      <SummaryLabelLinkItem
        label="Hydration"
        href="https://kusama.subscan.io/account/HzdD44pR43GWAbpfhuKnbLAZJFJp7htBZFeRFSCMJMmHmzB"
      >
        <ValueDisplay
          value={hydrationKsmAmount}
          symbol={symbol}
          className={"text12Medium text-textPrimary"}
          tooltipClassName={"inline-flex items-center"}
        />
      </SummaryLabelLinkItem>
    </div>
  );
}

export default function Loans() {
  const { loansHydrationNativeBalance } = useKusamaTreasuryContext();

  return (
    <SummaryItem title="Loans">
      <div className="flex flex-col gap-[4px]">
        <FiatPriceLabel
          free={new BigNumber(loansHydrationNativeBalance).toString()}
        />
        <LoansItem />
      </div>
    </SummaryItem>
  );
}
