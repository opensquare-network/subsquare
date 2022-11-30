import styled from "styled-components";
import { useState } from "react";
import { useDispatch } from "react-redux";

import useApi from "next-common/utils/hooks/useApi";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import { newErrorToast } from "next-common/store/reducers/toastSlice";

import {
  checkInputValue,
  emptyFunction,
  isAddressInGroup,
} from "next-common/utils";
import PopupWithAddress from "next-common/components/popupWithAddress";
import { WarningMessage } from "next-common/components/popup/styled";
import { sendTx } from "next-common/utils/sendTx";
import SecondaryButton from "next-common/components/buttons/secondaryButton";
import useSignerAccount from "next-common/utils/hooks/useSignerAccount";
import { useChainSettings } from "next-common/context/chain";
import Signer from "next-common/components/popup/fields/signerField";
import BalanceField from "next-common/components/popup/fields/balanceField";
import useCouncilMembers from "next-common/utils/hooks/useCouncilMembers";
import useAddressBalance from "next-common/utils/hooks/useAddressBalance";

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
  const api = useApi();

  const signerAccount = useSignerAccount(extensionAccounts);
  const [inputTipValue, setInputTipValue] = useState();
  const [tipping, setTipping] = useState(false);
  const { decimals } = useChainSettings();
  const [balance, loadingBalance] = useAddressBalance(
    api,
    signerAccount?.address
  );
  const councilTippers = useCouncilMembers();

  const selectedAccountIsTipper = isAddressInGroup(
    signerAccount?.address,
    councilTippers
  );
  const showErrorToast = (message) => dispatch(newErrorToast(message));

  const doEndorse = async () => {
    if (!api) {
      return showErrorToast("Chain network is not connected yet");
    }

    if (!tipHash) {
      return;
    }

    if (!signerAccount) {
      return showErrorToast("Please select an account");
    }

    let bnTipValue;
    try {
      bnTipValue = checkInputValue(inputTipValue, decimals, "tip value", true);
    } catch (err) {
      return showErrorToast(err.message);
    }

    const tx = api.tx.tips.tip(tipHash, bnTipValue.toString());

    const signerAddress = signerAccount.address;

    await sendTx({
      tx,
      dispatch,
      setLoading: setTipping,
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
      <WarningMessage danger={!selectedAccountIsTipper}>
        Only council members can tip.
      </WarningMessage>
      <Signer
        isBalanceLoading={loadingBalance}
        balance={balance}
        signerAccount={signerAccount}
      />
      <BalanceField
        title="Tip Value"
        isLoading={tipping}
        inputBalance={inputTipValue}
        setInputBalance={setInputTipValue}
      />
      <ButtonWrapper>
        <SecondaryButton isLoading={tipping} onClick={doEndorse}>
          Endorse
        </SecondaryButton>
      </ButtonWrapper>
    </>
  );
}

export default function EndorsePopup(props) {
  return <PopupWithAddress title="Tip" Component={PopupContent} {...props} />;
}
