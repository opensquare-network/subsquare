import styled from "styled-components";
import Back from "next-common/components/back";
import DetailItem from "components/detailItem";
import Comments from "components/comment";
import { withLoginUser, withLoginUserRedux } from "lib";
import { ssrNextApi as nextApi } from "services/nextApi";
import { EmptyList } from "next-common/utils/constants";
import Input from "components/comment/input";
import { useState, useRef } from "react";
import Layout from "components/layout";
import { getFocusEditor, getMentionList, getOnReply } from "utils/post";
import { shadow_100 } from "styles/componentCss";
import { to404 } from "utils/serverSideUtil";
import { TYPE_POST } from "utils/viewConstants";
import { getMetaDesc } from "utils/viewfuncs";
import SEO from "components/SEO";

const Wrapper = styled.div`
  > :not(:first-child) {
    margin-top: 16px;
  }
  max-width: 848px;
  margin: auto;
  @media screen and (max-width: 768px) {
    margin-left: -16px;
    margin-right: -16px;
  }
`;

const CommentsWrapper = styled.div`
  background: #ffffff;
  border: 1px solid #ebeef4;
  ${shadow_100};
  border-radius: 6px;
  padding: 48px;
  @media screen and (max-width: 768px) {
    padding: 24px;
    border-radius: 0;
  }
`;

export default withLoginUserRedux(
  ({ loginUser, detail, comments, siteUrl, chain }) => {
    const postId = detail._id;

    const editorWrapperRef = useRef(null);
    const [quillRef, setQuillRef] = useState(null);
    const [content, setContent] = useState("");
    const [contentType, setContentType] = useState(
      loginUser?.preference.editor || "markdown"
    );

    const users = getMentionList(comments);

    const focusEditor = getFocusEditor(contentType, editorWrapperRef, quillRef);

    const onReply = getOnReply(
      contentType,
      content,
      setContent,
      quillRef,
      focusEditor
    );

    const desc = getMetaDesc(detail, "Discussion");
    return (
      <Layout user={loginUser} chain={chain}>
        <SEO
          title={detail?.title}
          desc={desc}
          siteUrl={siteUrl}
          chain={chain}
        />
        <Wrapper className="post-content">
          <Back href={`/discussions`} text="Back to Discussions" />
          <DetailItem
            data={detail}
            user={loginUser}
            chain={chain}
            onReply={focusEditor}
            type={TYPE_POST}
          />
          <CommentsWrapper>
            <Comments
              data={comments}
              user={loginUser}
              postId={postId}
              chain={chain}
              onReply={onReply}
            />
            {loginUser && (
              <Input
                postId={postId}
                chain={chain}
                ref={editorWrapperRef}
                setQuillRef={setQuillRef}
                {...{ contentType, setContentType, content, setContent, users }}
                type={TYPE_POST}
              />
            )}
          </CommentsWrapper>
        </Wrapper>
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
    to404(context);
  }

  const postId = detail._id;

  const { result: comments } = await nextApi.fetch(`posts/${postId}/comments`, {
    page: page ?? "last",
    pageSize: Math.min(pageSize ?? 50, 100),
  });

  return {
    props: {
      detail,
      comments: comments ?? EmptyList,
      chain,
      siteUrl: process.env.SITE_URL,
    },
  };
});
