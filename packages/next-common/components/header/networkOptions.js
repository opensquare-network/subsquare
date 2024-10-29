import styled from "styled-components";
import React from "react";
import NetworkOptionGroup from "./networkOptionGroup";
import MenuGroups from "../../utils/consts/settings/menuGroups";
import { NeutralPanel } from "../styled/containers/neutralPanel";

const Options = styled(NeutralPanel)`
  position: absolute;
  border-width: 1px;
  border-style: solid;
  color: var(--textPrimary);
  border-radius: 8px;
  display: flex;
  gap: 8px;
  padding: 8px;
  flex-direction: column;
  width: 560px;
  box-shadow: var(--shadow200);
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
        groupName={MenuGroups.WestendAndParachains}
        activeNode={activeNode}
        setShow={setShow}
      />
      <NetworkOptionGroup
        groupName={MenuGroups.Solochain}
        activeNode={activeNode}
        setShow={setShow}
      />
      <NetworkOptionGroup
        groupName={MenuGroups.Testnet}
        activeNode={activeNode}
        setShow={setShow}
      />
    </Options>
  );
}
