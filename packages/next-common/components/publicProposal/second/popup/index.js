import React from "react";
import { useContext } from "react";
import { useDispatch } from "react-redux";

import useApi from "../../../../utils/hooks/useApi";
import useIsMounted from "../../../../utils/hooks/useIsMounted";
import { newErrorToast } from "../../../../store/reducers/toastSlice";
import PopupWithAddress from "../../../popupWithAddress";
import DepositRequired from "./depositRequired";
import Signer from "./signer";
import SubmitButton from "./submitButton";
import { StateContext, StateProvider } from "./stateContext";
import { sendTx } from "../../../../utils/sendTx";
import { emptyFunction } from "../../../../utils";
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
  const { signerAccount, setIsSubmitting } = useContext(StateContext);
  const api = useApi();

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
    if (chain === "kusama") {
      tx = api.tx.democracy.second(proposalIndex);
    } else {
      tx = api.tx.democracy.second(proposalIndex, depositorUpperBound || 0);
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
        api={api}
        extensionAccounts={extensionAccounts}
        useAddressVotingBalance={useAddressVotingBalance}
      />
      <DepositRequired depositRequired={depositRequired} />
      <SubmitButton onClick={submit} depositRequired={depositRequired} />
    </>
  );
}

export default function Popup(props) {
  return (
    <StateProvider>
      <PopupWithAddress title="Second" Component={PopupContent} {...props} />
    </StateProvider>
  );
}
