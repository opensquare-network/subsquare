import Back from "next-common/components/back";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import Layout from "next-common/components/layout";
import TechcommMotionDetail from "components/motion/techcommMotionDetail";
import { TYPE_TECH_COMM_MOTION } from "utils/viewConstants";
import { getMetaDesc } from "utils/viewfuncs";
import { to404 } from "next-common/utils/serverSideUtil";
import { EmptyList } from "next-common/utils/constants";
import DetailPageWrapper from "next-common/components/styled/detailPageWrapper";
import useCommentComponent from "next-common/components/useCommentComponent";

export default withLoginUserRedux(({ loginUser, motion, comments, chain }) => {
  const { CommentComponent, focusEditor } = useCommentComponent({
    detail: motion,
    comments,
    loginUser,
    chain,
    type: TYPE_TECH_COMM_MOTION,
  });

  const desc = getMetaDesc(motion, "Proposal");
  return (
    <Layout
      user={loginUser}
      chain={chain}
      seoInfo={{ title: motion?.title, desc, ogImage: motion?.bannerUrl }}
    >
      <DetailPageWrapper className="post-content">
        <Back href={`/techcomm/proposals`} text="Back to Proposals" />
        <TechcommMotionDetail
          motion={motion}
          loginUser={loginUser}
          chain={chain}
          onReply={focusEditor}
          type={TYPE_TECH_COMM_MOTION}
        />
        {CommentComponent}
      </DetailPageWrapper>
    </Layout>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;
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
    },
  };
});
