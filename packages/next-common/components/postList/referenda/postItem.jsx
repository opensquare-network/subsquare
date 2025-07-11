import React, { useMemo } from "react";
import {
  Wrapper,
  Footer,
  FooterWrapper,
  HeadWrapper,
  ContentWrapper,
} from "../styled";
import {
  PostItemBannner,
  PostItemTitleValue,
  PostItemTrack,
  PostItemVotesSummaryImpl,
  PostItemParentIndex,
  PostItemUser,
  PostItemTime,
  PostItemCommentCount,
  PostItemMalicious,
  PostItemAISummary,
  PostItemTitle,
  PostItemLabel,
} from "../common";
import ElapseIcon from "./elapseIcon";
import { Gov2ReferendaTag } from "next-common/components/tags/state/gov2";
import Divider from "next-common/components/styled/layout/divider";
import { getGov2ReferendumStateArgs } from "next-common/utils/gov2/result";
import PostListMyReferendaVoteMark from "next-common/components/postList/myVoteMark/referenda";
import Flex from "next-common/components/styled/flex";
import { gov2State } from "next-common/utils/consts/state";

export default function PostItem({ data }) {
  let stateArgs = useMemo(
    () => getGov2ReferendumStateArgs(data?.onchainData?.state),
    [data?.onchainData?.state],
  );

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
            showFaitPrice={[
              gov2State.Confirming,
              gov2State.Deciding,
              gov2State.Preparing,
              gov2State.Queueing,
            ].includes(data.status)}
          />
        </HeadWrapper>
        <Divider margin={12} />
        <FooterWrapper>
          <Footer>
            <PostItemUser data={data} />
            <PostItemTrack
              data={data}
              href={`/referenda/tracks/${data.track}`}
            />
            <PostItemTime data={data} elapseIcon={<ElapseIcon data={data} />} />
            <PostItemCommentCount data={data} />
            <PostItemVotesSummaryImpl data={data} />
            <PostItemParentIndex parentIndex={data?.parentIndex} />
            <PostItemLabel labels={data?.labels} />
            <PostItemMalicious isMalicious={data?.isMalicious} />
            <PostItemAISummary data={data} />
          </Footer>
          <Flex className="gap-x-2">
            <PostListMyReferendaVoteMark data={data} />
            <Gov2ReferendaTag state={data.status} args={stateArgs} />
          </Flex>
        </FooterWrapper>
      </ContentWrapper>
      <PostItemBannner bannerCid={data?.bannerCid} />
    </Wrapper>
  );
}
