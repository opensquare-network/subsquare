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
import PopupWithSigner from "next-common/components/popupWithSigner";
import { WarningMessage } from "next-common/components/popup/styled";
import { sendTx, wrapWithProxy } from "next-common/utils/sendTx";
import PrimaryButton from "next-common/components/buttons/primaryButton";
import { useChainSettings } from "next-common/context/chain";
import BalanceField from "next-common/components/popup/fields/balanceField";
import useCouncilMembers from "next-common/utils/hooks/useCouncilMembers";
import { PopupButtonWrapper } from "next-common/components/popup/wrapper";
import { useSignerAccount } from "next-common/components/popupWithSigner/context";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";

function PopupContent({ tipHash, onClose, onInBlock = emptyFunction }) {
  const dispatch = useDispatch();
  const isMounted = useIsMounted();
  const api = useApi();

  const signerAccount = useSignerAccount();

  const [inputTipValue, setInputTipValue] = useState("");
  const [tipping, setTipping] = useState(false);
  const { decimals } = useChainSettings();
  const councilTippers = useCouncilMembers();
  const isTipper = isAddressInGroup(
    signerAccount?.realAddress,
    councilTippers || [],
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

    let tx = api.tx.tips.tip(tipHash, bnTipValue.toString());

    if (signerAccount?.proxyAddress) {
      tx = wrapWithProxy(api, tx, signerAccount.proxyAddress);
    }

    await sendTx({
      tx,
      dispatch,
      setLoading: setTipping,
      onInBlock,
      onClose,
      signerAccount,
      isMounted,
    });
  };

  return (
    <>
      <WarningMessage danger={!isTipper}>
        Only council members can tip.
      </WarningMessage>
      <SignerWithBalance />
      <BalanceField
        title="Tip Value"
        isLoading={tipping}
        inputBalance={inputTipValue}
        setInputBalance={setInputTipValue}
      />
      <PopupButtonWrapper>
        <PrimaryButton isLoading={tipping} onClick={doEndorse}>
          Endorse
        </PrimaryButton>
      </PopupButtonWrapper>
    </>
  );
}

export default function EndorsePopup(props) {
  return <PopupWithSigner title="Tip" Component={PopupContent} {...props} />;
}
