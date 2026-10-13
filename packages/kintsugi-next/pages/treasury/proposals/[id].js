import { withCommonProps } from "next-common/lib";
import { backendApi } from "next-common/services/nextApi";
import { EmptyList } from "next-common/utils/constants";
import getMetaDesc from "next-common/utils/post/getMetaDesc";
import { getBannerUrl } from "next-common/utils/banner";
import { PostProvider, usePost } from "next-common/context/post";
import CheckUnFinalized from "next-common/components/treasury/proposal/checkUnFinalized";
import TreasuryProposalDetail from "next-common/components/detail/treasury/proposal";
import useSubscribePostDetail from "next-common/hooks/useSubscribePostDetail";
import DetailLayout from "next-common/components/layout/DetailLayout";
import DetailMultiTabs from "next-common/components/detail/detailMultiTabs";
import { fetchDetailComments } from "next-common/services/detail";
import { getNullDetailProps } from "next-common/services/detail/nullDetail";
import ContentWithComment from "next-common/components/detail/common/contentWithComment";
import { usePageProps } from "next-common/context/page";
import dynamicClientOnly from "next-common/lib/dynamic/clientOnly";
import { TreasuryProvider } from "next-common/context/treasury";
import MaybeSimaContent from "next-common/components/detail/maybeSimaContent";

const Timeline = dynamicClientOnly(() =>
  import("components/treasuryProposal/timeline"),
);
const Metadata = dynamicClientOnly(() =>
  import("next-common/components/treasury/proposal/metadata"),
);

function TreasuryProposalContent() {
  const detail = usePost();

  useSubscribePostDetail(detail?.proposalIndex);

  return (
    <MaybeSimaContent>
      <ContentWithComment>
        <TreasuryProposalDetail />
        <DetailMultiTabs
          metadata={<Metadata treasuryProposal={detail?.onchainData} />}
          timeline={<Timeline treasuryProposal={detail?.onchainData} />}
        />
      </ContentWithComment>
    </MaybeSimaContent>
  );
}

function TreasuryProposalContentWithNullGuard() {
  const detail = usePost();
  const { id } = usePageProps();

  if (!detail) {
    return <CheckUnFinalized id={id} />;
  }

  return <TreasuryProposalContent />;
}

function ProposalPageImpl() {
  const detail = usePost();

  const desc = getMetaDesc(detail);
  const seoInfo = {
    title: detail?.title,
    desc,
    ogImage: getBannerUrl(detail?.bannerCid),
  };

  return (
    <DetailLayout seoInfo={seoInfo}>
      <TreasuryProposalContentWithNullGuard />
    </DetailLayout>
  );
}

export default function Proposal({ detail }) {
  return (
    <PostProvider post={detail}>
      <TreasuryProvider>
        <ProposalPageImpl />
      </TreasuryProvider>
    </PostProvider>
  );
}

export const getServerSideProps = withCommonProps(async (context) => {
  const { id } = context.query;
  const { result: detail } = await backendApi.fetch(`treasury/proposals/${id}`);

  if (!detail) {
    return getNullDetailProps(id);
  }

  const comments = await fetchDetailComments(
    `treasury/proposals/${detail._id}/comments`,
    context,
  );
  const { result: summary } = await backendApi.fetch("overview/summary");

  return {
    props: {
      detail,
      comments: comments ?? EmptyList,
      summary: summary ?? {},
    },
  };
});
