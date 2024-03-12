import { withCommonProps } from "next-common/lib";
import nextApi from "next-common/services/nextApi";
import TechcommMotionDetail from "components/motion/techcommMotionDetail";
import getMetaDesc from "next-common/utils/post/getMetaDesc";
import { EmptyList } from "next-common/utils/constants";
import DetailLayout from "next-common/components/layout/DetailLayout";
import { getBannerUrl } from "next-common/utils/banner";
import { PostProvider, usePost } from "next-common/context/post";
import CheckUnFinalized from "next-common/components/motion/checkUnFinalized";
import useSubscribePostDetail from "next-common/hooks/useSubscribePostDetail";
import { fetchDetailComments } from "next-common/services/detail";
import { getNullDetailProps } from "next-common/services/detail/nullDetail";
import ContentWithComment from "next-common/components/detail/common/contentWithComment";
import { usePageProps } from "next-common/context/page";

function TechCommMotionContent() {
  const motion = usePost();

  useSubscribePostDetail(`${motion?.height}_${motion?.hash}`);

  return (
    <ContentWithComment>
      <TechcommMotionDetail motion={motion} />
    </ContentWithComment>
  );
}

function TechCommMotionContentWithNullGuard() {
  const motion = usePost();
  const { id } = usePageProps();

  if (!motion) {
    return <CheckUnFinalized id={id} />;
  }

  return <TechCommMotionContent />;
}

function TechCommProposalPageImpl() {
  const motion = usePost();

  const desc = getMetaDesc(motion);
  return (
    <DetailLayout
      seoInfo={{
        title: motion?.title,
        desc,
        ogImage: getBannerUrl(motion?.bannerCid),
      }}
    >
      <TechCommMotionContentWithNullGuard />
    </DetailLayout>
  );
}

export default function TechCommProposalPage({ motion }) {
  return (
    <PostProvider post={motion}>
      <TechCommProposalPageImpl />
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

  const { result: summary } = await nextApi.fetch("summary");

  return {
    props: {
      motion: motion ?? null,
      comments: comments ?? EmptyList,
      summary: summary ?? {},
    },
  };
});
