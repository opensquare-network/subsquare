import Back from "next-common/components/back";
import DetailItem from "components/detailItem";
import Comments from "next-common/components/comment";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import { EmptyList } from "next-common/utils/constants";
import Editor from "next-common/components/comment/editor";
import { useState, useRef } from "react";
import Layout from "next-common/components/layout";
import { getFocusEditor, getOnReply } from "next-common/utils/post";
import useMentionList from "next-common/utils/hooks/useMentionList";
import CommentsWrapper from "next-common/components/styled/commentsWrapper";
import { to404 } from "next-common/utils/serverSideUtil";
import { TYPE_POST } from "utils/viewConstants";
import { getMetaDesc } from "utils/viewfuncs";
import Cookies from "cookies";
import DetailPageWrapper from "next-common/components/styled/detailPageWrapper";
import useDarkMode from "next-common/utils/hooks/useDarkMode";

export default withLoginUserRedux(
  ({ loginUser, detail, comments, votes, myVote, chain }) => {
    const postId = detail._id;
    const [theme] = useDarkMode();
    const editorWrapperRef = useRef(null);
    const [quillRef, setQuillRef] = useState(null);
    const [content, setContent] = useState("");
    const [contentType, setContentType] = useState(
      loginUser?.preference.editor || "markdown"
    );
    const users = useMentionList(detail, comments, chain);

    const focusEditor = getFocusEditor(contentType, editorWrapperRef, quillRef);

    const onReply = getOnReply(
      contentType,
      content,
      setContent,
      quillRef,
      focusEditor,
      chain
    );

    const desc = getMetaDesc(detail, "Discussion");
    return (
      <Layout
        user={loginUser}
        chain={chain}
        seoInfo={{ title: detail?.title, desc, ogImage: detail?.bannerUrl }}
      >
        <DetailPageWrapper className="post-content">
          <Back href={`/discussions`} text="Back to Discussions" />
          <DetailItem
            data={detail}
            votes={votes}
            myVote={myVote}
            user={loginUser}
            chain={chain}
            onReply={focusEditor}
            type={TYPE_POST}
          />
          <CommentsWrapper>
            <Comments
              data={comments}
              user={loginUser}
              chain={chain}
              onReply={onReply}
            />
            {loginUser && (
              <Editor
                postId={postId}
                chain={chain}
                ref={editorWrapperRef}
                setQuillRef={setQuillRef}
                {...{ contentType, setContentType, content, setContent, users }}
                type={TYPE_POST}
              />
            )}
          </CommentsWrapper>
        </DetailPageWrapper>
      </Layout>
    );
  }
);

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;
  const { id, page, page_size: pageSize } = context.query;

  const [{ result: detail }] = await Promise.all([
    nextApi.fetch(`posts/${id}`),
  ]);

  if (!detail) {
    return to404(context);
  }

  const postId = detail._id;

  const { result: comments } = await nextApi.fetch(`posts/${postId}/comments`, {
    page: page ?? "last",
    pageSize: Math.min(pageSize ?? 50, 100),
  });

  let options;
  const cookies = new Cookies(context.req, context.res);
  const authToken = cookies.get("auth-token");
  if (authToken) {
    options = {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };
  }

  let votes = null;
  let myVote = null;
  if (detail.poll) {
    ({ result: votes } = await nextApi.fetch(`polls/${detail.poll._id}/votes`));
    ({ result: myVote } = await nextApi.fetch(
      `polls/${detail.poll._id}/myvote`,
      {},
      options
    ));
  }

  return {
    props: {
      detail,
      comments: comments ?? EmptyList,
      votes,
      myVote: myVote ?? null,
      chain,
    },
  };
});
