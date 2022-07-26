import React from "react";
import styled, { css } from "styled-components";
import CheckedSvg from "./checked.svg";
import VoterList from "./votersList";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const OptionWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 16px;
  background: ${(props) => props.theme.grey100Bg}
  border-radius: 4px;
  color: ${(props) => props.theme.textPrimary};
  ${(p) =>
    p.selectable &&
    css`
      cursor: pointer;
      :hover {
        background: #ebeef4;
      }
    `}
  ${(p) =>
    p.selected &&
    css`
      background: #f5f2ff;
      color: #6848ff;
    `}
  ${(props) =>
    props?.theme.isDark &&
    css`
      border-color: #363a4d;
      color: white;
      :hover {
        background: #272a3a;
      }
    `}
  ${(p) =>
    p.selected &&
    p?.theme === "dark" &&
    css`
      background: #272a3a;
      color: #6848ff;
    `}
`;

const Title = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 100%;
  word-break: break-word;
`;

const StatsNumbers = styled.div`
  display: flex;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 100%;
  color: ${(props) => props.theme.textSecondary};
  gap: 8px;
`;

const Checked = styled.div`
  display: flex;
  align-items: center;
  justify-content: right;
  width: 60px;
`;

const VotesCount = styled.div`
  display: flex;
  align-items: center;
  justify-content: right;
  width: 80px;
`;

const VotesPrecent = styled.div`
  display: flex;
  align-items: center;
  justify-content: right;
  width: 60px;
`;

const TotalVotes = styled.div`
  display: flex;
  justify-content: right;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: ${(props) => props.theme.textPrimary};
`;

function Option({
  chain,
  option,
  votes,
  myVote,
  anonymous,
  totalVotesCount,
  selected,
  selectable,
  onClick = () => {},
}) {
  const count = (anonymous ? votes : votes?.length) || 0;
  const precent =
    totalVotesCount === 0 ? 0 : parseInt((count / totalVotesCount) * 100);
  return (
    <div>
      <OptionWrapper
        selectable={selectable}
        selected={selected}
        onClick={() => selectable && onClick(option)}
      >
        <Title>{option}</Title>
        <StatsNumbers>
          <Checked>{option === myVote && <CheckedSvg />}</Checked>
          <VotesCount>{count}</VotesCount>
          <VotesPrecent>{precent}%</VotesPrecent>
        </StatsNumbers>
      </OptionWrapper>
      {!anonymous && <VoterList voters={votes} chain={chain} />}
    </div>
  );
}

export default function PollOptions({
  options,
  votes,
  myVote,
  anonymous,
  selectedOption,
  setSelectedOption,
  selectable,
  chain,
}) {
  const totalVotesCount = Object.values(votes)
    .map((item) => (anonymous ? item : item.length))
    .reduce((prev, curr) => prev + curr, 0);

  return (
    <Wrapper>
      {options.map((option, index) => (
        <Option
          key={index}
          option={option}
          votes={votes[option]}
          myVote={myVote?.option}
          anonymous={anonymous}
          totalVotesCount={totalVotesCount}
          onClick={setSelectedOption}
          selected={selectedOption === option}
          selectable={selectable}
          chain={chain}
        />
      ))}
      <TotalVotes>{`Total ${totalVotesCount} votes`}</TotalVotes>
    </Wrapper>
  );
}
