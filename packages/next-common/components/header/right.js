import React, { memo } from "react";
import styled from "styled-components";
import Flex from "../styled/flex";
import HeaderAccount from "./headerAccount";
import NetworkSwitch from "./networkSwitch";
import NodeSwitch from "./nodeSwitch";
import { nodes } from "../../utils/constants";
import { useChainSettings } from "../../context/chain";

const Right = styled(Flex)`
  > :not(:first-child) {
    margin-left: 12px;
  }
  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const NetworkWrapper = styled.div``;

function HeaderRight() {
  const node = useChainSettings();

  return (
    <Right>
      <HeaderAccount />
      <NetworkWrapper>
        <NetworkSwitch activeNode={node} />
      </NetworkWrapper>
      <NodeSwitch small />
    </Right>
  );
}

export default memo(HeaderRight);
