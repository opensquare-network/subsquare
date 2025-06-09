import CommentEditor from "next-common/components/comment/editor";
import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { getCidByEvidence } from "next-common/utils/collective/getCidByEvidence";
import nextApi from "next-common/services/nextApi";
import Comments from "next-common/components/comment";
import { useUser } from "next-common/context/user";
import { useEnsureLogin } from "next-common/hooks/useEnsureLogin";
import PrimaryButton from "next-common/lib/button/primary";
import {
  CommentsProvider,
  useComments,
  useSetComments,
} from "next-common/context/post/comments";
import CommentActionsContext from "next-common/sima/context/commentActions";
import { useUpdateOffChainComment } from "next-common/noSima/actions/comment";
import { useGetComment } from "next-common/noSima/actions/comment";
import { useOffChainCommentUpVote } from "next-common/noSima/actions/upVote";
import { useOffChainCommentCancelUpVote } from "next-common/noSima/actions/cancelUpVote";
import { fetchDetailComments } from "next-common/services/detail";

const useCidByEvidence = (evidence) => {
  return useMemo(() => getCidByEvidence(evidence), [evidence]);
};

const useEvdenceCommentsData = (cid) => {
  const [loadingComments, setLoadingComments] = useState(true);
  const [commentsData, setSommentsData] = useState({});

  const getCommentData = useCallback(async () => {
    setLoadingComments(true);
    const result = await fetchDetailComments(
      `fellowship/evidences/${cid}/comments`,
      {},
    );
    setSommentsData(result);
    setLoadingComments(false);
  }, [cid]);

  useEffect(() => {
    getCommentData();
  }, [getCommentData]);
  return {
    loading: loadingComments,
    commentsData,
  };
};

export default function EvidenceComment({ evidence }) {
  const cid = useCidByEvidence(evidence);
  const { commentsData, loading } = useEvdenceCommentsData(cid);
  return (
    <>
      <CommentsProvider comments={commentsData}>
        <CommentConfigProvider cid={cid}>
          <CommentsContent loading={loading} />
        </CommentConfigProvider>
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

  const refreshData = useCallback(async () => {
    const result = await fetchDetailComments(
      `fellowship/evidences/${cid}/comments`,
      {},
    );
    setComments(result);
  }, [cid, setComments]);

  const createPostComment = useCallback(
    async (post, content, contentType) => {
      if (!(await ensureLogin())) {
        throw new Error("Cancelled");
      }
      return await nextApi
        .post(
          `fellowship/evidences/${cid}/comments`,
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
    [cid, ensureLogin, refreshData],
  );

  const createCommentReply = useCallback(
    async (post, comment, content, contentType) => {
      if (!(await ensureLogin())) {
        throw new Error("Cancelled");
      }

      return await nextApi.post(
        `fellowship/evidences/${cid}/comments/${comment._id}/replies`,
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

function CommentsContent({ loading }) {
  const user = useUser();
  const { ensureLogin } = useEnsureLogin();
  const editorWrapperRef = useRef(null);
  const [contentType, setContentType] = useState(
    user?.preference?.editor || "markdown",
  );
  const [content, setContent] = useState("");
  const commentsData = useComments();
  return (
    <>
      <Comments title="Discussion" data={commentsData} loading={loading} />

      {user ? (
        <CommentEditor
          ref={editorWrapperRef}
          {...{
            contentType,
            setContentType,
            content,
            setContent,
            users: [],
          }}
        />
      ) : (
        <div className="flex justify-end mt-4">
          <PrimaryButton
            onClick={() => {
              ensureLogin();
            }}
          >
            Login
          </PrimaryButton>
        </div>
      )}
    </>
  );
}
