import { includes } from "lodash-es";
import { useChain } from "next-common/context/chain";
import { usePost } from "next-common/context/post";
import useReferendumVotingFinishHeight from "next-common/context/post/referenda/useReferendumVotingFinishHeight";
import getDvAddresses from "next-common/utils/dv";
import { useCallback } from "react";

export function useIsDVAddress(address) {
  const isDVAddressFn = useIsDVAddressFn();

  return isDVAddressFn(address);
}

export function useIsDVAddressFn() {
  const post = usePost();
  const finishHeight = useReferendumVotingFinishHeight();
  const chain = useChain();

  return useCallback(
    (address) => {
      const dvAddresses = getDvAddresses(chain, post.track, finishHeight);

      return includes(dvAddresses, address);
    },
    [post, finishHeight, chain],
  );
}
