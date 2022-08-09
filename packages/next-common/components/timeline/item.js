import React from "react";
import styled, { css } from "styled-components";
import Links from "../links";
import Voting from "./voting";
import User from "../user";
import Tag from "../tags/state/tag";
import Flex from "../styled/flex";
import { Approve, Reject } from "../icons";
import ArrowTriangleUp from "../../assets/imgs/icons/arrow-triangle-up.svg";

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
  border: 3px solid ${(props) => props.theme.primaryPurple500};
  border-radius: 50%;
  margin: 4px 0;
`;

const Bar = styled.div`
  width: 2px;
  background-color: ${(props) => props.theme.primaryPurple300};
  margin: 0 auto;
  flex-grow: 1;
`;

const Right = styled.div`
  padding-bottom: 16px;
  flex-grow: 1;
`;

const TitleWrapper = styled(Flex)`
  > :first-child {
    font-weight: 500;
    font-size: 12px;
  }
`;

const TagWrapper = styled.div`
  margin-left: auto;
`;

const FoldButton = styled.div`
  display: none;
  height: 20px;
  width: 20px;
  border: 1px solid ${(props) => props.theme.grey300Border};
  border-radius: 4px;
  margin-left: 8px;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  > svg {
    ${(p) =>
      p.isFold &&
      css`
        transform: rotate(180deg);
      `}
    path {
      fill: ${(props) => props.theme.textPrimary};
    }
  }
`;

const ContentWrapper = styled.div`
  margin-top: 4px;
`;

const ContentItem = styled(Flex)`
  align-items: flex-start !important;
  justify-content: space-between;
  word-break: break-word;
  font-size: 14px;
  > :first-child {
    color: ${(props) => props.theme.textSecondary};
    line-height: 28px;
    flex: 0 0 120px;
  }
  > :last-child {
    display: flex;
    padding-top: 4px;
    justify-content: flex-end;
    align-items: center;
    max-width: 50%;
    line-height: 19.6px;
    text-align: right;
    flex: 1 1 auto;
  }
`;

const VoteResultWrapper = styled(Flex)`
  justify-content: space-between;
  > :last-child {
    display: flex;
    align-items: center;
    > span {
      margin-left: 4px;
    }
  }
`;

const LinkWrapper = styled(Flex)`
  margin-top: 8px;
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
            <TagWrapper>
              <Tag
                state={data.status.value}
                link={data.status?.link}
                category={data.status?.type}
              />
            </TagWrapper>
          )}
          <FoldButton
            className="fold-button"
            isFold={isFold}
            onClick={() => setIsFold(!isFold)}
          >
            <ArrowTriangleUp />
          </FoldButton>
        </TitleWrapper>

        <ContentWrapper>
          {data.data &&
            Object.entries(data.data).map((item, index) => (
              <ContentItem key={index}>
                <div>{item[0]}</div>
                <div>
                  {["boolean", "number", "string"].includes(typeof item[1]) ||
                  React.isValidElement(item[1])
                    ? item[1]
                    : JSON.stringify(item[1])}
                </div>
              </ContentItem>
            ))}
        </ContentWrapper>

        {data.voting && <Voting data={data.voting} chain={chain} />}
        {data.voteResult && (
          <VoteResultWrapper>
            <User chain={chain} add={data.voteResult.name} />
            {data.voteResult.value ? (
              <div>
                Aye
                <Approve />
              </div>
            ) : (
              <div>
                Nay
                <Reject />
              </div>
            )}
          </VoteResultWrapper>
        )}
        <LinkWrapper>
          <Links chain={chain} indexer={data.indexer} />
        </LinkWrapper>
      </Right>
    </Wrapper>
  );
}
