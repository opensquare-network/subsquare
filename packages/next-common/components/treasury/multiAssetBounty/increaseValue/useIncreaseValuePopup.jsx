import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import PopupWithSigner from "next-common/components/popupWithSigner";
import PopupLabel from "next-common/components/popup/label";
import Loading from "next-common/components/loading";
import { InfoMessage } from "next-common/components/setting/styled";
import { WarningMessage } from "next-common/components/popup/styled";
import AmountInputWithHint from "next-common/components/popup/fields/amountInputWithHint";
import CurrencyInput from "next-common/components/currencyInput";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { useOnchainData } from "next-common/context/post";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSignerAccount } from "next-common/components/popupWithSigner/context";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import { useContextApi } from "next-common/context/api";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import EstimatedGas from "next-common/components/estimatedGas";
import BigNumber from "bignumber.js";
import { toPrecision } from "next-common/utils";
import { wrapTxByRole } from "next-common/utils/sendTransaction/wrapTxByRole";
import { useTxBuilder } from "next-common/hooks/useTxBuilder";
import { useDispatch } from "react-redux";
import { newSuccessToast } from "next-common/store/reducers/toastSlice";
import { getEventData } from "next-common/utils/sendTransaction";
import {
  UseConnectedAccountSigner,
  useCuratorDeposit,
} from "next-common/components/treasury/multiAssetBounty/acceptCurator/useAcceptCuratorPopup";
import useMultiAssetBountyValueState from "next-common/hooks/treasury/multiAssetBounty/useMultiAssetBountyValueState";

function toRawAmount(amount, decimals) {
  if (!amount || decimals == null) {
    return null;
  }

  const raw = new BigNumber(amount).times(new BigNumber(10).pow(decimals));
  if (raw.isNaN() || raw.lte(0) || !raw.isInteger()) {
    return null;
  }
  return raw;
}

function ValueRow({ label, loading, value, symbol }) {
  return (
    <div className="flex items-center justify-between gap-4 text14Medium">
      <span className="text-textSecondary">{label}</span>
      <span className="text-textPrimary">
        {loading ? (
          <Loading size={14} />
        ) : (
          <ValueDisplay value={value} symbol={symbol} />
        )}
      </span>
    </div>
  );
}

