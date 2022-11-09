import styled from "styled-components";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import useApi from "next-common/utils/hooks/useSelectedEnpointApi";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import { newErrorToast } from "next-common/store/reducers/toastSlice";

import TipInput from "./tipInput";
import {
  checkInputValue,
  emptyFunction,
  getNode,
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

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const balanceMap = new Map();

function PopupContent({
  extensionAccounts,
  chain,
  councilTippers,
  tipHash,
  onClose,
  onSubmitted = emptyFunction,
  onFinalized = emptyFunction,
  onInBlock = emptyFunction,
}) {
  const dispatch = useDispatch();
  const isMounted = useIsMounted();
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [inputTipValue, setInputTipValue] = useState();
  const [tipping, setTipping] = useState(false);
  const [balance, setBalance] = useState();
  const node = getNode(chain);
  const [selectedAddress, setSelectedAddress] = useState(
    selectedAccount?.address
  );

  useEffect(() => {
    setSelectedAddress(encodeAddressToChain(selectedAccount?.address, chain));
  }, [selectedAccount, chain]);

  useSetDefaultSigner(extensionAccounts, setSelectedAccount);

  const selectedAccountIsTipper = councilTippers.includes(selectedAddress);

  const api = useApi(chain);

  useEffect(() => {
    if (balanceMap.has(selectedAddress)) {
      setBalance(balanceMap.get(selectedAddress));
      return;
    }
    setBalance();
    if (api && selectedAddress) {
      api.query.system.account(selectedAddress).then((result) => {
        if (isMounted.current) {
          const free = toPrecision(result.data.free, node.decimals);
          setBalance(free);
          balanceMap.set(selectedAddress, free);
        }
      });
    }
  }, [api, selectedAddress, node.decimals, isMounted]);

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

    if (!node) {
      return;
    }

    let bnTipValue;
    try {
      bnTipValue = checkInputValue(inputTipValue, node.decimals, "tip value");
    } catch (err) {
      return showErrorToast(err.message);
    }

    const tx = api.tx.tips.tip(tipHash, bnTipValue.toNumber());

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
          symbol={node.symbol}
        />
        <SignerSelect
          api={api}
          chain={chain}
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
          symbol={node?.symbol}
        />
      </div>
      <ButtonWrapper>
        {selectedAccountIsTipper ? (
          <SecondaryButton isLoading={tipping} onClick={doEndorse}>
            Endorse
          </SecondaryButton>
        ) : (
          <SecondaryButton disabled>Endorse</SecondaryButton>
        )}
      </ButtonWrapper>
    </>
  );
}

export default function Popup(props) {
  return <PopupWithAddress title="Tip" Component={PopupContent} {...props} />;
}
