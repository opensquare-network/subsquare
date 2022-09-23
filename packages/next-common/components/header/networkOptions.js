import styled from "styled-components";
import React from "react";
import { nodes } from "../../utils/constants";
import { shadow_200 } from "../../styles/componentCss";
import NetworkOptionGroup from "./networkOptionGroup";

const Options = styled.div`
  position: absolute;
  background: ${(props) => props.theme.neutral};
  border-width: ${(props) => (props.theme.isDark ? 1 : 0)}px;
  border-style: ${(props) => (props.theme.isDark ? "solid" : "none")};
  border-color: ${(props) => props.theme.grey200Border};
  color: ${(props) => props.theme.textPrimary};
  ${shadow_200};
  border-radius: 4px;
  display: flex;
  gap: 8px;
  padding: 8px;
  @media screen and (max-width: 768px) {
    width: 100% !important;
    padding: 8px 0;
  }
  @media screen and (max-width: 1280px) {
    flex-direction: column;
    width: 384px;
  }
  margin-top: 4px;
  right: 0;
  z-index: 999999;
`;

export default function NetworkOptions({ activeNode }) {
  return (
    <Options>
      <NetworkOptionGroup
        groupName={"Polkadot & Parachains"}
        nodes={nodes.filter(({group}) => group === "polkadot")}
        activeNode={activeNode}
      />
      <NetworkOptionGroup
        groupName={"Kusama & Parachains"}
        nodes={nodes.filter(({group}) => group === "kusama")}
        activeNode={activeNode}
      />
      <NetworkOptionGroup
        groupName={"Mainnet"}
        nodes={nodes.filter(({group}) => group === "mainnet")}
        activeNode={activeNode}
      />
    </Options>
  );
}
