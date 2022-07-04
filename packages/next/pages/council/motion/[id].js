import Back from "next-common/components/back";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import Layout from "next-common/components/layout";
import MotionDetail from "components/motion/motionDetail";
import { to404 } from "next-common/utils/serverSideUtil";
import { TYPE_COUNCIL_MOTION } from "utils/viewConstants";
import { getMetaDesc } from "../../../utils/viewfuncs";
import { EmptyList } from "next-common/utils/constants";
import Comments from "next-common/components/comment";
import OutWrapper from "next-common/components/styled/outWrapper";
import CommentsWrapper from "next-common/components/styled/commentsWrapper";
import Editor from "next-common/components/comment/editor";
import { getFocusEditor, getOnReply } from "next-common/utils/post";
import { useRef, useState } from "react";
import useMentionList from "next-common/utils/hooks/useMentionList";
import MainCard from "../../../components/mainCard";

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
    chain
  );

  const desc = getMetaDesc(motion, "Motion");
  return (
    <Layout
      user={loginUser}
      chain={chain}
      seoInfo={{ title: motion?.title, desc, ogImage: motion?.bannerUrl }}
    >
      <OutWrapper>
        <MainCard className="post-content">
          <Back href={`/council/motions`} text="Back to Motions" />
          <MotionDetail
            motion={motion}
            user={loginUser}
            chain={chain}
            type={TYPE_COUNCIL_MOTION}
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
                type={TYPE_COUNCIL_MOTION}
              />
            )}
          </CommentsWrapper>
        </MainCard>
      </OutWrapper>
    </Layout>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;

  const { id, page, page_size: pageSize } = context.query;
  const { result: motion } = await nextApi.fetch(`motions/${id}`);
  if (!motion) {
    return to404(context);
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
      motion: motion ?? null,
      comments: comments ?? EmptyList,
      chain,
    },
  };
});
