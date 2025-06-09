import CommentEditor from "next-common/components/comment/editor";
import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { getCidByEvidence } from "next-common/utils/collective/getCidByEvidence";
import Comments from "next-common/components/comment";
import { useUser } from "next-common/context/user";
import { useEnsureLogin } from "next-common/hooks/useEnsureLogin";
import PrimaryButton from "next-common/lib/button/primary";
import { useComments } from "next-common/context/post/comments";
import { fetchDetailComments } from "next-common/services/detail";
import EvidenceCommentConfigProvider from "./commentConfigProvider";

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
    <EvidenceCommentConfigProvider
      commentsData={commentsData}
      evidence={evidence}
    >
      <CommentsContent loading={loading} />
    </EvidenceCommentConfigProvider>
  );
}

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
