import React, { Fragment } from "react";
import styled from "styled-components";
import { isEmpty } from "lodash-es";
import SubScanLink from "./subscanLink";
import StatescanLink from "./statescanLink";
import Flex from "../styled/flex";
import { useChainSettings } from "next-common/context/chain";

const Wrapper = styled(Flex)`
  height: 20px;
`;

export default function ExplorerLink({ indexer = {}, style = {}, children }) {
  const { integrations } = useChainSettings();

  if (isEmpty(indexer)) {
    return null;
  }

  let LinkComponent = Fragment;
  if (integrations?.statescan) {
    LinkComponent = StatescanLink;
  } else if (integrations?.subscan) {
    LinkComponent = SubScanLink;
  }

  return (
    <Wrapper style={style}>
      <LinkComponent indexer={indexer}>{children}</LinkComponent>
    </Wrapper>
  );
}
