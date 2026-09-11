import { useCallback, useState } from "react";
import { useRouter } from "next/router";
import BigNumber from "bignumber.js";
import PopupWithSigner from "next-common/components/popupWithSigner";
import { useSignerAccount } from "next-common/components/popupWithSigner/context";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import EstimatedGas from "next-common/components/estimatedGas";
import AmountInputWithHint from "next-common/components/popup/fields/amountInputWithHint";
import Tooltip from "next-common/components/tooltip";
import { useContextApi } from "next-common/context/api";
import { useChainSettings } from "next-common/context/chain";
import useCoretimeSale from "next-common/context/coretime/sale/provider";
import { useSubBalanceInfo } from "next-common/hooks/balance/useSubBalanceInfo";
import { checkInputValue, fromPrecision, toPrecision } from "next-common/utils";
import { getEventData } from "next-common/utils/sendTransaction";
import usePurchaseState from "./usePurchaseState";

function PopupContent() {
  const api = useContextApi();
  const router = useRouter();
  const { decimals, symbol } = useChainSettings();
  const sale = useCoretimeSale();
  const [regionBegin] = useState(sale.info.regionBegin);
  const signerAccount = useSignerAccount();
  const { value: balanceInfo, loading: isBalanceLoading } = useSubBalanceInfo(
    signerAccount?.realAddress,
    api,
  );
  const { error: saleError, price } = usePurchaseState(regionBegin);
  const suggestedPriceLimit =
    price === null
      ? ""
      : new BigNumber(toPrecision(price, decimals)).toFixed(
          4,
          BigNumber.ROUND_CEIL,
        );
  const [inputPriceLimit, setInputPriceLimit] = useState(suggestedPriceLimit);

  const priceLimit = new BigNumber(fromPrecision(inputPriceLimit, decimals));

  let disabledReason;
  if (saleError) {
    disabledReason = saleError;
  } else if (!priceLimit.isInteger() || priceLimit.lt(0)) {
    disabledReason = "Please input a valid price limit";
  } else if (price !== null && priceLimit.lt(price)) {
    disabledReason = "Price limit is below the current sale price";
  } else if (isBalanceLoading || !balanceInfo) {
    disabledReason = "Waiting for account balance";
  } else if (
    price !== null &&
    new BigNumber(balanceInfo.transferrable ?? 0).lt(price)
  ) {
    disabledReason = "Insufficient transferable balance on Coretime";
  }

  const getTxFunc = useCallback(() => {
    if (saleError) {
      throw new Error(saleError);
    }

    const limit = checkInputValue(
      inputPriceLimit,
      decimals,
      "price limit",
      true,
    );
    if (!new BigNumber(price).isFinite() || limit.lt(price)) {
      throw new Error("Price limit is below the current sale price");
    }

    return api.tx.broker.purchase(limit.toFixed(0));
  }, [api, inputPriceLimit, decimals, saleError, price]);

  const handleFinalized = useCallback(
    ({ events }) => {
      if (!getEventData(events, "broker", "Purchased")) {
        return;
      }

      return router.replace(router.asPath, undefined, { scroll: false });
    },
    [router],
  );

  return (
    <>
      <SignerWithBalance api={api} showTransferable />
      <AmountInputWithHint
        label="Price limit"
        hintLabel="Current Price"
        hintTooltip="Click to use the current price"
        maxAmount={price}
        decimals={decimals}
        symbol={symbol}
        isLoading={price === null}
        inputAmount={inputPriceLimit}
        setInputAmount={setInputPriceLimit}
        onHintClick={() => setInputPriceLimit(suggestedPriceLimit)}
      />
      <AdvanceSettings>
        <EstimatedGas getTxFunc={getTxFunc} />
      </AdvanceSettings>
      <div className="flex justify-end">
        <Tooltip content={disabledReason}>
          <TxSubmissionButton
            title="Purchase"
            getTxFunc={getTxFunc}
            disabled={!!disabledReason}
            onFinalized={handleFinalized}
          />
        </Tooltip>
      </div>
    </>
  );
}

export default function CoretimePurchasePopup(props) {
  return (
    <PopupWithSigner title="Purchase Coretime" {...props}>
      <PopupContent />
    </PopupWithSigner>
  );
}
