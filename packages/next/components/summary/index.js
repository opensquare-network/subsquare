import styled from "styled-components";

import CountDown from "./countDown";

const Wrapper = styled.div`
  display: flex;
  > :not(:first-child) {
    margin-left: 16px;
  }
  @media screen and (max-width: 768px) {
    flex-direction: column;
    > :not(:first-child) {
      margin-left: 0;
      margin-top: 16px;
    }
  }
`;

const Card = styled.div`
  position: relative;
  background: #ffffff;
  border: 1px solid #ebeef4;
  box-shadow: 0px 6px 7px rgba(30, 33, 52, 0.02),
    0px 1.34018px 1.56354px rgba(30, 33, 52, 0.0119221),
    0px 0.399006px 0.465507px rgba(30, 33, 52, 0.00807786);
  border-radius: 6px;
  flex-grow: 1;
  height: 88px;
  padding: 26px 24px;
`;

const Title = styled.div`
  font-weight: bold;
  font-size: 12px;
  line-height: 100%;
  letter-spacing: 0.16em;
  color: #9da9bb;
  margin-bottom: 8px;
`;

const Content = styled.div`
  font-weight: bold;
  font-size: 16px;
  line-height: 100%;
  color: #1e2134;
  > .unit {
    color: #9da9bb;
  }
  > :not(:first-child) {
    margin-left: 4px;
  }
`;

const CountDownWrapper = styled.div`
  position: absolute;
  top: 20px;
  right: 24px;
`;

export default function Summary() {
  return (
    <Wrapper>
      <Card>
        <Title>AVAILABLE</Title>
        <Content>
          <span>292993.444</span>
          <span className="unit">KAR</span>
        </Content>
      </Card>
      <Card>
        <Title>NEXT BURN</Title>
        <Content>
          <span>993.9696</span>
          <span className="unit">KAR</span>
        </Content>
      </Card>
      <Card>
        <Title>SPEND PERIOD</Title>
        <Content>
          <span>24</span>
          <span className="unit">days</span>
          <span>24</span>
          <span className="unit">hrs</span>
        </Content>
        <CountDownWrapper>
          <CountDown percent={25} />
        </CountDownWrapper>
      </Card>
    </Wrapper>
  );
}
