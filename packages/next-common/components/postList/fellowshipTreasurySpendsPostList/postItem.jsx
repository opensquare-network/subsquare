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
  PostItemUser,
  PostItemTime,
  PostItemCommentCount,
  PostItemMalicious,
  PostItemAISummary,
  PostItemTitle,
  PostItemLabel,
} from "next-common/components/postList/common";
import { SpendTag } from "next-common/components/tags/state/treasury";
import Divider from "next-common/components/styled/layout/divider";
import TreasurySpendAmount from "../treasurySpendsPostList/treasurySpendAmount";

export default function PostItem({ data }) {
  if (!data) {
    return null;
  }

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
            <PostItemTime data={data} />
            <PostItemCommentCount data={data} />

            <PostItemLabel labels={data?.labels} />
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