function PopupContent({ curator, role }) {
  const dispatch = useDispatch();
  const api = useContextApi();
  const { bountyIndex } = useOnchainData();
  const signerAccount = useSignerAccount();
  const connectedAddress =
    signerAccount?.proxyAddress || signerAccount?.address;
  const { symbol: nativeSymbol, decimals: nativeDecimals } = useChainSettings();

  const {
    assetInfo,
    balance,
    value,
    unregistered,
    curatorDeposit,
    refundPending,
    loading,
  } = useMultiAssetBountyValueState();
  const { symbol, decimals } = assetInfo ?? {};

  const [amount, setAmount] = useState("");
  // Pre-fill once with the unregistered amount; afterwards the field belongs
  // to the user and must not be overwritten by a later state update.
  const didPrefillRef = useRef(false);
  useEffect(() => {
    if (loading || didPrefillRef.current) {
      return;
    }
    didPrefillRef.current = true;

    // A pending child refund would make the amount too high, see the hook.
    if (!refundPending && unregistered?.gt(0)) {
      setAmount(toPrecision(unregistered.toFixed(), decimals));
    }
  }, [loading, refundPending, unregistered, decimals]);

  const rawAmount = useMemo(
    () => toRawAmount(amount, decimals),
    [amount, decimals],
  );
  const newValue = useMemo(
    () => (rawAmount ? value.plus(rawAmount) : null),
    [rawAmount, value],
  );

  // The pallet re-evaluates the curator hold on the new value: it usually asks
  // for an extra hold, and releases part of it when the asset rate has fallen
  // since Accept Curator.
  const {
    deposit: newDeposit,
    isLoading: depositLoading,
    unavailable: depositUnavailable,
  } = useCuratorDeposit(newValue?.toFixed());

  const depositChange = useMemo(() => {
    if (!rawAmount || newDeposit == null || curatorDeposit == null) {
      return null;
    }
    return new BigNumber(newDeposit).minus(curatorDeposit);
  }, [rawAmount, newDeposit, curatorDeposit]);

  const depositChangeText = useMemo(() => {
    if (!depositChange) {
      return "";
    }
    const sign = depositChange.gt(0) ? "+" : depositChange.lt(0) ? "-" : "";
    return `${sign}${toPrecision(
      depositChange.abs().toFixed(),
      nativeDecimals,
    )}`;
  }, [depositChange, nativeDecimals]);

  const nothingToRegister = !loading && unregistered?.lte(0);
  // The call still succeeds, but the bounty is then backed by less than its
  // recorded value, so Award, Close and New Child Bounty fail until the funds
  // actually arrive. The value can never be lowered again.
  const overRegistered = !!(
    rawAmount &&
    unregistered != null &&
    rawAmount.gt(unregistered)
  );

  const { getTxFuncForSubmit, getTxFuncForFee } = useTxBuilder(
    (toastError) => {
      if (!rawAmount) {
        toastError("Please fill a valid amount");
        return null;
      }
      if (!api?.tx?.multiAssetBounties?.increaseValue) {
        toastError("Increase value transaction is unavailable");
        return null;
      }

      // increase_value(parent_bounty_id, amount); it has no child variant.
      const tx = api.tx.multiAssetBounties.increaseValue(
        bountyIndex,
        rawAmount.toFixed(),
      );
      return wrapTxByRole(api, { role, tx, connectedAddress, origin: curator });
    },
    [api, bountyIndex, rawAmount, role, connectedAddress, curator],
  );

  return (
    <>
      <UseConnectedAccountSigner />
      <SignerWithBalance noSwitchSigner />

      <div className="flex flex-col gap-y-2">
        <ValueRow
          label="Bounty Balance"
          loading={loading}
          value={toPrecision(balance?.toFixed() ?? 0, decimals)}
          symbol={symbol}
        />
        <ValueRow
          label="Recorded Value"
          loading={loading}
          value={toPrecision(value?.toFixed() ?? 0, decimals)}
          symbol={symbol}
        />
        <ValueRow
          label="Unregistered"
          loading={loading}
          value={toPrecision(unregistered?.toFixed() ?? 0, decimals)}
          symbol={symbol}
        />
      </div>

      <AmountInputWithHint
        label="Amount"
        hintLabel="Unregistered"
        hintTooltip="Funds the bounty account holds above the recorded value"
        maxAmount={unregistered?.gt(0) ? unregistered.toFixed() : "0"}
        decimals={decimals}
        symbol={symbol}
        isLoading={loading}
        inputAmount={amount}
        setInputAmount={setAmount}
      />

      {refundPending && (
        <WarningMessage>
          A child bounty refund is still being processed. Run Check Status on
          that child bounty first so the parent value accounting catches up
          before registering funds.
        </WarningMessage>
      )}
      {nothingToRegister && (
        <InfoMessage>
          Nothing to register: the bounty account does not hold funds above the
          recorded value.
        </InfoMessage>
      )}
      {overRegistered && (
        <WarningMessage danger>
          The amount is larger than the unregistered funds. The call still
          succeeds, but Award, Close and New Child Bounty will fail until the
          funds arrive, and the value can never be lowered again.
        </WarningMessage>
      )}

      <PopupLabel
        text={curatorDeposit == null ? "Curator Hold" : "Curator Hold Change"}
      />
      {depositLoading ? (
        <InfoMessage className="justify-center min-h-9.5">
          <Loading size={20} />
        </InfoMessage>
      ) : depositUnavailable ? (
        <InfoMessage className="min-h-9.5">
          Unable to compute the curator deposit
        </InfoMessage>
      ) : (
        <CurrencyInput
          disabled
          value={
            !rawAmount
              ? ""
              : curatorDeposit == null
              ? toPrecision(newDeposit?.toFixed() ?? 0, nativeDecimals)
              : depositChangeText
          }
          symbol={nativeSymbol}
        />
      )}

      <AdvanceSettings>
        <EstimatedGas getTxFunc={getTxFuncForFee} />
      </AdvanceSettings>
      <TxSubmissionButton
        title="Confirm"
        getTxFunc={getTxFuncForSubmit}
        disabled={!rawAmount}
        onInBlock={({ events }) => {
          if (
            role?.kind === "multisig" &&
            getEventData(events, "multisig", "NewMultisig")
          ) {
            dispatch(
              newSuccessToast(
                "Multisig transaction submitted. Waiting for other signatories.",
              ),
            );
          }
        }}
      />
    </>
  );
}

function IncreaseValuePopup({ curator, role, onClose }) {
  return (
    <PopupWithSigner title="Increase Value" onClose={onClose}>
      <PopupContent curator={curator} role={role} />
    </PopupWithSigner>
  );
}

export default function useIncreaseValuePopup(curator) {
  const [openRole, setOpenRole] = useState(null);

  return {
    showPopup: setOpenRole,
    popup: openRole ? (
      <IncreaseValuePopup
        curator={curator}
        role={openRole}
        onClose={() => setOpenRole(null)}
      />
    ) : null,
  };
}
