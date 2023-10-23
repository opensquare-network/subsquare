import React from "react";

import styled from "styled-components";
import Loading from "../loading";

const Wrapper = styled.div`
  display: flex;
  flex-grow: 1;
  padding: 15px 16px;
  min-height: 38px;
  font-size: 14px;
  line-height: 20px;
  font-weight: 500;
  justify-content: center;
`;

export default function LoadingVotingStatus() {
  return (
    <Wrapper>
      <Loading size={14} />
    </Wrapper>
  );
}
