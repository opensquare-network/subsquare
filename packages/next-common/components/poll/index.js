import React from "react";
import { useState } from "react";
import styled from "styled-components";
import Header from "./header";
import Options from "./options";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export default function Poll({ poll, votes, myVote }) {
  const [selectedOption, setSelectedOption] = useState("");
  if (!poll || !votes) {
    return null;
  }

  return (
    <Wrapper>
      <Header {...poll} />
      <Options
        {...poll}
        votes={votes}
        myVote={myVote}
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
      />
    </Wrapper>
  );
}
