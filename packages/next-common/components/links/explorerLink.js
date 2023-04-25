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

  let ExplorerLinkWrapper = Fragment;
  if (!noSubscan) {
    ExplorerLinkWrapper = SubScanLink;
  } else if (hasStatescan) {
    ExplorerLinkWrapper = Statescan;
  }

  return (
    <Wrapper style={style}>
      <ExplorerLinkWrapper indexer={indexer}>{children}</ExplorerLinkWrapper>
    </Wrapper>
  );
}
