import React from "react";
import { toPrecision } from "next-common/utils";
import Tag from "next-common/components/tags/state/tag";
import Flex from "next-common/components/styled/flex";
import MotionElapse from "next-common/components/motionElapse";
import Anchor from "next-common/components/styled/anchor";
import Divider from "../styled/layout/divider";
import { DemocracyTag, TreasuryTag } from "../tags/business";
import { isNil } from "lodash-es";
import { getBannerUrl } from "../../utils/banner";
import businessCategory from "../../utils/consts/business/category";
import { getMotionStateArgs } from "../../utils/collective/result";
import { getGov2ReferendumStateArgs } from "../../utils/gov2/result";
import { useChain, useChainSettings } from "../../context/chain";
import Gov2TrackTag from "../gov2/trackTag";
import DecisionCountdown from "../gov2/postList/decisionCountdown";
import { gov2State } from "../../utils/consts/state";
import ConfirmCountdown from "../gov2/postList/confirmCountdown";
import ValueDisplay from "../valueDisplay";
import ListPostTitle from "./postTitle";
import IpfsLink from "../alliance/ipfsLink";
import PostLabels from "../postLabels";
import { useScreenSize } from "../../utils/hooks/useScreenSize";
import LinkInfo from "../styled/linkInfo";
import Link from "next/link";
import PreparingCountdown from "../gov2/postList/preparingCountdown";
import PostListCardVotesSummaryBar from "./votesSummaryBar";
import SystemUser from "../user/systemUser";
import AddressUser from "../user/addressUser";
import PolkassemblyUser from "../user/polkassemblyUser";
import Tooltip from "next-common/components/tooltip";
import WarningIcon from "next-common/assets/imgs/icons/warning.svg";
import { getAssetByMeta } from "next-common/utils/treasury/spend/usdCheck";
import { SystemComment } from "@osn/icons/subsquare";
import PostListTreasuryAllSpends from "./treasuryAllSpends";
import PostListAISummary from "./aiSummary";
import Chains from "next-common/utils/consts/chains";
import { PostItemTime } from "./common";

import {
  Wrapper,
  Footer,
  MobileHiddenInfo,
  FooterWrapper,
  TitleExtraValue,
  TitleExtra,
  HeadWrapper,
  ContentWrapper,
  BannerWrapper,
} from "./styled";

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

export function PostValueTitle({ data, type }) {
  const { decimals, symbol } = useChainSettings(data.indexer?.blockHeight);
  const { onchainData, value } = data;
  const localTreasurySpendAmount = onchainData?.isTreasury
    ? onchainData?.treasuryInfo?.amount
    : value;

  if ([businessCategory.fellowshipTreasurySpends].includes(type)) {
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

  if (method) {
    return <TitleExtra>{method}</TitleExtra>;
  }

  return null;
}

export default function Post({ data, href, type }) {
  const currentChain = useChain();
  const isDemocracyCollective = [
    businessCategory.collective,
    businessCategory.financialMotions,
    businessCategory.advisoryMotions,
    businessCategory.treasuryCouncilMotions,
    businessCategory.openTechCommitteeProposals,
  ].includes(type);

  const isGov2Referendum = [businessCategory.ambassadorReferenda].includes(
    type,
  );

  let stateArgs;
  if (isDemocracyCollective) {
    stateArgs = getMotionStateArgs(data.onchainData.state);
  } else if (isGov2Referendum) {
    stateArgs = getGov2ReferendumStateArgs(data.onchainData?.state);
  }

  let elapseIcon = null;
  if (
    [
      businessCategory.financialMotions,
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

  let commentsCount = data.commentsCount || 0;
  if (
    [Chains.kusama, Chains.kusamaPeople, Chains.polkadot].includes(
      currentChain,
    ) &&
    data.polkassemblyCommentsCount
  ) {
    commentsCount = data.polkassemblyCommentsCount || 0;
  }

  const bannerUrl = getBannerUrl(data.bannerCid);

  let trackTagLink = null;
  if (type === businessCategory.ambassadorReferenda) {
    trackTagLink = `/ambassador/tracks/${data.track}`;
  }

  const hasTally = data.onchainData?.tally || data.onchainData?.info?.tally;
  const showTally = [businessCategory.ambassadorReferenda].includes(type);

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
                <Link href={trackTagLink} passHref>
                  <LinkInfo>
                    <Gov2TrackTag name={data.trackName} id={data.track} />
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
            <PostItemTime data={data} elapseIcon={elapseIcon} />
            {commentsCount > -1 && (
              <MobileHiddenInfo>
                <Tooltip
                  content={`${commentsCount} comments`}
                  className="flex cursor-pointer"
                >
                  <SystemComment className="w-4 h-4 stroke-textTertiary [&_path]:stroke-2" />
                  {commentsCount}
                </Tooltip>
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
