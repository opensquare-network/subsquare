import { useMemo, useCallback } from "react";
import { getCidByEvidence } from "next-common/utils/collective/getCidByEvidence";
import nextApi from "next-common/services/nextApi";
import { useEnsureLogin } from "next-common/hooks/useEnsureLogin";
import {
  CommentsProvider,
  useSetComments,
} from "next-common/context/post/comments";
import CommentActionsContext from "next-common/sima/context/commentActions";
import { useUpdateOffChainComment } from "next-common/noSima/actions/comment";
import { useGetComment } from "next-common/noSima/actions/comment";
import { useOffChainCommentUpVote } from "next-common/noSima/actions/upVote";
import { useOffChainCommentCancelUpVote } from "next-common/noSima/actions/cancelUpVote";
import { fetchDetailComments } from "next-common/services/detail";
import {
  fellowshipMemberEvidenceCommentApi,
  fellowshipMemberEvidenceCommentReplyApi,
} from "next-common/services/url";

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
  const { ensureLogin } = useEnsureLogin();

  const getComment = useGetComment();
  const updateComment = useUpdateOffChainComment();
  const upVoteComment = useOffChainCommentUpVote();
  const cancelUpVoteComment = useOffChainCommentCancelUpVote();

  const setComments = useSetComments();

  const evidenceCommentsApi = fellowshipMemberEvidenceCommentApi(cid);

  const refreshData = useCallback(async () => {
    const result = await fetchDetailComments(evidenceCommentsApi, {});
    setComments(result);
  }, [evidenceCommentsApi, setComments]);

  const createPostComment = useCallback(
    async (post, content, contentType) => {
      if (!(await ensureLogin())) {
        throw new Error("Cancelled");
      }
      return await nextApi
        .post(
          evidenceCommentsApi,
          {
            content,
            contentType,
          },
          {
            credentials: "include",
          },
        )
        .then((res) => {
          refreshData();

          return res;
        });
    },
    [ensureLogin, evidenceCommentsApi, refreshData],
  );

  const createCommentReply = useCallback(
    async (post, comment, content, contentType) => {
      if (!(await ensureLogin())) {
        throw new Error("Cancelled");
      }

      return await nextApi.post(
        fellowshipMemberEvidenceCommentReplyApi(cid, comment._id),
        {
          content,
          contentType,
        },
        {
          credentials: "include",
        },
      );
    },
    [cid, ensureLogin],
  );

  return (
    <CommentActionsContext.Provider
      value={{
        supportSima: false,
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
