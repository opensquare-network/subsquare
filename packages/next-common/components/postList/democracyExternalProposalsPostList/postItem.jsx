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
} from "next-common/components/postList/common";
import Divider from "next-common/components/styled/layout/divider";
import { DemocracyExternalTag } from "next-common/components/tags/state/democracy";

export default function PostItem({ data }) {
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
              <PostItemTime data={data} />
              <PostItemCommentCount data={data} />
              <PostItemMalicious isMalicious={data?.isMalicious} />
              <PostItemAISummary data={data} />
            </Footer>
            <DemocracyExternalTag state={data.status} />
          </FooterWrapper>
        </ContentWrapper>
        <PostItemBannner bannerCid={data?.bannerCid} />
      </Wrapper>
    </>
  );
}
