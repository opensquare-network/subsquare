import React from "react";
import styled, { css } from "styled-components";
import User from "next-common/components/user";
import { toPrecision } from "next-common/utils";
import Tag from "next-common/components/tags/state/tag";
import Flex from "next-common/components/styled/flex";
import { p_14_medium } from "next-common/styles/componentCss";
import MotionElapse from "next-common/components/motionElapse";
import UpdateIcon from "../assets/imgs/icons/line-chart.svg";
import CommentIcon from "../assets/imgs/icons/comment.svg";
import Anchor from "next-common/components/styled/anchor";
import { HoverSecondaryCard } from "./styled/containers/secondaryCard";
import Divider from "./styled/layout/divider";
import { DemocracyTag, TreasuryTag } from "./tags/business";
import isNil from "lodash.isnil";
import { getBannerUrl } from "../utils/banner";
import businessCategory from "../utils/consts/business/category";
import useDuration from "../utils/hooks/useDuration";
import { getMotionStateArgs } from "../utils/collective/result";
import { getGov2ReferendumStateArgs } from "../utils/gov2/result";
import { useChainSettings } from "../context/chain";
import { smcss } from "../utils/responsive";
import Gov2TrackTag from "../components/gov2/trackTag";
import DecisionCountdown from "../components/gov2/postList/decisionCountdown";
import { gov2State } from "../utils/consts/state";
import ConfirmCountdown from "./gov2/postList/confirmCountdown";
import ValueDisplay from "./valueDisplay";
import ListPostTitle from "./postList/postTitle";
import IpfsLink from "./alliance/ipfsLink";
import PostLabels from "./postLabels";
import { useScreenSize } from "../utils/hooks/useScreenSize";
import LinkInfo from "./styled/linkInfo";
import Link from "next/link";
import PreparingCountdown from "./gov2/postList/preparingCountdown";
import { getDemocracyStateArgs } from "../utils/democracy/result";
import ReferendumElapse from "./democracy/referendum/referendumElapse";
import PostListCardVotesSummaryBar from "./postList/votesSummaryBar";

const Wrapper = styled(HoverSecondaryCard)`
  display: flex;
  align-items: flex-start;
`;

const DividerWrapper = styled(Flex)`
  flex-wrap: wrap;
  min-height: 20px;

  > span {
    display: inline-block;
    height: 12px;
  }

  > :not(:first-child) {
    ::before {
      content: "·";
      font-size: 12px;
      color: var(--textTertiary);
      margin: 0 8px;
    }
  }
`;

const Footer = styled(DividerWrapper)`
  @media screen and (max-width: 768px) {
    > :nth-child(3) {
      display: none;
    }
  }

  @media screen and (max-width: 375px) {
    > :nth-child(2) {
      display: none;
    }
  }
`;

const Info = styled.div`
  display: flex;
  align-items: center;
  font-size: 12px;
  color: var(--textSecondary);
  svg {
    margin-right: 4px;
    path {
      stroke: var(--textTertiary);
    }
  }
  .elapseIcon > * {
    margin-left: 8px;
  }
`;

const MobileHiddenInfo = styled(Info)`
  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const FooterWrapper = styled(Flex)`
  justify-content: space-between;
  flex-wrap: nowrap;
`;

const TitleExtraValue = styled(Flex)`
  color: var(--textPrimary);

  .value-display-symbol {
    color: var(--textTertiary);
  }
`;
const TitleExtra = styled(Flex)`
  align-items: flex-start;
  color: var(--textTertiary);
  padding: 2px 0;
  margin-left: 8px;
  ${p_14_medium};

  ${smcss(css`
    margin-top: 8px;
    margin-left: 0;
  `)}
`;

const HeadWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 8px;

  ${smcss(css`
    display: block;
  `)};
`;

const ContentWrapper = styled.div`
  flex: 1;
`;

const BannerWrapper = styled.div`
  margin-top: 0 !important;
  margin-left: 16px;
  width: 120px;
  height: 67px;
  img {
    width: 100%;
    height: 100%;
    border-radius: 4px;
    object-fit: cover;
  }
`;

