import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const OptionWrapper = styled.div`
  display: flex;
`;

const Title = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 100%;
  color: #1e2134;
`;

const VotesCount = styled.div``;

const VotesPrecent = styled.div``;

function Option({ text, votes, anonymous, totalVotesCount }) {
  const count = anonymous ? votes : votes.length;
  const precent = count / totalVotesCount;
  return (
    <OptionWrapper>
      <Title>{text}</Title>
      <VotesCount>{count}</VotesCount>
      <VotesPrecent>{precent}</VotesPrecent>
    </OptionWrapper>
  );
}

export default function PollOptions({ options, votes, anonymous }) {
  const totalVotesCount = Object.values(votes)
    .map((item) => (anonymous ? item.length : item))
    .reduce((prev, curr) => prev + curr, 0);

  return (
    <Wrapper>
      {options.map((option, index) => (
        <Option
          key={index}
          text={option}
          votes={votes[options]}
          anonymous={anonymous}
          totalVotesCount={totalVotesCount}
        />
      ))}
    </Wrapper>
  );
}
