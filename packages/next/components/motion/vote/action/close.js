import { useDispatch, useSelector } from "react-redux";
import { latestHeightSelector } from "next-common/store/reducers/chainSlice";
import { usePost, usePostOnChainData } from "next-common/context/post";
import { useState } from "react";
import GhostButton from "next-common/components/buttons/ghostButton";
import toApiCouncil from "next-common/utils/toApiCouncil";
import useApi from "next-common/utils/hooks/useApi";
import { useChain } from "next-common/context/chain";
import { useDetailType } from "next-common/context/page";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import useSignerAccount from "next-common/utils/hooks/useSignerAccount";
import { sendTx, wrapWithProxy } from "next-common/utils/sendTx";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import useExtensionAccounts from "next-common/utils/hooks/useExtensionAccounts";
import useCollectiveProposal from "next-common/utils/hooks/collectives/useProposal";
import useWeight from "next-common/utils/hooks/common/useWeight";
import useCollectiveMembers from "next-common/utils/hooks/collectives/useCollectiveMembers";

export default function Close({ refreshData }) {
  const latestHeight = useSelector(latestHeightSelector);
  const onchainData = usePostOnChainData();
  const { voting: { end } = {} } = onchainData || {};
  const api = useApi();
  const chain = useChain();
  const type = useDetailType();
  const dispatch = useDispatch();
  const { hash, motionIndex } = usePost();
  const isMounted = useIsMounted();
  const mod = toApiCouncil(chain, type);
  const { proposal } = useCollectiveProposal(mod, onchainData.hash);
  const { encodedCallLength, weight } = useWeight(proposal);
  const { voting: { nays = [], threshold } = {} } = onchainData;
  const { members } = useCollectiveMembers(mod);
  const hasFailed = threshold > Math.abs(members.length - nays.length);

  const [loading, setLoading] = useState(false);
  const { accounts: extensionAccounts } = useExtensionAccounts("subsquare");
  const signerAccount = useSignerAccount(extensionAccounts);

  if (latestHeight < end) {
    return null;
  }

  const showErrorToast = (message) => dispatch(newErrorToast(message));

  const closeMethod = api?.tx?.[toApiCouncil(chain, type)]?.close;
  const doClose = async () => {
    if (loading) {
      return;
    }

    if (!closeMethod) {
      return showErrorToast("Chain network is not connected yet");
    }

    let tx;
    if (closeMethod.meta?.args?.length !== 4) {
      tx = closeMethod(hash, motionIndex);
    } else if (hasFailed) {
      tx = closeMethod(hash, motionIndex, 0, 0);
    } else {
      tx = closeMethod(hash, motionIndex, weight, encodedCallLength);
    }

    if (signerAccount?.proxyAddress) {
      tx = wrapWithProxy(api, tx, signerAccount.proxyAddress);
    }

    await sendTx({
      tx,
      dispatch,
      setLoading: (loading) => {
        setLoading(!!loading);
      },
      onFinalized: async () => {
        await refreshData();
        window.setTimeout(() => {
          window.location.reload();
        }, 12000);
      },
      signerAddress: signerAccount.address,
      isMounted,
    });
  };

  return <GhostButton
    isFill
    isLoading={ loading }
    disabled={ !proposal || !signerAccount }
    onClick={ doClose }>Close</GhostButton>;
}
