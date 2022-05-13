import styled from "styled-components";

import Back from "next-common/components/back";
import { withLoginUser, withLoginUserRedux } from "lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import Layout from "components/layout";
import MotionDetail from "components/motion/motionDetail";
import { to404 } from "next-common/utils/serverSideUtil";
import { TYPE_TECH_COMM_MOTION } from "utils/viewConstants";
import { getMetaDesc } from "../../../utils/viewfuncs";
import { EmptyList } from "next-common/utils/constants";
import Comments from "next-common/components/comment";
import OutWrapper from "next-common/components/styled/outWrapper";
import CommentsWrapper from "next-common/components/styled/commentsWrapper";
import Editor from "next-common/components/comment/editor";
import {
  getFocusEditor,
  getOnReply,
} from "next-common/utils/post";
import { useRef, useState } from "react";
import useMentionList from "next-common/utils/hooks/useMentionList";

const Wrapper = styled.div`
  > :not(:first-child) {
    margin-top: 16px;
  }

  margin-right: 312px;
  @media screen and (max-width: 1024px) {
    max-width: 848px;
    margin: 0 auto;
  }
  overflow: hidden;
  flex-grow: 1;
`;

export default withLoginUserRedux(({ loginUser, motion, comments, chain }) => {
  const users = useMentionList(motion, comments, chain);
  motion.status = motion.state?.state;
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
    focusEditor,
    chain,
  );

  const desc = getMetaDesc(motion, "Proposal");
  return (
    <Layout
      user={loginUser}
      chain={chain}
      seoInfo={{ title: motion?.title, desc }}
    >
      <OutWrapper>
        <Wrapper className="post-content">
          <Back href={`/techcomm/proposals`} text="Back to Proposals" />
          <MotionDetail
            motion={motion}
            user={loginUser}
            chain={chain}
            type={TYPE_TECH_COMM_MOTION}
            onReply={onReply}
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
                {...{
                  contentType,
                  setContentType,
                  content,
                  setContent,
                  users,
                }}
                type={TYPE_TECH_COMM_MOTION}
              />
            )}
          </CommentsWrapper>
        </Wrapper>
      </OutWrapper>
    </Layout>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;

  const { id, page, page_size: pageSize } = context.query;
  const { result: motion } = await nextApi.fetch(`tech-comm/motions/${id}`);
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
    },
  };
});
