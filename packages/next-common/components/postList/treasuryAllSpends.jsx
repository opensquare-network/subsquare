import BigNumber from "bignumber.js";
import { groupBy } from "lodash-es";
import { cn } from "next-common/utils";
import TreasurySpendValueDisplay from "../gov2/business/treasurySpendValueDisplay";
import AssetIcon from "../icons/assetIcon";
import Tooltip from "../tooltip";
import { useMemo } from "react";
import Flex from "../styled/flex";
import ValueFiatPriceDisplay from "./common/valueFiatPriceDisplay";

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

function OnlyOneSpend({
  spend: { type, amount, symbol, decimals },
  showFaitPrice,
}) {
  return (
    <div className="text-textPrimary">
      <TreasurySpendValueDisplay
        className={cn("text14Medium")}
        type={type}
        amount={amount}
        symbol={symbol}
        decimals={decimals}
        tooltipOtherContent={
          showFaitPrice && (
            <ValueFiatPriceDisplay amount={amount} symbol={symbol} />
          )
        }
      />
    </div>
  );
}

const SpendValue = ({ spend, showFaitPrice }) => {
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
        decimals={spend.decimals}
      />

      {showFaitPrice && (
        <ValueFiatPriceDisplay amount={spend.amount} symbol={spend.symbol} />
      )}
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
