import React from "react";

import styled from "styled-components";
import { StatusWrapper } from "./styled";
import Loading from "../loading";

const LoadingWrapper = styled.div`
  display: flex;
  flex-grow: 1;
  justify-content: center;
`;

export default function LoadingVotingStatus() {
  return (
    <StatusWrapper>
      <LoadingWrapper>
        <Loading size={14} />
      </LoadingWrapper>
    </StatusWrapper>
  )
}
