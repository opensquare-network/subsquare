import React, { useCallback, useMemo, useState } from "react";

import useApi from "next-common/utils/hooks/useApi";

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
import BigNumber from "bignumber.js";

function PopupContent({ tipHash, onClose, onInBlock = emptyFunction }) {
  const api = useApi();

  const signerAccount = useSignerAccount();

  const [inputTipValue, setInputTipValue] = useState("");
  const { decimals } = useChainSettings();
  const councilTippers = useCouncilMembers();
  const isTipper = isAddressInGroup(
    signerAccount?.realAddress,
    councilTippers || [],
  );

  const errorCheck = useCallback(() => {
    checkInputValue(inputTipValue, decimals, "tip value", true);
  }, [inputTipValue, decimals]);

  const tx = useMemo(() => {
    if (!api || !api.tx.tips?.tip || !inputTipValue) {
      return null;
    }

    const bnValue = new BigNumber(inputTipValue).times(Math.pow(10, decimals));
    if (bnValue.isNaN()) {
      return null;
    }

    try {
      return api.tx.tips.tip(tipHash, bnValue.toString());
    } catch (e) {
      // todo: maybe show error on a toast
      return null;
    }
  }, [api, inputTipValue, decimals]);

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
        tx={tx}
        onClose={onClose}
        onInBlock={onInBlock}
        errorCheck={errorCheck}
      />
    </>
  );
}

export default function EndorsePopup(props) {
  return <PopupWithSigner title="Tip" Component={PopupContent} {...props} />;
}
