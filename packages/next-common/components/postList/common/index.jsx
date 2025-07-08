import React, { useMemo } from "react";
import {
  DemocracyTag,
  TreasuryTag,
} from "next-common/components/tags/business";
import {
  MobileHiddenInfo,
  TitleExtraValue,
  TitleExtra,
  BannerWrapper,
} from "../styled";
import Link from "next/link";
import { isNil } from "lodash-es";
import PostVotesSummary from "./votesSummary";
import { toPrecision } from "next-common/utils";
import Tooltip from "next-common/components/tooltip";
import { getBannerUrl } from "next-common/utils/banner";
import Anchor from "next-common/components/styled/anchor";
import PostLabels from "next-common/components/postLabels";
import PostListTreasuryAllSpends from "next-common/components/postList/treasuryAllSpends";
import { useChainSettings } from "next-common/context/chain";
import LinkInfo from "next-common/components/styled/linkInfo";
import ValueDisplay from "next-common/components/valueDisplay";
import SystemUser from "next-common/components/user/systemUser";
import Gov2TrackTag from "next-common/components/gov2/trackTag";
import AddressUser from "next-common/components/user/addressUser";
import WarningIcon from "next-common/assets/imgs/icons/warning.svg";
import { SystemComment } from "@osn/icons/subsquare";
import { useScreenSize } from "next-common/utils/hooks/useScreenSize";

export function PostUser({ data }) {
  const { sm } = useScreenSize();
  const userMaxWidth = sm ? 160 : 240;

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

export function PostAmount({ amount, decimals, symbol }) {
  return (
    <TitleExtra>
      <TitleExtraValue>
        <ValueDisplay value={toPrecision(amount, decimals)} symbol={symbol} />
      </TitleExtraValue>
    </TitleExtra>
  );
}

export function PostValueTitle({ data }) {
  const { decimals, symbol } = useChainSettings(data.indexer?.blockHeight);
  const { onchainData, value } = data;
  const localTreasurySpendAmount = onchainData?.isTreasury
    ? onchainData?.treasuryInfo?.amount
    : value;

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

export function PostBannner({ bannerCid }) {
  const bannerUrl = useMemo(() => getBannerUrl(bannerCid), [bannerCid]);
  if (!bannerUrl) {
    return null;
  }

  return (
    <MobileHiddenInfo>
      <BannerWrapper>
        <img src={bannerUrl} alt="banner image" />
      </BannerWrapper>
    </MobileHiddenInfo>
  );
}

export function PostTrack({ data, href }) {
  if (!data.trackName) {
    return null;
  }

  return (
    <MobileHiddenInfo>
      <Link href={href} passHref>
        <LinkInfo>
          <Gov2TrackTag name={data.trackName} id={data.track} />
        </LinkInfo>
      </Link>
    </MobileHiddenInfo>
  );
}

export function PostTreasuryTag({ isTreasury }) {
  if (!isTreasury) {
    return null;
  }
  return (
    <div>
      <TreasuryTag />
    </div>
  );
}
export function PostDemocracyTag({ isDemocracy }) {
  if (!isDemocracy) {
    return null;
  }
  return (
    <div>
      <DemocracyTag />
    </div>
  );
}

export function PostVotesSummaryImpl({ data }) {
  const tally = data?.onchainData?.tally ?? data?.onchainData?.info?.tally;
  const chainSettings = useChainSettings(data.indexer?.blockHeight);
  const symbol = chainSettings.symbol;

  if (!tally) {
    return null;
  }
  return (
    <PostVotesSummary
      decimals={chainSettings.decimals}
      tally={tally}
      symbol={symbol}
    />
  );
}

export function PostCommentCount({ commentsCount }) {
  return (
    <MobileHiddenInfo>
      <Tooltip
        content={`${commentsCount} comments`}
        className="flex cursor-pointer"
      >
        <SystemComment className="w-4 h-4 stroke-textTertiary [&_path]:stroke-2" />
        {commentsCount}
      </Tooltip>
    </MobileHiddenInfo>
  );
}

export function PostMalicious({ isMalicious }) {
  if (!isMalicious) {
    return null;
  }
  return (
    <div className="flex items-center">
      <Tooltip content="Warning: Malicious proposal!">
        <WarningIcon />
      </Tooltip>
    </div>
  );
}

export function PostLabel({ labels }) {
  if (!labels?.length) {
    return null;
  }
  return (
    <MobileHiddenInfo>
      <PostLabels labels={labels} />
    </MobileHiddenInfo>
  );
}

export function PostParentIndex({ parentIndex }) {
  if (!parentIndex) {
    return null;
  }
  return (
    <MobileHiddenInfo>
      <Anchor href={`/treasury/bounties/${parentIndex}`} passHref>
        {`Parent #${parentIndex}`}
      </Anchor>
    </MobileHiddenInfo>
  );
}
