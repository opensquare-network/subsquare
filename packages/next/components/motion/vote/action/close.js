import { useSelector } from "react-redux";
import { latestHeightSelector } from "next-common/store/reducers/chainSlice";
import { usePost, usePostOnChainData } from "next-common/context/post";
import { useEffect, useState } from "react";
import GhostButton from "next-common/components/buttons/ghostButton";
import toApiCouncil from "next-common/utils/toApiCouncil";
import { useChain } from "next-common/context/chain";
import { useDetailType } from "next-common/context/page";
import useCollectiveProposal from "next-common/utils/hooks/collectives/useProposal";
import useWeight from "next-common/utils/hooks/common/useWeight";
import useCollectiveMembers from "next-common/utils/hooks/collectives/useCollectiveMembers";
import CloseMotionPopup from "./closeMotionPopup";

export default function Close() {
  const latestHeight = useSelector(latestHeightSelector);
  const onchainData = usePostOnChainData();
  const { voting: { end, nays = [], ayes = [], threshold } = {} } = onchainData || {};
  const chain = useChain();
  const type = useDetailType();
  const { hash, motionIndex } = usePost();
  const mod = toApiCouncil(chain, type);
  const { proposal } = useCollectiveProposal(mod, onchainData.hash);

  const { encodedCallLength, weight } = useWeight(proposal);
  const { members, loading: membersLoading } = useCollectiveMembers(mod);
  const hasFailed = threshold > Math.abs(members.length - nays.length);
  const [showClosePopup, setShowClosePopup] = useState(false);

  const [canClose, setCanClose] = useState(false);
  useEffect(() => {
    if (membersLoading) {
      return;
    }

    if (threshold > Math.abs(members.length - nays.length) || ayes.length >= threshold) { // failed or approved
      setCanClose(true);
    } else if (latestHeight >= end) { // reach end block number
      setCanClose(true);
    } else {
      setCanClose(false);
    }
  }, [membersLoading, members, ayes, nays, threshold, latestHeight, end]);

  return (
    <>
      <GhostButton
        isFill
        disabled={ !proposal || !canClose }
        onClick={ () => setShowClosePopup(true) }
      >
        Close
      </GhostButton>
      {showClosePopup && (
        <CloseMotionPopup
          chain={chain}
          type={type}
          hash={hash}
          motionIndex={motionIndex}
          weight={weight}
          encodedCallLength={encodedCallLength}
          hasFailed={hasFailed}
          onClose={() => setShowClosePopup(false)}
        />
      )}
    </>
  );
}
