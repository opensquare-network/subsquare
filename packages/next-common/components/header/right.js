import React, { memo } from "react";
import styled from "styled-components";
import Flex from "../styled/flex";
import HeaderAccount from "./headerAccount";
import NetworkSwitch from "./networkSwitch";
import NodeSwitch from "./nodeSwitch";
import { useChainSettings } from "../../context/chain";

const Right = styled(Flex)`
  > :not(:first-child) {
    margin-left: 12px;
  }
  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const NetworkWrapper = styled.div`
  width: 176px;
`;

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
