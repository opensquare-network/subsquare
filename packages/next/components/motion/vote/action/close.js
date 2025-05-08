import { usePost, usePostOnChainData } from "next-common/context/post";
import { useEffect, useState } from "react";
import SecondaryButton from "next-common/lib/button/secondary";
import useCollectiveProposal from "next-common/utils/hooks/collectives/useProposal";
import useWeight from "next-common/utils/hooks/common/useWeight";
import useCollectiveMembers from "next-common/utils/hooks/collectives/useCollectiveMembers";
import useChainOrScanHeight from "next-common/hooks/height";
import dynamicPopup from "next-common/lib/dynamic/popup";
import { useCollectivePallet } from "next-common/context/collective";

const CloseMotionPopup = dynamicPopup(() => import("./closeMotionPopup"));

export default function Close() {
  const latestHeight = useChainOrScanHeight();
  const onchainData = usePostOnChainData();
  const { voting: { end, nays = [], ayes = [], threshold } = {} } =
    onchainData || {};
  const { hash, motionIndex } = usePost();
  const pallet = useCollectivePallet();
  const { proposal } = useCollectiveProposal(pallet, onchainData.hash);

  const { encodedCallLength, weight } = useWeight(proposal);
  const { members = [], loading: membersLoading } =
    useCollectiveMembers(pallet);
  const hasFailed = threshold > Math.abs(members?.length - nays.length);
  const [showClosePopup, setShowClosePopup] = useState(false);

  const [canClose, setCanClose] = useState(false);
  useEffect(() => {
    if (membersLoading) {
      return;
    }

    if (
      threshold > Math.abs(members?.length - nays.length) ||
      ayes.length >= threshold
    ) {
      // failed or approved
      setCanClose(true);
    } else if (latestHeight >= end) {
      // reach end block number
      setCanClose(true);
    } else {
      setCanClose(false);
    }
  }, [membersLoading, members, ayes, nays, threshold, latestHeight, end]);

  return (
    <>
      <SecondaryButton
        className="w-full"
        disabled={!proposal || !canClose}
        onClick={() => setShowClosePopup(true)}
      >
        Close
      </SecondaryButton>
      {showClosePopup && (
        <CloseMotionPopup
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
