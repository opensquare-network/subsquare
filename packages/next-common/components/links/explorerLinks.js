import React from "react";
import styled from "styled-components";
import Flex from "../styled/flex";
import SubScanLink from "./subscanLink";
import isEmpty from "lodash.isempty";
import StatescanLink from "./statescanLink";

const Wrapper = styled(Flex)`
  height: 20px;

  > :not(:first-child) {
    margin-left: 8px;
  }
`;

export default function ExplorerLinks({ indexer = {}, style = {}, children }) {
  if (isEmpty(indexer)) {
    return null;
  }

  return (
    <Wrapper style={style}>
      <SubScanLink indexer={indexer}>{children}</SubScanLink>
      <StatescanLink indexer={indexer}>{children}</StatescanLink>
    </Wrapper>
  );
}
