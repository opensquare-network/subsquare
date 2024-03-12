import { withCommonProps } from "next-common/lib";
import nextApi from "next-common/services/nextApi";
import { EmptyList } from "next-common/utils/constants";
import Metadata from "next-common/components/treasury/proposal/metadata";
import getMetaDesc from "next-common/utils/post/getMetaDesc";
import { getBannerUrl } from "next-common/utils/banner";
import { PostProvider, usePost } from "next-common/context/post";
import CheckUnFinalized from "next-common/components/treasury/proposal/checkUnFinalized";
import TreasuryProposalDetail from "next-common/components/detail/treasury/proposal";
import useSubscribePostDetail from "next-common/hooks/useSubscribePostDetail";
import DetailLayout from "next-common/components/layout/DetailLayout";
import DetailMultiTabs from "next-common/components/detail/detailMultiTabs";
import useTreasuryTimelineData from "../../../components/treasuryProposal/useTimelineData";
import Timeline from "next-common/components/timeline";
import { useSelector } from "react-redux";
import { detailMultiTabsIsTimelineCompactModeSelector } from "next-common/store/reducers/detailSlice";
import { fetchDetailComments } from "next-common/services/detail";
import { getNullDetailProps } from "next-common/services/detail/nullDetail";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import ContentWithComment from "next-common/components/detail/common/contentWithComment";
import { usePageProps } from "next-common/context/page";

function TreasuryProposalContent() {
  const detail = usePost();

  useSubscribePostDetail(detail?.proposalIndex);
  const timelineData = useTreasuryTimelineData(detail?.onchainData);
  const isTimelineCompact = useSelector(
    detailMultiTabsIsTimelineCompactModeSelector,
  );

  return (
    <ContentWithComment>
      <TreasuryProposalDetail />
      <DetailMultiTabs
        metadata={<Metadata treasuryProposal={detail?.onchainData} />}
        timeline={
          <Timeline
            data={timelineData}
            indent={false}
            compact={isTimelineCompact}
          />
        }
        timelineCount={timelineData.length}
      />
    </ContentWithComment>
  );
}

function ProposalContentWithNullGuard() {
  const { id } = usePageProps();
  const detail = usePost();

  if (!detail) {
    return <CheckUnFinalized id={id} />;
  }

  return <TreasuryProposalContent />;
}

function ProposalPageImpl() {
  const post = usePost();

  const desc = getMetaDesc(post);

  const seoInfo = {
    title: post?.title,
    desc,
    ogImage: getBannerUrl(post?.bannerCid),
  };

  return (
    <DetailLayout seoInfo={seoInfo}>
      <ProposalContentWithNullGuard />
    </DetailLayout>
  );
}

export default function ProposalPage({ detail }) {
  return (
    <PostProvider post={detail}>
      <ProposalPageImpl />
    </PostProvider>
  );
}

export const getServerSideProps = withCommonProps(async (context) => {
  const { id } = context.query;
  const { result: detail } = await nextApi.fetch(`treasury/proposals/${id}`);

  if (!detail) {
    return getNullDetailProps(id);
  }

  const comments = await fetchDetailComments(
    `treasury/proposals/${detail._id}/comments`,
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
