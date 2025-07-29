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
  PostItemTrack,
  PostItemVotesSummaryImpl,
} from "next-common/components/postList/common";
import Divider from "next-common/components/styled/layout/divider";
import { ClosedTag } from "next-common/components/tags/state/styled";
import ElapseIcon from "next-common/components/postList/referendaPostList/elapseIcon";

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
            <PostItemTrack
              data={data}
              href={`/ambassador/tracks/${data?.track}`}
            />
            <PostItemTime
              data={data}
              elapseIcon={<ElapseIcon motion={data} />}
            />
            <PostItemCommentCount data={data} />
            <PostItemVotesSummaryImpl data={data} />
            <PostItemMalicious isMalicious={data?.isMalicious} />
            <PostItemAISummary data={data} />
          </Footer>
          {data.status && <ClosedTag>{data.status}</ClosedTag>}
        </FooterWrapper>
      </ContentWrapper>
      <PostItemBanner bannerCid={data?.bannerCid} />
    </Wrapper>
  );
}
