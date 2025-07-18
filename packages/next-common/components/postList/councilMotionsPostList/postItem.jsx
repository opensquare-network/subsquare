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
  PostItemMalicious,
  PostItemAISummary,
  PostItemTitleValue,
  PostItemDemocracyTag,
  PostItemTreasuryTag,
} from "next-common/components/postList/common";
import Divider from "next-common/components/styled/layout/divider";
import { CollectiveTag } from "next-common/components/tags/state/collective";
import { getMotionStateArgs } from "next-common/utils/collective/result";
import MotionElapse from "next-common/components/motionElapse";

export default function PostItem({ data }) {
  const args = getMotionStateArgs(data.onchainData.state);
  return (
    <>
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
              <PostItemTime
                data={data}
                elapseIcon={<MotionElapse motion={data.onchainData} />}
              />
              <PostItemCommentCount data={data} />
              <PostItemMalicious isMalicious={data?.isMalicious} />
              <PostItemAISummary data={data} />
            </Footer>
            <CollectiveTag state={data.status} args={args} />
          </FooterWrapper>
        </ContentWrapper>
        <PostItemBannner bannerCid={data?.bannerCid} />
      </Wrapper>
    </>
  );
}
