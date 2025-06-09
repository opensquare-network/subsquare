import CommentEditor from "next-common/components/comment/editor";
import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { getCidByEvidence } from "next-common/utils/collective/getCidByEvidence";
import nextApi, { backendApi } from "next-common/services/nextApi";
import Comments from "next-common/components/comment";
import { getFocusEditor } from "next-common/utils/post";
import { useUser } from "next-common/context/user";
import { useEnsureLogin } from "next-common/hooks/useEnsureLogin";
import PrimaryButton from "next-common/lib/button/primary";
import {
  CommentsProvider,
  useComments,
} from "next-common/context/post/comments";
import CommentActionsContext from "next-common/sima/context/commentActions";
import { useUpdateOffChainComment } from "next-common/noSima/actions/comment";
import { useGetComment } from "next-common/noSima/actions/comment";
import { useOffChainCommentUpVote } from "next-common/noSima/actions/upVote";
import { useOffChainCommentCancelUpVote } from "next-common/noSima/actions/cancelUpVote";

const useCidByEvidence = (evidence) => {
  return useMemo(() => getCidByEvidence(evidence), [evidence]);
};

const useEvdenceCommentsData = (cid) => {
  const [loadingComments, setLoadingComments] = useState(true);
  const [commentsData, setSommentsData] = useState({});

  useEffect(() => {
    setLoadingComments(true);
    backendApi
      .fetch(`fellowship/evidences/${cid}/comments`)
      .then(({ result }) => {
        setSommentsData(result);
      })
      .finally(() => {
        setLoadingComments(false);
      });
  }, [cid]);
  return {
    loading: loadingComments,
    commentsData,
  };
};

export default function EvidenceComment({ evidence }) {
  const cid = useCidByEvidence(evidence);
  const { ensureLogin } = useEnsureLogin();

  const createPostComment = useCallback(
    async (post, content, contentType) => {
      if (!(await ensureLogin())) {
        throw new Error("Cancelled");
      }
      return await nextApi.post(
        `fellowship/evidences/${cid}/comments`,
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

  const getComment = useGetComment();
  const updateComment = useUpdateOffChainComment();
  const upVoteComment = useOffChainCommentUpVote();
  const cancelUpVoteComment = useOffChainCommentCancelUpVote();

  return (
    <>
      <CommentActionsContext.Provider
        value={{
          supportSima: false,
          getComment,
          createPostComment,
          createCommentReply,
          upVoteComment,
          cancelUpVoteComment,
          updateComment,
        }}
      >
        <CommentsContent evidence={evidence} />
      </CommentActionsContext.Provider>
    </>
  );
}

function CommentsContent({ evidence }) {
  const cid = useCidByEvidence(evidence);
  const user = useUser();
  const { ensureLogin } = useEnsureLogin();
  const editorWrapperRef = useRef(null);
  const [quillRef, setQuillRef] = useState(null);
  const [contentType, setContentType] = useState(
    user?.preference?.editor || "markdown",
  );
  const [content, setContent] = useState("");

  const { commentsData, loading } = useEvdenceCommentsData(cid);
  const focusEditor = getFocusEditor(contentType, editorWrapperRef, quillRef);
  focusEditor;
  return (
    <>
      <CommentsProvider comments={commentsData}>
        <CommentItems loading={loading} />
      </CommentsProvider>
      {user ? (
        <CommentEditor
          ref={editorWrapperRef}
          setQuillRef={setQuillRef}
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

const CommentItems = ({ loading }) => {
  const commentsData = useComments();
  return <Comments title="Discussion" data={commentsData} loading={loading} />;
};
