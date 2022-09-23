import styled from "styled-components";
import React from "react";
import { shadow_200 } from "../../styles/componentCss";
import NetworkOptionGroup from "./networkOptionGroup";
import MenuGroups from "../../utils/consts/settings/menuGroups";

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

export default function NetworkOptions({ activeNode }) {
  return (
    <Options>
      <NetworkOptionGroup
        groupName={MenuGroups.PolkadotAndParachains}
        activeNode={activeNode}
      />
      <NetworkOptionGroup
        groupName={MenuGroups.KusamaAndParachains}
        activeNode={activeNode}
      />
      <NetworkOptionGroup
        groupName={MenuGroups.Solochain}
        activeNode={activeNode}
      />
    </Options>
  );
}
