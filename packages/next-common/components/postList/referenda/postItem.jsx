import React from "react";
import {
  Wrapper,
  Footer,
  FooterWrapper,
  HeadWrapper,
  ContentWrapper,
} from "../styled";
import {
  PostLabel,
  PostValueTitle,
  PostUser,
  PostTrack,
  PostTime,
  PostCommentCount,
  PostVotesSummaryImpl,
  PostMalicious,
  PostParentIndex,
  PostBannner,
} from "../common";
import ListPostTitle from "../postTitle";
import PostListAISummary from "../aiSummary";
import { Gov2ReferendaTag } from "next-common/components/tags/state/gov2";
import Divider from "next-common/components/styled/layout/divider";
import { getGov2ReferendumStateArgs } from "next-common/utils/gov2/result";
import PostListMyReferendaVoteMark from "next-common/components/postList/myVoteMark/referenda";
import Flex from "next-common/components/styled/flex";

function PostFooter({ data }) {
  let stateArgs = getGov2ReferendumStateArgs(data.onchainData?.state);
  let commentsCount = data.polkassemblyCommentsCount || 0;

  return (
    <FooterWrapper>
      <Footer>
        <PostUser data={data} />
        <PostTrack data={data} href={`/referenda/tracks/${data.track}`} />
        <PostTime data={data} />
        <PostCommentCount commentsCount={commentsCount} />
        <PostVotesSummaryImpl data={data} />
        <PostParentIndex parentIndex={data?.parentIndex} />
        <PostLabel labels={data?.labels} />
        <PostMalicious isMalicious={data?.isMalicious} />
        <PostListAISummary data={data} />
      </Footer>

      <Flex className="gap-x-2">
        <PostListMyReferendaVoteMark data={data} />
        <Gov2ReferendaTag state={data.status} args={stateArgs} data={data} />
      </Flex>
    </FooterWrapper>
  );
}

function PostHeader({ data }) {
  return (
    <HeadWrapper>
      <ListPostTitle data={data} href={data?.detailLink} />
      <PostValueTitle data={data} />
    </HeadWrapper>
  );
}

export default function PostItem({ data }) {
  if (!data) {
    return null;
  }

  return (
    <Wrapper>
      <ContentWrapper>
        <PostHeader data={data} />
        <Divider margin={12} />
        <PostFooter data={data} />
      </ContentWrapper>
      <PostBannner bannerCid={data?.bannerCid} />
    </Wrapper>
  );
}
