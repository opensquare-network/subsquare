import styled from "styled-components";

import Back from "next-common/components/back";
import { withLoginUser, withLoginUserRedux } from "lib";
import { ssrNextApi as nextApi } from "services/nextApi";
import Layout from "components/layout";
import TechcommMotionDetail from "components/motion/techcommMotionDetail";
import { TYPE_TECH_COMM_MOTION } from "utils/viewConstants";
import { getMetaDesc } from "../../../utils/viewfuncs";
import SEO from "components/SEO";
import {
  getFocusEditor,
  getMentionList,
  getOnReply,
} from "../../../utils/post";
import { useRef, useState } from "react";
import Comments from "../../../components/comment";
import Input from "../../../components/comment/input";
import { shadow_100 } from "../../../styles/componentCss";
import { to404 } from "../../../utils/serverSideUtil";
import { EmptyList } from "next-common/utils/constants";

const Wrapper = styled.div`
  > :not(:first-child) {
    margin-top: 16px;
  }

  max-width: 848px;
  margin: auto;
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
        <Wrapper className="post-content">
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
              postId={motion._id}
              chain={chain}
              onReply={onReply}
            />
            {loginUser && (
              <Input
                postId={motion._id}
                chain={chain}
                ref={editorWrapperRef}
                setQuillRef={setQuillRef}
                {...{ contentType, setContentType, content, setContent, users }}
                type={TYPE_TECH_COMM_MOTION}
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

  const [{ result: motion }] = await Promise.all([
    nextApi.fetch(`tech-comm/motions/${id}`),
  ]);

  if (!motion) {
    to404(context);
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
