import { withCommonProps } from "next-common/lib";
import nextApi from "next-common/services/nextApi";
import { EmptyList } from "next-common/utils/constants";
import { PostProvider, usePost } from "next-common/context/post";
import { getBannerUrl } from "next-common/utils/banner";
import getMetaDesc from "next-common/utils/post/getMetaDesc";
import MotionContent from "../../../components/motion/motionContent";
import CheckUnFinalized from "next-common/components/motion/checkUnFinalized";
import DetailLayout from "next-common/components/layout/DetailLayout";
import { fetchDetailComments } from "next-common/services/detail";
import { getNullDetailProps } from "next-common/services/detail/nullDetail";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import { usePageProps } from "next-common/context/page";
import CollectiveProvider, { collectivePallets } from "next-common/context/collective";

function MotionPageImpl() {
  const motion = usePost();
  const { id } = usePageProps();

  return (
    <DetailLayout
      seoInfo={{
        title: motion?.title,
        desc: getMetaDesc(motion),
        ogImage: getBannerUrl(motion?.bannerCid),
      }}
      hasSidebar
    >
      {motion ? <MotionContent /> : <CheckUnFinalized id={id} />}
    </DetailLayout>
  );
}

export default function MotionPage({ motion }) {
  return (
    <CollectiveProvider pallet={collectivePallets.allianceMotion}>
      <PostProvider post={motion}>
        <MotionPageImpl />
      </PostProvider>
    </CollectiveProvider>
  );
}

export const getServerSideProps = withCommonProps(async (context) => {
  const { id } = context.query;
  const { result: motion } = await nextApi.fetch(`alliance/motions/${id}`);
  if (!motion) {
    return getNullDetailProps(id, { motion: null });
  }

  const comments = await fetchDetailComments(
    `alliance/motions/${motion._id}/comments`,
    context,
  );
  const tracksProps = await fetchOpenGovTracksProps();

  return {
    props: {
      ...tracksProps,
      motion: motion ?? null,
      comments: comments ?? EmptyList,
    },
  };
});
