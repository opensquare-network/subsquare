import React from "react";
import {
  Wrapper,
  Footer,
  FooterWrapper,
  HeadWrapper,
  ContentWrapper,
} from "next-common/components/postList/styled";
import {
  PostItemBannner,
  PostItemTitle,
  PostItemUser,
  PostItemTime,
  PostItemCommentCount,
  PostItemVotesSummaryImpl,
  PostItemMalicious,
  PostItemAISummary,
} from "next-common/components/postList/common";
import TreasurySpendAmount from "./treasurySpeedAmount";
import Divider from "next-common/components/styled/layout/divider";
import { SpendTag } from "next-common/components/tags/state/treasury";
import TreasurySpendsCountDown from "next-common/components/postList/treasurySpendsPostList/countdown";

export default function PostItem({ data }) {
  return (
    <>
      <Wrapper>
        <ContentWrapper>
          <HeadWrapper>
            <PostItemTitle data={data} href={data?.detailLink} />
            <TreasurySpendAmount meta={data?.meta} />
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
        <PostItemBannner bannerCid={data?.bannerCid} />
      </Wrapper>
    </>
  );
}
