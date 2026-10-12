import React from "react";
import { withCommonProps } from "next-common/lib";
import { backendApi } from "next-common/services/nextApi";
import { getNullDetailProps } from "next-common/services/detail/nullDetail";
import { fetchDetailComments } from "next-common/services/detail";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import { EmptyList } from "next-common/utils/constants";
import ContentWithComment from "next-common/components/detail/common/contentWithComment";
import FellowshipTreasurySpendDetail from "next-common/components/detail/fellowship/treasury/spend";
import TreasurySpendPayout from "next-common/components/detail/treasury/spend/payout";
import { CommonSpendPageWrapper } from "pages/treasury/spends/[id]";
import MaybeSimaContent from "next-common/components/detail/maybeSimaContent";
import FellowshipTreasurySpendsDetailMultiTabs from "next-common/components/pages/components/tabs/fellowshipTreasurySpendsDetailMultiTabs";
import { PapiProvider } from "next-common/context/papi";

function TreasurySpendContent() {
  return (
    <MaybeSimaContent>
      <ContentWithComment>
        <PapiProvider>
          <FellowshipTreasurySpendDetail />
          <TreasurySpendPayout />
          <FellowshipTreasurySpendsDetailMultiTabs />
        </PapiProvider>
      </ContentWithComment>
    </MaybeSimaContent>
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

  // Spend ids are numeric. Any other value is not one of our pages: the treasury API
  // also serves stats at /treasury/spends/summary, and treating that response as spend
  // detail threw "No on chain data when call `useOnchainData`" (500 page + error report).
  // Render it as a missing post instead, like other unknown ids.
  if (!/^\d+$/.test(id)) {
    return getNullDetailProps(id);
  }

  const { result: detail } = await backendApi.fetch(
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
