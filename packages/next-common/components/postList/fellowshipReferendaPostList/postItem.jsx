import React, { useMemo } from "react";
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
  PostItemTrack,
  PostItemUser,
  PostItemTime,
  PostItemCommentCount,
  PostItemMalicious,
  PostItemAISummary,
  PostItemTitle,
  PostItemLabel,
} from "next-common/components/postList/common";
import { Gov2ReferendaTag } from "next-common/components/tags/state/gov2";
import Divider from "next-common/components/styled/layout/divider";
import { getGov2ReferendumStateArgs } from "next-common/utils/gov2/result";
import { gov2State } from "next-common/utils/consts/state";
import { FellowshipPreparingCountdown } from "next-common/components/gov2/postList/preparingCountdown";
import DecisionCountdown from "next-common/components/gov2/postList/decisionCountdown";
import ConfirmCountdown from "next-common/components/gov2/postList/confirmCountdown";
import PostItemVotesSummary from "./postItemVotesSummary";

export default function PostItem({ data }) {
  const elapseIcon = useMemo(() => {
    if (data?.status === gov2State.Preparing) {
      return <FellowshipPreparingCountdown detail={data} />;
    }

    if (data?.status === gov2State.Deciding) {
      return <DecisionCountdown detail={data} />;
    }

    if (data?.status === gov2State.Confirming) {
      return <ConfirmCountdown detail={data} />;
    }
  }, [data]);

  const stateArgs = useMemo(() => {
    return getGov2ReferendumStateArgs(data?.onchainData?.state);
  }, [data?.onchainData?.state]);

  if (!data) {
    return null;
  }

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
              href={`/fellowship/tracks/${data.track}`}
            />
            <PostItemTime data={data} elapseIcon={elapseIcon} />
            <PostItemCommentCount data={data} />
            <PostItemVotesSummary data={data} />
            <PostItemLabel labels={data?.labels} />
            <PostItemMalicious isMalicious={data?.isMalicious} />
            <PostItemAISummary data={data} />
          </Footer>
          <Gov2ReferendaTag state={data.status} args={stateArgs} />
        </FooterWrapper>
      </ContentWrapper>
      <PostItemBanner bannerCid={data?.bannerCid} />
    </Wrapper>
  );
}
