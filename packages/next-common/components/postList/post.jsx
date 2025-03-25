import React from "react";
import styled, { css } from "styled-components";
import { toPrecision } from "next-common/utils";
import Tag from "next-common/components/tags/state/tag";
import Flex from "next-common/components/styled/flex";
import MotionElapse from "next-common/components/motionElapse";
import Anchor from "next-common/components/styled/anchor";
import { HoverSecondaryCard } from "../styled/containers/secondaryCard";
import Divider from "../styled/layout/divider";
import { DemocracyTag, TreasuryTag } from "../tags/business";
import { isNil } from "lodash-es";
import { getBannerUrl } from "../../utils/banner";
import businessCategory from "../../utils/consts/business/category";
import { getMotionStateArgs } from "../../utils/collective/result";
import { getGov2ReferendumStateArgs } from "../../utils/gov2/result";
import { useChainSettings } from "../../context/chain";
import { smcss } from "../../utils/responsive";
import Gov2TrackTag from "../gov2/trackTag";
import DecisionCountdown from "../gov2/postList/decisionCountdown";
import { gov2State, gov2VotingState } from "../../utils/consts/state";
import ConfirmCountdown from "../gov2/postList/confirmCountdown";
import ValueDisplay from "../valueDisplay";
import ListPostTitle from "./postTitle";
import IpfsLink from "../alliance/ipfsLink";
import PostLabels from "../postLabels";
import { useScreenSize } from "../../utils/hooks/useScreenSize";
import LinkInfo from "../styled/linkInfo";
import Link from "next/link";
import PreparingCountdown from "../gov2/postList/preparingCountdown";
import { getDemocracyStateArgs } from "../../utils/democracy/result";
import ReferendumElapse from "../democracy/referendum/referendumElapse";
import PostListCardVotesSummaryBar from "./votesSummaryBar";
import SystemUser from "../user/systemUser";
import AddressUser from "../user/addressUser";
import PolkassemblyUser from "../user/polkassemblyUser";
import tw from "tailwind-styled-components";
import Tooltip from "next-common/components/tooltip";
import WarningIcon from "next-common/assets/imgs/icons/warning.svg";
import { getAssetByMeta } from "next-common/utils/treasury/spend/usdCheck";
import { SystemActivity, SystemComment } from "@osn/icons/subsquare";
import PostListTreasuryAllSpends from "./treasuryAllSpends";
import { formatTimeAgo } from "next-common/utils/viewfuncs/formatTimeAgo";
import PostListAISummary from "./aiSummary";
import TreasurySpendsCountDown from "next-common/components/postList/treasury/spends/countdown";
import PostListMyVoteMark from "./myVoteMark";
import { referendumState } from "next-common/utils/consts/referendum";

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
`;
const TitleExtra = tw.div`
  text14Medium
  flex items-start
  py-0.5 ml-2
  text-textTertiary
  max-sm:mt-2 max-sm:ml-0
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

function PostUser({ data, type }) {
  const { sm } = useScreenSize();
  const userMaxWidth = sm ? 160 : 240;

  if (type === businessCategory.polkassemblyDiscussions) {
    return (
      <PolkassemblyUser
        user={data?.author}
        className="text12Medium text-textPrimary"
        maxWidth={userMaxWidth}
      />
    );
  }

  if (data?.author) {
    return (
      <SystemUser
        user={data?.author}
        className="text12Medium text-textPrimary"
        maxWidth={userMaxWidth}
      />
    );
  }

  return (
    <AddressUser
      add={data.address || data.proposer}
      className="text12Medium text-textPrimary"
      maxWidth={userMaxWidth}
    />
  );
}

function PostAmount({ amount, decimals, symbol }) {
  return (
    <TitleExtra>
      <TitleExtraValue>
        <ValueDisplay value={toPrecision(amount, decimals)} symbol={symbol} />
      </TitleExtraValue>
    </TitleExtra>
  );
}

export function TreasurySpendAmount({ meta }) {
  const chainSettings = useChainSettings();
  const { amount } = meta;
  const asset = getAssetByMeta(meta, chainSettings);
  if (!asset) {
    return null;
  }

  return (
    <PostAmount
      amount={amount}
      symbol={asset.symbol}
      decimals={asset.decimals}
    />
  );
}

