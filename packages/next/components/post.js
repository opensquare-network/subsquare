import styled, { css } from "styled-components";
import Link from "next/link";

import User from "components/user";
import { timeDuration, timeDurationFromNow } from "utils";
import Tag from "./tag";

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
  max-height: 20px;
  line-height: 12px;

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
  font-weight: bold;
  font-size: 12px;
  line-height: 12px;
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

const Title = styled.div`
  word-break: break-all;
  font-weight: 500;
  font-size: 16px;
  cursor: pointer;
  display: inline-block;
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

const TypeWrapper = styled.div`
  display: inline-block;
  height: 20px;
  line-height: 20px;
  border-radius: 10px;
  background: linear-gradient(0deg, #fef4f7, #fef4f7), #e81f66;
  font-weight: 500;
  font-size: 12px;
  padding: 0 8px;
  ${(p) =>
    p.color &&
    css`
      color: ${p.color};
    `}
`;

const getTypeColor = (type) => {
  switch (type) {
    case "Democracy":
      return "#E81F66";
    case "Treasury":
      return "#FF9800";
    default:
      return null;
  }
};

export default function Post({ data, chain, href, type, category }) {
  return (
    <Wrapper>
      {data?.index !== undefined && (
        <DividerWrapper style={{ marginBottom: 8 }}>
          <Index>{`#${data.index}`}</Index>
          {data?.proposal?.method && (
            <span style={{ fontSize: 12, color: "#506176" }}>
              {data?.proposal?.method}
            </span>
          )}
        </DividerWrapper>
      )}

      <Link href={href}>
        <Title>{data.title}</Title>
      </Link>
      <Divider />
      <FooterWrapper>
        <Footer>
          <User user={data.author} chain={chain} fontSize={12} />
          {data.type && (
            <div>
              <TypeWrapper color={getTypeColor(data.type)}>
                {data.type}
              </TypeWrapper>
            </div>
          )}
          {data.time && (
            <Info>{`Updated ${timeDurationFromNow(data.time)}`}</Info>
          )}
          {data.remaining && <Info>{`${timeDuration(data.remaining)}`}</Info>}
          {data.commentsCount > -1 && (
            <AutHideInfo>{`${data.commentsCount} Comments`}</AutHideInfo>
          )}
        </Footer>
        {data.status && (
          <Tag name={data.status} type={type} category={category} />
        )}
      </FooterWrapper>
    </Wrapper>
  );
}
