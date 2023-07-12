import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import MotionDetail from "components/motion/motionDetail";
import getMetaDesc from "next-common/utils/post/getMetaDesc";
import { EmptyList } from "next-common/utils/constants";
import useUniversalComments from "components/universalComments";
import CouncilMotionDetailLayout from "next-common/components/layout/councilLayout/motionDetailLayout";
import { getBannerUrl } from "next-common/utils/banner";
import { PostProvider } from "next-common/context/post";
import CheckUnFinalized from "next-common/components/motion/checkUnFinalized";
import NonNullPost from "next-common/components/nonNullPost";
import getMotionBreadcrumbName from "next-common/utils/collective/breadcrumbName";
import Chains from "next-common/utils/consts/chains";

function MotionContent({ motion, comments }) {
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
  let postContent = null;

  if (motion) {
    postContent = (
      <NonNullPost>
        <MotionContent motion={motion} comments={comments} />
      </NonNullPost>
    );
  } else {
    postContent = <CheckUnFinalized id={id} />;
  }

  const desc = getMetaDesc(motion);
  const breadcrumbItemName = getMotionBreadcrumbName(id, motion);
  const breadcrumbItems = [
    {
      content: "Council",
    },
    {
      content: "Motions",
      path: "/council/motions",
    },
    {
      content: `#${breadcrumbItemName}`,
    },
  ];

  return (
    <PostProvider post={motion}>
      <CouncilMotionDetailLayout
        detail={motion}
        seoInfo={{
          title: motion?.title,
          desc,
          ogImage: getBannerUrl(motion?.bannerCid),
        }}
        breadcrumbs={breadcrumbItems}
        hasSider
      >
        {postContent}
      </CouncilMotionDetailLayout>
    </PostProvider>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;
  const { id, page, page_size } = context.query;
  const pageSize = Math.min(page_size ?? 50, 100);

  let listApi = "motions";
  if ([Chains.moonbeam, Chains.moonriver].includes(chain)) {
    listApi = "moon-council/motions";
  }

  const { result: motion } = await nextApi.fetch(`${listApi}/${id}`);
  if (!motion) {
    return {
      props: {
        id,
        motion: null,
        comments: EmptyList,
      },
    };
  }

  const motionId = motion._id;

  const { result: comments } = await nextApi.fetch(
    `${listApi}/${motionId}/comments`,
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
