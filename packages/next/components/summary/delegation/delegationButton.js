import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import styled, { css } from "styled-components";
import { useRouter } from "next/router";
import { useUser } from "next-common/context/user";
import useApi from "next-common/utils/hooks/useApi";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import { getSigner, sendTx } from "next-common/utils/sendTx";
import DelegatePopup from "components/gov2/delegatePopup";
import AddSVG from "./add.svg";
import RemoveSVG from "./remove.svg";

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

export default function DelegationButton({
  delegating,
  trackId,
  onUndelegateInBlock,
  onDelegateInBlock,
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showDelegatePopup, setShowDelegatePopup] = useState(false);

  const loginUser = useUser();
  const signerAddress = loginUser?.address;

  const api = useApi();
  const isMounted = useIsMounted();
  const dispatch = useDispatch();

  const removeDelegating = useCallback(async () => {
    if (isLoading) {
      return;
    }

    if (!api) {
      return showErrorToast("Chain network is not connected yet");
    }

    if (!signerAddress) {
      return showErrorToast("Please login first");
    }

    const signer = await getSigner(signerAddress);
    api.setSigner(signer);

    const tx = api.tx.convictionVoting.undelegate(trackId);

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
  }, [api, dispatch, signerAddress, onUndelegateInBlock, isMounted]);

  const openDelegatePopup = useCallback(() => {
    if (!loginUser) {
      router.push(`/login?redirect=${router.asPath}`);
      return;
    }
    setShowDelegatePopup(true);
  }, [router, loginUser]);

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
          trackId={trackId}
          onInBlock={onDelegateInBlock}
          onClose={() => setShowDelegatePopup(false)}
        />
      )}
    </>
  );
}
