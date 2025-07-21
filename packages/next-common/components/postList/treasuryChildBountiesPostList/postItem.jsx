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
  PostItemParentIndex,
} from "next-common/components/postList/common";
import Divider from "next-common/components/styled/layout/divider";
import { ChildBountyTag } from "next-common/components/tags/state/treasury";
import TreasurySpendsCountDown from "next-common/components/postList/treasurySpendsPostList/countdown";

export default function PostItem({ data }) {
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
              elapseIcon={<TreasurySpendsCountDown data={data} />}
            />
            <PostItemCommentCount data={data} />
            <PostItemParentIndex parentIndex={data.parentIndex} />
            <PostItemMalicious isMalicious={data?.isMalicious} />
            <PostItemAISummary data={data} />
          </Footer>
          <ChildBountyTag state={data.status} />
        </FooterWrapper>
      </ContentWrapper>
      <PostItemBanner bannerCid={data?.bannerCid} />
    </Wrapper>
  );
}
