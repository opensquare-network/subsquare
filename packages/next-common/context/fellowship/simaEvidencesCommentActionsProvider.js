import { backendApi } from "next-common/services/nextApi";
import { useFindMyUpVote } from "next-common/sima/actions/common";
import CommentActionsContext from "next-common/sima/context/commentActions";
import useSignSimaMessage from "next-common/utils/sima/useSignSimaMessage";
import { getContentField } from "next-common/utils/sima/utils";
import { useGetComment } from "next-common/noSima/actions/comment";

export const generalIndexer = (post) => {
  const { who, indexer: postIndexer } = post;
  return {
    section: "fellowship",
    type: "evidence",
    who: who,
    block_height: postIndexer.blockHeight,
    event_index: postIndexer.eventIndex,
  };
};

export const generalBaseApiUrl = (post) => {
  const { who, indexer } = post;
  const { blockHeight, eventIndex } = indexer || {};
  const evidenceId = `${blockHeight}-${eventIndex}`;
  return `/fellowship/members/${who}/evidences/${evidenceId}`;
};

export default function SimaEvidencesCommentActionsProvider({ children }) {
  const getComment = useGetComment();
  const signSimaMessage = useSignSimaMessage();
  const findMyUpVote = useFindMyUpVote();

  const actions = {
    supportSima: true,
    getComment,
    createPostComment: async (post, content, contentType, real) => {
      const indexer = generalIndexer(post);

      const entity = {
        action: "comment_evidence",
        indexer,
        ...getContentField(content, contentType),
        timestamp: Date.now(),
        real,
      };
      const data = await signSimaMessage(entity);
      return await backendApi.post(`${generalBaseApiUrl(post)}/comments`, data);
    },
    createCommentReply: async (post, comment, content, contentType, real) => {
      const indexer = generalIndexer(post);
      const entity = {
        action: "comment_evidence",
        indexer,
        CID: comment.cid,
        ...getContentField(content, contentType),
        timestamp: Date.now(),
        real,
      };

      const data = await signSimaMessage(entity);
      return await backendApi.post(
        `${generalBaseApiUrl(post)}/comments/${comment.cid}/replies`,
        data,
      );
    },
    upVoteComment: async (post, comment) => {
      const indexer = generalIndexer(post);
      const entity = {
        action: "upvote",
        indexer,
        cid: comment.cid,
        timestamp: Date.now(),
      };
      const data = await signSimaMessage(entity);
      return await backendApi.post(
        `${generalBaseApiUrl(post)}/comments/${comment.cid}/reactions`,
        data,
      );
    },
    cancelUpVoteComment: async (post, comment) => {
      const indexer = generalIndexer(post);
      const myUpVote = findMyUpVote(comment?.reactions);
      if (!myUpVote) {
        throw new Error("You have no up vote on this comment");
      }
      const entity = {
        action: "cancel_upvote",
        indexer,
        cid: myUpVote.cid,
        timestamp: Date.now(),
      };
      const data = await signSimaMessage(entity);
      return await backendApi.post(
        `${generalBaseApiUrl(post)}/comments/${comment.cid}/reactions`,
        data,
      );
    },
    updateComment: async (
      post,
      replyToComment,
      comment,
      content,
      contentType,
      real,
    ) => {
      const indexer = generalIndexer(post);
      const entity = {
        action: "replace_comment",
        indexer,
        cid: replyToComment?.cid || post?.cid,
        old_comment_cid: comment.cid,
        ...getContentField(content, contentType),
        timestamp: Date.now(),
        real,
      };
      const data = await signSimaMessage(entity);
      return await backendApi.patch(
        `${generalBaseApiUrl(post)}/comments/${comment.cid}`,
        data,
      );
    },
  };
  return (
    <CommentActionsContext.Provider
      value={actions}
      key="simaEvidencesCommentActionsProvider"
    >
      {children}
    </CommentActionsContext.Provider>
  );
}
