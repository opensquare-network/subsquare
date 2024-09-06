// todo: we should handle proposal inline type

import useInlineCall from "next-common/components/democracy/metadata/useInlineCall";
import { usePost, useTimelineData } from "next-common/context/post";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { referendumStatusSelector } from "next-common/store/reducers/referendumSlice";

export function useDemocracyReferendumHash() {
  const post = usePost();
  const timeline = useTimelineData();
  const onchainData = post?.onchainData;
  const referendumStatus = useSelector(referendumStatusSelector);
  const proposal = referendumStatus?.proposal;
  const proposalHash = referendumStatus?.proposalHash || onchainData?.hash;
  const preImage = onchainData?.preImage;

  const { hash: inlineHash } = useInlineCall(timeline, proposal);
  const [hash, setHash] = useState(proposalHash);

  useEffect(() => {
    if (hash) {
      return;
    }

    if (proposal?.lookup?.hash) {
      setHash(proposal?.lookup?.hash);
    } else if (proposal?.legacy?.hash) {
      setHash(proposal?.legacy?.hash);
    } else if (proposal?.inline && inlineHash) {
      setHash(inlineHash);
    } else if (preImage?.hash) {
      setHash(preImage?.hash);
    } else {
      setHash(proposalHash);
    }
  }, [proposal, proposalHash, inlineHash, hash, preImage?.hash]);

  return hash;
}
