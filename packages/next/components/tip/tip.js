import styled, { css } from "styled-components";
import Link from "next/link";

import User from "components/user";
import { timeDuration } from "utils";

const Wrapper = styled.div`
  background: #ffffff;
  border: 1px solid #ebeef4;
  box-shadow: 0px 6px 7px rgba(30, 33, 52, 0.02),
    0px 1.34018px 1.56354px rgba(30, 33, 52, 0.0119221),
    0px 0.399006px 0.465507px rgba(30, 33, 52, 0.00807786);
  border-radius: 6px;
  padding: 24px;
  :hover {
    box-shadow: 0px 6px 22px rgba(30, 33, 52, 0.11),
      0px 1.34018px 4.91399px rgba(30, 33, 52, 0.0655718),
      0px 0.399006px 1.46302px rgba(30, 33, 52, 0.0444282);
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
  margin-bottom: 12px;
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
  margin: 16px 0;
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
  background: #1e2134;
  color: #ffffff;
  font-weight: 500;
  font-size: 12px;
  padding: 0 8px;
  ${(p) =>
  p.color &&
  css`
      background: ${p.color};
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
    case "Council":
      return "#E81F66";
    case "Treasury":
      return "#FF9800";
    default:
      return null;
  }
};

export default function Tip({ data, chain }) {
  return (
    <Wrapper>
      <Link href={`/${chain}/tip/${data.height}`}>
        <Title>{data.title}</Title>
      </Link>
      <DividerWrapper>
        {data.index && <Index>{`#${data.index}`}</Index>}
        {data.time && <Info>{`Updated ${timeDuration(data.time)}`}</Info>}
        {data.comments > -1 && <Info>{`${data.comments} Comments`}</Info>}
      </DividerWrapper>
      <Divider />
      <FooterWrapper>
        <DividerWrapper>
          <User user={data.author} chain={chain} />
          {data.type && (
            <div>
              <TypeWrapper color={getTypeColor(data.type)}>
                {data.type}
              </TypeWrapper>
            </div>
          )}
        </DividerWrapper>
        {data.status && <StatusWrapper>{data.status}</StatusWrapper>}
      </FooterWrapper>
    </Wrapper>
  );
}
