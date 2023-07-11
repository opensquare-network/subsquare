import { useCallback, useEffect } from "react";
import { usePostDispatch } from "next-common/context/post";
import fetchAndUpdatePost from "next-common/context/post/update";
import { useSocket } from "next-common/context/socket";
import { detailPageCategory } from "next-common/utils/consts/business/category";

const postStatusRoom = "POST_STATUS_ROOM";

function getRoomId(postType, postId) {
  return `${postStatusRoom}:${postType}:${postId}`;
}

export const postTypes = Object.freeze({
  tip: "tip",
  treasuryProposal: "treasuryProposal",
  bounty: "bounty",
  childBounty: "childBounty",
  motion: "motion",
  techCommMotion: "techCommMotion",
  financialMotion: "financialMotion",
  advisoryCommitteeMotion: "advisoryCommitteeMotion",
  democracyReferendum: "democracyReferendum",
  democracyExternal: "democracyExternal",
  democracyPublicProposal: "democracyPublicProposal",
  referendaReferendum: "referendaReferendum",
  fellowshipReferendum: "fellowshipReferendum",
  allianceMotion: "allianceMotion",
  allianceAnnouncement: "allianceAnnouncement",
  moonCouncil: "moonCouncil",
  openTechCommittee: "openTechCommittee",
});

const detailTypeToPostTypeMap = Object.freeze({
  [detailPageCategory.TREASURY_TIP]: postTypes.tip,
  [detailPageCategory.TREASURY_PROPOSAL]: postTypes.treasuryProposal,
  [detailPageCategory.TREASURY_BOUNTY]: postTypes.bounty,
  [detailPageCategory.TREASURY_CHILD_BOUNTY]: postTypes.childBounty,
  [detailPageCategory.COUNCIL_MOTION]: postTypes.motion,
  [detailPageCategory.TECH_COMM_MOTION]: postTypes.techCommMotion,
  [detailPageCategory.FINANCIAL_MOTION]: postTypes.financialMotion,
  [detailPageCategory.ADVISORY_MOTION]: postTypes.advisoryCommitteeMotion,
  [detailPageCategory.DEMOCRACY_REFERENDUM]: postTypes.democracyReferendum,
  [detailPageCategory.DEMOCRACY_EXTERNAL]: postTypes.democracyExternal,
  [detailPageCategory.DEMOCRACY_PROPOSAL]: postTypes.democracyPublicProposal,
  [detailPageCategory.GOV2_REFERENDUM]: postTypes.referendaReferendum,
  [detailPageCategory.FELLOWSHIP_REFERENDUM]: postTypes.fellowshipReferendum,
  [detailPageCategory.ALLIANCE_MOTION]: postTypes.allianceMotion,
  [detailPageCategory.ALLIANCE_ANNOUNCEMENT]: postTypes.allianceAnnouncement,
  [detailPageCategory.TREASURY_COUNCIL_MOTION]: postTypes.moonCouncil,
  [detailPageCategory.OPEN_TECH_COMM_PROPOSAL]: postTypes.openTechCommittee,
});

function detailTypeToPostType(detailType) {
  return detailTypeToPostTypeMap[detailType];
}

export default function useSubscribePostDetail({ detailType, postId }) {
  const socket = useSocket();
  const postDispatch = usePostDispatch();
  const onPostUpdated = useCallback(() => {
    fetchAndUpdatePost(postDispatch, detailType, postId);
  }, [postDispatch, detailType, postId]);

  useEffect(() => {
    if (!socket) {
      return;
    }

    const postType = detailTypeToPostType(detailType);
    const roomId = getRoomId(postType, postId);

    socket.emit("subscribe", roomId);
    socket.on("postUpdated", onPostUpdated);

    return () => {
      socket.emit("unsubscribe", roomId);
      socket.off("postUpdated", onPostUpdated);
    };
  }, [socket, detailType, postId, onPostUpdated]);
}
