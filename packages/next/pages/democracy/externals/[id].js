import DetailItem from "components/detailItem";
import { withCommonProps } from "next-common/lib";
import nextApi from "next-common/services/nextApi";
import { EmptyList } from "next-common/utils/constants";
import getMetaDesc from "next-common/utils/post/getMetaDesc";
import { getBannerUrl } from "next-common/utils/banner";
import { PostProvider, usePost } from "next-common/context/post";
import CheckUnFinalized from "components/external/checkUnFinalized";
import useSubscribePostDetail from "next-common/hooks/useSubscribePostDetail";
import DetailLayout from "next-common/components/layout/DetailLayout";
import { fetchDetailComments } from "next-common/services/detail";
import { getNullDetailProps } from "next-common/services/detail/nullDetail";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import ContentWithComment from "next-common/components/detail/common/contentWithComment";
import { usePageProps } from "next-common/context/page";
import MaybeSimaContent from "next-common/components/detail/maybeSimaContent";
import DemocracyExternalsProposalsDetailMultiTabs from "components/tabs/democracyExternalsProposalsDetailMultiTabs";

function DemocracyExternalContent() {
  const detail = usePost();
  useSubscribePostDetail(detail?.externalProposalHash);

  return (
    <MaybeSimaContent>
      <ContentWithComment>
        <DetailItem />
        <DemocracyExternalsProposalsDetailMultiTabs />
      </ContentWithComment>
    </MaybeSimaContent>
  );
}

function DemocracyExternalContentWithNullGuard() {
  const detail = usePost();
  const { id } = usePageProps();

  if (!detail) {
    const hash = id?.split("_").pop();
    return <CheckUnFinalized id={hash} />;
  }

  return <DemocracyExternalContent />;
}

function DemocracyExternalPageImpl() {
  const detail = usePost();
  const desc = getMetaDesc(detail);
  return (
    <DetailLayout
      seoInfo={{
        title: detail?.title,
        desc,
        ogImage: getBannerUrl(detail?.bannerCid),
      }}
    >
      <DemocracyExternalContentWithNullGuard />
    </DetailLayout>
  );
}

export default function DemocracyExternalPage({ detail }) {
  return (
    <PostProvider post={detail}>
      <DemocracyExternalPageImpl />
    </PostProvider>
  );
}

export const getServerSideProps = withCommonProps(async (context) => {
  const { id } = context.query;
  const { result: detail } = await nextApi.fetch(`democracy/externals/${id}`);

  if (!detail) {
    return getNullDetailProps(id);
  }

  const comments = await fetchDetailComments(
    `democracy/externals/${detail._id}/comments`,
    context,
  );
  const tracksProps = await fetchOpenGovTracksProps();

  return {
    props: {
      detail,
      comments: comments ?? EmptyList,
      ...tracksProps,
    },
  };
});
