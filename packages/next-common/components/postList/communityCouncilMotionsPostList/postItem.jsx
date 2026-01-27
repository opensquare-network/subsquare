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
  PostItemMalicious,
  PostItemAISummary,
  PostItemTitleValue,
  PostItemDemocracyTag,
  PostItemTreasuryTag,
} from "next-common/components/postList/common";
import Divider from "next-common/components/styled/layout/divider";
import { CollectiveTag } from "next-common/components/tags/state/collective";
import { getMotionStateArgs } from "next-common/utils/collective/result";

export default function PostItem({ data }) {
  const stateArgs = getMotionStateArgs(data.status);
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
            <PostItemTreasuryTag isTreasury={data.isTreasury} />
            <PostItemDemocracyTag isDemocracy={data.isDemocracy} />
            <PostItemTime data={data} />
            <PostItemCommentCount data={data} />
            <PostItemMalicious isMalicious={data?.isMalicious} />
            <PostItemAISummary data={data} />
          </Footer>
          <CollectiveTag state={data.status} args={stateArgs} />
        </FooterWrapper>
      </ContentWrapper>
      <PostItemBanner bannerCid={data?.bannerCid} />
    </Wrapper>
  );
}
