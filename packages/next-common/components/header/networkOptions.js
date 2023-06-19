import styled from "styled-components";
import React from "react";
import NetworkOptionGroup from "./networkOptionGroup";
import MenuGroups from "../../utils/consts/settings/menuGroups";
import { NeutralPanel } from "../styled/containers/neutralPanel";

const Options = styled(NeutralPanel)`
  position: absolute;
  border-width: ${(props) => (props.theme.isDark ? 1 : 0)}px;
  border-style: ${(props) => (props.theme.isDark ? "solid" : "none")};
  color: var(--textPrimary);
  border-radius: 4px;
  display: flex;
  gap: 8px;
  padding: 8px;
  flex-direction: column;
  width: 384px;
  @media screen and (max-width: 768px) {
    width: 100% !important;
    padding: 8px 0;
  }
  margin-top: 4px;
  right: 0;
  z-index: 999999;
`;

export default function NetworkOptions({ activeNode, setShow }) {
  return (
    <Options>
      <NetworkOptionGroup
        groupName={MenuGroups.PolkadotAndParachains}
        activeNode={activeNode}
        setShow={setShow}
      />
      <NetworkOptionGroup
        groupName={MenuGroups.KusamaAndParachains}
        activeNode={activeNode}
        setShow={setShow}
      />
      <NetworkOptionGroup
        groupName={MenuGroups.Solochain}
        activeNode={activeNode}
        setShow={setShow}
      />
    </Options>
  );
}
