import styled from "styled-components";
import { useState } from "react";
import { useDispatch } from "react-redux";
import BigNumber from "bignumber.js";

import { useApi } from "utils/hooks";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import Button from "next-common/components/button";
import {
  newErrorToast,
  newPendingToast,
  newToastId,
  updatePendingToast,
  removeToast,
} from "next-common/store/reducers/toastSlice";
import PopupWithAddress from "next-common/components/popupWithAddress";
import DepositRequired from "./depositRequired";
import Signer from "./signer";

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

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
}) {
  const dispatch = useDispatch();
  const isMounted = useIsMounted();
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState(0);

  const api = useApi(chain);

  const deposit =
    depositRequired || api?.consts?.democracy?.minimumDeposit?.toString();

  const balanceInsufficient = new BigNumber(balance).lt(deposit);

  const showErrorToast = (message) => dispatch(newErrorToast(message));

  const submit = async () => {
    if (!api) {
      return showErrorToast("Chain network is not connected yet");
    }

    if (!proposalIndex) {
      return;
    }

    if (!selectedAccount) {
      return showErrorToast("Please select an account");
    }

    const toastId = newToastId();
    dispatch(newPendingToast(toastId, "Waiting for signing..."));

    try {
      setLoading(true);

      const signerAddress = selectedAccount.address;

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
        setLoading(null);
      }
    }
  };

  return (
    <>
      <Signer
        chain={chain}
        api={api}
        extensionAccounts={extensionAccounts}
        selectedAccount={selectedAccount}
        setSelectedAccount={setSelectedAccount}
        balance={balance}
        setBalance={setBalance}
      />
      <DepositRequired
        chain={chain}
        depositRequired={depositRequired}
        balanceInsufficient={balanceInsufficient}
      />
      <ButtonWrapper>
        {balanceInsufficient ? (
          <Button disabled>Submit</Button>
        ) : (
          <Button secondary isLoading={loading} onClick={submit}>
            Submit
          </Button>
        )}
      </ButtonWrapper>
    </>
  );
}

export default function Popup(props) {
  return (
    <PopupWithAddress title="Second" Component={PopupContent} {...props} />
  );
}
