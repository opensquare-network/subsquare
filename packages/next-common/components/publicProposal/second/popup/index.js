import React from "react";
import { useContext } from "react";
import { useDispatch } from "react-redux";

import useApi from "../../../../utils/hooks/useSelectedEnpointApi";
import useIsMounted from "../../../../utils/hooks/useIsMounted";
import {
  newErrorToast,
  newPendingToast,
  newToastId,
  updatePendingToast,
  removeToast,
} from "../../../../store/reducers/toastSlice";
import PopupWithAddress from "../../../popupWithAddress";
import DepositRequired from "./depositRequired";
import Signer from "./signer";
import SubmitButton from "./submitButton";
import { StateContext, StateProvider } from "./stateContext";

function PopupContent({
  extensionAccounts,
  chain,
  proposalIndex,
  depositorUpperBound,
  depositRequired,
  onClose,
  onInBlock,
  onFinalized,
  onSubmitted,
  useAddressVotingBalance,
}) {
  const dispatch = useDispatch();
  const isMounted = useIsMounted();
  const { signerAccount, setIsSubmitting } = useContext(StateContext);

  const api = useApi(chain);

  const showErrorToast = (message) => dispatch(newErrorToast(message));

  const submit = async () => {
    if (!api) {
      return showErrorToast("Chain network is not connected yet");
    }

    if (!proposalIndex) {
      return;
    }

    if (!signerAccount) {
      return showErrorToast("Please select an account");
    }

    const toastId = newToastId();
    dispatch(newPendingToast(toastId, "Waiting for signing..."));

    try {
      setIsSubmitting(true);

      const signerAddress = signerAccount.address;

      const unsub = await api.tx.democracy
        .second(proposalIndex, depositorUpperBound || 0)
        .signAndSend(signerAddress, ({ events = [], status }) => {
          if (status.isFinalized) {
            onFinalized(signerAddress);
            unsub();
          }
          if (status.isInBlock) {
            // Transaction went through
            dispatch(updatePendingToast(toastId, "InBlock"));
            onInBlock(signerAddress);
          }
        });

      dispatch(updatePendingToast(toastId, "Broadcasting"));

      onSubmitted(signerAddress);

      onClose();
    } catch (e) {
      dispatch(removeToast(toastId));
      showErrorToast(e.message);
    } finally {
      if (isMounted.current) {
        setIsSubmitting(null);
      }
    }
  };

  return (
    <>
      <Signer
        chain={chain}
        api={api}
        extensionAccounts={extensionAccounts}
        useAddressVotingBalance={useAddressVotingBalance}
      />
      <DepositRequired chain={chain} depositRequired={depositRequired} />
      <SubmitButton
        chain={chain}
        onClick={submit}
        depositRequired={depositRequired}
      />
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
