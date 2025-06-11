import { useMemo, useCallback } from "react";
import { getCidByEvidence } from "next-common/utils/collective/getCidByEvidence";
import {
  CommentsProvider,
  useSetComments,
} from "next-common/context/post/comments";
import CommentActionsContext from "next-common/sima/context/commentActions";
import { useGetComment } from "next-common/noSima/actions/comment";
import { fetchDetailComments } from "next-common/services/detail";
import { fellowshipMemberEvidenceCommentApi } from "next-common/services/url";
import {
  useCreateEvidenceComment,
  useCreateEvidenceCommentReply,
  useEvidenceCommentCancelUpVote,
  useEvidenceCommentUpVote,
  useReplaceEvidenceComment,
} from "next-common/sima/actions/evidenceActions";

export default function EvidenceCommentConfigProvider({
  evidence,
  commentsData,
  children,
}) {
  const cid = useMemo(() => getCidByEvidence(evidence), [evidence]);
  return (
    <>
      <CommentsProvider comments={commentsData}>
        <CommentConfigProvider cid={cid}>{children}</CommentConfigProvider>
      </CommentsProvider>
    </>
  );
}

const CommentConfigProvider = ({ children, cid }) => {
  const getComment = useGetComment();
  const createEvidenceComment = useCreateEvidenceComment();
  const createEvidenceCommentReply = useCreateEvidenceCommentReply();
  const updateEvidenceComment = useReplaceEvidenceComment();
  const upVoteEvidenceComment = useEvidenceCommentUpVote();
  const cancelUpVoteEvidenceComment = useEvidenceCommentCancelUpVote();

  const setComments = useSetComments();

  const evidenceCommentsApi = fellowshipMemberEvidenceCommentApi(cid);

  const refreshData = useCallback(async () => {
    const result = await fetchDetailComments(evidenceCommentsApi, {});
    setComments(result);
  }, [evidenceCommentsApi, setComments]);

  const createPostComment = useCallback(
    async (post, content, contentType, real) => {
      const { result, error } = await createEvidenceComment(
        cid,
        content,
        contentType,
        real,
      );
      if (result) {
        await refreshData();
      }
      return { result, error };
    },
    [createEvidenceComment, refreshData, cid],
  );

  const createCommentReply = useCallback(
    async (post, comment, content, contentType, real) => {
      const { result, error } = await createEvidenceCommentReply(
        cid,
        comment.cid,
        content,
        contentType,
        real,
      );
      if (result) {
        await refreshData();
      }
      return { result, error };
    },
    [createEvidenceCommentReply, refreshData, cid],
  );

  const updateComment = useCallback(
    async (post, replyToComment, comment, content, contentType, real) => {
      const { result, error } = await updateEvidenceComment(
        cid,
        replyToComment,
        comment,
        content,
        contentType,
        real,
      );
      if (result) {
        await refreshData();
      }
      return { result, error };
    },
    [updateEvidenceComment, refreshData, cid],
  );

  const upVoteComment = useCallback(
    async (post, comment) => {
      return await upVoteEvidenceComment(cid, comment);
    },
    [upVoteEvidenceComment, cid],
  );

  const cancelUpVoteComment = useCallback(
    async (post, comment) => {
      return await cancelUpVoteEvidenceComment(cid, comment);
    },
    [cancelUpVoteEvidenceComment, cid],
  );

  return (
    <CommentActionsContext.Provider
      value={{
        supportSima: true,
        preventPageRefresh: true,
        getComment,
        createPostComment,
        createCommentReply,
        upVoteComment,
        cancelUpVoteComment,
        updateComment,
        refreshData,
      }}
    >
      {children}
    </CommentActionsContext.Provider>
  );
};
