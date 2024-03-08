import { useCallback, useEffect } from "react";
import { usePostDispatch } from "next-common/context/post";
import fetchAndUpdatePost from "next-common/context/post/update";
import { useDetailType } from "next-common/context/page";
import useIsProposalFinished from "next-common/hooks/proposal/useIsProposalFinished";
import { useSelector } from "react-redux";
import { blockTimeSelector } from "next-common/store/reducers/chainSlice";
import { isNil } from "lodash-es";

export default function useSubscribePostDetail(postId) {
  const type = useDetailType();
  const isFinished = useIsProposalFinished();
  const blockTime = useSelector(blockTimeSelector);

  const postDispatch = usePostDispatch();
  const onPostUpdated = useCallback(() => {
    // todo: we should update only on chain state and timeline
    fetchAndUpdatePost(postDispatch, type, postId);
  }, [postDispatch, type, postId]);

  useEffect(() => {
    if (isNil(isFinished) || isFinished || !blockTime) {
      return;
    }

    const interval = setInterval(
      () => {
        onPostUpdated();
      },
      parseInt(blockTime) || 12000,
    );
    return () => clearInterval(interval);
  }, [postId, onPostUpdated, blockTime, isFinished]);
}
