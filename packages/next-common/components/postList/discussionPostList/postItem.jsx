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
  PostItemLabel,
} from "next-common/components/postList/common";
import Divider from "next-common/components/styled/layout/divider";

export default function PostItem({ data }) {
  return (
    <Wrapper>
      <ContentWrapper>
        <HeadWrapper>
          <PostItemTitle data={data} href={data?.detailLink} />
        </HeadWrapper>
        <Divider margin={12} />
        <FooterWrapper>
          <Footer>
            <PostItemUser data={data} />
            <PostItemTime data={data} />
            <PostItemCommentCount data={data} />
            <PostItemLabel labels={data.labels} />
            <PostItemMalicious isMalicious={data?.isMalicious} />
            <PostItemAISummary data={data} />
          </Footer>
        </FooterWrapper>
      </ContentWrapper>
      <PostItemBanner bannerCid={data?.bannerCid} />
    </Wrapper>
  );
}
