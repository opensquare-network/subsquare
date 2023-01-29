import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import MotionDetail from "components/motion/motionDetail";
import { to404 } from "next-common/utils/serverSideUtil";
import getMetaDesc from "next-common/utils/post/getMetaDesc";
import { EmptyList } from "next-common/utils/constants";
import useUniversalComments from "components/universalComments";
import DetailWithRightLayout from "next-common/components/layout/detailWithRightLayout";
import { getBannerUrl } from "next-common/utils/banner";
import { PostProvider } from "next-common/context/post";
import BreadcrumbWrapper from "next-common/components/detail/common/BreadcrumbWrapper";
import Breadcrumb from "next-common/components/_Breadcrumb";
import { hashEllipsis } from "next-common/utils";
import CheckUnFinalized from "components/motion/checkUnFinalized";

function TechCommMotionContent({ motion, comments }) {
  const { CommentComponent, focusEditor } = useUniversalComments({
    detail: motion,
    comments,
  });

  motion.status = motion.state?.state;

  return (
    <>
      <MotionDetail onReply={focusEditor} />
      {CommentComponent}
    </>
  );
}

export default withLoginUserRedux(({ id, motion, comments }) => {
  let breadcrumbItemName = "";
  let postContent = null;

  if (motion) {
    breadcrumbItemName = `#${
      motion?.motionIndex ?? hashEllipsis(motion?.hash)
    }`;
    postContent = <TechCommMotionContent motion={motion} comments={comments} />;
  } else {
    if (id?.match(/^[0-9]+$/)) {
      breadcrumbItemName = `Motion #${id}`;
    } else {
      const hash = id?.split("_").pop();
      breadcrumbItemName = `Motion #${hashEllipsis(hash)}`;
    }
    postContent = <CheckUnFinalized id={id} />;
  }

  const desc = getMetaDesc(motion);

  const breadcrumbItems = [
    {
      content: "Tech.Comm.",
    },
    {
      content: "Proposals",
      path: "/techcomm/proposals",
    },
    {
      content: breadcrumbItemName,
    },
  ];

  return (
    <PostProvider post={motion}>
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

        {postContent}
      </DetailWithRightLayout>
    </PostProvider>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const { id, page, page_size } = context.query;
  const pageSize = Math.min(page_size ?? 50, 100);

  const { result: motion } = await nextApi.fetch(`tech-comm/motions/${id}`);
  if (!motion) {
    return {
      props: {
        id,
        motion: null,
        comments: EmptyList,
      },
    };
  }

  const { result: comments } = await nextApi.fetch(
    `tech-comm/motions/${motion._id}/comments`,
    {
      page: page ?? "last",
      pageSize,
    }
  );

  return {
    props: {
      id,
      motion: motion ?? null,
      comments: comments ?? EmptyList,
    },
  };
});
