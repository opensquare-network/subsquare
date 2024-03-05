import React, { useCallback, useState } from "react";

import {
  checkInputValue,
  emptyFunction,
  isAddressInGroup,
} from "next-common/utils";
import PopupWithSigner from "next-common/components/popupWithSigner";
import { WarningMessage } from "next-common/components/popup/styled";
import { useChainSettings } from "next-common/context/chain";
import BalanceField from "next-common/components/popup/fields/balanceField";
import useCouncilMembers from "next-common/utils/hooks/useCouncilMembers";
import { useSignerAccount } from "next-common/components/popupWithSigner/context";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { useDispatch } from "react-redux";
import { useContextApi } from "next-common/context/api";

function PopupContent({ tipHash, onClose, onInBlock = emptyFunction }) {
  const api = useContextApi();

  const signerAccount = useSignerAccount();

  const [inputTipValue, setInputTipValue] = useState("");
  const { decimals } = useChainSettings();
  const councilTippers = useCouncilMembers();
  const isTipper = isAddressInGroup(
    signerAccount?.realAddress,
    councilTippers || [],
  );
  const dispatch = useDispatch();

  const getTxFunc = useCallback(() => {
    if (!api || !api.tx.tips?.tip) {
      return;
    }

    try {
      const bnValue = checkInputValue(
        inputTipValue,
        decimals,
        "tip value",
        true,
      );
      return api.tx.tips.tip(tipHash, bnValue.toString());
    } catch (e) {
      dispatch(newErrorToast(e.message));
    }
  }, [dispatch, tipHash, api, inputTipValue, decimals]);

  return (
    <>
      <WarningMessage danger={!isTipper}>
        Only council members can tip.
      </WarningMessage>
      <SignerWithBalance />
      <BalanceField
        title="Tip Value"
        inputBalance={inputTipValue}
        setInputBalance={setInputTipValue}
      />
      <TxSubmissionButton
        title="Endorse"
        getTxFunc={getTxFunc}
        onClose={onClose}
        onInBlock={onInBlock}
      />
    </>
  );
}

export default function EndorsePopup(props) {
  return <PopupWithSigner title="Tip" Component={PopupContent} {...props} />;
}
