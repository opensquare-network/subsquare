import React, { Fragment } from "react";
import SubScanLink from "./subscanLink";
import isEmpty from "lodash.isempty";
import Statescan from "./statescan";
import Flex from "../styled/flex";
import styled from "styled-components";
import { useChainSettings } from "next-common/context/chain";

const Wrapper = styled(Flex)`
  height: 20px;
`;

export default function ExplorerLink({ indexer = {}, style = {}, children }) {
  const { noSubscan, hasStatescan } = useChainSettings();

  if (isEmpty(indexer)) {
    return null;
  }

  let LinkComponent = Fragment;
  if (!noSubscan) {
    LinkComponent = SubScanLink;
  } else if (hasStatescan) {
    LinkComponent = Statescan;
  }

  return (
    <Wrapper style={style}>
      <LinkComponent indexer={indexer}>{children}</LinkComponent>
    </Wrapper>
  );
}
