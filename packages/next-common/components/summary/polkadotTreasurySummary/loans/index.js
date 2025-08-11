import SummaryLabelLinkItem from "../common/summaryLabelLinkItem";
import FiatPriceLabel from "../common/fiatPriceLabel";
import SummaryItem from "next-common/components/summary/layout/item";
import { toPrecision } from "next-common/utils";
import { useChainSettings } from "next-common/context/chain";
import ValueDisplay from "next-common/components/valueDisplay";
import BigNumber from "bignumber.js";
import { usePolkadotTreasury } from "next-common/context/treasury/polkadotTreasury";

function LoansItemList() {
  const {
    loanBifrostDotBalance,
    loadPendulumDotBalance,
    loanHydrationDotBalance,
  } = usePolkadotTreasury();

  const { decimals, symbol } = useChainSettings();
  const bifrostDotAmount = toPrecision(loanBifrostDotBalance || 0, decimals);
  const pendulumDotAmount = toPrecision(loadPendulumDotBalance || 0, decimals);
  const hydrationDotAmount = toPrecision(
    loanHydrationDotBalance || 0,
    decimals,
  );

  return (
    <div className="flex flex-col gap-[4px]">
      <SummaryLabelLinkItem
        label="Bifrost"
        href="https://polkadot.subsquare.io/referenda/432"
      >
        <ValueDisplay
          value={bifrostDotAmount}
          symbol={symbol}
          className={"text12Medium text-textPrimary"}
          tooltipClassName={"inline-flex items-center"}
        />
      </SummaryLabelLinkItem>
      <SummaryLabelLinkItem
        label="Pendulum"
        href="https://polkadot.subsquare.io/referenda/748"
      >
        <ValueDisplay
          value={pendulumDotAmount}
          symbol={symbol}
          className={"text12Medium text-textPrimary"}
          tooltipClassName={"inline-flex items-center"}
        />
      </SummaryLabelLinkItem>
      <SummaryLabelLinkItem
        label="Hydration"
        href="https://polkadot.subsquare.io/referenda/560"
      >
        <ValueDisplay
          value={hydrationDotAmount}
          symbol={symbol}
          className={"text12Medium text-textPrimary"}
          tooltipClassName={"inline-flex items-center"}
        />
      </SummaryLabelLinkItem>
    </div>
  );
}

export default function Loans() {
  const {
    loanBifrostDotBalance,
    loadPendulumDotBalance,
    loanHydrationDotBalance,
  } = usePolkadotTreasury();

  return (
    <SummaryItem title="Loans">
      <div className="flex flex-col gap-[4px]">
        <FiatPriceLabel
          free={new BigNumber(loanBifrostDotBalance)
            .plus(loadPendulumDotBalance)
            .plus(loanHydrationDotBalance)
            .toString()}
        />
        <LoansItemList />
      </div>
    </SummaryItem>
  );
}
