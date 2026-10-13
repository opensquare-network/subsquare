import { useCallback } from "react";
import { isNil } from "lodash-es";
import BigNumber from "bignumber.js";
import { isAddress } from "@polkadot/util-crypto";
import PopupWithSigner from "next-common/components/popupWithSigner";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import EstimatedGas from "next-common/components/estimatedGas";
import Tooltip from "next-common/components/tooltip";
import useAddressComboField from "next-common/components/preImages/createPreimagePopup/fields/useAddressComboField";
import { useTransferAmount } from "next-common/components/popup/fields/useTransferAmount";
import { useChainSettings } from "next-common/context/chain";
import { useSignerAccount } from "next-common/components/popupWithSigner/context";
import { useContextApi } from "next-common/context/api";
import useAccountTransferrable from "next-common/hooks/useAccountTransferrable";
import { toPrecision } from "next-common/utils";

function PopupContent({ minimumCreditPurchase }) {
  const api = useContextApi();
  const { decimals, symbol } = useChainSettings();
  const signerAccount = useSignerAccount();
  const { transferrable, isLoading } = useAccountTransferrable(
    api,
    signerAccount?.realAddress,
  );
  const {
    value: amount,
    component: amountField,
    getCheckedValue,
  } = useTransferAmount({
    transferrable,
    decimals,
    symbol,
    isLoading,
  });
  const { value: beneficiary, component: beneficiaryField } =
    useAddressComboField({
      title: "Beneficiary",
      defaultAddress: signerAccount?.realAddress || "",
    });

  const minimum = isNil(minimumCreditPurchase)
    ? null
    : BigNumber(minimumCreditPurchase.toString());

  let disabledReason;
  if (!api) {
    disabledReason = "Waiting for Coretime data";
  } else if (isLoading) {
    disabledReason = "Loading balance...";
  } else if (!isAddress(beneficiary)) {
    disabledReason = "Please input a valid beneficiary address";
  } else if (amount) {
    const planck = BigNumber(amount).times(Math.pow(10, decimals));
    if (minimum && planck.lt(minimum)) {
      disabledReason = `The minimum credit purchase is ${toPrecision(
        minimum.toFixed(0),
        decimals,
      )} ${symbol}`;
    }
  }

  const getTxFunc = useCallback(() => {
    if (disabledReason) {
      throw new Error(disabledReason);
    }

    const value = getCheckedValue();
    return api.tx.broker.purchaseCredit(value, beneficiary);
  }, [api, beneficiary, getCheckedValue, disabledReason]);

  return (
    <>
      <SignerWithBalance api={api} showTransferable />
      {amountField}
      {beneficiaryField}
      <div className="text12Medium text-textTertiary">
        The credit is bought on the Coretime chain and assigned to the
        beneficiary account, which uses it to buy on-demand coretime.
        {minimum
          ? ` Minimum purchase: ${toPrecision(
              minimum.toFixed(0),
              decimals,
            )} ${symbol}.`
          : ""}
      </div>
      <AdvanceSettings>
        <EstimatedGas getTxFunc={getTxFunc} />
      </AdvanceSettings>
      <div className="flex justify-end">
        <Tooltip content={disabledReason}>
          <TxSubmissionButton
            title="Purchase credit"
            getTxFunc={getTxFunc}
            disabled={!!disabledReason}
          />
        </Tooltip>
      </div>
    </>
  );
}

export default function PurchaseCreditPopup({
  minimumCreditPurchase,
  ...props
}) {
  return (
    <PopupWithSigner title="Purchase credit" {...props}>
      <PopupContent minimumCreditPurchase={minimumCreditPurchase} />
    </PopupWithSigner>
  );
}
