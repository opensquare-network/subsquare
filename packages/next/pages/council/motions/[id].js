import { withCommonProps } from "next-common/lib";
import { backendApi } from "next-common/services/nextApi";
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
import CollectiveProvider from "next-common/context/collective";
import Chains from "next-common/utils/consts/chains";
import { useChain } from "next-common/context/chain";
import MaybeSimaContent from "next-common/components/detail/maybeSimaContent";

function MotionContent() {
  const motion = usePost();

  motion.status = motion.state?.state;

  return (
    <MaybeSimaContent>
      <ContentWithComment>
        <MotionDetail />
      </ContentWithComment>
    </MaybeSimaContent>
  );
}

function MotionContentWithNullGuard() {
  const motion = usePost();
  const { id } = usePageProps();

  if (!motion) {
    return <CheckUnFinalized id={id} />;
  }

  return <MotionContent />;
}

function MotionPageImpl() {
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
      <MotionContentWithNullGuard />
    </DetailLayout>
  );
}

export default function MotionPage({ motion }) {
  const chain = useChain();

  let pallet = "council";
  if ([Chains.acala, Chains.karura].includes(chain)) {
    pallet = "generalCouncil";
  }

  return (
    <CollectiveProvider pallet={pallet}>
      <PostProvider post={motion}>
        <MotionPageImpl />
      </PostProvider>
    </CollectiveProvider>
  );
}

export const getServerSideProps = withCommonProps(async (context) => {
  const { id } = context.query;

  const { result: motion } = await backendApi.fetch(`motions/${id}`);
  if (!motion) {
    return getNullDetailProps(id, { motion: null });
  }

  const comments = await fetchDetailComments(
    `motions/${motion._id}/comments`,
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
