import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import MotionDetail from "components/motion/motionDetail";
import { to404 } from "next-common/utils/serverSideUtil";
import getMetaDesc from "next-common/utils/post/getMetaDesc";
import { EmptyList } from "next-common/utils/constants";
import useUniversalComments from "components/universalComments";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import DetailWithRightLayout from "next-common/components/layout/detailWithRightLayout";
import { getBannerUrl } from "next-common/utils/banner";
import { PostProvider } from "next-common/context/post";
import BreadcrumbWrapper from "next-common/components/detail/common/BreadcrumbWrapper";
import Breadcrumb from "next-common/components/_Breadcrumb";

export default withLoginUserRedux(({ motion, comments }) => {
  const { CommentComponent, focusEditor } = useUniversalComments({
    detail: motion,
    comments,
    type: detailPageCategory.TECH_COMM_MOTION,
  });

  motion.status = motion.state?.state;

  const desc = getMetaDesc(motion);

  const breadcrumbItems = [
    {
      content: "Overview",
      path: "/",
    },
    {
      content: "Tech.Comm. Proposals",
      path: "/techcomm/proposals",
    },
    {
      content: `Proposal #${motion?.motionIndex}`,
    },
  ];

  return (
    <PostProvider post={motion} type={detailPageCategory.TECH_COMM_MOTION}>
      <DetailWithRightLayout
        seoInfo={{
          title: motion?.title,
          desc,
          ogImage: getBannerUrl(motion?.bannerCid),
        }}
      >
        <BreadcrumbWrapper>
          <Breadcrumb items={breadcrumbItems} />
        </BreadcrumbWrapper>

        <MotionDetail
          type={detailPageCategory.TECH_COMM_MOTION}
          onReply={focusEditor}
        />
        {CommentComponent}
      </DetailWithRightLayout>
    </PostProvider>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const { id, page, page_size } = context.query;
  const pageSize = Math.min(page_size ?? 50, 100);
  const { result: motion } = await nextApi.fetch(`tech-comm/motions/${id}`);
  if (!motion) {
    return to404(context);
  }

  const motionId = motion._id;

  const { result: comments } = await nextApi.fetch(
    `tech-comm/motions/${motionId}/comments`,
    {
      page: page ?? "last",
      pageSize,
    }
  );

  return {
    props: {
      motion: motion ?? null,
      comments: comments ?? EmptyList,
    },
  };
});
