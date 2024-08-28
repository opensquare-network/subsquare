import { SystemCoins } from "@osn/icons/subsquare";
import { isNil } from "lodash-es";
import { SecondaryCardDetail } from "next-common/components/styled/containers/secondaryCard";
import Tooltip from "next-common/components/tooltip";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { useOnchainData } from "next-common/context/post";
import { toPrecisionNumber } from "next-common/utils";
import {
  SYMBOL_DECIMALS,
  ASSET_DETAIL_LINKS,
} from "next-common/utils/consts/asset";

export function RequestWrapper({ children }) {
  return (
    <SecondaryCardDetail>
      <div className="flex justify-between">
        <div className="align-baseline">
          <div className="flex items-center gap-[8px]">
            <SystemCoins className="w-[20px] h-[20px] text-textTertiary" />
            <div className="text-textPrimary text14Medium">Request</div>
          </div>
        </div>

        {children}
      </div>
    </SecondaryCardDetail>
  );
}

function SymbolLink({ className, symbol, children }) {
  return (
    <a
      className={className}
      href={ASSET_DETAIL_LINKS[symbol]}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
}

function SpendSymbol({ symbol }) {
  return (
    <Tooltip
      content={
        <SymbolLink
          symbol={symbol}
          className="text12Medium text-textPrimaryContrast"
        >
          Asset Detail ↗
        </SymbolLink>
      }
    >
      <SymbolLink
        symbol={symbol}
        className="text14Medium text-textTertiary hover:underline"
      >
        {symbol}
      </SymbolLink>
    </Tooltip>
  );
}

function SpendValue({ amount, symbol, decimals }) {
  const value = toPrecisionNumber(amount, decimals);

  if (symbol in ASSET_DETAIL_LINKS) {
    return (
      <div className="flex gap-[2px]">
        <Tooltip content={`${value} ${symbol}`}>
          <ValueDisplay value={value} showTooltip={false} />
        </Tooltip>
        <SpendSymbol symbol={symbol} />
      </div>
    );
  }

  return <ValueDisplay value={value} symbol={symbol} />;
}

function SpendValues() {
  const { symbol, decimals } = useChainSettings();
  const onchain = useOnchainData();

  if (onchain?.isStableTreasury) {
    const { spends = [] } = onchain?.stableTreasuryInfo || {};
    return (
      <div className="flex flex-col gap-[4px] justify-end">
        {spends.map((spend, index) => (
          <SpendValue
            key={index}
            amount={spend.amount}
            symbol={spend.symbol}
            decimals={SYMBOL_DECIMALS[spend.symbol]}
          />
        ))}
      </div>
    );
  }

  const localTreasurySpendAmount = onchain?.isTreasury
    ? onchain?.treasuryInfo?.amount
    : onchain?.value;

  return (
    <SpendValue
      amount={localTreasurySpendAmount}
      symbol={symbol}
      decimals={decimals}
    />
  );
}

export default function Request() {
  const onchain = useOnchainData();

  if (
    !onchain?.isTreasury &&
    !onchain?.isStableTreasury &&
    isNil(onchain?.value)
  ) {
    return null;
  }

  return (
    <RequestWrapper>
      <div className="text-textPrimary text14Medium">
        <SpendValues />
      </div>
    </RequestWrapper>
  );
}
