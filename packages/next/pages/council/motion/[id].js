import Back from "next-common/components/back";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import Layout from "next-common/components/layout";
import MotionDetail from "components/motion/motionDetail";
import { to404 } from "next-common/utils/serverSideUtil";
import { TYPE_COUNCIL_MOTION } from "utils/viewConstants";
import { getMetaDesc } from "../../../utils/viewfuncs";
import { EmptyList } from "next-common/utils/constants";
import OutWrapper from "next-common/components/styled/outWrapper";
import MainCard from "next-common/components/styled/mainCard";
import useUniversalComments from "components/universalComments";

export default withLoginUserRedux(
  ({ loginUser, motion, comments, chain, page, pageSize }) => {
    const { CommentComponent, focusEditor } = useUniversalComments({
      detail: motion,
      comments,
      loginUser,
      chain,
      type: TYPE_COUNCIL_MOTION,
      page,
      pageSize,
    });

    motion.status = motion.state?.state;

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
              onReply={focusEditor}
            />
            {CommentComponent}
          </MainCard>
        </OutWrapper>
      </Layout>
    );
  }
);

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;

  const { id, page, page_size } = context.query;
  const pageSize = Math.min(page_size ?? 50, 100);

  const { result: motion } = await nextApi.fetch(`motions/${id}`);
  if (!motion) {
    return to404(context);
  }

  const motionId = motion._id;

  const { result: comments } = await nextApi.fetch(
    `motions/${motionId}/comments`,
    {
      page: page ?? "last",
      pageSize,
    }
  );

  return {
    props: {
      motion: motion ?? null,
      comments: comments ?? EmptyList,
      chain,
      page: page ?? "last",
      pageSize,
    },
  };
});
