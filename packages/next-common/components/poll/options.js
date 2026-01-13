import React from "react";
import styled, { css } from "styled-components";
import CheckedSvg from "./checked.svg";
import VoterList from "./votersList";
import { GreyPanel } from "../styled/containers/greyPanel";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const OptionWrapper = styled(GreyPanel)`
  justify-content: space-between;
  padding: 12px 16px;
  color: var(--textPrimary);
  ${(p) =>
    p.selectable &&
    css`
      cursor: pointer;
      :hover {
        background: var(--neutral300);
      }
    `}
  ${(p) =>
    p.selected &&
    css`
      background: var(--theme100);
      color: var(--theme500);
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
  color: var(--textSecondary);
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
  color: var(--textPrimary);
`;

function Option({
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
      {!anonymous && <VoterList voters={votes} />}
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
}) {
  const totalVotesCount = Object.values(votes || {})
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
        />
      ))}
      <TotalVotes>{`Total ${totalVotesCount} votes`}</TotalVotes>
    </Wrapper>
  );
}
