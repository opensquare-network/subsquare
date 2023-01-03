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
      color: ${(props) => props.theme.textTertiary};
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
  color: ${(props) => props.theme.textSecondary};
  svg {
    margin-right: 4px;
    path {
      stroke: ${(props) => props.theme.textTertiary};
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
  color: ${(props) => props.theme.textPrimary};

  .value-display-symbol {
    color: ${(props) => props.theme.textTertiary};
  }
`;
const TitleExtra = styled(Flex)`
  align-items: flex-start;
  color: ${(props) => props.theme.textTertiary};
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
  ].includes(type);

  const isGov2Referendum = [
    businessCategory.openGovReferenda,
    businessCategory.fellowship,
  ].includes(type);

  let stateArgs;
  if (isDemocracyCollective) {
    stateArgs = getMotionStateArgs(data.onchainData.state);
  } else if (isGov2Referendum) {
    stateArgs = getGov2ReferendumStateArgs(data.onchainData.state);
  }

  const duration = useDuration(data.time);
  const { decimals, symbol } = useChainSettings();
  const method = data?.onchainData?.proposal?.method;

  let elapseIcon = null;
  if (
    ["Council Motions", "Financial Motions", "Tech. Comm. Proposals"].includes(
      type
    )
  ) {
    elapseIcon = <MotionElapse motion={data.onchainData} />;
  }

  if (isGov2Referendum) {
    if (data?.status === gov2State.Deciding) {
      elapseIcon = <DecisionCountdown detail={data} />;
    }
    if (data?.status === gov2State.Confirming) {
      elapseIcon = <ConfirmCountdown detail={data} />;
    }
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

  return (
    <Wrapper>
      <ContentWrapper>
        <HeadWrapper>
          <ListPostTitle data={data} href={href} />

          {!isNil(data.value) && (
            <TitleExtra>
              <TitleExtraValue>
                <ValueDisplay
                  value={toPrecision(data.value, decimals)}
                  symbol={symbol}
                />
              </TitleExtraValue>
            </TitleExtra>
          )}

          {method && <TitleExtra>{method}</TitleExtra>}
        </HeadWrapper>

        <Divider margin={12} />
        <FooterWrapper>
          <Footer>
            <User
              user={data?.author}
              add={data.address}
              fontSize={12}
              noEvent={userNoClickEvent}
            />

            {data.trackName && (
              <MobileHiddenInfo>
                <Gov2TrackTag name={data.trackName} />
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
            {data.parentIndex !== undefined && (
              <MobileHiddenInfo>
                <Anchor href={`/treasury/bounty/${data.parentIndex}`} passHref>
                  {`Parent #${data.parentIndex}`}
                </Anchor>
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
        <BannerWrapper>
          <img src={bannerUrl} alt="banner image" />
        </BannerWrapper>
      )}
    </Wrapper>
  );
}
