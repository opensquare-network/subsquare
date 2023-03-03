import Back from "next-common/components/back";
import DetailItem from "components/detailItem";
import Comments from "next-common/components/comment";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import { EmptyList } from "next-common/utils/constants";
import Editor from "next-common/components/comment/editor";
import { useRef, useState } from "react";
import { getFocusEditor, getOnReply } from "next-common/utils/post";
import useMentionList from "next-common/utils/hooks/useMentionList";
import CommentsWrapper from "next-common/components/styled/commentsWrapper";
import { to404 } from "next-common/utils/serverSideUtil";
import getMetaDesc from "next-common/utils/post/getMetaDesc";
import Cookies from "cookies";
import DetailLayout from "next-common/components/layout/DetailLayout";
import { getBannerUrl } from "next-common/utils/banner";
import { PostProvider } from "next-common/context/post";

export default withLoginUserRedux(
  ({ loginUser, detail, comments, votes, myVote, chain }) => {
    const postId = detail._id;
    const editorWrapperRef = useRef(null);
    const [quillRef, setQuillRef] = useState(null);
    const [content, setContent] = useState("");
    const [contentType, setContentType] = useState(
      loginUser?.preference.editor || "markdown"
    );
    const users = useMentionList(detail, comments);

    const focusEditor = getFocusEditor(contentType, editorWrapperRef, quillRef);

    const onReply = getOnReply(
      contentType,
      content,
      setContent,
      quillRef,
      focusEditor,
      chain
    );

    const desc = getMetaDesc(detail);
    return (
      <PostProvider post={detail}>
        <DetailLayout
          seoInfo={{
            title: detail?.title,
            desc,
            ogImage: getBannerUrl(detail?.bannerCid),
          }}
        >
          <Back href={"/discussions"} text="Back to Discussions" />
          <DetailItem votes={votes} myVote={myVote} onReply={focusEditor} />
          <CommentsWrapper>
            <Comments data={comments} onReply={onReply} />
            {loginUser && (
              <Editor
                postId={postId}
                ref={editorWrapperRef}
                setQuillRef={setQuillRef}
                {...{ contentType, setContentType, content, setContent, users }}
              />
            )}
          </CommentsWrapper>
        </DetailLayout>
      </PostProvider>
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
