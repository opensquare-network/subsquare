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
} from "next-common/components/postList/common";
import Divider from "next-common/components/styled/layout/divider";
import { CollectiveTag } from "next-common/components/tags/state/collective";
import Post from "../post";
import businessCategory from "next-common/utils/consts/business/category";
import MotionElapse from "next-common/components/motionElapse";
import { getMotionStateArgs } from "next-common/utils/collective/result";

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
        <PostItemBanner bannerCid={data?.bannerCid} />
      </Wrapper>
      <Post data={data} type={businessCategory.tcProposals} href={""} />
    </>
  );
}
