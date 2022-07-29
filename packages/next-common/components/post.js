import React from "react";
import styled from "styled-components";
import Link from "next/link";
import User from "next-common/components/user";
import {
  bigNumber2Locale,
  getNode,
  timeDuration,
  timeDurationFromNow,
  toPrecision,
} from "next-common/utils";
import Tag from "next-common/components/tags/state/tag";
import ReasonLink from "next-common/components/reasonLink";
import SectionTag from "next-common/components/sectionTag";
import Flex from "next-common/components/styled/flex";
import { p_14_medium } from "next-common/styles/componentCss";
import MotionElapse from "next-common/components/motionElapse";
import UpdateIcon from "../assets/imgs/icons/line-chart.svg";
import CommentIcon from "../assets/imgs/icons/comment.svg";
import Anchor from "next-common/components/styled/anchor";
import { HoverSecondaryCard } from "./styled/containers/secondaryCard";
import Divider from "./styled/layout/divider";

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

const Index = styled.div`
  float: left;
  font-weight: 500;
  font-size: 16px;
  line-height: 140%;
  ::after {
    content: "·";
    font-size: 16px;
    line-height: 22.4px;
    color: ${(props) => props.theme.textTertiary};
    margin: 0 8px;
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

const AutHideInfo = styled(Info)`
  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const Title = styled.a`
  word-break: break-word;
  font-weight: 500;
  font-size: 16px;
  cursor: pointer;
  line-height: 140%;

  :hover {
    text-decoration: underline;
  }
`;

const FooterWrapper = styled(Flex)`
  justify-content: space-between;
  flex-wrap: nowrap;
`;

const TitleWrapper = styled.div`
  overflow: hidden;
  color: ${(props) => props.theme.textPrimary}; ;
`;

const HeadWrapper = styled.div`
  display: flex;
  justify-content: space-between;

  > span {
    display: block;
    ${p_14_medium};
    line-height: 22.4px;
    color: ${(props) => props.theme.textPrimary};
    white-space: nowrap;
    flex-basis: 120px;
    flex-grow: 0;
    flex-shrink: 0;
    text-align: right;
  }

  .symbol {
    color: ${(props) => props.theme.textTertiary};
  }

  @media screen and (max-width: 768px) {
    flex-wrap: wrap;
    > span {
      line-height: 21px;
      flex-basis: 100%;
    }
  }
`;

const Method = styled.span`
  font-size: 12px;
  font-weight: 400 !important;
  color: ${(props) => props.theme.textTertiary}; !important;
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

export default function Post({ data, chain, href, type }) {
  const node = getNode(chain);
  if (!node) {
    return null;
  }
  const decimals = node.decimals;
  const symbol = node.symbol;
  const method = data?.onchainData?.proposal?.method;

  let elapseIcon = null;
  if (
    ["Council Motions", "Financial Motions", "Tech. Comm. Proposals"].includes(
      type
    )
  ) {
    elapseIcon = <MotionElapse motion={data.onchainData} chain={chain} />;
  }

  return (
    <Wrapper>
      <ContentWrapper>
        <HeadWrapper>
          <TitleWrapper>
            {data?.index !== undefined && <Index>{`#${data.index}`}</Index>}
            <Link href={href} passHref>
              <Title>{data.title?.trim() || "--"}</Title>
            </Link>
            <ReasonLink text={data.title} hideText={true} />
          </TitleWrapper>
          {data.value && (
            <span>
              {bigNumber2Locale(toPrecision(data.value, decimals))}{" "}
              <span className="symbol">{symbol}</span>
            </span>
          )}
          {method && <Method>{method}</Method>}
        </HeadWrapper>

        <Divider margin={12} />
        <FooterWrapper>
          <Footer>
            <User
              user={data.author}
              add={data.address}
              chain={chain}
              fontSize={12}
            />
            {data.isTreasury && <SectionTag name={"Treasury"} />}
            {data.isDemocracy && <SectionTag name={"Democracy"} />}
            {data.time && (
              <Info>
                <UpdateIcon />
                <span>{`${timeDurationFromNow(data.time)}`}</span>
                <Flex className="elapseIcon">{elapseIcon}</Flex>
              </Info>
            )}
            {data.remaining && <Info>{`${timeDuration(data.remaining)}`}</Info>}
            {data.commentsCount > -1 && (
              <AutHideInfo>
                <CommentIcon />
                {`${data.commentsCount}`}
              </AutHideInfo>
            )}
            {data.parentIndex !== undefined && (
              <AutHideInfo>
                <Anchor href={`/treasury/bounty/${data.parentIndex}`} passHref>
                  {`Parent #${data.parentIndex}`}
                </Anchor>
              </AutHideInfo>
            )}
          </Footer>
          {data.status && <Tag state={data.status} category={type} />}
        </FooterWrapper>
      </ContentWrapper>

      {data.bannerUrl && (
        <BannerWrapper>
          <img src={data.bannerUrl} alt="banner image" />
        </BannerWrapper>
      )}
    </Wrapper>
  );
}
