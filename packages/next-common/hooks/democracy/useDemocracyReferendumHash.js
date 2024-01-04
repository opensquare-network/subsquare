// todo: we should handle proposal inline type

import useInlineCall from "next-common/components/democracy/metadata/useInlineCall";
import { usePost, useTimelineData } from "next-common/context/post";
import useMaybeFetchReferendumStatus from "next-common/utils/hooks/referenda/useMaybeFetchReferendumStatus";
import useApi from "next-common/utils/hooks/useApi";
import { useEffect, useState } from "react";

export function useDemocracyReferendumHash() {
  const api = useApi();
  const post = usePost();
  const timeline = useTimelineData();
  const onchainData = post?.onchainData;
  const referendumStatus = useMaybeFetchReferendumStatus(onchainData, api);
  const proposal = referendumStatus?.proposal;
  const proposalHash = referendumStatus?.proposalHash;
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
  }, [proposal, proposalHash, inlineHash]);

  return hash;
}
