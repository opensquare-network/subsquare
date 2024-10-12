import BigNumber from "bignumber.js";
import { groupBy } from "lodash-es";
import { cn } from "next-common/utils";
import TreasurySpendValueDisplay from "../gov2/business/treasurySpendValueDisplay";
import AssetIcon from "../icons/assetIcon";
import Tooltip from "../tooltip";

export default function PostListTreasuryAllSpends({ allSpends }) {
  const groupedSpends = groupBy(allSpends, "assetKind.symbol");
  const resolvedSpends = Object.keys(groupedSpends).map((symbol) => {
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
    const { amount, type, symbol } = resolvedSpends[0];

    return (
      <div className="text-textPrimary">
        <TreasurySpendValueDisplay
          className={cn("text14Medium")}
          type={type}
          amount={amount}
          symbol={symbol}
        />
      </div>
    );
  }

  return <MultiSpends spends={resolvedSpends} />;
}

function MultiSpends({ spends }) {
  return (
    <Tooltip
      className="flex items-center"
      content={
        <div className="flex flex-col">
          {spends.map((spend) => (
            <TreasurySpendValueDisplay
              key={spend.symbol}
              className="text-textPrimaryContrast text12Medium"
              showTooltip={false}
              amount={spend.amount}
              type={spend.type}
              chain={spend.chain}
              symbol={spend.symbol}
            />
          ))}
        </div>
      }
    >
      {spends.map((spend, idx) => (
        <AssetIcon
          key={spend.symbol}
          symbol={spend.symbol}
          className={cn("w-5 h-5", idx > 0 && "-ml-2")}
        />
      ))}
    </Tooltip>
  );
}
