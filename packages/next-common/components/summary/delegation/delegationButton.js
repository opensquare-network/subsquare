import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { useUser } from "../../../context/user";
import useApi from "../../../utils/hooks/useApi";
import useIsMounted from "../../../utils/hooks/useIsMounted";
import { sendTx } from "../../../utils/sendTx";
import AddSVG from "./add.svg";
import RemoveSVG from "./remove.svg";

const Button = styled.div`
  cursor: pointer;

  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  color: ${(p) => p.theme.textPrimary};

  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4px 12px;
  gap: 4px;
  background: ${(p) => p.theme.neutral};
  border: 1px solid ${(p) => p.theme.grey300Border};
  border-radius: 4px;

  svg {
    path {
      stroke: ${(p) => p.theme.textPrimary};
    }
  }
`;

export default function DelegationButton({ delegating, trackId, onInBlock }) {
  const [isLoading, setIsLoading] = useState(false);

  const loginUser = useUser();
  const signerAddress = loginUser?.address;

  const api = useApi();
  const isMounted = useIsMounted();
  const dispatch = useDispatch();

  const removeDelegating = useCallback(async () => {
    if (!api) {
      return showErrorToast("Chain network is not connected yet");
    }

    if (!signerAddress) {
      return showErrorToast("Please login first");
    }

    const { web3Enable, web3FromAddress } = await import(
      "@polkadot/extension-dapp"
    );

    await web3Enable("subsquare");
    const injector = await web3FromAddress(signerAddress);
    api.setSigner(injector.signer);

    const tx = api.tx.convictionVoting.undelegate(trackId);
    await sendTx({
      tx,
      dispatch,
      setLoading: setIsLoading,
      onInBlock,
      signerAddress,
      isMounted,
    });
  }, [api, dispatch, signerAddress, onInBlock, isMounted]);

  const addDelegationButton = (
    <Button>
      <AddSVG />
      Delegate
    </Button>
  );

  //TODO: button loading
  const removeDelegationButton = (
    <Button onClick={removeDelegating}>
      <RemoveSVG />
      Remove
    </Button>
  );

  return delegating ? removeDelegationButton : addDelegationButton;
}
