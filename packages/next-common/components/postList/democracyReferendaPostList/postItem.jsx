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
  PostItemVotesSummaryImpl,
} from "next-common/components/postList/common";
import Divider from "next-common/components/styled/layout/divider";
import { DemocracyReferendumTag } from "next-common/components/tags/state/democracy";
import Flex from "next-common/components/styled/flex";
import PostListMyDemocracyReferendaVoteMark from "../myVoteMark/democracy";
import { getDemocracyStateArgs } from "next-common/utils/democracy/result";
import { referendumState } from "next-common/utils/consts/referendum";
import ReferendumElapse from "next-common/components/democracy/referendum/referendumElapse.js";

export default function PostItem({ data }) {
  const stateArgs = getDemocracyStateArgs(
    data?.onchainData?.state,
    data?.onchainData?.timeline,
  );

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
              <PostItemTime
                data={data}
                elapseIcon={<ReferendumElapse detail={data} />}
              />
              <PostItemCommentCount data={data} />
              <PostItemVotesSummaryImpl data={data} />
              <PostItemMalicious isMalicious={data?.isMalicious} />
              <PostItemAISummary data={data} />
            </Footer>
            <Flex className="gap-x-2">
              {data?.status === referendumState.Started && (
                <PostListMyDemocracyReferendaVoteMark data={data} />
              )}
              <DemocracyReferendumTag state={data.status} args={stateArgs} />
            </Flex>
          </FooterWrapper>
        </ContentWrapper>
        <PostItemBannner bannerCid={data?.bannerCid} />
      </Wrapper>
    </>
  );
}
