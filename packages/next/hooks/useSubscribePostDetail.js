import { useCallback, useEffect } from "react";
import { usePostDispatch } from "next-common/context/post";
import fetchAndUpdatePost from "next-common/context/post/update";
import { useSocket } from "next-common/context/socket";

const postStatusRoom = "POST_STATUS_ROOM";

function getRoomId(postType, postId) {
  return `${postStatusRoom}:${postType}:${postId}`;
}

export const postTypes = Object.freeze({
  post: "post",
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

export default function useSubscribePostDetail({ detailType, postType, postId }) {
  const socket = useSocket();
  const postDispatch = usePostDispatch();
  const onPostUpdated = useCallback(() => {
    fetchAndUpdatePost(postDispatch, detailType, postId);
  }, [postDispatch, detailType, postId]);

  useEffect(() => {
    if (!socket) {
      return;
    }

    const roomId = getRoomId(postType, postId);

    socket.emit("subscribe", roomId);
    socket.on("postUpdated", onPostUpdated);

    return () => {
      socket.emit("unsubscribe", roomId);
      socket.off("postUpdated", onPostUpdated);
    };
  }, [socket, postType, postId, onPostUpdated]);
}
