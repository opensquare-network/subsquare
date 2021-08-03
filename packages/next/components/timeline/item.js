import styled from "styled-components";

import Links from "./links";
import Voting from "./voting";

const Wrapper = styled.div`
  display: flex;
`;

const Left = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 20px;
`;

const Cirtcle = styled.div`
  height: 12px;
  width: 12px;
  border: 3px solid #6848ff;
  border-radius: 50%;
  margin: 4px 0;
`;

const Bar = styled.div`
  width: 2px;
  background-color: #b4a3ff;
  margin: 0 auto;
  flex-grow: 1;
`;

const Right = styled.div`
  padding-bottom: 16px;
  flex-grow: 1;
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  > :first-child {
    font-weight: 500;
    font-size: 12px;
  }
`;

const Status = styled.div`
  background: #2196f3;
  border-radius: 2px;
  padding: 0 8px;
  font-weight: 500;
  font-size: 12px;
  color: #ffffff;
  margin-left: auto;
  height: 20px;
  line-height: 20px;
`;

const ContentWrapper = styled.div`
  margin-top: 4px;
`;

const ContentItem = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  > :first-child {
    color: #506176;
    min-width: 120px;
    padding: 7px 0;
  }
  > :last-child {
    padding: 7px 0;
    text-align: right;
  }
`;

export default function Item({ data }) {
  return (
    <Wrapper>
      <Left>
        <Cirtcle />
        <Bar />
      </Left>
      <Right>
        <TitleWrapper>
          <div>{data.time}</div>
          <Status>{data.status}</Status>
        </TitleWrapper>
        <ContentWrapper>
          {Object.entries(data.data).map((item, index) => (
            <ContentItem key={index}>
              <div>{item[0]}</div>
              <div>{item[1]}</div>
            </ContentItem>
          ))}
        </ContentWrapper>
        <Voting />
        <Links />
      </Right>
    </Wrapper>
  );
}
