import Back from "next-common/components/back";
import DetailItem from "components/detailItem";
import Comments from "next-common/components/comment";
import { withLoginUser, withLoginUserRedux } from "lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import { EmptyList } from "next-common/utils/constants";
import Editor from "next-common/components/comment/editor";
import { useRef, useState } from "react";
import Layout from "next-common/components/layout";
import { getNode } from "utils";
import CommentsWrapper from "next-common/components/styled/commentsWrapper";
import { getFocusEditor, getOnReply } from "next-common/utils/post";
import { to404 } from "next-common/utils/serverSideUtil";
import { TYPE_DEMOCRACY_EXTERNAL } from "utils/viewConstants";
import { getMetaDesc } from "../../../utils/viewfuncs";
import DetailPageWrapper from "next-common/components/styled/detailPageWrapper";
import Business from "components/external/business";
import Metadata from "components/external/metadata";
import Timeline from "components/external/timeline";
import useMentionList from "next-common/utils/hooks/useMentionList";

export default withLoginUserRedux(({ loginUser, detail, comments, chain }) => {
  const postId = detail?._id;

  const editorWrapperRef = useRef(null);
  const [quillRef, setQuillRef] = useState(null);
  const [content, setContent] = useState("");
  const [contentType, setContentType] = useState(
    loginUser?.preference.editor || "markdown"
  );

  const node = getNode(chain);
  if (!node) {
    return null;
  }

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

  detail.status = detail?.onchainData?.state?.state;

  const desc = getMetaDesc(detail, "External");
  return (
    <Layout
      user={loginUser}
      chain={chain}
      seoInfo={{ title: detail?.title, desc }}
    >
      <DetailPageWrapper className="post-content">
        <Back href={`/democracy/externals`} text="Back to Externals" />
        <DetailItem
          data={detail}
          user={loginUser}
          chain={chain}
          onReply={focusEditor}
          type={TYPE_DEMOCRACY_EXTERNAL}
        />
        <Business external={detail?.onchainData} chain={chain} />
        <Metadata external={detail?.onchainData} chain={chain} />
        <Timeline timeline={detail?.onchainData?.timeline} chain={chain} />
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
              type={TYPE_DEMOCRACY_EXTERNAL}
            />
          )}
        </CommentsWrapper>
      </DetailPageWrapper>
    </Layout>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;

  const { id, page, page_size: pageSize } = context.query;

  const [{ result: detail }] = await Promise.all([
    nextApi.fetch(`democracy/externals/${id}`),
  ]);

  if (!detail) {
    return to404(context);
  }

  const { result: comments } = await nextApi.fetch(
    `democracy/externals/${detail._id}/comments`,
    {
      page: page ?? "last",
      pageSize: Math.min(pageSize ?? 50, 100),
    }
  );

  return {
    props: {
      detail,
      comments: comments ?? EmptyList,
      chain,
    },
  };
});
