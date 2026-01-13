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
  PostItemTime,
  PostItemCommentCount,
  PostItemMalicious,
  PostItemAISummary,
} from "next-common/components/postList/common";
import Divider from "next-common/components/styled/layout/divider";
import PolkassemblyUser from "next-common/components/user/polkassemblyUser";

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
            <PolkassemblyUser
              className="text12Medium text-textPrimary"
              user={data?.author}
            />
            <PostItemTime data={data} />
            <PostItemCommentCount data={data} />
            <PostItemMalicious isMalicious={data?.isMalicious} />
            <PostItemAISummary data={data} />
          </Footer>
        </FooterWrapper>
      </ContentWrapper>
      <PostItemBanner bannerCid={data?.bannerCid} />
    </Wrapper>
  );
}
