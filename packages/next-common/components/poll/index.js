import React from "react";
import styled from "styled-components";
import Header from "./header";
import Options from "./options";

const Wrapper = styled.div`
`;

export default function Poll({ poll, votes }) {
  console.log({ poll, votes });

  return (
    <Wrapper>
      <Header {...poll} />
      <Options {...poll} votes={votes} />
    </Wrapper>
  );
}
