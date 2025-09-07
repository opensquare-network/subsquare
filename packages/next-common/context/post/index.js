import React, { createContext, useContext, useEffect, useReducer } from "react";
import { useDetailType } from "../page";
import { detailPageCategory } from "../../utils/consts/business/category";
import {
  getGov2ReferendumTitle,
  getGov2TreasuryProposalTitle,
} from "../../utils/gov2/title";
import getAnnouncementTitle from "../../utils/alliance/title";
import sortTimeline from "next-common/utils/timeline/sort";

const PostContext = createContext(null);
const PostDispatchContext = createContext(null);
export const POST_UPDATE_ACTION = "UPDATE";

export function PostProvider({ children, post }) {
  const [detail, dispatch] = useReducer(postReducer, post);
  useEffect(() => {
    dispatch({
      type: POST_UPDATE_ACTION,
      post,
    });
  }, [post]);

  return (
    <PostContext.Provider value={detail}>
      <PostDispatchContext.Provider value={dispatch}>
        {children}
      </PostDispatchContext.Provider>
    </PostContext.Provider>
  );
}

function postReducer(post, action) {
  if (action.type !== POST_UPDATE_ACTION) {
    throw new Error(`Unknown post action: ${action.type}`);
  }

  return action.post;
}

export function usePostDispatch() {
  return useContext(PostDispatchContext);
}

export function usePost() {
  return useContext(PostContext);
}

export function usePostTitle() {
  const post = usePost();
  const type = useDetailType();

  let title = post.title || "--";
  if (
    [
      detailPageCategory.GOV2_REFERENDUM,
      detailPageCategory.FELLOWSHIP_REFERENDUM,
    ].includes(type)
  ) {
    title = getGov2ReferendumTitle(post);
  } else if (detailPageCategory.TREASURY_PROPOSAL === type) {
    title = getGov2TreasuryProposalTitle(post);
  } else if (detailPageCategory.ALLIANCE_ANNOUNCEMENT === type) {
    title = getAnnouncementTitle(post);
  }

  return title;
}

export function usePostOnChainData() {
  const post = useContext(PostContext);
  if (!post?.onchainData) {
    throw new Error("onchainData not existed");
  }

  return post?.onchainData;
}

export function usePostState() {
  const post = useContext(PostContext);
  return post?.onchainData?.state?.state || post?.onchainData?.state?.name;
}

export function usePostStateInfo() {
  const post = useContext(PostContext);
  return post?.onchainData?.state;
}

export function useOnchainData() {
  const post = useContext(PostContext);
  if (!post?.onchainData) {
    throw new Error("No on chain data when call `useOnchainData`");
  }
  return post.onchainData;
}

export function useTimelineData() {
  const onchainData = useOnchainData();
  const timeline = onchainData?.timeline || [];
  return sortTimeline(timeline);
}

export function useReferendumApprovedOrThrow() {
  const onchainData = useOnchainData();
  if (!onchainData?.approved) {
    throw new Error("No approved data when call useReferendumApprovedOrThrow");
  }
  return onchainData?.approved;
}

export function useReferendumApprovedHeightOrThrow() {
  const approved = useReferendumApprovedOrThrow();
  return approved[0];
}
