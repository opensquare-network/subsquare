import SummaryLabelLinkItem from "../common/summaryLabelLinkItem";
import FiatPriceLabel from "../common/fiatPriceLabel";
import SummaryItem from "next-common/components/summary/layout/item";
import { toPrecision } from "next-common/utils";
import { SYMBOL_DECIMALS } from "next-common/utils/consts/asset";
import { useChainSettings } from "next-common/context/chain";
import ValueDisplay from "next-common/components/valueDisplay";
import BigNumber from "bignumber.js";
import SummaryLabelItem from "../common/summaryLabelItem";

function LoansItemList({
  centrifugeUsdcBalance,
  bifrostDotBalance,
  pendulumDotBalance,
}) {
  const { decimals, symbol } = useChainSettings();
  const bifrostDotAmount = toPrecision(bifrostDotBalance || 0, decimals);
  const pendulumDotAmount = toPrecision(pendulumDotBalance || 0, decimals);

  return (
    <div className="flex flex-col gap-[4px]">
      <SummaryLabelLinkItem
        label="Centrifuge"
        href={
          "https://assethub-polkadot.subscan.io/account/16hdUXXYjoBQBpdQ14z7qk372rwNHkdQJ9YyBuPaXiZcqnru"
        }
      >
        <ValueDisplay
          value={toPrecision(centrifugeUsdcBalance, SYMBOL_DECIMALS.USDT)}
          symbol={symbol}
          className={"text12Medium text-textPrimary"}
          tooltipClassName={"inline-flex items-center"}
        />
      </SummaryLabelLinkItem>
      <SummaryLabelItem label="Bifrost">
        <ValueDisplay
          value={bifrostDotAmount}
          symbol="DOT"
          className={"text12Medium text-textPrimary"}
          tooltipClassName={"inline-flex items-center"}
        />
      </SummaryLabelItem>
      <SummaryLabelItem label="Pendulum">
        <ValueDisplay
          value={pendulumDotAmount}
          symbol="DOT"
          className={"text12Medium text-textPrimary"}
          tooltipClassName={"inline-flex items-center"}
        />
      </SummaryLabelItem>
    </div>
  );
}

export default function Loans() {
  const centrifugeUsdcBalance = 1500000000000; // 1.5M * USDC decimals
  const bifrostDotBalance = 5000000000000000; // 500K * DOT decimals
  const pendulumDotBalance = 500000000000000; // 50K * DOT decimals

  return (
    <SummaryItem title="Loans">
      <div className="flex flex-col gap-[16px]">
        <FiatPriceLabel
          free={new BigNumber(bifrostDotBalance)
            .plus(pendulumDotBalance)
            .toString()}
          usdtBalance={centrifugeUsdcBalance}
        />
        <LoansItemList
          centrifugeUsdcBalance={centrifugeUsdcBalance}
          bifrostDotBalance={bifrostDotBalance}
          pendulumDotBalance={pendulumDotBalance}
        />
      </div>
    </SummaryItem>
  );
}
