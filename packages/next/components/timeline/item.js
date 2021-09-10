import styled, { css } from "styled-components";

import Links from "./links";
import Voting from "./voting";
import Account from "components/account";
import User from "components/user";

const Wrapper = styled.div`
  display: flex;
  :last-child {
    .bar {
      display: none;
    }
  }
  ${(p) =>
    p.foldable &&
    css`
      :first-child {
        .fold-button {
          display: flex;
        }
      }
    `}
  ${(p) =>
    p.foldable &&
    p.isFold &&
    css`
      :not(:first-child) {
        display: none;
      }
      .bar {
        display: none;
      }
    `}
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
  background: ${(p) => p.color};
  border-radius: 2px;
  padding: 0 8px;
  font-weight: 500;
  font-size: 12px;
  color: #ffffff;
  margin-left: auto;
  height: 20px;
  line-height: 20px;
`;

const FoldButton = styled.div`
  display: none;
  height: 20px;
  width: 20px;
  border: 1px solid #e0e4eb;
  border-radius: 2px;
  margin-left: 8px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  > div {
    width: 14px;
    height: 14px;
    background: url("/imgs/icons/arrow-triangle-up.svg");
    ${(p) =>
      p.isFold &&
      css`
        background: url("/imgs/icons/arrow-triangle-down.svg");
      `}
  }
`;

const ContentWrapper = styled.div`
  margin-top: 4px;
`;

const ContentItem = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  word-wrap: break-word;
  > :first-child {
    color: #506176;
    padding: 7px 0;
  }
  > :last-child {
    padding: 7px 0;
    text-align: right;
  }
`;

const VoteResultWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  > :last-child {
    display: flex;
    align-items: center;
    > img {
      width: 14px;
      height: 14px;
      margin-left: 4px;
    }
  }
`;

export default function Item({ data, foldable, isFold, setIsFold, chain }) {
  return (
    <Wrapper foldable={foldable} isFold={isFold}>
      <Left>
        <Cirtcle />
        <Bar className="bar" />
      </Left>
      <Right>
        <TitleWrapper>
          <div>{data.time}</div>
          {data.status && data.status.value && (
            <Status color={data.status.color}>{data.status.value}</Status>
          )}
          <FoldButton
            className="fold-button"
            isFold={isFold}
            onClick={() => setIsFold(!isFold)}
          >
            <div />
          </FoldButton>
        </TitleWrapper>
        <ContentWrapper>
          {data.data &&
            Object.entries(data.data).map((item, index) => (
              <ContentItem key={index}>
                <div>{item[0]}</div>
                <div>{item[1]}</div>
              </ContentItem>
            ))}
        </ContentWrapper>
        {data.voting && <Voting data={data.voting} chain={chain} />}
        {data.voteResult && (
          <VoteResultWrapper>
            <User chain={chain} add={data.voteResult.name} fontSize={12} />
            {data.voteResult.value ? (
              <div>
                Aye
                <img src="/imgs/icons/approve.svg" />
              </div>
            ) : (
              <div>
                Nay
                <img src="/imgs/icons/reject.svg" />
              </div>
            )}
          </VoteResultWrapper>
        )}
        <Links chain={chain} indexer={data.indexer} />
      </Right>
    </Wrapper>
  );
}
