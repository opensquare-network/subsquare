import { isNil } from "lodash-es";
import { SecondaryCardDetail } from "next-common/components/styled/containers/secondaryCard";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import Tooltip from "next-common/components/tooltip";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { useOnchainData } from "next-common/context/post";
import { toPrecisionNumber } from "next-common/utils";
import { ASSET_DETAIL_LINKS } from "next-common/utils/consts/asset";
import ValueDisplayWithFiatValue from "next-common/components/pages/components/gov2/business/valueDisplayVithFiatValue";

export function RequestWrapper({ children }) {
  return (
    <SecondaryCardDetail>
      <TitleContainer className="!px-0 mb-4">Request</TitleContainer>
      {children}
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

  return (
    <ValueDisplayWithFiatValue
      symbol={symbol}
      amount={amount}
      decimals={decimals}
    />
  );
}

function SpendValues() {
  const { symbol, decimals } = useChainSettings();
  const onchain = useOnchainData();

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

  if (onchain?.allSpends?.length) {
    return null;
  }

  if (!onchain?.isTreasury && isNil(onchain?.value)) {
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
