import { withCommonProps } from "next-common/lib";
import { backendApi } from "next-common/services/nextApi";
import getMetaDesc from "next-common/utils/post/getMetaDesc";
import { EmptyList } from "next-common/utils/constants";
import { getBannerUrl } from "next-common/utils/banner";
import { PostProvider, usePost } from "next-common/context/post";
import CheckUnFinalized from "next-common/components/motion/checkUnFinalized";
import DetailLayout from "next-common/components/layout/DetailLayout";
import { fetchDetailComments } from "next-common/services/detail";
import { getNullDetailProps } from "next-common/services/detail/nullDetail";
import ContentWithComment from "next-common/components/detail/common/contentWithComment";
import { usePageProps } from "next-common/context/page";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import CollectiveProvider, {
  collectivePallets,
} from "next-common/context/collective";
import AstarMotionDetail from "next-common/components/pages/components/motion/astar/astarMotionDetail";
import MaybeSimaContent from "next-common/components/detail/maybeSimaContent";

function CommunityCouncilMotionContent() {
  const motion = usePost();

  // eslint-disable-next-line react-hooks/immutability
  motion.status = motion.state?.state;

  return (
    <MaybeSimaContent>
      <ContentWithComment>
        <AstarMotionDetail />
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

  return <CommunityCouncilMotionContent />;
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
  return (
    <CollectiveProvider pallet={collectivePallets.communityCouncil}>
      <PostProvider post={motion}>
        <MotionPageImpl />
      </PostProvider>
    </CollectiveProvider>
  );
}

export const getServerSideProps = withCommonProps(async (context) => {
  const { id } = context.query;
  const { result: motion } = await backendApi.fetch(
    `community-council/motions/${id}`,
  );
  if (!motion) {
    return getNullDetailProps(id, { motion: null });
  }

  const comments = await fetchDetailComments(
    `community-council/motions/${motion._id}/comments`,
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
