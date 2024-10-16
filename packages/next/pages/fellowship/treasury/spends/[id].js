import React from "react";
import { withCommonProps } from "next-common/lib";
import nextApi from "next-common/services/nextApi";
import { getNullDetailProps } from "next-common/services/detail/nullDetail";
import { fetchDetailComments } from "next-common/services/detail";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import { EmptyList } from "next-common/utils/constants";
import { usePost } from "next-common/context/post";
import ContentWithComment from "next-common/components/detail/common/contentWithComment";
import FellowshipTreasurySpendDetail from "next-common/components/detail/fellowship/treasury/spend";
import DetailMultiTabs from "next-common/components/detail/detailMultiTabs";
import useTreasurySpendTimelineData from "next-common/hooks/treasury/spend/useTreasurySpendTimelineData";
import { useIsTimelineCompact } from "next-common/components/detail/detailMultiTabs/timelineModeTabs";
import dynamicClientOnly from "next-common/lib/dynamic/clientOnly";
import TreasurySpendPayout from "next-common/components/detail/treasury/spend/payout";
import { CommonSpendPageWrapper } from "pages/treasury/spends/[id]";

const TreasurySpendMetadata = dynamicClientOnly(() =>
  import("next-common/components/detail/treasury/spend/metadata"),
);

const Timeline = dynamicClientOnly(() =>
  import("next-common/components/timeline"),
);

function TreasurySpendContent() {
  const detail = usePost();
  const timelineData = useTreasurySpendTimelineData(detail?.onchainData);
  const isTimelineCompact = useIsTimelineCompact();

  return (
    <ContentWithComment>
      <FellowshipTreasurySpendDetail />
      <TreasurySpendPayout />
      <DetailMultiTabs
        metadata={<TreasurySpendMetadata spend={detail?.onchainData} />}
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

export default function SpendPage({ detail }) {
  return (
    <CommonSpendPageWrapper
      post={detail}
      pallet="fellowshipTreasury"
      detailApiPath="fellowship/treasury/spends"
    >
      <TreasurySpendContent />
    </CommonSpendPageWrapper>
  );
}

export const getServerSideProps = withCommonProps(async (context) => {
  const { id } = context.query;
  const { result: detail } = await nextApi.fetch(
    `fellowship/treasury/spends/${id}`,
  );

  if (!detail) {
    return getNullDetailProps(id);
  }

  const comments = await fetchDetailComments(
    `fellowship/treasury/spends/${detail._id}/comments`,
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
