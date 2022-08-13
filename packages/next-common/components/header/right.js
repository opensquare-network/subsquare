import React, { memo } from "react";
import styled from "styled-components";
import Flex from "../styled/flex";
import HeaderAccount from "./headerAccount";
import NetworkSwitch from "./networkSwitch";
import NodeSwitch from "./nodeSwitch";
import { nodes } from "../../utils/constants";

const Right = styled(Flex)`
  > :not(:first-child) {
    margin-left: 12px;
  }
  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const NetworkWrapper = styled.div``;

function HeaderRight({ user, chain }) {
  const node = nodes.find((n) => n.value === chain) || nodes[0];

  return (
    <Right>
      <HeaderAccount user={user} chain={chain} />
      <NetworkWrapper>
        <NetworkSwitch activeNode={node} />
      </NetworkWrapper>
      <NodeSwitch small chain={chain} node={node} />
    </Right>
  );
}

export default memo(HeaderRight);
