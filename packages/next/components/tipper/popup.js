import styled from "styled-components";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import useApi from "next-common/utils/hooks/useApi";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import { newErrorToast } from "next-common/store/reducers/toastSlice";

import TipInput from "./tipInput";
import {
  checkInputValue,
  emptyFunction,
  isAddressInGroup,
  toPrecision,
} from "next-common/utils";
import PopupWithAddress from "next-common/components/popupWithAddress";
import SignerSelect from "next-common/components/signerSelect";
import PopupLabelWithBalance from "next-common/components/popup/balanceLabel";
import PopupLabel from "next-common/components/popup/label";
import { WarningMessage } from "next-common/components/popup/styled";
import { sendTx } from "next-common/utils/sendTx";
import SecondaryButton from "next-common/components/buttons/secondaryButton";
import useSetDefaultSigner from "next-common/utils/hooks/useSetDefaultSigner";
import { encodeAddressToChain } from "next-common/services/address";
import { useChain, useChainSettings } from "next-common/context/chain";

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const balanceMap = new Map();

function PopupContent({
  extensionAccounts,
  councilTippers,
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
  const { decimals, symbol } = useChainSettings();
  const [selectedAddress, setSelectedAddress] = useState(
    selectedAccount?.address
  );

  useEffect(() => {
    setSelectedAddress(encodeAddressToChain(selectedAccount?.address, chain));
  }, [selectedAccount, chain]);

  useSetDefaultSigner(extensionAccounts, setSelectedAccount);
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
      <div>
        <PopupLabelWithBalance
          text="Address"
          balanceName={"Balance"}
          balance={balance}
          isLoading={!balance}
          symbol={symbol}
        />
        <SignerSelect
          api={api}
          selectedAccount={selectedAccount}
          setSelectedAccount={setSelectedAccount}
          extensionAccounts={extensionAccounts}
        />
      </div>
      <div>
        <PopupLabel text={"Tip Value"} />
        <TipInput
          value={inputTipValue}
          setValue={setInputTipValue}
          symbol={symbol}
        />
      </div>
      <ButtonWrapper>
        <SecondaryButton isLoading={tipping} onClick={doEndorse}>
          Endorse
        </SecondaryButton>
      </ButtonWrapper>
    </>
  );
}

export default function Popup(props) {
  return <PopupWithAddress title="Tip" Component={PopupContent} {...props} />;
}
