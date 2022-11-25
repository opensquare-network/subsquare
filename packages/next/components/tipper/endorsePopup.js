import styled from "styled-components";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import useApi from "next-common/utils/hooks/useApi";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import { newErrorToast } from "next-common/store/reducers/toastSlice";

import {
  checkInputValue,
  emptyFunction,
  isAddressInGroup,
  toPrecision,
} from "next-common/utils";
import PopupWithAddress from "next-common/components/popupWithAddress";
import { WarningMessage } from "next-common/components/popup/styled";
import { sendTx } from "next-common/utils/sendTx";
import SecondaryButton from "next-common/components/buttons/secondaryButton";
import useSetSignerAccount from "next-common/utils/hooks/useSetSignerAccount";
import { encodeAddressToChain } from "next-common/services/address";
import { useChain, useChainSettings } from "next-common/context/chain";
import Signer from "next-common/components/popup/fields/signerField";
import BalanceField from "next-common/components/popup/fields/balanceField";
import useCouncilMembers from "next-common/utils/hooks/useCouncilMembers";

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const balanceMap = new Map();

function PopupContent({
  extensionAccounts,
  tipHash,
  onClose,
  onSubmitted = emptyFunction,
  onFinalized = emptyFunction,
  onInBlock = emptyFunction,
}) {
  const chain = useChain();
  const dispatch = useDispatch();
  const isMounted = useIsMounted();
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [inputTipValue, setInputTipValue] = useState();
  const [tipping, setTipping] = useState(false);
  const [balance, setBalance] = useState();
  const { decimals } = useChainSettings();
  const [selectedAddress, setSelectedAddress] = useState(
    selectedAccount?.address
  );
  const councilTippers = useCouncilMembers();

  useEffect(() => {
    setSelectedAddress(encodeAddressToChain(selectedAccount?.address, chain));
  }, [selectedAccount, chain]);

  useSetSignerAccount(extensionAccounts, setSelectedAccount);
  const selectedAccountIsTipper = isAddressInGroup(
    selectedAddress,
    councilTippers
  );
  const api = useApi();

  useEffect(() => {
    if (balanceMap.has(selectedAddress)) {
      setBalance(balanceMap.get(selectedAddress));
      return;
    }
    setBalance();
    if (api && selectedAddress) {
      api.query.system.account(selectedAddress).then((result) => {
        if (isMounted.current) {
          const free = toPrecision(result.data.free, decimals);
          setBalance(free);
          balanceMap.set(selectedAddress, free);
        }
      });
    }
  }, [api, selectedAddress, decimals, isMounted]);

  const showErrorToast = (message) => dispatch(newErrorToast(message));

  const doEndorse = async () => {
    if (!api) {
      return showErrorToast("Chain network is not connected yet");
    }

    if (!tipHash) {
      return;
    }

    if (!selectedAccount) {
      return showErrorToast("Please select an account");
    }

    let bnTipValue;
    try {
      bnTipValue = checkInputValue(inputTipValue, decimals, "tip value");
    } catch (err) {
      return showErrorToast(err.message);
    }

    const tx = api.tx.tips.tip(tipHash, bnTipValue.toString());

    const signerAddress = selectedAccount.address;

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
        isBalanceLoading={!balance}
        balance={balance}
        selectedAccount={selectedAccount}
        setSelectedAccount={setSelectedAccount}
        extensionAccounts={extensionAccounts}
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
