import React from "react";
import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import styled, { css } from "styled-components";
import { useUser } from "next-common/context/user";
import useApi from "next-common/utils/hooks/useApi";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import { getSigner, sendTx } from "next-common/utils/sendTx";
import DelegatePopup from "next-common/components/democracy/delegatePopup";
import AddSVG from "next-common/assets/imgs/icons/add.svg";
import RemoveSVG from "next-common/assets/imgs/icons/remove.svg";
import { newErrorToast } from "next-common/store/reducers/toastSlice";

const Button = styled.div`
  cursor: pointer;

  ${(p) =>
    p.disabled &&
    css`
      pointer-events: none;
    `}

  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  color: ${(p) => (p.disabled ? p.theme.textSecondary : p.theme.textPrimary)};

  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4px 12px;
  gap: 4px;
  background: ${(p) => p.theme.neutral};
  border: 1px solid ${(p) => p.theme.grey300Border};
  border-radius: 4px;
  :hover {
    border-color: ${(p) => p.theme.grey400Border};
  }

  svg {
    path {
      stroke: ${(p) =>
        p.disabled ? p.theme.textSecondary : p.theme.textPrimary};
    }
  }
`;

export default function DemocracySummaryDelegationButton({
  delegating,
  onUndelegateInBlock,
  onDelegateInBlock,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [showDelegatePopup, setShowDelegatePopup] = useState(false);

  const loginUser = useUser();
  const signerAddress = loginUser?.address;

  const api = useApi();
  const isMounted = useIsMounted();
  const dispatch = useDispatch();

  const showErrorToast = useCallback(
    (message) => dispatch(newErrorToast(message)),
    [dispatch]
  );

  const removeDelegating = useCallback(async () => {
    if (!api) {
      return showErrorToast("Chain network is not connected yet");
    }

    if (!signerAddress) {
      return showErrorToast("Please login first");
    }

    try {
      const signer = await getSigner(signerAddress);
      api.setSigner(signer);
    } catch (e) {
      return showErrorToast(`Unable to find injected ${signerAddress}`);
    }

    const tx = api.tx.democracy.undelegate();

    setIsLoading(true);
    try {
      await sendTx({
        tx,
        dispatch,
        setLoading: setIsLoading,
        onInBlock: onUndelegateInBlock,
        signerAddress,
        isMounted,
      });
    } finally {
      setIsLoading(false);
    }
  }, [
    api,
    dispatch,
    signerAddress,
    onUndelegateInBlock,
    isMounted,
    showErrorToast,
  ]);

  const openDelegatePopup = useCallback(() => {
    setShowDelegatePopup(true);
  }, []);

  const addDelegationButton = (
    <Button onClick={openDelegatePopup}>
      <AddSVG />
      Delegate
    </Button>
  );

  const removeDelegationButton = (
    <Button disabled={isLoading} onClick={removeDelegating}>
      <RemoveSVG />
      Remove
    </Button>
  );

  return (
    <>
      {delegating ? removeDelegationButton : addDelegationButton}
      {showDelegatePopup && (
        <DelegatePopup
          onInBlock={onDelegateInBlock}
          onClose={() => setShowDelegatePopup(false)}
        />
      )}
    </>
  );
}
