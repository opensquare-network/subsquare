import styled from "styled-components";
import { useState } from "react";
import { useDispatch } from "react-redux";

import useApi from "next-common/utils/hooks/useApi";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { emptyFunction } from "next-common/utils";
import PopupWithAddress from "next-common/components/popupWithAddress";
import { sendTx } from "next-common/utils/sendTx";
import SecondaryButton from "next-common/components/buttons/secondaryButton";
import useSetSignerAccount from "next-common/utils/hooks/useSetSignerAccount";
import Signer from "next-common/components/popup/fields/signerField";

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

function PopupContent({
  extensionAccounts,
  tipHash,
  onClose,
  onSubmitted = emptyFunction,
  onFinalized = emptyFunction,
  onInBlock = emptyFunction,
}) {
  const dispatch = useDispatch();
  const isMounted = useIsMounted();
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const api = useApi();

  useSetSignerAccount(extensionAccounts, setSelectedAccount);

  const showErrorToast = (message) => dispatch(newErrorToast(message));

  const doCloseTip = async () => {
    if (!api) {
      return showErrorToast("Chain network is not connected yet");
    }

    if (!selectedAccount) {
      return showErrorToast("Please select an account");
    }

    const tx = api.tx.tips.closeTip(tipHash);

    await sendTx({
      tx,
      dispatch,
      setLoading: setIsLoading,
      onFinalized,
      onInBlock,
      onSubmitted,
      onClose,
      signerAddress: selectedAccount.address,
      isMounted,
    });
  };

  return (
    <>
      <Signer
        selectedAccount={selectedAccount}
        setSelectedAccount={setSelectedAccount}
        extensionAccounts={extensionAccounts}
      />
      <ButtonWrapper>
        <SecondaryButton isLoading={isLoading} onClick={doCloseTip}>
          Confirm
        </SecondaryButton>
      </ButtonWrapper>
    </>
  );
}

export default function CloseTipPopup(props) {
  return (
    <PopupWithAddress title="Close tip" Component={PopupContent} {...props} />
  );
}
