import Back from "next-common/components/back";
import { withLoginUser, withLoginUserRedux } from "lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import Layout from "components/layout";
import TechcommMotionDetail from "components/motion/techcommMotionDetail";
import { TYPE_TECH_COMM_MOTION } from "utils/viewConstants";
import { getMetaDesc } from "utils/viewfuncs";
import SEO from "next-common/components/SEO";
import { getFocusEditor, getMentionList, getOnReply } from "utils/post";
import { useRef, useState } from "react";
import Comments from "next-common/components/comment";
import CommentsWrapper from "next-common/components/styled/commentsWrapper";
import Editor from "next-common/components/comment/editor";
import { isSafari } from "utils/serverSideUtil";
import { to404 } from "next-common/utils/serverSideUtil";
import { EmptyList } from "next-common/utils/constants";
import DetailPageWrapper from "next-common/components/styled/detailPageWrapper";

export default withLoginUserRedux(
  ({ loginUser, motion, comments, chain, siteUrl }) => {
    const users = getMentionList(comments);
    const editorWrapperRef = useRef(null);
    const [quillRef, setQuillRef] = useState(null);
    const [content, setContent] = useState("");
    const [contentType, setContentType] = useState(
      loginUser?.preference.editor || "markdown"
    );
    const focusEditor = getFocusEditor(contentType, editorWrapperRef, quillRef);
    const onReply = getOnReply(
      contentType,
      content,
      setContent,
      quillRef,
      focusEditor
    );

    const desc = getMetaDesc(motion, "Proposal");
    return (
      <Layout user={loginUser} chain={chain}>
        <SEO
          title={motion?.title}
          desc={desc}
          siteUrl={siteUrl}
          chain={chain}
        />
        <DetailPageWrapper className="post-content">
          <Back href={`/techcomm/proposals`} text="Back to Proposals" />
          <TechcommMotionDetail
            motion={motion}
            loginUser={loginUser}
            chain={chain}
            onReply={onReply}
            type={TYPE_TECH_COMM_MOTION}
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
                postId={motion._id}
                chain={chain}
                ref={editorWrapperRef}
                setQuillRef={setQuillRef}
                {...{ contentType, setContentType, content, setContent, users }}
                type={TYPE_TECH_COMM_MOTION}
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
  isSafari(context);
  const { id, page, page_size: pageSize } = context.query;

  const [{ result: motion }] = await Promise.all([
    nextApi.fetch(`tech-comm/motions/${id}`),
  ]);

  if (!motion) {
    return to404(context);
  }

  const motionId = motion._id;

  const { result: comments } = await nextApi.fetch(
    `tech-comm/motions/${motionId}/comments`,
    {
      page: page ?? "last",
      pageSize: Math.min(pageSize ?? 50, 100),
    }
  );

  return {
    props: {
      motion: motion ?? null,
      comments: comments ?? EmptyList,
      chain,
      siteUrl: process.env.SITE_URL,
    },
  };
});
