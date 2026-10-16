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
} from "next-common/components/overview/centrifugeStats/detailRow";
import { useContextApi } from "next-common/context/api";
import { useTxBuilder } from "next-common/hooks/useTxBuilder";
import { newSuccessToast } from "next-common/store/reducers/toastSlice";
import { useDotUsdContext } from "./context";
import useMintForm from "./useMintForm";
import {
  ExternalAssetSelect,
  MaxFeeField,
  SwapAmountValue,
} from "./swapPopupFields";

// Minting needs the breaker fully open; the middle state only allows redeeming.
function allowsMinting(asset) {
  return asset.status === "AllEnabled";
}

function MintSummary({ external, internal, quote, isLoading }) {
  const feePercent = external?.mintingFee;

  return (
    <DetailList>
      <DetailRow
        title="You will receive"
        value={
          <LoadableContent isLoading={isLoading}>
            <SwapAmountValue
              value={quote?.received}
              decimals={internal?.decimals}
              symbol={internal?.symbol ?? "dotUSD"}
            />
          </LoadableContent>
        }
      />
      <DetailRow
        title={
          // The fee is charged in dotUSD and taken out of what is minted, not out of the
          // asset being paid, so the row has to say so or a 0 fee looks like a missing one.
          <Tooltip content="Taken out of the dotUSD that is minted, not out of the asset you pay with.">
            <span className="cursor-default">
              {`Mint fee${
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
  } = useMintForm({
    address: signerAddress,
    apiReady: !!api?.tx?.psm?.mint,
  });

  const { getTxFuncForSubmit, getTxFuncForFee } = useTxBuilder(
    (toastError) => {
      // The mint always runs on Asset Hub; say so rather than failing on a missing pallet.
      if (!api?.tx?.psm?.mint) {
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

      // The fee is passed as a Permill, the amount as planck of the external asset.
      return api.tx.psm.mint(
        internalLocation,
        externalLocation,
        amount,
        maxFeePermill,
      );
    },
    [api, internalLocation, externalLocation, getCheckedAmount, maxFeePermill],
  );

  // The balances are subscriptions, so the account panel and the asset field follow the mint
  // on their own, with the block that included it; the PSM snapshot is not, so the debt and
  // cap panels are asked to catch up.
  const onInBlock = useCallback(() => {
    dispatch(newSuccessToast("Minted successfully"));
    refresh?.();
  }, [dispatch, refresh]);

  return (
    <>
      <ExternalAssetSelect
        label="Pay with"
        externals={externals}
        external={external}
        onChange={setExternalIndex}
        isEnabled={allowsMinting}
      />
      <SignerWithBalance api={api} />

      <AmountInputWithHint
        label="Amount"
        hintLabel="Available"
        hintTooltip={`Your ${external?.symbol ?? ""} balance on Asset Hub`}
        maxAmount={balance?.toString()}
        decimals={external?.decimals}
        symbol={external?.symbol}
        isLoading={balanceLoading || dataLoading}
        inputAmount={inputAmount}
        setInputAmount={setInputAmount}
      />

      <MintSummary
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
            title="Mint"
            disabled={!!disabledReason}
            getTxFunc={getTxFuncForSubmit}
            onInBlock={onInBlock}
          />
        </Tooltip>
      </div>
    </>
  );
}

export default function DotUsdMintPopup(props) {
  return (
    <PopupWithSigner title="Mint dotUSD" {...props}>
      <PopupContent />
    </PopupWithSigner>
  );
}
