import styled from "styled-components";
import { useState } from "react";
import { useDispatch } from "react-redux";

import useApi from "next-common/utils/hooks/useApi";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { emptyFunction, isSameAddress } from "next-common/utils";
import PopupWithAddress from "next-common/components/popupWithAddress";
import { WarningMessage } from "next-common/components/popup/styled";
import { sendTx } from "next-common/utils/sendTx";
import SecondaryButton from "next-common/components/buttons/secondaryButton";
import useSetDefaultSigner from "next-common/utils/hooks/useSetDefaultSigner";
import Signer from "next-common/components/popup/fields/signerField";
import useAddressBalance from "next-common/utils/hooks/useAddressBalance";

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const balanceMap = new Map();

function PopupContent({
  extensionAccounts,
  childBounty,
  onClose,
  onSubmitted = emptyFunction,
  onFinalized = emptyFunction,
  onInBlock = emptyFunction,
}) {
  const dispatch = useDispatch();
  const isMounted = useIsMounted();
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [claiming, setClaiming] = useState(false);
  const api = useApi();
  const [balance, isBalanceLoading] = useAddressBalance(
    api,
    selectedAccount?.address
  );

  useSetDefaultSigner(extensionAccounts, setSelectedAccount);

  const showErrorToast = (message) => dispatch(newErrorToast(message));

  const doClaim = async () => {
    if (!api) {
      return showErrorToast("Chain network is not connected yet");
    }

    if (!selectedAccount) {
      return showErrorToast("Please select an account");
    }

    const tx = api.tx.childBounties.claimChildBounty(
      childBounty.parentBountyId,
      childBounty.index
    );

    await sendTx({
      tx,
      dispatch,
      setLoading: setClaiming,
      onFinalized,
      onInBlock,
      onSubmitted,
      onClose,
      signerAddress: selectedAccount.address,
      isMounted,
    });
  };

  const showWarning = !isSameAddress(
    selectedAccount?.address,
    childBounty?.beneficiary
  );
  const warningContent = showWarning && (
    <WarningMessage danger>Only beneficiary can claim rewards.</WarningMessage>
  );

  return (
    <>
      <Signer
        balance={balance}
        isBalanceLoading={isBalanceLoading}
        isLoading={!balance}
        selectedAccount={selectedAccount}
        setSelectedAccount={setSelectedAccount}
        extensionAccounts={extensionAccounts}
      />
      {warningContent}
      <ButtonWrapper>
        <SecondaryButton isLoading={claiming} onClick={doClaim}>
          Confirm
        </SecondaryButton>
      </ButtonWrapper>
    </>
  );
}

export default function Popup(props) {
  return (
    <PopupWithAddress
      title="Claim reward"
      Component={PopupContent}
      {...props}
    />
  );
}
