import { useCallback } from "react";
import { isNil } from "lodash-es";
import { useDispatch } from "react-redux";
import PopupWithSigner from "next-common/components/popupWithSigner";
import { useSignerAccount } from "next-common/components/popupWithSigner/context";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import AmountInputWithHint from "next-common/components/popup/fields/amountInputWithHint";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import EstimatedGas from "next-common/components/estimatedGas";
import LoadableContent from "next-common/components/common/loadableContent";
import Tooltip from "next-common/components/tooltip";
import {
  DetailList,
  DetailRow,
} from "next-common/components/overview/detailRow";
import { useContextApi } from "next-common/context/api";
import { useTxBuilder } from "next-common/hooks/useTxBuilder";
import { newSuccessToast } from "next-common/store/reducers/toastSlice";
import { useDotUsdContext } from "./context";
import useRedeemForm from "./useRedeemForm";
import {
  ExternalAssetSelect,
  MaxFeeField,
  SwapAmountValue,
} from "./swapPopupFields";

// Redemption keeps working while minting is disabled; only AllDisabled stops it.
function allowsRedemption(asset) {
  return asset.status !== "AllDisabled";
}

function RedeemSummary({ external, internal, quote, isLoading }) {
  const feePercent = external?.redemptionFee;

  return (
    <DetailList>
      <DetailRow
        title="You will receive"
        value={
          <LoadableContent isLoading={isLoading}>
            <SwapAmountValue
              value={quote?.externalOut}
              decimals={external?.decimals}
              symbol={external?.symbol}
            />
          </LoadableContent>
        }
      />
      <DetailRow
        title={
          // The fee is charged in dotUSD, out of what is being redeemed, not out of the asset
          // that comes back.
          <Tooltip content="Taken out of the dotUSD you redeem, not out of the asset you receive.">
            <span className="cursor-default">
              {`Redeem fee${
                isNil(feePercent)
                  ? ""
                  : ` (${feePercent.toFixed(4).replace(/\.?0+$/, "")}%)`
              }`}
            </span>
          </Tooltip>
        }
        value={
          <LoadableContent isLoading={isLoading}>
            <SwapAmountValue
              value={quote?.fee}
              decimals={internal?.decimals}
              symbol={internal?.symbol ?? "dotUSD"}
            />
          </LoadableContent>
        }
      />
    </DetailList>
  );
}

function PopupContent() {
  const api = useContextApi();
  const signerAccount = useSignerAccount();
  const signerAddress = signerAccount?.realAddress;
  const dispatch = useDispatch();
  const { refresh } = useDotUsdContext();

  const {
    dataLoading,
    internal,
    external,
    externals,
    setExternalIndex,
    internalLocation,
    externalLocation,
    inputAmount,
    setInputAmount,
    balance,
    balanceLoading,
    quote,
    getCheckedAmount,
    maxFeePermill,
    disabledReason,
  } = useRedeemForm({
    address: signerAddress,
    apiReady: !!api?.tx?.psm?.redeem,
  });

  const { getTxFuncForSubmit, getTxFuncForFee } = useTxBuilder(
    (toastError) => {
      if (!api?.tx?.psm?.redeem) {
        toastError("Asset Hub RPC is not connected yet");
        return;
      }

      if (!internalLocation || !externalLocation) {
        toastError("Unsupported PSM asset location");
        return;
      }

      let amount;
      try {
        amount = getCheckedAmount();
      } catch (e) {
        toastError(e.message);
        return;
      }

      // The amount is planck of the internal asset, the fee a Permill of it.
      return api.tx.psm.redeem(
        internalLocation,
        externalLocation,
        amount,
        maxFeePermill,
      );
    },
    [api, internalLocation, externalLocation, getCheckedAmount, maxFeePermill],
  );

  const onInBlock = useCallback(() => {
    dispatch(newSuccessToast("Redeemed successfully"));
    refresh?.();
  }, [dispatch, refresh]);

  return (
    <>
      <div>
        <SignerWithBalance api={api} />
      </div>

      <AmountInputWithHint
        label={`Redeem ${internal?.symbol ?? "dotUSD"}`}
        hintLabel="Available"
        hintTooltip="Your dotUSD balance on Asset Hub"
        maxAmount={balance?.toString()}
        decimals={internal?.decimals}
        symbol={internal?.symbol}
        isLoading={balanceLoading || dataLoading}
        inputAmount={inputAmount}
        setInputAmount={setInputAmount}
      />

      <ExternalAssetSelect
        label="Receive"
        externals={externals}
        external={external}
        onChange={setExternalIndex}
        isEnabled={allowsRedemption}
      />

      <RedeemSummary
        external={external}
        internal={internal}
        quote={quote}
        isLoading={dataLoading}
      />

      <AdvanceSettings>
        <MaxFeeField maxFeePermill={maxFeePermill} />
        <EstimatedGas getTxFunc={getTxFuncForFee} />
      </AdvanceSettings>

      <div className="flex justify-end">
        <Tooltip content={disabledReason}>
          <TxSubmissionButton
            title="Redeem"
            disabled={!!disabledReason}
            getTxFunc={getTxFuncForSubmit}
            onInBlock={onInBlock}
          />
        </Tooltip>
      </div>
    </>
  );
}

export default function DotUsdRedeemPopup(props) {
  return (
    <PopupWithSigner title="Redeem dotUSD" {...props}>
      <PopupContent />
    </PopupWithSigner>
  );
}
