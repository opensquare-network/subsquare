import React from "react";
import {
  Wrapper,
  Footer,
  FooterWrapper,
  HeadWrapper,
  ContentWrapper,
} from "next-common/components/postList/styled";
import Divider from "next-common/components/styled/layout/divider";
import {
  PostItemTitle,
  PostItemTitleValue,
  PostItemUser,
  PostItemTime,
  PostItemCommentCount,
  PostItemAISummary,
  PostItemMalicious,
  PostItemBanner,
} from "../common";
import { TreasuryTag } from "next-common/components/tags/state/treasury";
import { TreasuryAwardCountDownImpl } from "next-common/components/detail/treasury/proposal/awardCountDown";

export default function TreasuryProposalsPostItem({ data }) {
  return (
    <Wrapper>
      <ContentWrapper>
        <HeadWrapper>
          <PostItemTitle data={data} href={data?.detailLink} />
          <PostItemTitleValue data={data} />
        </HeadWrapper>
        <Divider margin={12} />
        <FooterWrapper>
          <Footer>
            <PostItemUser data={data} />
            <PostItemTime
              data={data}
              elapseIcon={
                <TreasuryAwardCountDownImpl
                  proposalIndex={data.proposalIndex}
                  showText={false}
                />
              }
            />
            <PostItemCommentCount data={data} />
            <PostItemMalicious isMalicious={data?.isMalicious} />
            <PostItemAISummary data={data} />
          </Footer>
          <TreasuryTag state={data.status} />
        </FooterWrapper>
      </ContentWrapper>
      <PostItemBanner bannerCid={data?.bannerCid} />
    </Wrapper>
  );
}
