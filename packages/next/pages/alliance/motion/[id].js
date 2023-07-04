import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import { EmptyList } from "next-common/utils/constants";
import { PostProvider } from "next-common/context/post";
import DetailWithRightLayout from "next-common/components/layout/detailWithRightLayout";
import { getBannerUrl } from "next-common/utils/banner";
import BreadcrumbWrapper from "next-common/components/detail/common/BreadcrumbWrapper";
import Breadcrumb from "next-common/components/_Breadcrumb";
import getMetaDesc from "next-common/utils/post/getMetaDesc";
import getMotionBreadcrumbName from "next-common/utils/collective/breadcrumbName";
import MotionContent from "../../../components/motion/motionContent";
import CheckUnFinalized from "next-common/components/motion/checkUnFinalized";

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
      content: `#${ getMotionBreadcrumbName(id, motion) }`,
    },
  ];

  return <PostProvider post={motion}>
    <DetailWithRightLayout
      seoInfo={{
        title: motion?.title,
        desc: getMetaDesc(motion),
        ogImage: getBannerUrl(motion?.bannerCid),
      }}
    >
      <BreadcrumbWrapper>
        <Breadcrumb items={breadcrumbItems} />
      </BreadcrumbWrapper>
      {
        motion ?
          <MotionContent motion={motion} comments={comments} /> :
          <CheckUnFinalized id={id} />
      }
    </DetailWithRightLayout>
  </PostProvider>;
});

export const getServerSideProps = withLoginUser(async (context) => {
  const { id, page, page_size } = context.query;
  const { result: motion } = await nextApi.fetch(`alliance/motions/${ id }`);
  if (!motion) {
    return { props: { id, motion: null, comments: EmptyList } };
  }

  const pageSize = Math.min(page_size ?? 50, 100);
  const { result: comments } = await nextApi.fetch(
    `alliance/motions/${ motion._id }/comments`,
    {
      page: page ?? "last",
      pageSize,
    },
  );

  return {
    props: {
      id,
      motion: motion ?? null,
      comments: comments ?? EmptyList,
    },
  };
});
