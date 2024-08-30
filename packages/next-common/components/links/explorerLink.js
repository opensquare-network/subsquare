import React, { Fragment } from "react";
import styled from "styled-components";
import { isEmpty } from "lodash-es";
import SubScanLink from "./subscanLink";
import StatescanLink from "./statescanLink";
import Flex from "../styled/flex";
import { useChainSettings } from "next-common/context/chain";
import PolkascanLink from "./polkascanLink";

const Wrapper = styled(Flex)`
  height: 20px;
`;

export default function ExplorerLink({ indexer = {}, style = {}, children }) {
  const { hasSubscan, hasStatescan, hasPolkascan } = useChainSettings();

  if (isEmpty(indexer)) {
    return null;
  }

  let LinkComponent = Fragment;
  if (hasSubscan) {
    LinkComponent = SubScanLink;
  } else if (hasStatescan) {
    LinkComponent = StatescanLink;
  } else if (hasPolkascan) {
    LinkComponent = PolkascanLink;
  }

  return (
    <Wrapper style={style}>
      <LinkComponent indexer={indexer}>{children}</LinkComponent>
    </Wrapper>
  );
}
