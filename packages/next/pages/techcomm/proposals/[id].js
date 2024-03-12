import { withCommonProps } from "next-common/lib";
import nextApi from "next-common/services/nextApi";
import MotionDetail from "components/motion/motionDetail";
import getMetaDesc from "next-common/utils/post/getMetaDesc";
import { EmptyList } from "next-common/utils/constants";
import { getBannerUrl } from "next-common/utils/banner";
import { PostProvider, usePost } from "next-common/context/post";
import CheckUnFinalized from "next-common/components/motion/checkUnFinalized";
import DetailLayout from "next-common/components/layout/DetailLayout";
import { fetchDetailComments } from "next-common/services/detail";
import { getNullDetailProps } from "next-common/services/detail/nullDetail";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import ContentWithComment from "next-common/components/detail/common/contentWithComment";
import { usePageProps } from "next-common/context/page";

function TechCommMotionContent() {
  const motion = usePost();

  motion.status = motion.state?.state;

  return (
    <ContentWithComment>
      <MotionDetail />
    </ContentWithComment>
  );
}

function ProposalPageWithNullGuard() {
  const motion = usePost();
  const { id } = usePageProps();

  if (!motion) {
    return <CheckUnFinalized id={id} />;
  }

  return <TechCommMotionContent />;
}

function ProposalPageImpl() {
  const motion = usePost();
  const desc = getMetaDesc(motion);

  return (
    <DetailLayout
      seoInfo={{
        title: motion?.title,
        desc,
        ogImage: getBannerUrl(motion?.bannerCid),
      }}
      hasSidebar
    >
      <ProposalPageWithNullGuard />
    </DetailLayout>
  );
}

export default function ProposalPage({ motion }) {
  return (
    <PostProvider post={motion}>
      <ProposalPageImpl />
    </PostProvider>
  );
}

export const getServerSideProps = withCommonProps(async (context) => {
  const { id } = context.query;
  const { result: motion } = await nextApi.fetch(`tech-comm/motions/${id}`);
  if (!motion) {
    return getNullDetailProps(id, { motion: null });
  }

  const comments = await fetchDetailComments(
    `tech-comm/motions/${motion._id}/comments`,
    context,
  );
  const tracksProps = await fetchOpenGovTracksProps();

  return {
    props: {
      motion: motion ?? null,
      comments: comments ?? EmptyList,

      ...tracksProps,
    },
  };
});
