import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Signer from "next-common/components/popup/fields/signerField";

import useApi from "../../../../utils/hooks/useApi";
import useIsMounted from "../../../../utils/hooks/useIsMounted";
import { newErrorToast } from "../../../../store/reducers/toastSlice";
import PopupWithAddress from "../../../popupWithAddress";
import DepositRequired from "./depositRequired";
import SubmitButton from "./submitButton";
import { sendTx } from "../../../../utils/sendTx";
import { emptyFunction } from "../../../../utils";
import useDeposit from "./useDeposit";
import isNil from "lodash.isnil";
import { useChain } from "../../../../context/chain";

function PopupContent({
  extensionAccounts,
  proposalIndex,
  depositorUpperBound,
  depositRequired,
  onClose,
  onSubmitted = emptyFunction,
  onFinalized = emptyFunction,
  onInBlock = emptyFunction,
  useAddressVotingBalance,
}) {
  const chain = useChain();
  const dispatch = useDispatch();
  const isMounted = useIsMounted();
  const [signerAccount, setSignerAccount] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const api = useApi();
  const [balance, loadingBalance] = useAddressVotingBalance(
    api,
    signerAccount?.address
  );
  const { deposit, balanceInsufficient } = useDeposit(depositRequired, balance);

  const showErrorToast = (message) => dispatch(newErrorToast(message));

  const submit = async () => {
    if (!api) {
      return showErrorToast("Chain network is not connected yet");
    }

    if (isNil(proposalIndex)) {
      return;
    }

    if (!signerAccount) {
      return showErrorToast("Please select an account");
    }

    let tx = null;
    try {
      if (["kusama", "rococo"].includes(chain)) {
        tx = api.tx.democracy.second(proposalIndex);
      } else {
        tx = api.tx.democracy.second(proposalIndex, depositorUpperBound || 0);
      }
    } catch (e) {
      return showErrorToast(e.message);
    }

    const signerAddress = signerAccount.address;

    await sendTx({
      tx,
      dispatch,
      setLoading: setIsSubmitting,
      onFinalized,
      onInBlock,
      onSubmitted,
      onClose,
      signerAddress,
      isMounted,
    });
  };

  return (
    <>
      <Signer
        isBalanceLoading={loadingBalance}
        balance={balance}
        balanceName="Voting balance"
        selectedAccount={signerAccount}
        setSelectedAccount={setSignerAccount}
        isLoading={isSubmitting}
        extensionAccounts={extensionAccounts}
      />
      <DepositRequired
        deposit={deposit}
        balanceInsufficient={balanceInsufficient}
      />
      <SubmitButton
        onClick={submit}
        balanceInsufficient={balanceInsufficient}
        isSubmitting={isSubmitting}
      />
    </>
  );
}

export default function Popup(props) {
  return (
    <PopupWithAddress title="Second" Component={PopupContent} {...props} />
  );
}
