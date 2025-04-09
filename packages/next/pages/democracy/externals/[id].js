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
import DetailMultiTabs from "next-common/components/detail/detailMultiTabs";
import { fetchDetailComments } from "next-common/services/detail";
import { getNullDetailProps } from "next-common/services/detail/nullDetail";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import ContentWithComment from "next-common/components/detail/common/contentWithComment";
import { usePageProps } from "next-common/context/page";
import dynamicClientOnly from "next-common/lib/dynamic/clientOnly";
import MaybeSimaContent from "next-common/components/detail/maybeSimaContent";
import DemocracyReferendumCallProvider from "next-common/context/democracy/referenda/call";

const Business = dynamicClientOnly(() =>
  import("components/external/business"),
);

const Metadata = dynamicClientOnly(() =>
  import("components/external/metadata"),
);

const DemocracyExternalProposalCall = dynamicClientOnly(() =>
  import("components/external/call"),
);

const Timeline = dynamicClientOnly(() =>
  import("components/external/timeline"),
);

function DemocracyExternalContent() {
  const detail = usePost();

  useSubscribePostDetail(detail?.externalProposalHash);

  const external = detail?.onchainData || {};
  const call = external?.preImage?.call;

  return (
    <MaybeSimaContent>
      <ContentWithComment>
        <DetailItem />
        <DetailMultiTabs
          call={
            call && (
              <DemocracyReferendumCallProvider>
                <DemocracyExternalProposalCall
                  call={call}
                  shorten={external.preImage.shorten}
                  motionIndex={external.motionIndex}
                  referendumIndex={external.referendumIndex}
                />
              </DemocracyReferendumCallProvider>
            )
          }
          business={<Business external={detail?.onchainData} />}
          metadata={<Metadata external={detail?.onchainData} />}
          timeline={<Timeline />}
        />
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
