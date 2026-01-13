import React from "react";
import {
  Wrapper,
  Footer,
  FooterWrapper,
  HeadWrapper,
  ContentWrapper,
} from "next-common/components/postList/styled";
import {
  PostItemBanner,
  PostItemTitle,
  PostItemUser,
  PostItemTime,
  PostItemCommentCount,
  PostItemVotesSummaryImpl,
  PostItemMalicious,
  PostItemAISummary,
} from "next-common/components/postList/common";
import TreasurySpendAmount from "./treasurySpendAmount";
import Divider from "next-common/components/styled/layout/divider";
import { SpendTag } from "next-common/components/tags/state/treasury";
import TreasurySpendsCountDown from "next-common/components/postList/treasurySpendsPostList/countdown";

export default function PostItem({ data }) {
  return (
    <Wrapper>
      <ContentWrapper>
        <HeadWrapper>
          <PostItemTitle data={data} href={data?.detailLink} />
          <TreasurySpendAmount extractedTreasuryInfo={data?.extracted} />
        </HeadWrapper>
        <Divider margin={12} />
        <FooterWrapper>
          <Footer>
            <PostItemUser data={data} />
            <PostItemTime
              data={data}
              elapseIcon={<TreasurySpendsCountDown data={data} />}
            />
            <PostItemCommentCount data={data} />
            <PostItemVotesSummaryImpl data={data} />
            <PostItemMalicious isMalicious={data?.isMalicious} />
            <PostItemAISummary data={data} />
          </Footer>
          <SpendTag state={data.status} />
        </FooterWrapper>
      </ContentWrapper>
      <PostItemBanner bannerCid={data?.bannerCid} />
    </Wrapper>
  );
}
