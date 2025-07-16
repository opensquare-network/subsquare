import BigNumber from "bignumber.js";
import { groupBy } from "lodash-es";
import { cn } from "next-common/utils";
import TreasurySpendValueDisplay from "../gov2/business/treasurySpendValueDisplay";
import AssetIcon from "../icons/assetIcon";
import Tooltip from "../tooltip";
import useFiatValueTooltipContent from "./common/useFiatValueTooltipContent";
import { useChainSettings } from "next-common/context/chain";
import { useMemo } from "react";
import Flex from "../styled/flex";

export default function PostListTreasuryAllSpends({
  allSpends,
  showFaitPrice,
}) {
  const groupedSpends = groupBy(allSpends, "assetKind.symbol");
  let resolvedSpends = Object.keys(groupedSpends).map((symbol) => {
    const spends = groupedSpends[symbol];
    const amount = BigNumber.sum(
      ...spends.map((spend) => spend.amount),
    ).toString();

    return {
      symbol,
      amount,
      ...spends[0].assetKind,
    };
  });

  if (resolvedSpends.length === 1) {
    return (
      <OnlyOneSpend spend={resolvedSpends[0]} showFaitPrice={showFaitPrice} />
    );
  }

  return <MultiSpends spends={resolvedSpends} showFaitPrice={showFaitPrice} />;
}

function OnlyOneSpend({ spend: { type, amount, symbol }, showFaitPrice }) {
  let { decimals } = useChainSettings();
  const fiatValueTooltip = useFiatValueTooltipContent(amount, decimals, symbol);

  return (
    <div className="text-textPrimary">
      <TreasurySpendValueDisplay
        className={cn("text14Medium")}
        type={type}
        amount={amount}
        symbol={symbol}
        tooltipOtherContent={showFaitPrice && fiatValueTooltip}
      />
    </div>
  );
}

const SpendValue = ({ spend, showFaitPrice }) => {
  let { decimals } = useChainSettings();
  const fiatValueTooltip = useFiatValueTooltipContent(
    spend.amount,
    decimals,
    spend.symbol,
  );

  return (
    <Flex className="items-center text-textPrimaryContrast text12Medium">
      <TreasurySpendValueDisplay
        key={spend.symbol}
        className="text-textPrimaryContrast text12Medium"
        showTooltip={false}
        amount={spend.amount}
        type={spend.type}
        chain={spend.chain}
        symbol={spend.symbol}
      />

      {showFaitPrice && fiatValueTooltip}
    </Flex>
  );
};

function MultiSpends({ spends, showFaitPrice }) {
  const content = useMemo(() => {
    return (
      <div className="flex flex-col">
        {spends.map((spend, index) => (
          <SpendValue showFaitPrice={showFaitPrice} spend={spend} key={index} />
        ))}
      </div>
    );
  }, [showFaitPrice, spends]);

  return (
    <Tooltip className="flex items-center" content={content}>
      {spends.map((spend, idx) => (
        <AssetIcon
          key={spend.symbol}
          symbol={spend.symbol}
          type={spend?.type}
          className={cn("w-5 h-5", idx > 0 && "-ml-2")}
        />
      ))}
    </Tooltip>
  );
}
