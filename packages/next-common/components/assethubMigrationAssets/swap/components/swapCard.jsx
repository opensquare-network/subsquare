import { ArrowLineLeft } from "@osn/icons/subsquare";
import { isNil } from "lodash-es";
import { useCallback } from "react";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import CurrencyInput from "next-common/components/currencyInput";
import EstimatedGas from "next-common/components/estimatedGas";
import PopupLabel from "next-common/components/popup/label";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import WarningInfoPanel from "next-common/components/summary/styled/warningInfoPanel";
import Tooltip from "next-common/components/tooltip";
import { useChainSettings } from "next-common/context/chain";
import SecondaryButton from "next-common/lib/button/secondary";
import { cn, toPercentage, toPrecision } from "next-common/utils";
import { useSwapQuote } from "../context/quote";
import { useSwap } from "../context/swap";
import {
  BPS_DENOMINATOR,
  PRICE_IMPACT_HIGH_THRESHOLD,
  SLIPPAGE_OPTIONS,
} from "../constants";
import SwapField, { SwapBalanceLabel, SwapFieldBody } from "./swapField";

function FieldFooter({ actions }) {
  if (!actions) {
    return null;
  }
  return (
    <div className="mt-2 flex min-h-8 items-center justify-end">{actions}</div>
  );
}

function PercentageActions({ onPercentage, onMax }) {
  const actions = [
    { label: "25%", onClick: () => onPercentage(25) },
    { label: "50%", onClick: () => onPercentage(50) },
    { label: "Max", onClick: onMax },
  ];
  return (
    <div className="flex items-center gap-2">
      {actions.map(({ label, onClick }) => (
        <SecondaryButton key={label} size="small" onClick={onClick}>
          {label}
        </SecondaryButton>
      ))}
    </div>
  );
}

function PayField() {
  const {
    amount,
    balances,
    pools,
    setAmount,
    setAmountByPercentage,
    setAmountToMax,
  } = useSwap();
  const { tokenIn } = pools;

  return (
    <SwapField
      amount={amount}
      balance={balances.tokenIn}
      balanceLoading={balances.tokenInLoading}
      label="Pay"
      onAmountChange={setAmount}
      onTokenChange={pools.setTokenIn}
      poolsLoading={pools.loading}
      token={tokenIn}
      tokens={pools.tokenOptions}
    >
      <FieldFooter
        actions={
          <PercentageActions
            onPercentage={setAmountByPercentage}
            onMax={setAmountToMax}
          />
        }
      />
    </SwapField>
  );
}

function ReceiveAmountField({ onTokenChange, poolsLoading, token, tokens }) {
  const { quote } = useSwapQuote();

  let amount = "";
  if (!isNil(quote.quote) && token) {
    amount = toPrecision(quote.quote, token.decimals);
  }

  return (
    <SwapFieldBody
      amount={amount}
      onTokenChange={onTokenChange}
      poolsLoading={poolsLoading}
      readOnly
      token={token}
      tokens={tokens}
    />
  );
}

function ReceiveField() {
  const { balances, pools } = useSwap();
  const { tokenOut } = pools;

  return (
    <div>
      <SwapBalanceLabel
        balance={balances.tokenOut}
        label="Receive"
        loading={pools.loading || balances.tokenOutLoading}
        token={tokenOut}
      />
      <ReceiveAmountField
        onTokenChange={pools.setTokenOut}
        poolsLoading={pools.loading}
        token={tokenOut}
        tokens={pools.tokenOptions}
      />
    </div>
  );
}

function ReversePairButton() {
  const { pools, setAmount } = useSwap();
  const { quote } = useSwapQuote();

  const handleClick = useCallback(() => {
    if (!isNil(quote.quote) && pools.tokenOut) {
      setAmount(toPrecision(quote.quote, pools.tokenOut.decimals));
    }
    pools.reversePair();
  }, [pools, quote.quote, setAmount]);

  return (
    <div className="flex justify-center">
      <button
        type="button"
        onClick={handleClick}
        className={cn(
          "cursor-pointer p-2 rounded-lg",
          "border border-neutral400 bg-neutral100",
          "text-textPrimary",
        )}
      >
        <ArrowLineLeft className="h-4 w-4 -rotate-90 text-textPrimary" />
      </button>
    </div>
  );
}

function SlippageSelector() {
  const { slippageBps, setSlippageBps } = useSwap();

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <span className="text14Bold text-textPrimary">Slippage tolerance</span>
      <div className="flex items-center gap-2">
        {SLIPPAGE_OPTIONS.map((basisPoints) => (
          <SecondaryButton
            key={basisPoints}
            className={cn(
              "text-textSecondary",
              slippageBps === basisPoints &&
                "border-theme500 bg-theme100 text-theme500 hover:border-theme500",
            )}
            size="small"
            type="button"
            onClick={() => setSlippageBps(basisPoints)}
          >
            {toPercentage(basisPoints / BPS_DENOMINATOR, 2)}%
          </SecondaryButton>
        ))}
      </div>
    </div>
  );
}

function ExistentialDepositField() {
  const { decimals, symbol } = useChainSettings();
  const { existentialDeposit } = useSwap();

  let value = "";
  if (!isNil(existentialDeposit)) {
    value = toPrecision(existentialDeposit, decimals);
  }

  return (
    <div>
      <PopupLabel text="Existential Deposit" />
      <CurrencyInput disabled placeholder="-" value={value} symbol={symbol} />
    </div>
  );
}

function SubmitButton() {
  const { api } = useSwap();
  const { getTxFunc, quote, submitDisabledReason } = useSwapQuote();
  const { refresh } = quote;

  const handleInBlock = useCallback(() => {
    refresh();
  }, [refresh]);

  return (
    <div className="flex justify-end">
      <Tooltip content={submitDisabledReason}>
        <TxSubmissionButton
          api={api}
          title="Swap"
          disabled={!!submitDisabledReason}
          getTxFunc={getTxFunc}
          onInBlock={handleInBlock}
          onFinalized={handleInBlock}
          autoClose={false}
        />
      </Tooltip>
    </div>
  );
}

function SwapTransactionSettings() {
  const { getTxFunc, priceImpact } = useSwapQuote();

  return (
    <>
      {!isNil(priceImpact) && priceImpact <= PRICE_IMPACT_HIGH_THRESHOLD && (
        <WarningInfoPanel>
          High price impact. Review the minimum received before continuing.
        </WarningInfoPanel>
      )}

      <SlippageSelector />

      <AdvanceSettings>
        <ExistentialDepositField />
        <EstimatedGas getTxFunc={getTxFunc} />
      </AdvanceSettings>

      <SubmitButton />
    </>
  );
}

export default function SwapCard() {
  return (
    <SecondaryCard className="space-y-4">
      <PayField />
      <ReversePairButton />
      <ReceiveField />
      <SwapTransactionSettings />
    </SecondaryCard>
  );
}
