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
import { PostProvider } from "next-common/context/post";
import BreadcrumbWrapper from "next-common/components/detail/common/BreadcrumbWrapper";
import Breadcrumb from "next-common/components/_Breadcrumb";
import { hashEllipsis } from "next-common/utils";

export default withLoginUserRedux(({ motion, comments }) => {
  const { CommentComponent, focusEditor } = useCommentComponent({
    detail: motion,
    comments,
    type: detailPageCategory.TECH_COMM_MOTION,
  });

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
      content: hashEllipsis(motion?.hash),
    },
  ];

  return (
    <PostProvider post={motion} type={detailPageCategory.TECH_COMM_MOTION}>
      <DetailLayout
        seoInfo={{
          title: motion?.title,
          desc,
          ogImage: getBannerUrl(motion?.bannerCid),
        }}
      >
        <BreadcrumbWrapper>
          <Breadcrumb items={breadcrumbItems} />
        </BreadcrumbWrapper>

        <TechcommMotionDetail
          motion={motion}
          onReply={focusEditor}
          type={detailPageCategory.TECH_COMM_MOTION}
        />
        {CommentComponent}
      </DetailLayout>
    </PostProvider>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
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
    },
  };
});
