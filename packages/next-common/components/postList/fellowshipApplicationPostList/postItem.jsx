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
  PostItemTitleValue,
  PostItemUser,
  PostItemTime,
  PostItemCommentCount,
  PostItemMalicious,
  PostItemAISummary,
  PostItemTitle,
  PostItemLabel,
} from "next-common/components/postList/common";
import FellowshipApplicationTag from "next-common/components/tags/state/fellowshipApplication";
import Divider from "next-common/components/styled/layout/divider";
import { gov2VotingStates } from "next-common/utils/consts/state";

export default function PostItem({ data }) {
  if (!data) {
    return null;
  }

  return (
    <Wrapper>
      <ContentWrapper>
        <HeadWrapper>
          <PostItemTitle data={data} href={data?.detailLink} />
          <PostItemTitleValue
            data={data}
            showFaitPrice={gov2VotingStates.includes(data.status)}
          />
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
          <FellowshipApplicationTag state={data.status} />
        </FooterWrapper>
      </ContentWrapper>
      <PostItemBanner bannerCid={data?.bannerCid} />
    </Wrapper>
  );
}
