import { useCallback, useEffect } from "react";
import { usePostDispatch } from "next-common/context/post";
import fetchAndUpdatePost from "next-common/context/post/update";
import { useSocket } from "next-common/context/socket";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import { useDetailType } from "next-common/context/page";
import useIsProposalFinished from "next-common/hooks/proposal/useIsProposalFinished";

const postStatusRoom = "POST_STATUS_ROOM";

function getRoomId(postType, postId) {
  return `${postStatusRoom}:${postType}:${postId}`;
}

const detailTypeToPostTypeMap = Object.freeze({
  [detailPageCategory.TREASURY_TIP]: "tip",
  [detailPageCategory.TREASURY_PROPOSAL]: "treasuryProposal",
  [detailPageCategory.TREASURY_BOUNTY]: "bounty",
  [detailPageCategory.TREASURY_CHILD_BOUNTY]: "childBounty",
  [detailPageCategory.COUNCIL_MOTION]: "motion",
  [detailPageCategory.TECH_COMM_MOTION]: "techCommMotion",
  [detailPageCategory.FINANCIAL_MOTION]: "financialMotion",
  [detailPageCategory.ADVISORY_MOTION]: "advisoryCommitteeMotion",
  [detailPageCategory.DEMOCRACY_REFERENDUM]: "democracyReferendum",
  [detailPageCategory.DEMOCRACY_EXTERNAL]: "democracyExternal",
  [detailPageCategory.DEMOCRACY_PROPOSAL]: "democracyPublicProposal",
  [detailPageCategory.GOV2_REFERENDUM]: "referendaReferendum",
  [detailPageCategory.FELLOWSHIP_REFERENDUM]: "fellowshipReferendum",
  [detailPageCategory.ALLIANCE_MOTION]: "allianceMotion",
  [detailPageCategory.ALLIANCE_ANNOUNCEMENT]: "allianceAnnouncement",
  [detailPageCategory.TREASURY_COUNCIL_MOTION]: "moonCouncil",
  [detailPageCategory.OPEN_TECH_COMM_PROPOSAL]: "openTechCommittee",
});

function detailTypeToPostType(detailType) {
  const postType = detailTypeToPostTypeMap[detailType];
  if (!postType) {
    throw new Error(`Unknown detail type: ${detailType}`);
  }
  return postType;
}

export default function useSubscribePostDetail(postId) {
  const type = useDetailType();
  const socket = useSocket();
  const isFinished = useIsProposalFinished();

  const postDispatch = usePostDispatch();
  const onPostUpdated = useCallback(() => {
    fetchAndUpdatePost(postDispatch, type, postId);
  }, [postDispatch, type, postId]);

  useEffect(() => {
    if (!socket || isFinished !== false) {
      return;
    }

    const postType = detailTypeToPostType(type);
    const roomId = getRoomId(postType, postId);

    socket.emit("subscribe", roomId);
    socket.on("postUpdated", onPostUpdated);

    return () => {
      socket.emit("unsubscribe", roomId);
      socket.off("postUpdated", onPostUpdated);
    };
  }, [socket, type, postId, onPostUpdated]);
}