function PostValueTitle({ data, type }) {
  const { decimals, symbol } = useChainSettings(data.indexer?.blockHeight);
  const { onchainData, value } = data;
  const localTreasurySpendAmount = onchainData?.isTreasury
    ? onchainData?.treasuryInfo?.amount
    : value;

  if (
    [
      businessCategory.treasurySpends,
      businessCategory.fellowshipTreasurySpends,
    ].includes(type)
  ) {
    return <TreasurySpendAmount meta={data?.meta} />;
  }

  const method = onchainData?.proposal?.method;

  if (!isNil(localTreasurySpendAmount)) {
    return (
      <PostAmount
        amount={localTreasurySpendAmount}
        decimals={decimals}
        symbol={symbol}
      />
    );
  }

  if (onchainData?.allSpends?.length) {
    const { allSpends } = onchainData;
    return <PostListTreasuryAllSpends allSpends={allSpends} />;
  }

  if (onchainData?.isStableTreasury) {
    const { amount, spends = [] } = onchainData?.stableTreasuryInfo || {};
    const symbolSet = new Set(spends.map((spend) => spend.symbol));
    const symbol = symbolSet.size > 1 ? "USD" : spends[0].symbol;
    return <PostAmount amount={amount} decimals={6} symbol={symbol} />;
  }

  if (method) {
    return <TitleExtra>{method}</TitleExtra>;
  }

  return null;
}

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
    businessCategory.ambassadorReferenda,
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

  const timeAgo = formatTimeAgo(data.time);

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
      elapseIcon = (
        <PreparingCountdown
          detail={data}
          isFellowship={businessCategory.fellowship === type}
        />
      );
    } else if (data?.status === gov2State.Deciding) {
      elapseIcon = <DecisionCountdown detail={data} />;
    } else if (data?.status === gov2State.Confirming) {
      elapseIcon = <ConfirmCountdown detail={data} />;
    }
  }

  if (businessCategory.democracyReferenda === type) {
    elapseIcon = <ReferendumElapse detail={data} />;
  } else if (businessCategory.treasurySpends === type) {
    elapseIcon = <TreasurySpendsCountDown data={data} />;
  }

  const commentsCount =
    (data.commentsCount || 0) + (data.polkassemblyCommentsCount || 0);

  const bannerUrl = getBannerUrl(data.bannerCid);

  let trackTagLink = null;
  if (type === businessCategory.openGovReferenda) {
    trackTagLink = `/referenda/tracks/${data.track}`;
  } else if (type === businessCategory.fellowship) {
    trackTagLink = `/fellowship/tracks/${data.track}`;
  } else if (type === businessCategory.ambassadorReferenda) {
    trackTagLink = `/ambassador/tracks/${data.track}`;
  }

  const hasTally = data.onchainData?.tally || data.onchainData?.info?.tally;
  const showTally = [
    businessCategory.democracyReferenda,
    businessCategory.openGovReferenda,
    businessCategory.fellowship,
    businessCategory.ambassadorReferenda,
  ].includes(type);

  const showVoteMark =
    (isGov2Referendum && gov2VotingState.includes(data?.status)) ||
    (businessCategory.democracyReferenda === type &&
      data?.status === referendumState.Started);

  return (
    <Wrapper>
      <ContentWrapper>
        <HeadWrapper>
          <ListPostTitle data={data} href={href} />

          <PostValueTitle data={data} type={type} />
        </HeadWrapper>

        <Divider margin={12} />
        <FooterWrapper>
          <Footer>
            <PostUser data={data} type={type} />
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
                <SystemActivity className="w-4 h-4 stroke-textTertiary [&_path]:stroke-2" />
                <span>{timeAgo}</span>
                <Flex className="elapseIcon">{elapseIcon}</Flex>
              </Info>
            )}
            {commentsCount > -1 && (
              <MobileHiddenInfo>
                <SystemComment className="w-4 h-4 stroke-textTertiary [&_path]:stroke-2" />
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
                <Anchor
                  href={`/treasury/bounties/${data.parentIndex}`}
                  passHref
                >
                  {`Parent #${data.parentIndex}`}
                </Anchor>
              </MobileHiddenInfo>
            )}
            {data.labels && data.labels.length > 0 && (
              <MobileHiddenInfo>
                <PostLabels labels={data.labels} />
              </MobileHiddenInfo>
            )}
            {data?.isMalicious && (
              <div className="flex items-center">
                <Tooltip content="Warning: Malicious proposal!">
                  <WarningIcon />
                </Tooltip>
              </div>
            )}

            <PostListAISummary data={data} />
          </Footer>

          <div className="flex items-center gap-x-2">
            {showVoteMark && <PostListMyVoteMark data={data} category={type} />}
            {data.status && (
              <Tag
                state={data.status}
                category={type}
                args={stateArgs}
                data={data}
              />
            )}
          </div>
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
