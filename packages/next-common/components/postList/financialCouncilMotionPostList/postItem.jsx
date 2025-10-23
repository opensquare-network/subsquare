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
  PostItemTitleValue,
} from "next-common/components/postList/common";
import { CollectiveTag } from "next-common/components/tags/state/collective";
import Divider from "next-common/components/styled/layout/divider";
import MotionElapse from "next-common/components/motionElapse";
import { getMotionStateArgs } from "next-common/utils/collective/result";

export default function PostItem({ data }) {
  if (!data) {
    return null;
  }

  const stateArgs = getMotionStateArgs(data.onchainData.state);

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
              elapseIcon={<MotionElapse motion={data.onchainData} />}
            />
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
