import styled, { css } from "styled-components";
import Link from "next/link";

import User from "components/user";
import { timeDurationFromNow, timeDuration } from "utils";

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
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
  > div {
    width: 100%;
  }
`;

const DividerWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  > :not(:first-child) {
    ::before {
      content: "·";
      font-size: 12px;
      color: #9da9bb;
      margin: 0 8px;
    }
  }
`;

const Index = styled.div`
  font-weight: bold;
  font-size: 12px;
`;

const Info = styled.div`
  font-size: 12px;
  color: #506176;
`;

const Title = styled.div`
  max-width: 750px;
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
  margin-bottom: 12px;
  margin-top: 12px;
`;

const FooterWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const TypeWrapper = styled.div`
  display: inline-block;
  height: 20px;
  line-height: 20px;
  border-radius: 10px;
  font-weight: 500;
  font-size: 12px;
  padding: 0 8px;
  ${(p) =>
    p.color &&
    css`
      color: ${p.color};
      background: ${p.bg};
    `}
`;

const StatusWrapper = styled.div`
  background: #2196f3;
  border-radius: 2px;
  font-weight: 500;
  font-size: 12px;
  height: 20px;
  line-height: 20px;
  padding: 0 8px;
  color: #ffffff;
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

const getTypeBgColor = (type) => {
  switch (type) {
    case "Democracy":
      return `linear-gradient(0deg, #FEF4F7, #FEF4F7), #E81F66`;
    case "Treasury":
      return `linear-gradient(0deg, #FFF5E5, #FFF5E5), #FF9800`;
    default:
      return null;
  }
};

export default function Motion({ data, chain }) {
  return (
    <Wrapper>
      <div>
        <DividerWrapper style={{ marginBottom: 8 }}>
          <Index>{`#${data.index}`}</Index>
          <span style={{ fontSize: 12, color: "#506176" }}>
            {data?.proposal?.method}
          </span>
        </DividerWrapper>
      </div>
      <Link href={`/${chain}/motion/${data.index}`}>
        <Title>{data.title}</Title>
      </Link>
      <Divider />
      <FooterWrapper>
        <DividerWrapper>
          <User user={data.author} chain={chain} fontSize={12} />
          {data.type && (
            <div>
              <TypeWrapper
                color={getTypeColor(data.type)}
                bg={getTypeBgColor(data.type)}
              >
                {data.type}
              </TypeWrapper>
            </div>
          )}
          {data.time && (
            <Info>{`Updated ${timeDurationFromNow(data.time)}`}</Info>
          )}
          {data.remaining && <Info>{`${timeDuration(data.remaining)}`}</Info>}
          {data.commentsCount > -1 && (
            <Info>{`${data.commentsCount} Comments`}</Info>
          )}
        </DividerWrapper>
        {data.status && <StatusWrapper>{data.status}</StatusWrapper>}
      </FooterWrapper>
    </Wrapper>
  );
}
