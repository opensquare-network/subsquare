import styled, { css } from "styled-components";

const Wrapper = styled.div`
  background: #ffffff;
  border: 1px solid #ebeef4;
  box-shadow: 0px 6px 7px rgba(30, 33, 52, 0.02),
    0px 1.34018px 1.56354px rgba(30, 33, 52, 0.0119221),
    0px 0.399006px 0.465507px rgba(30, 33, 52, 0.00807786);
  border-radius: 4px;
  padding: 48px;
  @media screen and (max-width: 600px) {
    padding: 24px;
    margin: 0 -16px;
  }
`;

const DividerWrapper = styled.div`
  display: flex;
  align-items: center;
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
  font-weight: 500;
  font-size: 16px;
  margin-top: 8px;
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

const Author = styled.div`
  display: flex;
  align-items: center;
  > img {
    height: 20px;
    width: 20px;
    margin-right: 8px;
  }
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

const TextWrapper = styled.div`
  height: 160px;
  background: #f6f7fa;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 24px;
`;

const DividerSecond = styled.div`
  height: 1px;
  background: #ebeef4;
  margin: 48px 0;
`;

const Label = styled.div`
  font-weight: bold;
  font-size: 16px;
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

export default function DetailItem({ data }) {
  return (
    <Wrapper>
      <DividerWrapper>
        {data.index && <Index>{`#${data.index}`}</Index>}
        {data.time && <Info>{`Posted ${data.time} ago`}</Info>}
        {data.comments && <Info>{`${data.comments} Comments`}</Info>}
      </DividerWrapper>
      <Title>{data.title}</Title>
      <Divider />
      <FooterWrapper>
        <DividerWrapper>
          <Author>
            <img src="/imgs/icons/avatar.svg" />
            <div>{data.author}</div>
          </Author>
          {data.type && (
            <div>
              <TypeWrapper color={getTypeColor(data.type)}>
                {data.type}
              </TypeWrapper>
            </div>
          )}
        </DividerWrapper>
        <StatusWrapper>{data.status}</StatusWrapper>
      </FooterWrapper>
      <TextWrapper>这里是文本</TextWrapper>
      <DividerSecond />
      <Label>On-chain Info</Label>
      <TextWrapper>这里可能是 table</TextWrapper>
    </Wrapper>
  );
}
