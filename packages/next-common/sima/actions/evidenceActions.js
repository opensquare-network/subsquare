import nextApi from "next-common/services/nextApi";
import {
  fellowshipMemberEvidenceCommentApi,
  fellowshipMemberEvidenceCommentReactionApi,
  fellowshipMemberEvidenceCommentReplyApi,
  fellowshipMemberEvidenceCommentUpdateApi,
} from "next-common/services/url";
import useSignSimaMessage from "next-common/utils/sima/useSignSimaMessage";
import { getContentField } from "next-common/utils/sima/utils";
import { useCallback } from "react";
import { getDiscussionUpVoteEntity } from "./upVote";
import { useFindMyUpVote } from "./common";
import { getCancelUpVoteEntity } from "./cancelUpVote";

function getEvidenceIndexer(cid) {
  return {
    section: "fellowship",
    type: "evidence",
    CID: cid,
  };
}

export function useCreateEvidenceComment() {
  const signSimaMessage = useSignSimaMessage();

  return useCallback(
    async (evidenceCid, content, contentType, real) => {
      const indexer = getEvidenceIndexer(evidenceCid);
      const entity = {
        action: "comment_evidence",
        indexer,
        ...getContentField(content, contentType),
        timestamp: Date.now(),
        real,
      };
      const data = await signSimaMessage(entity);

      return await nextApi.post(
        fellowshipMemberEvidenceCommentApi(evidenceCid),
        data,
      );
    },
    [signSimaMessage],
  );
}

export function useCreateEvidenceCommentReply() {
  const signSimaMessage = useSignSimaMessage();

  return useCallback(
    async (evidenceCid, replyToCommentCid, content, contentType, real) => {
      const entity = {
        action: "comment_evidence",
        CID: replyToCommentCid,
        ...getContentField(content, contentType),
        timestamp: Date.now(),
        real,
      };
      const data = await signSimaMessage(entity);

      return await nextApi.post(
        fellowshipMemberEvidenceCommentReplyApi(evidenceCid, replyToCommentCid),
        data,
      );
    },
    [signSimaMessage],
  );
}

export function useReplaceEvidenceComment() {
  const signSimaMessage = useSignSimaMessage();

  return useCallback(
    async (
      evidenceCid,
      replyToComment,
      comment,
      content,
      contentType,
      real,
    ) => {
      const entity = {
        action: "replace_comment",
        cid: replyToComment?.cid,
        old_comment_cid: comment.cid,
        ...getContentField(content, contentType),
        timestamp: Date.now(),
        real,
      };
      const data = await signSimaMessage(entity);

      return await nextApi.patch(
        fellowshipMemberEvidenceCommentUpdateApi(evidenceCid, comment.cid),
        data,
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [signSimaMessage],
  );
}

export function useEvidenceCommentUpVote() {
  const signSimaMessage = useSignSimaMessage();

  return useCallback(
    async (evidenceCid, comment) => {
      const entity = getDiscussionUpVoteEntity(comment.cid);
      const data = await signSimaMessage(entity);
      return await nextApi.post(
        fellowshipMemberEvidenceCommentReactionApi(evidenceCid, comment.cid),
        data,
      );
    },
    [signSimaMessage],
  );
}

export function useEvidenceCommentCancelUpVote() {
  const signSimaMessage = useSignSimaMessage();
  const findMyUpVote = useFindMyUpVote();

  return useCallback(
    async (evidenceCid, comment) => {
      const myUpVote = findMyUpVote(comment?.reactions);
      if (!myUpVote) {
        throw new Error("You have no up vote on this comment");
      }

      const entity = getCancelUpVoteEntity(myUpVote.cid);
      const data = await signSimaMessage(entity);
      return await nextApi.post(
        fellowshipMemberEvidenceCommentReactionApi(evidenceCid, comment.cid),
        data,
      );
    },
    [signSimaMessage, findMyUpVote],
  );
}
