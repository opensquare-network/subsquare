import styled from "styled-components";
import Link from "next/link";

import User from "components/user";
import { timeDuration, timeDurationFromNow } from "utils";
import Tag from "components/tag";
import ReasonLink from "components/reasonLink";
import SectionTag from "components/sectionTag";

const Wrapper = styled.div`
  background: #ffffff;
  border: 1px solid #ebeef4;
  box-shadow: 0 6px 7px rgba(30, 33, 52, 0.02),
    0 1.34018px 1.56354px rgba(30, 33, 52, 0.0119221),
    0 0.399006px 0.465507px rgba(30, 33, 52, 0.00807786);
  border-radius: 6px;
  padding: 24px;

  :hover {
    box-shadow: 0 6px 22px rgba(30, 33, 52, 0.11),
      0 1.34018px 4.91399px rgba(30, 33, 52, 0.0655718),
      0 0.399006px 1.46302px rgba(30, 33, 52, 0.0444282);
  }
`;

const DividerWrapper = styled.div`
  display: flex;
  align-items: center;
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
  font-size: 12px;
  color: #506176;
`;

const AutHideInfo = styled(Info)`
  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const Title = styled.a`
  word-break: break-all;
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

const FooterWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: nowrap;
`;

const TitleWrapper = styled.div`
  margin-bottom: 8px;
  overflow: hidden;
`;

export default function Post({ data, chain, href }) {
  return (
    <Wrapper>
      <TitleWrapper>
        {data?.index !== undefined && <Index>{`#${data.index}`}</Index>}
        <Link href={href} passHref>
          <Title>{data.title}</Title>
        </Link>
        <ReasonLink text={data.title} hideText={true} />
      </TitleWrapper>

      <Divider />
      <FooterWrapper>
        <Footer>
          <User user={data.author} chain={chain} fontSize={12} />
          {data.isTreasury && (
            <SectionTag name={"Treasury"} />
          )}
          {data.isDemocracy && (
            <SectionTag name={"Democracy"} />
          )}
          {data.time && (
            <Info>{`Updated ${timeDurationFromNow(data.time)}`}</Info>
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
