import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import { EmptyList } from "next-common/utils/constants";
import { PostProvider } from "next-common/context/post";
import { getBannerUrl } from "next-common/utils/banner";
import getMetaDesc from "next-common/utils/post/getMetaDesc";
import getMotionBreadcrumbName from "next-common/utils/collective/breadcrumbName";
import MotionContent from "../../../components/motion/motionContent";
import CheckUnFinalized from "next-common/components/motion/checkUnFinalized";
import DetailLayout from "next-common/components/layout/DetailLayout";
import { fetchDetailComments } from "next-common/services/detail";

export default withLoginUserRedux(({ id, motion, comments }) => {
  const breadcrumbItems = [
    {
      content: "Alliance",
    },
    {
      content: "Motions",
      path: "/alliance/motions",
    },
    {
      content: `#${getMotionBreadcrumbName(id, motion)}`,
    },
  ];

  return (
    <PostProvider post={motion}>
      <DetailLayout
        seoInfo={{
          title: motion?.title,
          desc: getMetaDesc(motion),
          ogImage: getBannerUrl(motion?.bannerCid),
        }}
        breadcrumbs={breadcrumbItems}
        hasSidebar
      >
        {motion ? (
          <MotionContent motion={motion} comments={comments} />
        ) : (
          <CheckUnFinalized id={id} />
        )}
      </DetailLayout>
    </PostProvider>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const { id, page, page_size } = context.query;
  const { result: motion } = await nextApi.fetch(`alliance/motions/${id}`);
  if (!motion) {
    return { props: { id, motion: null, comments: EmptyList } };
  }

  const pageSize = Math.min(page_size ?? 50, 100);
  const comments = await fetchDetailComments(
    `alliance/motions/${motion._id}/comments`,
    page,
    pageSize,
  );

  return {
    props: {
      id,
      motion: motion ?? null,
      comments: comments ?? EmptyList,
    },
  };
});