export default function Post({ data, href, type }) {
  const isDemocracyCollective = [
    businessCategory.councilMotions,
    businessCategory.collective,
    businessCategory.tcProposals,
    businessCategory.financialMotions,
    businessCategory.advisoryMotions,
    businessCategory.treasuryCouncilMotions,
    businessCategory.openTechCommitteeProposals,
  ].includes(type);

  const isGov2Referendum = [
    businessCategory.openGovReferenda,
    businessCategory.fellowship,
  ].includes(type);

  let stateArgs;
  if (isDemocracyCollective) {
    stateArgs = getMotionStateArgs(data.onchainData.state);
  } else if (isGov2Referendum) {
    stateArgs = getGov2ReferendumStateArgs(data.onchainData?.state);
  } else if (businessCategory.democracyReferenda === type) {
    stateArgs = getDemocracyStateArgs(
      data.onchainData.state,
      data.onchainData.timeline,
    );
  }

  const duration = useDuration(data.time);
  const { decimals, symbol } = useChainSettings();
  const method = data?.onchainData?.proposal?.method;

  let elapseIcon = null;
  if (
    [
      businessCategory.councilMotions,
      businessCategory.financialMotions,
      businessCategory.tcProposals,
      businessCategory.advisoryMotions,
      businessCategory.allianceMotions,
      businessCategory.treasuryCouncilMotions,
      businessCategory.openTechCommitteeProposals,
    ].includes(type)
  ) {
    elapseIcon = <MotionElapse motion={data.onchainData} />;
  }

  if (isGov2Referendum) {
    if (data?.status === gov2State.Preparing) {
      elapseIcon = <PreparingCountdown detail={data} />;
    } else if (data?.status === gov2State.Deciding) {
      elapseIcon = <DecisionCountdown detail={data} />;
    } else if (data?.status === gov2State.Confirming) {
      elapseIcon = <ConfirmCountdown detail={data} />;
    }
  }

  if (businessCategory.democracyReferenda === type) {
    elapseIcon = <ReferendumElapse detail={data} />;
  }

  const commentsCount =
    (data.commentsCount || 0) + (data.polkassemblyCommentsCount || 0);

  const bannerUrl = getBannerUrl(data.bannerCid);

  let userNoClickEvent = false;
  if (type === businessCategory.polkassemblyDiscussions) {
    if (!data?.author.address) {
      userNoClickEvent = true;
    }
  }

  const trackTagLink =
    type === businessCategory.openGovReferenda
      ? `/referenda/tracks/${data.track}`
      : `/fellowship/tracks/${data.track}`;

  const hasTally = data.onchainData?.tally || data.onchainData?.info?.tally;
  const showTally = [
    businessCategory.democracyReferenda,
    businessCategory.openGovReferenda,
    businessCategory.fellowship,
  ].includes(type);

  const { sm } = useScreenSize();

  const postValue = data.onchainData?.isTreasury
    ? data.onchainData?.treasuryInfo?.amount
    : data.value;

  return (
    <Wrapper>
      <ContentWrapper>
        <HeadWrapper>
          <ListPostTitle data={data} href={href} />

          {!isNil(postValue) ? (
            <TitleExtra>
              <TitleExtraValue>
                <ValueDisplay
                  value={toPrecision(postValue, decimals)}
                  symbol={symbol}
                />
              </TitleExtraValue>
            </TitleExtra>
          ) : (
            method && <TitleExtra>{method}</TitleExtra>
          )}
        </HeadWrapper>

        <Divider margin={12} />
        <FooterWrapper>
          <Footer>
            <User
              user={data?.author}
              add={data.address}
              fontSize={12}
              noEvent={userNoClickEvent}
              maxWidth={sm ? 160 : 240}
            />

            {data.trackName && (
              <MobileHiddenInfo>
                <Link href={trackTagLink} passHref legacyBehavior>
                  <LinkInfo>
                    <Gov2TrackTag name={data.trackName} />
                  </LinkInfo>
                </Link>
              </MobileHiddenInfo>
            )}

            {data.isTreasury && (
              <div>
                <TreasuryTag />
              </div>
            )}
            {data.isDemocracy && (
              <div>
                <DemocracyTag />
              </div>
            )}
            {data.time && (
              <Info>
                <UpdateIcon />
                <span>{duration}</span>
                <Flex className="elapseIcon">{elapseIcon}</Flex>
              </Info>
            )}
            {commentsCount > -1 && (
              <MobileHiddenInfo>
                <CommentIcon />
                {`${commentsCount}`}
              </MobileHiddenInfo>
            )}
            {showTally && hasTally && (
              <Flex>
                <PostListCardVotesSummaryBar data={data} type={type} />
              </Flex>
            )}
            {businessCategory.allianceAnnouncements === type && (
              <IpfsLink cid={data.cid} />
            )}
            {data.parentIndex !== undefined && (
              <MobileHiddenInfo>
                <Anchor href={`/treasury/bounty/${data.parentIndex}`} passHref>
                  {`Parent #${data.parentIndex}`}
                </Anchor>
              </MobileHiddenInfo>
            )}
            {data.labels && data.labels.length > 0 && (
              <MobileHiddenInfo>
                <PostLabels labels={data.labels} />
              </MobileHiddenInfo>
            )}
          </Footer>
          {data.status && (
            <Tag
              state={data.status}
              category={type}
              args={stateArgs}
              data={data}
            />
          )}
        </FooterWrapper>
      </ContentWrapper>

      {bannerUrl && (
        <MobileHiddenInfo>
          <BannerWrapper>
            <img src={bannerUrl} alt="banner image" />
          </BannerWrapper>
        </MobileHiddenInfo>
      )}
    </Wrapper>
  );
}
