import React from "react";
import styled from "styled-components";
import Link from "next/link";
import User from "next-common/components/user";
import {
  getNode,
  timeDuration,
  timeDurationFromNow,
  toPrecision,
} from "next-common/utils";
import Tag from "next-common/components/tag";
import ReasonLink from "next-common/components/reasonLink";
import SectionTag from "components/sectionTag";
import Flex from "next-common/components/styled/flex";
import {
  p_14_medium,
  shadow_100,
  text_accessory,
  text_primary,
} from "next-common/styles/componentCss";
import MotionElapse from "next-common/components/motionElapse";

const Wrapper = styled.div`
  background: #ffffff;
  border: 1px solid #ebeef4;
  ${shadow_100};
  border-radius: 6px;
  padding: 24px;

  :hover {
    box-shadow: 0 6px 22px rgba(30, 33, 52, 0.11),
      0 1.34018px 4.91399px rgba(30, 33, 52, 0.0655718),
      0 0.399006px 1.46302px rgba(30, 33, 52, 0.0444282);
  }
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
      color: #9da9bb;
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
    color: #9da9bb;
    margin: 0 8px;
  }
`;

const Info = styled.div`
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #506176;
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

const Divider = styled.div`
  height: 1px;
  background: #ebeef4;
  margin: 12px 0;
`;

const FooterWrapper = styled(Flex)`
  justify-content: space-between;
  flex-wrap: nowrap;
`;

const TitleWrapper = styled.div`
  overflow: hidden;
`;

const HeadWrapper = styled.div`
  display: flex;
  justify-content: space-between;

  > span {
    display: block;
    ${p_14_medium};
    line-height: 22.4px;
    ${text_primary};
    white-space: nowrap;
    flex-basis: 120px;
    flex-grow: 0;
    flex-shrink: 0;
    text-align: right;
  }

  .symbol {
    ${text_accessory};
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
  color: #9da9bb !important;
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
  return <h1>fuck</h1>;

  return (
    <Wrapper>
      <HeadWrapper>
        <TitleWrapper>
          {data?.index !== undefined && <Index>{`#${data.index}`}</Index>}
          <Link href={href} passHref>
            <Title>{data.title}</Title>
          </Link>
          <ReasonLink text={data.title} hideText={true} />
        </TitleWrapper>
        {data.value && (
          <span>
            {toPrecision(data.value, decimals)}{" "}
            <span className="symbol">{symbol}</span>
          </span>
        )}
        {method && <Method>{method}</Method>}
      </HeadWrapper>

      <Divider />
      <FooterWrapper>
        <Footer>
          <User user={data.author} chain={chain} fontSize={12} />
          {data.isTreasury && <SectionTag name={"Treasury"} />}
          {data.isDemocracy && <SectionTag name={"Democracy"} />}
          {data.time && (
            <Info>
              <span>{`Updated ${timeDurationFromNow(data.time)}`}</span>
              <Flex className="elapseIcon">{elapseIcon}</Flex>
            </Info>
          )}
          {data.remaining && <Info>{`${timeDuration(data.remaining)}`}</Info>}
          {data.commentsCount > -1 && (
            <AutHideInfo>{`${data.commentsCount} Comments`}</AutHideInfo>
          )}
        </Footer>
        {data.status && <Tag name={data.status} />}
      </FooterWrapper>
    </Wrapper>
  );
}
