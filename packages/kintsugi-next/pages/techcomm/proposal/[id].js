import Back from "next-common/components/back";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import TechcommMotionDetail from "components/motion/techcommMotionDetail";
import getMetaDesc from "next-common/utils/post/getMetaDesc";
import { to404 } from "next-common/utils/serverSideUtil";
import { EmptyList } from "next-common/utils/constants";
import useCommentComponent from "next-common/components/useCommentComponent";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import DetailLayout from "next-common/components/layout/DetailLayout";
import { getBannerUrl } from "next-common/utils/banner";

export default withLoginUserRedux(({ loginUser, motion, comments, chain }) => {
  const { CommentComponent, focusEditor } = useCommentComponent({
    detail: motion,
    comments,
    loginUser,
    chain,
    type: detailPageCategory.TECH_COMM_MOTION,
  });

  const desc = getMetaDesc(motion);
  return (
    <DetailLayout
      user={loginUser}
      seoInfo={{ title: motion?.title, desc, ogImage: getBannerUrl(motion?.bannerCid) }}
    >
      <Back href={`/techcomm/proposals`} text="Back to Proposals" />
      <TechcommMotionDetail
        motion={motion}
        loginUser={loginUser}
        chain={chain}
        onReply={focusEditor}
        type={detailPageCategory.TECH_COMM_MOTION}
      />
      {CommentComponent}
    </DetailLayout>
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
      redux: {
        detail,
        detailType: detailPageCategory.TECH_COMM_MOTION
      },
    },
  };
});
