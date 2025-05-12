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
import FellowshipTreasurySpeedsDetailMultiTabs from "components/tabs/fellowshipTreasurySpeedsDetailMultiTabs";

function TreasurySpendContent() {
  return (
    <MaybeSimaContent>
      <ContentWithComment>
        <FellowshipTreasurySpendDetail />
        <TreasurySpendPayout />
        <FellowshipTreasurySpeedsDetailMultiTabs />
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
