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
  color: #1E2134;
`;

function Option({ text, votes }) {
  return (
    <OptionWrapper>
      <Title>{text}</Title>

    </OptionWrapper>
  );
}

export default function PollOptions({ options, votes, anonymous }) {
  return (
    <Wrapper>
      {options.map((option, index) => (
        <Option index={index} text={option} votes={votes} />
      ))}
    </Wrapper>
  )
}
