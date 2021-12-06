import styled from "styled-components";

import Back from "components/back";
import { withLoginUser, withLoginUserRedux } from "lib";
import { ssrNextApi as nextApi } from "services/nextApi";
import Layout from "components/layout";
import MotionDetail from "components/motion/motionDetail";
import { to404 } from "utils/serverSideUtil";
import { TYPE_MOTION, TYPE_POST } from "utils/viewConstants";
import { isMotionCompleted } from "../../../utils/viewfuncs";
import { EmptyList } from "../../../utils/constants";
import Comments from "../../../components/comment";
import Input from "../../../components/comment/input";
import { shadow_100 } from "../../../styles/componentCss";
import {
  getFocusEditor,
  getMentionList,
  getOnReply,
} from "../../../utils/post";
import { useRef, useState } from "react";

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

export default withLoginUserRedux(({ loginUser, motion, comments, chain }) => {
  const users = getMentionList(comments);
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
    focusEditor
  );

  return (
    <Layout user={loginUser} chain={chain}>
      <Wrapper className="post-content">
        <Back href={`/council/motions`} text="Back to Motions" />
        <MotionDetail
          motion={motion}
          user={loginUser}
          chain={chain}
          type={TYPE_MOTION}
          onReply={onReply}
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
              type={TYPE_POST}
            />
          )}
        </CommentsWrapper>
      </Wrapper>
    </Layout>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;

  const { id, page, page_size: pageSize } = context.query;

  const { result: motion } = await nextApi.fetch(`motions/${id}`);
  let external = null;

  if (isMotionCompleted(motion)) {
    const motionId = `${motion.state.indexer.blockHeight}_${motion.proposalHash}`;
    const res = await nextApi.fetch(`democracy/externals/${motionId}`);
    const { result: comments } = await nextApi.fetch(
      `democracy/externals/${res.result._id}/comments`,
      {
        page: page ?? "last",
        pageSize: Math.min(pageSize ?? 50, 100),
      }
    );
    external = { ...res.result, comments };
  }

  if (!motion) {
    to404(context);
  }

  const motionId = motion._id;

  const { result: comments } = await nextApi.fetch(
    `motions/${motionId}/comments`,
    {
      page: page ?? "last",
      pageSize: Math.min(pageSize ?? 50, 100),
    }
  );

  return {
    props: {
      motion: motion ? { ...motion, external } : null,
      comments: comments ?? EmptyList,
      chain,
    },
  };
});
