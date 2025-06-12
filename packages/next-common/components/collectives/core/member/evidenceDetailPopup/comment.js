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
import { fellowshipMemberEvidenceCommentApi } from "next-common/services/url";
import { getMentionList } from "next-common/utils/post";
import { uniqBy } from "lodash-es";
import { isKeyRegisteredUser } from "next-common/utils";
import { getMentionName } from "next-common/utils/post";
import { getMemberId } from "next-common/utils/post";
import { useChain } from "next-common/context/chain";

export default function EvidenceComment({ evidence }) {
  const { commentsData, loading } = useEvidenceCommentsData(evidence);
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
  const commentsData = useComments();

  return (
    <>
      <aside className="flex-1 flex-shrink-0 sm:min-w-[470px] sm:overflow-y-auto px-6 pt-6 sm:flex sm:flex-col">
        <section className="max-w-[910px] mx-auto flex flex-col flex-1 w-full">
          <Comments title="Discussion" data={commentsData} loading={loading} />
        </section>

        <footer className="sm:sticky bottom-0 left-0 bg-neutral100 pb-6">
          <CommentsEditor />
        </footer>
      </aside>
    </>
  );
}

function CommentsEditor() {
  const commentsData = useComments();
  const user = useUser();
  const { ensureConnect } = useEnsureLogin();
  const editorWrapperRef = useRef(null);
  const [contentType, setContentType] = useState(
    user?.preference?.editor || "markdown",
  );
  const [content, setContent] = useState("");
  const users = useUserMentionList(commentsData);

  if (!user) {
    return (
      <div className="flex justify-end mt-4">
        <PrimaryButton
          onClick={() => {
            ensureConnect();
          }}
        >
          Connect
        </PrimaryButton>
      </div>
    );
  }

  return (
    <>
      <CommentEditor
        ref={editorWrapperRef}
        {...{
          contentType,
          setContentType,
          content,
          setContent,
          users,
        }}
      />
    </>
  );
}

const useEvidenceCommentsData = (evidence) => {
  const cid = useMemo(() => getCidByEvidence(evidence), [evidence]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [commentsData, setCommentsData] = useState({});

  const getCommentData = useCallback(async () => {
    setLoadingComments(true);
    const result = await fetchDetailComments(
      fellowshipMemberEvidenceCommentApi(cid),
      {},
    );
    setCommentsData(result);
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

const useUserMentionList = (commentsData) => {
  const [users, setUsers] = useState([]);
  const chain = useChain();
  useEffect(() => {
    const loadSuggestions = async (list) => {
      return await Promise.all(
        (list || []).map(async (user) => ({
          name: await getMentionName(user, chain),
          value: getMemberId(user, chain),
          isKeyRegistered: isKeyRegisteredUser(user),
        })),
      );
    };

    loadSuggestions(
      uniqBy(getMentionList(commentsData), (item) => item.username),
    ).then((suggestions) => setUsers(suggestions));
  }, [chain, commentsData]);

  return users;
};
