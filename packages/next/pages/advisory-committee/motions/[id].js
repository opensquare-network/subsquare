import { withCommonProps } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import MotionDetail from "components/motion/motionDetail";
import getMetaDesc from "next-common/utils/post/getMetaDesc";
import { EmptyList } from "next-common/utils/constants";
import useUniversalComments from "components/universalComments";
import { getBannerUrl } from "next-common/utils/banner";
import { PostProvider } from "next-common/context/post";
import CheckUnFinalized from "next-common/components/motion/checkUnFinalized";
import DetailLayout from "next-common/components/layout/DetailLayout";
import { fetchDetailComments } from "next-common/services/detail";
import { getNullDetailProps } from "next-common/services/detail/nullDetail";

function AdvisoryCommitteeMotionContent({ motion, comments }) {
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

export default function MotionPage({ id, motion, comments }) {
  let postContent;

  if (motion) {
    postContent = (
      <AdvisoryCommitteeMotionContent motion={motion} comments={comments} />
    );
  } else {
    postContent = <CheckUnFinalized id={id} />;
  }

  const desc = getMetaDesc(motion);
  return (
    <PostProvider post={motion}>
      <DetailLayout
        seoInfo={{
          title: motion?.title,
          desc,
          ogImage: getBannerUrl(motion?.bannerCid),
        }}
        hasSidebar
      >
        {postContent}
      </DetailLayout>
    </PostProvider>
  );
}

export const getServerSideProps = withCommonProps(async (context) => {
  const { id } = context.query;
  const { result: motion } = await nextApi.fetch(`advisory-motions/${id}`);
  if (!motion) {
    return getNullDetailProps(id, { motion: null });
  }

  const comments = await fetchDetailComments(
    `advisory-motions/${motion._id}/comments`,
    context,
  );

  return {
    props: {
      motion: motion ?? null,
      comments: comments ?? EmptyList,
    },
  };
});
